function setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val != null ? val : '';
}

let profileEditing = false;
let profileData = null;
let profileRenderLock = false;
let profileRendered = false;
const PROFILE_CACHE_KEY = 'vm_profile_cache';

function escHtml(v) {
  var d = document.createElement('div');
  d.textContent = v || '';
  return d.innerHTML;
}

function getShortId(uuid) {
  if (!uuid) return '--------';
  var h = uuid.replace(/-/g, '');
  var n = 0;
  for (var i = 0; i < h.length; i++) {
    n = (n * 31 + parseInt(h[i], 16)) % 100000000;
  }
  return String(n).padStart(8, '0');
}

function cacheProfileData(data) {
  try {
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({ data: data, timestamp: Date.now() }));
  } catch (_) {}
}

function getCachedProfile() {
  try {
    var raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    var parsed = JSON.parse(raw);
    return parsed.data || null;
  } catch (_) {
    return null;
  }
}

async function renderProfile() {
  if (profileRenderLock) return;
  if (profileRendered) return;
  profileRenderLock = true;
  profileRendered = false;
  try {
    var body = document.getElementById('profile-body');
    if (!body) return;

    if (!state || !state.authUser) {
      body.innerHTML = [
        '<div class="profile-card" style="text-align:center;padding:48px 24px;">',
        '  <div style="width:64px;height:64px;margin:0 auto 14px;background:linear-gradient(135deg,#5856D6,#007AFF);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:28px;color:#fff;box-shadow:0 8px 24px rgba(88,86,214,0.25)">',
        '    <i class="ti ti-user-plus"></i>',
        '  </div>',
        '  <div style="font-size:20px;font-weight:700;color:var(--ios-label);margin-bottom:4px;">Sign in / Register</div>',
        '  <div style="color:var(--ios-secondary-label);font-size:13px;max-width:320px;margin:0 auto 22px;line-height:1.6">',
        '    Sign in to access your profile, sync your data, and unlock personalised features.',
        '  </div>',
        '  <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">',
        '    <button onclick="openAuthModal()" style="width:220px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 20px;font-size:15px;font-weight:600;cursor:pointer;background:linear-gradient(135deg,#5856D6,#007AFF);border:none;border-radius:14px;color:#fff;box-shadow:0 4px 16px rgba(88,86,214,0.3);transition:transform 0.15s ease,box-shadow 0.15s ease"',
        '      onmouseover="this.style.transform=\'scale(1.02)\';this.style.boxShadow=\'0 6px 20px rgba(88,86,214,0.35)\'"',
        '      onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'"',
        '      onmousedown="this.style.transform=\'scale(0.97)\'">',
        '      <i class="ti ti-user-plus"></i> Sign in / Register',
        '    </button>',
        '    <button onclick="routerNavigate(\'/\')" style="background:none;border:none;color:var(--ios-secondary-label);font-size:13px;cursor:pointer;padding:8px 16px;border-radius:10px;transition:color 0.15s ease,background 0.15s ease"',
        '      onmouseover="this.style.color=\'#5856D6\';this.style.background=\'rgba(88,86,214,0.06)\'"',
        '      onmouseout="this.style.color=\'\';this.style.background=\'\'">',
        '      Skip for now',
        '    </button>',
        '  </div>',
        '</div>'
      ].join('\n');
      return;
    }

    body.innerHTML = [
      '<div class="profile-card" style="text-align:center;padding:36px 20px;">',
      '  <i class="ti ti-loader" style="font-size:40px;color:var(--ios-muted);margin-bottom:10px;display:block"></i>',
      '  <div style="font-size:17px;font-weight:600;color:var(--ios-label);">Loading your profile...</div>',
      '</div>'
    ].join('\n');

    var profileResult = await Promise.allSettled([
      Promise.race([
        SECURE_API.getProfile(),
        new Promise(function(_, reject) { setTimeout(function() { reject(new Error('timeout')); }, 8000); }),
      ]),
    ]);

    try {
      var loaded = await SECURE_API.loadData();
      if (loaded) {
        if (loaded.stats) {
          state.stats.totalXP = Math.max(state.stats.totalXP || 0, loaded.stats.totalXP || 0);
          state.stats.streak = Math.max(state.stats.streak || 0, loaded.stats.streak || 0);
          state.stats.level = getLevel(state.stats.totalXP);
          state.stats.wordsLearned = Math.max(state.stats.wordsLearned || 0, loaded.stats.wordsLearned || 0);
          state.stats.correctAnswers = Math.max(state.stats.correctAnswers || 0, loaded.stats.correctAnswers || 0);
          state.stats.totalQuestions = Math.max(state.stats.totalQuestions || 0, loaded.stats.totalQuestions || 0);
          if (loaded.stats.heatmap) {
            var _h = state.stats.heatmap || {};
            for (var _d in loaded.stats.heatmap) { if (loaded.stats.heatmap.hasOwnProperty(_d)) _h[_d] = Math.max(_h[_d] || 0, loaded.stats.heatmap[_d]); }
            state.stats.heatmap = _h;
          }
          if (loaded.stats.achievements && loaded.stats.achievements.length) {
            var _a = state.stats.achievements || [];
            loaded.stats.achievements.forEach(function(_ach) { if (_a.indexOf(_ach) === -1) _a.push(_ach); });
            state.stats.achievements = _a;
          }
        }
        if (loaded.favorites && loaded.favorites.length) {
          var _existing = {};
          (state.favorites || []).forEach(function(f) { if (f.word) _existing[f.word] = true; });
          loaded.favorites.forEach(function(f) { if (f.word && !_existing[f.word]) state.favorites.push(f); });
        }
        if (loaded.recentWords && loaded.recentWords.length) {
          var _existingRW = {};
          (state.recentWords || []).forEach(function(r) { if (r.word) _existingRW[r.word] = true; });
          loaded.recentWords.forEach(function(r) { if (r.word && !_existingRW[r.word]) state.recentWords.push(r); });
        }
        if (loaded.grammar) {
          for (var _gk in loaded.grammar) {
            if (loaded.grammar.hasOwnProperty(_gk) && (state.grammar[_gk] === undefined || state.grammar[_gk] === null)) state.grammar[_gk] = loaded.grammar[_gk];
          }
        }
      }
    } catch (_) {}

    if (profileResult[0].status === 'fulfilled' && profileResult[0].value && profileResult[0].value.profile) {
      profileData = profileResult[0].value.profile;
      cacheProfileData(profileData);
      profileData.stats = state.stats;
      renderProfileView();
    } else {
      var cached = getCachedProfile();
      if (cached) {
        profileData = cached;
        profileData.stats = state.stats;
        renderProfileView();
      } else {
        renderLocalProfile();
      }
    }

    profileRendered = true;
  } catch (e) {
    console.error('renderProfile error:', e);
    var body2 = document.getElementById('profile-body');
    if (body2) body2.innerHTML = '<div style="text-align:center;padding:40px;color:var(--ios-secondary-label)">Something went wrong. Please refresh and try again.</div>';
  } finally {
    profileRenderLock = false;
  }
}

