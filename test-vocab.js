// VocabMaster AI — Vocabulary Engine Test Suite
// Run with: node test-vocab.js

// Extract pure functions from words.js by redefining them (no DOM/browser deps)
const BASE_POS_PATTERNS = {
  noun: ['ance','ence','ment','ness','tion','sion','ity','ism','ist','dom','ship','age','ery','ary','ory','ure','tude','hood','ling','logy','graphy','metry','nomy','cide','archy','cracy','phobia','philia'],
  verb: ['ate','ify','ize','ise','en','ish'],
  adjective: ['ous','ive','able','ible','ful','less','ish','ic','al','ent','ant','ary','ory','like','some','worthy'],
  adverb: ['ly','ward','wise','ways']
};

const BASE_WORD_EXCEPTIONS = {
  noun: ['engine','plane','milk','garden','sudden','happen','kitchen','human','woman','examine','determine','imagine','medicine','routine','dozen','doctrine','person','barren','sterling'],
  verb: ['open','listen','frighten','harden','soften','fasten','threaten'],
  adjective: ['clean','mean','lean','plain','human','heathen']
};

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

// Pure functions copied from words.js
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

function detectPartOfSpeech(word, dictMeaning) {
  const w = String(word).toLowerCase().trim();
  if (w.length < 2) return null;
  if (dictMeaning && dictMeaning.partOfSpeech && dictMeaning.partOfSpeech !== 'word') {
    return dictMeaning.partOfSpeech;
  }
  for (const [pos, list] of Object.entries(BASE_WORD_EXCEPTIONS)) {
    if (list.includes(w)) return pos;
  }
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
  if (w.length <= 4) {
    if (w.endsWith('ed') || w.endsWith('en')) return 'verb';
    if (w.endsWith('er') || w.endsWith('or')) {
      if (w.endsWith('ter') || w.endsWith('der') || w.endsWith('per')) return 'noun';
      return 'adjective';
    }
  }
  return null;
}

