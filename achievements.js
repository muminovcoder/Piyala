// =============================================
// Piyala — Achievements Module
// =============================================

const ACHIEVEMENT_CATS = {
  words: { label: 'Words', icon: '<i class="ti ti-books"></i>', color: '#6366f1' },
  streak: { label: 'Streaks', icon: '<i class="ti ti-flame"></i>', color: '#f59e0b' },
  quiz: { label: 'Quizzes', icon: '<i class="ti ti-percentage"></i>', color: '#10b981' },
  games: { label: 'Games', icon: '<i class="ti ti-device-gamepad"></i>', color: '#22D3EE' },
  level: { label: 'Levels', icon: '<i class="ti ti-star"></i>', color: '#7C6FFF' },
  special: { label: 'Special', icon: '<i class="ti ti-sparkles"></i>', color: '#ec4899' }
};

const ACHIEVEMENT_BENEFITS = {
  first_word: { how:'Learn any single word from the library or daily word', benefit:'Unlocks the Words category and starts your learning journey', reward:'Beginner status' },
  ten_words: { how:'Continue learning until you know 10 words', benefit:'Builds your foundational vocabulary', reward:'Bookworm title' },
  fifty_words: { how:'Study and memorize 50 different words', benefit:'Solid basic vocabulary for everyday conversations', reward:'Scholar title + bragging rights' },
  hundred_words: { how:'Reach 100 words learned', benefit:'Strong vocabulary foundation for basic fluency', reward:'Centurion badge' },
  five_hundred_words: { how:'Learn 500 unique words through daily study', benefit:'Intermediate vocabulary for confident communication', reward:'Word King title + 300 XP' },
  thousand_words: { how:'Persist until you master 1000 words', benefit:'Advanced vocabulary for academic and professional use', reward:'Lexicon Master title + 500 XP' },
  two_thousand_words: { how:'Double down and learn 2000 words', benefit:'Near-native vocabulary range, read articles with ease', reward:'Dictionary title + 800 XP' },
  five_thousand_words: { how:'Become a walking thesaurus with 5000 words', benefit:'Master-level vocabulary, understand any text', reward:'Thesaurus Rex title + 1500 XP' },
  streak_3: { how:'Study for 3 days in a row without missing a day', benefit:'Builds the habit of daily learning', reward:'On Fire badge + 30 XP' },
  streak_7: { how:'Maintain a 7-day study streak', benefit:'Consistency leads to long-term retention', reward:'Week Warrior title + 75 XP' },
  streak_14: { how:'Stay consistent for 14 days straight', benefit:'Two weeks of daily practice locks in the habit', reward:'Fortnight Force title + 150 XP' },
  streak_30: { how:'Study every day for a full month', benefit:'A month of daily vocabulary growth = massive progress', reward:'Monthly Legend title + 300 XP' },
  streak_100: { how:'Never break your streak for 100 days', benefit:'Elite consistency, vocabulary becomes second nature', reward:'Century Streak title + 1000 XP' },
  streak_365: { how:'Study daily for an entire year', benefit:'A full year of vocabulary mastery, you are unstoppable', reward:'Year Lord title + 5000 XP' },
  perfect_quiz: { how:'Answer every question correctly in a single quiz', benefit:'Demonstrates complete mastery of the quiz material', reward:'Perfect Score badge + 100 XP' },
  fifty_quiz: { how:'Answer 50 quiz questions total', benefit:'Regular quizzing reinforces your memory', reward:'Quiz Taker title + 50 XP' },
  twohundred_quiz: { how:'Answer 200 quiz questions', benefit:'Deepens understanding through repeated testing', reward:'Quiz Master title + 150 XP' },
  thousand_quiz: { how:'Answer 1000 quiz questions', benefit:'Extensive testing ensures near-perfect recall', reward:'Accuracy Ace title + 400 XP' },
  five_thousand_quiz: { how:'Answer 5000 quiz questions', benefit:'Quiz legend status — you\'ve been tested extensively', reward:'Quiz Legend title + 1500 XP' },
  perfect_accuracy: { how:'Answer 100+ questions with zero mistakes', benefit:'Demonstrates flawless understanding and attention', reward:'Flawless Mind title + 2000 XP' },
  first_game: { how:'Play any mini-game in the Games section', benefit:'Games make learning fun and interactive', reward:'Gamer badge + 25 XP' },
  ten_games: { how:'Play 10 different games', benefit:'Exposure to vocabulary in multiple contexts', reward:'Arcade Master title + 75 XP' },
  fifty_games: { how:'Play 50 games total', benefit:'Gamified learning boosts engagement and retention', reward:'Game Champion title + 200 XP' },
  hundred_games: { how:'Play 100 games', benefit:'Master of gamified vocabulary learning', reward:'Hall of Famer title + 500 XP' },
  twofifty_games: { how:'Play 250 games', benefit:'Ultimate game master — vocabulary through play', reward:'Game Overlord title + 1500 XP' },
  level_3: { how:'Earn enough XP to reach Level 3', benefit:'Shows you are committed to learning', reward:'Getting Started badge + 50 XP' },
  level_5: { how:'Keep earning XP to reach Level 5', benefit:'Mid-level learner status unlocked', reward:'Rising Star title + 100 XP' },
  level_8: { how:'Progress to Level 8 through consistent study', benefit:'Advanced learner with solid XP bank', reward:'Dedicated Learner title + 250 XP' },
  level_10: { how:'Push to Level 10', benefit:'Double-digit level shows serious dedication', reward:'Legend title + 500 XP' },
  level_15: { how:'Reach Level 15 through relentless learning', benefit:'Top-tier learner approaching mastery', reward:'Enlightened title + 1500 XP' },
  level_20: { how:'Ascend to Level 20', benefit:'Elite status among vocabulary learners', reward:'Transcendent title + 3000 XP' },
  level_25: { how:'Achieve Level 25 through consistent study', benefit:'You have reached advanced vocabulary mastery', reward:'Omniscient title + 5000 XP' },
  level_30: { how:'Push through to Level 30', benefit:'Elite learner status with deep vocabulary knowledge', reward:'Dedicated Master title + 2000 XP' },
  level_50: { how:'Persist through 50 levels of learning', benefit:'Near-native vocabulary with confident communication', reward:'Vocabulary Sage title + 5000 XP' },
  level_70: { how:'Reach the prestigious Level 70', benefit:'Master-level command of the language', reward:'Language Emperor title + 10000 XP' },
  level_90: { how:'Ascend to Level 90 through relentless study', benefit:'Cosmic-level vocabulary prowess', reward:'Cosmic Master title + 20000 XP' },
  level_100: { how:'Achieve the ultimate Level 100', benefit:'Absolute mastery of vocabulary — you are a true legend', reward:'Absolute Legend title + 50000 XP' },
  flashcard_100: { how:'Review 100 flashcards', benefit:'Flashcards strengthen active recall', reward:'Card Shark badge + 75 XP' },
  flashcard_500: { how:'Review 500 flashcards', benefit:'Massive flashcard review = permanent retention', reward:'Card Master title + 200 XP' },
  flashcard_2000: { how:'Review 2000 flashcards', benefit:'Flashcard expert, vocabulary deeply embedded', reward:'Card Legend title + 800 XP' },
  flashcard_5000: { how:'Review 5000 flashcards', benefit:'Unmatched flashcard discipline', reward:'Deck Master title + 2000 XP' },
  study_100min: { how:'Study for a total of 100 minutes', benefit:'First major time investment in your vocabulary', reward:'Dedicated badge + 50 XP' },
  study_500min: { how:'Study for 500 minutes total', benefit:'Over 8 hours of focused vocabulary learning', reward:'Marathoner title + 200 XP' },
  study_2000min: { how:'Study for 2000 minutes total', benefit:'Over 33 hours — serious dedication to mastery', reward:'Iron Will title + 1000 XP' },
  study_5000min: { how:'Study for 5000 minutes total', benefit:'Over 83 hours of vocabulary learning', reward:'Time Lord title + 3000 XP' },
  all_rounder: { how:'Unlock achievements in at least 4 different categories', benefit:'Shows well-rounded vocabulary skills across all areas', reward:'All-Rounder title + 500 XP' },
  completionist: { how:'Unlock 30 different achievements', benefit:'True achievement hunter, dedicated to mastery', reward:'Completionist title + 3000 XP' },
  perfectionist: { how:'Unlock every single achievement in the game', benefit:'You have conquered everything Piyala offers', reward:'Perfectionist title + 10000 XP — ultimate bragging rights' },
};

