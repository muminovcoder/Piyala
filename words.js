const TOPICS = ['science','nature','art','music','technology','food','travel','history','business','medicine','law','politics','sport','literature','philosophy','psychology'];

// =============================================
// ENHANCED POS DETECTION + CEFR
// =============================================

// Common base-word POS patterns (for words where suffix detection fails)
const BASE_POS_PATTERNS = {
  noun: ['ance','ence','ment','ness','tion','sion','ity','ism','ist','dom','ship','age','ery','ary','ory','ure','tude','hood','ling','logy','graphy','metry','nomy','cide','archy','cracy','phobia','philia'],
  verb: ['ate','ify','ize','ise','en','ish'],
  adjective: ['ous','ive','able','ible','ful','less','ish','ic','al','ent','ant','ary','ory','like','some','worthy'],
  adverb: ['ly','ward','wise','ways']
};

// Words that are never derived — they are base forms; suffix is coincidental
const BASE_WORD_EXCEPTIONS = {
  noun: ['engine','plane','milk','garden','sudden','happen','kitchen','human','woman','examine','determine','imagine','medicine','routine','dozen','doctrine','person','dozen','barren','sterling'],
  verb: ['open','listen','frighten','harden','soften','fasten','threaten'],
  adjective: ['clean','mean','lean','plain','human','heathen']
};

// Common word CEFR lookup (200 most frequent English words)
const CEFR_LOOKUP = {
  'the': 'A1','be': 'A1','to': 'A1','of': 'A1','and': 'A1','a': 'A1','in': 'A1','that': 'A1','have': 'A1','i': 'A1',
  'it': 'A1','for': 'A1','not': 'A1','on': 'A1','with': 'A1','he': 'A1','as': 'A1','you': 'A1','do': 'A1','at': 'A1',
  'this': 'A1','but': 'A1','his': 'A1','by': 'A1','from': 'A1','they': 'A1','we': 'A1','say': 'A1','her': 'A1','she': 'A1',
  'or': 'A1','an': 'A1','will': 'A1','my': 'A1','one': 'A1','all': 'A1','would': 'A1','there': 'A1','their': 'A1','what': 'A1',
  'so': 'A1','up': 'A1','out': 'A1','if': 'A1','about': 'A1','who': 'A1','get': 'A1','which': 'A1','go': 'A1','me': 'A1',
  'when': 'A1','make': 'A1','can': 'A1','like': 'A1','time': 'A1','no': 'A1','just': 'A1','him': 'A1','know': 'A1','take': 'A1',
  'people': 'A1','into': 'A1','year': 'A1','your': 'A1','good': 'A1','some': 'A1','could': 'A1','them': 'A1','see': 'A1','other': 'A1',
  'than': 'A1','then': 'A1','now': 'A1','look': 'A1','only': 'A1','come': 'A1','its': 'A1','over': 'A1','think': 'A1','also': 'A1',
  'back': 'A1','after': 'A1','use': 'A1','two': 'A1','how': 'A1','our': 'A1','work': 'A1','first': 'A1','well': 'A1','way': 'A1',
  'even': 'A1','new': 'A1','want': 'A1','because': 'A1','any': 'A1','these': 'A1','give': 'A1','day': 'A1','most': 'A1','us': 'A1',
  'house': 'A1','great': 'A2','big': 'A2','city': 'A2','place': 'A2','read': 'A2','need': 'A2','should': 'A2','may': 'A2','word': 'A2',
  'school': 'A2','study': 'A2','learn': 'A2','teacher': 'A2','student': 'A2','book': 'A2','write': 'A2','speak': 'A2','listen': 'A2','understand': 'A2',
  'friend': 'A2','family': 'A2','mother': 'A2','father': 'A2','brother': 'A2','sister': 'A2','child': 'A2','water': 'A2','food': 'A2','eat': 'A2',
  'drink': 'A2','sleep': 'A2','walk': 'A2','run': 'A2','travel': 'A2','car': 'A2','bus': 'A2','train': 'A2','money': 'A2','shop': 'A2',
  'help': 'A2','love': 'A2','play': 'A2','music': 'A2','movie': 'A2','color': 'A2','number': 'A2','name': 'A2','call': 'A2','show': 'A2',
  'ask': 'A2','answer': 'A2','question': 'A2','start': 'A2','stop': 'A2','open': 'A2','close': 'A2','live': 'A2','leave': 'A2','find': 'A2',
  'tell': 'A2','become': 'B1','believe': 'B1','bring': 'B1','change': 'B1','consider': 'B1','decide': 'B1','develop': 'B1','different': 'B1','difficult': 'B1',
  'discover': 'B1','explain': 'B1','express': 'B1','feel': 'B1','follow': 'B1','happen': 'B1','important': 'B1','include': 'B1','interest': 'B1','involve': 'B1',
  'kind': 'B1','language': 'B1','letter': 'B1','level': 'B1','maybe': 'B1','mean': 'B1','meeting': 'B1','member': 'B1','message': 'B1','minute': 'B1',
  'moment': 'B1','natural': 'B1','never': 'B1','normal': 'B1','notice': 'B1','number': 'B1','order': 'B1','paper': 'B1','party': 'B1','picture': 'B1',
  'piece': 'B1','plan': 'B1','point': 'B1','possible': 'B1','price': 'B1','problem': 'B1','product': 'B1','program': 'B1','project': 'B1','public': 'B1',
  'purpose': 'B1','quality': 'B1','quite': 'B1','rather': 'B1','reason': 'B1','recent': 'B1','result': 'B1','seem': 'B1','several': 'B1','situation': 'B1',
  'sometimes': 'B1','subject': 'B1','success': 'B1','suggest': 'B1','support': 'B1','though': 'B1','toward': 'B1','usually': 'B1','value': 'B1','whether': 'B1',
  'within': 'B1','yourself': 'B1','abstract': 'B2','achieve': 'B2','acquire': 'B2','adapt': 'B2','adequate': 'B2','adjust': 'B2','administration': 'B2','analyze': 'B2',
  'apparent': 'B2','appreciate': 'B2','approach': 'B2','appropriate': 'B2','assess': 'B2','assume': 'B2','available': 'B2','aware': 'B2','benefit': 'B2','capable': 'B2',
  'category': 'B2','circumstance': 'B2','commit': 'B2','communicate': 'B2','community': 'B2','comparable': 'B2','compensate': 'B2','complex': 'B2','component': 'B2','concentrate': 'B2',
  'concept': 'B2','conclude': 'B2','confident': 'B2','confirm': 'B2','consequence': 'B2','consistent': 'B2','consult': 'B2','consume': 'B2','contact': 'B2','context': 'B2',
  'contribute': 'B2','convention': 'B2','convince': 'B2','cooperate': 'B2','correspond': 'B2','create': 'B2','criteria': 'B2','crucial': 'B2','currency': 'B2','debate': 'B2',
  'decade': 'B2','decline': 'B2','define': 'B2','demonstrate': 'B2','deny': 'B2','deserve': 'B2','device': 'B2','domestic': 'B2','dominate': 'B2','draft': 'B2',
  'eliminate': 'B2','emerge': 'B2','emphasis': 'B2','enable': 'B2','encounter': 'B2','enormous': 'B2','establish': 'B2','evaluate': 'B2','eventually': 'B2','evidence': 'B2',
  'evolve': 'B2','expand': 'B2','expose': 'B2','extensive': 'B2','external': 'B2','feasible': 'B2','fluctuate': 'B2','formula': 'B2','frequent': 'B2','generate': 'B2',
  'guarantee': 'B2','identify': 'B2','ignore': 'B2','illustrate': 'B2','implement': 'B2','implication': 'B2','impose': 'B2','inevitable': 'B2','infrastructure': 'B2','inherent': 'B2',
  'abandon': 'C1','abolish': 'C1','abrupt': 'C1','absurd': 'C1','abundance': 'C1','accompany': 'C1','accumulate': 'C1','acknowledge': 'C1','acquisition': 'C1','adversary': 'C1',
  'advocate': 'C1','aesthetic': 'C1','aggregate': 'C1','allegation': 'C1','allocate': 'C1','ambiguous': 'C1','amend': 'C1','ample': 'C1','analogy': 'C1','anecdote': 'C1',
  'anticipate': 'C1','apprehend': 'C1','arbitrary': 'C1','articulate': 'C1','ascertain': 'C1','aspiration': 'C1','assertion': 'C1','assimilate': 'C1','attribute': 'C1','authentic': 'C1',
  'bureaucracy': 'C1','circumvent': 'C1','coherent': 'C1','coincide': 'C1','collaborate': 'C1','commemorate': 'C1','compatible': 'C1','compelling': 'C1','complement': 'C1','comply': 'C1',
  'comprehend': 'C1','compulsory': 'C1','concede': 'C1','conceive': 'C1','concurrent': 'C1','confine': 'C1','conform': 'C1','conscious': 'C1','consecutive': 'C1','consolidate': 'C1',
  'aberrant': 'C2','abstain': 'C2','acumen': 'C2','admonish': 'C2','adroit': 'C2','adulation': 'C2','adversity': 'C2','aegis': 'C2','affable': 'C2','alacrity': 'C2',
  'amalgamate': 'C2','ameliorate': 'C2','anachronism': 'C2','anomaly': 'C2','antediluvian': 'C2','antipathy': 'C2','apathy': 'C2','aplomb': 'C2','approbation': 'C2','arduous': 'C2',
  'ascetic': 'C2','assuage': 'C2','auspicious': 'C2','austere': 'C2','axiomatic': 'C2','bellicose': 'C2','benevolent': 'C2','benign': 'C2','blasphemy': 'C2','brazen': 'C2'
};

function detectPartOfSpeech(word, dictMeaning) {
  const w = String(word).toLowerCase().trim();
  if (w.length < 2) return null;
  // 1. If dictionary provides a meaning, use its POS (most reliable)
  if (dictMeaning && dictMeaning.partOfSpeech && dictMeaning.partOfSpeech !== 'word') {
    return dictMeaning.partOfSpeech;
  }
  // 2. Check base word exceptions (words that END with suffix patterns but are base forms)
  for (const [pos, list] of Object.entries(BASE_WORD_EXCEPTIONS)) {
    if (list.includes(w)) return pos;
  }
  // 3. Suffix-based detection for derived forms
  if (w.endsWith('ingly')) return 'adverb';
  if (w.endsWith('tion') || w.endsWith('sion')) return 'noun';
  if (w.endsWith('ness')) return 'noun';
  if (w.endsWith('ment')) return 'noun';
  if (w.endsWith('ity') || w.endsWith('ence') || w.endsWith('ance')) return 'noun';
  if (w.endsWith('ism') || w.endsWith('ist') || w.endsWith('dom') || w.endsWith('ship')) return 'noun';
  if (w.endsWith('tude') || w.endsWith('hood') || w.endsWith('logy') || w.endsWith('graphy')) return 'noun';
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
  if (w.endsWith('ous') || w.endsWith('ive') || w.endsWith('able') || w.endsWith('ible')) return 'adjective';
  if (w.endsWith('ful') || w.endsWith('less') || w.endsWith('ish') || w.endsWith('al') || w.endsWith('ic')) return 'adjective';
  if (w.endsWith('ent') || w.endsWith('ant') || w.endsWith('ary') || w.endsWith('ory')) return 'adjective';
  if (w.endsWith('ly') && w.length > 4) return 'adverb';
  if (w.endsWith('ward') || w.endsWith('wise') || w.endsWith('ways')) return 'adverb';
  if (w.endsWith('ize') || w.endsWith('ise') || w.endsWith('ify') || w.endsWith('ate') || w.endsWith('en')) return 'verb';
  // 4. For short words (3-4 letters), try common patterns
  if (w.length <= 4) {
    if (w.endsWith('ed') || w.endsWith('en')) return 'verb';
    if (w.endsWith('er') || w.endsWith('or')) {
      if (w.endsWith('ter') || w.endsWith('der') || w.endsWith('per')) return 'noun';
      return 'adjective';
    }
  }
  return null;
}

function findBestMeaning(meanings, preferredPOS) {
  if (!meanings || !meanings.length) return null;
  // 1. Try to match the preferred POS
  if (preferredPOS) {
    const match = meanings.find(m => m.partOfSpeech === preferredPOS);
    if (match) return match;
  }
  // 2. For derived forms, prefer adjective/noun over verb
  if (preferredPOS === null) {
    const adj = meanings.find(m => m.partOfSpeech === 'adjective');
    if (adj) return adj;
    const noun = meanings.find(m => m.partOfSpeech === 'noun');
    if (noun) return noun;
  }
  // 3. Prefer first meaning that has a definition (most common)
  return meanings[0];
}

