const Games = (() => {
  const TIMEOUT_MS = 6000;
  const FETCH_TIMEOUT_MS = 8000;

  // â”€â”€â”€â”€â”€ CUSTOMIZABLE SETTINGS â”€â”€â”€â”€â”€
  const SETTINGS_KEYS = ['questionCount','timeLimit','difficulty','soundEnabled','endlessMode'];
  const SETTINGS_DEFAULTS = { questionCount:5, timeLimit:10, difficulty:'auto', soundEnabled:true, endlessMode:false };
  function loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem('vm_game_settings') || '{}');
      for (const k of SETTINGS_KEYS) { if (s[k] === undefined) s[k] = SETTINGS_DEFAULTS[k]; }
      return s;
    } catch { return { ...SETTINGS_DEFAULTS }; }
  }
  function saveSettings(s) {
    try { localStorage.setItem('vm_game_settings', JSON.stringify(s)); } catch {}
  }
  let gameSettings = loadSettings();

  // â”€â”€â”€â”€â”€ SOUND EFFECTS (Web Audio API) â”€â”€â”€â”€â”€
  let audioCtx = null;
  function initAudio() {
    try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  function playSound(type) {
    if (!gameSettings.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      const now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      if (type === 'correct') {
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.08);
        osc.frequency.setValueAtTime(784, now + 0.16);
        osc.start(now); osc.stop(now + 0.25);
      } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(220, now + 0.12);
        osc.type = 'sawtooth';
        osc.start(now); osc.stop(now + 0.3);
      } else if (type === 'complete') {
        gain.gain.setValueAtTime(0.12, now);
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        osc.frequency.setValueAtTime(1047, now + 0.3);
        osc.start(now); osc.stop(now + 0.45);
      } else if (type === 'powerup') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        osc.type = 'sine';
        osc.start(now); osc.stop(now + 0.18);
      } else if (type === 'click') {
        gain.gain.setValueAtTime(0.06, now);
        osc.frequency.setValueAtTime(800, now);
        osc.start(now); osc.stop(now + 0.05);
      } else if (type === 'tick') {
        gain.gain.setValueAtTime(0.04, now);
        osc.frequency.setValueAtTime(600, now);
        osc.start(now); osc.stop(now + 0.04);
      }
    } catch {}
  }

  // â”€â”€â”€â”€â”€ POWER-UPS / HINTS â”€â”€â”€â”€â”€
  const POWERUP_TYPES = ['skip','hint','fifty','freeze'];
  const POWERUP_NAMES = { skip:'Skip', hint:'Hint', fifty:'50/50', freeze:'Freeze' };
  const POWERUP_ICONS = { skip:'ti ti-player-skip', hint:'ti ti-bulb', fifty:'ti ti-arrow-split', freeze:'ti ti-snowflake' };
  function loadPowerups() {
    try { return JSON.parse(localStorage.getItem('vm_powerups') || '{"skip":2,"hint":1,"fifty":0,"freeze":0}'); } catch { return { skip:2, hint:1, fifty:0, freeze:0 }; }
  }
  function savePowerups(p) {
    try { localStorage.setItem('vm_powerups', JSON.stringify(p)); } catch {}
  }
  let powerups = loadPowerups();

  function earnPowerup(type) {
    if (!POWERUP_TYPES.includes(type)) return;
    powerups[type] = (powerups[type] || 0) + 1;
    savePowerups(powerups);
    playSound('powerup');
    renderPowerupsBar();
  }
  function getPowerupCount(type) { return powerups[type] || 0; }

  // â”€â”€â”€â”€â”€ DIFFICULTY SCALING â”€â”€â”€â”€â”€
  const DIFF_LEVELS = ['easy','medium','hard','expert'];
  function calcDifficulty() {
    if (gameSettings.difficulty !== 'auto') return gameSettings.difficulty;
    const streak = state.streak || 0;
    const totalQ = state.correct + state.wrong;
    if (totalQ < 3) return 'medium';
    const ratio = totalQ > 0 ? state.correct / totalQ : 0;
    if (streak >= 5 && ratio >= 0.85) return 'expert';
    if (streak >= 3 && ratio >= 0.75) return 'hard';
    if (ratio < 0.4 && totalQ >= 3) return 'easy';
    return 'medium';
  }
  function getDifficultyMods() {
    const d = calcDifficulty();
    const mods = { timeMult:1, optionCount:4, wordCount:5, baseXP:4 };
    if (d === 'easy') { mods.timeMult=1.5; mods.optionCount=4; mods.wordCount=4; mods.baseXP=1; }
    else if (d === 'medium') { mods.timeMult=1; mods.optionCount=4; mods.wordCount=5; mods.baseXP=2; }
    else if (d === 'hard') { mods.timeMult=0.75; mods.optionCount=3; mods.wordCount=6; mods.baseXP=3; }
    else if (d === 'expert') { mods.timeMult=0.5; mods.optionCount=2; mods.wordCount=7; mods.baseXP=4; }
    return mods;
  }
  function updateDifficultyUI() {
    const d = calcDifficulty();
    const el = document.getElementById('game-diff-indicator');
    if (!el) return;
    el.style.display = 'inline-flex';
    el.className = 'diff-indicator diff-' + d;
    const labels = { easy:'Oson', medium:'O\'rta', hard:'Qiyin', expert:'Ekspert' };
    el.innerHTML = '<i class="ti ti-signal"></i> ' + labels[d];
  }

  // â”€â”€â”€â”€â”€ WRONG WORDS REVIEW â”€â”€â”€â”€â”€
  let wrongWords = [];

  async function fetchWordData(word) {
    try {
      const c = Promise.race([
        typeof API !== 'undefined' && API.getFullWordData ? API.getFullWordData(word) : Promise.reject(new Error('No API')),
        new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), FETCH_TIMEOUT_MS))
      ]);
      const data = await c;
      if (data && data.definition) return mapAPIData(data, word);
    } catch (e) {}
    try {
      if (typeof explainWordWithAI === 'function') {
        const ai = await Promise.race([
          explainWordWithAI(word),
          new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), FETCH_TIMEOUT_MS))
        ]);
        if (ai && (ai.explanation || ai.main_meaning)) return mapAPIData(ai, word);
      }
    } catch (e) {}
    return null;
  }

  function mapAPIData(data, word) {
    const def = data.definition || data.main_meaning || data.dictionary_definition || data.simple_definition || '';
    const ex = data.example || data.examples?.[0] || data.contextual_definition || '';
    const syn = data.synonyms || [];
    const pos = data.partOfSpeech || data.pos || '';
    return { word: word || data.word || '', pos, def, example: ex, synonyms: syn, hint: 'Starts with ' + (word || data.word || '')[0], uz: data.uzbek_translation || '' };
  }

  async function fetchSynonyms(word) {
    try {
      if (typeof API !== 'undefined' && typeof API.getSynonyms === 'function') {
        const s = await Promise.race([
          API.getSynonyms(word),
          new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), TIMEOUT_MS))
        ]);
        if (s && s.length > 0) return s;
      }
    } catch (e) {}
    return null;
  }

  async function fetchAntonyms(word) {
    try {
      if (typeof API !== 'undefined' && typeof API.getAntonyms === 'function') {
        const a = await Promise.race([
          API.getAntonyms(word),
          new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), TIMEOUT_MS))
        ]);
        if (a && a.length > 0) return a;
      }
    } catch (e) {}
    return null;
  }

  function guardGame(gt) {
    if (state.currentGame !== gt) { hideGameSkeleton(); return true; }
    return false;
  }

  async function fetchWordsForGame(count) {
    const words = [];
    let wordStrings = [];
    if (typeof API !== 'undefined' && typeof API.fetchRandomWord === 'function') {
      const promises = Array(count * 2).fill().map(() =>
        Promise.race([API.fetchRandomWord(), new Promise(r => setTimeout(() => r(null), TIMEOUT_MS))])
      );
      wordStrings = [...new Set((await Promise.all(promises)).filter(Boolean).map(w => w.toLowerCase()))];
    }
    if (wordStrings.length > 0) {
      const dataPromises = wordStrings.slice(0, count + 4).map(w => fetchWordData(w));
      const results = await Promise.all(dataPromises);
      for (const d of results) {
        if (d && d.def && d.def.length > 5 && !words.some(w => w.word.toLowerCase() === d.word.toLowerCase())) {
          words.push(d);
          if (words.length >= count) break;
        }
      }
    }
    if (words.length < count && typeof IELTS_WORDS !== 'undefined') {
      const localPool = [...IELTS_WORDS].sort(() => Math.random() - 0.5);
      for (const entry of localPool) {
        if (words.length >= count) break;
        if (entry && entry.w && entry.def && entry.def.length > 5 && !words.some(w => w.word.toLowerCase() === entry.w.toLowerCase())) {
          words.push({
            word: entry.w,
            pos: entry.pos || '',
            def: entry.def,
            example: entry.ex || '',
            synonyms: entry.syns || [],
            hint: 'Starts with ' + entry.w[0],
            uz: ''
          });
        }
      }
    }
    return words;
  }

  let state = {
    currentGame: null,
    q: 0, correct: 0, wrong: 0, xpEarned: 0, streak: 0,
    timer: null, timerSec: 0, timerStart: null, frozen: false,
    chain: { letter: 'A', used: [], count: 0 },
    match: { wordSel: null, defSel: null, done: 0 },
    lastGame: null, loading: false,
    endless: false, endlessAlive: true,
    powerupActive: null,
  };

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
  const el = id => document.getElementById(id);

  function showGameSkeleton() {
    state.loading = true;
    if (typeof showSkeleton === 'function') {
      showSkeleton('game-content-area', 3, 'card');
    } else {
      const c = el('game-content-area');
      if (c) c.innerHTML = '<div style="text-align:center;padding:48px 20px;color:var(--text2);font-size:14px">â³ Loading words...</div>';
    }
  }

  function hideGameSkeleton() {
    state.loading = false;
    if (typeof hideSkeleton === 'function') hideSkeleton('game-content-area');
  }

  function createParticleBurst(x, y, color) {
    const colors = ['#5B3DE8','#7C6FFF','#22D3EE','#FBBF24','#F43F5E','#34D399'];
    const c = color || colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${4 + Math.random() * 4}px;height:${4 + Math.random() * 4}px;background:${c};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};pointer-events:none;z-index:9999;--dx:${(Math.random() - 0.5) * 150}px;--dy:${-Math.random() * 120 - 20}px;animation:game-particle-fly ${0.4 + Math.random() * 0.4}s ease-out forwards;animation-delay:${i * 0.025}s;`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  function burstAtRect(el) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    createParticleBurst(r.left + r.width / 2, r.top + r.height / 2, '#10B981');
  }

  function correctAnimation(btn) {
    if (!btn) return;
    btn.classList.add('game-correct-flash');
    setTimeout(() => { btn.classList.remove('game-correct-flash'); }, 300);
  }

  function wrongAnimation(btn) {
    if (!btn) return;
    btn.classList.add('game-wrong-flash');
    setTimeout(() => { btn.classList.remove('game-wrong-flash'); }, 500);
  }

  function showCorrectAnswer(container, correctText) {
    if (!container) return;
    container.querySelectorAll('.game-option-btn, .match-item').forEach(b => {
      if (b.textContent.trim() === correctText && !b.classList.contains('matched')) {
        b.classList.add('game-correct-flash');
      }
    });
  }

  function getGamesStats() {
    try { return JSON.parse(localStorage.getItem('vm_games_stats') || '{}'); } catch { return {}; }
  }

  function saveGamesStats(data) {
    if (!data) data = getGamesStats();
    localStorage.setItem('vm_games_stats', JSON.stringify(data));
  }

  function incrementGamesPlayed() {
    if (typeof state !== 'undefined' && state && state.stats) {
      state.stats.gamesPlayed = (state.stats.gamesPlayed || 0) + 1;
      if (typeof saveStats === 'function') saveStats();
    }
    const s = getGamesStats();
    s.gamesPlayed = (s.gamesPlayed || 0) + 1;
    const today = new Date().toDateString();
    if (s.lastPlayedDate !== today) {
      s.streak = (s.lastPlayedDate === new Date(Date.now() - 86400000).toDateString()) ? (s.streak || 0) + 1 : 1;
      s.lastPlayedDate = today;
    }
    saveGamesStats(s);
  }

  function getDailyXP() {
    const today = new Date().toDateString();
    try {
      const d = JSON.parse(localStorage.getItem('vm_games_daily') || '{}');
      if (d.date !== today) { d.date = today; d.xp = 0; localStorage.setItem('vm_games_daily', JSON.stringify(d)); }
      return d.xp || 0;
    } catch { return 0; }
  }

  function addDailyXP(amount) {
    const today = new Date().toDateString();
    try {
      const d = JSON.parse(localStorage.getItem('vm_games_daily') || '{}');
      if (d.date !== today) { d.date = today; d.xp = 0; }
      d.xp = (d.xp || 0) + amount;
      localStorage.setItem('vm_games_daily', JSON.stringify(d));
      return d.xp;
    } catch {}
  }

  function awardXP(amount) {
    if (amount === 0) return;
    if (typeof addXP === 'function') {
      addXP(amount, 'Games');
    } else if (typeof state !== 'undefined' && state && state.stats) {
      state.stats.totalXP = Math.max(0, (state.stats.totalXP || 0) + amount);
      if (typeof saveStats === 'function') saveStats();
      if (typeof updateSidebarXP === 'function') updateSidebarXP();
      if (typeof checkAchievements === 'function') checkAchievements();
    }
    const gs = getGamesStats();
    gs.totalXP = Math.max(0, (gs.totalXP || 0) + amount);
    saveGamesStats(gs);
    addDailyXP(amount);
    if (amount > 0 && typeof showToast === 'function') {
      showToast('+' + amount + ' XP', 'success', 1600);
    } else if (amount <= 0) {
      showXPToast(amount);
    }
    updateGamesUI();
  }

  function showXPToast(amount) {
    const t = document.createElement('div');
    t.className = 'games-xp-toast';
    t.textContent = (amount > 0 ? '+' : '') + amount + ' XP';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 1700);
  }

  function updateGamesUI() {
    const s = getGamesStats();
    const dailyXP = getDailyXP();
    const played = s.gamesPlayed || 0;
    const streak = s.streak || 0;
    const map = {
      'games-total-xp-display': dailyXP,
      'games-played-display': played,
      'games-streak-display': streak,
      'game-xp-so-far': '+' + state.xpEarned,
      'game-correct-count': state.correct,
      'game-wrong-count': state.wrong,
    };
    for (const [id, val] of Object.entries(map)) {
      const e = el(id);
      if (e) e.textContent = val;
    }
    const prog = el('game-progress-label');
    if (prog && state.currentGame === 'chain') {
      prog.innerHTML = '<i class="ti ti-chain"></i> Chain: ' + state.chain.count + '/15';
    }
    updateDifficultyUI();
    renderPowerupsBar();
    updateDailyCardUI();
  }

  function showArea(areaId) {
    ['games-menu','games-play-area','games-result-area'].forEach(id => {
      const e = el(id);
      if (e) e.style.display = 'none';
    });
    const target = el(areaId);
    if (target) {
      target.style.display = areaId === 'games-menu' ? 'grid' : 'block';
      target.style.animation = 'vmPageIn 0.35s ease both';
    }
  }

  function setProgress(current, total) {
    const lbl = el('game-progress-label');
    if (lbl && state.currentGame !== 'chain') lbl.textContent = 'Q ' + current + '/' + total;
  }

  function setTimer(seconds, onEnd) {
    clearInterval(state.timer);
    state.timerSec = seconds;
    state.timerStart = Date.now();
    state.frozen = false;
    const pill = el('game-timer-pill');
    if (pill) { pill.style.display = 'inline-block'; pill.innerHTML = '<i class="ti ti-clock"></i> ' + seconds + 's'; pill.classList.remove('urgent','frozen'); }
    state.timer = setInterval(() => {
      if (state.frozen) {
        if (pill) { pill.innerHTML = '<i class="ti ti-snowflake"></i> ' + state.timerSec + 's'; pill.classList.add('frozen'); pill.classList.remove('urgent'); }
        return;
      }
      if (pill) pill.classList.remove('frozen');
      state.timerSec--;
      if (pill) {
        pill.innerHTML = '<i class="ti ti-clock"></i> ' + state.timerSec + 's';
        if (state.timerSec <= 3) pill.classList.add('urgent');
      }
      if (state.timerSec <= 0) {
        clearInterval(state.timer);
        onEnd();
      }
    }, 1000);
  }

  function endGame(baseXP) {
    clearInterval(state.timer);
    state.frozen = false;
    state.powerupActive = null;
    const pill = el('game-timer-pill');
    if (pill) pill.classList.remove('frozen','urgent');
    const total = state.correct + state.wrong || 1;
    const accuracy = Math.round((state.correct / total) * 100);
    const streakBonus = Math.min(Math.floor(state.streak / 3) * Math.round(baseXP * 0.1), Math.round(baseXP * 0.3));
    const perfectBonus = accuracy === 100 ? Math.round(baseXP * 0.25) : 0;
    const earned = baseXP + streakBonus + perfectBonus;
    state.xpEarned = earned;

    awardXP(earned);
    incrementGamesPlayed();

    if (accuracy === 100 && typeof fireConfetti === 'function') {
      setTimeout(() => fireConfetti(50), 300);
    }

    const gStats = getGamesStats();
    const eTrophy = el('result-trophy');
    if (eTrophy) eTrophy.innerHTML = accuracy >= 90 ? '<i class="ti ti-trophy" style="color:#FBBF24;font-size:inherit"></i>' : accuracy >= 70 ? '<i class="ti ti-star" style="color:#FBBF24;font-size:inherit"></i>' : '<i class="ti ti-books" style="color:var(--text2);font-size:inherit"></i>';
    const eTitle = el('result-title');
    if (eTitle) eTitle.textContent = accuracy >= 90 ? 'Ajoyib natija!' : accuracy >= 70 ? 'Yaxshi harakat!' : 'Davom eting!';
    const eSub = el('result-subtitle');
    if (eSub) eSub.textContent = state.correct + '/' + total + ' to\'g\'ri \u00B7 ' + accuracy + '% aniqlik' + (state.streak >= 3 ? ' \u00B7 ' + state.streak + ' streak!' : '') + (state.endless ? ' \u00B7 Endless' : '');
    const eXpAmt = el('result-xp-amount');
    if (eXpAmt) eXpAmt.textContent = '+' + earned + ' XP' + (perfectBonus > 0 ? ' (Perfect!)' : streakBonus > 0 ? ' (Streak bonus!)' : '');
    const eXpTot = el('result-xp-total');
    if (eXpTot) eXpTot.textContent = 'Bugungi XP: ' + getDailyXP() + ' | Jami: ' + (gStats.totalXP || 0);
    const eCor = el('rs-correct');
    if (eCor) eCor.textContent = state.correct;
    const eWrg = el('rs-wrong');
    if (eWrg) eWrg.textContent = state.wrong;
    const eAcc = el('rs-accuracy');
    if (eAcc) eAcc.textContent = accuracy + '%';

    if (typeof animateValue === 'function') {
      const rs = el('rs-correct');
      if (rs) { const t = parseInt(rs.textContent); rs.textContent = '0'; setTimeout(() => animateValue(rs, t), 400); }
      const rs2 = el('rs-wrong');
      if (rs2) { const t = parseInt(rs2.textContent); rs2.textContent = '0'; setTimeout(() => animateValue(rs2, t), 500); }
    }

    const achEl = el('result-achievement');
    if (achEl) {
      if (accuracy >= 90 && total >= 5) {
        achEl.style.display = 'flex';
        achEl.style.animation = 'vmPageIn 0.5s ease 0.6s both';
        const ai = el('ach-icon');
        if (ai) ai.innerHTML = '<i class="ti ti-trophy" style="color:#FBBF24"></i>';
        const at = el('ach-text');
        if (at) at.textContent = 'Mukammal natija! Barcha savollarga to\'g\'ri javob!';
      } else if (state.streak >= 5) {
        achEl.style.display = 'flex';
        const ai = el('ach-icon');
        if (ai) ai.innerHTML = '<i class="ti ti-flame" style="color:#F97316"></i>';
        const at = el('ach-text');
        if (at) at.textContent = state.streak + ' ta ketma-ket to\'g\'ri! Streak ustasi!';
      } else {
        achEl.style.display = 'none';
      }
    }

    // Power-up earning: correct answers earn power-ups
    if (state.correct >= 5) earnPowerup('skip');
    if (state.correct >= 10) earnPowerup('hint');
    if (accuracy === 100 && total >= 5) earnPowerup('fifty');

    renderWrongWordReview();
    showArea('games-result-area');
    playSound('complete');
    updateGamesUI();
  }

  function backToMenu() {
    clearInterval(state.timer);
    state.loading = false;
    state.frozen = false;
    state.powerupActive = null;
    const pill = el('game-timer-pill');
    if (pill) { pill.style.display = 'none'; pill.classList.remove('frozen','urgent'); }
    const puBar = el('game-powerups-bar');
    if (puBar) puBar.style.display = 'none';
    showArea('games-menu');
    hideSettings();
    updateGamesUI();
  }

  function replay() {
    if (state.lastGame) start(state.lastGame);
  }

  function disableGameInputs(container) {
    if (!container) container = el('game-content-area');
    if (container) {
      container.querySelectorAll('input,button,textarea,select').forEach(x => x.disabled = true);
    }
  }

  function start(gameType) {
    clearInterval(state.timer);
    state.currentGame = gameType;
    state.lastGame = gameType;
    state.q = 0; state.correct = 0; state.wrong = 0; state.xpEarned = 0; state.streak = 0;
    state.loading = false; state.frozen = false; state.powerupActive = null;
    wrongWords = [];

    gameSettings = loadSettings();

    const diffMods = getDifficultyMods();
    const qCount = gameSettings.questionCount || 5;
    const tLimit = gameSettings.timeLimit || 10;

    const titles = {
      flash:'<i class="ti ti-bolt"></i> Word Flash', match:'<i class="ti ti-link"></i> Meaning Match', spell:'<i class="ti ti-abc"></i> Spell Master',
      chain:'<i class="ti ti-chain"></i> Word Chain', synonym:'<i class="ti ti-wind"></i> Synonym Storm', gap:'<i class="ti ti-edit-circle"></i> Fill the Gap',
      daily:'<i class="ti ti-calendar-star"></i> Daily Challenge',
      anagram:'<i class="ti ti-arrows-shuffle"></i> Anagram Twist', hangman:'<i class="ti ti-hanger"></i> Word Hangman',
      memory:'<i class="ti ti-cards"></i> Memory Match', audioquiz:'<i class="ti ti-ear"></i> Audio Quiz',
      typing:'<i class="ti ti-keyboard"></i> Typing Rush', sentence:'<i class="ti ti-align-left"></i> Sentence Builder',
      antonym:'<i class="ti ti-arrows-left-right"></i> Antonym Hunt', category:'<i class="ti ti-tags"></i> Word Categories',
      crossword:'<i class="ti ti-grid-dots"></i> Crossword', duel:'<i class="ti ti-swords"></i> Definition Duel',
      speedmatch:'<i class="ti ti-player-eject"></i> Speed Match', ladder:'<i class="ti ti-stairs"></i> Word Ladder'
    };
    const titleEl = el('game-play-title');
    if (titleEl) titleEl.innerHTML = titles[gameType] || 'O\'yin';
    const playArea = el('games-play-area');
    if (playArea) playArea.setAttribute('data-game', gameType === 'daily' ? 'gap' : gameType);
    const pill = el('game-timer-pill');
    if (pill) pill.style.display = 'none';

    state.endless = gameSettings.endlessMode && gameType !== 'chain' && gameType !== 'daily';
    state.endlessAlive = true;

    updateGamesUI();
    showArea('games-play-area');

    const content = el('game-content-area');
    if (content) content.innerHTML = '';
    showGameSkeleton();

    // Show power-ups bar for non-chain games
    const puBar = el('game-powerups-bar');
    if (puBar) puBar.style.display = (gameType === 'chain' || gameType === 'daily') ? 'none' : 'flex';

    if (gameType === 'flash') startFlash();
    else if (gameType === 'match') startMatch();
    else if (gameType === 'spell') startSpell();
    else if (gameType === 'chain') startChain();
    else if (gameType === 'synonym') startSynonym();
    else if (gameType === 'gap') startGap();
    else if (gameType === 'daily') startDaily();
    else if (gameType === 'anagram') startAnagram();
    else if (gameType === 'hangman') startHangman();
    else if (gameType === 'memory') startMemory();
    else if (gameType === 'audioquiz') startAudioquiz();
    else if (gameType === 'typing') startTyping();
    else if (gameType === 'sentence') startSentence();
    else if (gameType === 'antonym') startAntonym();
    else if (gameType === 'category') startCategory();
    else if (gameType === 'crossword') startCrossword();
    else if (gameType === 'duel') startDuel();
    else if (gameType === 'speedmatch') startSpeedmatch();
    else if (gameType === 'ladder') startLadder();
  }

  // â”€â”€â”€â”€â”€ FLASH CARDS â”€â”€â”€â”€â”€
  async function startFlash() {
    const qCount = Math.max(3, gameSettings.questionCount || 5);
    const words = await fetchWordsForGame(qCount);
    if (guardGame('flash')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) {
      el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>';
      return;
    }
    state._flashWords = words.slice(0, qCount);
    nextFlash();
  }

  function nextFlash() {
    if (state.q >= state._flashWords.length) { endGame(state.correct * 2); return; }
    const q = state._flashWords[state.q];
    setProgress(state.q + 1, state._flashWords.length);

    const wrongDefs = state._flashWords.filter(w => w.def !== q.def).map(w => w.def);
    const shuffled = shuffle([q.def, ...shuffle(wrongDefs).slice(0, 3)]);
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = `
      <div class="game-question-card stagger-1">
        <div class="game-question-label">This word means...</div>
        <div class="game-question-word">${q.word}</div>
        ${q.pos ? '<div class="game-question-pos">(' + q.pos + ')</div>' : ''}
      </div>
      <div class="game-options-grid stagger-2">
        ${shuffled.map((o, i) => '<button class="game-option-btn" id="fo' + i + '"' + (o === q.def ? ' data-correct="true"' : '') + '>' + o + '</button>').join('')}
      </div>
      <div class="game-feedback" id="flash-fb"></div>
    `;
    shuffled.forEach((o, i) => {
      const btn = el('fo' + i);
      if (btn) btn.onclick = () => answerFlash(o === q.def, i, q.def);
    });
    const diffMods = getDifficultyMods();
    const tSec = Math.round((gameSettings.timeLimit || 10) * diffMods.timeMult);
    setTimer(Math.max(3, tSec), () => {
      state.wrong++; state.streak = 0;
      playSound('wrong');
      const fb = el('flash-fb');
      if (fb) { fb.innerHTML = '\u23F1 Time\'s up! Answer: <strong>' + q.def + '</strong>'; fb.style.color = '#DC2626'; }
      document.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
      showCorrectAnswer(content, q.def);
      state.q++; updateGamesUI(); setTimeout(nextFlash, 1200);
    });
  }

  function answerFlash(correct, idx, correctDef) {
    clearInterval(state.timer);
    document.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
    const btn = el('fo' + idx);
    if (correct) { state.correct++; state.streak++; burstAtRect(btn); correctAnimation(btn); playSound('correct'); }
    else {
      state.wrong++; state.streak = 0; wrongAnimation(btn); playSound('wrong');
      showCorrectAnswer(el('game-content-area'), correctDef);
      const q = state._flashWords[state.q];
      if (q) wrongWords.push({ word: q.word, def: q.def, userAnswer: el('fo' + idx)?.textContent || '', correctAnswer: correctDef });
    }
    state.q++;
    if (state.endless && state.wrong > 0) { updateGamesUI(); setTimeout(() => endGame(state.correct * 1), 600); return; }
    updateGamesUI(); setTimeout(nextFlash, 900);
  }

  // â”€â”€â”€â”€â”€ MEANING MATCH â”€â”€â”€â”€â”€
  async function startMatch() {
    const words = await fetchWordsForGame(4);
    if (guardGame('match')) return;
    hideGameSkeleton();
    if (!words || words.length < 4) {
      el('game-content-area').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>';
      return;
    }
    state.match = { wordSel: null, defSel: null, done: 0 };
    const pairs = shuffle(words.slice(0, 4));
    const defs = shuffle(pairs.map(p => p.def));
    const pill = el('game-timer-pill');
    if (pill) pill.style.display = 'none';
    setProgress(0, 4);
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = `
      <p style="font-size:13px;color:var(--text2);text-align:center;margin-bottom:12px">Match each word with its meaning</p>
      <div class="match-grid">
        <div style="display:flex;flex-direction:column;gap:8px">${pairs.map(p => '<div class="match-item stagger-1" id="mw-' + p.word + '">' + p.word + '</div>').join('')}</div>
        <div style="display:flex;flex-direction:column;gap:8px">${defs.map((d, i) => '<div class="match-item stagger-2" id="md-' + i + '">' + d + '</div>').join('')}</div>
      </div>
      <div class="game-feedback" id="match-fb"></div>
    `;
    pairs.forEach(p => { const w = el('mw-' + p.word); if (w) w.onclick = () => selectMatchWord(p.word, pairs); });
    defs.forEach((d, i) => { const e = el('md-' + i); if (e) e.onclick = () => selectMatchDef(i, d, pairs); });
  }

  function selectMatchWord(word, pairs) {
    const wEl = el('mw-' + word);
    if (wEl && wEl.classList.contains('matched')) return;
    document.querySelectorAll('[id^="mw-"]:not(.matched)').forEach(e => e.classList.remove('selected'));
    state.match.wordSel = word;
    if (wEl) wEl.classList.add('selected');
    if (state.match.defSel !== null) checkMatch(pairs);
  }

  function selectMatchDef(idx, def, pairs) {
    const dEl = el('md-' + idx);
    if (dEl && dEl.classList.contains('matched')) return;
    document.querySelectorAll('[id^="md-"]:not(.matched)').forEach(e => e.classList.remove('selected'));
    state.match.defSel = { idx, def };
    if (dEl) dEl.classList.add('selected');
    if (state.match.wordSel !== null) checkMatch(pairs);
  }

  function checkMatch(pairs) {
    const ws = state.match.wordSel;
    const ds = state.match.defSel;
    const pair = pairs.find(p => p.word === ws && p.def === ds.def);
    const fb = el('match-fb');
    if (pair) {
      state.correct++; state.streak++; state.match.done++;
      const wEl = el('mw-' + ws);
      const dEl = el('md-' + ds.idx);
      if (wEl) { wEl.classList.remove('selected'); wEl.classList.add('matched'); burstAtRect(wEl); }
      if (dEl) { dEl.classList.remove('selected'); dEl.classList.add('matched'); burstAtRect(dEl); }
      if (fb) { fb.textContent = '\u2714 Correct pair!'; fb.style.color = '#059669'; fb.style.animation = 'vmPageIn 0.3s ease'; }
      playSound('correct');
      setProgress(state.match.done, 4);
      updateGamesUI();
      if (state.match.done >= 4) {
        if (state.endless) { setTimeout(() => endGame(state.correct * 3), 700); }
        else { setTimeout(() => endGame(state.correct * 4), 700); }
      }
    } else {
      state.wrong++; state.streak = 0;
      playSound('wrong');
      const wEl = el('mw-' + ws);
      const dEl = el('md-' + ds.idx);
      if (wEl) { wEl.classList.add('error'); setTimeout(() => wEl.classList.remove('error','selected'), 700); }
      if (dEl) { dEl.classList.add('error'); setTimeout(() => dEl.classList.remove('error','selected'), 700); }
      if (fb) { fb.textContent = '\u274C Not a match, try again!'; fb.style.color = '#DC2626'; }
      wrongWords.push({ word: ws, def: pairs.find(p => p.word === ws)?.def || '', userAnswer: ds.def, correctAnswer: pairs.find(p => p.word === ws)?.def || '' });
      updateGamesUI();
      if (state.endless && state.wrong > 1) { setTimeout(() => endGame(state.correct * 3), 700); }
    }
    state.match.wordSel = null; state.match.defSel = null;
  }

  // â”€â”€â”€â”€â”€ SPELL MASTER â”€â”€â”€â”€â”€
  async function startSpell() {
    const qCount = Math.max(3, gameSettings.questionCount || 5);
    const words = await fetchWordsForGame(qCount);
    if (guardGame('spell')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) {
      el('game-content-area').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>';
      return;
    }
    state._spellWords = words.slice(0, qCount);
    nextSpell();
  }

  function nextSpell() {
    if (state.q >= state._spellWords.length) { endGame(state.correct * 2); return; }
    const q = state._spellWords[state.q];
    setProgress(state.q + 1, state._spellWords.length);
    const pill = el('game-timer-pill');
    if (pill) pill.style.display = 'none';
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = `
      <div class="game-question-card stagger-1">
        <div class="game-question-label">Type the word for this definition:</div>
        <div class="game-question-text" style="margin:12px 0;font-size:16px;font-weight:600;line-height:1.5">"${q.def}"</div>
        <div style="font-size:12px;color:var(--text2)">${q.hint} ${q.uz ? '\u00B7 ' + q.uz : ''}</div>
      </div>
      <div class="game-input-row stagger-2">
        <input type="text" id="spell-inp" placeholder="Type the word..." autocomplete="off" autocorrect="off" spellcheck="false">
        <button id="spell-btn">Check \u2713</button>
      </div>
      <div class="game-feedback" id="spell-fb"></div>
    `;
    const inp = el('spell-inp');
    const btn = el('spell-btn');
    const check = () => checkSpell(q.word);
    if (inp) { inp.onkeydown = (e) => { if (e.key === 'Enter') check(); }; setTimeout(() => inp.focus(), 100); }
    if (btn) btn.onclick = check;
  }

  function checkSpell(correctWord) {
    const inp = el('spell-inp');
    const fb = el('spell-fb');
    if (!inp || !inp.value.trim()) return;
    const input = inp.value.trim().toLowerCase();
    const correct = correctWord.toLowerCase();
    if (inp) inp.disabled = true;
    if (input === correct) {
      state.correct++; state.streak++;
      if (fb) { fb.innerHTML = '\u2714 Correct! <strong>' + correctWord + '</strong>'; fb.style.color = '#059669'; fb.style.animation = 'vmPageIn 0.3s ease'; }
      burstAtRect(inp); playSound('correct');
    } else {
      state.wrong++; state.streak = 0;
      if (fb) { fb.innerHTML = '\u274C Incorrect. Answer: <strong>' + correctWord + '</strong>'; fb.style.color = '#DC2626'; }
      playSound('wrong');
      wrongWords.push({ word: correctWord, def: state._spellWords[state.q]?.def || '', userAnswer: input, correctAnswer: correctWord });
    }
    state.q++;
    if (state.endless && state.wrong > 0) { updateGamesUI(); setTimeout(() => endGame(state.correct * 2), 600); return; }
    updateGamesUI(); setTimeout(nextSpell, 1200);
  }

  let _chainValidWords = null;

  function isValidEnglishWord(word) {
    const w = word.toLowerCase();
    if (w.length < 2) return false;
    if (typeof IELTS_WORDS !== 'undefined' && IELTS_WORDS.some(e => e.w.toLowerCase() === w)) return true;
    if (_chainValidWords && _chainValidWords.has(w)) return true;
    return false;
  }


  // â”€â”€â”€â”€â”€ WORD CHAIN â”€â”€â”€â”€â”€
  async function startChain() {
    hideGameSkeleton();
    const fetched = await fetchWordsForGame(80);
    _chainValidWords = new Set((fetched || []).map(w => w.word.toLowerCase()));
    const letters = 'ABCDEFGHLMNPRST';
    state.chain = { letter: letters[Math.floor(Math.random() * letters.length)], used: [], count: 0, maxWords: 15 };
    const pill = el('game-timer-pill');
    if (pill) pill.style.display = 'none';
    const prog = el('game-progress-label');
    if (prog) prog.innerHTML = '<i class="ti ti-chain"></i> Chain: 0/15';
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = `
      <div class="game-question-card stagger-1">
        <div class="game-question-label">Enter an English word starting with this letter:</div>
        <div class="game-question-word" id="chain-letter-disp" style="font-size:3rem;letter-spacing:4px;color:var(--amber,#F59E0B)"><i class="ti ti-chain"></i> ${state.chain.letter}</div>
        <div style="font-size:12px;color:var(--text2)">Valid English words only \u00B7 Last letter becomes next start</div>
      </div>
      <div class="chain-chips-wrap" id="chain-chips"></div>
      <div class="game-input-row stagger-2">
        <input type="text" id="chain-inp" placeholder="Type a word..." autocomplete="off" autocorrect="off" spellcheck="false">
        <button id="chain-add-btn"><i class="ti ti-plus"></i> Add</button>
      </div>
      <div class="game-feedback" id="chain-fb"></div>
      <div style="text-align:center;margin-top:10px;display:flex;gap:8px;justify-content:center">
        <button id="chain-skip-btn" style="background:none;border:1px solid var(--vm-glass-border);padding:6px 14px;border-radius:8px;cursor:pointer;font-size:12px;color:var(--vm-text-secondary)"><i class="ti ti-player-skip"></i> Skip (âˆ’3 XP)</button>
        <button id="chain-end-btn" style="background:var(--accent);color:#fff;border:none;padding:6px 18px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700"><i class="ti ti-check"></i> Finish & Collect XP</button>
      </div>
    `;
    const inp = el('chain-inp');
    if (inp) { inp.onkeydown = (e) => { if (e.key === 'Enter') checkChain(); }; setTimeout(() => inp.focus(), 100); }
    const addBtn = el('chain-add-btn');
    if (addBtn) addBtn.onclick = checkChain;
    const skipBtn = el('chain-skip-btn');
    if (skipBtn) skipBtn.onclick = skipChain;
    const endBtn = el('chain-end-btn');
    if (endBtn) endBtn.onclick = endChain;
  }

  function checkChain() {
    const inp = el('chain-inp');
    const fb = el('chain-fb');
    if (!inp || !inp.value.trim()) return;
    const raw = inp.value.trim();
    const word = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    inp.value = '';
    if (state.chain.count >= state.chain.maxWords) {
      if (fb) { fb.textContent = '\u274C Max 15 words reached! Hit Finish.'; fb.style.color = '#DC2626'; }
    } else if (word[0].toUpperCase() !== state.chain.letter) {
      if (fb) { fb.textContent = '\u274C Word must start with "' + state.chain.letter + '"'; fb.style.color = '#DC2626'; }
    } else if (state.chain.used.includes(word.toLowerCase())) {
      if (fb) { fb.textContent = '\u26A0\uFE0F Word already used!'; fb.style.color = '#D97706'; }
    } else if (word.length < 2) {
      if (fb) { fb.textContent = '\u274C At least 2 letters needed'; fb.style.color = '#DC2626'; }
    } else if (!isValidEnglishWord(word)) {
      if (fb) { fb.textContent = '\u274C "' + word + '" is not a valid English word'; fb.style.color = '#DC2626'; }
    } else {
      state.chain.used.push(word.toLowerCase());
      state.chain.count++;
      state.correct++;
      awardXP(1);
      state.xpEarned += 1;
      state.chain.letter = word[word.length - 1].toUpperCase();
      if (state.chain.letter < 'A' || state.chain.letter > 'Z') {
        const fallback = 'ABCDEFGHLMNPRST'[Math.floor(Math.random() * 15)];
        state.chain.letter = fallback;
      }
      const chips = el('chain-chips');
      if (chips) {
        const chip = document.createElement('span');
        chip.className = 'chain-chip';
        chip.innerHTML = '<i class="ti ti-link" style="font-size:12px;opacity:0.7"></i> ' + word;
        chip.style.animation = 'vmPageIn 0.3s ease';
        chips.appendChild(chip);
      }
      const ld = el('chain-letter-disp');
      if (ld) { ld.innerHTML = '<i class="ti ti-chain"></i> ' + state.chain.letter; ld.style.animation = 'game-bounce-in 0.4s cubic-bezier(0.34,1.56,0.64,1)'; }
      const prog = el('game-progress-label');
      if (prog) prog.innerHTML = '<i class="ti ti-chain"></i> Chain: ' + state.chain.count + '/15';
      if (state.chain.count >= state.chain.maxWords) {
        if (fb) { fb.textContent = '\u2714\uFE0F 15 words done! Hit Finish to collect.'; fb.style.color = '#059669'; }
        const endBtn = el('chain-end-btn');
        if (endBtn) endBtn.style.boxShadow = '0 0 0 3px rgba(91,61,232,0.3)';
      } else {
        if (state.chain.count % 5 === 0 && typeof fireConfetti === 'function') {
          fireConfetti(20);
        }
        if (fb) { fb.textContent = '\u2714 +2 XP! Next: ' + state.chain.letter; fb.style.color = '#059669'; }
      }
      updateGamesUI();
    }
    setTimeout(() => { if (fb) fb.textContent = ''; }, 2000);
    setTimeout(() => { const i = el('chain-inp'); if (i) i.focus(); }, 50);
  }

  function skipChain() {
    const letters = 'ABCDEFGHLMNPRST';
    state.chain.letter = letters[Math.floor(Math.random() * letters.length)];
    const ld = el('chain-letter-disp');
    if (ld) ld.innerHTML = '<i class="ti ti-chain"></i> ' + state.chain.letter;
    awardXP(-1);
    state.xpEarned = Math.max(0, state.xpEarned - 1);
    const fb = el('chain-fb');
    if (fb) { fb.textContent = '\u23ED Skipped (\u22123 XP). New letter: ' + state.chain.letter; fb.style.color = '#D97706'; }
    updateGamesUI();
    setTimeout(() => { if (fb) fb.textContent = ''; }, 2000);
  }

  function endChain() {
    incrementGamesPlayed();
    if (state.chain.count >= 5) earnPowerup('skip');
    if (state.chain.count >= 10) earnPowerup('hint');
    const gStats = getGamesStats();
    el('result-trophy').innerHTML = state.chain.count >= 5 ? '<i class="ti ti-trophy" style="color:#FBBF24;font-size:inherit"></i>' : '<i class="ti ti-star" style="color:#FBBF24;font-size:inherit"></i>';
    el('result-title').textContent = 'Word Chain Complete!';
    el('result-subtitle').textContent = state.chain.count + ' words chained';
    el('result-xp-amount').textContent = '+' + state.xpEarned + ' XP';
    el('result-xp-total').textContent = 'Bugungi XP: ' + getDailyXP() + ' | Jami: ' + (gStats.totalXP || 0);
    el('rs-correct').textContent = state.chain.count;
    el('rs-wrong').textContent = 0;
    el('rs-accuracy').textContent = '100%';
    const achEl = el('result-achievement');
    if (achEl) {
      if (state.chain.count >= 5) {
        achEl.style.display = 'flex';
        el('ach-icon').innerHTML = '<i class="ti ti-chain" style="color:#5B3DE8"></i>';
        el('ach-text').textContent = 'Chain Master! 5+ words chained!';
      } else { achEl.style.display = 'none'; }
    }
    if (state.chain.count >= 5 && typeof fireConfetti === 'function') {
      setTimeout(() => fireConfetti(40), 300);
    }
    renderWrongWordReview();
    playSound('complete');
    showArea('games-result-area');
    updateGamesUI();
  }

  // â”€â”€â”€â”€â”€ SYNONYM STORM â”€â”€â”€â”€â”€
  async function startSynonym() {
    const words = await fetchWordsForGame(6);
    if (guardGame('synonym')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) {
      el('game-content-area').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>';
      return;
    }
    const synData = [];
    for (const w of words) {
      let syns = w.synonyms || [];
      if (syns.length < 3) {
        const apiSyns = await fetchSynonyms(w.word);
        if (apiSyns && apiSyns.length > 0) syns = apiSyns;
      }
      if (syns.length >= 1) {
        const correct = syns[0];
        const wrongPool = words.filter(x => x.word !== w.word).flatMap(x => x.synonyms || []);
        const wrong = shuffle(wrongPool.filter(s => s.toLowerCase() !== correct.toLowerCase())).slice(0, 3);
        while (wrong.length < 3) { const filler = shuffle(words.filter(x => x.word !== w.word))[0]; if (filler) wrong.push(filler.word); else wrong.push('Unknown'); }
        synData.push({ word: w.word, context: w.example || ('The word "' + w.word + '" describes something ' + w.def.toLowerCase()), options: shuffle([correct, ...wrong]), correct });
      }
    }
    if (synData.length < 3) {
      el('game-content-area').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">Not enough synonym data. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>';
      return;
    }
    state._synData = synData.slice(0, Math.max(3, gameSettings.questionCount || 6));
    nextSynonym();
  }

  function nextSynonym() {
    if (state.q >= state._synData.length) { endGame(state.correct * 3); return; }
    const q = state._synData[state.q];
    setProgress(state.q + 1, state._synData.length);
    const opts = shuffle([...q.options]);
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = `
      <div class="game-question-card stagger-1">
        <div class="game-question-label">Which word is a synonym of <span style="color:#EC4899;font-weight:700">"${q.word}"</span>?</div>
        ${q.context ? '<div class="game-question-text" style="font-style:italic;font-size:14px;color:var(--text2);margin-top:8px">"' + q.context + '"</div>' : ''}
      </div>
      <div class="game-options-grid stagger-2">
        ${opts.map((o, i) => '<button class="game-option-btn" id="so' + i + '"' + (o === q.correct ? ' data-correct="true"' : '') + '>' + o + '</button>').join('')}
      </div>
      <div class="game-feedback" id="syn-fb"></div>
    `;
    opts.forEach((o, i) => {
      const btn = el('so' + i);
      if (btn) btn.onclick = () => answerSynonym(o === q.correct, i);
    });
    const diffMods = getDifficultyMods();
    const tSec = Math.round((gameSettings.timeLimit || 15) * diffMods.timeMult);
    setTimer(Math.max(4, tSec), () => {
      state.wrong++; state.streak = 0;
      playSound('wrong');
      const fb = el('syn-fb');
      if (fb) { fb.innerHTML = '\u23F1 Time! Answer: <strong>' + q.correct + '</strong>'; fb.style.color = '#DC2626'; }
      document.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
      state.q++; updateGamesUI(); setTimeout(nextSynonym, 1200);
    });
  }

  function answerSynonym(correct, idx) {
    clearInterval(state.timer);
    document.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
    const btn = el('so' + idx);
    if (correct) { state.correct++; state.streak++; burstAtRect(btn); correctAnimation(btn); playSound('correct'); }
    else {
      state.wrong++; state.streak = 0; wrongAnimation(btn); playSound('wrong');
      const q = state._synData[state.q];
      if (q) wrongWords.push({ word: q.word, def: 'Synonym of ' + q.word, userAnswer: el('so' + idx)?.textContent || '', correctAnswer: q.correct });
    }
    state.q++;
    if (state.endless && state.wrong > 0) { updateGamesUI(); setTimeout(() => endGame(state.correct * 2), 600); return; }
    updateGamesUI(); setTimeout(nextSynonym, 900);
  }

  // â”€â”€â”€â”€â”€ FILL THE GAP â”€â”€â”€â”€â”€
  async function startGap() {
    const words = await fetchWordsForGame(5);
    if (guardGame('gap')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) {
      el('game-content-area').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>';
      return;
    }
    const qCount = Math.max(3, gameSettings.questionCount || 5);
    const gapData = [];
    for (const w of words.slice(0, qCount)) {
      let sentence = w.example || '';
      let options = [w.word];
      if (!sentence || !sentence.toLowerCase().includes(w.word.toLowerCase())) {
        sentence = 'The word "___" is often used to describe something that is ' + w.def.toLowerCase() + '.';
        sentence = sentence.replace('"___"', '___');
      } else {
        const regex = new RegExp('\\b' + w.word + '\\b', 'i');
        sentence = sentence.replace(regex, '___');
      }
      const wrongPool = shuffle(words.filter(x => x.word.toLowerCase() !== w.word.toLowerCase()).map(x => x.word));
      for (let i = 0; i < 3 && i < wrongPool.length; i++) options.push(wrongPool[i]);
      gapData.push({ sentence, word: w.word, options: shuffle(options) });
    }
    if (gapData.length < 3) {
      el('game-content-area').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">Could not generate gap sentences. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>';
      return;
    }
    state._gapData = gapData;
    nextGap();
  }

  function nextGap() {
    if (state.q >= state._gapData.length) { endGame(state.correct * 3); return; }
    const q = state._gapData[state.q];
    setProgress(state.q + 1, state._gapData.length);
    const pill = el('game-timer-pill');
    if (pill) pill.style.display = 'none';
    const opts = shuffle([...q.options]);
    const highlighted = q.sentence.replace('___', '<span style="background:var(--surface2);color:var(--accent2);padding:2px 14px;border-radius:6px;font-weight:700">_____</span>');
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = `
      <div class="game-question-card stagger-1">
        <div class="game-question-label">Fill in the blank:</div>
        <div class="game-question-text" style="line-height:1.9;margin-top:10px">${highlighted}</div>
      </div>
      <div class="game-options-grid stagger-2">
        ${opts.map((o, i) => '<button class="game-option-btn" id="go' + i + '"' + (o === q.word ? ' data-correct="true"' : '') + '>' + o + '</button>').join('')}
      </div>
      <div class="game-feedback" id="gap-fb"></div>
    `;
    opts.forEach((o, i) => {
      const btn = el('go' + i);
      if (btn) btn.onclick = () => answerGap(o === q.word, i, q.word);
    });
  }

  function answerGap(correct, idx, correctWord) {
    document.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
    const btn = el('go' + idx);
    if (correct) { state.correct++; state.streak++; burstAtRect(btn); correctAnimation(btn); playSound('correct'); }
    else {
      state.wrong++; state.streak = 0; wrongAnimation(btn); playSound('wrong');
      showCorrectAnswer(el('game-content-area'), correctWord);
      const q = state._gapData[state.q];
      if (q) wrongWords.push({ word: correctWord, def: q.sentence || '', userAnswer: el('go' + idx)?.textContent || '', correctAnswer: correctWord });
    }
    state.q++;
    if (state.endless && state.wrong > 0) { updateGamesUI(); setTimeout(() => endGame(state.correct * 3), 600); return; }
    updateGamesUI(); setTimeout(nextGap, 1000);
  }

  // â”€â”€â”€â”€â”€ POWER-UPS BAR â”€â”€â”€â”€â”€
  function renderPowerupsBar() {
    const bar = el('game-powerups-bar');
    if (!bar) return;
    if (state.currentGame === 'chain' || state.currentGame === 'daily' || !state.currentGame) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex';
    let html = '';
    for (const t of POWERUP_TYPES) {
      const cnt = powerups[t] || 0;
      const avail = cnt > 0 && state.currentGame && !state.endless && !state.powerupActive;
      html += '<div class="powerup-pill' + (cnt > 0 ? ' available' : '') + '" data-pu="' + t + '" onclick="Games.usePowerup(\'' + t + '\')" title="' + POWERUP_NAMES[t] + ': ' + cnt + '">' +
        '<i class="' + POWERUP_ICONS[t] + '"></i> ' + POWERUP_NAMES[t] +
        (cnt > 0 ? ' <span class="pu-count">' + cnt + '</span>' : '') +
        '</div>';
    }
    bar.innerHTML = html;
  }

  // â”€â”€â”€â”€â”€ USE POWER-UP â”€â”€â”€â”€â”€
  function spendPowerup(type) {
    if (!powerups[type] || powerups[type] < 1) return false;
    powerups[type]--;
    savePowerups(powerups);
    return true;
  }

  function usePowerup(type) {
    if (state.powerupActive || !state.currentGame || state.endless) return;
    if (!powerups[type] || powerups[type] < 1) { if (typeof showToast === 'function') showToast('Power-up yetarli emas!', 'warning', 1200); return; }
    if (type === 'skip') {
      if (!spendPowerup('skip')) return;
      state.powerupActive = 'skip';
      clearInterval(state.timer);
      state.q++;
      playSound('powerup');
      if (typeof showToast === 'function') showToast('Savol o\'tkazib yuborildi!', 'info', 1000);
      const game = state.currentGame;
      if (game === 'flash') setTimeout(nextFlash, 300);
      else if (game === 'spell') setTimeout(nextSpell, 300);
      else if (game === 'synonym') setTimeout(nextSynonym, 300);
      else if (game === 'gap') setTimeout(nextGap, 300);
      setTimeout(() => { state.powerupActive = null; renderPowerupsBar(); }, 500);
    } else if (type === 'hint') {
      if (!spendPowerup('hint')) return;
      state.powerupActive = 'hint';
      playSound('powerup');
      const hintEl = document.querySelector('.game-question-word, .game-question-text');
      if (hintEl) {
        const origText = hintEl.textContent || '';
        const hint = 'Starts with "' + origText.trim()[0] + '"';
        const toast = document.createElement('div');
        toast.className = 'sound-toast';
        toast.textContent = '\uD83D\uDCA1 ' + hint;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1800);
      }
      setTimeout(() => { state.powerupActive = null; renderPowerupsBar(); }, 500);
    } else if (type === 'fifty') {
      if (!spendPowerup('fifty')) return;
      state.powerupActive = 'fifty';
      playSound('powerup');
      const options = document.querySelectorAll('.game-option-btn:not(:disabled)');
      if (options.length > 2) {
        const wrongOnes = [];
        options.forEach(btn => {
          if (!btn.classList.contains('correct') && wrongOnes.length < Math.ceil(options.length / 2)) {
            const isCorrect = btn.getAttribute('data-correct') === 'true' || btn.classList.contains('correct-flash-data');
            if (!isCorrect) wrongOnes.push(btn);
          }
        });
        wrongOnes.slice(0, Math.max(1, options.length - 2)).forEach(b => { b.disabled = true; b.style.opacity = '0.3'; });
        if (typeof showToast === 'function') showToast('50/50: Noto\'g\'ri variantlar olib tashlandi!', 'info', 1200);
      } else {
        if (typeof showToast === 'function') showToast('50/50 uchun yetarli variant yo\'q', 'warning', 1000);
      }
      setTimeout(() => { state.powerupActive = null; renderPowerupsBar(); }, 500);
    } else if (type === 'freeze') {
      if (!spendPowerup('freeze')) return;
      state.powerupActive = 'freeze';
      state.frozen = true;
      playSound('powerup');
      const fp = el('game-timer-pill');
      if (fp) fp.classList.add('frozen');
      if (typeof showToast === 'function') showToast('Vaqt muzlatildi! 5 soniya', 'info', 1500);
      setTimeout(() => {
        state.frozen = false;
        state.powerupActive = null;
        const fp2 = el('game-timer-pill');
        if (fp2) fp2.classList.remove('frozen');
        renderPowerupsBar();
        if (typeof showToast === 'function') showToast('Vaqt davom etmoqda!', 'info', 800);
      }, 5000);
    }
    renderPowerupsBar();
  }

  // â”€â”€â”€â”€â”€ WRONG WORD REVIEW â”€â”€â”€â”€â”€
  function renderWrongWordReview() {
    const section = el('game-review-section');
    if (!section) return;
    if (!wrongWords || wrongWords.length === 0) { section.style.display = 'none'; return; }
    section.style.display = 'block';
    let html = '<div class="review-title" onclick="void(0)"><i class="ti ti-alert-triangle" style="color:#EF4444"></i> Xato qilingan so\'zlar (' + wrongWords.length + ')</div>';
    html += '<div class="review-grid">';
    for (const w of wrongWords) {
      html += '<div class="review-card">';
      html += '<div class="rw-word">' + w.word + '</div>';
      if (w.def) html += '<div class="rw-def">' + w.def + '</div>';
      if (w.userAnswer) html += '<div class="rw-user">\u274C Siz: ' + w.userAnswer + '</div>';
      if (w.correctAnswer && w.userAnswer !== w.correctAnswer) html += '<div class="rw-correct">\u2714 To\'g\'ri: ' + w.correctAnswer + '</div>';
      html += '</div>';
    }
    html += '</div>';
    section.innerHTML = html;
  }

  // â”€â”€â”€â”€â”€ DAILY CHALLENGE â”€â”€â”€â”€â”€
  function getDailySeed() {
    const d = new Date();
    const str = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; }
    return Math.abs(hash);
  }

  function isDailyCompleted() {
    try {
      const d = JSON.parse(localStorage.getItem('vm_daily_challenge') || '{}');
      return d.date === new Date().toDateString() && d.completed === true;
    } catch { return false; }
  }

  function markDailyCompleted(score) {
    try {
      const d = { date: new Date().toDateString(), completed: true, score: score || 0 };
      localStorage.setItem('vm_daily_challenge', JSON.stringify(d));
    } catch {}
  }

  async function startDaily() {
    const qCount = 8;
    const seed = getDailySeed();
    const words = await fetchWordsForGame(qCount + 4);
    if (guardGame('daily')) return;
    hideGameSkeleton();

    const seedWords = [];
    if (words && words.length > 0) {
      const sorted = [...words].sort((a, b) => {
        const ha = (a.word.charCodeAt(0) * seed) % 100;
        const hb = (b.word.charCodeAt(0) * seed) % 100;
        return ha - hb;
      });
      for (const w of sorted) { if (!seedWords.some(x => x.word === w.word)) seedWords.push(w); if (seedWords.length >= qCount) break; }
    }
    state._dailyWords = seedWords.slice(0, qCount);
    state._dailyQ = 0;

    if (isDailyCompleted()) {
      el('game-content-area').innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)"><i class="ti ti-circle-check" style="font-size:48px;color:#10B981;display:block;margin-bottom:12px"></i><div style="font-size:18px;font-weight:700;color:var(--text0);margin-bottom:8px">Daily Challenge Completed!</div><div style="font-size:13px;color:var(--text2)">Ertangi chaqlenjni kuting!</div><button style="margin-top:16px;background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;cursor:pointer" onclick="Games.backToMenu()">Menyuga qaytish</button></div>';
      return;
    }
    nextDaily();
  }

  function nextDaily() {
    if (state._dailyQ >= state._dailyWords.length) {
      const bonus = state.correct >= state._dailyWords.length ? 5 : state.correct >= Math.ceil(state._dailyWords.length / 2) ? 3 : 0;
      const earned = state.correct * 3 + bonus;
      state.xpEarned = earned;
      awardXP(earned);
      incrementGamesPlayed();
      markDailyCompleted(state.correct);
      if (state.correct >= state._dailyWords.length && typeof fireConfetti === 'function') setTimeout(() => fireConfetti(60), 300);
      el('result-trophy').innerHTML = state.correct >= state._dailyWords.length ? '<i class="ti ti-trophy" style="color:#FBBF24;font-size:inherit"></i>' : '<i class="ti ti-star" style="color:#FBBF24;font-size:inherit"></i>';
      el('result-title').textContent = state.correct >= state._dailyWords.length ? 'Daily Challenge Complete!' : 'Yaxshi urinish!';
      el('result-subtitle').textContent = state.correct + '/' + state._dailyWords.length + ' to\'g\'ri \u00B7 ' + (bonus > 0 ? ' Bonus: +' + bonus + ' XP' : '');
      el('result-xp-amount').textContent = '+' + earned + ' XP';
      const gs = getGamesStats();
      el('result-xp-total').textContent = 'Bugungi XP: ' + getDailyXP() + ' | Jami: ' + (gs.totalXP || 0);
      el('rs-correct').textContent = state.correct;
      el('rs-wrong').textContent = state.wrong;
      el('rs-accuracy').textContent = Math.round((state.correct / Math.max(1, state.correct + state.wrong)) * 100) + '%';
      renderWrongWordReview();
      playSound('complete');
      showArea('games-result-area');
      updateGamesUI();
      return;
    }
    const q = state._dailyWords[state._dailyQ];
    const prog = el('game-progress-label');
    if (prog) prog.textContent = 'Q ' + (state._dailyQ + 1) + '/' + state._dailyWords.length;
    const wrongDefs = state._dailyWords.filter(w => w.word !== q.word).map(w => w.def);
    const shuffled = shuffle([q.def, ...shuffle(wrongDefs).slice(0, 3)]);
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = `
      <div class="game-question-card stagger-1">
        <div class="game-question-label" style="color:#F97316"><i class="ti ti-calendar-star"></i> Daily Challenge</div>
        <div class="game-question-word">${q.word}</div>
        ${q.pos ? '<div class="game-question-pos">(' + q.pos + ')</div>' : ''}
      </div>
      <div class="game-options-grid stagger-2">
        ${shuffled.map((o, i) => '<button class="game-option-btn" id="do' + i + '"' + (o === q.def ? ' data-correct="true"' : '') + '>' + o + '</button>').join('')}
      </div>
      <div class="game-feedback" id="daily-fb"></div>
    `;
    shuffled.forEach((o, i) => {
      const btn = el('do' + i);
      if (btn) btn.onclick = () => answerDaily(o === q.def, i, q.def);
    });
    setTimer(12, () => {
      state.wrong++; state.streak = 0;
      playSound('wrong');
      const fb = el('daily-fb');
      if (fb) { fb.innerHTML = '\u23F1 Time! Answer: <strong>' + q.def + '</strong>'; fb.style.color = '#DC2626'; }
      document.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
      showCorrectAnswer(content, q.def);
      wrongWords.push({ word: q.word, def: q.def, userAnswer: '(timeout)', correctAnswer: q.def });
      state._dailyQ++; updateGamesUI(); setTimeout(nextDaily, 1200);
    });
  }

  function answerDaily(correct, idx, correctDef) {
    clearInterval(state.timer);
    document.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
    const btn = el('do' + idx);
    if (correct) { state.correct++; state.streak++; burstAtRect(btn); correctAnimation(btn); playSound('correct'); }
    else { state.wrong++; state.streak = 0; playSound('wrong'); wrongAnimation(btn); showCorrectAnswer(el('game-content-area'), correctDef); wrongWords.push({ word: state._dailyWords[state._dailyQ]?.word || '', def: correctDef, userAnswer: btn?.textContent || '', correctAnswer: correctDef }); }
    state._dailyQ++; updateGamesUI(); setTimeout(nextDaily, 900);
  }

  // â”€â”€â”€â”€â”€ ANAGRAM TWIST â”€â”€â”€â”€â”€
  async function startAnagram() {
    const qCount = Math.max(3, (gameSettings.questionCount || 5));
    const words = await fetchWordsForGame(qCount + 2);
    if (guardGame('anagram')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    state._anagramWords = words.slice(0, qCount);
    state._anagramQ = 0;
    nextAnagram();
  }
  function nextAnagram() {
    if (state._anagramQ >= state._anagramWords.length) { endGame(4); return; }
    const q = state._anagramWords[state._anagramQ];
    let scrambled = shuffle(q.word.split('')).join('');
    if (scrambled === q.word) scrambled = shuffle(q.word.split(''),true).join('');
    const prog = el('game-progress-label');
    if (prog) prog.textContent = 'Q ' + (state._anagramQ + 1) + '/' + state._anagramWords.length;
    const hint = q.def ? q.def.substring(0,20)+(q.def.length>20?'...':'') : '';
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = '<div class="game-question-card stagger-1"><div class="game-question-label"><i class="ti ti-arrows-shuffle"></i> Anagram Twist</div><div class="anagram-scramble">' + scrambled.toUpperCase() + '</div><div style="text-align:center;font-size:13px;color:var(--text2);margin-bottom:4px">' + hint + '</div></div><div style="display:flex;gap:10px;max-width:340px;margin:0 auto;padding:0 4px"><input id="ani" type="text" class="game-text-input" placeholder="So\'zni yozing..." style="flex:1" autofocus><button class="game-submit-btn" id="ans">OK</button></div><div class="game-feedback" id="anfb"></div>';
    const inp = el('ani');
    if (inp) { inp.focus(); inp.onkeydown = function(e) { if (e.key === 'Enter') answerAnagram(); }; }
    const sbtn = el('ans');
    if (sbtn) sbtn.onclick = answerAnagram;
    setTimer(20, () => { if (!content) return; state.wrong++; state.streak=0; playSound('wrong'); const fb=el('anfb'); if(fb){fb.innerHTML='\u23F1 Time! <strong>'+q.word+'</strong>';fb.style.color='#DC2626';} wrongWords.push({word:q.word,def:q.def||'',userAnswer:'(timeout)',correctAnswer:q.word}); disableGameInputs(content); state._anagramQ++; updateGamesUI(); setTimeout(nextAnagram,1200); });
  }
  function answerAnagram() {
    const q = state._anagramWords[state._anagramQ];
    if (!q) return;
    clearInterval(state.timer);
    const inp = el('ani');
    const fb = el('anfb');
    const content = el('game-content-area');
    if (!inp || !fb || !content) return;
    const ans = inp.value.trim().toLowerCase();
    const correct = ans === q.word.toLowerCase();
    disableGameInputs(content);
    if (correct) { state.correct++; state.streak++; burstAtRect(inp); correctAnimation(inp); playSound('correct'); fb.innerHTML = '<i class="ti ti-check"></i> To\'g\'ri!'; fb.style.color = '#10B981'; }
    else { state.wrong++; state.streak = 0; playSound('wrong'); wrongAnimation(inp); fb.innerHTML = '<i class="ti ti-x"></i> <strong>' + q.word + '</strong>'; fb.style.color = '#DC2626'; wrongWords.push({word:q.word,def:q.def||'',userAnswer:ans,correctAnswer:q.word}); }
    state._anagramQ++; updateGamesUI(); setTimeout(nextAnagram, 1000);
  }

  // â”€â”€â”€â”€â”€ WORD HANGMAN â”€â”€â”€â”€â”€
  const HANGMAN_STAGES = ['','O','|','/','\\','/','\\'];
  async function startHangman() {
    const qCount = Math.max(2, Math.min(4, gameSettings.questionCount || 3));
    const words = await fetchWordsForGame(qCount + 2);
    if (guardGame('hangman')) return;
    hideGameSkeleton();
    if (!words || words.length < 2) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    state._hmWords = words.slice(0, qCount);
    state._hmQ = 0; state._hmLives = 6; state._hmGuessed = []; state._hmRevealed = [];
    nextHangman();
  }
  function nextHangman() {
    if (state._hmQ >= state._hmWords.length) { endGame(4); return; }
    const q = state._hmWords[state._hmQ];
    state._hmLives = 6; state._hmGuessed = []; state._hmRevealed = q.word.split('').map(c => /[^a-zA-Z\u00C0-\u024f]/.test(c) ? c : '_');
    const prog = el('game-progress-label');
    if (prog) prog.textContent = 'So\'z ' + (state._hmQ + 1) + '/' + state._hmWords.length;
    renderHangman();
  }
  function renderHangman() {
    const q = state._hmWords[state._hmQ];
    const content = el('game-content-area');
    if (!content || !q) return;
    const wordDisplay = state._hmRevealed.map((c,i) => c === '_' ? '<span class="hm-letter" data-i="'+i+'">_</span>' : c === ' ' ? '<span class="hm-letter space">&nbsp;</span>' : '<span class="hm-letter revealed">'+c+'</span>').join('');
    const livesStr = '\u2764 '.repeat(state._hmLives);
    const kbRows = ['qwertyuiop','asdfghjkl','zxcvbnm'];
    const kb = kbRows.map(r => r.split('').map(c => {
      const cls = state._hmGuessed.includes(c) ? (state._hmRevealed.includes(c) ? 'correct' : 'wrong') : '';
      return '<button class="hm-key ' + cls + '" data-k="' + c + '"' + (state._hmGuessed.includes(c) ? ' disabled' : '') + '>' + c + '</button>';
    }).join('')).join('</div><div class="hm-kb">');
    const svgParts = state._hmLives <= 5 ? '<line x1="20" y1="140" x2="120" y2="140" stroke="#555" stroke-width="3"/>' : '';
    const svgParts2 = state._hmLives <= 5 ? '<line x1="70" y1="20" x2="70" y2="140" stroke="#555" stroke-width="3"/>' : '';
    const svgParts3 = state._hmLives <= 4 ? '<line x1="70" y1="20" x2="110" y2="20" stroke="#555" stroke-width="3"/>' : '';
    const svgParts4 = state._hmLives <= 3 ? '<line x1="110" y1="20" x2="110" y2="40" stroke="#555" stroke-width="3"/>' : '';
    const svgParts5 = state._hmLives <= 2 ? '<circle cx="110" cy="48" r="8" fill="none" stroke="#555" stroke-width="2.5"/>' : '';
    const svgParts6 = state._hmLives <= 1 ? '<line x1="110" y1="56" x2="110" y2="90" stroke="#555" stroke-width="2.5"/>' : '';
    const svgParts7 = state._hmLives <= 0 ? '<line x1="110" y1="70" x2="95" y2="60" stroke="#555" stroke-width="2.5"/><line x1="110" y1="70" x2="125" y2="60" stroke="#555" stroke-width="2.5"/><line x1="110" y1="90" x2="100" y2="110" stroke="#555" stroke-width="2.5"/><line x1="110" y1="90" x2="120" y2="110" stroke="#555" stroke-width="2.5"/>' : '';
    content.innerHTML = '<div class="game-question-card stagger-1"><div class="game-question-label"><i class="ti ti-hanger"></i> Word Hangman</div></div><div class="hm-lives">' + livesStr + (q.def ? ' <span style="color:var(--text2);font-weight:400">' + q.def.substring(0,40) + '</span>' : '') + '</div><div class="hm-draw"><svg viewBox="0 0 140 160">' + svgParts + svgParts2 + svgParts3 + svgParts4 + svgParts5 + svgParts6 + svgParts7 + '</svg></div><div class="hm-word">' + wordDisplay + '</div><div class="hm-kb">' + kb + '</div><div class="game-feedback" id="hmfb"></div><input id="hmkb" type="text" maxlength="1" style="position:absolute;width:1px;height:1px;padding:0;border:0;opacity:0;pointer-events:none" autofocus>';
    document.querySelectorAll('.hm-key:not(:disabled)').forEach(b => b.onclick = function() { guessHangman(this.dataset.k); });
    const kbInp = el('hmkb');
    if (kbInp) {
      kbInp.focus();
      kbInp.onkeydown = function(e) {
        const c = e.key.toLowerCase();
        if (c.length === 1 && /[a-z]/.test(c)) {
          e.preventDefault();
          guessHangman(c);
          this.value = '';
        }
      };
      kbInp.onblur = function() { setTimeout(() => this.focus(), 50); };
    }
  }
  function guessHangman(letter) {
    clearInterval(state.timer);
    const q = state._hmWords[state._hmQ];
    if (!q || state._hmGuessed.includes(letter)) return;
    state._hmGuessed.push(letter);
    const word = q.word.toLowerCase();
    const idxs = [];
    word.split('').forEach((c,i) => { if (c === letter) { idxs.push(i); state._hmRevealed[i] = c; } });
    if (idxs.length > 0) {
      playSound('correct');
      if (state._hmRevealed.every(c => c !== '_')) {
        state.correct++; state.streak++;
        const fb = el('hmfb'); if (fb) { fb.innerHTML = '<i class="ti ti-check"></i> ' + q.word + ' - To\'g\'ri!'; fb.style.color = '#10B981'; }
        document.querySelectorAll('.hm-key').forEach(b => b.disabled = true);
        state._hmQ++; updateGamesUI(); setTimeout(nextHangman, 1200);
        return;
      }
    } else {
      state._hmLives--; playSound('wrong');
      if (state._hmLives <= 0) {
        state.wrong++; state.streak = 0;
        const fb = el('hmfb'); if (fb) { fb.innerHTML = '\u274C ' + q.word; fb.style.color = '#DC2626'; }
        wrongWords.push({word:q.word,def:q.def||'',userAnswer:'(lost)',correctAnswer:q.word});
        document.querySelectorAll('.hm-key').forEach(b => b.disabled = true);
        state._hmQ++; updateGamesUI(); setTimeout(nextHangman, 1500);
        return;
      }
    }
    renderHangman();
  }

  // â”€â”€â”€â”€â”€ MEMORY MATCH â”€â”€â”€â”€â”€
  async function startMemory() {
    const pairCount = Math.min(4, Math.max(2, Math.floor((gameSettings.questionCount || 4) / 2)));
    const words = await fetchWordsForGame(pairCount + 2);
    if (guardGame('memory')) return;
    hideGameSkeleton();
    if (!words || words.length < pairCount) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    const pairs = words.slice(0, pairCount).map(w => ({ word: w.word, def: w.def || w.word }));
    let cards = [];
    pairs.forEach((p, i) => { cards.push({ id: i*2, pairId: i, type: 'word', text: p.word, matched: false }); cards.push({ id: i*2+1, pairId: i, type: 'def', text: p.def, matched: false }); });
    cards = shuffle(cards);
    state._memCards = cards; state._memPairs = pairs.length;
    state._memFlipped = []; state._memMatched = 0; state._memLocked = false;
    state._memAttempts = 0;
    const prog = el('game-progress-label');
    if (prog) prog.textContent = '0 / ' + pairs.length + ' juft';
    renderMemory();
  }
  function renderMemory() {
    const content = el('game-content-area');
    if (!content) return;
    const grid = document.createElement('div'); grid.className = 'mem-grid';
    state._memCards.forEach((c, i) => {
      const card = document.createElement('div');
      card.className = 'mem-card' + (c.matched ? ' matched' : '');
      card.dataset.idx = i;
      card.innerHTML = '<div class="mem-card-inner"><div class="mem-card-face mem-card-front">?</div><div class="mem-card-face mem-card-back">' + (c.type === 'word' ? '<strong>' + c.text + '</strong>' : c.text) + '</div></div>';
      if (!c.matched) card.onclick = function() { flipMemory(parseInt(this.dataset.idx)); };
      grid.appendChild(card);
    });
    const prog = el('game-progress-label');
    if (prog) prog.textContent = state._memMatched + ' / ' + state._memPairs + ' juft';
    content.innerHTML = '';
    content.appendChild(grid);
    const stats = document.createElement('div');
    stats.className = 'mem-stats';
    stats.innerHTML = 'Urinishlar: <strong>' + state._memAttempts + '</strong> \u00B7 Qolgan: <strong>' + (state._memPairs - state._memMatched) + '</strong>';
    content.appendChild(stats);
    if (state._memMatched >= state._memPairs) {
      const bonus = Math.max(0, state._memPairs * 2 - state._memAttempts);
      state.xpEarned = state._memMatched * 3 + bonus;
      awardXP(state.xpEarned);
      incrementGamesPlayed();
      if (state._memAttempts === state._memPairs && typeof fireConfetti === 'function') setTimeout(() => fireConfetti(60), 300);
      const resEl = el('result-trophy');
      if (resEl) resEl.innerHTML = '<i class="ti ti-trophy" style="color:#FBBF24;font-size:inherit"></i>';
      const resTitle = el('result-title');
      if (resTitle) resTitle.textContent = 'Memory Complete!';
      const resSub = el('result-subtitle');
      if (resSub) resSub.textContent = state._memMatched + '/' + state._memPairs + ' juft \u00B7 ' + state._memAttempts + ' urinish';
      const xpAmt = el('result-xp-amount');
      if (xpAmt) xpAmt.textContent = '+' + state.xpEarned + ' XP';
      const gs = getGamesStats();
      const xpTot = el('result-xp-total');
      if (xpTot) xpTot.textContent = 'Jami: ' + (gs.totalXP || 0);
      const rsc = el('rs-correct'); if (rsc) rsc.textContent = state._memMatched;
      const rsw = el('rs-wrong'); if (rsw) rsw.textContent = '0';
      const rsa = el('rs-accuracy'); if (rsa) rsa.textContent = Math.round((state._memMatched / Math.max(1, state._memAttempts)) * 100) + '%';
      renderWrongWordReview();
      playSound('complete');
      showArea('games-result-area');
    }
  }
  function flipMemory(idx) {
    if (state._memLocked) return;
    const card = state._memCards[idx];
    if (!card || card.matched || state._memFlipped.includes(idx)) return;
    if (state._memFlipped.length >= 2) return;
    state._memFlipped.push(idx);
    renderMemory();
    const cards = document.querySelectorAll('.mem-card');
    if (cards[idx]) cards[idx].classList.add('flipped');
    if (state._memFlipped.length === 2) {
      state._memLocked = true;
      state._memAttempts++;
      const [a, b] = state._memFlipped;
      const ca = state._memCards[a];
      const cb = state._memCards[b];
      if (ca.pairId === cb.pairId && ca.type !== cb.type) {
        state._memMatched++;
        ca.matched = true; cb.matched = true;
        playSound('correct');
        state._memFlipped = [];
        state._memLocked = false;
        renderMemory();
      } else {
        playSound('wrong');
        setTimeout(() => {
          state._memFlipped = [];
          state._memLocked = false;
          renderMemory();
        }, 800);
      }
    }
  }

  // â”€â”€â”€â”€â”€ AUDIO QUIZ â”€â”€â”€â”€â”€
  function getSpeechSynth() { try { return window.speechSynthesis; } catch { return null; } }
  async function startAudioquiz() {
    const qCount = Math.max(3, gameSettings.questionCount || 5);
    const words = await fetchWordsForGame(qCount + 2);
    if (guardGame('audioquiz')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    state._aqWords = words.slice(0, qCount);
    state._aqQ = 0;
    nextAudioquiz();
  }
  function nextAudioquiz() {
    if (state._aqQ >= state._aqWords.length) { endGame(5); return; }
    const q = state._aqWords[state._aqQ];
    const prog = el('game-progress-label');
    if (prog) prog.textContent = 'Q ' + (state._aqQ + 1) + '/' + state._aqWords.length;
    const wrongDefs = state._aqWords.filter(w => w.word !== q.word).map(w => w.word);
    const shuffled = shuffle([q.word, ...shuffle(wrongDefs).slice(0, 3)]);
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = '<div class="game-question-card stagger-1"><div class="game-question-label"><i class="ti ti-ear"></i> Audio Quiz</div><div style="text-align:center;font-size:14px;color:var(--text2);margin-bottom:8px">Eshitilgan so\'zni toping</div></div><button class="aq-play-btn" id="aqplay"><i class="ti ti-volume"></i></button><div class="game-options-grid stagger-2">' + shuffled.map((o,i) => '<button class="game-option-btn" id="aqo'+i+'"'+(o===q.word?' data-correct="true"':'')+'>'+o+'</button>').join('') + '</div><div class="game-feedback" id="aqfb"></div>';
    shuffled.forEach((o,i) => { const btn=el('aqo'+i); if(btn) btn.onclick = () => answerAudioquiz(o===q.word, i, q.word); });
    const playBtn = el('aqplay');
    if (playBtn) playBtn.onclick = function() { speakWord(q.word); };
    setTimeout(() => speakWord(q.word), 400);
    setTimer(12, () => { state.wrong++; state.streak=0; playSound('wrong'); const fb=el('aqfb'); if(fb){fb.innerHTML='\u23F1 Time! <strong>'+q.word+'</strong>';fb.style.color='#DC2626';} document.querySelectorAll('.game-option-btn').forEach(b=>b.disabled=true); wrongWords.push({word:q.word,def:q.def||'',userAnswer:'(timeout)',correctAnswer:q.word}); state._aqQ++; updateGamesUI(); setTimeout(nextAudioquiz,1200); });
  }
  function speakWord(word) {
    try {
      const synth = getSpeechSynth();
      if (synth) { synth.cancel(); const u = new SpeechSynthesisUtterance(word); u.lang = 'en-US'; u.rate = 0.8; synth.speak(u); }
    } catch {}
  }
  function answerAudioquiz(correct, idx, correctWord) {
    clearInterval(state.timer);
    document.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
    const btn = el('aqo' + idx);
    if (correct) { state.correct++; state.streak++; burstAtRect(btn); correctAnimation(btn); playSound('correct'); const fb=el('aqfb'); if(fb){fb.innerHTML='<i class="ti ti-check"></i> To\'g\'ri!';fb.style.color='#10B981';} }
    else { state.wrong++; state.streak = 0; playSound('wrong'); wrongAnimation(btn); showCorrectAnswer(el('game-content-area'), correctWord); wrongWords.push({word:state._aqWords[state._aqQ]?.word||'',def:'',userAnswer:btn?.textContent||'',correctAnswer:correctWord}); const fb=el('aqfb'); if(fb){fb.innerHTML='<i class="ti ti-x"></i> <strong>'+correctWord+'</strong>';fb.style.color='#DC2626';} }
    state._aqQ++; updateGamesUI(); setTimeout(nextAudioquiz, 900);
  }

  // â”€â”€â”€â”€â”€ TYPING RUSH â”€â”€â”€â”€â”€
  async function startTyping() {
    const words = await fetchWordsForGame(50);
    if (guardGame('typing')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    state._tpWords = words;
    state._tpQ = 0; state._tpCorrect = 0; state._tpWrong = 0;
    state._tpTimeLeft = 30;
    state._tpTotalKeystrokes = 0;
    const prog = el('game-progress-label');
    if (prog) prog.textContent = '30s';
    nextTyping();
  }
  function nextTyping() {
    if (state._tpQ >= state._tpWords.length) state._tpQ = 0;
    const q = state._tpWords[state._tpQ];
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = '<div class="game-question-card stagger-1"><div class="game-question-label"><i class="ti ti-keyboard"></i> Typing Rush</div><div class="typing-word">' + q.word + '</div><div style="display:flex;gap:10px;max-width:340px;margin:0 auto;padding:0 4px"><input id="tpi" type="text" class="game-text-input" placeholder="So\'zni yozing..." style="flex:1" autofocus><button class="game-submit-btn" id="tpans">OK</button></div><div class="game-feedback" id="tfb"></div><div class="typing-wpm">WPM: <strong id="tpwpm">0</strong></div>';
    const inp = el('tpi');
    if (inp) { inp.focus(); inp.onkeydown = function(e) { if (e.key === 'Enter') answerTyping(); }; }
    const sbtn = el('tpans');
    if (sbtn) sbtn.onclick = answerTyping;
    if (!state._tpTimerStarted) {
      state._tpTimerStarted = true;
      state._tpInterval = setInterval(() => {
        state._tpTimeLeft--;
        const prog = el('game-progress-label');
        if (prog) prog.textContent = state._tpTimeLeft + 's';
        const wpmEl = el('tpwpm');
        if (wpmEl) { const mins = Math.max(0.1, 30 - state._tpTimeLeft) / 60; const wpm = mins > 0 ? Math.round(state._tpCorrect / mins) : 0; wpmEl.textContent = wpm; }
        if (state._tpTimeLeft <= 0) {
          clearInterval(state._tpInterval);
          state._tpTimerStarted = false;
          clearInterval(state.timer);
          endTyping();
        }
      }, 1000);
    }
  }
  function answerTyping() {
    const q = state._tpWords[state._tpQ];
    if (!q) return;
    const inp = el('tpi');
    const fb = el('tfb');
    const content = el('game-content-area');
    if (!inp || !fb) return;
    const ans = inp.value.trim();
    const correct = ans.toLowerCase() === q.word.toLowerCase();
    if (correct) { state._tpCorrect++; state.streak++; playSound('correct'); fb.innerHTML = '<i class="ti ti-check"></i>'; fb.style.color = '#10B981'; state.correct++; }
    else { state._tpWrong++; state.streak = 0; playSound('wrong'); fb.innerHTML = '<i class="ti ti-x"></i> ' + q.word; fb.style.color = '#DC2626'; state.wrong++; wrongWords.push({word:q.word,def:q.def||'',userAnswer:ans,correctAnswer:q.word}); }
    state._tpQ++; updateGamesUI();
    if (state._tpTimeLeft > 0) setTimeout(nextTyping, 300);
  }
  function endTyping() {
    const earned = state._tpCorrect * 2;
    state.xpEarned = earned;
    awardXP(earned);
    incrementGamesPlayed();
    if (state._tpCorrect >= 15 && typeof fireConfetti === 'function') setTimeout(() => fireConfetti(60), 300);
    const resEl = el('result-trophy');
    if (resEl) resEl.innerHTML = '<i class="ti ti-trophy" style="color:#FBBF24;font-size:inherit"></i>';
    const resTitle = el('result-title');
    if (resTitle) resTitle.textContent = state._tpCorrect >= 20 ? 'Typing Master!' : state._tpCorrect >= 10 ? 'Great Speed!' : 'Good Try!';
    const resSub = el('result-subtitle');
    if (resSub) resSub.textContent = state._tpCorrect + ' to\'g\'ri / ' + (state._tpCorrect + state._tpWrong) + ' jami \u00B7 ' + state._tpCorrect + ' XP';
    const xpAmt = el('result-xp-amount');
    if (xpAmt) xpAmt.textContent = '+' + earned + ' XP';
    const gs = getGamesStats();
    const xpTot = el('result-xp-total');
    if (xpTot) xpTot.textContent = 'Jami: ' + (gs.totalXP || 0);
    const rsc = el('rs-correct'); if (rsc) rsc.textContent = state._tpCorrect;
    const rsw = el('rs-wrong'); if (rsw) rsw.textContent = state._tpWrong;
    const rsa = el('rs-accuracy'); if (rsa) rsa.textContent = Math.round((state._tpCorrect / Math.max(1, state._tpCorrect + state._tpWrong)) * 100) + '%';
    renderWrongWordReview();
    playSound('complete');
    showArea('games-result-area');
    updateGamesUI();
  }

  // â”€â”€â”€â”€â”€ SENTENCE BUILDER â”€â”€â”€â”€â”€
  async function startSentence() {
    const qCount = Math.max(3, gameSettings.questionCount || 5);
    const words = await fetchWordsForGame(qCount + 2);
    if (guardGame('sentence')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    state._sbWords = words.slice(0, qCount);
    state._sbQ = 0;
    nextSentence();
  }
  function nextSentence() {
    if (state._sbQ >= state._sbWords.length) { endGame(4); return; }
    const q = state._sbWords[state._sbQ];
    const prog = el('game-progress-label');
    if (prog) prog.textContent = 'Q ' + (state._sbQ + 1) + '/' + state._sbWords.length;
    const sentence = q.example || q.word + ' is a ' + (q.pos || 'word') + '.';
    const words = sentence.split(/\s+/);
    const jumbled = shuffle([...words]);
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = '<div class="game-question-card stagger-1"><div class="game-question-label"><i class="ti ti-align-left"></i> Sentence Builder</div><div style="text-align:center;font-size:14px;color:var(--text2);margin-bottom:6px">So\'zlarni to\'g\'ri ketma-ketlikda joylang</div></div><div class="sb-words" id="sbwords">' + jumbled.map((w,i) => '<button class="sb-word-btn" data-i="'+i+'">'+w+'</button>').join('') + '</div><div class="sb-answer" id="sbans"></div><div style="display:flex;gap:10px;justify-content:center"><button class="game-submit-btn" id="sbcheck" style="background:#10B981">Check</button><button class="game-submit-btn" id="sbclear" style="background:var(--text3)">Clear</button></div><div class="game-feedback" id="sbfb"></div>';
    state._sbSelected = [];
    state._sbWordsPool = jumbled.map((w,i) => ({ word: w, idx: i, used: false }));
    document.querySelectorAll('.sb-word-btn').forEach(b => b.onclick = function() { selectSbWord(parseInt(this.dataset.i)); });
    const checkBtn = el('sbcheck');
    if (checkBtn) checkBtn.onclick = checkSentence;
    const clearBtn = el('sbclear');
    if (clearBtn) clearBtn.onclick = function() { state._sbSelected = []; state._sbWordsPool.forEach(p => p.used = false); updateSbUI(); };
    setTimer(30, () => { state.wrong++; state.streak=0; playSound('wrong'); const fb=el('sbfb'); if(fb){fb.innerHTML='\u23F1 Time! Answer: <strong>'+sentence+'</strong>';fb.style.color='#DC2626';} disableGameInputs(content); wrongWords.push({word:sentence,def:'',userAnswer:'(timeout)',correctAnswer:sentence}); state._sbQ++; updateGamesUI(); setTimeout(nextSentence,1500); });
  }
  function selectSbWord(idx) {
    const p = state._sbWordsPool.find(x => x.idx === idx);
    if (!p || p.used) return;
    p.used = true;
    state._sbSelected.push(p);
    updateSbUI();
  }
  function updateSbUI() {
    const ansEl = el('sbans');
    if (ansEl) ansEl.innerHTML = state._sbSelected.map((s,i) => '<span class="sb-ans-word" data-sbi="'+i+'">'+s.word+'</span>').join('');
    document.querySelectorAll('.sb-ans-word').forEach(sp => sp.onclick = function() { const i = parseInt(this.dataset.sbi); const p = state._sbSelected[i]; if (p) { p.used = false; state._sbSelected.splice(i,1); updateSbUI(); } });
    document.querySelectorAll('.sb-word-btn').forEach(b => { const idx = parseInt(b.dataset.i); const p = state._sbWordsPool.find(x => x.idx === idx); if (p && p.used) b.classList.add('used'); else b.classList.remove('used'); });
  }
  function checkSentence() {
    clearInterval(state.timer);
    const q = state._sbWords[state._sbQ];
    if (!q) return;
    const sentence = q.example || q.word + ' is a ' + (q.pos || 'word') + '.';
    const userSentence = state._sbSelected.map(s => s.word).join(' ');
    const correct = userSentence.toLowerCase() === sentence.toLowerCase();
    const fb = el('sbfb');
    const content = el('game-content-area');
    if (!fb || !content) return;
    disableGameInputs(content);
    if (correct) { state.correct++; state.streak++; playSound('correct'); fb.innerHTML = '<i class="ti ti-check"></i> To\'g\'ri!'; fb.style.color = '#10B981'; }
    else { state.wrong++; state.streak = 0; playSound('wrong'); fb.innerHTML = '<i class="ti ti-x"></i> <strong>' + sentence + '</strong>'; fb.style.color = '#DC2626'; wrongWords.push({word:sentence,def:'',userAnswer:userSentence,correctAnswer:sentence}); }
    state._sbQ++; updateGamesUI(); setTimeout(nextSentence, 1200);
  }

  // â”€â”€â”€â”€â”€ ANTONYM HUNT â”€â”€â”€â”€â”€
  async function startAntonym() {
    const qCount = Math.max(3, gameSettings.questionCount || 5);
    const words = await fetchWordsForGame(qCount + 4);
    if (guardGame('antonym')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    const pairs = [];
    for (const w of words) {
      const ants = await fetchAntonyms(w.word);
      if (ants && ants.length > 0) {
        pairs.push([w.word, ants[0]]);
      }
      if (pairs.length >= qCount) break;
    }
    if (pairs.length < 3) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Not enough antonym data from API. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    state._antPairs = pairs;
    state._antQ = 0;
    nextAntonym();
  }
  function nextAntonym() {
    if (state._antQ >= state._antPairs.length) { endGame(5); return; }
    const [qWord, aWord] = state._antPairs[state._antQ];
    const prog = el('game-progress-label');
    if (prog) prog.textContent = 'Q ' + (state._antQ + 1) + '/' + state._antPairs.length;
    const wrongOnes = state._antPairs.filter(([a,b]) => a !== qWord && b !== qWord).flatMap(x => x);
    const options = shuffle([aWord, ...shuffle(wrongOnes).slice(0, 3)]);
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = '<div class="game-question-card stagger-1"><div class="game-question-label"><i class="ti ti-arrows-left-right"></i> Antonym Hunt</div><div class="game-question-word">' + qWord + '</div><div style="text-align:center;font-size:13px;color:var(--text2);margin-bottom:4px">Qarama-qarshi ma\'noni toping</div></div><div class="game-options-grid stagger-2">' + options.map((o,i) => '<button class="game-option-btn" id="anto'+i+'"'+(o===aWord?' data-correct="true"':'')+'>'+o+'</button>').join('') + '</div><div class="game-feedback" id="antfb"></div>';
    options.forEach((o,i) => { const btn=el('anto'+i); if(btn) btn.onclick = () => answerAntonym(o === aWord, i, aWord, qWord); });
    setTimer(15, () => { state.wrong++; state.streak=0; playSound('wrong'); const fb=el('antfb'); if(fb){fb.innerHTML='\u23F1 Time! <strong>'+aWord+'</strong>';fb.style.color='#DC2626';} document.querySelectorAll('.game-option-btn').forEach(b=>b.disabled=true); wrongWords.push({word:qWord,def:aWord,userAnswer:'(timeout)',correctAnswer:aWord}); state._antQ++; updateGamesUI(); setTimeout(nextAntonym,1200); });
  }
  function answerAntonym(correct, idx, aWord, qWord) {
    clearInterval(state.timer);
    document.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
    const btn = el('anto' + idx);
    if (correct) { state.correct++; state.streak++; burstAtRect(btn); correctAnimation(btn); playSound('correct'); const fb=el('antfb'); if(fb){fb.innerHTML='<i class="ti ti-check"></i> To\'g\'ri!';fb.style.color='#10B981';} }
    else { state.wrong++; state.streak = 0; playSound('wrong'); wrongAnimation(btn); showCorrectAnswer(el('game-content-area'), aWord); wrongWords.push({word:qWord,def:aWord,userAnswer:btn?.textContent||'',correctAnswer:aWord}); const fb=el('antfb'); if(fb){fb.innerHTML='<i class="ti ti-x"></i> <strong>'+aWord+'</strong>';fb.style.color='#DC2626';} }
    state._antQ++; updateGamesUI(); setTimeout(nextAntonym, 900);
  }

  // â”€â”€â”€â”€â”€ WORD CATEGORIES â”€â”€â”€â”€â”€
  const posLabels = {noun:'Ot (Noun)',verb:'Fe\'l (Verb)',adj:'Sifat (Adj)',adv:'Ravish (Adv)'};
  async function startCategory() {
    const qCount = Math.max(3, gameSettings.questionCount || 5);
    const words = await fetchWordsForGame(qCount + 2);
    if (guardGame('category')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    const withPos = words.filter(w => w.pos);
    if (withPos.length < 3) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Not enough part-of-speech data. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    state._catWords = withPos.slice(0, qCount);
    state._catQ = 0;
    nextCategory();
  }
  function nextCategory() {
    if (state._catQ >= state._catWords.length) { endGame(4); return; }
    const q = state._catWords[state._catQ];
    const prog = el('game-progress-label');
    if (prog) prog.textContent = 'Q ' + (state._catQ + 1) + '/' + state._catWords.length;
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = '<div class="game-question-card stagger-1"><div class="game-question-label"><i class="ti ti-tags"></i> Word Categories</div><div class="cat-word-display">' + q.word + '</div><div style="text-align:center;font-size:13px;color:var(--text2);margin-bottom:4px">So\'z turkumini aniqlang</div></div><div class="cat-pos-grid stagger-2">' + Object.entries(posLabels).map(([k,v]) => '<button class="cat-pos-btn" data-pos="'+k+'">'+v+'</button>').join('') + '</div><div class="game-feedback" id="catfb"></div>';
    document.querySelectorAll('.cat-pos-btn').forEach(b => b.onclick = function() { answerCategory(this.dataset.pos, q.pos); });
    setTimer(15, () => { state.wrong++; state.streak=0; playSound('wrong'); const fb=el('catfb'); if(fb){fb.innerHTML='\u23F1 Time! <strong>'+(posLabels[q.pos]||q.pos)+'</strong>';fb.style.color='#DC2626';} document.querySelectorAll('.cat-pos-btn').forEach(b=>b.disabled=true); wrongWords.push({word:q.word,def:q.def||'',userAnswer:'(timeout)',correctAnswer:q.pos||''}); state._catQ++; updateGamesUI(); setTimeout(nextCategory,1200); });
  }
  function answerCategory(selected, correctPos) {
    clearInterval(state.timer);
    const q = state._catWords[state._catQ];
    if (!q) return;
    const correct = selected === correctPos;
    document.querySelectorAll('.cat-pos-btn').forEach(b => b.disabled = true);
    const fb = el('catfb');
    if (!fb) return;
    if (correct) { state.correct++; state.streak++; playSound('correct'); fb.innerHTML = '<i class="ti ti-check"></i> To\'g\'ri!'; fb.style.color = '#10B981'; }
    else { state.wrong++; state.streak = 0; playSound('wrong'); fb.innerHTML = '<i class="ti ti-x"></i> <strong>'+(posLabels[correctPos]||correctPos)+'</strong>'; fb.style.color = '#DC2626'; wrongWords.push({word:q.word,def:q.def||'',userAnswer:posLabels[selected]||selected,correctAnswer:posLabels[correctPos]||correctPos}); }
    state._catQ++; updateGamesUI(); setTimeout(nextCategory, 900);
  }

  // â”€â”€â”€â”€â”€ CROSSWORD â”€â”€â”€â”€â”€
  async function startCrossword() {
    const qCount = Math.max(3, gameSettings.questionCount || 5);
    const words = await fetchWordsForGame(qCount + 2);
    if (guardGame('crossword')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    const puzzles = words.slice(0, qCount).map(w => ({
      word: w.word.toUpperCase(),
      clue: w.def || 'Define this word'
    }));
    state._cwPuzzles = puzzles;
    state._cwQ = 0;
    nextCrossword();
  }
  function nextCrossword() {
    state._cwChecking = false;
    if (state._cwQ >= state._cwPuzzles.length) { endGame(6); return; }
    const puzzle = state._cwPuzzles[state._cwQ];
    const prog = el('game-progress-label');
    if (prog) prog.textContent = 'Puzzle ' + (state._cwQ + 1) + '/' + state._cwPuzzles.length;
    const content = el('game-content-area');
    if (!content) return;
    const letters = puzzle.word.split('');
    content.innerHTML = '<div class="game-question-card stagger-1"><div class="game-question-label"><i class="ti ti-grid-dots"></i> Crossword</div><div class="cw-clues"><strong>Clue:</strong> ' + puzzle.clue + '</div></div><div class="cw-grid">' + letters.map((_, i) => '<input class="cw-cell" id="cw0_'+i+'" maxlength="1" data-idx="'+i+'">').join('') + '</div><div style="display:flex;gap:10px;justify-content:center"><button class="game-submit-btn" id="cwcheck">Check</button></div><div class="game-feedback" id="cwfb"></div>';
    setTimeout(() => { const first = document.querySelector('.cw-cell'); if (first) first.focus(); }, 100);
    document.querySelectorAll('.cw-cell').forEach(c => c.onkeyup = function() { const idx=parseInt(this.dataset.idx); const next = document.querySelector('.cw-cell[data-idx="'+(idx+1)+'"]'); if (this.value.length>=1 && next) next.focus(); });
    const checkBtn = el('cwcheck');
    if (checkBtn) checkBtn.onclick = function() { checkCrossword(puzzle); };
    setTimer(60, () => { const fb=el('cwfb'); if(fb){fb.innerHTML='\u23F1 Time!';fb.style.color='#DC2626';} disableGameInputs(content); state.wrong++; wrongWords.push({word:puzzle.word,def:puzzle.clue,userAnswer:'(timeout)',correctAnswer:puzzle.word}); state._cwQ++; updateGamesUI(); setTimeout(nextCrossword,1200); });
  }
  function checkCrossword(puzzle) {
    if (state._cwChecking) return;
    state._cwChecking = true;
    clearInterval(state.timer);
    const checkBtn = el('cwcheck');
    if (checkBtn) checkBtn.disabled = true;
    const fb = el('cwfb');
    if (!fb) return;
    let allCorrect = true;
    const cells = document.querySelectorAll('.cw-cell');
    puzzle.word.split('').forEach((letter, i) => {
      const inp = cells[i];
      if (!inp) return;
      if (inp.value.toUpperCase() === letter) { inp.classList.add('filled'); inp.style.borderColor = '#10B981'; }
      else { allCorrect = false; inp.style.borderColor = '#EF4444'; }
    });
    if (allCorrect) {
      state.correct++; state.streak++; playSound('correct');
      fb.innerHTML = '<i class="ti ti-check"></i> To\'g\'ri!'; fb.style.color = '#10B981';
      state._cwQ++; updateGamesUI(); setTimeout(nextCrossword, 1000);
    } else {
      state.wrong++; state.streak = 0; playSound('wrong');
      fb.innerHTML = '<i class="ti ti-x"></i> Answer: <strong>' + puzzle.word + '</strong>'; fb.style.color = '#DC2626';
      wrongWords.push({word:puzzle.word,def:puzzle.clue,userAnswer:'(wrong)',correctAnswer:puzzle.word});
      state._cwQ++; updateGamesUI(); setTimeout(nextCrossword, 1500);
    }
  }
  // â”€â”€â”€â”€â”€ DEFINITION DUEL â”€â”€â”€â”€â”€
  async function startDuel() {
    const qCount = Math.max(3, gameSettings.questionCount || 5);
    const words = await fetchWordsForGame(qCount + 4);
    if (guardGame('duel')) return;
    hideGameSkeleton();
    if (!words || words.length < 3) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    state._duelWords = words.slice(0, qCount + 3);
    state._duelQ = 0; state._duelScore = 0; state._duelBotScore = 0;
    state._duelMax = Math.min(5, qCount);
    const prog = el('game-progress-label');
    if (prog) prog.textContent = 'Siz 0 / ' + state._duelMax + ' \u00B7 Bot 0';
    nextDuel();
  }
  function nextDuel() {
    if (state._duelQ >= state._duelWords.length || state._duelScore >= state._duelMax || state._duelBotScore >= state._duelMax) {
      const earned = state._duelScore * 3;
      state.xpEarned = earned;
      state.correct = state._duelScore; state.wrong = state._duelQ - state._duelScore;
      awardXP(earned);
      incrementGamesPlayed();
      const won = state._duelScore > state._duelBotScore;
      if (won && typeof fireConfetti === 'function') setTimeout(() => fireConfetti(60), 300);
      const resEl = el('result-trophy');
      if (resEl) resEl.innerHTML = won ? '<i class="ti ti-trophy" style="color:#FBBF24;font-size:inherit"></i>' : '<i class="ti ti-star" style="color:#FBBF24;font-size:inherit"></i>';
      const resTitle = el('result-title');
      if (resTitle) resTitle.textContent = won ? 'You Won the Duel!' : 'Bot Wins!';
      const resSub = el('result-subtitle');
      if (resSub) resSub.textContent = 'Siz ' + state._duelScore + ' \u00B7 Bot ' + state._duelBotScore;
      const xpAmt = el('result-xp-amount');
      if (xpAmt) xpAmt.textContent = '+' + earned + ' XP';
      const gs = getGamesStats();
      const xpTot = el('result-xp-total');
      if (xpTot) xpTot.textContent = 'Jami: ' + (gs.totalXP || 0);
      const rsc = el('rs-correct'); if (rsc) rsc.textContent = state._duelScore;
      const rsw = el('rs-wrong'); if (rsw) rsw.textContent = Math.max(0, state._duelQ - state._duelScore);
      const rsa = el('rs-accuracy'); if (rsa) rsa.textContent = state._duelQ > 0 ? Math.round((state._duelScore / state._duelQ) * 100) + '%' : '0%';
      renderWrongWordReview();
      playSound('complete');
      showArea('games-result-area');
      updateGamesUI();
      return;
    }
    const q = state._duelWords[state._duelQ];
    const prog = el('game-progress-label');
    if (prog) prog.textContent = 'Siz ' + state._duelScore + '/' + state._duelMax + ' \u00B7 Bot ' + state._duelBotScore;
    const wrongDefs = state._duelWords.filter(w => w.word !== q.word).map(w => w.def);
    const shuffled = shuffle([q.def, ...shuffle(wrongDefs).slice(0, 3)]);
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = '<div class="game-question-card stagger-1"><div class="game-question-label"><i class="ti ti-swords"></i> Definition Duel</div><div class="game-question-word">' + q.word + '</div><div style="text-align:center;font-size:13px;color:var(--text2);margin-bottom:4px">To\'g\'ri ta\'rifni tanlang!</div></div><div class="game-options-grid stagger-2">' + shuffled.map((o,i) => '<button class="game-option-btn" id="duo'+i+'"'+(o===q.def?' data-correct="true"':'')+'>'+o+'</button>').join('') + '</div><div class="game-feedback" id="dufb"></div><div class="duel-bot-thought" id="dubot">Bot o\'ylamoqda...</div>';
    shuffled.forEach((o,i) => { const btn=el('duo'+i); if(btn) btn.onclick = () => answerDuel(o === q.def, i, q.def, q); });
    setTimer(12, () => { duelTimeout(q); });
  }
  function duelTimeout(q) {
    state.wrong++; state.streak=0; playSound('wrong');
    const fb=el('dufb'); if(fb){fb.innerHTML='\u23F1 Time! Answer: <strong>'+q.def+'</strong>';fb.style.color='#DC2626';}
    document.querySelectorAll('.game-option-btn').forEach(b=>b.disabled=true);
    wrongWords.push({word:q.word,def:q.def||'',userAnswer:'(timeout)',correctAnswer:q.def});
    state._duelQ++; updateGamesUI(); setTimeout(nextDuel, 1200);
  }
  function answerDuel(correct, idx, correctDef, q) {
    clearInterval(state.timer);
    document.querySelectorAll('.game-option-btn').forEach(b => b.disabled = true);
    const btn = el('duo' + idx);
    const botEl = el('dubot');
    if (correct) {
      state._duelScore++; state.streak++;
      burstAtRect(btn); correctAnimation(btn); playSound('correct');
      const fb=el('dufb'); if(fb){fb.innerHTML='<i class="ti ti-check"></i> To\'g\'ri!';fb.style.color='#10B981';}
    } else {
      state.wrong++; state.streak = 0; playSound('wrong');
      wrongAnimation(btn); showCorrectAnswer(el('game-content-area'), correctDef);
      wrongWords.push({word:q.word,def:q.def||'',userAnswer:btn?.textContent||'',correctAnswer:correctDef});
      const fb=el('dufb'); if(fb){fb.innerHTML='<i class="ti ti-x"></i> <strong>'+correctDef+'</strong>';fb.style.color='#DC2626';}
    }
    if (botEl) {
      const botCorrect = Math.random() < 0.65;
      if (botCorrect) { state._duelBotScore++; botEl.textContent = 'Bot to\'g\'ri topdi!'; }
      else { botEl.textContent = 'Bot xato qildi!'; }
    }
    state._duelQ++; updateGamesUI(); setTimeout(nextDuel, 1200);
  }

  // â”€â”€â”€â”€â”€ SPEED MATCH â”€â”€â”€â”€â”€
  async function startSpeedmatch() {
    const words = await fetchWordsForGame(30);
    if (guardGame('speedmatch')) return;
    hideGameSkeleton();
    if (!words || words.length < 5) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    state._smWords = words;
    state._smScore = 0; state._smWrong = 0;
    state._smTimeLeft = 60;
    const prog = el('game-progress-label');
    if (prog) prog.textContent = state._smTimeLeft + 's';
    nextSpeedmatch();
    if (!state._smTimerStarted) {
      state._smTimerStarted = true;
      state._smInterval = setInterval(() => {
        state._smTimeLeft--;
        const prog = el('game-progress-label');
        if (prog) prog.textContent = state._smTimeLeft + 's \u00B7 ' + state._smScore + ' to\'g\'ri';
        if (state._smTimeLeft <= 0) {
          clearInterval(state._smInterval);
          state._smTimerStarted = false;
          clearInterval(state.timer);
          endSpeedmatch();
        }
      }, 1000);
    }
  }
  function nextSpeedmatch() {
    const words = state._smWords;
    const qWord = words[state._smScore % words.length];
    const matchChance = Math.random() < 0.5;
    const otherWord = words[Math.floor(Math.random() * words.length)];
    const displayDef = matchChance ? qWord.def : (otherWord && otherWord.word !== qWord.word ? otherWord.def : qWord.def);
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = '<div class="game-question-card stagger-1"><div class="game-question-label"><i class="ti ti-player-eject"></i> Speed Match</div><div class="sm-pair"><div class="sm-word">' + qWord.word + '</div><div class="sm-def">' + displayDef + '</div></div></div><div class="sm-btns"><button class="sm-btn match" id="smyes"><i class="ti ti-check"></i></button><button class="sm-btn nomatch" id="smno"><i class="ti ti-x"></i></button></div><div class="game-feedback" id="smfb"></div>';
    const yesBtn = el('smyes');
    const noBtn = el('smno');
    if (yesBtn) yesBtn.onclick = function() { answerSpeedmatch(matchChance); };
    if (noBtn) noBtn.onclick = function() { answerSpeedmatch(!matchChance); };
    if (state._smTimeLeft <= 0) return;
    setTimer(5, () => { if (state._smTimeLeft <= 0) return; state._smWrong++; state.streak=0; playSound('wrong'); const fb=el('smfb'); if(fb){fb.innerHTML='\u23F1';fb.style.color='#DC2626';} state.wrong++; updateGamesUI(); if (state._smTimeLeft>0) setTimeout(nextSpeedmatch,400); });
  }
  function answerSpeedmatch(isCorrect) {
    clearInterval(state.timer);
    if (state._smTimeLeft <= 0) return;
    const fb = el('smfb');
    if (!fb) return;
    if (isCorrect) { state._smScore++; state.streak++; playSound('correct'); fb.innerHTML = '<i class="ti ti-check"></i>'; fb.style.color = '#10B981'; state.correct++; }
    else { state._smWrong++; state.streak = 0; playSound('wrong'); fb.innerHTML = '<i class="ti ti-x"></i>'; fb.style.color = '#DC2626'; state.wrong++; }
    updateGamesUI();
    if (state._smTimeLeft > 0) setTimeout(nextSpeedmatch, 300);
  }
  function endSpeedmatch() {
    const earned = state._smScore * 1;
    state.xpEarned = earned;
    awardXP(earned);
    incrementGamesPlayed();
    if (state._smScore >= 20 && typeof fireConfetti === 'function') setTimeout(() => fireConfetti(60), 300);
    const resEl = el('result-trophy');
    if (resEl) resEl.innerHTML = '<i class="ti ti-trophy" style="color:#FBBF24;font-size:inherit"></i>';
    const resTitle = el('result-title');
    if (resTitle) resTitle.textContent = state._smScore >= 25 ? 'Speed Master!' : state._smScore >= 15 ? 'Fast Thinker!' : 'Good Reflexes!';
    const resSub = el('result-subtitle');
    if (resSub) resSub.textContent = state._smScore + ' to\'g\'ri \u00B7 ' + state._smWrong + ' xato \u00B7 ' + earned + ' XP';
    const xpAmt = el('result-xp-amount');
    if (xpAmt) xpAmt.textContent = '+' + earned + ' XP';
    const gs = getGamesStats();
    const xpTot = el('result-xp-total');
    if (xpTot) xpTot.textContent = 'Jami: ' + (gs.totalXP || 0);
    const rsc = el('rs-correct'); if (rsc) rsc.textContent = state._smScore;
    const rsw = el('rs-wrong'); if (rsw) rsw.textContent = state._smWrong;
    const rsa = el('rs-accuracy'); if (rsa) rsa.textContent = Math.round((state._smScore / Math.max(1, state._smScore + state._smWrong)) * 100) + '%';
    renderWrongWordReview();
    playSound('complete');
    showArea('games-result-area');
    updateGamesUI();
  }

  // â”€â”€â”€â”€â”€ WORD LADDER â”€â”€â”€â”€â”€
  async function startLadder() {
    const qCount = Math.max(3, gameSettings.questionCount || 5);
    const pool = [];
    if (typeof IELTS_WORDS !== 'undefined') {
      const shuffled = [...IELTS_WORDS].sort(() => Math.random() - 0.5);
      for (const w of shuffled) {
        const word = (w.w || '').toUpperCase().replace(/[^A-Z]/g, '');
        if (word.length >= 3 && word.length <= 8 && !pool.includes(word)) {
          pool.push(word);
          if (pool.length >= 80) break;
        }
      }
    }
    if (pool.length < 30) {
      const words = await fetchWordsForGame(qCount * 6);
      if (words) {
        for (const w of words) {
          const word = w.word.toUpperCase().replace(/[^A-Z]/g, '');
          if (word.length >= 3 && word.length <= 8 && !pool.includes(word) && /^[A-Z]+$/.test(word)) {
            pool.push(word);
          }
        }
      }
    }
    if (guardGame('ladder')) return;
    hideGameSkeleton();
    if (pool.length < 10) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Could not load enough words. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    const byLen = {};
    for (const word of pool) {
      const len = word.length;
      if (!byLen[len]) byLen[len] = [];
      byLen[len].push(word);
    }
    const ladders = [];
    for (const len of Object.keys(byLen)) {
      const grp = byLen[len];
      for (let i = 0; i < grp.length && ladders.length < qCount; i++) {
        for (let j = i + 1; j < grp.length && ladders.length < qCount; j++) {
          let diff = 0;
          for (let k = 0; k < len; k++) { if (grp[i][k] !== grp[j][k]) diff++; }
          if (diff === 1) ladders.push({ start: grp[i], end: grp[j], len: Number(len) });
        }
      }
    }
    if (ladders.length < 3) { el('game-content-area').innerHTML = '<div class="game-error" style="text-align:center;padding:40px;color:var(--text2)">Not enough ladder pairs found. Try again or choose a different game. <button onclick="Games.replay()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:8px 16px;margin-top:12px;cursor:pointer">Try Again</button></div>'; return; }
    state._ladLadders = shuffle(ladders).slice(0, qCount);
    state._ladQ = 0;
    nextLadder();
  }
  function nextLadder() {
    if (state._ladQ >= state._ladLadders.length) { endGame(4); return; }
    const l = state._ladLadders[state._ladQ];
    const prog = el('game-progress-label');
    if (prog) prog.textContent = 'Ladder ' + (state._ladQ + 1) + '/' + state._ladLadders.length;
    state._ladCurrent = l.start;
    state._ladSteps = 0;
    const content = el('game-content-area');
    if (!content) return;
    content.innerHTML = '<div class="game-question-card stagger-1"><div class="game-question-label"><i class="ti ti-stairs"></i> Word Ladder</div><div class="ladder-display"><span class="ladder-word start">' + l.start + '</span><span class="ladder-arrow"><i class="ti ti-arrow-right"></i></span><span class="ladder-word end">' + l.end + '</span></div><div style="text-align:center;font-size:13px;color:var(--text2);margin-bottom:8px">Har bir qadamda bitta harfni o\'zgartiring</div><div style="display:flex;gap:10px;max-width:340px;margin:0 auto;padding:0 4px"><input id="ladi" type="text" class="game-text-input" placeholder="Keyingi so\'z..." style="flex:1" autofocus><button class="game-submit-btn" id="ladans">Go</button></div><div class="ladder-display" id="ladtrail" style="min-height:32px;font-size:14px;color:var(--text2)"></div><div class="game-feedback" id="ladfb"></div><div style="font-size:12px;text-align:center;color:var(--text3)">Qadamlar: <span id="ladsteps">0</span></div>';
    const inp = el('ladi');
    if (inp) { inp.focus(); inp.onkeydown = function(e) { if (e.key === 'Enter') checkLadder(); }; }
    const sbtn = el('ladans');
    if (sbtn) sbtn.onclick = checkLadder;
    setTimer(45, () => { state.wrong++; state.streak=0; playSound('wrong'); const fb=el('ladfb'); if(fb){fb.innerHTML='\u23F1 Time! Answer: <strong>'+l.end+'</strong>';fb.style.color='#DC2626';} disableGameInputs(content); wrongWords.push({word:l.start+'->'+l.end,def:'Word ladder',userAnswer:'(timeout) x'+state._ladSteps,correctAnswer:l.end}); state._ladQ++; updateGamesUI(); setTimeout(nextLadder,1200); });
  }
  function checkLadder() {
    const l = state._ladLadders[state._ladQ];
    if (!l) return;
    const inp = el('ladi');
    if (!inp) return;
    const ans = inp.value.trim().toUpperCase();
    inp.value = '';
    if (ans === l.end) {
      clearInterval(state.timer);
      state.correct++; state.streak++; playSound('correct');
      const trail = el('ladtrail');
      if (trail) trail.innerHTML = trail.innerHTML + ' <span style="color:#10B981;font-weight:700">' + ans + '</span>';
      const fb = el('ladfb'); if (fb) { fb.innerHTML = '<i class="ti ti-check"></i> To\'g\'ri! (' + (state._ladSteps + 1) + ' qadam)'; fb.style.color = '#10B981'; }
      disableGameInputs(el('game-content-area'));
      state._ladQ++; updateGamesUI(); setTimeout(nextLadder, 1200);
      return;
    }
    if (ans.length !== l.start.length) {
      const fb = el('ladfb'); if (fb) { fb.innerHTML = 'Noto\'g\'ri uzunlik!'; fb.style.color = '#DC2626'; } return;
    }
    let diffCount = 0;
    for (let i = 0; i < ans.length; i++) { if (ans[i] !== state._ladCurrent[i]) diffCount++; }
    if (diffCount !== 1) {
      const fb = el('ladfb'); if (fb) { fb.innerHTML = 'Faqat 1 harfni o\'zgartiring!'; fb.style.color = '#DC2626'; } return;
    }
    state._ladCurrent = ans;
    state._ladSteps++;
    const stepsEl = el('ladsteps');
    if (stepsEl) stepsEl.textContent = state._ladSteps;
    const trail = el('ladtrail');
    if (trail) trail.innerHTML = trail.innerHTML + ' <span style="color:var(--accent2)">' + ans + '</span>';
    const fb = el('ladfb'); if (fb) { fb.innerHTML = 'OK \u2192 Next'; fb.style.color = '#10B981'; }
    inp.focus();
  }

  // â”€â”€â”€â”€â”€ SETTINGS UI â”€â”€â”€â”€â”€
  function showSettings() {
    const existing = document.querySelector('.games-settings-overlay');
    if (existing) { existing.remove(); document.querySelector('.games-settings-panel')?.remove(); return; }

    gameSettings = loadSettings();

    const overlay = document.createElement('div');
    overlay.className = 'games-settings-overlay';
    overlay.onclick = hideSettings;

    const panel = document.createElement('div');
    panel.className = 'games-settings-panel';

    panel.innerHTML = `
      <button class="games-settings-close" id="gs-close"><i class="ti ti-x"></i></button>
      <div class="games-settings-title"><i class="ti ti-settings"></i> O'yin Sozlamalari</div>
      <div class="gs-row">
        <div class="gs-label-wrap">
          <div class="gs-label">Savollar soni</div>
          <div class="gs-desc">Har bir o'yindagi savol miqdori (3-10)</div>
        </div>
        <select class="gs-select" id="gs-qcount">
          ${[3,4,5,6,8,10].map(n => '<option value="' + n + '"' + (gameSettings.questionCount === n ? ' selected' : '') + '>' + n + '</option>').join('')}
        </select>
      </div>
      <div class="gs-row">
        <div class="gs-label-wrap">
          <div class="gs-label">Vaqt limiti (soniya)</div>
          <div class="gs-desc">Har bir savol uchun vaqt</div>
        </div>
        <select class="gs-select" id="gs-tlimit">
          ${[5,8,10,15,20,30].map(n => '<option value="' + n + '"' + (gameSettings.timeLimit === n ? ' selected' : '') + '>' + n + 's</option>').join('')}
        </select>
      </div>
      <div class="gs-row">
        <div class="gs-label-wrap">
          <div class="gs-label">Qiyinlik</div>
          <div class="gs-desc">Avtomatik yoki qo'lda tanlash</div>
        </div>
        <select class="gs-select" id="gs-diff">
          ${[{v:'auto',l:'Avtomatik'},{v:'easy',l:'Oson'},{v:'medium',l:'O\'rta'},{v:'hard',l:'Qiyin'},{v:'expert',l:'Ekspert'}].map(o => '<option value="' + o.v + '"' + (gameSettings.difficulty === o.v ? ' selected' : '') + '>' + o.l + '</option>').join('')}
        </select>
      </div>
      <div class="gs-row">
        <div class="gs-label-wrap">
          <div class="gs-label">Tovush effektlari</div>
          <div class="gs-desc">To'g'ri/noto'g'ri ovozlari</div>
        </div>
        <button class="gs-toggle' + (gameSettings.soundEnabled ? ' active' : '') + '" id="gs-sound" data-key="soundEnabled"></button>
      </div>
      <div class="gs-row">
        <div class="gs-label-wrap">
          <div class="gs-label">Endless Mode</div>
          <div class="gs-desc">Xato qilguningizcha davom eting</div>
        </div>
        <button class="gs-toggle' + (gameSettings.endlessMode ? ' active' : '') + '" id="gs-endless" data-key="endlessMode"></button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    el('gs-close').onclick = hideSettings;

    document.querySelectorAll('.gs-toggle').forEach(btn => {
      btn.onclick = () => {
        const key = btn.getAttribute('data-key');
        btn.classList.toggle('active');
        gameSettings[key] = !gameSettings[key];
        if (key === 'soundEnabled') {
          if (gameSettings.soundEnabled) initAudio();
          playSound('click');
        }
        saveSettings(gameSettings);
      };
    });

    ['gs-qcount','gs-tlimit','gs-diff'].forEach(id => {
      const sel = el(id);
      if (sel) sel.onchange = () => {
        const key = id === 'gs-qcount' ? 'questionCount' : id === 'gs-tlimit' ? 'timeLimit' : 'difficulty';
        const val = id === 'gs-diff' ? sel.value : parseInt(sel.value);
        gameSettings[key] = val;
        saveSettings(gameSettings);
        playSound('click');
      };
    });
  }

  function hideSettings() {
    document.querySelector('.games-settings-overlay')?.remove();
    document.querySelector('.games-settings-panel')?.remove();
  }

  // â”€â”€â”€â”€â”€ DAILY CARD UI UPDATE â”€â”€â”€â”€â”€
  function updateDailyCardUI() {
    const card = document.querySelector('.game-card[data-game="daily"]');
    if (!card) {
      const menu = el('games-menu');
      if (!menu || menu.querySelector('.game-card[data-game="daily"]')) return;
      const dailyCard = document.createElement('div');
      dailyCard.className = 'game-card';
      dailyCard.setAttribute('data-game', 'daily');
      dailyCard.setAttribute('onclick', isDailyCompleted() ? '' : "Games.start('daily')");
      dailyCard.style.cursor = isDailyCompleted() ? 'default' : 'pointer';
      dailyCard.innerHTML = `
        <div class="game-card-icon" data-game="daily"><i class="ti ti-calendar-star"></i></div>
        <div class="game-card-body">
          <div class="game-card-title">Daily Challenge <span class="daily-badge">NEW</span></div>
          <div class="game-card-desc">Kunlik viktorina, bonus XP yig'!</div>
          <div class="game-card-meta">
            <span class="xp-badge">+80 XP</span>
            <span class="diff-badge diff-hard">Kunlik</span>
            <span class="time-badge"><i class="ti ti-clock"></i> 12s</span>
          </div>
        </div>
        <div class="game-card-arrow"><i class="ti ti-chevron-right"></i></div>
        ${isDailyCompleted() ? '<div class="daily-done-overlay"><i class="ti ti-check"></i> Done</div>' : ''}
      `;
      menu.insertBefore(dailyCard, menu.firstChild);
    } else {
      const overlay = card.querySelector('.daily-done-overlay');
      if (isDailyCompleted()) {
        if (!overlay) {
          const d = document.createElement('div');
          d.className = 'daily-done-overlay';
          d.innerHTML = '<i class="ti ti-check"></i> Done';
          card.appendChild(d);
        }
        card.onclick = null;
        card.style.cursor = 'default';
        card.style.opacity = '0.7';
      } else {
        if (overlay) overlay.remove();
        card.onclick = () => Games.start('daily');
        card.style.cursor = 'pointer';
        card.style.opacity = '1';
      }
    }
  }

  // â”€â”€â”€â”€â”€ SETTINGS BUTTON INIT â”€â”€â”€â”€â”€
  setTimeout(() => {
    const sBtn = el('games-settings-btn');
    if (sBtn) sBtn.onclick = showSettings;
    updateDailyCardUI();
  }, 100);

  return { start, backToMenu, replay, updateGamesUI, showSettings, usePowerup, _test: true };
})();

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => Games.updateGamesUI());
}