const ACHIEVEMENTS = [
  // Words
  { id:'first_word', cat:'words', icon:'<i class="ti ti-seedling"></i>', name:'First Steps', desc:'Learn your first word', xp:25, rarity:'common', condition:() => state.stats.wordsLearned >= 1 },
  { id:'ten_words', cat:'words', icon:'<i class="ti ti-books"></i>', name:'Bookworm', desc:'Learn 10 words', xp:50, rarity:'common', condition:() => state.stats.wordsLearned >= 10 },
  { id:'fifty_words', cat:'words', icon:'<i class="ti ti-academic-cap"></i>', name:'Scholar', desc:'Learn 50 words', xp:100, rarity:'uncommon', condition:() => state.stats.wordsLearned >= 50 },
  { id:'hundred_words', cat:'words', icon:'<i class="ti ti-trophy"></i>', name:'Centurion', desc:'Learn 100 words', xp:150, rarity:'rare', condition:() => state.stats.wordsLearned >= 100 },
  { id:'five_hundred_words', cat:'words', icon:'<i class="ti ti-crown"></i>', name:'Word King', desc:'Learn 500 words', xp:300, rarity:'epic', condition:() => state.stats.wordsLearned >= 500 },
  { id:'thousand_words', cat:'words', icon:'<i class="ti ti-diamond"></i>', name:'Lexicon Master', desc:'Learn 1000 words', xp:500, rarity:'legendary', condition:() => state.stats.wordsLearned >= 1000 },
  { id:'two_thousand_words', cat:'words', icon:'<i class="ti ti-building-columns"></i>', name:'Dictionary', desc:'Learn 2000 words', xp:800, rarity:'legendary', condition:() => state.stats.wordsLearned >= 2000 },
  { id:'five_thousand_words', cat:'words', icon:'<i class="ti ti-mood-announce"></i>', name:'Thesaurus Rex', desc:'Learn 5000 words', xp:1500, rarity:'legendary', condition:() => state.stats.wordsLearned >= 5000 },

  // Streaks
  { id:'streak_3', cat:'streak', icon:'<i class="ti ti-flame"></i>', name:'On Fire', desc:'3-day streak', xp:30, rarity:'common', condition:() => state.stats.streak >= 3 },
  { id:'streak_7', cat:'streak', icon:'<i class="ti ti-bolt"></i>', name:'Week Warrior', desc:'7-day streak', xp:75, rarity:'uncommon', condition:() => state.stats.streak >= 7 },
  { id:'streak_14', cat:'streak', icon:'<i class="ti ti-armchair"></i>', name:'Fortnight Force', desc:'14-day streak', xp:150, rarity:'rare', condition:() => state.stats.streak >= 14 },
  { id:'streak_30', cat:'streak', icon:'<i class="ti ti-star"></i>', name:'Monthly Legend', desc:'30-day streak', xp:300, rarity:'epic', condition:() => state.stats.streak >= 30 },
  { id:'streak_100', cat:'streak', icon:'<i class="ti ti-medal"></i>', name:'Century Streak', desc:'100-day streak', xp:1000, rarity:'legendary', condition:() => state.stats.streak >= 100 },
  { id:'streak_365', cat:'streak', icon:'<i class="ti ti-crown"></i>', name:'Year Lord', desc:'365-day streak', xp:5000, rarity:'legendary', condition:() => state.stats.streak >= 365 },

  // Quizzes & Accuracy
  { id:'perfect_quiz', cat:'quiz', icon:'<i class="ti ti-percentage"></i>', name:'Perfect Score', desc:'Get 100% on a quiz', xp:100, rarity:'uncommon', condition:() => state.stats.totalQuestions > 0 && state.stats.correctAnswers >= state.stats.totalQuestions },
  { id:'fifty_quiz', cat:'quiz', icon:'<i class="ti ti-edit"></i>', name:'Quiz Taker', desc:'Answer 50 questions', xp:50, rarity:'common', condition:() => state.stats.totalQuestions >= 50 },
  { id:'twohundred_quiz', cat:'quiz', icon:'<i class="ti ti-brain"></i>', name:'Quiz Master', desc:'Answer 200 questions', xp:150, rarity:'rare', condition:() => state.stats.totalQuestions >= 200 },
  { id:'thousand_quiz', cat:'quiz', icon:'<i class="ti ti-target"></i>', name:'Accuracy Ace', desc:'Answer 1000 questions', xp:400, rarity:'epic', condition:() => state.stats.totalQuestions >= 1000 },
  { id:'five_thousand_quiz', cat:'quiz', icon:'<i class="ti ti-medal"></i>', name:'Quiz Legend', desc:'Answer 5000 questions', xp:1500, rarity:'legendary', condition:() => state.stats.totalQuestions >= 5000 },
  { id:'perfect_accuracy', cat:'quiz', icon:'<i class="ti ti-target"></i>', name:'Flawless Mind', desc:'100% accuracy over 100+ questions', xp:2000, rarity:'epic', condition:() => state.stats.totalQuestions >= 100 && state.stats.correctAnswers === state.stats.totalQuestions },

  // Games
  { id:'first_game', cat:'games', icon:'<i class="ti ti-device-gamepad"></i>', name:'Gamer', desc:'Play your first game', xp:25, rarity:'common', condition:() => state.stats.gamesPlayed >= 1 },
  { id:'ten_games', cat:'games', icon:'<i class="ti ti-device-gamepad-2"></i>', name:'Arcade Master', desc:'Play 10 games', xp:75, rarity:'uncommon', condition:() => state.stats.gamesPlayed >= 10 },
  { id:'fifty_games', cat:'games', icon:'<i class="ti ti-ticket"></i>', name:'Game Champion', desc:'Play 50 games', xp:200, rarity:'rare', condition:() => state.stats.gamesPlayed >= 50 },
  { id:'hundred_games', cat:'games', icon:'<i class="ti ti-trophy"></i>', name:'Hall of Famer', desc:'Play 100 games', xp:500, rarity:'epic', condition:() => state.stats.gamesPlayed >= 100 },
  { id:'twofifty_games', cat:'games', icon:'<i class="ti ti-diamond"></i>', name:'Game Overlord', desc:'Play 250 games', xp:1500, rarity:'legendary', condition:() => state.stats.gamesPlayed >= 250 },

  // Levels
  { id:'level_3', cat:'level', icon:'<i class="ti ti-star"></i>', name:'Getting Started', desc:'Reach Level 3', xp:50, rarity:'common', condition:() => state.stats.level >= 3 },
  { id:'level_5', cat:'level', icon:'<i class="ti ti-star"></i>', name:'Rising Star', desc:'Reach Level 5', xp:100, rarity:'uncommon', condition:() => state.stats.level >= 5 },
  { id:'level_8', cat:'level', icon:'<i class="ti ti-medal"></i>', name:'Dedicated Learner', desc:'Reach Level 8', xp:250, rarity:'rare', condition:() => state.stats.level >= 8 },
  { id:'level_10', cat:'level', icon:'<i class="ti ti-star"></i>', name:'Legend', desc:'Reach Level 10', xp:500, rarity:'epic', condition:() => state.stats.level >= 10 },
  { id:'level_15', cat:'level', icon:'<i class="ti ti-star"></i>', name:'Enlightened', desc:'Reach Level 15', xp:1500, rarity:'legendary', condition:() => state.stats.level >= 15 },
  { id:'level_20', cat:'level', icon:'<i class="ti ti-bolt"></i>', name:'Transcendent', desc:'Reach Level 20', xp:3000, rarity:'legendary', condition:() => state.stats.level >= 20 },
  { id:'level_25', cat:'level', icon:'<i class="ti ti-galaxy"></i>', name:'Omniscient', desc:'Reach Level 25', xp:5000, rarity:'legendary', condition:() => state.stats.level >= 25 },
  { id:'level_30', cat:'level', icon:'<i class="ti ti-flame"></i>', name:'Dedicated Master', desc:'Reach Level 30', xp:2000, rarity:'legendary', condition:() => state.stats.level >= 30 },
  { id:'level_50', cat:'level', icon:'<i class="ti ti-diamond"></i>', name:'Vocabulary Sage', desc:'Reach Level 50', xp:5000, rarity:'legendary', condition:() => state.stats.level >= 50 },
  { id:'level_70', cat:'level', icon:'<i class="ti ti-crown"></i>', name:'Language Emperor', desc:'Reach Level 70', xp:10000, rarity:'legendary', condition:() => state.stats.level >= 70 },
  { id:'level_90', cat:'level', icon:'<i class="ti ti-galaxy"></i>', name:'Cosmic Master', desc:'Reach Level 90', xp:20000, rarity:'legendary', condition:() => state.stats.level >= 90 },
  { id:'level_100', cat:'level', icon:'<i class="ti ti-bolt"></i>', name:'Absolute Legend', desc:'Reach Level 100', xp:50000, rarity:'legendary', condition:() => state.stats.level >= 100 },

  // Special
  { id:'flashcard_100', cat:'special', icon:'<i class="ti ti-cards"></i>', name:'Card Shark', desc:'Review 100 flashcards', xp:75, rarity:'common', condition:() => state.stats.cardsReviewed >= 100 },
  { id:'flashcard_500', cat:'special', icon:'<i class="ti ti-cards"></i>', name:'Card Master', desc:'Review 500 flashcards', xp:200, rarity:'uncommon', condition:() => state.stats.cardsReviewed >= 500 },
  { id:'flashcard_2000', cat:'special', icon:'<i class="ti ti-cards"></i>', name:'Card Legend', desc:'Review 2000 flashcards', xp:800, rarity:'rare', condition:() => state.stats.cardsReviewed >= 2000 },
  { id:'flashcard_5000', cat:'special', icon:'<i class="ti ti-cards"></i>', name:'Deck Master', desc:'Review 5000 flashcards', xp:2000, rarity:'epic', condition:() => state.stats.cardsReviewed >= 5000 },
  { id:'study_100min', cat:'special', icon:'<i class="ti ti-clock"></i>', name:'Dedicated', desc:'Study 100 minutes total', xp:50, rarity:'common', condition:() => state.stats.studyMinutes >= 100 },
  { id:'study_500min', cat:'special', icon:'<i class="ti ti-hourglass"></i>', name:'Marathoner', desc:'Study 500 minutes total', xp:200, rarity:'uncommon', condition:() => state.stats.studyMinutes >= 500 },
  { id:'study_2000min', cat:'special', icon:'<i class="ti ti-medal"></i>', name:'Iron Will', desc:'Study 2000 minutes total', xp:1000, rarity:'rare', condition:() => state.stats.studyMinutes >= 2000 },
  { id:'study_5000min', cat:'special', icon:'<i class="ti ti-diamond"></i>', name:'Time Lord', desc:'Study 5000 minutes total', xp:3000, rarity:'epic', condition:() => state.stats.studyMinutes >= 5000 },
  { id:'all_rounder', cat:'special', icon:'<i class="ti ti-diamond"></i>', name:'All-Rounder', desc:'Unlock achievements in 4+ categories', xp:500, rarity:'epic', condition:() => {
    const cats = new Set();
    (state.stats.achievements || []).forEach(id => {
      const a = ACHIEVEMENTS.find(x => x.id === id);
      if (a) cats.add(a.cat);
    });
    return cats.size >= 4;
  }},
  // Harder Challenges
  { id:'completionist', cat:'special', icon:'<i class="ti ti-star"></i>', name:'Completionist', desc:'Unlock 30 achievements', xp:3000, rarity:'legendary', condition:() => (state.stats.achievements || []).length >= 30 },
  { id:'perfectionist', cat:'special', icon:'<i class="ti ti-crown"></i>', name:'Perfectionist', desc:'Unlock every other achievement', xp:10000, rarity:'legendary', condition:() => (state.stats.achievements || []).length >= ACHIEVEMENTS.length - 1 },
];

