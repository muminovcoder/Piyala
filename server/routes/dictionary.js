const express = require('express');
const { z } = require('zod');
const router = express.Router();

// SECURE: Zod validation
const wordParamSchema = z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/);
const searchQuerySchema = z.object({
  type: z.enum(['ml', 'sp', 'syn', 'ant', 'rhy', 'trg', 'topic']).default('ml'),
  q: z.string().min(1).max(200),
});

// ===== CACHE (24h TTL) =====
const cache = {};
const CACHE_TTL = 86400000;

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  return null;
}

function setCache(key, data) {
  cache[key] = { data, ts: Date.now() };
}

// ===== FETCH HELPERS =====
async function fetchJson(url, options = {}, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000), ...options });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      if (i === retries) return null;
      await new Promise(r => setTimeout(r, 800 * (i + 1)));
    }
  }
  return null;
}

// ===== POS DETECTION (server-side, improved) =====
const BASE_WORD_EXCEPTIONS = {
  noun: ['engine','plane','milk','garden','sudden','happen','kitchen','human','woman','examine','determine','imagine','medicine','routine','dozen','doctrine','person','barren','sterling'],
  verb: ['open','listen','frighten','harden','soften','fasten','threaten'],
  adjective: ['clean','mean','lean','plain','human','heathen']
};

function detectPOS(word, dictMeaning) {
  const w = String(word).toLowerCase().trim();
  if (w.length < 2) return null;
  // Use dictionary-provided POS when available
  if (dictMeaning && dictMeaning.partOfSpeech && dictMeaning.partOfSpeech !== 'word') {
    return dictMeaning.partOfSpeech;
  }
  // Check base word exceptions
  for (const [pos, list] of Object.entries(BASE_WORD_EXCEPTIONS)) {
    if (list.includes(w)) return pos;
  }
  if (w.endsWith('tion') || w.endsWith('sion') || w.endsWith('ness') || w.endsWith('ment') || w.endsWith('ity') || w.endsWith('ence') || w.endsWith('ance') || w.endsWith('ism') || w.endsWith('dom') || w.endsWith('ship') || w.endsWith('tude') || w.endsWith('hood')) return 'noun';
  if (w.endsWith('ing') && w.length > 5) {
    const base = w.slice(0, -3);
    if (base.length <= 2) return 'verb';
    if (base.length >= 2 && base[base.length - 1] === base[base.length - 2]) return 'verb';
    if (/^(.*)(ck|tch|sh|th|ch)$/.test(base)) return 'verb';
    if (/^.*[aeiou][bcdfghjklmnpqrstvwxz]$/.test(base) && base.length >= 3) return 'verb';
    return 'adjective';
  }
  if (w.endsWith('ed') && w.length > 4 && !w.endsWith('eed')) {
    if (w.endsWith('ated') || w.endsWith('ized') || w.endsWith('ified')) return 'verb';
    return 'adjective';
  }
  if (w.endsWith('ous') || w.endsWith('ive') || w.endsWith('able') || w.endsWith('ible') || w.endsWith('ful') || w.endsWith('less') || w.endsWith('ish') || w.endsWith('ic') || w.endsWith('al') || w.endsWith('ent') || w.endsWith('ant') || w.endsWith('ary') || w.endsWith('ory')) return 'adjective';
  if (w.endsWith('ingly')) return 'adverb';
  if (w.endsWith('ly') && w.length > 4) return 'adverb';
  if (w.endsWith('ward') || w.endsWith('wise') || w.endsWith('ways')) return 'adverb';
  if (w.endsWith('ize') || w.endsWith('ise') || w.endsWith('ify') || w.endsWith('ate') || w.endsWith('en')) return 'verb';
  // Extra patterns present in client but not server
  if (w.endsWith('logy') || w.endsWith('graphy') || w.endsWith('tude') || w.endsWith('hood')) return 'noun';
  return null;
}

