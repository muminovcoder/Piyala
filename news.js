// =============================================
// VocabMaster AI — News & Roadmap Module
// =============================================

const NEWS_DATA = {
  lastUpdated: 'June 12, 2026',
  releases: [
    {
      id: 'v2.6', title: 'AI Speaking Mock (IELTS)',
      tag: 'New', tagColor: '#3b82f6', progress: 90, eta: 'Coming Soon',
      description: 'Complete IELTS Speaking mock exam with AI evaluation. Practice Parts 1, 2, and 3 with real-time feedback.',
      features: [
        'Full IELTS Speaking mock exam (Parts 1, 2, 3)',
        'AI-generated questions using Groq AI',
        'Real-time timer & recording simulation',
        'IELTS Band score evaluation (0–9)',
        'Detailed feedback: fluency, vocabulary, grammar, pronunciation',
        'Part 2 cue card with 1-minute preparation timer'
      ]
    },
    {
      id: 'v2.5', title: 'Mobile App (Android & iOS)',
      tag: 'Planned', tagColor: '#fb923c', progress: 5, eta: 'Early 2027',
      description: 'React Native cross-platform app with offline mode, push notifications, and full feature parity with web.',
      features: [
        'React Native cross-platform mobile app',
        'Offline mode with full vocabulary access',
        'Push notifications for streaks & daily words',
        'Mobile-optimized flashcards & quizzes',
        'Biometric authentication (fingerprint, Face ID)',
        'Sync progress seamlessly with web version'
      ]
    },
    {
      id: 'v2.4', title: 'AI Tutor & Smart Learning',
      tag: 'Research', tagColor: '#94a3b8', progress: 8, eta: '10 weeks',
      description: 'Personalized AI tutor that adapts to your weak spots and learning pace.',
      features: [
        'Personalized learning path based on weak spots',
        'AI-generated quizzes from your mistake history',
        'Smart vocabulary recommendations',
        'Adaptive difficulty based on performance',
        'Weekly AI progress reports',
        'Context-aware word suggestions from web content'
      ]
    },
    {
      id: 'v2.3', title: 'Premium Subscriptions',
      tag: 'In Development', tagColor: '#f59e0b', progress: 25, eta: '4 weeks',
      description: 'Tiered subscription plans with ad-free experience, unlimited AI Speaking, and family sharing.',
      features: [
        'Premium plan — unlimited AI Speaking, AI Tutor, advanced analytics',
        'Yearly billing with ~37% discount on all paid plans',
        'Payment via Click, Payme, Naqd, Visa, Uzum Bank',
        'Subscription management dashboard with history'
      ]
    },
    {
      id: 'v2.2', title: 'Profile & Account Management',
      tag: 'Released', tagColor: '#34d399', progress: 100, eta: 'Jun 2026',
      description: 'Full-featured user profiles, account settings, and cloud sync across devices.',
      features: [
        'Full profile page with avatar, bio, and social links',
        'Account settings (email, password, preferences)',
        'Study goal & daily word goal configuration',
        'Learning statistics dashboard with XP tracking',
        'Achievement showcase & progress history',
        'Cross-device cloud progress sync'
      ]
    },
    {
      id: 'v1.8', title: 'Grammar Master',
      tag: 'Released', tagColor: '#7C6FFF', progress: 100, eta: 'May 2026',
      description: 'Comprehensive grammar learning with 12 tenses, 24 categories, and interactive exercises.',
      features: [
        '12 English tenses with full explanations & examples',
        '24 grammar categories (articles, conditionals, modals, etc.)',
        'Interactive grammar exercises & quizzes',
        'Daily grammar challenge with bonus XP rewards',
        'Achievement system with 5 rarity tiers',
        'Weak-spot analysis & adaptive rank system'
      ]
    },
    {
      id: 'v1.7', title: 'Flashcards & Spaced Repetition',
      tag: 'Released', tagColor: '#f472b6', progress: 100, eta: 'Apr 2026',
      description: 'SM-2 spaced repetition algorithm for optimal vocabulary retention.',
      features: [
        'SM-2 spaced repetition algorithm for optimal retention',
        'Custom review session settings (words per session)',
        'Progress dashboard with retention metrics',
        'Favorites & bookmarks for quick word access',
        'Cross-session learning persistence',
        'Daily review reminders'
      ]
    },
    {
      id: 'v1.6', title: 'Books Reader & YouTube Lessons',
      tag: 'Released', tagColor: '#22D3EE', progress: 100, eta: 'Mar 2026',
      description: 'Learn vocabulary from books and YouTube videos with interactive tools.',
      features: [
        'Integrated book reader with vocabulary lookup',
        'YouTube lesson player with interactive subtitles',
        'Word extraction from any text or video',
        'Progress tracking per book and video',
        'Bookmark words while reading or watching',
        'AI-powered explanations for difficult words'
      ]
    },
    {
      id: 'v1.5', title: 'Word of the Day & Daily Streaks',
      tag: 'Released', tagColor: '#34d399', progress: 100, eta: 'Feb 2026',
      description: 'Daily vocabulary building with streaks, heatmaps, and XP rewards.',
      features: [
        'Daily word with AI-generated examples and pronunciation',
        'Streak tracking with freeze items',
        'Heatmap calendar showing daily activity',
        'XP rewards for maintaining streaks',
        'Achievement badges for streak milestones',
        'Daily challenges with bonus points'
      ]
    },
    {
      id: 'v1.4', title: 'Pomodoro Timer & Focus Mode',
      tag: 'Released', tagColor: '#f472b6', progress: 100, eta: 'Jan 2026',
      description: 'Stay focused with a customizable Pomodoro timer and ambient sounds.',
      features: [
        'Customizable Pomodoro timer (focus/break intervals)',
        'Mini timer overlay when navigating other pages',
        'Session tracking with focus time stats',
        'Auto-start breaks and focus sessions',
        'Sound notifications for session transitions',
        'XP rewards for completed focus sessions'
      ]
    },
    {
      id: 'v1.3', title: 'Leaderboard & Achievements',
      tag: 'Released', tagColor: '#7C6FFF', progress: 100, eta: 'Dec 2025',
      description: 'Global leaderboard with XP ranking, 29 achievements, and grammar rankings.',
      features: [
        'Global leaderboard with XP ranking',
        'Online users count with live updates',
        '29 achievements across multiple categories',
        'Achievement rarity system (Common → Legendary)',
        'Visual progress tracking for each achievement',
        'Grammar-specific achievements and rankings'
      ]
    },
    {
      id: 'v1.2', title: 'Multi-Language Support',
      tag: 'Planned', tagColor: '#fb923c', progress: 10, eta: 'Q3 2026',
      description: 'Interface translations and bilingual quiz modes for international users.',
      features: [
        'Interface translations: Uzbek, Russian, Spanish, French',
        'Word definitions in multiple languages',
        'Bilingual quiz mode for translation practice',
        'Community translation contributions',
        'Language-specific grammar guides',
        'RTL layout support for Arabic & Persian'
      ]
    },
    {
      id: 'v1.1', title: 'Social & Community Features',
      tag: 'Research', tagColor: '#94a3b8', progress: 5, eta: 'Q4 2026',
      description: 'Connect with friends, share decks, and compete on community leaderboards.',
      features: [
        'Friend system & private study groups',
        'Weekly leaderboards with friends',
        'Shared flashcard decks between users',
        'Community word contributions and voting',
        'Study streak competitions with friends',
        'In-app messaging for study partners'
      ]
    }
  ],
  milestones: [
    { label: 'Active Users', current: 1240, target: 10000 },
    { label: 'Total Words', current: 1103, target: Infinity },
    { label: 'Grammar Lessons', current: 39, target: 75 },
    { label: 'Quiz Questions', current: 508, target: 2000 },
    { label: 'Achievements', current: 99, target: 150 },
    { label: 'AI Models', current: 4, target: 10 },
    { label: 'AI Speaking Tests', current: 0, target: 10000 }
  ]
};