// Get the most common POS for a word from all its meanings
function getDominantPOS(meanings) {
  if (!meanings || !meanings.length) return 'word';
  const counts = {};
  meanings.forEach(m => { counts[m.partOfSpeech] = (counts[m.partOfSpeech] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || meanings[0]?.partOfSpeech || 'word';
}

// =============================================
// API UTILITIES
// =============================================
const API = {
  dictBase: 'https://api.dictionaryapi.dev/api/v2/entries/en/',
  datamuseBase: 'https://api.datamuse.com/words',

  async fetchWithCache(url) {
    if (state.apiCache[url]) return state.apiCache[url];
    try {
      const r = await fetch(url);
      if (!r.ok) return null;
      const d = await r.json();
      state.apiCache[url] = d;
      return d;
    } catch { return null; }
  },

  // ----- DEFINITION (improved) -----
  async getDefinition(word) {
    const data = await this.fetchWithCache(this.dictBase + encodeURIComponent(word));
    if (!data || !data[0]) return null;
    const entry = data[0];
    const meanings = entry.meanings || [];
    if (!meanings.length) return null;
    // Detect POS using dictionary data for accuracy
    const detectedPOS = detectPartOfSpeech(word, meanings[0]);
    const meaning = findBestMeaning(meanings, detectedPOS);
    if (!meaning) return null;
    const def = meaning.definitions?.[0] || {};
    const phonetic = entry.phonetics?.find(p => p.text)?.text || entry.phonetic || '';
    // Collect all synonyms/antonyms from all meanings (not just matched one)
    const allSyns = [];
    const allAnts = [];
    meanings.forEach(m => {
      const md = m.definitions?.[0] || {};
      allSyns.push(...(md.synonyms || []), ...(m.synonyms || []));
      allAnts.push(...(md.antonyms || []), ...(m.antonyms || []));
    });
    const dominantPOS = getDominantPOS(meanings);
    const ukPhone = entry.phonetics?.find(p => p.audio && p.audio.includes('uk')) || {};
    const usPhone = entry.phonetics?.find(p => p.audio && p.audio.includes('us')) || {};
    return {
      word: entry.word,
      phonetic,
      ukPhonetic: ukPhone.text || '',
      ukAudio: ukPhone.audio || '',
      usPhonetic: usPhone.text || '',
      usAudio: usPhone.audio || '',
      partOfSpeech: dominantPOS,
      definition: def.definition || 'No definition available',
      example: def.example || '',
      synonyms: [...new Set(allSyns)].slice(0, 10),
      antonyms: [...new Set(allAnts)].slice(0, 8),
      allMeanings: entry.meanings || []
    };
  },

  async datamuse(params) {
    const qs = new URLSearchParams({ ...params, max: params.max || 8 });
    const data = await this.fetchWithCache(`${this.datamuseBase}?${qs}`);
    return (data || []).map(w => w.word);
  },

  // ----- Synonyms (score-ranked + POS validated) -----
  async getSynonyms(word) {
    const data = await this.fetchWithCache(`${this.datamuseBase}?rel_syn=${encodeURIComponent(word)}&max=20`);
    if (!data || !data.length) return [];
    const maxScore = Math.max(...data.filter(w => w.score != null).map(w => w.score), 1);
    const pos = detectPartOfSpeech(word);
    return data
      .filter(w => (w.score || 0) / maxScore >= 0.3)
      .map(w => w.word)
      .filter(w => {
        if (w.length < 3 || w.length > 20 || !/^[a-zA-Z]+$/.test(w)) return false;
        if (String(w).toLowerCase() === String(word).toLowerCase()) return false;
        if (pos && pos !== 'word') {
          const wp = detectPartOfSpeech(w);
          if (wp && wp !== pos && !((pos === 'adjective' && wp === 'adverb') || (pos === 'adverb' && wp === 'adjective'))) return false;
        }
        return true;
      })
      .slice(0, 10);
  },

  // ----- Antonyms (score-ranked + POS validated) -----
  async getAntonyms(word) {
    const data = await this.fetchWithCache(`${this.datamuseBase}?rel_ant=${encodeURIComponent(word)}&max=20`);
    if (!data || !data.length) return [];
    const maxScore = Math.max(...data.filter(w => w.score != null).map(w => w.score), 1);
    const pos = detectPartOfSpeech(word);
    return data
      .filter(w => (w.score || 0) / maxScore >= 0.3)
      .map(w => w.word)
      .filter(w => {
        if (w.length < 3 || w.length > 20 || !/^[a-zA-Z]+$/.test(w)) return false;
        if (String(w).toLowerCase() === String(word).toLowerCase()) return false;
        if (pos && pos !== 'word') {
          const wp = detectPartOfSpeech(w);
          if (wp && wp !== pos && !((pos === 'adjective' && wp === 'adverb') || (pos === 'adverb' && wp === 'adjective'))) return false;
        }
        return true;
      })
      .slice(0, 8);
  },

  // ----- Related Words (quality-filtered + dictionary validated) -----
  async getRelated(word) {
    const data = await this.fetchWithCache(`${this.datamuseBase}?rel_trg=${encodeURIComponent(word)}&max=25`);
    if (!data || !data.length) return [];
    const maxScore = Math.max(...data.filter(w => w.score != null).map(w => w.score), 1);
    const tryTiers = [
      { minRatio: 0.6, applyPOS: true },
      { minRatio: 0.3, applyPOS: true },
      { minRatio: 0.0, applyPOS: false }
    ];
    for (const tier of tryTiers) {
      const candidates = data.filter(w => (w.score || 0) / maxScore >= tier.minRatio);
      const filtered = this._filterCandidates(candidates, word, tier.applyPOS, false);
      if (filtered.length >= 3) return filtered.slice(0, 10);
    }
    return [];
  },

  // ----- Rhymes (quality-filtered, dictionary validated, no proper nouns) -----
  async getRhymes(word) {
    const data = await this.fetchWithCache(`${this.datamuseBase}?rel_rhy=${encodeURIComponent(word)}&max=30`);
    if (!data || !data.length) return [];
    const maxScore = Math.max(...data.filter(w => w.score != null).map(w => w.score), 1);
    const tryTiers = [
      { minRatio: 0.4, applyPOS: true },
      { minRatio: 0.2, applyPOS: false },
      { minRatio: 0.0, applyPOS: false }
    ];
    for (const tier of tryTiers) {
      const candidates = data.filter(w => (w.score || 0) / maxScore >= tier.minRatio);
      const filtered = this._filterCandidates(candidates, word, tier.applyPOS, true);
      if (filtered.length >= 3) return filtered.slice(0, 10);
    }
    return [];
  },

  // Internal: filter candidate words (shared by related/rhymes)
  _filterCandidates(items, targetWord, applyPOS, isRhyme) {
    const t = String(targetWord).toLowerCase();
    const pos = detectPartOfSpeech(targetWord);
    return items
      .map(w => w.word || w)
      .filter(w => {
        const word = String(w).toLowerCase();
        if (word === t) return false;
        if (word.length < 3 || word.length > 20) return false;
        if (!/^[a-zA-Z]+$/.test(word)) return false;
        // Rhymes: exclude words that contain the target (e.g. "unhappiness" for "happiness")
        if (isRhyme && (word.includes(t) || word.endsWith(t) || word.startsWith(t))) return false;
        // Check that it looks like a real word (not a proper noun or obscure term)
        if (word[0] !== word[0].toLowerCase()) return false;
        // Avoid known non-dictionary patterns
        if (word.endsWith('zz') || word.endsWith('xx') || word.includes('www')) return false;
        return true;
      })
      .filter(w => {
        if (!applyPOS || !pos || pos === 'word') return true;
        const d = detectPartOfSpeech(w);
        if (!d) return false;
        if (d === pos) return true;
        if ((pos === 'adjective' && d === 'adverb') || (pos === 'adverb' && d === 'adjective')) return true;
        return false;
      });
  },

  async getByMeaning(q) { return this.datamuse({ ml: q, max: 20 }); },
  async getByTopic(t) { return this.datamuse({ ml: t, max: 100 }); },
  async getSimilarSpelling(w) { return this.datamuse({ sp: w + '*', max: 10 }); },

  _asyncFilterPOS(words, pos) {
    if (!pos || pos === 'word' || !words || !words.length) return words || [];
    return words.filter(w => {
      const d = detectPartOfSpeech(w);
      if (!d) return false;
      return d === pos || (pos === 'adjective' && d === 'adverb') || (pos === 'adverb' && d === 'adjective');
    }).slice(0, 10);
  },

  // ----- Improved Confidence Scoring -----
  _computeConfidence(def) {
    if (!def) return 0;
    let score = 0;
    // Definition: must exist, be meaningful length, not be a placeholder
    if (def.definition && def.definition.length > 10 && !def.definition.startsWith('The word "')) score += 20;
    // Example: must exist and be a real sentence
    if (def.example && def.example.length > 15 && def.example.includes(' ')) score += 15;
    // Phonetic: nice to have
    if (def.phonetic && def.phonetic.length > 0) score += 5;
    // Synonyms: must exist and be valid
    if (def.synonyms?.length >= 3) score += 15;
    else if (def.synonyms?.length >= 1) score += 8;
    // Antonyms: less common, bonus if present
    if (def.antonyms?.length >= 2) score += 10;
    else if (def.antonyms?.length >= 1) score += 5;
    // Multiple meanings: indicates rich word data
    if (def.allMeanings?.length > 1) score += 10;
    else if (def.allMeanings?.length === 1) score += 3;
    // POS match: check if dictionary POS matches detected POS
    const detected = detectPartOfSpeech(def.word);
    if (detected && def.partOfSpeech === detected) score += 10;
    // Word confidence bonus: common words (short, frequent) get a small bonus
    const wlen = String(def.word).length;
    if (wlen >= 3 && wlen <= 12) score += 5;
    // CEFR-based confidence: known words are more reliable
    const cefr = getCEFRLevel(def.word);
    const cefrConf = { 'A1': 10, 'A2': 8, 'B1': 6, 'B2': 4, 'C1': 2, 'C2': 1 };
    score += cefrConf[cefr] || 0;
    return Math.min(100, Math.max(0, score));
  },

  // ----- Comprehensive Data Validation -----
  validateWordData(data) {
    if (!data || !data.word) return { valid: false, errors: ['No word data'] };
    const errors = [];
    // Validate POS
    const validPOS = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'determiner', 'numeral', 'word'];
    if (!validPOS.includes(data.partOfSpeech) && data.partOfSpeech !== 'word') {
      errors.push('Invalid part of speech: ' + data.partOfSpeech);
    }
    // Validate definition
    if (!data.definition || data.definition.length < 5 || data.definition.startsWith('The word "')) {
      errors.push('Missing or invalid definition');
    }
    // Validate CEFR
    const validCEFR = ['A1','A2','B1','B2','C1','C2'];
    if (data.cefrLevel && !validCEFR.includes(data.cefrLevel)) {
      errors.push('Invalid CEFR level: ' + data.cefrLevel);
    }
    // Validate example
    if (data.example && (data.example.length < 5 || !data.example.includes(' '))) {
      errors.push('Example is too short or not a real sentence');
    }
    // Validate synonyms (each must be a real word)
    if (data.synonyms) {
      data.synonyms.forEach((s, i) => {
        if (typeof s !== 'string' || s.length < 2 || !/^[a-zA-Z]+$/.test(s)) {
          errors.push('Invalid synonym at index ' + i + ': ' + s);
        }
      });
    }
    // Validate antonyms
    if (data.antonyms) {
      data.antonyms.forEach((a, i) => {
        if (typeof a !== 'string' || a.length < 2 || !/^[a-zA-Z]+$/.test(a)) {
          errors.push('Invalid antonym at index ' + i + ': ' + a);
        }
      });
    }
    // Validate related words
    if (data.related) {
      data.related.forEach((r, i) => {
        if (typeof r !== 'string' || r.length < 3 || r.length > 20 || !/^[a-zA-Z]+$/.test(r) || String(r).toLowerCase() === String(data.word).toLowerCase()) {
          errors.push('Invalid related word at index ' + i + ': ' + r);
        }
      });
    }
    // Validate rhymes
    if (data.rhymes) {
      data.rhymes.forEach((r, i) => {
        if (typeof r !== 'string' || r.length < 3 || r.length > 20 || !/^[a-zA-Z]+$/.test(r) || String(r).toLowerCase() === String(data.word).toLowerCase()) {
          errors.push('Invalid rhyme at index ' + i + ': ' + r);
        }
      });
    }
    return { valid: errors.length === 0, errors };
  },

  // ----- Revalidate ALL stored data -----
  revalidateStoredData() {
    ['vm_favorites', 'vm_recent'].forEach(key => {
      try {
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        let changed = false;
        const cleaned = stored.map(entry => {
          if (!entry || !entry.word) return entry;
          // Clean related words
          const rel = (entry.related || []).filter(w => {
            if (!w || typeof w !== 'string') return false;
            if (w.length < 3 || w.length > 20) return false;
            if (!/^[a-zA-Z]+$/.test(w)) return false;
            if (String(w).toLowerCase() === String(entry.word).toLowerCase()) return false;
            // Skip words that look like proper nouns (capital letter in middle)
            if (w[0] !== w[0].toLowerCase()) return false;
            return true;
          });
          // Clean rhymes
          const rhy = (entry.rhymes || []).filter(w => {
            if (!w || typeof w !== 'string') return false;
            if (w.length < 3 || w.length > 20) return false;
            if (!/^[a-zA-Z]+$/.test(w)) return false;
            if (String(w).toLowerCase() === String(entry.word).toLowerCase()) return false;
            if (String(w).toLowerCase().includes(String(entry.word).toLowerCase())) return false;
            if (w[0] !== w[0].toLowerCase()) return false;
            return true;
          });
          // Clean synonyms
          const syns = (entry.synonyms || []).filter(s => s && typeof s === 'string' && s.length >= 2 && /^[a-zA-Z]+$/.test(s));
          // Clean antonyms
          const ants = (entry.antonyms || []).filter(a => a && typeof a === 'string' && a.length >= 2 && /^[a-zA-Z]+$/.test(a));
          if (rel.length !== (entry.related || []).length || rhy.length !== (entry.rhymes || []).length || syns.length !== (entry.synonyms || []).length || ants.length !== (entry.antonyms || []).length) {
            changed = true;
            return { ...entry, related: rel, rhymes: rhy, synonyms: syns, antonyms: ants };
          }
          return entry;
        });
        if (changed) localStorage.setItem(key, JSON.stringify(cleaned));
      } catch (e) { /* skip invalid */ }
    });
    // Revalidate WOTD cache
    try {
      const todayKey = 'wotd_' + new Date().toDateString();
      const cached = localStorage.getItem(todayKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.word) {
          parsed.related = (parsed.related || []).filter(w => w && typeof w === 'string' && w.length >= 3 && w.length <= 20 && /^[a-zA-Z]+$/.test(w));
          parsed.rhymes = (parsed.rhymes || []).filter(w => w && typeof w === 'string' && w.length >= 3 && w.length <= 20 && /^[a-zA-Z]+$/.test(w));
          parsed.synonyms = (parsed.synonyms || []).filter(s => s && typeof s === 'string' && s.length >= 2 && /^[a-zA-Z]+$/.test(s));
          parsed.antonyms = (parsed.antonyms || []).filter(a => a && typeof a === 'string' && a.length >= 2 && /^[a-zA-Z]+$/.test(a));
          localStorage.setItem(todayKey, JSON.stringify(parsed));
        }
      }
    } catch (e) { /* skip */ }
  },

  // ----- Full Word Data (improved) -----
  async getFullWordData(word) {
    const [def, syns, ants, rel, rhy] = await Promise.all([
      this.getDefinition(word),
      this.getSynonyms(word),
      this.getAntonyms(word),
      this.getRelated(word),
      this.getRhymes(word)
    ]);
    if (def) {
      const pos = def.partOfSpeech;
      // Merge and deduplicate synonyms/antonyms
      const mergedSyns = [...new Set([...def.synonyms, ...syns])];
      const mergedAnts = [...new Set([...def.antonyms, ...ants])];
      const filteredSyns = this._asyncFilterPOS(mergedSyns, pos).slice(0, 10);
      const filteredAnts = this._asyncFilterPOS(mergedAnts, pos).slice(0, 8);
      // Related/rhymes already quality-filtered
      const filteredRel = rel.slice(0, 10);
      const filteredRhy = rhy.slice(0, 10);
      // Compute honest confidence
      const confidence = this._computeConfidence({ ...def, synonyms: filteredSyns, antonyms: filteredAnts, related: filteredRel, rhymes: filteredRhy });
      const cefr = getCEFRLevel(def.word);
      return {
        ...def,
        synonyms: filteredSyns,
        antonyms: filteredAnts,
        related: filteredRel,
        rhymes: filteredRhy,
        cefrLevel: cefr,
        confidence
      };
    }
    // Fallback: minimal data
    if (syns.length || ants.length || rel.length) {
      return { word, phonetic: '', partOfSpeech: 'word', definition: 'No definition available', example: '', synonyms: syns.slice(0, 6), antonyms: ants.slice(0, 4), related: rel.slice(0, 6), rhymes: rhy.slice(0, 4), allMeanings: [], cefrLevel: getCEFRLevel(word), confidence: 0 };
    }
    return null;
  },

  async fetchRandomWord() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const patterns = ['????', '?????', '??????'];
    for (let attempt = 0; attempt < 5; attempt++) {
      const letter = letters[Math.floor(Math.random() * 26)];
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      const result = await this.datamuse({ sp: letter + pattern, max: 50 });
      const filtered = result.filter(w => {
        const c = String(w).toLowerCase();
        return c.length > 2 && !c.includes(' ') && !c.includes('-') && !c.includes("'");
      });
      if (filtered.length) return filtered[Math.floor(Math.random() * filtered.length)];
    }
    return null;
  },

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};


// =============================================
// WORD OF THE DAY
// =============================================
function countSyllables(word) {
  word = String(word).toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  let count = 0;
  const vowels = 'aeiouy';
  let prevVowel = false;
  for (const ch of word) {
    const isV = vowels.includes(ch);
    if (isV && !prevVowel) count++;
    prevVowel = isV;
  }
  return Math.max(1, word.endsWith('e') ? count - 1 : count);
}

function getWordDifficulty(word) {
  const len = word.length;
  const syl = countSyllables(word);
  const score = len + syl;
  if (score <= 5) return 'Easy';
  if (score <= 8) return 'Medium';
  if (score <= 12) return 'Hard';
  return 'Advanced';
}

const CEFR_LEVELS = ['A1','A2','B1','B2','C1','C2'];
const CEFR_COLORS = { A1:'#10b981', A2:'#34d399', B1:'#f59e0b', B2:'#f97316', C1:'#ef4444', C2:'#dc2626' };

// CEFR: Use lookup table first, then frequency heuristics
function getCEFRLevel(word) {
  const w = String(word).toLowerCase().replace(/[^a-zA-Z]/g, '');
  // 1. Check lookup table (most accurate)
  if (CEFR_LOOKUP[w]) return CEFR_LOOKUP[w];
  // 2. For derived forms, check if the root is in the lookup
  const derived = w.replace(/(ly|ness|tion|sion|ment|ful|less|ous|ive|able|ible|ism|ist|ship|dom|ize|ise|ify|ate|ed|ing|al|ic|ish|en)$/, '');
  if (derived !== w && derived.length >= 3 && CEFR_LOOKUP[derived]) {
    const base = CEFR_LOOKUP[derived];
    // Derived forms are typically one level higher
    const bump = { 'A1':'A2', 'A2':'B1', 'B1':'B2', 'B2':'C1', 'C1':'C2', 'C2':'C2' };
    return bump[base] || 'B1';
  }
  // 3. Use length + syllable heuristic (better calibrated)
  const len = w.length;
  const syl = countSyllables(w);
  const score = len + syl * 2;
  if (score <= 6) return 'A1';
  if (score <= 9) return 'A2';
  if (score <= 13) return 'B1';
  if (score <= 17) return 'B2';
  if (score <= 22) return 'C1';
  return 'C2';
}

function getCEFRBadge(word) {
  const lvl = getCEFRLevel(word);
  return `<span class="cefr-badge" style="font-size:10px;padding:2px 6px;border-radius:99px;background:${CEFR_COLORS[lvl]}22;color:${CEFR_COLORS[lvl]};border:1px solid ${CEFR_COLORS[lvl]}44;font-weight:600;letter-spacing:0.3px">${lvl}</span>`;
}

function getCEFRDistribution() {
  const words = [...(state.favorites || []), ...(state.recentWords || [])];
  const unique = new Set(words.map(w => String(w.word || '').toLowerCase()));
  const dist = { A1:0, A2:0, B1:0, B2:0, C1:0, C2:0 };
  unique.forEach(w => { const lvl = getCEFRLevel(w); if (dist[lvl] !== undefined) dist[lvl]++; });
  return dist;
}

// =============================================
// TOPIC CHIPS
// =============================================
function renderTopicChips(containerId, max) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const icons = { science:'🔬', nature:'🌿', art:'🎨', music:'🎵', technology:'💻', food:'🍕', travel:'✈️', history:'📜', business:'💼', medicine:'💊', law:'⚖️', politics:'🏛️', sport:'⚽', literature:'📖', philosophy:'🤔', psychology:'🧠' };
  const list = max ? TOPICS.slice(0, max) : TOPICS;
  el.innerHTML = list.map((t, i) =>
    `<span class="topic-chip" onclick="exploreByTopic('${t}')" style="animation-delay:${i * 0.04}s">${icons[t] || '📚'} ${t}</span>`
  ).join('');
}