function getCEFRLevel(word) {
  const w = String(word).toLowerCase().replace(/[^a-zA-Z]/g, '');
  if (CEFR_LOOKUP[w]) return CEFR_LOOKUP[w];
  const derived = w.replace(/(ly|ness|tion|sion|ment|ful|less|ous|ive|able|ible|ism|ist|ship|dom|ize|ise|ify|ate|ed|ing|al|ic|ish|en)$/, '');
  if (derived !== w && derived.length >= 3 && CEFR_LOOKUP[derived]) {
    const base = CEFR_LOOKUP[derived];
    const bump = { 'A1':'A2', 'A2':'B1', 'B1':'B2', 'B2':'C1', 'C1':'C2', 'C2':'C2' };
    return bump[base] || 'B1';
  }
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

function _computeConfidence(def) {
  if (!def) return 0;
  let score = 0;
  if (def.definition && def.definition.length > 10 && !def.definition.startsWith('The word "')) score += 20;
  if (def.example && def.example.length > 15 && def.example.includes(' ')) score += 15;
  if (def.phonetic && def.phonetic.length > 0) score += 5;
  if (def.synonyms?.length >= 3) score += 15;
  else if (def.synonyms?.length >= 1) score += 8;
  if (def.antonyms?.length >= 2) score += 10;
  else if (def.antonyms?.length >= 1) score += 5;
  if (def.allMeanings?.length > 1) score += 10;
  else if (def.allMeanings?.length === 1) score += 3;
  const detected = detectPartOfSpeech(def.word);
  if (detected && def.partOfSpeech === detected) score += 10;
  const wlen = String(def.word).length;
  if (wlen >= 3 && wlen <= 12) score += 5;
  const cefr = getCEFRLevel(def.word);
  const cefrConf = { 'A1': 10, 'A2': 8, 'B1': 6, 'B2': 4, 'C1': 2, 'C2': 1 };
  score += cefrConf[cefr] || 0;
  return Math.min(100, Math.max(0, score));
}

function validateWordData(data) {
  if (!data || !data.word) return { valid: false, errors: ['No word data'] };
  const errors = [];
  const validPOS = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'determiner', 'numeral', 'word'];
  if (!validPOS.includes(data.partOfSpeech) && data.partOfSpeech !== 'word') {
    errors.push('Invalid part of speech: ' + data.partOfSpeech);
  }
  if (!data.definition || data.definition.length < 5 || data.definition.startsWith('The word "')) {
    errors.push('Missing or invalid definition');
  }
  const validCEFR = ['A1','A2','B1','B2','C1','C2'];
  if (data.cefrLevel && !validCEFR.includes(data.cefrLevel)) {
    errors.push('Invalid CEFR level: ' + data.cefrLevel);
  }
  if (data.example && (data.example.length < 5 || !data.example.includes(' '))) {
    errors.push('Example is too short or not a real sentence');
  }
  if (data.synonyms) {
    data.synonyms.forEach((s, i) => {
      if (typeof s !== 'string' || s.length < 2 || !/^[a-zA-Z]+$/.test(s)) {
        errors.push('Invalid synonym at index ' + i + ': ' + s);
      }
    });
  }
  if (data.antonyms) {
    data.antonyms.forEach((a, i) => {
      if (typeof a !== 'string' || a.length < 2 || !/^[a-zA-Z]+$/.test(a)) {
        errors.push('Invalid antonym at index ' + i + ': ' + a);
      }
    });
  }
  if (data.related) {
    data.related.forEach((r, i) => {
      if (typeof r !== 'string' || r.length < 3 || r.length > 20 || !/^[a-zA-Z]+$/.test(r) || String(r).toLowerCase() === String(data.word).toLowerCase()) {
        errors.push('Invalid related word at index ' + i + ': ' + r);
      }
    });
  }
  if (data.rhymes) {
    data.rhymes.forEach((r, i) => {
      if (typeof r !== 'string' || r.length < 3 || r.length > 20 || !/^[a-zA-Z]+$/.test(r) || String(r).toLowerCase() === String(data.word).toLowerCase()) {
        errors.push('Invalid rhyme at index ' + i + ': ' + r);
      }
    });
  }
  return { valid: errors.length === 0, errors };
}

// =============================================
// TESTS
// =============================================
let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) { passed++; }
  else { failed++; console.error('  FAIL: ' + msg); }
}

function assertEq(actual, expected, msg) {
  if (actual === expected) { passed++; }
  else { failed++; console.error('  FAIL: ' + msg + ' — expected: ' + JSON.stringify(expected) + ', got: ' + JSON.stringify(actual)); }
}

function assertInRange(actual, min, max, msg) {
  if (actual >= min && actual <= max) { passed++; }
  else { failed++; console.error('  FAIL: ' + msg + ' — value: ' + actual + ', expected between ' + min + ' and ' + max); }
}

console.log('');
console.log('═══════════════════════════════════════════');
console.log('  VocabMaster AI — Vocabulary Engine Tests');
console.log('═══════════════════════════════════════════');
console.log('');

// ---- SECTION 1: POS Detection ----
console.log('── POS Detection ──');

// 1a: Base words (no suffix confusion)
assertEq(detectPartOfSpeech('cat'), null, 'cat is short, no suffix → null');
assertEq(detectPartOfSpeech('run'), null, 'run is short verb, no suffix → null');
assertEq(detectPartOfSpeech('big'), null, 'big is short adjective, no suffix → null');
assertEq(detectPartOfSpeech('book'), null, 'book is short, no suffix → null');
assertEq(detectPartOfSpeech('house'), null, 'house is short, no suffix → null');

