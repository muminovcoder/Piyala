// =============================================
// VocabMaster AI — Dashboard/General Module
// iOS-style dashboard with 2-column layout
// =============================================

// ===== ANIMATED COUNTER =====
function animateCounter(el, target, suffix = '', duration = 800) {
  if (!el) return;
  const start = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
  const diff = target - start;
  if (diff === 0) { el.textContent = target + suffix; return; }
  const startTime = performance.now();
  function tick(now) {
    const pct = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(start + diff * eased) + suffix;
    if (pct < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ===== MOTIVATIONAL MESSAGE =====
function getMotivation(streak, wordsToday) {
  if (streak >= 30) return 'Legendary streak! Keep it blazing!';
  if (streak >= 14) return 'Unstoppable! Keep the fire burning!';
  if (streak >= 7) return 'One full week — incredible dedication!';
  if (streak >= 3) return 'Building momentum! Great job!';
  if (wordsToday > 0) return 'Great start! Come back tomorrow!';
  return 'Ready to learn some words today?';
}

// ===== REFRESH DASHBOARD =====
function refreshDashboard() {
  updateSidebarXP();
  const h = new Date().getHours();
  const gt = document.getElementById('greeting-time');
  if (gt) gt.textContent = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';

  const s = state.stats;

  // Greeting subtitle
  const sub = document.querySelector('.greeting-sub');
  if (sub) {
    sub.textContent = s.streak > 0
      ? `${s.streak}-day streak · ${s.wordsToday} today`
      : `${s.wordsLearned} words · Start your streak!`;
  }

  // Stat counters (2×2 grid)
  animateCounter(document.getElementById('stat-words'), s.wordsLearned || 0);
  animateCounter(document.getElementById('stat-learned'), s.wordsLearned || 0);
  animateCounter(document.getElementById('stat-streak'), s.streak || 0);
  animateCounter(document.getElementById('stat-minutes'), s.minutesToday || 0);

  // Streak card (right column)
  const lg = document.getElementById('streak-display-lg');
  if (lg) animateCounter(lg, s.streak || 0);
  const mot = document.getElementById('streak-motivation');
  if (mot) mot.textContent = getMotivation(s.streak, s.wordsToday);

  // XP Progress
  const lvl = s.level;
  const threshold = LEVEL_THRESHOLDS[lvl - 1] || 0;
  const next = LEVEL_THRESHOLDS[lvl] || threshold + 1000;
  const pct = getLevelProgress();
  const fill = document.getElementById('xp-fill');
  const cur = document.getElementById('xp-current');
  const nxt = document.getElementById('xp-next');
  const badge = document.getElementById('xp-badge');
  const lvlBadge = document.getElementById('xp-level-badge');
  const goalEl = document.getElementById('xp-goal');
  const pctEl = document.getElementById('xp-pct');
  const dotsEl = document.getElementById('xp-dots');
  const currentXp = s.totalXP - threshold;
  const neededXp = next - threshold;
  if (fill) setTimeout(function() { fill.style.width = pct + '%'; }, 150);
  if (cur) cur.textContent = currentXp + ' XP';
  if (nxt) nxt.textContent = neededXp + ' XP';
  if (badge) badge.textContent = s.totalXP + ' XP';
  if (lvlBadge) lvlBadge.textContent = 'Lv.' + lvl;
  if (goalEl) goalEl.innerHTML = 'of <strong>' + neededXp + ' XP</strong>';
  if (pctEl) pctEl.textContent = pct + '%';
  if (dotsEl) {
    var dotCount = Math.min(10, Math.floor(pct / 10));
    dotsEl.innerHTML = '';
    for (var i = 0; i < dotCount; i++) {
      var d = document.createElement('span');
      d.className = 'xp-dot';
      d.style.left = ((i + 1) * 10) + '%';
      d.style.animationDelay = (i * 0.08) + 's';
      dotsEl.appendChild(d);
    }
  }

  // CEFR
  renderCEFRDistribution();
}

// ===== CEFR DISTRIBUTION =====
function renderCEFRDistribution() {
  const el = document.getElementById('cefr-distribution');
  if (!el) return;
  const dist = getCEFRDistribution();
  const total = Object.values(dist).reduce((a, b) => a + b, 0);
  const colors = { A1:'#10B981', A2:'#34D399', B1:'#F59E0B', B2:'#FF6B35', C1:'#EF4444', C2:'#DC2626' };
  const labels = { A1:'Beginner', A2:'Elementary', B1:'Intermediate', B2:'Upper Int', C1:'Advanced', C2:'Proficient' };

  if (total === 0) {
    el.innerHTML = '<div class="cefr-empty"><i class="ti ti-chart-bar"></i><span>Explore words to build your CEFR profile</span></div>';
    return;
  }

  const maxCount = Math.max(...Object.values(dist), 1);
  el.innerHTML = '<div class="cefr-chart">' +
    Object.entries(dist).map(function(e) {
      var lvl = e[0], count = e[1];
      var pct = Math.round((count / total) * 100);
      var barH = Math.max(4, (count / maxCount) * 64);
      return '<div class="cefr-col">' +
        '<div class="cefr-bar-wrap">' +
          '<div class="cefr-bar" style="background:' + colors[lvl] + '" data-target="' + barH + '"></div>' +
        '</div>' +
        '<div class="cefr-count">' + count + '</div>' +
        '<div class="cefr-pct">' + pct + '%</div>' +
        '<div class="cefr-lvl" style="color:' + colors[lvl] + '">' + lvl + '</div>' +
        '<div class="cefr-label">' + labels[lvl] + '</div>' +
      '</div>';
    }).join('') + '</div>';

  requestAnimationFrame(function() {
    var bars = el.querySelectorAll('.cefr-bar');
    bars.forEach(function(bar, i) {
      setTimeout(function() { bar.style.height = bar.dataset.target + 'px'; }, i * 100 + 80);
    });
  });
  if (typeof updateWordCounter === 'function') updateWordCounter();
}