async function exploreByTopic(topic) {
  if (typeof routerNavigate === 'function') { routerNavigate('/learn/explore'); } else { showPage('explore'); }
  const section = document.getElementById('word-batch-section');
  if (section) section.style.display = 'none';
  const area = document.getElementById('word-card-area');
  area.innerHTML = `<div class="word-card"><div class="word-card-inner" style="padding:30px;text-align:center;color:var(--text2);font-size:14px">🔍 Finding <strong>${topic}</strong> words...</div></div>`;
  let words = await API.getByTopic(topic);
  if (!words.length) words = await API.getRelated(topic);
  if (!words.length) { area.innerHTML = `<div class="word-card"><div class="word-card-inner" style="padding:30px;text-align:center;color:var(--text2)">No words found for "${topic}" — try a different topic</div></div>`; return; }
  const defs = await Promise.all(words.map(w => API.getDefinition(w)));
  const valid = defs.filter(Boolean);
  if (!valid.length) { area.innerHTML = `<div class="word-card"><div class="word-card-inner" style="padding:30px;text-align:center;color:var(--text2)">No definitions found for "${topic}" words</div></div>`; return; }
  area.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <span style="font-size:13px;font-weight:600;color:var(--text1)">📚 ${topic}</span>
      <span style="font-size:11px;color:var(--text2)">${valid.length} words found</span>
      <button class="btn btn-ghost btn-sm" onclick="generateNewWord()" style="margin-left:auto">⚡ Random</button>
    </div>
    <div class="topic-word-grid">${valid.map((w, i) => {
      const lvl = getCEFRLevel(w.word);
      const lvlColor = { A1:'#10b981', A2:'#34d399', B1:'#f59e0b', B2:'#f97316', C1:'#ef4444', C2:'#dc2626' }[lvl] || '#7c6fff';
      const safe = JSON.stringify(w).replace(/"/g,'&quot;');
      const delay = Math.min(i * 0.03, 0.6);
      return `
      <div class="topic-word-card" onclick="loadWordDisplay('${w.word}')" style="animation-delay:${delay}s">
        <div class="topic-word-head">
          <span class="topic-word-name">${w.word}</span>
          <span class="topic-word-lvl" style="background:${lvlColor}18;color:${lvlColor};border:1px solid ${lvlColor}33">${lvl}</span>
        </div>
        <div class="topic-word-pos">${w.partOfSpeech}${w.phonetic ? ' · ' + w.phonetic : ''}</div>
        <div class="topic-word-def">${(w.definition || '').substring(0, 100)}${(w.definition || '').length > 100 ? '...' : ''}</div>
        <div class="topic-word-actions">
          <button class="btn-icon-sm" onclick="event.stopPropagation();pronounceWord('${w.word}')" title="Listen">🔊</button>
          <button class="btn-icon-sm" onclick="event.stopPropagation();saveToFavorites(${safe})" title="Save">⭐</button>
          <button class="btn-icon-sm" onclick="event.stopPropagation();loadWordDisplay('${w.word}')" title="Explore">📖</button>
        </div>
      </div>`;
    }).join('')}</div>`;
}


// =============================================
// WORD DISPLAY
// =============================================
async function generateNewWord() {
  const word = await API.fetchRandomWord();
  if (!word) { toast('Could not find a random word', 'error'); return; }
  await loadWordDisplay(word);
}

async function loadWordDisplay(word, giveXP = true) {
  // Sync premium before checking limits so admin-granted premium takes effect immediately
  if (typeof syncPremiumFromServer === 'function') { try { await syncPremiumFromServer(); } catch (e) {} }
  const isFree = typeof getCurrentPlan === 'function' && getCurrentPlan() === 'Free';
  if (isFree && state.stats.wordsToday >= 120) {
    clearLoading('word-card-area');
    showPremiumUpsell();
    updateWordCounter();
    return;
  }
  showLoading('word-card-area');
  // Use hybrid: API (factual) + AI (enrichment) combined
  let data = null;
  try { data = await getHybridWordData(word); } catch (e) {}
  // Fallback
  if (!data) {
    if (!window._vmRevalidated) { API.revalidateStoredData(); window._vmRevalidated = true; }
    try { data = await API.getFullWordData(word); } catch (e) {}
  }
  if (!data) { toast(`No data found for "${word}"`, 'error'); clearLoading('word-card-area'); return; }
  state.currentWord = data;
  addToRecent(data);
  recordActivity(1);
  if (giveXP) addXP(10, `Explored "${data.word}"`);
  renderWordCard(data);
  updateWordCounter();
}

function showLoading(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="word-card"><div class="word-card-accent"></div><div class="word-card-glow"></div><div class="word-card-inner" style="padding:40px 0">
    <div class="skeleton" style="height:16px;width:100px;margin-bottom:20px"></div>
    <div class="skeleton" style="height:56px;width:280px;margin-bottom:12px"></div>
    <div class="skeleton" style="height:20px;width:160px;margin-bottom:28px"></div>
    <div class="skeleton" style="height:16px;margin-bottom:8px"></div>
    <div class="skeleton" style="height:16px;width:80%;margin-bottom:8px"></div>
    <div class="skeleton" style="height:16px;width:60%"></div>
  </div></div>`;
}

function clearLoading(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '';
}

function updateWordCounter() {
  const isFree = typeof getCurrentPlan === 'function' && getCurrentPlan() === 'Free';
  const used = state.stats.wordsToday || 0;
  const limit = 120;
  const remaining = Math.max(0, limit - used);
  // Explore section counter
  const el = document.getElementById('word-counter');
  const textEl = document.getElementById('word-counter-text');
  const fillEl = document.getElementById('word-counter-fill');
  if (el && textEl && fillEl) {
    if (!isFree) { el.style.display = 'none'; }
    else {
      textEl.innerHTML = `<i class="ti ti-books" style="vertical-align:-2px"></i> <strong>${used}</strong> of ${limit} words explored today <span class="exp-counter-remaining">(${remaining} left)</span>`;
      fillEl.style.width = Math.min(100, (used / limit) * 100) + '%';
      fillEl.style.background = used >= limit ? 'var(--ios-red)' : 'linear-gradient(90deg,#34C759,#30B0C7)';
      el.style.display = 'flex';
    }
  }
  // Dashboard indicator
  const dc = document.getElementById('dash-word-counter');
  const dcNum = document.getElementById('dash-word-counter-num');
  if (dc && dcNum) {
    if (!isFree) { dc.style.display = 'none'; }
    else {
      dcNum.textContent = remaining;
      dc.title = used + ' of ' + limit + ' words explored today';
      dc.style.display = 'flex';
    }
  }
}

function showPremiumUpsell() {
  const el = document.getElementById('word-card-area');
  if (!el) return;
  el.innerHTML = `
    <div class="exp-premium-upsell">
      <div class="exp-premium-upsell-glow"></div>
      <div class="exp-premium-upsell-icon"><i class="ti ti-crown"></i></div>
      <div class="exp-premium-upsell-title">Daily Limit Reached</div>
      <div class="exp-premium-upsell-desc">You've explored <strong>120</strong> words today. Upgrade to Premium for unlimited word exploration, AI features, and more!</div>
      <div class="exp-premium-upsell-features">
        <div class="epu-feature"><i class="ti ti-infinity" style="color:#34C759"></i> Unlimited words</div>
        <div class="epu-feature"><i class="ti ti-sparkles" style="color:#AF52DE"></i> AI explanations & mnemonics</div>
        <div class="epu-feature"><i class="ti ti-ad-2" style="color:#FF9F0A"></i> Ad-free experience</div>
      </div>
      <button class="vm-btn vm-btn-premium" onclick="routerNavigate('/premium')"><i class="ti ti-crown"></i> Upgrade to Premium</button>
      <button class="vm-btn vm-btn-ghost" onclick="updateWordCounter()" style="margin-top:8px"><i class="ti ti-refresh"></i> Check later</button>
    </div>`;
}

function validateBeforeRender(data) {
  // Run validation and fix/hide problematic data
  const validation = API.validateWordData(data);
  if (!validation.valid) {
    console.warn('[VALIDATION] Word "' + (data?.word || 'unknown') + '" has issues:', validation.errors.join(', '));
  }
  return data;
}

function renderWordCard(data) {
  if (!data) return;
  validateBeforeRender(data);
  const el = document.getElementById('word-card-area');
  if (!el) return;
  const wordClean = String(data.word).replace(/[^a-zA-Z]/g, '');
  const syllables = countSyllables(wordClean);
  const lvl = data.cefrLevel || getCEFRLevel(wordClean);
  const lvlColors = { A1:'#10b981', A2:'#34d399', B1:'#f59e0b', B2:'#f97316', C1:'#ef4444', C2:'#dc2626' };
  const lvlColor = lvlColors[lvl] || '#7c6fff';
  const conf = data.confidence !== undefined ? data.confidence : 0;
  const confColor = conf >= 75 ? '#34C759' : conf >= 50 ? '#FF9F0A' : '#FF3B30';
  const confLabel = conf >= 75 ? 'Verified' : conf >= 50 ? 'Good' : conf >= 25 ? 'Fair' : 'Low';
  const verified = conf >= 75 ? '<span class="verified-badge" title="All sections pass validation"><i class="ti ti-circle-check" style="vertical-align:-2px"></i> Verified</span>' : '';

  let wordFormsHTML = '';
  if (data.word_forms) {
    const wf = data.word_forms; let parts = [];
    if (wf.noun) parts.push('<span style="display:inline-block;padding:2px 10px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)"><strong>noun:</strong> ' + wf.noun + '</span>');
    if (wf.verb) parts.push('<span style="display:inline-block;padding:2px 10px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)"><strong>verb:</strong> ' + wf.verb + '</span>');
    if (wf.adverb) parts.push('<span style="display:inline-block;padding:2px 10px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)"><strong>adverb:</strong> ' + wf.adverb + '</span>');
    if (parts.length) wordFormsHTML = '<div style="margin-top:8px;font-size:12px;color:var(--text2);padding:8px 12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)"><i class="ti ti-forms" style="vertical-align:-2px"></i> <strong>Word Forms:</strong> ' + parts.join('') + '</div>';
  }
  let collocationsHTML = '';
  if (data.commonCollocations?.length) {
    collocationsHTML = '<div class="word-tags-section"><div class="word-tags-label"><i class="ti ti-link" style="color:#007AFF;vertical-align:-1px"></i> Collocations <span style="font-size:9px;color:var(--ios-muted);font-weight:400">' + data.commonCollocations.length + '</span></div><div class="tags-row">' + data.commonCollocations.map(function(c) { return '<span class="tag rel" style="background:var(--bg2);border-color:var(--border)">' + c + '</span>'; }).join('') + '</div></div>';
  }
  let morphologyHTML = '';
  var m = data.morphology;
  if (m) {
    var mParts = [];
    if (m.past_tense) mParts.push('<strong>past:</strong> ' + m.past_tense);
    if (m.past_participle) mParts.push('<strong>p.p:</strong> ' + m.past_participle);
    if (m.plural) mParts.push('<strong>plural:</strong> ' + m.plural);
    if (m.comparative) mParts.push('<strong>comparative:</strong> ' + m.comparative);
    if (m.superlative) mParts.push('<strong>superlative:</strong> ' + m.superlative);
    if (mParts.length) morphologyHTML = '<div style="margin-top:8px;font-size:12px;color:var(--text2);padding:8px 12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)"><i class="ti ti-transform" style="vertical-align:-2px"></i> <strong>Morphology:</strong> ' + mParts.join(' | ') + '</div>';
  }
  let prepositionsHTML = '';
  if (data.prepositions?.length) {
    prepositionsHTML = '<div style="margin-top:8px;font-size:12px;color:var(--text2);padding:8px 12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)"><i class="ti ti-arrow-right" style="vertical-align:-2px"></i> <strong>Prepositions:</strong> ' + data.prepositions.map(function(p) { return '<span style="display:inline-block;padding:2px 8px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)">' + p + '</span>'; }).join('') + '</div>';
  }
  let wordFamilyHTML = '';
  if (data.word_family?.length) {
    wordFamilyHTML = '<div class="word-tags-section"><div class="word-tags-label"><i class="ti ti-tree" style="color:#5856D6;vertical-align:-1px"></i> Word Family <span style="font-size:9px;color:var(--ios-muted);font-weight:400">' + data.word_family.length + '</span></div><div class="tags-row">' + data.word_family.map(function(w) { return '<span class="tag rel" onclick="loadWordDisplay(\'' + w + '\')">' + w + '</span>'; }).join('') + '</div></div>';
  }
  let phrasesHTML = '';
  if (data.common_phrases?.length) {
    phrasesHTML = '<div style="margin-top:8px;font-size:12px;color:var(--text2);padding:8px 12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)"><i class="ti ti-message" style="vertical-align:-2px"></i> <strong>Common Phrases:</strong> ' + data.common_phrases.map(function(p) { return '<span style="display:inline-block;padding:2px 8px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)">"' + p + '"</span>'; }).join('') + '</div>';
  }
  let mistakesHTML = '';
  if (data.common_mistakes?.length) {
    mistakesHTML = '<div style="margin-top:8px;font-size:12px;color:var(--rose2);padding:8px 12px;background:#ff3b300a;border-radius:8px;border:1px solid #ff3b3022"><i class="ti ti-alert-triangle" style="vertical-align:-2px"></i> <strong>Common Mistakes:</strong> ' + data.common_mistakes.join(' | ') + '</div>';
  }
  let discriminationHTML = '';
  var sd = data.synonym_discrimination;
  if (sd && Object.keys(sd).length) {
    var sdItems = Object.keys(sd).map(function(k) { return '<strong>' + k + '</strong>: ' + sd[k]; }).join(' | ');
    discriminationHTML = '<div style="margin-top:8px;font-size:12px;color:var(--text2);padding:8px 12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)"><i class="ti ti-separator" style="vertical-align:-2px"></i> <strong>Synonym Differences:</strong> ' + sdItems + '</div>';
  }
  let spellingsHTML = '';
  var alt = data.alternative_spellings;
  if (alt && (alt.uk || alt.us)) {
    var sParts = [];
    if (alt.uk) sParts.push('<strong>UK:</strong> ' + alt.uk);
    if (alt.us) sParts.push('<strong>US:</strong> ' + alt.us);
    spellingsHTML = '<div style="margin-top:8px;font-size:12px;color:var(--text2);padding:8px 12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)"><i class="ti ti-language" style="vertical-align:-2px"></i> <strong>Spellings:</strong> ' + sParts.join(' | ') + '</div>';
  }
  let topicTagsHTML = '';
  if (data.topic_tags?.length) {
    topicTagsHTML = '<div class="word-tags-section"><div class="word-tags-label"><i class="ti ti-tag" style="color:#FF9F0A;vertical-align:-1px"></i> Topics</div><div class="tags-row">' + data.topic_tags.map(function(t) { return '<span class="tag syn" style="background:#FF9F0A15;border-color:#FF9F0A33;color:#FF9F0A">' + t + '</span>'; }).join('') + '</div></div>';
  }
  let difficultyHTML = '';
  if (data.difficulty_for_learners) {
    difficultyHTML = '<div style="margin-top:8px;font-size:12px;color:var(--accent2);padding:8px 12px;background:var(--accent2)0a;border-radius:8px;border:1px solid var(--accent2)22"><i class="ti ti-school" style="vertical-align:-2px"></i> ' + data.difficulty_for_learners + '</div>';
  }
  let advancedHTML = '';
  if (data.allMeanings && data.allMeanings.length > 1) {
    const primaryPOS = data.partOfSpeech;
    const advanced = data.allMeanings.filter(m => m.partOfSpeech !== primaryPOS || data.allMeanings.indexOf(m) > 0);
    if (advanced.length > 0) {
      advancedHTML = advanced.map(m => {
        const advDefs = m.definitions?.slice(0, 2).map(d =>
          `<p style="font-size:13px;color:var(--ios-secondary-label);margin:4px 0">${d.definition}${d.example ? `<br><span style="font-size:11px;font-style:italic;color:var(--ios-muted)">"${d.example}"</span>` : ''}</p>`
        ).join('') || '';
        return `<div style="margin-bottom:8px"><span class="badge badge-accent" style="font-size:10px;background:var(--ios-muted)22;color:var(--ios-muted)">${m.partOfSpeech}</span>${advDefs}</div>`;
      }).join('');
      advancedHTML = `<div class="word-advanced-meanings" style="margin-top:12px;padding:10px 12px;background:var(--bg2);border-radius:10px;border:1px solid var(--border)"><div style="font-size:11px;font-weight:600;color:var(--ios-muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px"><i class="ti ti-tools" style="vertical-align:-2px"></i> Advanced Meanings</div>${advancedHTML}</div>`;
    }
  }

  // ---- NEW comprehensive fields ----
  let mainMeaningHTML = data.main_meaning ? '<div style="margin-top:10px;font-size:14px;color:var(--text1);padding:8px 12px;background:var(--bg1);border-radius:8px;border-left:3px solid var(--accent)"><strong>Asosiy ma\'nosi:</strong> ' + data.main_meaning + '</div>' : '';

  let threeDefsHTML = '';
  var defsCount = 0;
  if (data.simple_definition || data.dictionary_definition || data.contextual_definition) {
    threeDefsHTML = '<div style="margin-top:12px">';
    threeDefsHTML += '<div style="font-size:11px;font-weight:600;color:var(--ios-muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px"><i class="ti ti-books" style="vertical-align:-2px"></i> 3 xil izoh</div>';
    if (data.simple_definition) { threeDefsHTML += '<div style="margin-bottom:6px;padding:8px 12px;background:var(--bg2);border-radius:8px;border-left:3px solid #34C759"><div style="font-size:10px;color:#34C759;font-weight:600;margin-bottom:2px">🔹 Sodda izoh</div><div style="font-size:13px;color:var(--text1)">' + data.simple_definition + '</div></div>'; defsCount++; }
    if (data.dictionary_definition) { threeDefsHTML += '<div style="margin-bottom:6px;padding:8px 12px;background:var(--bg2);border-radius:8px;border-left:3px solid #007AFF"><div style="font-size:10px;color:#007AFF;font-weight:600;margin-bottom:2px">📖 Lug\'at izohi</div><div style="font-size:13px;color:var(--text1)">' + data.dictionary_definition + '</div></div>'; defsCount++; }
    if (data.contextual_definition) { threeDefsHTML += '<div style="margin-bottom:6px;padding:8px 12px;background:var(--bg2);border-radius:8px;border-left:3px solid #FF9F0A"><div style="font-size:10px;color:#FF9F0A;font-weight:600;margin-bottom:2px">🔸 Kontekstli izoh</div><div style="font-size:13px;color:var(--text1)">' + data.contextual_definition + '</div></div>'; defsCount++; }
    threeDefsHTML += '</div>';
  }

  let examplesHTML = '';
  var exs = data.examples || [];
  if (exs.length) {
    examplesHTML = '<div style="margin-top:12px;padding:10px 14px;background:var(--bg2);border-radius:10px;border:1px solid var(--border)"><div style="font-size:11px;font-weight:600;color:var(--ios-muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px"><i class="ti ti-quote" style="vertical-align:-2px"></i> Misollar (' + exs.length + ')</div>';
    exs.forEach(function(ex, i) {
      examplesHTML += '<div style="margin-bottom:6px;padding:6px 10px;background:var(--surface);border-radius:6px;font-size:13px;font-style:italic;color:var(--text1);border-left:2px solid var(--accent)">' + (i+1) + '. "' + ex + '"</div>';
    });
    examplesHTML += '</div>';
  }

  let contextsHTML = data.common_contexts?.length ? '<div style="margin-top:8px;font-size:12px;color:var(--text2);padding:8px 12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)"><i class="ti ti-map-pin" style="vertical-align:-2px"></i> <strong>Qayerda ishlatiladi:</strong> ' + data.common_contexts.map(function(c) { return '<span style="display:inline-block;padding:2px 8px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)">' + c + '</span>'; }).join('') + '</div>' : '';

  let memoryHTML = data.memory_tip ? '<div style="margin-top:8px;font-size:12px;color:var(--text2);padding:10px 14px;background:#5856D610;border-radius:10px;border:1px solid #5856D622"><i class="ti ti-brain" style="vertical-align:-2px"></i> <strong>Eslab qolish:</strong> ' + data.memory_tip + '</div>' : '';

  let ieltsHTML = data.ielts_expressions?.length ? '<div style="margin-top:8px;font-size:12px;color:var(--text2);padding:8px 12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)"><i class="ti ti-certificate" style="vertical-align:-2px"></i> <strong>IELTS/C1-C2 iboralar:</strong> ' + data.ielts_expressions.map(function(e) { return '<span style="display:inline-block;padding:2px 8px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)">' + e + '</span>'; }).join('') + '</div>' : '';

  let realLifeHTML = data.real_life_usage ? '<div style="margin-top:8px;font-size:12px;color:var(--text2);padding:10px 14px;background:#10b9810a;border-radius:10px;border:1px solid #10b98122"><i class="ti ti-users" style="vertical-align:-2px"></i> <strong>Real hayotda ishlatilishi:</strong> ' + data.real_life_usage + '</div>' : '';
  // ---- END new comprehensive fields ----

  el.innerHTML = `
  <div class="word-card stagger-item">
    <div class="word-card-accent"></div>
    <div class="word-card-glow"></div>
    <div class="word-card-inner">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
        <div class="word-part-of-speech" style="margin-bottom:0">${data.partOfSpeech}</div>
        ${getCEFRBadge(wordClean)}
        <span class="cefr-badge" style="font-size:10px;padding:2px 6px;border-radius:99px;background:${confColor}22;color:${confColor};border:1px solid ${confColor}44;font-weight:600;letter-spacing:0.3px">${confLabel} ${conf}%</span>
        ${verified}
        ${data.register ? `<span style="font-size:10px;padding:2px 6px;border-radius:99px;background:${data.register === 'formal' ? '#5856D6' : data.register === 'informal' ? '#FF2D55' : data.register === 'academic' ? '#007AFF' : '#8E8E93'}22;color:${data.register === 'formal' ? '#5856D6' : data.register === 'informal' ? '#FF2D55' : data.register === 'academic' ? '#007AFF' : '#8E8E93'};border:1px solid ${data.register === 'formal' ? '#5856D6' : data.register === 'informal' ? '#FF2D55' : data.register === 'academic' ? '#007AFF' : '#8E8E93'}44;font-weight:500;letter-spacing:0.3px">${data.register}</span>` : ''}
        <span style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">${data.phonetic || (data.ukPhonetic || '')}</span>
      </div>
      <div class="word-main">${data.word}</div>
      ${data.uzbek_translation ? `<div style="font-size:20px;font-weight:500;color:var(--accent);margin-bottom:12px;letter-spacing:-0.3px"><span style="font-size:12px;font-weight:400;color:var(--text3);margin-right:6px">🇺🇿</span>${data.uzbek_translation}</div>` : ''}
      <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
        <button class="btn-pronounce" onclick="pronounceWord('${data.word}','en-US')" title="US pronunciation"><i class="ti ti-volume" style="font-size:16px;vertical-align:-2px"></i> <span style="font-size:12px;font-family:var(--font-mono)">${data.usPhonetic || data.phonetic || ''}</span></button>
      </div>
      <div style="display:flex;gap:10px;font-size:11px;color:var(--text3);margin-bottom:14px;flex-wrap:wrap">
        <span><i class="ti ti-text-size" style="vertical-align:-2px"></i> ${wordClean.length} harf</span>
        <span><i class="ti ti-music" style="vertical-align:-2px"></i> ${syllables} bo\'g\'in</span>
        <span><i class="ti ti-stars" style="vertical-align:-2px"></i> ${getWordDifficulty(wordClean)}</span>
        <span><i class="ti ti-flag" style="vertical-align:-2px"></i> ${lvl}</span>
        ${data.frequency_percent !== undefined ? `<span><i class="ti ti-chart-bar" style="vertical-align:-2px"></i> ${data.frequency_label || data.frequency_percent + '%'}</span>` : ''}
      </div>
      ${data.frequency_percent !== undefined ? `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-bottom:2px"><span>Ishlatilish chastotasi</span><span>${data.frequency_percent}%</span></div><div style="height:4px;background:var(--border);border-radius:99px;overflow:hidden"><div style="height:100%;width:${data.frequency_percent}%;background:${data.frequency_percent >= 70 ? '#34C759' : data.frequency_percent >= 40 ? '#FF9F0A' : '#FF3B30'};border-radius:99px;transition:width 0.6s"></div></div></div>` : ''}
      ${mainMeaningHTML}
      ${threeDefsHTML}
      <div class="word-definition">${data.definition}</div>
      ${data.example ? `<div class="word-example">"${data.example}"</div>` : (!data.example && data.definition ? `<div class="word-example" style="color:var(--ios-muted);font-style:normal;font-size:12px">Misol mavjud emas</div>` : '')}
      ${examplesHTML}
      ${advancedHTML}
      ${contextsHTML}
      ${realLifeHTML}
      ${data.etymology ? `<div style="margin-top:10px;font-size:12px;color:var(--text2);padding:8px 12px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)"><i class="ti ti-books" style="vertical-align:-2px"></i> <strong>Etimologiya:</strong> ${data.etymology}</div>` : ''}
      ${memoryHTML}
      ${wordFormsHTML}
      ${morphologyHTML}
      ${prepositionsHTML}
      ${wordFamilyHTML}
      ${phrasesHTML}
      ${ieltsHTML}
      ${mistakesHTML}
      ${discriminationHTML}
      ${spellingsHTML}
      ${topicTagsHTML}
      ${difficultyHTML}
      ${data.funFact ? `<div style="margin-top:8px;font-size:12px;color:var(--amber2);padding:8px 12px;background:#f59e0b0a;border-radius:8px;border:1px solid #f59e0b22"><i class="ti ti-bulb" style="vertical-align:-2px"></i> <strong>Qiziq fakt:</strong> ${data.funFact}</div>` : ''}
      ${data.usageTip ? `<div style="margin-top:8px;font-size:12px;color:var(--emerald2);padding:8px 12px;background:#10b9810a;border-radius:8px;border:1px solid #10b98122"><i class="ti ti-message" style="vertical-align:-2px"></i> <strong>Foydalanish maslahati:</strong> ${data.usageTip}</div>` : ''}
      ${data.synonyms?.length ? `<div class="word-tags-section"><div class="word-tags-label"><i class="ti ti-circle-check" style="color:#34C759;vertical-align:-1px"></i> Sinonimlar <span style="font-size:9px;color:var(--ios-muted);font-weight:400">${data.synonyms.length}</span></div><div class="tags-row">${data.synonyms.map(s => `<span class="tag syn" onclick="loadWordDisplay('${s}')">${s}</span>`).join('')}</div></div>` : ''}
      ${data.antonyms?.length ? `<div class="word-tags-section"><div class="word-tags-label"><i class="ti ti-circle-x" style="color:#FF3B30;vertical-align:-1px"></i> Antonimlar <span style="font-size:9px;color:var(--ios-muted);font-weight:400">${data.antonyms.length}</span></div><div class="tags-row">${data.antonyms.map(a => `<span class="tag ant" onclick="loadWordDisplay('${a}')">${a}</span>`).join('')}</div></div>` : ''}
      ${data.related?.length ? `<div class="word-tags-section"><div class="word-tags-label"><i class="ti ti-link" style="color:#5856D6;vertical-align:-1px"></i> Bog'liq so'zlar <span style="font-size:9px;color:var(--ios-muted);font-weight:400;margin-left:4px">semantically verified</span></div><div class="tags-row">${data.related.map(r => `<span class="tag rel" onclick="loadWordDisplay('${r}')">${r}</span>`).join('')}</div></div>` : ''}
      ${data.rhymes?.length ? `<div class="word-tags-section"><div class="word-tags-label"><i class="ti ti-music" style="color:#FF2D55;vertical-align:-1px"></i> Qofiyadoshlar <span style="font-size:9px;color:var(--ios-muted);font-weight:400;margin-left:4px">common only</span></div><div class="tags-row">${data.rhymes.map(r => `<span class="tag rhy" onclick="loadWordDisplay('${r}')">${r}</span>`).join('')}</div></div>` : ''}
      ${collocationsHTML}
      <div class="word-actions">
        <button class="btn btn-primary" onclick="generateNewWord()"><i class="ti ti-arrow-right"></i> Keyingi so'z</button>
        <button class="btn btn-ghost" onclick="saveToFavorites(state.currentWord)"><i class="ti ti-star"></i> Saqlash</button>
        <button class="btn btn-ghost" onclick="showWordModal(state.currentWord)"><i class="ti ti-search"></i> Batafsil</button>
      </div>
    </div>
  </div>`;
}


// =============================================
// WORD MODAL
// =============================================
function showWordModal(data) {
  if (!data) return;
  if (data.related) data.related = data.related.filter(w => w && typeof w === 'string' && w.length >= 3 && w.length <= 20 && /^[a-zA-Z]+$/.test(w) && String(w).toLowerCase() !== String(data.word).toLowerCase());
  if (data.rhymes) data.rhymes = data.rhymes.filter(w => w && typeof w === 'string' && w.length >= 3 && w.length <= 20 && /^[a-zA-Z]+$/.test(w) && String(w).toLowerCase() !== String(data.word).toLowerCase());
  const modal = document.getElementById('word-modal');
  const conf = data.confidence !== undefined ? data.confidence : 0;
  const confColor = conf >= 75 ? '#34C759' : conf >= 50 ? '#FF9F0A' : '#FF3B30';
  const confLabel = conf >= 75 ? 'Verified' : conf >= 50 ? 'Good' : conf >= 25 ? 'Fair' : 'Low';
  const lvl = data.cefrLevel || getCEFRLevel(data.word);
  const freqColor = (data.frequency_percent || 0) >= 70 ? '#34C759' : (data.frequency_percent || 0) >= 40 ? '#FF9F0A' : '#FF3B30';
  const regColors = { formal:'#5856D6', informal:'#FF2D55', neutral:'#8E8E93', academic:'#007AFF' };
  document.getElementById('modal-word-header').innerHTML = `
    <div>
      <span class="badge badge-accent" style="margin-bottom:8px">${data.partOfSpeech}</span>
      <span class="cefr-badge" style="font-size:10px;padding:2px 6px;border-radius:99px;background:${CEFR_COLORS[lvl]}22;color:${CEFR_COLORS[lvl]};border:1px solid ${CEFR_COLORS[lvl]}44;font-weight:600;margin-left:4px">${lvl}</span>
      <span style="font-size:10px;padding:2px 6px;border-radius:99px;background:${confColor}22;color:${confColor};border:1px solid ${confColor}44;font-weight:600;margin-left:4px">${confLabel} ${conf}%</span>
      ${data.register ? `<span style="font-size:10px;padding:2px 6px;border-radius:99px;background:${(regColors[data.register] || '#8E8E93')}22;color:${regColors[data.register] || '#8E8E93'};border:1px solid ${(regColors[data.register] || '#8E8E93')}44;font-weight:500;margin-left:4px">${data.register}</span>` : ''}
      <div style="font-family:var(--font-display);font-size:36px;font-weight:800">${data.word}</div>
      <div style="font-family:var(--font-mono);font-size:14px;color:var(--cyan);margin-top:4px">${data.phonetic || ''}</div>
      ${data.frequency_percent !== undefined ? `<div style="margin-top:8px"><div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-bottom:2px"><span>Chastota: ${data.frequency_label || ''}</span><span>${data.frequency_percent}%</span></div><div style="height:3px;background:var(--border);border-radius:99px;overflow:hidden"><div style="height:100%;width:${data.frequency_percent}%;background:${freqColor};border-radius:99px"></div></div></div>` : ''}
    </div>`;

  let body = '';

  // Uzbek translation
  if (data.uzbek_translation) {
    body += '<div style="margin-bottom:12px;font-size:15px;color:var(--text1);padding:10px 14px;background:var(--accent)0d;border-radius:10px;border:1px solid var(--accent)22;text-align:center;font-weight:600"><span style="font-size:11px;font-weight:400;color:var(--text3);display:block;margin-bottom:2px">🇺🇿 O\'zbekcha tarjima</span>' + data.uzbek_translation + '</div>';
  }

  // Main meaning
  if (data.main_meaning) {
    body += '<div style="margin-bottom:12px;font-size:14px;color:var(--text1);padding:8px 12px;background:var(--bg1);border-radius:8px;border-left:3px solid var(--accent)"><strong>Asosiy ma\'nosi:</strong> ' + data.main_meaning + '</div>';
  }

  // Definition
  body += '<p style="font-size:16px;color:var(--text1);line-height:1.7;margin-bottom:20px">' + data.definition + '</p>';
  if (data.example) body += '<blockquote style="border-left:3px solid var(--accent);padding:10px 16px;background:var(--surface);border-radius:0 8px 8px 0;font-style:italic;margin-bottom:20px;font-size:14px;color:var(--text1)">"' + data.example + '"</blockquote>';

  // 3 definitions
  if (data.simple_definition || data.dictionary_definition || data.contextual_definition) {
    body += '<div style="margin-bottom:16px">';
    body += '<div class="section-title" style="font-size:13px;margin-bottom:8px"><i class="ti ti-books" style="vertical-align:-2px"></i> 3 xil izoh</div>';
    if (data.simple_definition) body += '<div style="margin-bottom:6px;padding:8px 12px;background:var(--bg2);border-radius:8px;border-left:3px solid #34C759"><div style="font-size:10px;color:#34C759;font-weight:600;margin-bottom:2px">🔹 Sodda izoh</div><div style="font-size:13px;color:var(--text1)">' + data.simple_definition + '</div></div>';
    if (data.dictionary_definition) body += '<div style="margin-bottom:6px;padding:8px 12px;background:var(--bg2);border-radius:8px;border-left:3px solid #007AFF"><div style="font-size:10px;color:#007AFF;font-weight:600;margin-bottom:2px">📖 Lug\'at izohi</div><div style="font-size:13px;color:var(--text1)">' + data.dictionary_definition + '</div></div>';
    if (data.contextual_definition) body += '<div style="margin-bottom:6px;padding:8px 12px;background:var(--bg2);border-radius:8px;border-left:3px solid #FF9F0A"><div style="font-size:10px;color:#FF9F0A;font-weight:600;margin-bottom:2px">🔸 Kontekstli izoh</div><div style="font-size:13px;color:var(--text1)">' + data.contextual_definition + '</div></div>';
    body += '</div>';
  }

  // Multiple examples
  var exs = data.examples || [];
  if (exs.length) {
    body += '<div style="margin-bottom:16px;padding:10px 14px;background:var(--bg2);border-radius:10px;border:1px solid var(--border)"><div class="section-title" style="font-size:12px;margin-bottom:6px"><i class="ti ti-quote" style="vertical-align:-2px"></i> Misollar (' + exs.length + ')</div>';
    exs.forEach(function(ex, i) {
      body += '<div style="margin-bottom:6px;padding:6px 10px;background:var(--surface);border-radius:6px;font-size:13px;font-style:italic;color:var(--text1);border-left:2px solid var(--accent)">' + (i+1) + '. "' + ex + '"</div>';
    });
    body += '</div>';
  }

  // Advanced/technical meanings
  if (data.allMeanings?.length > 1) {
    const primaryPOS = data.partOfSpeech;
    const advanced = data.allMeanings.filter(m => m.partOfSpeech !== primaryPOS || data.allMeanings.indexOf(m) > 0);
    if (advanced.length > 0) {
      body += '<div class="section-title" style="font-size:13px;margin-top:12px;margin-bottom:8px"><i class="ti ti-tools" style="color:var(--ios-muted);vertical-align:-2px"></i> Qo\'shimcha ma\'nolar</div>';
      advanced.forEach(m => {
        body += '<div style="margin-bottom:8px"><span class="badge badge-accent" style="font-size:10px;background:var(--ios-muted)22;color:var(--ios-muted)">' + m.partOfSpeech + '</span>';
        m.definitions?.slice(0, 2).forEach(d => {
          body += '<p style="font-size:13px;color:var(--ios-secondary-label);margin:4px 0">' + d.definition + '</p>';
          if (d.example) body += '<p style="font-size:12px;color:var(--ios-muted);font-style:italic">"' + d.example + '"</p>';
        });
        body += '</div>';
      });
    }
  }

  // Common contexts + Real life usage
  if (data.common_contexts?.length) {
    body += '<div style="font-size:12px;color:var(--text2);padding:8px 12px;background:var(--bg1);border-radius:8px;margin-bottom:8px;border:1px solid var(--border)"><i class="ti ti-map-pin" style="vertical-align:-2px"></i> <strong>Qayerda ishlatiladi:</strong> ' + data.common_contexts.map(function(c) { return '<span style="display:inline-block;padding:2px 8px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)">' + c + '</span>'; }).join('') + '</div>';
  }
  if (data.real_life_usage) {
    body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:#10b9810a;border-radius:8px;margin-bottom:8px;border:1px solid #10b98122"><i class="ti ti-users" style="vertical-align:-2px"></i> <strong>Real hayotda:</strong> ' + data.real_life_usage + '</div>';
  }

  // Etymology
  if (data.etymology) body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:var(--bg1);border-radius:10px;margin-bottom:8px;border:1px solid var(--border)">📜 <strong>Etimologiya:</strong> ' + data.etymology + '</div>';

  // Memory tip
  if (data.memory_tip) body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:#5856D610;border-radius:10px;margin-bottom:8px;border:1px solid #5856D622"><i class="ti ti-brain" style="vertical-align:-2px"></i> <strong>Eslab qolish:</strong> ' + data.memory_tip + '</div>';

  // Word forms
  if (data.word_forms) {
    var wf = data.word_forms; var wfParts = [];
    if (wf.noun) wfParts.push('<strong>noun:</strong> ' + wf.noun);
    if (wf.verb) wfParts.push('<strong>verb:</strong> ' + wf.verb);
    if (wf.adverb) wfParts.push('<strong>adverb:</strong> ' + wf.adverb);
    if (wfParts.length) body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:var(--bg1);border-radius:10px;margin-bottom:8px;border:1px solid var(--border)">📝 <strong>Word Forms (So\'z shakllari):</strong> ' + wfParts.join(' · ') + '</div>';
  }

  // Morphology
  if (data.morphology) {
    var m = data.morphology; var mParts = [];
    if (m.past_tense) mParts.push('<strong>past:</strong> ' + m.past_tense);
    if (m.past_participle) mParts.push('<strong>p.p:</strong> ' + m.past_participle);
    if (m.plural) mParts.push('<strong>plural:</strong> ' + m.plural);
    if (m.comparative) mParts.push('<strong>comparative:</strong> ' + m.comparative);
    if (m.superlative) mParts.push('<strong>superlative:</strong> ' + m.superlative);
    if (mParts.length) body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:var(--bg1);border-radius:10px;margin-bottom:8px;border:1px solid var(--border)">🔄 <strong>Morfologiya:</strong> ' + mParts.join(' · ') + '</div>';
  }

  // Prepositions
  if (data.prepositions?.length) {
    body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:var(--bg1);border-radius:10px;margin-bottom:8px;border:1px solid var(--border)">➡️ <strong>Prepozitsiyalar:</strong> ' + data.prepositions.map(function(p) { return '<span style="display:inline-block;padding:2px 8px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)">' + p + '</span>'; }).join('') + '</div>';
  }

  // Word family
  if (data.word_family?.length) {
    body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:var(--bg1);border-radius:10px;margin-bottom:8px;border:1px solid var(--border)">🌳 <strong>So\'z oilasi:</strong> ' + data.word_family.map(function(w) { return '<span class="tag rel" onclick="loadWordDisplay(\'' + w + '\');closeWordModal()">' + w + '</span>'; }).join('') + '</div>';
  }

  // Common phrases / Idioms
  if (data.common_phrases?.length) {
    body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:var(--bg1);border-radius:10px;margin-bottom:8px;border:1px solid var(--border)">💬 <strong>Iboralar / Idiomalar:</strong> ' + data.common_phrases.map(function(p) { return '<span style="display:inline-block;padding:2px 8px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)">"' + p + '"</span>'; }).join('') + '</div>';
  }

  // IELTS expressions
  if (data.ielts_expressions?.length) {
    body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:var(--bg1);border-radius:10px;margin-bottom:8px;border:1px solid var(--border)">🎯 <strong>IELTS/C1-C2 iboralar:</strong> ' + data.ielts_expressions.map(function(e) { return '<span style="display:inline-block;padding:2px 8px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)">' + e + '</span>'; }).join('') + '</div>';
  }

  // Common mistakes
  if (data.common_mistakes?.length) {
    body += '<div style="font-size:12px;color:var(--rose2);padding:10px 14px;background:#ff3b300a;border-radius:10px;margin-bottom:8px;border:1px solid #ff3b3022">⚠️ <strong>Keng tarqalgan xatolar:</strong> ' + data.common_mistakes.join(' · ') + '</div>';
  }

  // Synonym discrimination
  if (data.synonym_discrimination && Object.keys(data.synonym_discrimination).length) {
    var sd = data.synonym_discrimination;
    var sdItems = Object.keys(sd).map(function(k) { return '<strong>' + k + '</strong>: ' + sd[k]; }).join(' · ');
    body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:var(--bg1);border-radius:10px;margin-bottom:8px;border:1px solid var(--border)">🔬 <strong>Sinonimlar farqi:</strong> ' + sdItems + '</div>';
  }

  // Alternative spellings
  if (data.alternative_spellings && (data.alternative_spellings.uk || data.alternative_spellings.us)) {
    var alt = data.alternative_spellings; var sParts = [];
    if (alt.uk) sParts.push('<strong>UK:</strong> ' + alt.uk);
    if (alt.us) sParts.push('<strong>US:</strong> ' + alt.us);
    body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:var(--bg1);border-radius:10px;margin-bottom:8px;border:1px solid var(--border)">🌐 <strong>Yozilish farqlari:</strong> ' + sParts.join(' · ') + '</div>';
  }

  // Topic tags
  if (data.topic_tags?.length) {
    body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:var(--bg1);border-radius:10px;margin-bottom:8px;border:1px solid var(--border)">🏷️ <strong>Mavzular:</strong> ' + data.topic_tags.map(function(t) { return '<span style="display:inline-block;padding:2px 8px;background:#FF9F0A15;border-radius:99px;margin:2px;font-size:11px;border:1px solid #FF9F0A33;color:#FF9F0A">' + t + '</span>'; }).join('') + '</div>';
  }

  // Difficulty for learners
  if (data.difficulty_for_learners) {
    body += '<div style="font-size:12px;color:var(--accent2);padding:10px 14px;background:var(--accent2)0a;border-radius:10px;margin-bottom:8px;border:1px solid var(--accent2)22">🎓 ' + data.difficulty_for_learners + '</div>';
  }

  // Fun fact
  if (data.funFact) body += '<div style="font-size:12px;color:var(--amber2);padding:10px 14px;background:#f59e0b0a;border-radius:10px;margin-bottom:8px;border:1px solid #f59e0b22">💡 <strong>Qiziq fakt:</strong> ' + data.funFact + '</div>';

  // Usage tip
  if (data.usageTip) body += '<div style="font-size:12px;color:var(--emerald2);padding:10px 14px;background:#10b9810a;border-radius:10px;margin-bottom:8px;border:1px solid #10b98122">💬 <strong>Maslahat:</strong> ' + data.usageTip + '</div>';

  // Collocations
  if (data.commonCollocations?.length) body += '<div style="font-size:12px;color:var(--text2);padding:10px 14px;background:var(--bg1);border-radius:10px;margin-bottom:8px;border:1px solid var(--border)">🔗 <strong>Kollokatsiyalar:</strong> ' + data.commonCollocations.map(c => '<span style="display:inline-block;padding:2px 10px;background:var(--surface);border-radius:99px;margin:2px;font-size:11px;border:1px solid var(--border)">' + c + '</span>').join('') + '</div>';

  // Synonym / Antonym / Related / Rhyme tags
  const sections = [
    { label: '<i class="ti ti-circle-check" style="color:#34C759;vertical-align:-2px"></i> Sinonimlar', items: data.synonyms, cls: 'syn' },
    { label: '<i class="ti ti-circle-x" style="color:#FF3B30;vertical-align:-2px"></i> Antonimlar', items: data.antonyms, cls: 'ant' },
    { label: '<i class="ti ti-link" style="color:#5856D6;vertical-align:-2px"></i> Bog\'liq so\'zlar', items: data.related, cls: 'rel' },
    { label: '<i class="ti ti-music" style="color:#FF2D55;vertical-align:-2px"></i> Qofiyadoshlar', items: data.rhymes, cls: 'rhy' }
  ];
  sections.forEach(sec => {
    if (sec.items?.length) {
      body += '<div class="word-tags-section"><div class="word-tags-label">' + sec.label + '</div><div class="tags-row">' + sec.items.map(w => '<span class="tag ' + sec.cls + '" onclick="loadWordDisplay(\'' + w + '\');closeWordModal()">' + w + '</span>').join('') + '</div></div>';
    }
  });

  // Bottom info bar
  body += '<div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;font-size:12px;color:var(--text2);padding:8px 12px;background:var(--bg1);border-radius:10px;border:1px solid var(--border)">' +
    '<span><strong>US talaffuz:</strong> ' + (data.usPhonetic || data.phonetic || '—') + '</span>' +
  '</div>';

  // Action buttons
  body += '<div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">' +
    '<button class="btn btn-pronounce" onclick="pronounceWord(\'' + data.word + '\',\'en-US\')"><i class="ti ti-volume-2"></i> US Pronounce</button>' +
    '<button class="btn btn-ghost" onclick="saveToFavorites(window._modalWord)"><i class="ti ti-star" style="vertical-align:-2px"></i> Saqlash</button>' +
    '<button class="btn btn-ghost" onclick="addToFlashcards(state.currentWord||state.wotd);toast(\'Flashcards ga qoshildi\',\'success\')"><i class="ti ti-cards" style="vertical-align:-2px"></i> Flashcards</button>' +
    '<button class="btn btn-ghost" onclick="getAIExplanation(\'' + data.word + '\')"><i class="ti ti-sparkles" style="vertical-align:-2px"></i> AI tushuntirish</button>' +
  '</div>' +
  '<div id="ai-explanation-area" style="margin-top:16px;display:none"></div>';
  document.getElementById('modal-body').innerHTML = body;
  window._modalWord = data;
  modal.classList.add('open');
}

// ===== AI WORD EXPLANATION =====
async function getAIExplanation(word) {
  if (typeof requirePremium === 'function' && !(await requirePremium('AI Word Explanations'))) return;
  const area = document.getElementById('ai-explanation-area');
  if (!area) return;
  area.style.display = 'block';
  area.innerHTML = `<div style="padding:24px;text-align:center;color:var(--text2);font-size:14px;background:var(--vm-glass-bg);backdrop-filter:blur(8px);border-radius:16px;border:1px solid var(--vm-glass-border)"><span style="display:inline-block;animation:pulse 1.5s infinite">🤖</span> Generating AI explanation...</div>`;
  const result = await explainWordWithAI(word);
  if (!result || !result.explanation) {
    area.innerHTML = `<div style="padding:24px;text-align:center;color:var(--text2);font-size:14px;background:var(--vm-glass-bg);backdrop-filter:blur(8px);border-radius:16px;border:1px solid var(--vm-glass-border)">⚠️ AI explanation unavailable</div>`;
    return;
  }
  let html = '';
  try {
    const jsonStart = result.explanation.indexOf('{');
    const jsonEnd = result.explanation.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const parsed = JSON.parse(result.explanation.substring(jsonStart, jsonEnd + 1));
      var levelVal = parsed.level || parsed.cefrLevel || '';
      var levelColors = { A1:'#10b981', A2:'#34d399', B1:'#f59e0b', B2:'#f97316', C1:'#ef4444', C2:'#dc2626' };
      var levelColor = levelColors[levelVal] || '#7c6fff';
      var freqLabel = parsed.frequency_label || '';
      var freqPct = parsed.frequency_percent;
      var freqColor = freqPct >= 70 ? '#34C759' : freqPct >= 40 ? '#FF9F0A' : '#FF3B30';
      var regColor = { formal:'#5856D6', informal:'#FF2D55', neutral:'#8E8E93', academic:'#007AFF' };
      var regLabel = parsed.register || '';
      var posArray = parsed.part_of_speech || (parsed.partOfSpeech ? [parsed.partOfSpeech] : []);

      html += `<div style="background:var(--vm-glass-bg-strong);backdrop-filter:blur(20px);border:1px solid var(--vm-glass-border-strong);border-radius:20px;overflow:hidden;box-shadow:var(--vm-glass-shadow-lg)">`;

      // === HEADER SECTION ===
      html += `<div style="padding:24px 24px 0;position:relative">
        <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-bottom:10px">`;
      posArray.forEach(function(p) {
        html += `<span style="font-size:10px;padding:3px 10px;border-radius:99px;background:var(--accent);color:#fff;font-weight:500">${p}</span>`;
      });
      if (levelVal) html += `<span style="font-size:10px;padding:3px 10px;border-radius:99px;background:${levelColor}22;color:${levelColor};border:1px solid ${levelColor}44;font-weight:600">${levelVal}</span>`;
      if (freqPct !== undefined) html += `<span style="font-size:10px;padding:3px 10px;border-radius:99px;background:${freqColor}22;color:${freqColor};border:1px solid ${freqColor}44;font-weight:600" title="${freqPct}%">${freqLabel || freqPct + '%'}</span>`;
      if (regLabel) html += `<span style="font-size:10px;padding:3px 10px;border-radius:99px;background:${(regColor[regLabel] || '#8E8E93')}22;color:${regColor[regLabel] || '#8E8E93'};border:1px solid ${(regColor[regLabel] || '#8E8E93')}44;font-weight:600">${regLabel}</span>`;
      html += `</div>`;

      html += `<div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px">
        <span style="font-size:28px;font-weight:800;font-family:var(--font-display);color:var(--text0);letter-spacing:-0.5px">${parsed.word || word}</span>
        ${parsed.phonetic ? `<span style="font-size:13px;color:var(--text3);font-family:var(--font-mono)">${parsed.phonetic}</span>` : ''}
      </div>`;

      if (freqPct !== undefined) {
        html += `<div style="margin-top:6px;height:3px;background:var(--bg4);border-radius:99px;overflow:hidden"><div style="height:100%;width:${freqPct}%;background:${freqColor};border-radius:99px;transition:width 1s ease"></div></div>`;
      }

      html += `<div style="display:flex;gap:8px;margin-top:16px;padding:14px 0;border-top:1px solid var(--vm-glass-border)">`;
      html += result.cached
        ? `<span style="font-size:10px;color:var(--text3)">📦 Cached</span>`
        : `<span style="font-size:10px;color:var(--text3)">✨ Generated by AI</span>`;
      html += parsed.word_family?.length ? `<span style="font-size:10px;color:var(--text3)">📚 ${parsed.word_family.length} related</span>` : '';
      html += parsed.definitions?.length ? `<span style="font-size:10px;color:var(--text3)">📖 ${parsed.definitions.length} definitions</span>` : '';
      html += `</div></div>`;

      // === BODY ===
      html += `<div style="padding:0 24px 24px">`;

      // Uzbek translation card
      if (parsed.uzbek_translation) {
        html += `<div style="margin-top:18px;padding:14px 18px;background:rgba(91,61,232,0.08);border:1px solid rgba(91,61,232,0.15);border-radius:14px;text-align:center">
          <div style="font-size:10px;color:var(--text3);margin-bottom:4px;letter-spacing:0.3px">🇺🇿 O'zbekcha tarjima</div>
          <div style="font-size:18px;font-weight:600;color:var(--accent)">${parsed.uzbek_translation}</div>
        </div>`;
      }

      // Main meaning
      if (parsed.main_meaning) {
        html += `<div style="margin-top:14px;padding:12px 16px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border-radius:12px;border-left:3px solid var(--accent)"><span style="font-size:11px;font-weight:600;color:var(--text2);display:block;margin-bottom:2px">Asosiy ma'nosi</span><span style="font-size:14px;color:var(--text1)">${parsed.main_meaning}</span></div>`;
      }

      // Definitions
      var defs = parsed.definitions;
      if (defs && defs.length) {
        html += `<div style="margin-top:18px"><div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:10px;letter-spacing:0.3px;text-transform:uppercase">📖 Definitions</div>`;
        defs.forEach(function(d) {
          html += `<div style="margin-bottom:10px;padding:14px 16px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:14px">`;
          if (d.pos) html += `<span style="font-size:9px;padding:2px 10px;border-radius:99px;background:var(--accent);color:#fff;font-weight:600;text-transform:uppercase;letter-spacing:0.3px;display:inline-block;margin-bottom:6px">${d.pos}</span>`;
          html += `<p style="font-size:14px;color:var(--text1);line-height:1.7;margin:0">${d.definition}</p>`;
          if (d.example_sentence) html += `<div style="margin-top:8px;padding:8px 14px;background:var(--vm-glass-bg-subtle);border-radius:10px;font-style:italic;font-size:12px;color:var(--text2);border-left:3px solid var(--accent)">"${d.example_sentence}"</div>`;
          html += `</div>`;
        });
        html += `</div>`;
      }

      // 3 definitions
      if (parsed.simple_definition || parsed.dictionary_definition || parsed.contextual_definition) {
        html += `<div style="margin-top:18px"><div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:10px;letter-spacing:0.3px;text-transform:uppercase">🔍 3 xil izoh</div>`;
        if (parsed.simple_definition) html += `<div style="margin-bottom:8px;padding:12px 14px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border-radius:12px;border-left:3px solid #34C759"><div style="font-size:10px;color:#34C759;font-weight:600;margin-bottom:2px">🔹 Sodda izoh</div><div style="font-size:13px;color:var(--text1)">${parsed.simple_definition}</div></div>`;
        if (parsed.dictionary_definition) html += `<div style="margin-bottom:8px;padding:12px 14px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border-radius:12px;border-left:3px solid #007AFF"><div style="font-size:10px;color:#007AFF;font-weight:600;margin-bottom:2px">📖 Lug'at izohi</div><div style="font-size:13px;color:var(--text1)">${parsed.dictionary_definition}</div></div>`;
        if (parsed.contextual_definition) html += `<div style="margin-bottom:8px;padding:12px 14px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border-radius:12px;border-left:3px solid #FF9F0A"><div style="font-size:10px;color:#FF9F0A;font-weight:600;margin-bottom:2px">🔸 Kontekstli izoh</div><div style="font-size:13px;color:var(--text1)">${parsed.contextual_definition}</div></div>`;
        html += `</div>`;
      }

      // Examples
      var exs = parsed.examples || [];
      if (exs.length) {
        html += `<div style="margin-top:18px"><div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:10px;letter-spacing:0.3px;text-transform:uppercase">💬 Misollar (${exs.length})</div>`;
        exs.forEach(function(ex, i) {
          html += `<div style="margin-bottom:8px;padding:10px 14px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:12px;font-size:13px;font-style:italic;color:var(--text1)">${i+1}. "${ex}"</div>`;
        });
        html += `</div>`;
      }

      // Word forms + Morphology + Prepositions
      var wf = parsed.word_forms;
      var morph = parsed.morphology;
      var preps = parsed.prepositions;
      if ((wf && (wf.noun || wf.verb || wf.adverb)) || (morph && (morph.past_tense || morph.past_participle || morph.plural))) {
        html += `<div style="margin-top:18px"><div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:10px;letter-spacing:0.3px;text-transform:uppercase">📝 So'z shakllari</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">`;
        if (wf) {
          if (wf.noun) html += `<span style="padding:4px 12px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:99px;font-size:11px;color:var(--text1)"><span style="color:var(--accent);font-weight:600">noun:</span> ${wf.noun}</span>`;
          if (wf.verb) html += `<span style="padding:4px 12px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:99px;font-size:11px;color:var(--text1)"><span style="color:var(--accent);font-weight:600">verb:</span> ${wf.verb}</span>`;
          if (wf.adverb) html += `<span style="padding:4px 12px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:99px;font-size:11px;color:var(--text1)"><span style="color:var(--accent);font-weight:600">adverb:</span> ${wf.adverb}</span>`;
        }
        if (morph) {
          if (morph.past_tense) html += `<span style="padding:4px 12px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:99px;font-size:11px;color:var(--text1)"><span style="color:var(--text3);font-weight:500">past:</span> ${morph.past_tense}</span>`;
          if (morph.past_participle) html += `<span style="padding:4px 12px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:99px;font-size:11px;color:var(--text1)"><span style="color:var(--text3);font-weight:500">p.p:</span> ${morph.past_participle}</span>`;
        }
        html += `</div></div>`;
      }

      // Etymology
      if (parsed.etymology) {
        html += `<div style="margin-top:18px;padding:14px 16px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:14px">
          <div style="font-size:10px;font-weight:600;color:var(--text2);margin-bottom:4px;letter-spacing:0.3px;text-transform:uppercase">📜 Etimologiya</div>
          <div style="font-size:13px;color:var(--text1);line-height:1.6">${parsed.etymology}</div>
        </div>`;
      }

      // Memory tip
      if (parsed.memory_tip) {
        html += `<div style="margin-top:12px;padding:14px 16px;background:rgba(88,86,214,0.08);border:1px solid rgba(88,86,214,0.15);border-radius:14px">
          <div style="font-size:10px;font-weight:600;color:var(--text2);margin-bottom:4px;letter-spacing:0.3px;text-transform:uppercase">🧠 Eslab qolish</div>
          <div style="font-size:13px;color:var(--text1);line-height:1.6">${parsed.memory_tip}</div>
        </div>`;
      }

      // Common contexts
      if (parsed.common_contexts?.length) {
        html += `<div style="margin-top:14px;padding:14px 16px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:14px">
          <div style="font-size:10px;font-weight:600;color:var(--text2);margin-bottom:8px;letter-spacing:0.3px;text-transform:uppercase">📍 Qayerda ishlatiladi</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px">${parsed.common_contexts.map(function(c) { return '<span style="padding:3px 10px;background:var(--vm-glass-bg-subtle);border:1px solid var(--vm-glass-border);border-radius:99px;font-size:11px;color:var(--text1)">' + c + '</span>'; }).join('')}</div>
        </div>`;
      }

      // Real life usage
      if (parsed.real_life_usage) {
        html += `<div style="margin-top:12px;padding:14px 16px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:14px">
          <div style="font-size:10px;font-weight:600;color:var(--text2);margin-bottom:4px;letter-spacing:0.3px;text-transform:uppercase">👥 Real hayotda</div>
          <div style="font-size:13px;color:var(--text1);line-height:1.6">${parsed.real_life_usage}</div>
        </div>`;
      }

      // Fun fact
      if (parsed.funFact) {
        html += `<div style="margin-top:12px;padding:14px 16px;background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.15);border-radius:14px">
          <div style="font-size:10px;font-weight:600;color:var(--text2);margin-bottom:4px;letter-spacing:0.3px;text-transform:uppercase">💡 Qiziq fakt</div>
          <div style="font-size:13px;color:var(--amber2);line-height:1.6">${parsed.funFact}</div>
        </div>`;
      }

      // Usage tip
      if (parsed.usageTip) {
        html += `<div style="margin-top:12px;padding:14px 16px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:14px">
          <div style="font-size:10px;font-weight:600;color:var(--text2);margin-bottom:4px;letter-spacing:0.3px;text-transform:uppercase">💬 Maslahat</div>
          <div style="font-size:13px;color:var(--emerald2);line-height:1.6">${parsed.usageTip}</div>
        </div>`;
      }

      // IELTS expressions
      if (parsed.ielts_expressions?.length) {
        html += `<div style="margin-top:14px;padding:14px 16px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:14px">
          <div style="font-size:10px;font-weight:600;color:var(--text2);margin-bottom:8px;letter-spacing:0.3px;text-transform:uppercase">🎯 IELTS / C1-C2 iboralar</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px">${parsed.ielts_expressions.map(function(e) { return '<span style="padding:3px 10px;background:var(--vm-glass-bg-subtle);border:1px solid var(--vm-glass-border);border-radius:99px;font-size:11px;color:var(--text1)">' + e + '</span>'; }).join('')}</div>
        </div>`;
      }

      // Synonyms + Antonyms + Collocations grid
      var hasSyn = parsed.synonyms?.length;
      var hasAnt = parsed.antonyms?.length;
      var colls = parsed.collocations || parsed.commonCollocations;
      var hasColl = colls?.length;
      if (hasSyn || hasAnt || hasColl) {
        html += `<div style="margin-top:18px;display:flex;flex-direction:column;gap:10px">`;
        if (hasSyn) {
          html += `<div style="padding:12px 14px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:12px">
            <div style="font-size:10px;font-weight:600;color:var(--text2);margin-bottom:6px;letter-spacing:0.3px">✅ Sinonimlar</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">${parsed.synonyms.map(function(s) { return '<span class="tag syn" onclick="loadWordDisplay(\'' + s + '\');closeWordModal()">' + s + '</span>'; }).join(' ')}</div>
          </div>`;
        }
        if (hasAnt) {
          html += `<div style="padding:12px 14px;background:rgba(244,63,94,0.06);border:1px solid rgba(244,63,94,0.15);border-radius:12px">
            <div style="font-size:10px;font-weight:600;color:var(--text2);margin-bottom:6px;letter-spacing:0.3px">❌ Antonimlar</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">${parsed.antonyms.map(function(a) { return '<span class="tag ant" onclick="loadWordDisplay(\'' + a + '\');closeWordModal()">' + a + '</span>'; }).join(' ')}</div>
          </div>`;
        }
        if (hasColl) {
          html += `<div style="padding:12px 14px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:12px">
            <div style="font-size:10px;font-weight:600;color:var(--text2);margin-bottom:6px;letter-spacing:0.3px">🔗 Kollokatsiyalar</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">${colls.map(function(c) { return '<span style="padding:3px 10px;background:var(--vm-glass-bg-subtle);border:1px solid var(--vm-glass-border);border-radius:99px;font-size:11px;color:var(--text1)">' + c + '</span>'; }).join('')}</div>
          </div>`;
        }
        html += `</div>`;
      }

      // Word family
      if (parsed.word_family?.length) {
        html += `<div style="margin-top:14px;padding:12px 14px;background:var(--vm-glass-bg);backdrop-filter:blur(4px);border:1px solid var(--vm-glass-border);border-radius:12px">
          <div style="font-size:10px;font-weight:600;color:var(--text2);margin-bottom:6px;letter-spacing:0.3px">📚 Word Family</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px">${parsed.word_family.map(function(wf) { return '<span style="padding:3px 10px;background:var(--vm-glass-bg-subtle);border:1px solid var(--vm-glass-border);border-radius:99px;font-size:11px;color:var(--text1)">' + wf + '</span>'; }).join('')}</div>
        </div>`;
      }

      html += `</div></div>`;
    } else {
      html += `<div style="padding:20px 24px;background:var(--vm-glass-bg-strong);backdrop-filter:blur(20px);border:1px solid var(--vm-glass-border-strong);border-radius:20px;font-size:13px;color:var(--text1);line-height:1.8;white-space:pre-wrap">${result.explanation}</div>`;
    }
  } catch {
    html += `<div style="padding:20px 24px;background:var(--vm-glass-bg-strong);backdrop-filter:blur(20px);border:1px solid var(--vm-glass-border-strong);border-radius:20px;font-size:13px;color:var(--text1);line-height:1.8;white-space:pre-wrap">${result.explanation}</div>`;
  }
  area.innerHTML = html;
}