function checkAchievements() {
  let newUnlock = false;
  ACHIEVEMENTS.forEach(ach => {
    if (!state.stats.achievements.includes(ach.id) && ach.condition()) {
      state.stats.achievements.push(ach.id);
      state.stats.totalXP += ach.xp || 0;
      state.stats.level = getLevel(state.stats.totalXP);
      localStorage.setItem('vm_level_backup', state.stats.level);
      localStorage.setItem('vm_xp_backup', state.stats.totalXP);
      if (!state.stats.achUnlocked) state.stats.achUnlocked = {};
      state.stats.achUnlocked[ach.id] = new Date().toISOString();
      newUnlock = true;
      saveStats();
      updateSidebarXP();
      const rarityLabel = ach.rarity ? ` [${ach.rarity.toUpperCase()}]` : '';
      toast(`${ach.icon} ${ach.name}${rarityLabel} — ${ach.desc} (+${ach.xp || 0} XP)`, 'achievement', 5000);
      confetti();
    }
  });
  if (newUnlock && typeof renderAchievements === 'function' && document.getElementById('achievement-grid')) {
    renderAchievements();
  }
}

const ACH_RARITY_COLORS = { common:'#94a3b8', uncommon:'#10b981', rare:'#3b82f6', epic:'#8b5cf6', legendary:'#f59e0b' };
const ACH_RARITY_ORDER = ['common','uncommon','rare','epic','legendary'];
let achFilter = 'all';
let achSearch = '';