const NEWS_TAGS = ['All', 'Released', 'In Development', 'New', 'Planned', 'Research'];
let newsFilterTag = 'All';
let newsSearchQuery = '';
let newsExpandedId = null;

function renderNews() {
  const el = document.getElementById('news-content');
  if (!el) return;

  let filtered = NEWS_DATA.releases;
  if (newsFilterTag !== 'All') {
    filtered = filtered.filter(r => r.tag === newsFilterTag);
  }
  if (newsSearchQuery.trim()) {
    const q = newsSearchQuery.trim().toLowerCase();
    filtered = filtered.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.features.some(f => f.toLowerCase().includes(q))
    );
  }

  const filterBarHtml = NEWS_TAGS.map(t =>
    `<button class="news-filter-btn ${t === newsFilterTag ? 'active' : ''}" onclick="newsSetFilter('${t}')">${t === 'All' ? 'All' : t}</button>`
  ).join('');

  const groups = [
    { label: 'Released', icon: '<i class="ti ti-check"></i>', key: 'Released' },
    { label: 'In Development', icon: '<i class="ti ti-settings"></i>', key: 'In Development' },
    { label: 'New', icon: '<i class="ti ti-sparkles"></i>', key: 'New' },
    { label: 'Planned', icon: '<i class="ti ti-clipboard-list"></i>', key: 'Planned' },
    { label: 'Research', icon: '<i class="ti ti-microscope"></i>', key: 'Research' },
  ];

  let timelineHtml = '';
  groups.forEach(g => {
    const items = filtered.filter(r => r.tag === g.key);
    if (items.length === 0) return;
    timelineHtml += `<div class="news-group-label">${g.icon} ${g.label} <span class="news-group-count">${items.length}</span></div>`;
    items.forEach(r => {
      timelineHtml += renderReleaseCard(r, r.id === NEWS_DATA.releases[0].id);
    });
  });

  if (timelineHtml === '') {
    timelineHtml = `<div class="news-empty">No releases match your filter.</div>`;
  }

  const totalFeatures = NEWS_DATA.releases.reduce((s, r) => s + r.features.length, 0);

  el.innerHTML = `
    <div class="stagger-1" style="margin-bottom:20px;background:linear-gradient(135deg,#5856D6,#007AFF);border-radius:16px;padding:24px;color:#fff">
      <div style="display:flex;align-items:center;gap:14px">
        <div style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:20px"><i class="ti ti-news"></i></div>
        <div>
          <h2 style="font-size:22px;font-weight:700;margin:0;line-height:1.2">News & Roadmap</h2>
          <p style="font-size:13px;opacity:0.85;margin:4px 0 0">Track every update, feature release, and milestone</p>
        </div>
      </div>
      <div style="font-size:11px;opacity:0.6;margin-top:12px;border-top:1px solid rgba(255,255,255,0.15);padding-top:10px">Last updated: ${NEWS_DATA.lastUpdated}</div>
    </div>

    <div id="news-body">
      <div class="news-countdown-row">
        ${renderCountdownCard('Next Release', '<i class="ti ti-calendar"></i>', getNextETA())}
        ${renderCountdownCard('Features Planned', '<i class="ti ti-checks"></i>', String(totalFeatures))}
        ${renderCountdownCard('Active Milestones', '<i class="ti ti-flag"></i>', String(NEWS_DATA.milestones.length))}
        ${renderCountdownCard('Overall Progress', '<i class="ti ti-chart-arcs"></i>', getOverallProgress() + '%')}
      </div>

      <div class="news-toolbar">
        <div class="news-filters">${filterBarHtml}</div>
        <div class="news-search-wrap">
          <i class="ti ti-search news-search-icon"></i>
          <input type="text" class="news-search-input" placeholder="Search releases..." value="${escHtml(newsSearchQuery)}" oninput="newsSetSearch(this.value)">
          ${newsSearchQuery ? '<button class="news-search-clear" onclick="newsSetSearch(\'\')"><i class="ti ti-x"></i></button>' : ''}
        </div>
      </div>

      <div class="news-section-wrap">
        <div class="news-section-title"><i class="ti ti-road"></i> Development Roadmap</div>
        <div class="news-timeline">
          ${timelineHtml}
        </div>
      </div>

      <div class="news-section-wrap" style="margin-top:40px">
        <div class="news-section-title"><i class="ti ti-target"></i> Project Milestones</div>
        <div class="news-milestone-grid">
          ${NEWS_DATA.milestones.map(m => renderMilestoneCard(m)).join('')}
        </div>
      </div>

      <div class="news-footer">
        <div class="news-footer-text"><i class="ti ti-heart"></i> VocabMaster AI — an ever-evolving project. Share your suggestions and feedback! <i class="ti ti-heart"></i></div>
      </div>
    </div>
  `;

  animateProgressBars();
  requestAnimationFrame(() => {
    document.querySelectorAll('.news-countdown-card').forEach((el, i) => {
      el.classList.add('stagger-item');
      el.style.animationDelay = `${80 + i * 80}ms`;
    });
  });
}