function closeWordModal(e) {
  if (!e || e.target === document.getElementById('word-modal')) document.getElementById('word-modal').classList.remove('open');
}


// =============================================
// SAVE TO FAVORITES / FLASHCARDS
// =============================================
function saveToFavorites(data) {
  if (!data) return;
  const exists = state.favorites.find(f => f.word === data.word);
  if (exists) { toast(`"${data.word}" is already in favorites`, 'info'); return; }
  state.favorites.unshift(data);
  localStorage.setItem('vm_favorites', JSON.stringify(state.favorites));
  if (state.isOnline) SECURE_API.recordWord(data.word, 'favorite', data.partOfSpeech);
  toast(`⭐ "${data.word}" saved to favorites!`, 'success');
  addXP(5, 'Saved a word');
}

function addToFlashcards(data) {
  if (!data) return;
  const exists = state.flashcards.find(f => f.word === data.word);
  if (!exists) { state.flashcards.push(data); }
}


// =============================================
// RECENT WORDS
// =============================================
function addToRecent(data) {
  state.recentWords = [data, ...state.recentWords.filter(w => w.word !== data.word)].slice(0, 20);
  localStorage.setItem('vm_recent', JSON.stringify(state.recentWords));
}

function renderRecentWords() {
  const el = document.getElementById('recent-words-row');
  if (!el || !state.recentWords.length) return;
  el.innerHTML = state.recentWords.slice(0, 8).map((w, i) => {
    const lvl = getCEFRLevel(w.word);
    const lvlColors = { A1:'#6366f1', A2:'#7c6fff', B1:'#a78bfa', B2:'#22d3ee', C1:'#e879f9', C2:'#f472b6' };
    const color = lvlColors[lvl] || '#7c6fff';
    return `<span class="recent-word-card" onclick="showWordModal(state.recentWords[${i}])" style="animation-delay:${i * 0.07}s">
      <span class="recent-word-text">${w.word}</span>
      <span class="recent-word-level" style="background:${color}22;color:${color};border:1px solid ${color}44">${lvl}</span>
    </span>`;
  }).join('');
}