function renderAchievements() {
  const s = state.stats;

  const unlocked = s.achievements || [];
  const total = ACHIEVEMENTS.length;
  const unlockedCount = unlocked.length;
  const pct = Math.round((unlockedCount / total) * 100);
  const totalXp = ACHIEVEMENTS.filter(a => unlocked.includes(a.id)).reduce((sum, a) => sum + (a.xp || 0), 0);

  const byRarity = ACH_RARITY_ORDER.map(r => {
    const group = ACHIEVEMENTS.filter(a => a.rarity === r);
    const done = group.filter(a => unlocked.includes(a.id)).length;
    return { rarity: r, total: group.length, done, label: r ? r.charAt(0).toUpperCase() + r.slice(1) : '' };
  });

  const cats = Object.entries(ACHIEVEMENT_CATS);

  document.getElementById('ach-summary').innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:24px;align-items:center">
      <div style="flex:1;min-width:140px">
        <div style="font-size:28px;font-weight:700;color:var(--ios-label)">${unlockedCount}<span style="font-size:16px;color:var(--ios-muted);font-weight:400"> / ${total}</span></div>
        <div style="font-size:13px;color:var(--ios-secondary-label)">Achievements Unlocked</div>
      </div>
      <div style="flex:2;min-width:200px">
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:8px">
          ${byRarity.map(r => `
            <span style="font-size:11px;color:var(--ios-muted);display:inline-flex;align-items:center;gap:4px">
              <span style="width:8px;height:8px;border-radius:50%;display:inline-block;background:${ACH_RARITY_COLORS[r.rarity]}"></span>
              ${r.label}: ${r.done}/${r.total}
            </span>
          `).join('')}
        </div>
        <div class="ach-progress-wrap">
          <div class="ach-progress-bar">
            <div class="ach-progress-fill" id="ach-progress-fill" style="width:0%" data-target="${pct}"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('ach-filters').innerHTML = `
    <button class="ach-filter-btn ${achFilter==='all'?'active':''}" data-cat="all" onclick="achFilter='all';filterAchievements()"><i class="ti ti-list"></i> All (${total})</button>
    ${cats.map(([key, c]) => {
      const count = ACHIEVEMENTS.filter(a => a.cat === key).length;
      return `<button class="ach-filter-btn ${achFilter===key?'active':''}" data-cat="${key}" onclick="achFilter='${key}';filterAchievements()">${c.icon} ${c.label} (${count})</button>`;
    }).join('')}
    <input type="text" class="ach-search-input" placeholder="Search achievements..." value="${achSearch}" oninput="achSearch=String(this.value).toLowerCase();renderAchievementGrid()">
  `;

  renderAchievementGrid();
  renderGrammarAchSummary();
  animateProgressBars();
}