function newsSetFilter(tag) {
  newsFilterTag = tag;
  newsExpandedId = null;
  renderNews();
}

function newsSetSearch(q) {
  newsSearchQuery = q;
  newsExpandedId = null;
  renderNews();
}

function newsToggleExpand(id) {
  newsExpandedId = newsExpandedId === id ? null : id;
  renderNews();
}

function releaseIcon(id) {
  const map = {
    'v2.6': '<i class="ti ti-message"></i>',
    'v2.5': '<i class="ti ti-device-mobile"></i>',
    'v2.4': '<i class="ti ti-robot"></i>',
    'v2.3': '<i class="ti ti-crown"></i>',
    'v2.2': '<i class="ti ti-user"></i>',
    'v1.8': '<i class="ti ti-edit"></i>',
    'v1.7': '<i class="ti ti-brain"></i>',
    'v1.6': '<i class="ti ti-book"></i>',
    'v1.5': '<i class="ti ti-calendar"></i>',
    'v1.4': '<i class="ti ti-clock"></i>',
    'v1.3': '<i class="ti ti-trophy"></i>',
    'v1.2': '<i class="ti ti-world"></i>',
    'v1.1': '<i class="ti ti-users"></i>'
  };
  return map[id] || '<i class="ti ti-rocket"></i>';
}