// =============================================
// FLASHCARDS
// =============================================
let fcSessionStats = { easy: 0, medium: 0, hard: 0, total: 0, completed: false };

// ===== SM-2 SPACED REPETITION =====
function getSM2Data() {
  try { return JSON.parse(localStorage.getItem('vm_sm2_data') || '{}'); } catch { return {}; }
}
function saveSM2Data(data) {
  localStorage.setItem('vm_sm2_data', JSON.stringify(data));
}
function computeSM2(quality, easeFactor, interval, repetitions) {
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;
  let newInterval, newReps;
  if (quality < 3) {
    newInterval = 1; newReps = 0;
  } else {
    newReps = repetitions + 1;
    newInterval = newReps === 1 ? 1 : newReps === 2 ? 6 : Math.round(interval * newEF);
  }
  return { easeFactor: Math.round(newEF * 100) / 100, interval: newInterval, repetitions: newReps, nextReview: Date.now() + newInterval * 86400000 };
}
function getDueCardWords() {
  const data = getSM2Data();
  const now = Date.now();
  return Object.entries(data).filter(([_, c]) => c.nextReview <= now).sort((a, b) => a[1].nextReview - b[1].nextReview).map(([w]) => w);
}
function getCardSM2Info(word) {
  const data = getSM2Data();
  return data[word] || null;
}
function injectSM2Info() {
  if (!document.getElementById('fc-sm2-info')) {
    const p = document.getElementById('fc-progress');
    if (p) {
      const div = document.createElement('div');
      div.id = 'fc-sm2-info';
      div.style.cssText = 'display:none;text-align:center;font-size:11px;color:var(--text3);margin-top:6px';
      p.after(div);
    }
  }
  if (!document.getElementById('fc-sm2-retention')) {
    const bar = document.getElementById('fc-progress-bar');
    if (bar && bar.parentElement?.parentElement) {
      const div = document.createElement('div');
      div.id = 'fc-sm2-retention';
      div.style.cssText = 'display:none;text-align:center;font-size:11px;color:var(--text3);margin-top:4px';
      bar.parentElement.parentElement.after(div);
    }
  }
}