function renderGrammarAchSummary() {
  const g = state.grammar;
  if (!g || !g.achievements) return;
  const unlocked = new Set(g.achievements);
  const total = typeof GRAMMAR_ACHIEVEMENTS !== 'undefined' ? GRAMMAR_ACHIEVEMENTS.length : 0;
  if (!total) return;
  const unlockedCount = unlocked.size;
  const pct = Math.round(unlockedCount / total * 100);
  const rarities = ['common','uncommon','rare','epic','legendary'];
  const rarityColors = typeof GRAMMAR_RARITY !== 'undefined' ? GRAMMAR_RARITY : ACH_RARITY_COLORS;
  const byRarity = rarities.map(r => {
    const group = typeof GRAMMAR_ACHIEVEMENTS !== 'undefined' ? GRAMMAR_ACHIEVEMENTS.filter(a => a.rarity === r) : [];
    const done = group.filter(a => unlocked.has(a.id)).length;
    return { rarity: r, total: group.length, done, label: r.charAt(0).toUpperCase() + r.slice(1) };
  });

  document.getElementById('grammar-ach-summary').innerHTML = `
    <div style="background:var(--ios-card);border:1px solid var(--ios-separator);border-radius:var(--radius-ios-lg);padding:16px;margin-bottom:8px">
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">
        <div style="font-size:15px;font-weight:700;color:var(--ios-label);display:flex;align-items:center;gap:8px">
          <i class="ti ti-book" style="font-size:18px;color:#5856D6;"></i> Grammar Achievements
          <span style="font-size:13px;font-weight:400;color:var(--ios-muted)">${unlockedCount}/${total}</span>
        </div>
        <button class="ios-btn" onclick="routerNavigate('/grammar');setTimeout(()=>switchGrammarTab('achievements'),100)" style="font-size:12px;padding:6px 14px;gap:4px"><i class="ti ti-arrow-right"></i> View</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 8px">
        ${byRarity.map(r => `
          <span style="font-size:11px;color:var(--ios-muted);display:inline-flex;align-items:center;gap:4px">
            <span style="width:8px;height:8px;border-radius:50%;display:inline-block;background:${rarityColors[r.rarity] || ACH_RARITY_COLORS[r.rarity]}"></span>
            ${r.label}: ${r.done}/${r.total}
          </span>
        `).join('')}
      </div>
      <div class="ach-progress-wrap" style="padding:0">
        <div class="ach-progress-bar" style="margin:0;height:6px">
          <div class="ach-progress-fill" style="width:${pct}%;background:linear-gradient(90deg,${rarities.map(r=>rarityColors[r]||ACH_RARITY_COLORS[r]).join(',')})"></div>
        </div>
      </div>
    </div>
  `;
}

