// SECURE: Piyala — Secure API Layer
// Handles all backend communication with httpOnly cookies and CSRF protection
// localStorage continues to work as fallback when offline/unauthorized

const SECURE_API = (() => {
  // Config
  const IS_FILE_PROTOCOL = window.location.protocol === 'file:';
  const IS_LOCAL = !IS_FILE_PROTOCOL && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const BASE_URL = IS_FILE_PROTOCOL ? 'http://localhost:3001' : window.location.origin;

  // Track API attempts to prevent repeated failed requests to unavailable backends
  let apiFailCount = 0;
  const MAX_API_FAILS = 3;
  const API_COOLDOWN_MS = 60000; // 1 minute cooldown after max fails

  let csrfToken = null;
  let currentUser = JSON.parse(sessionStorage.getItem('vm_secure_user') || 'null');
  let isSyncing = false;
  let _isRetryQueue = false;

  // SECURE: Get or generate anonymous device ID
  function getDeviceId() {
    let id = localStorage.getItem('vm_device_id');
    if (!id) {
      const arr = new Uint8Array(24);
      crypto.getRandomValues(arr);
      id = Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem('vm_device_id', id);
    }
    return id;
  }

  // SECURE: Get CSRF token from cookie (backend yo'q bo'lsa null)
  function getCsrfToken() {
    if (csrfToken) return csrfToken;
    const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
    csrfToken = match ? match[1] : null;
    return csrfToken;
  }

  // SECURE: Make authenticated API request
  async function apiRequest(method, path, body = null) {
    const cooldown = parseInt(localStorage.getItem('vm_api_cooldown') || '0');
    if (apiFailCount >= MAX_API_FAILS && Date.now() < cooldown) return null;
    if (Date.now() >= cooldown) apiFailCount = 0;
    const url = `${BASE_URL}${path}`;
    const headers = { 'Content-Type': 'application/json' };

    // Only add CSRF for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const token = getCsrfToken();
      if (token) headers['X-CSRF-Token'] = token;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: body ? JSON.stringify(body) : null,
      });

      // Handle CSRF token rotation
      const newCsrf = response.headers.get('X-CSRF-Token');
      if (newCsrf) csrfToken = newCsrf;

      const data = await response.json();

      if (!response.ok) {
        // Handle token expiry
        if (data.code === 'TOKEN_EXPIRED') {
          const refreshed = await refreshTokens();
          if (refreshed) return apiRequest(method, path, body);
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.error || 'Request failed');
      }

      // Update CSRF from response body
      if (data.csrfToken) csrfToken = data.csrfToken;

      return data;
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('ERR_CONNECTION_REFUSED')) {
        apiFailCount++;
        if (apiFailCount >= MAX_API_FAILS) {
          localStorage.setItem('vm_api_cooldown', String(Date.now() + API_COOLDOWN_MS));
          console.warn('SECURE: Backend unavailable after ' + MAX_API_FAILS + ' attempts — cooling down for 1 min');
        }
        return null;
      }
      throw err;
    }
  }

  // SECURE: Register new user
  async function register(username, email, password) {
    const data = await apiRequest('POST', '/api/auth/register', { username, email, password });
    if (data?.user) {
      currentUser = data.user;
      sessionStorage.setItem('vm_secure_user', JSON.stringify(data.user));
      if (data.csrfToken) csrfToken = data.csrfToken;
      triggerAuthEvent('login');
    }
    return data;
  }

  // SECURE: Login
  async function login(email, password) {
    const data = await apiRequest('POST', '/api/auth/login', { email, password });
    if (data?.user) {
      currentUser = data.user;
      sessionStorage.setItem('vm_secure_user', JSON.stringify(data.user));
      if (data.csrfToken) csrfToken = data.csrfToken;
      triggerAuthEvent('login');
    }
    return data;
  }

  // SECURE: Logout
  async function logout() {
    const data = await apiRequest('POST', '/api/auth/logout');
    currentUser = null;
    csrfToken = null;
    sessionStorage.removeItem('vm_secure_user');
    triggerAuthEvent('logout');
    return data;
  }

  // SECURE: Refresh tokens
  async function refreshTokens() {
    const data = await apiRequest('POST', '/api/auth/refresh');
    if (data?.user) {
      currentUser = data.user;
      sessionStorage.setItem('vm_secure_user', JSON.stringify(data.user));
      if (data.csrfToken) csrfToken = data.csrfToken;
      triggerAuthEvent('login');
      return true;
    }
    return false;
  }

  // SECURE: Get current user
  async function getCurrentUser() {
    if (!currentUser) return null;
    try {
      const data = await apiRequest('GET', '/api/auth/me');
      if (data?.user) {
        currentUser = data.user;
        sessionStorage.setItem('vm_secure_user', JSON.stringify(data.user));
      }
      return data?.user || currentUser;
    } catch {
      return currentUser;
    }
  }

  // SECURE: Sync all user data to server
  async function syncData(stats, favorites, recentWords, grammar) {
    if (isSyncing) return null;
    isSyncing = true;

    try {
      if (currentUser) {
        // Authenticated sync
        const data = await apiRequest('POST', '/api/progress/sync', {
          stats,
          favorites,
          recentWords,
          grammar,
        });
        return data;
      } else if (!IS_FILE_PROTOCOL) {
        // Anonymous sync via device ID (same-origin in production)
        const deviceId = getDeviceId();
        const res = await fetch(`${BASE_URL}/api/anonymous/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId, stats, favorites, recentWords, grammar }),
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Anonymous sync failed');
        return await res.json();
      }
    } catch (err) {
      // Queue for retry (skip if already being retried to avoid duplicates)
      if (!_isRetryQueue) {
        queueSync({ stats, favorites, recentWords, grammar });
        console.warn('SECURE: Sync failed — data queued for retry');
      }
      return null;
    } finally {
      isSyncing = false;
    }
  }

  // SECURE: Load user data from server
  async function loadData() {
    if (currentUser) {
      const data = await apiRequest('GET', '/api/progress/load');
      return data;
    }
    // Anonymous load from device ID (same-origin in production)
    if (IS_FILE_PROTOCOL) return null;
    try {
      const deviceId = getDeviceId();
      const res = await fetch(`${BASE_URL}/api/anonymous/load?deviceId=${encodeURIComponent(deviceId)}`, {
        credentials: 'include',
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  // SECURE: Sync queue for failed requests
  function queueSync(data) {
    const queue = JSON.parse(localStorage.getItem('vm_sync_queue') || '[]');
    queue.push({ data, timestamp: Date.now() });
    // Keep only last 20 entries
    if (queue.length > 20) queue.splice(0, queue.length - 20);
    localStorage.setItem('vm_sync_queue', JSON.stringify(queue));
  }

  // SECURE: Retry queued syncs
  async function retrySyncQueue() {
    const raw = localStorage.getItem('vm_sync_queue');
    if (!raw) return;
    let queue;
    try { queue = JSON.parse(raw); } catch { queue = []; }
    if (!queue.length) return;

    _isRetryQueue = true;
    const remaining = [];
    for (const item of queue) {
      // Skip items older than 1 hour
      if (Date.now() - item.timestamp > 3600000) continue;
      try {
        await syncData(item.data.stats, item.data.favorites, item.data.recentWords, item.data.grammar);
      } catch {
        remaining.push(item);
      }
    }
    _isRetryQueue = false;
    localStorage.setItem('vm_sync_queue', JSON.stringify(remaining));
  }

  // SECURE: Record word interaction (supports both auth and anonymous)
  async function recordWord(word, action, difficulty) {
    if (currentUser) {
      return apiRequest('POST', '/api/progress/word', { word, action, difficulty });
    }
    return null;
  }

  // SECURE: Check authentication status
  function isAuthenticated() {
    return currentUser !== null;
  }

  // SECURE: Get current user info
  function getUser() {
    return currentUser;
  }

  // SECURE: Trigger custom auth events for the app
  function triggerAuthEvent(type) {
    window.dispatchEvent(new CustomEvent('secure-auth-change', {
      detail: { type, user: currentUser },
    }));
  }

  // SECURE: Get profile
  async function getProfile() {
    if (!currentUser) return null;
    return apiRequest('GET', '/api/profile');
  }

  // SECURE: Update profile
  async function updateProfile(profileData) {
    if (!currentUser) return null;
    return apiRequest('PUT', '/api/profile', profileData);
  }

  // SECURE: Telegram register (phone + telegram username + password -> receive code via bot)
  async function telegramRegister(phone, telegram_username, password) {
    const data = await apiRequest('POST', '/api/auth/telegram/register', { phone, telegram_username, password });
    if (data?.user) {
      currentUser = data.user;
      sessionStorage.setItem('vm_secure_user', JSON.stringify(data.user));
      if (data.csrfToken) csrfToken = data.csrfToken;
      triggerAuthEvent('login');
    }
    return data;
  }

  // SECURE: Telegram verify code (after receiving from bot)
  async function telegramVerifyCode(code, sessionId) {
    const data = await apiRequest('POST', '/api/auth/telegram/verify-code', { code, sessionId });
    if (data?.user) {
      currentUser = data.user;
      sessionStorage.setItem('vm_secure_user', JSON.stringify(data.user));
      if (data.csrfToken) csrfToken = data.csrfToken;
      triggerAuthEvent('login');
    }
    return data;
  }

  // SECURE: Telegram login (telegram username + password)
  async function telegramLogin(telegram_username, password) {
    const data = await apiRequest('POST', '/api/auth/telegram/login', { telegram_username, password });
    if (data?.user) {
      currentUser = data.user;
      sessionStorage.setItem('vm_secure_user', JSON.stringify(data.user));
      if (data.csrfToken) csrfToken = data.csrfToken;
      triggerAuthEvent('login');
    }
    return data;
  }

  // SECURE: Change password
  async function changePassword(currentPassword, newPassword) {
    if (!currentUser) return null;
    return apiRequest('PUT', '/api/profile/password', { currentPassword, newPassword });
  }

  // SECURE: Get premium info
  async function getPremiumInfo() {
    if (!currentUser) return null;
    return apiRequest('GET', `/api/auth/telegram/premium/${currentUser.id}`);
  }

  // SECURE: Submit payment request
  async function submitPayment(tier, period, cardType, cardNumber, phone, country) {
    if (!currentUser) return null;
    return apiRequest('POST', '/api/auth/telegram/payment/request', {
      userId: currentUser.id, tier, period, cardType, cardNumber, phone, country
    });
  }

  // SECURE: Get payment history
  async function getPaymentHistory() {
    if (!currentUser) return null;
    return apiRequest('GET', `/api/auth/telegram/payment/history?userId=${currentUser.id}`);
  }

  // Public API
  return {
    apiRequest,
    register,
    login,
    logout,
    refreshTokens,
    getCurrentUser,
    syncData,
    loadData,
    recordWord,
    retrySyncQueue,
    telegramRegister,
    telegramVerifyCode,
    telegramLogin,
    getProfile,
    updateProfile,
    changePassword,
    isAuthenticated,
    getUser,
    getBaseUrl: () => BASE_URL,
    getPremiumInfo,
    submitPayment,
    getPaymentHistory,
  };
})();

// ===== GROQ AI CHAT (global for wotd.js and words.js) =====
async function groqChat(prompt, temperature = 0.7, max_tokens = 1000) {
  try {
    const data = await SECURE_API.apiRequest('POST', '/api/ai/groq', { prompt, temperature, max_tokens });
    return data?.content || null;
  } catch (e) {
    console.warn('groqChat failed:', e);
    return null;
  }
}

// ===== WORD EXPLANATION WITH AI + LOCALSTORAGE CACHING =====
async function explainWordWithAI(word) {
  const cleanWord = String(word).trim().toLowerCase();
  const cacheKey = 'vm_ai_explain_' + cleanWord;

  // Check localStorage cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.explanation) return parsed;
    }
  } catch {}

  // Detect POS for accurate AI generation
  var detectedPOS = null;
  (function() {
    var w = cleanWord;
    if (w.endsWith('tion') || w.endsWith('sion') || w.endsWith('ness') || w.endsWith('ment') || w.endsWith('ity') || w.endsWith('ence') || w.endsWith('ance')) detectedPOS = 'noun';
    else if (w.endsWith('ing') && w.length > 5) detectedPOS = 'adjective';
    else if (w.endsWith('ed') && w.length > 4 && !w.endsWith('eed')) detectedPOS = 'adjective';
    else if (w.endsWith('ous') || w.endsWith('ive') || w.endsWith('able') || w.endsWith('ible') || w.endsWith('ful') || w.endsWith('less') || w.endsWith('ic')) detectedPOS = 'adjective';
    else if (w.endsWith('ly') && w.length > 4) detectedPOS = 'adverb';
    else if (w.endsWith('ize') || w.endsWith('ise') || w.endsWith('ify') || w.endsWith('ate')) detectedPOS = 'verb';
  })();
  var posHint = detectedPOS ? ' The word "' + cleanWord + '" is primarily used as a ' + detectedPOS + '. Make sure the partOfSpeech field reflects this accurately. CRITICAL: The definition, synonyms, antonyms, and example MUST match this part of speech, not the root word form.' : '';

  // Call /api/ai/groq endpoint with enhanced dictionary schema
  const prompt = 'You are a professional English dictionary AI for Uzbek learners. For "' + cleanWord + '", return ONLY valid JSON. Schema: {"word":"' + cleanWord + '","uzbek_translation":"o\'zbekcha tarjima","phonetic":"IPA","ukPhonetic":"UK IPA","usPhonetic":"US IPA","audio_url":null,"level":"A1-C2","frequency_percent":0-100,"frequency_label":"Very Common|Common|Fair|Uncommon|Rare","part_of_speech":["noun","verb","adjective","adverb"],"main_meaning":"short main meaning","simple_definition":"very simple explanation","dictionary_definition":"formal definition","contextual_definition":"contextual explanation","examples":["ex1","ex2","ex3","ex4","ex5"],"definitions":[{"pos":"adjective","definition":"...","example_sentence":"..."}],"synonyms":["syn1","syn2","syn3"],"antonyms":["ant1","ant2"],"collocations":["adj+noun phrase","verb+noun phrase"],"common_contexts":["context1","context2"],"word_forms":{"noun":"","verb":"","adjective":"","adverb":""},"morphology":{"past_tense":"","past_participle":"","plural":"","comparative":"","superlative":""},"word_family":["related word only if real and attested"],"common_phrases":["real idiom or phrase with this word OR empty array"],"common_mistakes":["specific real error with fix OR empty array"],"synonym_discrimination":{"real_synonym":"specific difference OR empty object"},"ielts_expressions":["advanced expression OR empty"],"memory_tip":"creative memory aid","real_life_usage":"how natives use it daily","alternative_spellings":{"uk":"","us":""},"topic_tags":["tag1","tag2"],"difficulty_for_learners":"note","etymology":"From [language] [original word], meaning [original meaning] -> modern meaning","register":"formal|informal|neutral|academic","funFact":"...","usageTip":"..."}.' + posHint + ' RULES: (1) uzbek_translation: give the MOST common Uzbek equivalent. Multiple possible translations separated by commas. (2) etymology: must include origin language + original word. Pattern: "From [language] [word], meaning [meaning]". Example: "From Old French drab (cloth) -> dull appearance". (3) word_family: ONLY include words that are REAL and ATTSTED in English. If the word has no common derivations, return empty array []. NEVER invent words like "prevailant" or "prevailence". (4) common_phrases: ONLY include if the word actually appears in a well-known idiom. If not, return empty array []. (5) common_mistakes: ONLY if there is a documented common error. Not all words have common mistakes. Use empty array if none. (6) collocations: use natural adjective+noun or verb+noun pairs. (7) Never invent fake word forms. Empty string if form does not exist. (8) -ant/-ent/-ence/-ance: must be correct spelling. (9) Plurals only for count nouns. (10) Direct synonyms/antonyms only. (11) 3-5 real examples. (12) frequency_percent on real data.';

  try {
    const content = await groqChat(prompt, 0.7, 1200);
    if (!content) return null;

    // Save to localStorage cache
    try { localStorage.setItem(cacheKey, JSON.stringify({ word: cleanWord, explanation: content, cached: true })); } catch {}

    return { word: cleanWord, explanation: content, cached: false };
  } catch (e) {
    console.warn('explainWordWithAI failed:', e);
    return null;
  }
}

// ===== SANITIZE AI-GENERATED WORD DATA =====
function sanitizeAIWordData(result, cleanWord) {
  // Fix fake word forms: if word_forms fields match root+suffix pattern but aren't real, clear them
  var wf = result.word_forms || {};
  // Known problematic suffix patterns that AI invents
  var fakeSuffixPatterns = [/^.+ant$/, /^.+ent$/, /^.+ence$/, /^.+ance$/, /^.+tion$/, /^.+sion$/];
  Object.keys(wf).forEach(function(key) {
    var val = wf[key];
    if (!val || val.length < 3) return;
    // If the word form is the same as root word + common suffix but root word itself is a verb,
    // it's likely a fake form (e.g. "prevail"->"prevailant")
    var lower = val.toLowerCase();
    if (lower === cleanWord) { wf[key] = ''; return; }
    // Check for root+suffix where suffix doesn't transform letters properly
    // e.g. "prevail"+"ant" = "prevailant" (fake), should be "prevalent"
    if (lower.startsWith(cleanWord) && lower.length > cleanWord.length) {
      var suffix = lower.slice(cleanWord.length);
      // If it adds -ant, -ent, -ence, -ance directly to root, flag it
      if (['ant','ent','ance','ence','tion','sion','ity','ness','ment','ful','less','ous','ive','able','ible'].indexOf(suffix) !== -1) {
        // Only clear if it looks like a mechanical suffix addition
        if (cleanWord.endsWith('y') && ['ant','ent','ance','ence','tion','sion'].indexOf(suffix) !== -1) { /* keep -y->-i+ation is valid */ }
        else if (cleanWord.endsWith('e') && ['ant','ent','ance','ence','tion','sion'].indexOf(suffix) !== -1) { /* drop -e before suffix */ }
        else if (suffix === 'ant' || suffix === 'ent' || suffix === 'ance' || suffix === 'ence') {
          // Direct addition of -ant/-ent/-ance/-ence to verb root is often wrong
          // e.g. "prevail+ant", "depend+ance" — but "depend+ent" is correct 
          // We can't fix automatically, but flag as potential error — leave it, the prompt fix should handle it
        }
      }
    }
  });

  // Fix morphology: clear fields that don't make sense for the word type
  var morph = result.morphology || {};
  var pos0 = (result.part_of_speech && result.part_of_speech[0]) || '';
  var isNoun = pos0 === 'noun' || cleanWord.endsWith('tion') || cleanWord.endsWith('ness') || cleanWord.endsWith('ment') || cleanWord.endsWith('ity') || cleanWord.endsWith('ence') || cleanWord.endsWith('ance');
  var isVerb = pos0 === 'verb' || cleanWord.endsWith('ize') || cleanWord.endsWith('ise') || cleanWord.endsWith('ify') || cleanWord.endsWith('ate');
  var isAdj = pos0 === 'adjective' || cleanWord.endsWith('ous') || cleanWord.endsWith('ive') || cleanWord.endsWith('able') || cleanWord.endsWith('ful') || cleanWord.endsWith('less') || cleanWord.endsWith('ic');
  var isAdv = pos0 === 'adverb' || cleanWord.endsWith('ly');

  // Past tense/past participle only for verbs
  if (!isVerb) { morph.past_tense = ''; morph.past_participle = ''; }
  // Plural only for nouns
  if (!isNoun) { morph.plural = ''; }
  // Comparative/superlative only for adjectives/adverbs
  if (!isAdj && !isAdv) { morph.comparative = ''; morph.superlative = ''; }

  // Fix plural field: if it ends in -s and root is a verb, it's not a valid plural
  if (morph.plural && morph.plural.toLowerCase() === cleanWord + 's' && isVerb) {
    morph.plural = '';
  }

  // Remove duplicate synonyms/antonyms
  if (result.synonyms) result.synonyms = result.synonyms.filter(function(s, i, arr) { return arr.indexOf(s) === i; });
  if (result.antonyms) result.antonyms = result.antonyms.filter(function(a, i, arr) { return arr.indexOf(a) === i; });

  // Remove synonym from antonyms list and vice versa
  if (result.synonyms && result.antonyms) {
    result.antonyms = result.antonyms.filter(function(a) { return result.synonyms.indexOf(a) === -1; });
    result.synonyms = result.synonyms.filter(function(s) { return result.antonyms.indexOf(s) === -1; });
  }

  // Clear word_family items that are the same as the root word
  if (result.word_family) result.word_family = result.word_family.filter(function(w) { return w.toLowerCase() !== cleanWord; });

  // If part_of_speech has duplicates in definitions, clean up
  if (result.allMeanings) {
    result.allMeanings = result.allMeanings.filter(function(m, i, arr) { return arr.indexOf(m) === i; });
  }

  // Clean examples array - remove empty strings, truncate duplicates
  if (result.examples) {
    result.examples = result.examples.filter(function(e) { return e && e.length > 3; });
  }

  // Ensure frequency_percent is in 0-100 range
  if (result.frequency_percent !== undefined) {
    result.frequency_percent = Math.min(100, Math.max(0, Number(result.frequency_percent) || 0));
  }

  return result;
}

// ===== AI-POWERED FULL WORD DATA (replaces API-based word lookup) =====
async function aiGetFullWordData(word) {
  var cleanWord = String(word).trim().toLowerCase();
  var cacheKey = 'vm_ai_full_' + cleanWord;

  // Check localStorage cache
  try {
    var cached = localStorage.getItem(cacheKey);
    if (cached) {
      var parsed = JSON.parse(cached);
      if (parsed && parsed.word) return parsed;
    }
  } catch (e) {}

  // Detect POS for accurate AI generation
  var detectedPOS = null;
  (function() {
    var w = cleanWord;
    if (w.endsWith('tion') || w.endsWith('sion') || w.endsWith('ness') || w.endsWith('ment') || w.endsWith('ity') || w.endsWith('ence') || w.endsWith('ance')) detectedPOS = 'noun';
    else if (w.endsWith('ing') && w.length > 5) detectedPOS = 'adjective';
    else if (w.endsWith('ed') && w.length > 4 && !w.endsWith('eed')) detectedPOS = 'adjective';
    else if (w.endsWith('ous') || w.endsWith('ive') || w.endsWith('able') || w.endsWith('ible') || w.endsWith('ful') || w.endsWith('less') || w.endsWith('ic')) detectedPOS = 'adjective';
    else if (w.endsWith('ly') && w.length > 4) detectedPOS = 'adverb';
    else if (w.endsWith('ize') || w.endsWith('ise') || w.endsWith('ify') || w.endsWith('ate')) detectedPOS = 'verb';
  })();
  var posHint = detectedPOS ? ' The word "' + cleanWord + '" is primarily used as a ' + detectedPOS + '.' : '';

  var prompt = 'You are a professional English dictionary AI for Uzbek learners. For "' + cleanWord + '", return ONLY valid JSON. Schema: {"word":"' + cleanWord + '","uzbek_translation":"o\'zbekcha tarjima","phonetic":"IPA","ukPhonetic":"UK IPA","usPhonetic":"US IPA","level":"A1-C2","frequency_percent":0-100,"frequency_label":"Very Common|Common|Fair|Uncommon|Rare","part_of_speech":["noun","verb","adjective","adverb"],"main_meaning":"short main meaning","simple_definition":"very simple 1-line explanation","dictionary_definition":"formal dictionary definition","contextual_definition":"explanation with context of use","examples":["ex1","ex2","ex3","ex4","ex5"],"synonyms":["syn1","syn2","syn3","syn4","syn5"],"antonyms":["ant1","ant2","ant3"],"collocations":["adj+noun phrase","verb+noun phrase"],"common_contexts":["context1 (e.g. fashion)","context2 (e.g. weather)"],"word_forms":{"noun":"","verb":"","adjective":"","adverb":""},"morphology":{"past_tense":"","past_participle":"","plural":"","comparative":"","superlative":""},"word_family":["only real attested words OR empty array"],"common_phrases":["real idiom with this word OR empty array"],"common_mistakes":["specific documented error OR empty array"],"synonym_discrimination":{"real_synonym":"real difference OR empty object"},"ielts_expressions":["advanced expression OR empty"],"memory_tip":"creative memory aid","real_life_usage":"how natives use it daily","etymology":"From [language] [original word], meaning [original meaning] -> modern meaning","topic_tags":["tag1","tag2"],"register":"formal|informal|neutral|academic","funFact":"interesting fact","usageTip":"practical usage suggestion"}.' + posHint + ' RULES: (1) uzbek_translation: give most common Uzbek equivalent. Multiple meanings separated by commas. (2) etymology: must include origin language + original word. Pattern: "From [lang] [word], meaning [meaning]". (3) word_family: ONLY real attested words. Empty array [] if no common derivations. Never invent "prevailance" or "prevailant". (4) common_phrases: ONLY if this word appears in a real idiom. Empty array [] if not. (5) common_mistakes: ONLY documented real errors. Empty array [] if none. (6) synonym_discrimination: ONLY for synonyms in the synonym list. Empty object {} if none. (7) collocations: natural adjective+noun or verb+noun pairs. (8) Never invent fake word forms. Empty string if non-existent. (9) -ant/-ent/-ence/-ance spelling correct. (10) Plurals for count nouns only. (11) Direct synonyms/antonyms. (12) 3-5 real examples.';

  try {
    var content = await groqChat(prompt, 0.7, 2000);
    if (!content) return null;

    var jsonStart = content.indexOf('{');
    var jsonEnd = content.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) return null;

    var parsed = JSON.parse(content.substring(jsonStart, jsonEnd + 1));
    if (!parsed.word) return null;

    // Map AI response to renderWordCard-compatible format
    var defs = parsed.definitions || [];
    var primaryDef = defs[0] || {};

    // Build allMeanings from definitions array (group by pos)
    var allMeanings = [];
    var posGroups = {};
    defs.forEach(function(d) {
      if (!posGroups[d.pos]) posGroups[d.pos] = [];
      posGroups[d.pos].push({ definition: d.definition, example: d.example_sentence || '' });
    });
    Object.keys(posGroups).forEach(function(pos) {
      allMeanings.push({
        partOfSpeech: pos,
        definitions: posGroups[pos].map(function(d) { return { definition: d.definition, example: d.example }; })
      });
    });

    var result = {
      word: parsed.word || cleanWord,
      phonetic: parsed.phonetic || parsed.ukPhonetic || '',
      ukPhonetic: parsed.ukPhonetic || parsed.phonetic || '',
      ukAudio: parsed.ukAudio || '',
      usPhonetic: parsed.usPhonetic || parsed.phonetic || '',
      usAudio: parsed.usAudio || '',
      partOfSpeech: (parsed.part_of_speech && parsed.part_of_speech[0]) || detectedPOS || 'word',
      definition: primaryDef.definition || '',
      example: primaryDef.example_sentence || '',
      synonyms: parsed.synonyms || [],
      antonyms: parsed.antonyms || [],
      allMeanings: allMeanings,
      related: [],
      rhymes: [],
      cefrLevel: parsed.level || '',
      confidence: 95,
      // AI-enhanced fields
      uzbek_translation: parsed.uzbek_translation || '',
      main_meaning: parsed.main_meaning || primaryDef.definition || '',
      simple_definition: parsed.simple_definition || '',
      dictionary_definition: parsed.dictionary_definition || '',
      contextual_definition: parsed.contextual_definition || '',
      examples: parsed.examples || [],
      common_contexts: parsed.common_contexts || [],
      memory_tip: parsed.memory_tip || '',
      ielts_expressions: parsed.ielts_expressions || [],
      real_life_usage: parsed.real_life_usage || '',
      frequency_percent: parsed.frequency_percent,
      frequency_label: parsed.frequency_label,
      part_of_speech: parsed.part_of_speech || [],
      word_forms: parsed.word_forms || {},
      morphology: parsed.morphology || {},
      prepositions: parsed.prepositions || [],
      word_family: parsed.word_family || [],
      common_phrases: parsed.common_phrases || [],
      common_mistakes: parsed.common_mistakes || [],
      synonym_discrimination: parsed.synonym_discrimination || {},
      alternative_spellings: parsed.alternative_spellings || {},
      topic_tags: parsed.topic_tags || [],
      difficulty_for_learners: parsed.difficulty_for_learners || '',
      register: parsed.register || '',
      commonCollocations: parsed.collocations || [],
      etymology: parsed.etymology || '',
      funFact: parsed.funFact || '',
      usageTip: parsed.usageTip || '',
      audio_url: parsed.audio_url || null,
      _aiGenerated: true
    };

    // SANITIZE: fix common AI errors in word forms, morphology, duplicates, etc.
    result = sanitizeAIWordData(result, cleanWord);

    // Cache the sanitized result
    try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch (e) {}

    return result;
  } catch (e) {
    console.warn('aiGetFullWordData failed:', e);
    return null;
  }
}

// ===== DATAMUSE COLLOCATIONS (real usage-based, not AI-invented) =====
async function getCollocationsFromAPI(word) {
  var cleanWord = String(word).trim().toLowerCase();
  var cacheKey = 'vm_coll_' + cleanWord;
  try { var cached = localStorage.getItem(cacheKey); if (cached) return JSON.parse(cached); } catch (e) {}
  var results = [];
  try {
    // rel_jja: Popular nouns modified by the given adjective (e.g., "drab" -> "clothes", "building", "room")
    // rel_jjb: Popular adjectives used to modify the given noun (e.g., "room" -> "drab", "dark")
    // rel_bga: "Befores" — words that frequently appear before the given word
    // rel_bgb: "Afters" — words that frequently appear after the given word
    var collData = await Promise.all([
      fetch('https://api.datamuse.com/words?rel_jja=' + encodeURIComponent(cleanWord) + '&max=8').then(function(r) { return r.ok ? r.json() : []; }).catch(function() { return []; }),
      fetch('https://api.datamuse.com/words?rel_jjb=' + encodeURIComponent(cleanWord) + '&max=8').then(function(r) { return r.ok ? r.json() : []; }).catch(function() { return []; }),
      fetch('https://api.datamuse.com/words?rel_bga=' + encodeURIComponent(cleanWord) + '&max=5').then(function(r) { return r.ok ? r.json() : []; }).catch(function() { return []; }),
      fetch('https://api.datamuse.com/words?rel_bgb=' + encodeURIComponent(cleanWord) + '&max=5').then(function(r) { return r.ok ? r.json() : []; }).catch(function() { return []; })
    ]);
    // Format: jja = adjective->noun collocations: "drab clothes", "drab building"
    (collData[0] || []).forEach(function(item) {
      if (item.word && item.word.length >= 2 && /^[a-zA-Z ]+$/.test(item.word)) {
        results.push(cleanWord + ' ' + item.word);
      }
    });
    // jjb = noun->adjective collocations: already formatted
    (collData[1] || []).forEach(function(item) {
      if (item.word && item.word.length >= 2 && /^[a-zA-Z ]+$/.test(item.word)) {
        results.push(item.word + ' ' + cleanWord);
      }
    });
    // bga = words before: e.g., "very drab", "rather drab"
    (collData[2] || []).forEach(function(item) {
      if (item.word && item.word.length >= 2 && /^[a-zA-Z ]+$/.test(item.word)) {
        results.push(item.word + ' ' + cleanWord);
      }
    });
    // bgb = words after: e.g., "drab and", "drab but"
    (collData[3] || []).forEach(function(item) {
      if (item.word && item.word.length >= 2 && /^[a-zA-Z ]+$/.test(item.word)) {
        results.push(cleanWord + ' ' + item.word);
      }
    });
  } catch (e) { /* collocation fetch failed */ }
  // Deduplicate
  results = results.filter(function(r, i) { return results.indexOf(r) === i; }).slice(0, 15);
  try { localStorage.setItem(cacheKey, JSON.stringify(results)); } catch (e) {}
  return results;
}

// ===== VALIDATE AI-GENERATED FIELDS =====
function validateAIFields(result, cleanWord) {
  // 1. Common Mistakes: remove if they contain non-existent words or are too generic
  if (result.common_mistakes && result.common_mistakes.length) {
    result.common_mistakes = result.common_mistakes.filter(function(m) {
      if (!m || m.length < 5) return false;
      // Remove if it looks like generic advice not specific to this word
      var generic = ['don\'t confuse', 'remember to', 'make sure you', 'always use', 'never use', 'be careful'];
      for (var g = 0; g < generic.length; g++) { if (m.toLowerCase().indexOf(generic[g]) !== -1) return false; }
      return true;
    }).slice(0, 3);
  }

  // 2. Word Family: remove if items are same as root or look like non-words
  if (result.word_family && result.word_family.length) {
    result.word_family = result.word_family.filter(function(w) {
      if (!w || w.length < 3) return false;
      var lower = w.toLowerCase();
      if (lower === cleanWord) return false;
      if (lower.indexOf(cleanWord) === -1 && cleanWord.indexOf(lower) === -1) return false;
      // Check for fake suffix additions
      var fakeSuffixes = ['ant', 'ence', 'ance', 'tion', 'sion', 'ment', 'ness', 'ity', 'ous', 'ive', 'able', 'ible', 'ful', 'less', 'ism', 'ist', 'ize', 'ise', 'ify', 'ate'];
      for (var f = 0; f < fakeSuffixes.length; f++) {
        var expected = lower;
        // Check if removing suffix gives the root
        if (expected === cleanWord + fakeSuffixes[f] && fakeSuffixes[f].length > 2) {
          // Direct addition without transformation is suspicious
          // e.g., "prevail" + "ant" = "prevailant" (should be "prevalent")
          return false;
        }
      }
      return true;
    }).slice(0, 8);
  }

  // 3. Synonym Discrimination: only keep entries for actual synonyms
  if (result.synonym_discrimination && Object.keys(result.synonym_discrimination).length) {
    var synList = (result.synonyms || []).map(function(s) { return s.toLowerCase(); });
    var valid = {};
    Object.keys(result.synonym_discrimination).forEach(function(k) {
      if (synList.indexOf(k.toLowerCase()) !== -1) valid[k] = result.synonym_discrimination[k];
    });
    result.synonym_discrimination = valid;
  }

  // 4. Collocations: remove template/generic entries, deduplicate
  if (result.commonCollocations && result.commonCollocations.length) {
    var genericColl = ['adj+noun', 'verb+noun', 'common phrase', 'adjective+noun', 'noun+verb', 'adverb+adjective'];
    result.commonCollocations = result.commonCollocations.filter(function(c) {
      if (!c || c.length < 4) return false;
      var lower = c.toLowerCase();
      for (var gc = 0; gc < genericColl.length; gc++) { if (lower === genericColl[gc]) return false; }
      // Remove if it contains placeholder text
      if (lower.indexOf('example') !== -1 || lower.indexOf('your') !== -1 || lower.indexOf('something') !== -1) return false;
      return true;
    }).slice(0, 12);
    // Deduplicate
    result.commonCollocations = result.commonCollocations.filter(function(c, i) { return result.commonCollocations.indexOf(c) === i; });
  }

  // 5. Common phrases: remove template/placeholder entries
  if (result.common_phrases && result.common_phrases.length) {
    var genericPhrases = ['idiom1', 'idiom2', 'phrase1', 'phrase2', 'common phrase', 'example phrase'];
    result.common_phrases = result.common_phrases.filter(function(p) {
      if (!p || p.length < 5) return false;
      var lower = p.toLowerCase();
      for (var gp = 0; gp < genericPhrases.length; gp++) { if (lower === genericPhrases[gp]) return false; }
      // Remove if it contains placeholder text
      if (lower.indexOf('your') !== -1 && lower.indexOf('something') !== -1) return false;
      return true;
    }).slice(0, 5);
    result.common_phrases = result.common_phrases.filter(function(p, i) { return result.common_phrases.indexOf(p) === i; });
  }

  // 6. Etymology: remove if it's too short or generic
  if (result.etymology && result.etymology.length < 10) {
    result.etymology = '';
  }
  if (result.etymology && (result.etymology.indexOf('brief') !== -1 || result.etymology.indexOf('origin') !== -1)) {
    result.etymology = '';
  }

  // 7. uzbek_translation: remove placeholder
  if (result.uzbek_translation && (result.uzbek_translation.indexOf("o'zbekcha") !== -1 || result.uzbek_translation.indexOf("tarjima") !== -1)) {
    result.uzbek_translation = '';
  }

  // 8. Clear empty arrays to avoid showing sections with no real data
  if (result.common_phrases && !result.common_phrases.length) result.common_phrases = null;
  if (result.common_mistakes && !result.common_mistakes.length) result.common_mistakes = null;
  if (result.ielts_expressions && !result.ielts_expressions.length) result.ielts_expressions = null;
  if (result.word_family && !result.word_family.length) result.word_family = null;

  return result;
}

// ===== HYBRID: API (factual) + AI (enrichment) combined =====
async function getHybridWordData(word) {
  if (typeof getCurrentPlan === 'function' && getCurrentPlan() === 'Free') return null;
  var cleanWord = String(word).trim().toLowerCase();
  var cacheKey = 'vm_hybrid_' + cleanWord;

  // Check cache
  try { var cached = localStorage.getItem(cacheKey); if (cached) { var cp = JSON.parse(cached); if (cp && cp.word) return cp; } } catch (e) {}

  // Fetch API (factual), AI (enrichment), and Datamuse collocations in parallel
  var apiData = null;
  var aiData = null;
  var collData = [];
  try {
    var results = await Promise.all([
      // API: DictionaryAPI + Datamuse (factual: phonetics, definitions, synonyms, related)
      (async function() {
        try {
          if (typeof API !== 'undefined' && API.getFullWordData) return await API.getFullWordData(cleanWord);
        } catch (e) { return null; }
        return null;
      })(),
      // AI: enrichment (Uzbek translation, memory tips, etc.)
      aiGetFullWordData(cleanWord),
      // Datamuse: real usage-based collocations (not AI-invented)
      getCollocationsFromAPI(cleanWord)
    ]);
    apiData = results[0];
    aiData = results[1];
    collData = results[2] || [];
  } catch (e) { /* one or more failed */ }

  // If both failed, return null
  if (!apiData && !aiData) return null;

  // If only one succeeded, return it
  if (!apiData && aiData) { try { localStorage.setItem(cacheKey, JSON.stringify(aiData)); } catch (e) {} return aiData; }
  if (apiData && !aiData) { try { localStorage.setItem(cacheKey, JSON.stringify(apiData)); } catch (e) {} return apiData; }

  // ---- BOTH succeeded: merge API (factual) + AI (enrichment) ----
  // API data is authoritative for: phonetic, partOfSpeech, definition, example, synonyms, antonyms, related, rhymes
  // AI data fills in: Uzbek translation, memory tips, word forms, etc.
  var result = {
    // API-fact fields (API takes priority for accuracy)
    word: cleanWord,
    phonetic: apiData.phonetic || aiData.phonetic || '',
    ukPhonetic: apiData.ukPhonetic || aiData.ukPhonetic || '',
    ukAudio: apiData.ukAudio || '',
    usPhonetic: apiData.usPhonetic || aiData.usPhonetic || '',
    usAudio: apiData.usAudio || '',
    partOfSpeech: apiData.partOfSpeech || aiData.partOfSpeech || 'word',
    definition: apiData.definition || aiData.definition || '',
    example: apiData.example || aiData.example || '',
    synonyms: apiData.synonyms || [],
    antonyms: apiData.antonyms || [],
    related: apiData.related || [],
    rhymes: apiData.rhymes || [],
    allMeanings: apiData.allMeanings || aiData.allMeanings || [],
    cefrLevel: apiData.cefrLevel || aiData.cefrLevel || getCEFRLevel(cleanWord),
    confidence: Math.max(apiData.confidence || 0, aiData.confidence || 0),
    // AI-enrichment fields (API usually doesn't have these)
    uzbek_translation: aiData.uzbek_translation || '',
    main_meaning: aiData.main_meaning || '',
    simple_definition: aiData.simple_definition || '',
    dictionary_definition: aiData.dictionary_definition || '',
    contextual_definition: aiData.contextual_definition || '',
    examples: aiData.examples || [],
    common_contexts: aiData.common_contexts || [],
    memory_tip: aiData.memory_tip || '',
    ielts_expressions: aiData.ielts_expressions || [],
    real_life_usage: aiData.real_life_usage || '',
    frequency_percent: aiData.frequency_percent || apiData.frequency_percent,
    frequency_label: aiData.frequency_label || apiData.frequency_label,
    part_of_speech: aiData.part_of_speech || [apiData.partOfSpeech] || [],
    word_forms: aiData.word_forms || {},
    morphology: aiData.morphology || {},
    prepositions: aiData.prepositions || [],
    word_family: aiData.word_family || [],
    common_phrases: aiData.common_phrases || [],
    common_mistakes: aiData.common_mistakes || [],
    synonym_discrimination: aiData.synonym_discrimination || {},
    alternative_spellings: aiData.alternative_spellings || {},
    topic_tags: aiData.topic_tags || [],
    difficulty_for_learners: aiData.difficulty_for_learners || '',
    register: aiData.register || '',
    // Collocations: API (Datamuse real usage) takes priority, AI fills gaps
    commonCollocations: collData.length ? collData : (aiData.commonCollocations || []),
    etymology: aiData.etymology || '',
    funFact: aiData.funFact || '',
    usageTip: aiData.usageTip || '',
    audio_url: aiData.audio_url || null,
    _aiGenerated: true,
    _hybrid: true
  };

  // Merge allMeanings from both sources
  if (apiData.allMeanings && aiData.allMeanings) {
    var seenPOS = {};
    result.allMeanings = [];
    apiData.allMeanings.forEach(function(m) {
      var key = m.partOfSpeech || m.pos || '';
      if (!seenPOS[key]) {
        seenPOS[key] = true;
        result.allMeanings.push(m);
      }
    });
    aiData.allMeanings.forEach(function(m) {
      var key = m.partOfSpeech || m.pos || '';
      if (!seenPOS[key]) {
        seenPOS[key] = true;
        result.allMeanings.push(m);
      }
    });
  }

  // Merge synonyms/antonyms (deduplicated)
  var allSyns = {};
  (apiData.synonyms || []).concat(aiData.synonyms || []).forEach(function(s) { if (s && s !== cleanWord) allSyns[s] = true; });
  result.synonyms = Object.keys(allSyns).slice(0, 10);
  var allAnts = {};
  (apiData.antonyms || []).concat(aiData.antonyms || []).forEach(function(a) { if (a && a !== cleanWord) allAnts[a] = true; });
  result.antonyms = Object.keys(allAnts).slice(0, 8);

  // Only keep AI definitions/examples if API didn't provide them
  if (apiData.definition && apiData.definition.length > 5) {
    result.definition = apiData.definition;
    result.example = apiData.example || '';
  }

  // Merge collocations: API real data + AI data (deduplicated)
  if (collData.length && aiData && aiData.commonCollocations && aiData.commonCollocations.length) {
    var allColls = {};
    collData.concat(aiData.commonCollocations).forEach(function(c) { if (c && c.length > 3) allColls[c] = true; });
    result.commonCollocations = Object.keys(allColls).slice(0, 15);
  }

  // Sanitize the merged result
  result = sanitizeAIWordData(result, cleanWord);
  // Validate AI-generated fields (common_mistakes, word_family, etc.)
  result = validateAIFields(result, cleanWord);

  // Cache
  try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch (e) {}

  return result;
}