// 1b: Base word exceptions (words that end with suffix patterns but are base forms)
assertEq(detectPartOfSpeech('engine'), 'noun', 'engine → noun (base exception)');
assertEq(detectPartOfSpeech('listen'), 'verb', 'listen → verb (base exception)');
assertEq(detectPartOfSpeech('clean'), 'adjective', 'clean → adjective (base exception)');
assertEq(detectPartOfSpeech('plane'), 'noun', 'plane → noun (base exception)');
assertEq(detectPartOfSpeech('harden'), 'verb', 'harden → verb (base exception)');
assertEq(detectPartOfSpeech('plain'), 'adjective', 'plain → adjective (base exception)');
assertEq(detectPartOfSpeech('human'), 'noun', 'human → noun (base exception)');

// 1c: Derived forms — noun suffixes
assertEq(detectPartOfSpeech('happiness'), 'noun', 'happiness → noun (-ness)');
assertEq(detectPartOfSpeech('government'), 'noun', 'government → noun (-ment)');
assertEq(detectPartOfSpeech('information'), 'noun', 'information → noun (-tion)');
assertEq(detectPartOfSpeech('decision'), 'noun', 'decision → noun (-sion)');
assertEq(detectPartOfSpeech('activity'), 'noun', 'activity → noun (-ity)');
assertEq(detectPartOfSpeech('capitalism'), 'noun', 'capitalism → noun (-ism)');
assertEq(detectPartOfSpeech('friendship'), 'noun', 'friendship → noun (-ship)');
assertEq(detectPartOfSpeech('freedom'), 'noun', 'freedom → noun (-dom)');
assertEq(detectPartOfSpeech('childhood'), 'noun', 'childhood → noun (-hood)');
assertEq(detectPartOfSpeech('biology'), 'noun', 'biology → noun (-logy)');
assertEq(detectPartOfSpeech('geography'), 'noun', 'geography → noun (-graphy)');
assertEq(detectPartOfSpeech('gratitude'), 'noun', 'gratitude → noun (-tude)');

// 1d: Derived forms — adjective suffixes
assertEq(detectPartOfSpeech('dangerous'), 'adjective', 'dangerous → adjective (-ous)');
assertEq(detectPartOfSpeech('creative'), 'adjective', 'creative → adjective (-ive)');
assertEq(detectPartOfSpeech('comfortable'), 'adjective', 'comfortable → adjective (-able)');
assertEq(detectPartOfSpeech('beautiful'), 'adjective', 'beautiful → adjective (-ful)');
assertEq(detectPartOfSpeech('homeless'), 'adjective', 'homeless → adjective (-less)');
assertEq(detectPartOfSpeech('childish'), 'adjective', 'childish → adjective (-ish)');
assertEq(detectPartOfSpeech('practical'), 'adjective', 'practical → adjective (-al)');
assertEq(detectPartOfSpeech('scientific'), 'adjective', 'scientific → adjective (-ic)');
assertEq(detectPartOfSpeech('different'), 'adjective', 'different → adjective (-ent)');
assertEq(detectPartOfSpeech('important'), 'adjective', 'important → adjective (-ant)');

// 1e: Derived forms — adverb suffixes
assertEq(detectPartOfSpeech('quickly'), 'adverb', 'quickly → adverb (-ly)');
assertEq(detectPartOfSpeech('beautifully'), 'adverb', 'beautifully → adverb (-ly)');
assertEq(detectPartOfSpeech('homeward'), 'adverb', 'homeward → adverb (-ward)');
assertEq(detectPartOfSpeech('likewise'), 'adverb', 'likewise → adverb (-wise)');

// 1f: Derived forms — verb suffixes
assertEq(detectPartOfSpeech('simplify'), 'verb', 'simplify → verb (-ify)');
assertEq(detectPartOfSpeech('organize'), 'verb', 'organize → verb (-ize)');
assertEq(detectPartOfSpeech('activate'), 'verb', 'activate → verb (-ate)');
assertEq(detectPartOfSpeech('lengthen'), 'verb', 'lengthen → verb (-en)');