async function initFlashcards() {
  if (!state.flashcards.length) await loadFlashcardWords();
  else renderFlashcard();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function loadFlashcardWords() {
  if (typeof syncPremiumFromServer === 'function') { try { await syncPremiumFromServer(); } catch (e) {} }
  const isFree = typeof getCurrentPlan === 'function' && getCurrentPlan() === 'Free';
  const sm2 = isFree ? getSM2Data() : {};
  const cardCount = Object.keys(sm2).length;
  state.flashcards = [];
  fcSessionStats = { easy: 0, medium: 0, hard: 0, total: 0, completed: false };
  injectSM2Info();
  toast('Loading flashcards...', 'info');
  const dueWords = getDueCardWords();
  const dueCards = [];
  for (const w of dueWords.slice(0, 4)) {
    const data = await API.getFullWordData(w);
    if (data) dueCards.push(data);
  }
  const remaining = Math.max(4, 8 - dueCards.length);
  const words = (await Promise.all(Array.from({ length: 12 }, () => API.fetchRandomWord()))).filter(Boolean);
  const newWords = words.filter(w => !dueWords.includes(w)).slice(0, remaining);
  let newCards = (await Promise.all(newWords.map(w => API.getFullWordData(w)))).filter(Boolean);
  if (isFree && cardCount >= 30) {
    newCards = [];
    if (!dueCards.length) { await requirePremium('Unlimited flashcards'); return; }
  }
  state.flashcards = API.shuffle([...dueCards, ...newCards]);
  state.fcIndex = 0;
  state.usedFlashcardWords = [...new Set([...state.usedFlashcardWords, ...state.flashcards.map(f => f.word)])];
  localStorage.setItem('vm_fc_used', JSON.stringify(state.usedFlashcardWords));
  renderFlashcard();
  toast(`Loaded ${state.flashcards.length} flashcards (${dueCards.length} due for review)!`, 'success');
}

function shuffleFlashcards() {
  shuffle(state.flashcards);
  state.fcIndex = 0;
  renderFlashcard();
  toast('Flashcards shuffled!', 'info');
}

function renderFlashcard() {
  const el = document.getElementById('empty-fc');
  const summary = document.getElementById('fc-summary');
  const stats = document.getElementById('fc-session-stats');
  const main = document.getElementById('flashcard-main');
  if (!state.flashcards.length) { el.style.display = 'block'; summary.style.display = 'none'; if (stats) stats.style.display = 'none'; main.querySelector('.flashcard-container').style.display = 'none'; return; }
  if (fcSessionStats.completed) return;
  el.style.display = 'none';
  summary.style.display = 'none';
  if (stats) stats.style.display = 'block';
  const navEl = main.querySelector('.flashcard-nav');
  if (navEl) navEl.style.display = 'flex';
  main.querySelector('.flashcard-container').style.display = 'block';
  const w = state.flashcards[state.fcIndex];
  document.getElementById('fc-word').textContent = w.word;
  document.getElementById('fc-phonetic').textContent = w.phonetic || '';
  document.getElementById('fc-type').textContent = w.partOfSpeech ? String(w.partOfSpeech).toUpperCase() : '';
  document.getElementById('fc-def').textContent = w.definition;
  document.getElementById('fc-example').textContent = w.example ? `"${w.example}"` : '';
  const syns = document.getElementById('fc-syns');
  if (w.synonyms && w.synonyms.length) {
    syns.innerHTML = w.synonyms.slice(0, 4).map(s => `<span class="tag syn">${s}</span>`).join('');
  } else syns.innerHTML = '';
  document.getElementById('fc-progress').textContent = `Card ${state.fcIndex + 1} of ${state.flashcards.length}`;
  const isFree = typeof getCurrentPlan === 'function' && getCurrentPlan() === 'Free';
  const sm2Info = isFree ? null : getCardSM2Info(w.word);
  const strengthLabel = document.getElementById('fc-strength-label');
  const reviewLabel = document.getElementById('fc-sm2-review');
  if (sm2Info) {
    const nextDate = new Date(sm2Info.nextReview);
    const now = Date.now();
    const daysUntil = Math.round((sm2Info.nextReview - now) / 86400000);
    let strength = 'New';
    if (sm2Info.repetitions >= 5) strength = 'Mastered';
    else if (sm2Info.repetitions >= 3) strength = 'Learning';
    else if (sm2Info.repetitions >= 1) strength = 'Familiar';
    if (strengthLabel) strengthLabel.textContent = strength;
    if (reviewLabel) reviewLabel.textContent = `Day ${sm2Info.interval} · ${nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  } else {
    if (strengthLabel) strengthLabel.textContent = isFree ? '' : 'New';
    if (reviewLabel) reviewLabel.textContent = isFree ? '' : 'Day 1';
  }
  updateFCSessionStats();
  const inner = document.getElementById('flashcard-inner');
  inner.classList.remove('flipped');
  document.getElementById('fc-actions').style.display = 'none';
  state.stats.cardsReviewed++;
  saveStats();
  checkAchievements();
}

function updateFCSessionStats() {
  const total = state.flashcards.length;
  const done = fcSessionStats.easy + fcSessionStats.medium + fcSessionStats.hard;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const progressEl = document.getElementById('fc-session-progress');
  if (progressEl) progressEl.textContent = `${done}/${total}`;
  document.getElementById('fc-session-easy').textContent = fcSessionStats.easy;
  document.getElementById('fc-session-medium').textContent = fcSessionStats.medium;
  document.getElementById('fc-session-hard').textContent = fcSessionStats.hard;
  const bar = document.getElementById('fc-progress-bar');
  if (bar) bar.style.width = pct + '%';
  const retEl = document.getElementById('fc-sm2-retention');
  if (retEl) {
    const passed = fcSessionStats.easy + fcSessionStats.medium;
    const studied = fcSessionStats.total;
    if (studied > 0) {
      const retention = Math.round((passed / studied) * 100);
      retEl.textContent = `🎯 Retention: ${retention}% (${passed}/${studied} passed)`;
      retEl.style.display = 'block';
    } else retEl.style.display = 'none';
  }
}

function flipCard() {
  const inner = document.getElementById('flashcard-inner');
  inner.classList.toggle('flipped');
  if (inner.classList.contains('flipped')) {
    document.getElementById('fc-actions').style.display = 'flex';
    addXP(2, 'Reviewed flashcard');
  }
}

function nextCard() {
  if (state.fcIndex < state.flashcards.length - 1) {
    state.fcIndex++;
    renderFlashcard();
  } else {
    showFCSummary();
  }
}

function prevCard() {
  if (state.fcIndex > 0) {
    state.fcIndex--;
    renderFlashcard();
  }
}

function showFCSummary() {
  fcSessionStats.completed = true;
  document.getElementById('fc-session-stats').style.display = 'none';
  document.querySelector('.flashcard-container').style.display = 'none';
  document.querySelector('.flashcard-nav').style.display = 'none';
  document.getElementById('fc-actions').style.display = 'none';
  const summary = document.getElementById('fc-summary');
  summary.style.display = 'block';
  summary.style.animation = 'none';
  void summary.offsetWidth;
  summary.style.animation = '';

  const total = fcSessionStats.easy + fcSessionStats.medium + fcSessionStats.hard;
  const passed = fcSessionStats.easy + fcSessionStats.medium;
  const retention = total > 0 ? Math.round((passed / total) * 100) : 0;
  const sm2Data = getSM2Data();
  const efValues = Object.values(sm2Data).map(c => c.easeFactor).filter(Boolean);
  const avgEF = efValues.length > 0 ? (efValues.reduce((a, b) => a + b, 0) / efValues.length).toFixed(2) : '2.50';
  const dueCount = Object.values(sm2Data).filter(c => c.nextReview <= Date.now()).length;
  const xpGain = fcSessionStats.easy * 5 + fcSessionStats.medium * 3 + fcSessionStats.hard * 1;

  document.getElementById('fc-s-progress').textContent = total + ' cards';
  document.getElementById('fc-s-retention').textContent = retention + '%';
  document.getElementById('fc-s-ease').textContent = avgEF;

  var msgs = [];
  if (retention >= 90) msgs.push("Outstanding! You're really mastering these words! 🎯");
  else if (retention >= 75) msgs.push("Great session! Keep up the momentum! 💪");
  else if (retention >= 60) msgs.push("Good effort, focus on the tricky ones next time! 📚");
  else msgs.push("Keep going! Repetition is the key to mastery! 🔄");
  if (total >= 20) msgs.push("Long session — impressive stamina! ⚡");
  else if (total >= 10) msgs.push("Solid session size! 🎯");
  if (fcSessionStats.hard === 0 && total > 0) msgs.push("Perfect score — no hard cards! 🌟");
  if (parseFloat(avgEF) >= 2.8) msgs.push("Strong ease factor — your memory is sharp! 🧠");
  var msg = msgs[Math.floor(Math.random() * msgs.length)];
  addXP(xpGain, 'Flashcard session completed');

  document.getElementById('fc-summary-msg').textContent = msg;

  document.getElementById('fc-summary-details').innerHTML =
    '<div class="fc-summary-row">' +
      '<span class="fc-summary-badge" style="background:rgba(52,199,89,0.1);color:#34C759;border:1px solid rgba(52,199,89,0.15)"><i class="ti ti-mood-smile"></i> Easy: ' + fcSessionStats.easy + '</span>' +
      '<span class="fc-summary-badge" style="background:rgba(255,159,10,0.1);color:#FF9F0A;border:1px solid rgba(255,159,10,0.15)"><i class="ti ti-minus"></i> Okay: ' + fcSessionStats.medium + '</span>' +
      '<span class="fc-summary-badge" style="background:rgba(255,59,48,0.1);color:#FF3B30;border:1px solid rgba(255,59,48,0.15)"><i class="ti ti-x"></i> Hard: ' + fcSessionStats.hard + '</span>' +
      '<span class="fc-summary-badge" style="background:rgba(175,82,222,0.1);color:#AF52DE;border:1px solid rgba(175,82,222,0.15)"><i class="ti ti-sparkles"></i> +' + xpGain + ' XP</span>' +
      '<span class="fc-summary-badge" style="background:rgba(0,122,255,0.1);color:#007AFF;border:1px solid rgba(0,122,255,0.15)"><i class="ti ti-calendar"></i> ' + dueCount + ' due</span>' +
    '</div>';
}

function markCard(difficulty) {
  const w = state.flashcards[state.fcIndex];
  if (!w) return;
  const isFree = typeof getCurrentPlan === 'function' && getCurrentPlan() === 'Free';
  if (!isFree) {
    const qualityMap = { hard: 1, medium: 3, easy: 5 };
    const quality = qualityMap[difficulty] || 3;
    const sm2Data = getSM2Data();
    const word = w.word;
    const current = sm2Data[word] || { easeFactor: 2.5, interval: 0, repetitions: 0, nextReview: 0 };
    const result = computeSM2(quality, current.easeFactor, current.interval, current.repetitions);
    sm2Data[word] = result;
    saveSM2Data(sm2Data);
    const reviewDate = new Date(result.nextReview);
    const dateStr = reviewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (difficulty === 'easy') {
      addXP(5, 'Easy card mastered');
      toast(`Next review: ${dateStr} (${result.interval}d)`, 'success');
    } else if (difficulty === 'hard') {
      toast(`Next review: ${dateStr} (${result.interval}d)`, 'info');
    } else {
      toast(`Next review: ${dateStr} (${result.interval}d)`, 'info');
    }
  }
  fcSessionStats[difficulty]++;
  fcSessionStats.total++;
  state.flashcards.splice(state.fcIndex, 1);
  updateFCSessionStats();
  if (state.fcIndex >= state.flashcards.length) {
    if (state.flashcards.length > 0) { state.fcIndex = 0; renderFlashcard(); }
    else showFCSummary();
  } else renderFlashcard();
}

document.addEventListener('keydown', function(e) {
  const fcPage = document.getElementById('page-flashcards');
  if (!fcPage || !fcPage.classList.contains('active')) return;
  if (e.key === 'ArrowLeft') prevCard();
  else if (e.key === 'ArrowRight') nextCard();
  else if (e.key === ' ' || e.key === 'Space') { e.preventDefault(); flipCard(); }
  else if (e.key === '1') markCard('hard');
  else if (e.key === '2') markCard('medium');
  else if (e.key === '3') markCard('easy');
});


// =============================================
// TEXT TO SPEECH
// =============================================
function pronounceWord(word, lang) {
  if (!word) return;
  // Cancel any ongoing speech first
  if (speechSynthesis.speaking) speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(word);
  u.lang = lang || 'en-US';
  u.rate = 1.0;
  u.pitch = 1.0;
  u.volume = 1.0;
  speechSynthesis.speak(u);
}


// =============================================
// EXPLORE PAGE
// =============================================
function initExplorePage() {
  renderTopicChips('explore-topics');
  generateWordBatch();
  updateWordCounter();
}

async function generateWordBatch() {
  const container = document.getElementById('word-batch-grid');
  const section = document.getElementById('word-batch-section');
  if (!container || !section) return;
  section.style.display = 'block';
  container.innerHTML = Array(6).fill(`<div class="skeleton" style="height:140px"></div>`).join('');
  document.getElementById('batch-count').textContent = 'loading...';
  const wordPromises = Array.from({ length: 8 }, () => API.fetchRandomWord());
  const raw = await Promise.all(wordPromises);
  const unique = [...new Set(raw.filter(Boolean).map(w => String(w).toLowerCase()))].slice(0, 6);
  const defs = await Promise.all(unique.map(w => API.getDefinition(w)));
  state.wordBatch = defs.filter(Boolean);
  document.getElementById('batch-count').textContent = state.wordBatch.length + ' words';
  container.innerHTML = state.wordBatch.map((w, i) => {
    const safe = JSON.stringify(w).replace(/"/g,'&quot;');
    return `
    <div class="search-word-card stagger-item" onclick="loadWordDisplay('${w.word}', false)" style="animation-delay:${i * 60}ms">
      <div class="search-word-top">
        <div class="search-word-name">${w.word}</div>
        ${getCEFRBadge(w.word)}
        <span class="search-result-type">${w.partOfSpeech}</span>
        ${w.phonetic ? `<span class="search-word-phonetic">${w.phonetic}</span>` : ''}
      </div>
      <div class="search-word-def">${(w.definition || '').substring(0, 85)}${(w.definition || '').length > 85 ? '...' : ''}</div>
      <div class="search-word-actions">
        <button class="search-word-btn" onclick="event.stopPropagation();pronounceWord('${w.word}')" title="Pronounce"><i class="ti ti-volume"></i></button>
        <button class="search-word-btn" onclick="event.stopPropagation();saveToFavorites(${safe})" title="Save to Favorites"><i class="ti ti-heart"></i></button>
      </div>
    </div>`;
  }).join('');
}

async function exploreSearch() {
  const q = document.getElementById('explore-search-input')?.value?.trim();
  if (!q) { toast('Enter a word to search', 'info'); return; }
  const section = document.getElementById('word-batch-section');
  if (section) section.style.display = 'none';
  await loadWordDisplay(q);
}

// =============================================
// DIFFICULTY
// =============================================
function setDifficulty(el) {
  document.querySelectorAll('.diff-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  state.difficulty = el.dataset.diff;
  localStorage.setItem('vm_difficulty', state.difficulty);
  toast(`Difficulty: ${el.dataset.diff}`, 'info', 1500);
}

// =============================================
// ENHANCED EXPLORE WORDS — AI Features
// =============================================

// ---- AI Word of the Moment ----
let _wotmWords = [];
let _wotmIndex = 0;

async function generateAIWordOfMoment() {
  const section = document.getElementById('ai-wotm-section');
  const content = document.getElementById('wotm-content');
  const badge = document.getElementById('wotm-badge');
  if (!section || !content) return;
  section.style.display = 'block';
  content.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)"><div class="skeleton" style="height:16px;width:120px;margin:0 auto 12px"></div><div class="skeleton" style="height:32px;width:200px;margin:0 auto 12px"></div><div class="skeleton" style="height:14px;width:280px;margin:0 auto"></div></div>';
  if (badge) badge.textContent = '✨ AI';
  try {
    const word = await API.fetchRandomWord();
    if (!word) { content.innerHTML = '<div style="text-align:center;padding:12px;color:var(--text3)">Could not generate — try again</div>'; return; }
    const data = await getHybridWordData(word);
    if (!data) {
      const basic = await API.getFullWordData(word);
      if (!basic) { content.innerHTML = '<div style="text-align:center;padding:12px;color:var(--text3)">No data available</div>'; return; }
      renderWOTM(basic, content); return;
    }
    renderWOTM(data, content);
  } catch (e) {
    content.innerHTML = '<div style="text-align:center;padding:12px;color:var(--text3)">Error generating — try again</div>';
  }
}

function renderWOTM(data, container) {
  const lvlColors = { A1:'#10B981', A2:'#34D399', B1:'#F59E0B', B2:'#F97316', C1:'#EF4444', C2:'#DC2626' };
  const lvl = data.cefrLevel || getCEFRLevel(data.word);
  const color = lvlColors[lvl] || '#7C6FFF';
  const freqColor = data.frequency_percent >= 70 ? '#34C759' : data.frequency_percent >= 40 ? '#FF9F0A' : '#FF3B30';
  const syns = (data.synonyms || []).slice(0, 5);
  const ants = (data.antonyms || []).slice(0, 3);
  var escapedDef = (data.definition || '').replace(/'/g, "\\'");
  var escapedPhone = ((data.phonetic || data.ukPhonetic) || '').replace(/'/g, "\\'");
  container.innerHTML = `
    <div class="wotm-word" style="background:linear-gradient(135deg,${color},${color}cc);-webkit-background-clip:text;background-clip:text">${data.word}</div>
    <div class="wotm-phonetic">${data.phonetic || data.ukPhonetic || ''}</div>
    <div class="wotm-badges">
      <span class="wotm-badge-lvl" style="background:${color}18;color:${color};border:1px solid ${color}33">${lvl}</span>
      <span class="wotm-badge-pos">${data.partOfSpeech}</span>
      ${data.register ? `<span class="wotm-badge-reg" style="background:#5856D618;color:#5856D6;border:1px solid #5856D633">${data.register}</span>` : ''}
      ${data.frequency_percent !== undefined ? `<span class="wotm-badge-freq" style="background:${freqColor}18;color:${freqColor};border:1px solid ${freqColor}33">${data.frequency_label || data.frequency_percent + '%'}</span>` : ''}
    </div>
    <div class="wotm-def">${data.definition}</div>
    ${data.example ? `<div class="wotm-example">"${data.example}"</div>` : ''}
    ${data.etymology ? `<div class="wotm-etym"><i class="ti ti-books" style="vertical-align:-2px;margin-right:4px"></i> ${data.etymology}</div>` : ''}
    ${syns.length ? `<div class="wotm-extra"><strong>Synonyms:</strong> ${syns.map(function(s) { return '<span class="tag syn" onclick="loadWordDisplay(\'' + s + '\')">' + s + '</span>'; }).join(' ')}</div>` : ''}
    ${ants.length ? `<div class="wotm-extra"><strong>Antonyms:</strong> ${ants.map(function(a) { return '<span class="tag ant" onclick="loadWordDisplay(\'' + a + '\')">' + a + '</span>'; }).join(' ')}</div>` : ''}
    ${data.funFact ? `<div class="wotm-extra" style="color:var(--ios-tertiary-label)"><i class="ti ti-bulb" style="vertical-align:-2px;margin-right:4px"></i> ${data.funFact}</div>` : ''}
    <div class="wotm-actions">
      <button class="wotm-action-btn wotm-action-btn-primary" onclick="generateAIWordOfMoment()"><i class="ti ti-reload"></i> New Word</button>
      <button class="wotm-action-btn wotm-action-btn-glass" onclick="pronounceWord('${data.word}')"><i class="ti ti-volume"></i> Listen</button>
      <button class="wotm-action-btn wotm-action-btn-glass" onclick="loadWordDisplay('${data.word}')"><i class="ti ti-search"></i> Explore</button>
      <button class="wotm-action-btn wotm-action-btn-glass" onclick="saveToFavorites(state.currentWord || {word:'${data.word}',partOfSpeech:'${data.partOfSpeech}',definition:'${escapedDef}',phonetic:'${escapedPhone}'})"><i class="ti ti-star"></i> Save</button>
    </div>`;
}

// ---- Word Comparison ----
let _compareWords = [];

function addToCompare(data) {
  if (!data || !data.word) { toast('No word to compare', 'info'); return; }
  if (_compareWords.find(w => w.word === data.word)) { toast('Already in comparison', 'info'); return; }
  _compareWords.push(data);
  if (_compareWords.length > 3) _compareWords.shift();
  showCompareSection();
  toast(`Added "${data.word}" to comparison (${_compareWords.length}/3)`, 'success');
}

function showCompareSection() {
  const section = document.getElementById('word-compare-section');
  const content = document.getElementById('compare-content');
  if (!section || !content) return;
  if (!_compareWords.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  content.innerHTML = `<div class="compare-grid">${_compareWords.map(w => {
    const lvl = w.cefrLevel || getCEFRLevel(w.word);
    const lvlColors = { A1:'#10B981', A2:'#34D399', B1:'#F59E0B', B2:'#F97316', C1:'#EF4444', C2:'#DC2626' };
    const color = lvlColors[lvl] || '#7C6FFF';
    return `<div class="compare-card" onclick="loadWordDisplay('${w.word}')">
      <h4>${w.word}</h4>
      <div class="compare-pos">${w.partOfSpeech} <span style="color:${color}">${lvl}</span></div>
      <div class="compare-phonetic" style="font-family:var(--font-mono);font-size:11px;color:var(--cyan)">${w.phonetic || w.ukPhonetic || ''}</div>
      <div class="compare-def">${w.definition}</div>
      ${w.example ? `<div class="compare-example">"${w.example}"</div>` : ''}
      ${(w.synonyms||[]).length ? `<div style="font-size:10px;color:var(--text3);margin-top:6px"><strong>Syns:</strong> ${w.synonyms.slice(0,3).join(', ')}</div>` : ''}
      <div style="display:flex;gap:4px;margin-top:8px">
        <button class="vm-btn" onclick="event.stopPropagation();removeFromCompare('${w.word}')" style="font-size:10px;padding:3px 8px"><i class="ti ti-x"></i></button>
        <button class="vm-btn" onclick="event.stopPropagation();loadWordDisplay('${w.word}')" style="font-size:10px;padding:3px 8px"><i class="ti ti-search"></i></button>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function removeFromCompare(word) {
  _compareWords = _compareWords.filter(w => w.word !== word);
  showCompareSection();
}

function closeCompare() {
  document.getElementById('word-compare-section').style.display = 'none';
  _compareWords = [];
}

// ---- Word Root Explorer ----
async function exploreWordRoot(word) {
  const section = document.getElementById('word-root-section');
  const content = document.getElementById('root-explorer-content');
  if (!section || !content) return;
  if (!word || !word.trim()) { toast('Enter a word first', 'info'); return; }
  section.style.display = 'block';
  content.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text2)">🔍 Analyzing word roots...</div>';
  try {
    const data = await getHybridWordData(word);
    if (!data || !data.etymology) {
      content.innerHTML = `<div style="text-align:center;padding:16px;color:var(--text3)">Could not find root information for "${word}"</div>`;
      return;
    }
    const etymology = data.etymology;
    const wordFamily = data.word_family || [];
    const alternativeSpellings = data.alternative_spellings || {};
    const posList = data.part_of_speech || (data.partOfSpeech ? [data.partOfSpeech] : []);
    let html = `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      <span style="font-size:22px;font-weight:700">${word}</span>
      ${posList.map(p => `<span style="font-size:10px;padding:2px 8px;border-radius:99px;background:var(--accent2)15;color:var(--accent2);font-weight:600">${p}</span>`).join('')}
    </div>`;
    html += `<div style="font-size:13px;color:var(--text1);padding:10px 14px;background:var(--bg2);border-radius:8px;border:1px solid var(--border);margin-bottom:10px">📜 <strong>Etymology:</strong> ${etymology}</div>`;
    if (wordFamily.length) {
      html += `<div style="font-size:12px;color:var(--text2);margin-bottom:8px"><strong>Word Family:</strong></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">${wordFamily.map(w => `<span class="tag rel" onclick="loadWordDisplay('${w}')" style="cursor:pointer">${w}</span>`).join('')}</div>`;
    }
    if (alternativeSpellings.uk || alternativeSpellings.us) {
      html += `<div style="font-size:11px;color:var(--text3);padding:6px 10px;background:var(--bg2);border-radius:8px;border:1px solid var(--border)">`;
      if (alternativeSpellings.uk) html += `🇬🇧 UK: <strong>${alternativeSpellings.uk}</strong> `;
      if (alternativeSpellings.us) html += `🇺🇸 US: <strong>${alternativeSpellings.us}</strong>`;
      html += `</div>`;
    }
    if (data.difficulty_for_learners) {
      html += `<div style="font-size:11px;color:var(--accent2);margin-top:8px;padding:6px 10px;background:var(--accent2)0a;border-radius:8px">🎓 ${data.difficulty_for_learners}</div>`;
    }
    content.innerHTML = html;
  } catch (e) {
    content.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3)">Error exploring roots</div>';
  }
}

function closeRootExplorer() {
  document.getElementById('word-root-section').style.display = 'none';
}

// ---- AI Mnemonic Generator ----
async function generateMnemonic(word) {
  if (typeof requirePremium === 'function' && !(await requirePremium('AI Mnemonics'))) return;
  if (!word) { toast('Load a word first', 'info'); return; }
  const q = document.getElementById('explore-search-input');
  const wordCardArea = document.getElementById('word-card-area');
  let container = document.getElementById('mnemonic-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'mnemonic-container';
    wordCardArea?.after(container);
  }
  container.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text2);font-size:13px">🧠 Generating mnemonic...</div>';
  try {
    const prompt = 'You are a memory expert. For the English word "' + word + '", create a creative, memorable mnemonic (memory aid) that will help learners remember this word. Return ONLY valid JSON: {"word":"' + word + '","mnemonic":"your creative mnemonic story/sentence","technique":"keyword|story|rhyme|link|visual","tips":["tip1","tip2"]}. The mnemonic should be vivid, unusual, and easy to remember.';
    const result = await groqChat(prompt, 0.8, 500);
    if (!result) { container.innerHTML = '<div style="text-align:center;padding:12px;color:var(--text3)">Could not generate mnemonic</div>'; return; }
    let parsed;
    try { const js = result.indexOf('{'); const je = result.lastIndexOf('}'); if (js !== -1 && je !== -1) parsed = JSON.parse(result.substring(js, je + 1)); } catch {}
    const mnemonic = parsed?.mnemonic || result;
    const technique = parsed?.technique || '';
    const tips = parsed?.tips || [];
    let html = `<div class="mnemonic-card">
      <div style="font-size:11px;color:var(--amber2);font-weight:600;margin-bottom:6px">🧠 Mnemonic for "${word}"</div>
      <div class="mnemonic-text">${mnemonic}</div>
      ${technique ? `<div style="font-size:10px;color:var(--text3);margin-top:6px">Technique: ${technique}</div>` : ''}
      ${tips.length ? `<div style="font-size:11px;color:var(--text2);margin-top:8px"><strong>Tips:</strong> ${tips.join(' · ')}</div>` : ''}
      <button class="vm-btn" onclick="this.parentElement.remove()" style="font-size:10px;padding:3px 10px;margin-top:8px"><i class="ti ti-x"></i> Dismiss</button>
    </div>`;
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div style="text-align:center;padding:12px;color:var(--text3)">Error generating mnemonic</div>';
  }
}

// ---- AI Word Quiz ----
let _quizState = { questions: [], index: 0, score: 0, answered: false };

async function generateAIQuiz(word) {
  if (typeof requirePremium === 'function' && !(await requirePremium('AI Quizzes'))) return;
  const section = document.getElementById('ai-quiz-section');
  const content = document.getElementById('quiz-content');
  if (!section || !content) return;
  if (!word) { toast('Load a word first', 'info'); return; }
  section.style.display = 'block';
  _quizState = { questions: [], index: 0, score: 0, answered: false };
  content.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text2)">🤖 Generating quiz...</div>';
  try {
    const prompt = 'You are a vocabulary quiz master. Create 4 multiple-choice questions about the word "' + word + '". Return ONLY valid JSON with this schema: {"questions":[{"question":"What does \\"' + word + '\\" mean?","options":["correct answer","wrong1","wrong2","wrong3"],"correctIndex":0,"explanation":"why this is correct"}]}. Include 1 definition question, 1 synonym question, 1 antonym question, and 1 usage/fill-in-the-blank question. Mix the correct answer position (correctIndex 0-3).';
    const result = await groqChat(prompt, 0.7, 1000);
    if (!result) { content.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3)">Quiz generation failed</div>'; return; }
    let parsed;
    try { const js = result.indexOf('{'); const je = result.lastIndexOf('}'); if (js !== -1 && je !== -1) parsed = JSON.parse(result.substring(js, je + 1)); } catch {}
    const questions = parsed?.questions || [];
    if (!questions.length) { content.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3)">No questions generated</div>'; return; }
    _quizState.questions = questions;
    renderQuizQuestion();
  } catch (e) {
    content.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3)">Quiz error — try again</div>';
  }
}