function getDominantPOS(meanings) {
  if (!meanings || !meanings.length) return 'word';
  const counts = {};
  meanings.forEach(m => { counts[m.partOfSpeech] = (counts[m.partOfSpeech] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || meanings[0]?.partOfSpeech || 'word';
}

function findBestMeaning(meanings, preferredPOS) {
  if (!meanings || !meanings.length) return null;
  if (preferredPOS) {
    const match = meanings.find(m => m.partOfSpeech === preferredPOS);
    if (match) return match;
  }
  if (preferredPOS === null) {
    const adj = meanings.find(m => m.partOfSpeech === 'adjective');
    if (adj) return adj;
    const noun = meanings.find(m => m.partOfSpeech === 'noun');
    if (noun) return noun;
  }
  return meanings[0];
}

// ===== API SOURCE 1: dictionaryapi.dev (no key) =====
async function fromDictapi(word) {
  const data = await fetchJson('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word));
  if (!data || !data[0]) return null;
  const entry = data[0];
  const meanings = entry.meanings || [];
  if (!meanings.length) return null;
  const detected = detectPOS(word, meanings[0]);
  const m = findBestMeaning(meanings, detected);
  if (!m) return null;
  const d = m.definitions?.[0] || {};
  const dominantPOS = getDominantPOS(meanings);
  return {
    word: entry.word,
    phonetic: entry.phonetics?.find(p => p.text)?.text || entry.phonetic || '',
    partOfSpeech: dominantPOS,
    definition: d.definition || '',
    example: d.example || '',
    synonyms: [...(d.synonyms || []), ...(m.synonyms || [])].slice(0, 8),
    antonyms: [...(d.antonyms || []), ...(m.antonyms || [])].slice(0, 6),
  };
}

// ===== API SOURCE 2: Wiktionary REST API (no key, Wikimedia) =====
async function fromWiktionary(word) {
  const data = await fetchJson('https://en.wiktionary.org/api/rest_v1/page/definition/' + encodeURIComponent(word));
  if (!data || !data.en) return null;
  const entry = data.en[0];
  if (!entry) return null;
  const def = entry.definitions?.[0] || {};
  return {
    word,
    phonetic: '',
    partOfSpeech: entry.partOfSpeech || 'word',
    definition: def.definition || '',
    example: (def.parsedExamples || [])[0]?.example || '',
    synonyms: [],
    antonyms: [],
  };
}

// ===== API SOURCE 3: OwlBot (needs OWLBOT_TOKEN env) =====
async function fromOwlbot(word) {
  const token = process.env.OWLBOT_TOKEN;
  if (!token) return null;
  const data = await fetchJson('https://owlbot.info/api/v4/dictionary/' + encodeURIComponent(word), {
    headers: { Authorization: 'Token ' + token }
  });
  if (!data || !data.pronunciation) return null;
  const d = data.definitions?.[0] || {};
  return {
    word: data.word || word,
    phonetic: data.pronunciation || '',
    partOfSpeech: d.type || 'word',
    definition: d.definition || '',
    example: d.example || '',
    synonyms: (d.synonyms || []).slice(0, 8),
    antonyms: (d.antonyms || []).slice(0, 6),
  };
}

// ===== API SOURCE 4: Wordnik (needs WORDNIK_KEY env) =====
async function fromWordnik(word) {
  const key = process.env.WORDNIK_KEY;
  if (!key) return null;
  const [defData, synData] = await Promise.all([
    fetchJson(`https://api.wordnik.com/v4/word.json/${encodeURIComponent(word)}/definitions?limit=1&includeRelated=true&useCanonical=true&includeTags=false&api_key=${key}`),
    fetchJson(`https://api.wordnik.com/v4/word.json/${encodeURIComponent(word)}/relatedWords?useCanonical=true&relationshipTypes=synonym,antonym&limitPerRelationshipType=8&api_key=${key}`)
  ]);
  if (!defData || !defData[0]) return null;
  const d = defData[0];
  const syns = [];
  const ants = [];
  if (synData) {
    for (const group of synData) {
      if (group.relationshipType === 'synonym') syns.push(...group.words);
      if (group.relationshipType === 'antonym') ants.push(...group.words);
    }
  }
  return {
    word: d.word || word,
    phonetic: '',
    partOfSpeech: d.partOfSpeech || 'word',
    definition: d.text || '',
    example: d.exampleUses?.[0]?.text || d.textProns?.[0]?.text || '',
    synonyms: syns.slice(0, 8),
    antonyms: ants.slice(0, 6),
  };
}

// ===== PARALLEL FETCH FROM ALL SOURCES =====
async function fetchAllSources(word) {
  const tasks = [fromDictapi(word), fromWiktionary(word), fromOwlbot(word), fromWordnik(word)];
  const results = await Promise.allSettled(tasks);
  const best = { score: 0, data: null };
  for (const r of results) {
    if (r.status !== 'fulfilled' || !r.value || !r.value.definition) continue;
    let score = 1;
    if (r.value.phonetic) score++;
    if (r.value.example) score++;
    if (r.value.synonyms?.length) score++;
    if (r.value.antonyms?.length) score++;
    if (score > best.score) { best.score = score; best.data = r.value; }
  }
  return best.data;
}

// ===== ROUTES =====
router.get('/lookup/:word', async (req, res) => {
  const wordParam = wordParamSchema.safeParse(req.params.word);
  if (!wordParam.success) {
    return res.status(400).json({ error: 'Invalid word format' });
  }
  const word = wordParam.data.toLowerCase().trim();

  const cached = getCached('lookup:' + word);
  if (cached) return res.json(cached);

  const result = await fetchAllSources(word) || { word, phonetic: '', partOfSpeech: 'word', definition: 'No definition available for "' + word + '"', example: '', synonyms: [], antonyms: [] };
  setCache('lookup:' + word, result);
  res.json(result);
});

router.get('/search', async (req, res) => {
  const parsed = searchQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid search parameters' });
  }
  const { type, q } = parsed.data;

  const cacheKey = 'search:' + type + ':' + q;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  const params = {};
  if (type === 'ml') params.ml = q;
  else if (type === 'sp') params.sp = q + '*';
  else if (type === 'syn') params.rel_syn = q;
  else if (type === 'ant') params.rel_ant = q;
  else if (type === 'rhy') params.rel_rhy = q;
  else if (type === 'trg') params.rel_trg = q;
  else if (type === 'topic') { params.ml = q; params.max = 100; }
  else params.ml = q;

  const data = await fetchJson('https://api.datamuse.com/words?' + new URLSearchParams({ ...params, max: params.max || 20 }));
  const words = (data || []).map(w => w.word);
  setCache(cacheKey, words);
  res.json(words);
});

module.exports = router;