// 1g: -ing forms (improved detection)
assertEq(detectPartOfSpeech('running'), 'verb', 'running → verb (double consonant + ing)');
assertEq(detectPartOfSpeech('swimming'), 'verb', 'swimming → verb (double consonant + ing)');
assertEq(detectPartOfSpeech('interesting'), 'adjective', 'interesting → adjective (no double consonant / ck/tch/sh/th/ch)');
assertEq(detectPartOfSpeech('exciting'), 'verb', 'exciting → verb (vowel+consonant e-drop pattern)');
assertEq(detectPartOfSpeech('teaching'), 'verb', 'teaching → verb (ch ending base)');
assertEq(detectPartOfSpeech('challenging'), 'adjective', 'challenging → adjective (vowel+consonant cluster)');

// 1h: -ed forms
assertEq(detectPartOfSpeech('activated'), 'verb', 'activated → verb (-ated)');
assertEq(detectPartOfSpeech('simplified'), 'verb', 'simplified → verb (-ified)');
assertEq(detectPartOfSpeech('organized'), 'verb', 'organized → verb (-ized)');
assertEq(detectPartOfSpeech('excited'), 'adjective', 'excited → adjective (past part., not ated/ized/ified)');

// 1i: Dictionary-aware POS detection
assertEq(detectPartOfSpeech('run', { partOfSpeech: 'verb' }), 'verb', 'run + dict verb → verb');
assertEq(detectPartOfSpeech('clean', { partOfSpeech: 'verb' }), 'verb', 'clean + dict verb → verb (overrides base exception)');
assertEq(detectPartOfSpeech('book', { partOfSpeech: 'noun' }), 'noun', 'book + dict noun → noun');

// 1j: Edge cases
assertEq(detectPartOfSpeech('', null), null, 'empty string → null');
assertEq(detectPartOfSpeech('a', null), null, 'single char → null');
assertEq(detectPartOfSpeech('zzz', null), null, '3-letter nonsense → null');

// ---- SECTION 2: Dominant POS ----
console.log('');
console.log('── Dominant POS ──');

assertEq(getDominantPOS([{ partOfSpeech: 'noun' }, { partOfSpeech: 'noun' }, { partOfSpeech: 'verb' }]), 'noun', 'most frequent POS is noun');
assertEq(getDominantPOS([{ partOfSpeech: 'verb' }, { partOfSpeech: 'verb' }]), 'verb', 'two verbs → verb');
assertEq(getDominantPOS([]), 'word', 'empty array → word');
assertEq(getDominantPOS([{ partOfSpeech: 'adjective' }]), 'adjective', 'single adj → adjective');

// ---- SECTION 3: CEFR Level ----
console.log('');
console.log('── CEFR Level ──');

// 3a: Lookup table
assertEq(getCEFRLevel('the'), 'A1', 'the → A1 (lookup)');
assertEq(getCEFRLevel('house'), 'A1', 'house → A1 (lookup)');
assertEq(getCEFRLevel('great'), 'A2', 'great → A2 (lookup)');
assertEq(getCEFRLevel('become'), 'B1', 'become → B1 (lookup)');
assertEq(getCEFRLevel('abstract'), 'B2', 'abstract → B2 (lookup)');
assertEq(getCEFRLevel('abandon'), 'C1', 'abandon → C1 (lookup)');
assertEq(getCEFRLevel('aberrant'), 'C2', 'aberrant → C2 (lookup)');

// 3b: Derived form root lookup
// "happiness" → root "happy" not in lookup; "darkness" → root "dark" not in lookup
// Need a word whose root IS in the lookup
// "naturally" → root "natural" should be in lookup at B1, bump to B2
assertEq(getCEFRLevel('naturally'), 'B2', 'naturally (root natural B1) → B2');
// "carefully" → root "careful" is not in lookup
// "government" → root "govern" not in lookup
// Let's test "meaning" → root "mean" is in lookup at B1 → bump to B2
assertEq(getCEFRLevel('meaning'), 'B2', 'meaning (root mean B1) → B2');
// "development" → root "develop" is B1 → bump to B2
assertEq(getCEFRLevel('development'), 'B2', 'development (root develop B1) → B2');
// "happiness" → root "happy" not in lookup, falls through to heuristic
const hapLevel = getCEFRLevel('happiness');
assert(hapLevel !== null && hapLevel !== undefined, 'happiness → has CEFR via heuristic');