function renderAchievementGrid() {
  const unlocked = state.stats.achievements || [];
  const grid = document.getElementById('achievement-grid');
  let items = achFilter === 'all' ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.cat === achFilter);
  if (achSearch) {
    items = items.filter(a => String(a.name || '').toLowerCase().includes(achSearch) || String(a.desc || '').toLowerCase().includes(achSearch));
  }

  if (!items.length) {
    grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--ios-muted);grid-column:1/-1">No achievements match your filter.</div>';
    return;
  }

  grid.innerHTML = items.map((a, ai) => {
    const isUnlocked = unlocked.includes(a.id);
    const prog = getAchievementProgress(a);
    const pct = prog.pct !== undefined ? Math.min(100, Math.round(prog.pct)) : 0;
    return `
      <div class="ach-card stagger-item-scale ${isUnlocked ? 'unlocked' : 'locked'}" data-rarity="${a.rarity}" data-cat="${a.cat}" onclick="showAchievementDetail('${a.id}')" style="animation-delay:${ai * 30}ms">
        <div class="ach-rarity-badge" style="background:${ACH_RARITY_COLORS[a.rarity]}">${a.rarity}</div>
        <div class="ach-card-inner">
          <div class="ach-card-icon">${a.icon}</div>
          <div class="ach-card-name">${a.name}</div>
          <div class="ach-card-desc">${a.desc}</div>
          ${!isUnlocked ? `
            <div class="ach-progress-track-wrap">
              <div class="ach-progress-track-fill" style="width:${pct}%"></div>
            </div>
          ` : ''}
          <div class="ach-card-footer">
            ${!isUnlocked ? `<span style="font-size:10px;color:var(--ios-muted)">${pct}%</span>` : ''}
            <span class="ach-card-xp">+${a.xp || 0} XP</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

function filterAchievements() {
  document.querySelectorAll('.ach-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === achFilter));
  renderAchievementGrid();
}

function showAchievementDetail(id) {
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;
  const isUnlocked = (state.stats.achievements || []).includes(id);
  const ben = ACHIEVEMENT_BENEFITS[id] || { how: ach.desc, benefit: 'Earn XP and prestige', reward: ach.xp + ' XP' };
  const cat = ACHIEVEMENT_CATS[ach.cat];
  const modal = document.getElementById('ach-modal');
  const body = document.getElementById('ach-modal-body');
  const icon = document.getElementById('ach-modal-icon');
  icon.innerHTML = ach.icon;
  const progress = getAchievementProgress(ach);
  const rarityColor = ACH_RARITY_COLORS[ach.rarity] || '#94a3b8';
  body.innerHTML = `
    <div class="ach-rarity-badge-modal" style="background:${rarityColor}">${ach.rarity}</div>
    <div class="ach-modal-name">${ach.name}</div>
    <div class="ach-modal-cat" style="background:${cat.color}15;color:${cat.color};border:1px solid ${cat.color}30">${cat.icon} ${cat.label}</div>
    <div class="ach-modal-desc">${ach.desc}</div>
    ${isUnlocked ? `
      <div class="ach-modal-unlocked">
        <div class="ach-modal-unlocked-text"><i class="ti ti-circle-check" style="vertical-align:-2px;margin-right:4px"></i>You unlocked this achievement!</div>
      </div>
    ` : `
      <div class="ach-modal-section">
        <div class="ach-modal-section-title"><i class="ti ti-target"></i> How to get it</div>
        <div style="font-size:13px;color:var(--ios-label);line-height:1.6;padding:0 4px">${ben.how}</div>
      </div>
    `}
    ${progress.current !== undefined ? `
      <div class="ach-modal-progress">
        <div class="ach-modal-progress-row">
          <span class="ach-modal-progress-label">Progress</span>
          <span class="ach-modal-progress-val">${progress.display}</span>
        </div>
        <div class="ach-modal-progress-track">
          <div class="ach-modal-progress-fill" style="width:${Math.min(100, progress.pct)}%;background:${isUnlocked ? '#34C759' : cat.color}"></div>
        </div>
      </div>
    ` : ''}
    <div class="ach-modal-section">
      <div class="ach-modal-section-title"><i class="ti ti-gift"></i> What it gives you</div>
      <div class="ach-modal-benefit">
        <div class="ach-modal-benefit-title"><i class="ti ti-trending-up" style="vertical-align:-1px;margin-right:4px"></i> Account Benefit</div>
        <div class="ach-modal-benefit-desc">${ben.benefit}</div>
      </div>
      <div class="ach-modal-benefit" style="background:rgba(255,149,0,0.08);border-color:rgba(255,149,0,0.2)">
        <div class="ach-modal-benefit-title" style="color:var(--ios-orange)"><i class="ti ti-star" style="vertical-align:-1px;margin-right:4px"></i> Reward</div>
        <div class="ach-modal-benefit-desc">${ben.reward}</div>
      </div>
    </div>
    <div class="ach-modal-xp">
      <span class="ach-modal-xp-icon"><i class="ti ti-sparkles"></i></span>
      <span>${isUnlocked ? 'Earned' : 'Earn'} <strong>${ach.xp} XP</strong> ${isUnlocked ? '' : 'on unlock'}</span>
    </div>
  `;
  modal.classList.add('open');
}

function getAchievementProgress(ach) {
  const s = state.stats;
  switch (ach.id) {
    case 'first_word': return { current: s.wordsLearned, max: 1, pct: (s.wordsLearned / 1) * 100, display: `${s.wordsLearned} / 1` };
    case 'ten_words': return { current: s.wordsLearned, max: 10, pct: (s.wordsLearned / 10) * 100, display: `${s.wordsLearned} / 10` };
    case 'fifty_words': return { current: s.wordsLearned, max: 50, pct: (s.wordsLearned / 50) * 100, display: `${s.wordsLearned} / 50` };
    case 'hundred_words': return { current: s.wordsLearned, max: 100, pct: (s.wordsLearned / 100) * 100, display: `${s.wordsLearned} / 100` };
    case 'five_hundred_words': return { current: s.wordsLearned, max: 500, pct: (s.wordsLearned / 500) * 100, display: `${s.wordsLearned} / 500` };
    case 'thousand_words': return { current: s.wordsLearned, max: 1000, pct: (s.wordsLearned / 1000) * 100, display: `${s.wordsLearned} / 1000` };
    case 'two_thousand_words': return { current: s.wordsLearned, max: 2000, pct: (s.wordsLearned / 2000) * 100, display: `${s.wordsLearned} / 2000` };
    case 'five_thousand_words': return { current: s.wordsLearned, max: 5000, pct: (s.wordsLearned / 5000) * 100, display: `${s.wordsLearned} / 5000` };
    case 'streak_3': return { current: s.streak, max: 3, pct: (s.streak / 3) * 100, display: `${s.streak} / 3 days` };
    case 'streak_7': return { current: s.streak, max: 7, pct: (s.streak / 7) * 100, display: `${s.streak} / 7 days` };
    case 'streak_14': return { current: s.streak, max: 14, pct: (s.streak / 14) * 100, display: `${s.streak} / 14 days` };
    case 'streak_30': return { current: s.streak, max: 30, pct: (s.streak / 30) * 100, display: `${s.streak} / 30 days` };
    case 'streak_100': return { current: s.streak, max: 100, pct: (s.streak / 100) * 100, display: `${s.streak} / 100 days` };
    case 'streak_365': return { current: s.streak, max: 365, pct: (s.streak / 365) * 100, display: `${s.streak} / 365 days` };
    case 'perfect_quiz': return { current: s.correctAnswers, max: Math.max(1, s.totalQuestions), pct: s.totalQuestions > 0 ? (s.correctAnswers / s.totalQuestions) * 100 : 0, display: `${s.correctAnswers} / ${s.totalQuestions} correct` };
    case 'fifty_quiz': return { current: s.totalQuestions, max: 50, pct: (s.totalQuestions / 50) * 100, display: `${s.totalQuestions} / 50` };
    case 'twohundred_quiz': return { current: s.totalQuestions, max: 200, pct: (s.totalQuestions / 200) * 100, display: `${s.totalQuestions} / 200` };
    case 'thousand_quiz': return { current: s.totalQuestions, max: 1000, pct: (s.totalQuestions / 1000) * 100, display: `${s.totalQuestions} / 1000` };
    case 'five_thousand_quiz': return { current: s.totalQuestions, max: 5000, pct: (s.totalQuestions / 5000) * 100, display: `${s.totalQuestions} / 5000` };
    case 'perfect_accuracy': return { current: s.correctAnswers, max: s.totalQuestions || 1, pct: s.totalQuestions > 0 ? (s.correctAnswers / s.totalQuestions) * 100 : 0, display: `${s.correctAnswers} / ${s.totalQuestions} correct` };
    case 'first_game': return { current: s.gamesPlayed, max: 1, pct: (s.gamesPlayed / 1) * 100, display: `${s.gamesPlayed} / 1` };
    case 'ten_games': return { current: s.gamesPlayed, max: 10, pct: (s.gamesPlayed / 10) * 100, display: `${s.gamesPlayed} / 10` };
    case 'fifty_games': return { current: s.gamesPlayed, max: 50, pct: (s.gamesPlayed / 50) * 100, display: `${s.gamesPlayed} / 50` };
    case 'hundred_games': return { current: s.gamesPlayed, max: 100, pct: (s.gamesPlayed / 100) * 100, display: `${s.gamesPlayed} / 100` };
    case 'twofifty_games': return { current: s.gamesPlayed, max: 250, pct: (s.gamesPlayed / 250) * 100, display: `${s.gamesPlayed} / 250` };
    case 'level_3': return { current: s.level, max: 3, pct: (s.level / 3) * 100, display: `Level ${s.level} / 3` };
    case 'level_5': return { current: s.level, max: 5, pct: (s.level / 5) * 100, display: `Level ${s.level} / 5` };
    case 'level_8': return { current: s.level, max: 8, pct: (s.level / 8) * 100, display: `Level ${s.level} / 8` };
    case 'level_10': return { current: s.level, max: 10, pct: (s.level / 10) * 100, display: `Level ${s.level} / 10` };
    case 'level_15': return { current: s.level, max: 15, pct: (s.level / 15) * 100, display: `Level ${s.level} / 15` };
    case 'level_20': return { current: s.level, max: 20, pct: (s.level / 20) * 100, display: `Level ${s.level} / 20` };
    case 'level_25': return { current: s.level, max: 25, pct: (s.level / 25) * 100, display: `Level ${s.level} / 25` };
    case 'flashcard_100': return { current: s.cardsReviewed, max: 100, pct: (s.cardsReviewed / 100) * 100, display: `${s.cardsReviewed} / 100` };
    case 'flashcard_500': return { current: s.cardsReviewed, max: 500, pct: (s.cardsReviewed / 500) * 100, display: `${s.cardsReviewed} / 500` };
    case 'flashcard_2000': return { current: s.cardsReviewed, max: 2000, pct: (s.cardsReviewed / 2000) * 100, display: `${s.cardsReviewed} / 2000` };
    case 'flashcard_5000': return { current: s.cardsReviewed, max: 5000, pct: (s.cardsReviewed / 5000) * 100, display: `${s.cardsReviewed} / 5000` };
    case 'study_100min': return { current: s.studyMinutes, max: 100, pct: (s.studyMinutes / 100) * 100, display: `${s.studyMinutes} / 100 min` };
    case 'study_500min': return { current: s.studyMinutes, max: 500, pct: (s.studyMinutes / 500) * 100, display: `${s.studyMinutes} / 500 min` };
    case 'study_2000min': return { current: s.studyMinutes, max: 2000, pct: (s.studyMinutes / 2000) * 100, display: `${s.studyMinutes} / 2000 min` };
    case 'study_5000min': return { current: s.studyMinutes, max: 5000, pct: (s.studyMinutes / 5000) * 100, display: `${s.studyMinutes} / 5000 min` };
    case 'all_rounder': {
      const cats = new Set();
      (s.achievements || []).forEach(id => { const a = ACHIEVEMENTS.find(x => x.id === id); if (a) cats.add(a.cat); });
      return { current: cats.size, max: 4, pct: (cats.size / 4) * 100, display: `${cats.size} / 4 categories` };
    }
    case 'completionist': return { current: (s.achievements || []).length, max: 30, pct: ((s.achievements || []).length / 30) * 100, display: `${(s.achievements || []).length} / 30` };
    case 'perfectionist': return { current: (s.achievements || []).length, max: ACHIEVEMENTS.length - 1, pct: ((s.achievements || []).length / (ACHIEVEMENTS.length - 1)) * 100, display: `${(s.achievements || []).length} / ${ACHIEVEMENTS.length - 1}` };
  }
  return {};
}

function closeAchievementModal() {
  document.getElementById('ach-modal').classList.remove('open');
}

document.addEventListener('mouseup', function(e) {
  const modal = document.getElementById('ach-modal');
  if (modal.classList.contains('open') && !e.target.closest('.ach-modal-content') && !e.target.closest('.ach-card')) {
    closeAchievementModal();
  }
});

function animateProgressBars() {
  setTimeout(() => {
    const fill = document.getElementById('ach-progress-fill');
    if (fill && fill.dataset.target) {
      fill.style.width = fill.dataset.target + '%';
    }
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('achievement-grid')) renderAchievements();
});
