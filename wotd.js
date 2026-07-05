const WOTD_CEFR_COLORS = {A1:'#AF52DE',A2:'#AF52DE',B1:'#AF52DE',B2:'#AF52DE',C1:'#AF52DE',C2:'#AF52DE'};

// Fixed start date — Day 1 for all users
const WOTD_START = new Date('2026-06-24').getTime();
const DAY_MS = 86400000;

function getWOTDDay() {
  return Math.floor((Date.now() - WOTD_START) / DAY_MS) + 1;
}

function getWOTDColor(w) { var l = getCEFRLevel(w); return WOTD_CEFR_COLORS[l]||'#5856D6'; }

async function loadWordOfDay() {
  var tk = 'wotd_' + new Date().toDateString();
  try { var c = localStorage.getItem(tk); if (c) { state.wotd = JSON.parse(c); renderWOTD(); return; } } catch(e) {}

  if (typeof IELTS_WORDS !== 'undefined' && IELTS_WORDS.length) {
    var pool = IELTS_WORDS.filter(function(w) { return w && w.w && w.def; });
    if (pool.length) {
      var dayIndex = getWOTDDay() - 1;
      var pick = pool[dayIndex % pool.length];
      state.wotd = {
        word: pick.w, phonetic: pick.p || '', partOfSpeech: pick.pos || 'word',
        definition: pick.def, example: pick.ex || '',
        synonyms: pick.syns || [], antonyms: [],
        cefrLevel: getCEFRLevel(pick.w)
      };
      localStorage.setItem(tk, JSON.stringify(state.wotd)); renderWOTD(); return;
    }
  }

  state.wotd = { word:'Eloquence', phonetic:'/ˈel.ə.kwəns/', partOfSpeech:'noun',
    definition:'Fluent or persuasive speaking or writing.',
    example:'She spoke with such eloquence that the entire audience was moved to tears.',
    synonyms:['fluency','articulacy','expressiveness'], antonyms:[], cefrLevel:'C1' };
  localStorage.setItem(tk, JSON.stringify(state.wotd)); renderWOTD();
}

function renderWOTD() {
  if (!state || !state.wotd) return;
  var w = state.wotd;
  var color = getWOTDColor(w.word);
  var container = document.getElementById('wotd-container');
  if (container) container.style.setProperty('--wotd-accent', color);

  var el;
  if (el = document.getElementById('wotd-day')) {
    el.textContent = 'Day ' + String(getWOTDDay()).padStart(3, '0');
  }

  if (el = document.getElementById('wotd-word')) { el.textContent = w.word; el.style.setProperty('--wotd-accent', color); }

  if (el = document.getElementById('wotd-phonetic')) el.textContent = w.phonetic || '';
  if (el = document.getElementById('wotd-pos')) { el.textContent = w.partOfSpeech || ''; el.style.borderColor = color + '33'; el.style.color = color; }

  if (el = document.getElementById('wotd-def')) {
    el.textContent = w.definition;
    el.style.setProperty('--wotd-accent', color);
    el.style.display = w.definition ? '' : 'none';
  }

  if (el = document.getElementById('wotd-example')) {
    el.innerHTML = w.example ? '<i class="ti ti-message-chat" style="opacity:0.4;margin-right:4px;font-size:14px"></i>' + w.example : '';
    el.style.display = w.example ? '' : 'none';
  }

  if (el = document.getElementById('wotd-syns')) {
    var syns = w.synonyms || [];
    if (syns.length) {
      el.innerHTML = '<span class="wotd-tag-label" style="color:' + color + '">Synonyms</span> ' +
        syns.slice(0, 5).map(function(s) {
          return '<span class="wotd-tag" style="border-color:' + color + '22;color:var(--ios-label)" onclick="event.stopPropagation();loadWOTDRelated(\'' + s.replace(/'/g, "\\'") + '\')">' + s + '</span>';
        }).join('');
      el.style.display = '';
    } else { el.style.display = 'none'; }
  }

  if (el = document.getElementById('wotd-progress')) {
    var saved = state.favorites && state.favorites.some(function(f) { return String(f.word || f).toLowerCase() === String(w.word).toLowerCase(); });
    var learned = localStorage.getItem('wotd_learned_' + String(w.word).toLowerCase()) === 'true';
    el.innerHTML =
      '<button class="wotd-action-btn' + (saved ? ' saved' : '') + '" onclick="event.stopPropagation();wotdToggleSave()" title="Save word">' +
        (saved ? '<i class="ti ti-heart-filled"></i>' : '<i class="ti ti-heart"></i>') +
      '</button>' +
      '<button class="wotd-action-btn' + (learned ? ' learned' : '') + '" onclick="event.stopPropagation();toggleWOTDLearned()" title="Mark as learned">' +
        (learned ? '<i class="ti ti-book-filled"></i>' : '<i class="ti ti-book"></i>') +
      '</button>';
  }

  var animEl = document.getElementById('wotd-anim');
  if (animEl) {
    animEl.style.animation = 'none';
    void animEl.offsetWidth;
    animEl.style.animation = '';
  }
}

function wotdToggleSave() {
  if (!state.wotd) return;
  saveToFavorites(state.wotd);
  renderWOTD();
}

function toggleWOTDLearned() {
  if (!state.wotd) return;
  var key = 'wotd_learned_' + String(state.wotd.word).toLowerCase();
  if (localStorage.getItem(key) === 'true') { localStorage.removeItem(key); }
  else {
    localStorage.setItem(key, 'true');
    state.stats.wordsLearned = (state.stats.wordsLearned || 0) + 1;
    saveState();
  }
  renderWOTD();
}

function loadWOTDRelated(word) {
  loadWordDisplay(word);
  if (typeof routerNavigate === 'function') routerNavigate('/learn/explore');
  else showPage('explore');
}