function renderLocalProfile() {
  try {
    var body = document.getElementById('profile-body');
    if (!body) return;
    var s = state.stats || {};
    var g = state.grammar || {};
    var name = state.authUser ? (state.authUser.username || (state.authUser.email ? state.authUser.email.split('@')[0] : '') || 'User') : 'User';
    var email = state.authUser ? (state.authUser.email || '') : '';
    var accuracy = s.totalQuestions > 0 ? Math.round((s.correctAnswers / s.totalQuestions) * 100) : 0;
    var achievedCount = (s.achievements || []).length;
    var grammarAchCount = (g.achievements || []).length;

    body.innerHTML = [
      '<div class="profile-card">',
      '  <div class="profile-avatar-section">',
      '    <div class="profile-avatar-preview">' + (name[0] || 'U').toUpperCase() + '</div>',
      '    <div>',
      '      <div style="font-size:22px;font-weight:700;line-height:1.2;color:var(--ios-label)">' + escHtml(name) + '</div>',
      '      <div style="color:var(--ios-secondary-label);font-size:13px;margin-top:2px;">' + escHtml(email) + '</div>',
      '      <div style="display:flex;align-items:center;gap:10px;margin-top:6px;flex-wrap:wrap;">',
      '        <span style="background:linear-gradient(135deg,#5856D6,#007AFF);color:#fff;border:none;font-size:11px;padding:3px 12px;border-radius:6px;font-weight:600">Level ' + (s.level || 1) + '</span>',
      '        <span style="font-size:13px;color:#5856D6;font-weight:700;">' + (s.totalXP || 0) + ' XP</span>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="profile-stats-grid">',
      '    <div class="profile-stat-card"><i class="ti ti-book profile-stat-icon" style="color:#5856D6"></i><div class="profile-stat-value">' + (s.wordsLearned || 0) + '</div><div class="profile-stat-label">Words</div></div>',
      '    <div class="profile-stat-card"><i class="ti ti-flame profile-stat-icon" style="color:#FF9500"></i><div class="profile-stat-value">' + (s.streak || 0) + '</div><div class="profile-stat-label">Streak</div></div>',
      '    <div class="profile-stat-card"><i class="ti ti-target profile-stat-icon" style="color:#007AFF"></i><div class="profile-stat-value">' + accuracy + '%</div><div class="profile-stat-label">Accuracy</div></div>',
      '    <div class="profile-stat-card"><i class="ti ti-cards profile-stat-icon" style="color:#34C759"></i><div class="profile-stat-value">' + (s.cardsReviewed || 0) + '</div><div class="profile-stat-label">Reviewed</div></div>',
      '    <div class="profile-stat-card"><i class="ti ti-star profile-stat-icon" style="color:#FF9500"></i><div class="profile-stat-value">' + (s.totalXP || 0) + '</div><div class="profile-stat-label">XP</div></div>',
      '    <div class="profile-stat-card"><i class="ti ti-clock profile-stat-icon" style="color:#AF52DE"></i><div class="profile-stat-value">' + (s.studyMinutes || 0) + 'm</div><div class="profile-stat-label">Study</div></div>',
      '    <div class="profile-stat-card"><i class="ti ti-flag profile-stat-icon" style="color:#FF3B30"></i><div class="profile-stat-value">' + (s.totalQuestions || 0) + '</div><div class="profile-stat-label">Questions</div></div>',
      '    <div class="profile-stat-card"><i class="ti ti-award profile-stat-icon" style="color:#5856D6"></i><div class="profile-stat-value">' + achievedCount + '</div><div class="profile-stat-label">Awards</div></div>',
      '  </div>',
      '</div>',
      '<div class="profile-card">',
      '  <div class="profile-card-title"><i class="ti ti-chart-bar" style="color:#5856D6"></i> Grammar Progress</div>',
      '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;">',
      '    <div class="profile-info-row"><span class="profile-info-label">Level</span><span class="profile-info-value">' + (g.level || 1) + '</span></div>',
      '    <div class="profile-info-row"><span class="profile-info-label">Rank</span><span class="profile-info-value">' + (g.rank || 'Beginner') + '</span></div>',
      '    <div class="profile-info-row"><span class="profile-info-label">Achievements</span><span class="profile-info-value">' + grammarAchCount + '</span></div>',
      '  </div>',
      '</div>',
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">',
      '  <button class="ios-btn" onclick="openAuthModal()" style="background:linear-gradient(135deg,#5856D6,#007AFF);color:#fff;border:none;flex:1"><i class="ti ti-cloud-upload"></i> Sign in for Cloud Sync</button>',
      '</div>'
    ].join('\n');
  } catch (e) {
    console.error('renderLocalProfile error:', e);
    var body2 = document.getElementById('profile-body');
    if (body2) body2.innerHTML = '<div style="text-align:center;padding:40px;color:var(--ios-secondary-label)">Something went wrong. Please try again.</div>';
  }
}