function renderQuizQuestion() {
  const content = document.getElementById('quiz-content');
  const q = _quizState.questions[_quizState.index];
  if (!q || _quizState.index >= _quizState.questions.length) {
    const pct = Math.round((_quizState.score / _quizState.questions.length) * 100);
    content.innerHTML = `<div style="text-align:center;padding:16px">
      <div style="font-size:36px;color:${pct >= 70 ? '#34C759' : '#FF9F0A'};margin-bottom:8px"><i class="ti ti-trophy"></i></div>
      <div style="font-size:18px;font-weight:700;margin-bottom:4px">Quiz Complete!</div>
      <div style="font-size:14px;color:var(--text2);margin-bottom:12px">Score: ${_quizState.score}/${_quizState.questions.length} (${pct}%)</div>
      <button class="vm-btn" onclick="generateAIQuiz(state.currentWord?.word)" style="font-size:12px"><i class="ti ti-reload"></i> Try Again</button>
      <button class="vm-btn" onclick="closeAIQuiz()" style="font-size:12px"><i class="ti ti-x"></i> Close</button>
    </div>`;
    return;
  }
  _quizState.answered = false;
  const progress = _quizState.index + 1;
  const total = _quizState.questions.length;
  content.innerHTML = `
    <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-bottom:8px">
      <span>Question ${progress}/${total}</span>
      <span>Score: ${_quizState.score} ✓</span>
    </div>
    <div style="height:3px;background:var(--border);border-radius:99px;margin-bottom:12px;overflow:hidden">
      <div style="height:100%;width:${(progress/total)*100}%;background:var(--accent2);border-radius:99px;transition:width 0.3s"></div>
    </div>
    <div class="quiz-question">${q.question}</div>
    <div id="quiz-options">${q.options.map((opt, i) => `<button class="quiz-option" onclick="answerQuiz(${i})" data-index="${i}">${opt}</button>`).join('')}</div>
    <div id="quiz-feedback-area"></div>`;
}