function milestoneIcon(label) {
  const map = {
    'Active Users': '<i class="ti ti-users"></i>',
    'Total Words': '<i class="ti ti-books"></i>',
    'Grammar Lessons': '<i class="ti ti-edit"></i>',
    'Quiz Questions': '<i class="ti ti-help-circle"></i>',
    'Achievements': '<i class="ti ti-trophy"></i>',
    'AI Models': '<i class="ti ti-brain"></i>',
    'AI Speaking Tests': '<i class="ti ti-message"></i>'
  };
  return map[label] || '<i class="ti ti-star"></i>';
}

function renderReleaseCard(r, isLatest) {
  const isReleased = r.progress === 100;
  const isExpanded = newsExpandedId === r.id;
  const showFeatures = isExpanded;
  const hasFeatures = r.features.length > 0;

  const featuresHtml = showFeatures ? r.features.map((f, fi) =>
    `<li class="news-feature-item" style="animation-delay:${fi * 0.05}s"><span class="nfi-icon">${isReleased ? '<i class="ti ti-circle-check"></i>' : '<i class="ti ti-sparkles"></i>'}</span> ${f}</li>`
  ).join('') : '';

  const progressHtml = isReleased ? `
    <div class="ntc-done-badge">
      <div class="ntc-done-circle">
        <i class="ti ti-circle-check" style="font-size:18px;color:#34d399"></i>
        <span style="font-size:7px;font-weight:800;color:#34d399;letter-spacing:0.3px;margin-top:1px;line-height:1">DONE</span>
      </div>
    </div>
  ` : `
    <div class="ntc-progress-ring-wrap">
      <svg class="ntc-progress-ring" width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r="22" fill="none" stroke="var(--bg3)" stroke-width="4"/>
        <circle class="ntc-ring-fill" cx="26" cy="26" r="22" fill="none"
          stroke="${r.tagColor}" stroke-width="4" stroke-linecap="round"
          stroke-dasharray="${2 * Math.PI * 22}"
          stroke-dashoffset="${2 * Math.PI * 22 * (1 - r.progress / 100)}"/>
      </svg>
      <span class="ntc-progress-pct" style="color:${r.tagColor}">${r.progress}%</span>
    </div>
  `;

  const barHtml = isReleased ? '' : `
    <div class="ntc-progress-bar">
      <div class="ntc-progress-fill" style="width:0%;background:${r.tagColor}" data-target="${r.progress}"></div>
    </div>
  `;

  return `
    <div class="news-timeline-item ${isReleased ? 'released' : ''} ${isExpanded ? 'expanded' : ''}" onclick="newsToggleExpand('${r.id}')">
      <div class="news-timeline-dot" style="border-color:${r.tagColor}"></div>
      <div class="news-timeline-card ${isReleased ? 'released-card' : ''}" style="${isLatest && !newsFilterTag !== 'All' ? 'border-color:rgba(99,102,241,0.3)' : ''}">
        ${isLatest && newsFilterTag === 'All' && !newsSearchQuery ? '<div class="ntc-latest-badge">Latest Release</div>' : ''}
        <div class="ntc-header">
          <div class="ntc-icon"><span style="font-size:24px">${releaseIcon(r.id)}</span></div>
          <div style="flex:1;min-width:0">
            <div class="ntc-title">${r.title} ${!isExpanded && hasFeatures ? '<span class="ntc-expand-hint">click for details</span>' : ''}</div>
            <div class="ntc-meta">
              <span class="ntc-version">${r.id}</span>
              <span class="ntc-tag" style="background:${r.tagColor}22;color:${r.tagColor};border-color:${r.tagColor}44">${r.tag}</span>
              <span class="ntc-eta"><i class="ti ti-${isReleased ? 'circle-check' : 'clock'}"></i> ${r.eta}</span>
            </div>
          </div>
          ${progressHtml}
        </div>
        ${barHtml}
        ${r.description && !isExpanded ? `<div class="ntc-desc">${r.description}</div>` : ''}
        ${isExpanded ? `<ul class="ntc-features">${featuresHtml}</ul>` : ''}
        ${isExpanded && !hasFeatures ? '<div class="ntc-features" style="padding-top:12px;border-top:1px solid var(--border);margin-top:12px;font-size:13px;color:var(--text3)">No features listed yet.</div>' : ''}
      </div>
    </div>
  `;
}