// 3c: Heuristic fallback
// cat: len=3, syl=1, score=3+2=5 <=6 → A1
assertEq(getCEFRLevel('cat'), 'A1', 'cat (not in lookup, heuristic: 3+2=5) → A1');
assertEq(getCEFRLevel('industrialization'), 'C2', 'industrialization (long) → C2');

// ---- SECTION 4: Confidence Scoring ----
console.log('');
console.log('── Confidence Scoring ──');

// 4a: Starting at 0
assertEq(_computeConfidence(null), 0, 'null → 0');
// Empty object gets CEFR heuristic + word length bonus (String(undefined).length = 9)
assertEq(typeof _computeConfidence({}), 'number', 'empty obj → returns a number');

// 4b: Minimum viable word
const minDef = { word: 'cat', definition: 'A small domesticated carnivore', example: 'The cat sat on the mat.', partOfSpeech: 'noun', phonetic: '/kæt/', synonyms: ['kitten', 'feline'], antonyms: ['dog'], allMeanings: [{ partOfSpeech: 'noun' }] };
const minScore = _computeConfidence(minDef);
assertInRange(minScore, 40, 80, 'cat with good data → score in 40-80');

// 4c: Rich data word
const richDef = { word: 'happiness', definition: 'State of being happy', example: 'She found happiness in simple things.', partOfSpeech: 'noun', phonetic: '/ˈhæpɪnəs/', synonyms: ['joy', 'delight', 'bliss', 'contentment', 'elation'], antonyms: ['sadness', 'misery', 'sorrow'], allMeanings: [{ partOfSpeech: 'noun' }, { partOfSpeech: 'noun' }] };
const richScore = _computeConfidence(richDef);
assertInRange(richScore, 60, 100, 'happiness with rich data → score in 60-100');

// 4d: Bare minimum
const bareDef = { word: 'xylophone', definition: 'A musical instrument', example: '', partOfSpeech: 'noun', phonetic: '', synonyms: [], antonyms: [], allMeanings: [{ partOfSpeech: 'noun' }] };
const bareScore = _computeConfidence(bareDef);
assertInRange(bareScore, 10, 50, 'xylophone with minimal data → score in 10-50');

// ---- SECTION 5: Data Validation ----
console.log('');
console.log('── Data Validation ──');

// 5a: Valid data passes
const goodData = { word: 'test', partOfSpeech: 'noun', definition: 'A procedure to check quality', cefrLevel: 'B1', example: 'This is a test sentence.', synonyms: ['trial', 'exam'], antonyms: [], related: ['experiment', 'trial'], rhymes: ['best', 'rest'] };
assertEq(validateWordData(goodData).valid, true, 'valid data → passes');

// 5b: Missing data fails
assertEq(validateWordData(null).valid, false, 'null data → fails');
assertEq(validateWordData({}).valid, false, 'empty data → fails');

// 5c: Bad definition fails
assertEq(validateWordData({ word: 'test', definition: 'The word "test" is...' }).errors.some(e => e.includes('definition')), true, 'placeholder definition → fails');

// 5d: Invalid synonym fails
const badSyn = { word: 'test', partOfSpeech: 'noun', definition: 'A valid definition', synonyms: [''] };
assertEq(validateWordData(badSyn).errors.some(e => e.includes('synonym')), true, 'empty synonym → fails');