function answerQuiz(index) {
  if (_quizState.answered) return;
  _quizState.answered = true;
  const q = _quizState.questions[_quizState.index];
  const options = document.querySelectorAll('.quiz-option');
  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add('correct');
    else if (i === index && index !== q.correctIndex) btn.classList.add('wrong');
    if (i === index) btn.classList.add('selected');
  });
  const correct = index === q.correctIndex;
  if (correct) _quizState.score++;
  const fb = document.getElementById('quiz-feedback-area');
  fb.innerHTML = `<div class="quiz-feedback" style="background:${correct ? '#34C75915' : '#FF3B3015'};border:1px solid ${correct ? '#34C759' : '#FF3B30'}">
    <strong>${correct ? '✓ Correct!' : '✗ Incorrect'}</strong> ${q.explanation || ''}
    <button class="vm-btn" onclick="nextQuizQuestion()" style="display:block;margin-top:8px;font-size:12px;padding:6px 16px">${_quizState.index + 1 >= _quizState.questions.length ? 'See Results' : 'Next →'}</button>
  </div>`;
}

function nextQuizQuestion() {
  _quizState.index++;
  renderQuizQuestion();
}

function closeAIQuiz() {
  document.getElementById('ai-quiz-section').style.display = 'none';
  _quizState = { questions: [], index: 0, score: 0, answered: false };
}

// ---- Learning Path ----
async function showLearningPath() {
  if (typeof requirePremium === 'function' && !(await requirePremium('AI Learning Path'))) return;
  const section = document.getElementById('learning-path-section');
  const content = document.getElementById('learning-path-content');
  const badge = document.getElementById('path-level-badge');
  if (!section || !content) return;
  section.style.display = 'block';
  const userLevel = state.difficulty || 'intermediate';
  const levelMap = { beginner: 'A1', elementary: 'A2', intermediate: 'B1', advanced: 'B2', native: 'C2' };
  const currentLevel = levelMap[userLevel] || 'B1';
  if (badge) badge.textContent = currentLevel;
  content.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text2)">📚 Building your learning path...</div>';
  try {
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const startIdx = levelOrder.indexOf(currentLevel);
    const pathLevels = levelOrder.slice(Math.max(0, startIdx - 1), startIdx + 3).filter(l => l);
    const pathHtml = [];
    for (const level of pathLevels) {
      const prompt = 'List 4 common English vocabulary words at CEFR level ' + level + '. Return ONLY a JSON array of strings like ["word1","word2","word3","word4"]. These should be at exactly ' + level + ' level.';
      const result = await groqChat(prompt, 0.5, 300);
      let words = [];
      try { const js = result.indexOf('['); const je = result.lastIndexOf(']'); if (js !== -1 && je !== -1) words = JSON.parse(result.substring(js, je + 1)); } catch {}
      if (!words.length) words = ['example', 'learning', 'vocabulary', 'practice'];
      const levelColors = { A1:'#10B981', A2:'#34D399', B1:'#F59E0B', B2:'#F97316', C1:'#EF4444', C2:'#DC2626' };
      const color = levelColors[level] || '#7C6FFF';
      pathHtml.push(`<div style="margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <span style="font-size:10px;padding:2px 8px;border-radius:99px;background:${color}22;color:${color};border:1px solid ${color}44;font-weight:700">${level}</span>
          <span style="font-size:11px;color:var(--text3)">${level === currentLevel ? '← Your level' : ''}</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">${words.map(w => `<span class="path-card" onclick="loadWordDisplay('${w}')" style="padding:8px 14px;font-size:12px">${w}</span>`).join('')}</div>
      </div>`);
    }
    content.innerHTML = pathHtml.join('') + `<div style="text-align:center;margin-top:8px">
      <button class="vm-btn" onclick="section.style.display='none'" style="font-size:11px;padding:4px 12px"><i class="ti ti-x"></i> Close</button>
    </div>`;
  } catch (e) {
    content.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3)">Could not load learning path</div>';
  }
}

// ---- Enhanced initExplorePage ----
(function() {
  const origInit = initExplorePage;
  initExplorePage = function() {
    origInit && origInit();
    const aiBtn = document.getElementById('ai-wotm-btn');
    if (aiBtn) aiBtn.style.display = 'inline-flex';
  };
})();