function saveProfileSettings() {
  const goal = document.getElementById('pf-daily-goal');
  const study = document.getElementById('pf-study-goal');
  const theme = document.getElementById('pf-theme');
  if (goal) localStorage.setItem('vm_daily_goal', goal.value);
  if (study) localStorage.setItem('vm_study_goal', study.value);
  if (theme) setTheme(theme.value);
  toast('Settings saved!', 'success', 2000);
  renderProfile();
}

function renderProfileView() {
  if (!profileData) return;
  const d = profileData;
  const body = document.getElementById('profile-body');
  if (!body) return;
  const s = state.stats || {};
  const showStats = d.stats || Object.keys(s).length > 0;
  const isPremium = d.premium && d.premium.tier && d.premium.tier !== 'Free';

  let premiumRemaining = '';
  if (isPremium && d.premium.expiresAt) {
    const diff = new Date(d.premium.expiresAt) - new Date();
    if (diff > 0) {
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      premiumRemaining = `<div style="font-size:11px;color:var(--ios-orange);margin-top:2px;"><i class="ti ti-clock"></i> ${days}d ${hours}h remaining</div>`;
    }
  }

  const premiumBadge = isPremium ? `
    <div class="profile-achievement-badge" style="background:rgba(255,149,0,0.12);border-color:rgba(255,149,0,0.25);color:var(--ios-orange);">
      <i class="ti ti-crown"></i> ${escHtml(d.premium.tier)}
      ${premiumRemaining}
    </div>
  ` : '';

  const tgBadge = d.telegram ? `
    <div class="profile-achievement-badge" style="background:rgba(88,86,214,0.1);border-color:rgba(88,86,214,0.2);color:#5856D6;">
      <i class="ti ti-send"></i> @${escHtml(d.telegram.username)}
    </div>
  ` : '';

  const ghBadge = d.githubBackup ? `
    <span style="font-size:11px;color:var(--ios-secondary-label);"><i class="ti ti-cloud"></i> Backup: ${new Date(d.githubBackup.savedAt).toLocaleString()}</span>
  ` : '';

  body.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar-section">
        <div class="profile-avatar-preview">${((d.displayName || d.username || '').replace(/^tg_/, '') || 'U')[0].toUpperCase()}</div>
        <div>
          <div style="font-size:22px;font-weight:700;line-height:1.2;color:var(--ios-label)">${escHtml((d.displayName || d.username || '').replace(/^tg_/, ''))}</div>
          <div style="color:var(--ios-secondary-label);font-size:13px;">@${escHtml(d.username.replace(/^tg_/, ''))} · ${escHtml(d.email)}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:6px;flex-wrap:wrap;">
            ${tgBadge}
            ${premiumBadge}
            ${ghBadge}
            <span style="font-size:10px;color:var(--ios-muted)">ID: ${getShortId(d.id)}</span>
          </div>
        </div>
      </div>
    </div>

    ${showStats ? `
    <div class="profile-card">
      <div class="profile-card-title"><i class="ti ti-chart-bar" style="color:#5856D6"></i> Learning Stats</div>
      <div class="profile-stats-grid">
        <div class="profile-stat-card"><i class="ti ti-book profile-stat-icon" style="color:#5856D6"></i><div class="profile-stat-value">${(d.stats?.wordsLearned || s.wordsLearned || 0)}</div><div class="profile-stat-label">Words</div></div>
        <div class="profile-stat-card"><i class="ti ti-star profile-stat-icon" style="color:#FF9500"></i><div class="profile-stat-value">${(d.stats?.totalXP || s.totalXP || 0)}</div><div class="profile-stat-label">XP</div></div>
        <div class="profile-stat-card"><i class="ti ti-flame profile-stat-icon" style="color:#FF3B30"></i><div class="profile-stat-value">${(d.stats?.streak || s.streak || 0)}</div><div class="profile-stat-label">Streak</div></div>
        <div class="profile-stat-card"><i class="ti ti-trophy profile-stat-icon" style="color:#FF9500"></i><div class="profile-stat-value">${(d.stats?.level || s.level || 1)}</div><div class="profile-stat-label">${typeof getLevelTitle === 'function' ? getLevelTitle(d.stats?.level || s.level || 1) : 'Level'}</div></div>
        <div class="profile-stat-card"><i class="ti ti-target profile-stat-icon" style="color:#007AFF"></i><div class="profile-stat-value">${(d.stats?.accuracy || s.accuracy || 0)}%</div><div class="profile-stat-label">Accuracy</div></div>
        <div class="profile-stat-card"><i class="ti ti-cards profile-stat-icon" style="color:#34C759"></i><div class="profile-stat-value">${(d.stats?.cardsReviewed || s.cardsReviewed || 0)}</div><div class="profile-stat-label">Reviewed</div></div>
        <div class="profile-stat-card"><i class="ti ti-clock profile-stat-icon" style="color:#AF52DE"></i><div class="profile-stat-value">${(d.stats?.studyMinutes || s.studyMinutes || 0)}m</div><div class="profile-stat-label">Study</div></div>
        <div class="profile-stat-card"><i class="ti ti-flag profile-stat-icon" style="color:#FF3B30"></i><div class="profile-stat-value">${(d.stats?.totalQuestions || s.totalQuestions || 0)}</div><div class="profile-stat-label">Questions</div></div>
      </div>
    </div>
    ` : ''}

    <div class="profile-card">
      <div class="profile-card-title"><i class="ti ti-user" style="color:#007AFF"></i> About Me</div>
      ${d.bio ? `<div style="color:var(--ios-label);font-size:14px;line-height:1.6;margin-bottom:14px;padding:10px 14px;background:var(--ios-bg);border-radius:var(--radius-ios);">${escHtml(d.bio)}</div>` : `<div style="color:var(--ios-secondary-label);font-size:14px;margin-bottom:14px;font-style:italic;">No bio yet</div>`}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;">
        <div class="profile-info-row"><span class="profile-info-label"><i class="ti ti-map-pin"></i> Location</span><span class="profile-info-value">${d.location || 'Not set'}</span></div>
        <div class="profile-info-row"><span class="profile-info-label"><i class="ti ti-globe"></i> Website</span><span class="profile-info-value">${d.website ? `<a href="${escHtml(d.website)}" target="_blank" style="color:#5856D6;font-weight:600;">Visit →</a>` : 'Not set'}</span></div>
        <div class="profile-info-row"><span class="profile-info-label"><i class="ti ti-language"></i> Native</span><span class="profile-info-value">${d.nativeLanguage || 'Not set'}</span></div>
        <div class="profile-info-row"><span class="profile-info-label"><i class="ti ti-planet"></i> Target</span><span class="profile-info-value">${d.targetLanguage || 'English'}</span></div>
      </div>
    </div>

    <div class="profile-card">
      <div class="profile-card-title"><i class="ti ti-settings" style="color:#5856D6"></i> Preferences</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;">
        <div class="profile-info-row"><span class="profile-info-label"><i class="ti ti-palette"></i> Theme</span><span class="profile-info-value" style="text-transform:capitalize;">${d.theme}</span></div>
        <div class="profile-info-row"><span class="profile-info-label"><i class="ti ti-target"></i> Goal</span><span class="profile-info-value" style="text-transform:capitalize;">${d.studyGoal}</span></div>
        <div class="profile-info-row"><span class="profile-info-label"><i class="ti ti-books"></i> Daily</span><span class="profile-info-value">${d.dailyWordGoal} words</span></div>
        <div class="profile-info-row"><span class="profile-info-label"><i class="ti ti-calendar"></i> Joined</span><span class="profile-info-value">${new Date(d.createdAt).toLocaleDateString()}</span></div>
      </div>
    </div>

    ${d.telegram ? `
    <div class="profile-card">
      <div class="profile-card-title"><i class="ti ti-send" style="color:#5856D6"></i> Telegram</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;">
        <div class="profile-info-row"><span class="profile-info-label">Username</span><span class="profile-info-value">@${escHtml(d.telegram.username)}</span></div>
        <div class="profile-info-row"><span class="profile-info-label">Name</span><span class="profile-info-value">${escHtml(d.telegram.firstName || '')} ${escHtml(d.telegram.lastName || '')}</span></div>
      </div>
    </div>
    ` : ''}

    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button class="ios-btn" onclick="enableProfileEdit()" style="background:linear-gradient(135deg,#5856D6,#007AFF);color:#fff;border:none;flex:1"><i class="ti ti-edit"></i> Edit Profile</button>
      <button class="ios-btn ios-btn-secondary" onclick="showChangePassword()"><i class="ti ti-lock"></i> Password</button>
    </div>
    <div id="profile-password-area" style="display:none;margin-top:16px;"></div>
  `;
}

function enableProfileEdit() {
  if (!profileData) return;
  profileEditing = true;
  const d = profileData;
  const body = document.getElementById('profile-body');
  if (!body) return;

  body.innerHTML = `
    <form onsubmit="saveProfile(event)" style="display:contents;">
    <div class="profile-card">
      <div class="profile-card-title"><i class="ti ti-edit" style="color:#5856D6"></i> Edit Profile</div>

      <div class="profile-avatar-section">
        <div class="profile-avatar-preview">${((d.displayName || d.username || '').replace(/^tg_/, '') || 'U')[0].toUpperCase()}</div>
        <div style="flex:1;">
          <div class="profile-field-group">
            <label class="profile-field-label">Display Name</label>
            <input class="profile-field-input" id="pf-display-name" value="${escHtml(d.displayName || '')}" maxlength="100" placeholder="Your display name">
          </div>
        </div>
      </div>

      <div class="profile-field-group">
        <label class="profile-field-label">Bio</label>
        <textarea class="profile-field-textarea" id="pf-bio" maxlength="500" placeholder="Tell us about yourself...">${escHtml(d.bio || '')}</textarea>
      </div>

      <div class="profile-grid-2">
        <div class="profile-field-group">
          <label class="profile-field-label">Location</label>
          <input class="profile-field-input" id="pf-location" value="${escHtml(d.location || '')}" placeholder="Tashkent, Uzbekistan">
        </div>
        <div class="profile-field-group">
          <label class="profile-field-label">Website</label>
          <input class="profile-field-input" id="pf-website" value="${escHtml(d.website || '')}" placeholder="https://example.com">
        </div>
        <div class="profile-field-group">
          <label class="profile-field-label">Native Language</label>
          <input class="profile-field-input" id="pf-native-lang" value="${escHtml(d.nativeLanguage || '')}" placeholder="Uzbek">
        </div>
        <div class="profile-field-group">
          <label class="profile-field-label">Target Language</label>
          <input class="profile-field-input" id="pf-target-lang" value="${escHtml(d.targetLanguage || 'English')}" placeholder="English">
        </div>
        <div class="profile-field-group">
          <label class="profile-field-label">Daily Word Goal</label>
          <input class="profile-field-input" id="pf-daily-goal" type="number" min="1" max="200" value="${d.dailyWordGoal || 10}">
        </div>
        <div class="profile-field-group">
          <label class="profile-field-label">Study Intensity</label>
          <select class="profile-select" id="pf-study-goal">
            <option value="casual" ${d.studyGoal === 'casual' ? 'selected' : ''}>Casual</option>
            <option value="regular" ${d.studyGoal === 'regular' ? 'selected' : ''}>Regular</option>
            <option value="intensive" ${d.studyGoal === 'intensive' ? 'selected' : ''}>Intensive</option>
            <option value="hardcore" ${d.studyGoal === 'hardcore' ? 'selected' : ''}>Hardcore</option>
          </select>
        </div>
      </div>
    </div>

    <div class="profile-card">
      <div class="profile-card-title"><i class="ti ti-settings" style="color:#5856D6"></i> Preferences</div>
      <div class="profile-grid-2">
        <div class="profile-field-group">
          <label class="profile-field-label">Theme</label>
          <select class="profile-select" id="pf-theme">
            <option value="dark" ${d.theme === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="light" ${d.theme === 'light' ? 'selected' : ''}>Light</option>
            <option value="auto" ${d.theme === 'auto' ? 'selected' : ''}>Auto</option>
          </select>
        </div>
        <div class="profile-field-group">
          <label class="profile-field-label">Notifications</label>
          <div style="display:flex;flex-direction:column;gap:6px;padding-top:2px;">
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;color:var(--ios-label)"><input type="checkbox" id="pf-notif-email" ${d.notifications?.email !== false ? 'checked' : ''}> Email</label>
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;color:var(--ios-label)"><input type="checkbox" id="pf-notif-streak" ${d.notifications?.streak_reminder !== false ? 'checked' : ''}> Streak reminders</label>
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;color:var(--ios-label)"><input type="checkbox" id="pf-notif-achievement" ${d.notifications?.achievement !== false ? 'checked' : ''}> Achievement alerts</label>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-btn-row">
      <button type="submit" class="ios-btn" style="background:linear-gradient(135deg,#5856D6,#007AFF);color:#fff;border:none"><i class="ti ti-device-floppy"></i> Save Changes</button>
      <button type="button" class="ios-btn ios-btn-secondary" onclick="renderProfileView()">Cancel</button>
    </div>
    <div id="profile-save-status" style="margin-top:12px;font-size:14px;"></div>
    </form>
  `;
}

function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
function checked(id) { var el = document.getElementById(id); return el ? el.checked : false; }

async function saveProfile(e) {
  e.preventDefault();
  var status = document.getElementById('profile-save-status');
  if (!status) return;
  status.style.color = 'var(--ios-secondary-label)';
  status.textContent = 'Saving...';

  var data = {
    displayName: val('pf-display-name').trim(),
    bio: val('pf-bio').trim(),
    location: val('pf-location').trim(),
    website: val('pf-website').trim(),
    nativeLanguage: val('pf-native-lang').trim(),
    targetLanguage: val('pf-target-lang').trim(),
    dailyWordGoal: parseInt(val('pf-daily-goal')) || 10,
    studyGoal: val('pf-study-goal'),
    theme: val('pf-theme'),
    notifications: {
      email: checked('pf-notif-email'),
      streak_reminder: checked('pf-notif-streak'),
      achievement: checked('pf-notif-achievement'),
    },
  };

  try {
    var result = await SECURE_API.updateProfile(data);
    if (result && result.success !== false) {
      status.style.color = '#34C759';
      status.textContent = 'Profile saved successfully!';
      if (data.displayName) {
        state.authUser = state.authUser || {};
        state.authUser.username = data.displayName;
        try { sessionStorage.setItem('vm_secure_user', JSON.stringify(state.authUser)); } catch (_) {}
        updateAuthUI();
      }
      if (profileData) {
        for (var _k in data) { if (data.hasOwnProperty(_k)) profileData[_k] = data[_k]; }
      }
      cacheProfileData(profileData);
      setTimeout(function() { renderProfileView(); }, 1000);
    } else {
      throw new Error((result && result.error) || 'Failed to save');
    }
  } catch (err) {
    status.style.color = '#FF3B30';
    status.textContent = 'Error: ' + err.message;
  }
}

function showChangePassword() {
  const area = document.getElementById('profile-password-area');
  if (!area) return;
  if (area.style.display === 'block') { area.style.display = 'none'; return; }
  area.style.display = 'block';
  area.innerHTML = `
    <div class="profile-card">
      <div class="profile-card-title"><i class="ti ti-lock" style="color:#5856D6"></i> Change Password</div>
      <form onsubmit="changePasswordSubmit(event)" style="display:contents;">
        <div class="profile-field-group">
          <label class="profile-field-label">Current Password</label>
          <input class="profile-field-input" type="password" id="pf-current-pw" required>
        </div>
        <div class="profile-field-group">
          <label class="profile-field-label">New Password</label>
          <input class="profile-field-input" type="password" id="pf-new-pw" required minlength="8" placeholder="Min 8 chars, uppercase, number, special">
        </div>
        <div class="profile-field-group">
          <label class="profile-field-label">Confirm New Password</label>
          <input class="profile-field-input" type="password" id="pf-confirm-pw" required>
        </div>
        <div class="profile-btn-row">
          <button type="submit" class="ios-btn" style="background:linear-gradient(135deg,#5856D6,#007AFF);color:#fff;border:none"><i class="ti ti-lock"></i> Update Password</button>
          <button type="button" class="ios-btn ios-btn-secondary" onclick="document.getElementById('profile-password-area').style.display='none'">Cancel</button>
        </div>
        <div id="pf-pw-status" style="margin-top:12px;font-size:14px;"></div>
      </form>
    </div>
  `;
}

async function changePasswordSubmit(e) {
  e.preventDefault();
  const current = document.getElementById('pf-current-pw').value;
  const newPw = document.getElementById('pf-new-pw').value;
  const confirm = document.getElementById('pf-confirm-pw').value;
  const status = document.getElementById('pf-pw-status');
  if (!status) return;

  if (newPw !== confirm) {
    status.style.color = '#FF3B30';
    status.textContent = 'Passwords do not match';
    return;
  }

  status.style.color = 'var(--ios-secondary-label)';
  status.textContent = 'Updating password...';

  try {
    const result = await SECURE_API.changePassword(current, newPw);
    if (result && result.success !== false) {
      status.style.color = '#34C759';
      status.textContent = 'Password changed! You will be logged out.';
      setTimeout(async () => {
        await handleLogout();
        renderProfile();
      }, 1500);
    } else {
      throw new Error(result?.error || 'Failed to change password');
    }
  } catch (err) {
    status.style.color = '#FF3B30';
    status.textContent = 'Error: ' + err.message;
  }
}