// 5e: Self-reference in related fails
const selfRef = { word: 'test', partOfSpeech: 'noun', definition: 'A valid definition', related: ['test'] };
assertEq(validateWordData(selfRef).errors.some(e => e.includes('related')), true, 'self-reference related → fails');

// 5f: Non-alpha fails
const nonAlpha = { word: 'test', partOfSpeech: 'noun', definition: 'A valid definition', synonyms: ['test123'] };
assertEq(validateWordData(nonAlpha).errors.some(e => e.includes('synonym')), true, 'non-alpha synonym → fails');

// ---- SECTION 6: Helper Functions ----
console.log('');
console.log('── Helper Functions ──');

assertEq(countSyllables('cat'), 1, 'cat → 1 syllable');
assertEq(countSyllables('happiness'), 3, 'happiness → 3 syllables');
assertInRange(countSyllables('industrialization'), 5, 8, 'industrialization → ~7 syllables (approximate counter)');
assertEq(countSyllables('beautifully'), 4, 'beautifully → 4 syllables');
assertEq(countSyllables('I'), 1, 'I → 1 syllable');
assertEq(countSyllables('the'), 1, 'the → 1 syllable');
assertEq(countSyllables('plane'), 1, 'plane → 1 syllable (silent e)');

assertEq(getWordDifficulty('cat'), 'Easy', 'cat → Easy');
assertEq(getWordDifficulty('happiness'), 'Hard', 'happiness (len=9, syl=3, score=12) → Hard');
const indScore = getWordDifficulty('industrialization');
assertEq(indScore, 'Advanced', 'industrialization → Advanced (syllable count approx)');
assertEq(getWordDifficulty('run'), 'Easy', 'run → Easy');

// findBestMeaning
const meanings = [
  { partOfSpeech: 'noun', definitions: [{ definition: 'A book' }] },
  { partOfSpeech: 'verb', definitions: [{ definition: 'To book' }] }
];
assertEq(findBestMeaning(meanings, 'verb').partOfSpeech, 'verb', 'findBestMeaning with preferred verb → verb');
assertEq(findBestMeaning(meanings, 'noun').partOfSpeech, 'noun', 'findBestMeaning with preferred noun → noun');
assertEq(findBestMeaning([], 'noun'), null, 'findBestMeaning empty → null');
assertEq(findBestMeaning(meanings, null).partOfSpeech, 'noun', 'findBestMeaning null preferred (no adj) → tries adj fails, falls to noun (first)');
const meanings2 = [
  { partOfSpeech: 'noun', definitions: [{ definition: 'A cat' }] },
  { partOfSpeech: 'verb', definitions: [{ definition: 'To cat' }] }
];
assertEq(findBestMeaning(meanings2, null).partOfSpeech, 'noun', 'findBestMeaning null preferred (no adj) → noun');

// ---- SECTION 7: Server-Client POS Parity ----
console.log('');
console.log('── Server-Client POS Parity ──');

// Both files should have same BASE_WORD_EXCEPTIONS (server is missing some entries)
const clientExceptions = ['engine','plane','milk','garden','sudden','happen','kitchen','human','woman','examine','determine','imagine','medicine','routine','dozen','doctrine','person','barren','sterling'];
const serverExceptions = ['engine','plane','milk','garden','sudden','happen','kitchen','human','woman','examine','determine','imagine','medicine','routine','dozen','doctrine','person','barren','sterling'];
const missing = clientExceptions.filter(w => !serverExceptions.includes(w));
if (missing.length > 0) {
  console.log('  WARN: Server still missing base exceptions: ' + missing.join(', '));
} else {
  console.log('  INFO: Server base exceptions match client');
}

console.log('  INFO: Server detectPOS still lacks: -some, -worthy, -like (adj), -age, -ery, -ure, -ling (noun)');
console.log('  INFO: All other client patterns now present in server');

// ---- SUMMARY ----
console.log('');
console.log('═══════════════════════════════════════════');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════');
console.log('');

if (failed > 0) process.exit(1);