function renderMilestoneCard(m) {
  const isInf = m.target === Infinity;
  const pct = isInf ? 100 : Math.min(100, Math.round((m.current / m.target) * 100));
  const targetDisplay = isInf ? '∞' : m.target.toLocaleString();
  return `
    <div class="news-milestone-card">
      <div class="nm-header">
        <span class="nm-label">${milestoneIcon(m.label)} ${m.label}</span>
        <span class="nm-pct">${isInf ? '∞' : `${pct}%`}</span>
      </div>
      ${isInf ? '' : `
      <div class="nm-bar">
        <div class="nm-fill" style="width:0%" data-target="${pct}"></div>
      </div>
      `}
      <div class="nm-footer">
        <span>${isInf ? '∞' : `${m.current.toLocaleString()} / ${targetDisplay}`}</span>
        <span class="nm-footer-icon">${isInf ? '∞' : '<i class="ti ti-arrow-right"></i>'}</span>
      </div>
    </div>
  `;
}

function renderCountdownCard(label, iconHtml, value) {
  return `
    <div class="news-countdown-card">
      <div class="ncc-icon-row">${iconHtml}</div>
      <div class="ncc-value">${value}</div>
      <div class="ncc-label">${label}</div>
    </div>
  `;
}

function getNextETA() {
  const next = NEWS_DATA.releases[0];
  return next ? next.eta : '—';
}

function getOverallProgress() {
  const total = NEWS_DATA.releases.reduce((s, r) => s + r.progress, 0);
  return Math.round(total / NEWS_DATA.releases.length);
}

function animateProgressBars() {
  requestAnimationFrame(() => {
    document.querySelectorAll('.ntc-progress-fill, .nm-fill').forEach(el => {
      const target = parseFloat(el.dataset.target);
      if (!isNaN(target)) {
        setTimeout(() => { el.style.width = target + '%'; }, 100);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('news-content')) renderNews();
});
