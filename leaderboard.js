var _lbUsers = [];
var _lbState = { period: 'all', search: '', page: 1, loading: false, hasMore: true, total: 0, myRank: -1 };
var _lbRefreshTimer = null;

function updateTopbarRank() {
  var rankEl = document.getElementById('rank-display');
  var badgeEl = document.getElementById('rank-badge');
  if (!rankEl) return;
  var s = state.stats;
  rankEl.textContent = _lbState.myRank > 0 ? _lbState.myRank : '1';
  if (badgeEl) badgeEl.title = '#' + (_lbState.myRank > 0 ? _lbState.myRank : '1') + ' · ' + (s.totalXP || 0) + ' XP · Level ' + (s.level || 1);
}

// === USER POPUP ===
function showUserPopup(userId) {
  var overlay = document.getElementById('user-popup-overlay');
  if (!overlay) return;
  var u = null;
  for (var i = 0; i < _lbUsers.length; i++) {
    if (_lbUsers[i].id === userId) { u = _lbUsers[i]; break; }
  }
  if (!u) return;
  var bodyEl = document.getElementById('user-popup-body');
  var initial = u.name ? u.name[0].toUpperCase() : '?';
  bodyEl.innerHTML = '<div class="up-spinner" style="text-align:center;padding:40px;color:var(--text2)">Loading...</div>';
  overlay.classList.add('active');

  var baseUrl = typeof SECURE_API !== 'undefined' && SECURE_API.getBaseUrl ? SECURE_API.getBaseUrl() : '';
  fetch(baseUrl + '/api/leaderboard/user/' + userId, { credentials: 'include' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data) {
        bodyEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">Failed to load user details</div>';
        return;
      }
      var bio = data.bio || 'No bio yet';
      var accuracy = data.accuracy || 0;
      var joined = data.joinedAt ? new Date(data.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown';
      bodyEl.innerHTML =
        '<div class="up-header">' +
          '<div class="up-avatar" style="background:linear-gradient(135deg, var(--lb-blue, #5856D6), var(--lb-blue-dark, #007AFF))">' + initial + '</div>' +
          '<div class="up-name-block">' +
            '<div class="up-name">' + escHtml((data.displayName || data.username || 'User').replace(/^tg_/, '')) + '</div>' +
            '<div class="up-detail-row"><i class="ti ti-map-pin" style="font-size:12px"></i> ' + escHtml(data.location || 'Unknown') + ' · <i class="ti ti-language" style="font-size:12px"></i> ' + escHtml(data.nativeLanguage || '?') + ' → ' + escHtml(data.targetLanguage || 'English') + '</div>' +
            '<div class="up-detail-row"><i class="ti ti-calendar" style="font-size:12px"></i> Joined ' + joined + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="up-bio">' + escHtml(bio) + '</div>' +
        '<div class="up-stats-grid">' +
          '<div class="up-stat-item"><span class="uss-icon"><i class="ti ti-bolt"></i></span><span class="uss-val">' + (data.totalXP || 0).toLocaleString() + '</span><span class="uss-lbl">XP</span></div>' +
          '<div class="up-stat-item"><span class="uss-icon"><i class="ti ti-trophy"></i></span><span class="uss-val">' + (data.achievements || 0) + '</span><span class="uss-lbl">Awards</span></div>' +
          '<div class="up-stat-item"><span class="uss-icon"><i class="ti ti-book"></i></span><span class="uss-val">' + (data.wordsLearned || 0) + '</span><span class="uss-lbl">Words</span></div>' +
          '<div class="up-stat-item"><span class="uss-icon"><i class="ti ti-target"></i></span><span class="uss-val">' + accuracy + '%</span><span class="uss-lbl">Accuracy</span></div>' +
          '<div class="up-stat-item"><span class="uss-icon"><i class="ti ti-flame"></i></span><span class="uss-val">' + (data.streak || 0) + '</span><span class="uss-lbl">Streak</span></div>' +
          '<div class="up-stat-item"><span class="uss-icon"><i class="ti ti-clock"></i></span><span class="uss-val">' + (data.studyMinutes || 0) + 'm</span><span class="uss-lbl">Study</span></div>' +
        '</div>';
    })
    .catch(function () {
      bodyEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text2)">Failed to load user details</div>';
    });
}

function closeUserPopup() {
  var overlay = document.getElementById('user-popup-overlay');
  if (overlay) overlay.classList.remove('active');
}

// === PERIOD TAB ===
function switchPeriod(period) {
  if (_lbState.loading || _lbState.period === period) return;
  _lbState.period = period;
  _lbState.page = 1;
  _lbState.users = [];
  _lbState.hasMore = true;
  document.querySelectorAll('.lb-tab').forEach(function (t) { t.classList.toggle('active', t.dataset.period === period); });
  renderLeaderboardModule();
}

// === SEARCH ===
var _lbSearchTimer = null;
function onLBSearch() {
  clearTimeout(_lbSearchTimer);
  _lbSearchTimer = setTimeout(function () {
    var q = (document.getElementById('lb-search-input')?.value || '').trim();
    if (q === _lbState.search) return;
    _lbState.search = q;
    _lbState.page = 1;
    _lbState.hasMore = true;
    renderLeaderboardModule();
  }, 300);
}

// === LOAD MORE ===
function loadMore() {
  if (_lbState.loading || !_lbState.hasMore) return;
  _lbState.page++;
  renderLeaderboardModule(true);
}

// === SKELETON ===
function renderSkeleton() {
  var el = document.getElementById('leaderboard-list');
  if (!el) return;
  el.innerHTML =
    '<div class="lb-loading">' +
      '<div class="lb-spinner"><div class="lb-spinner-blade lb-sb1"></div><div class="lb-spinner-blade lb-sb2"></div><div class="lb-spinner-blade lb-sb3"></div><div class="lb-spinner-blade lb-sb4"></div><div class="lb-spinner-blade lb-sb5"></div><div class="lb-spinner-blade lb-sb6"></div><div class="lb-spinner-blade lb-sb7"></div><div class="lb-spinner-blade lb-sb8"></div><div class="lb-spinner-blade lb-sb9"></div><div class="lb-spinner-blade lb-sb10"></div><div class="lb-spinner-blade lb-sb11"></div><div class="lb-spinner-blade lb-sb12"></div></div>' +
      '<div class="lb-loading-text">Yuklanmoqda</div>' +
    '</div>';
}

// === MAIN RENDER ===
async function renderLeaderboardModule(isAppend) {
  updateTopbarRank();
  var el = document.getElementById('leaderboard-list');
  var s = state.stats;
  if (!el) return;
  if (!isAppend) {
    renderSkeleton();
    _lbUsers = [];
  }

  _lbState.loading = true;
  var loadMoreBtn = document.getElementById('lb-load-more');
  if (loadMoreBtn) loadMoreBtn.style.display = 'none';

  try {
    var baseUrl = SECURE_API && SECURE_API.getBaseUrl ? SECURE_API.getBaseUrl() : '';
    var url = baseUrl + '/api/leaderboard?period=' + encodeURIComponent(_lbState.period) + '&page=' + _lbState.page + '&limit=30';
    if (_lbState.search) url += '&search=' + encodeURIComponent(_lbState.search);
    var res = await fetch(url, { credentials: 'include' });
    var data = res.ok ? await res.json() : null;

    if (!data || !data.users) {
      if (!isAppend) renderOffline(el, s);
      _lbState.loading = false;
      return;
    }

    _lbState.total = data.total;
    _lbState.hasMore = data.page < data.totalPages;

    var currentUserId = state.authUser?.id;
    var isPeriod = _lbState.period !== 'all';
    var mapped = data.users.map(function (u) {
      var displayXp = isPeriod ? (u.periodXp != null ? u.periodXp : 0) : (u.totalXp || 0);
      return {
        name: (u.displayName || u.username || '').replace(/^tg_/, ''),
        xp: displayXp,
        totalXp: u.totalXp || 0,
        level: u.level || 1,
        achievements: u.achievementCount || 0,
        words: u.wordsLearned || 0,
        streak: u.streak || 0,
        id: u.id,
        isMe: currentUserId && (u.id === currentUserId),
        prevPeriodXp: u.prevPeriodXp || 0,
      };
    });

    if (isAppend) {
      _lbUsers = _lbUsers.concat(mapped);
    } else {
      _lbUsers = mapped;
    }

    // Find my rank
    _lbState.myRank = -1;
    for (var i = 0; i < _lbUsers.length; i++) {
      if (_lbUsers[i].isMe) { _lbState.myRank = (data.page - 1) * 30 + i + 1; break; }
    }

    if (!isAppend) {
      renderFullLeaderboard(el, data, s);
    } else {
      appendRows(el, mapped, data);
    }
  } catch (e) {
    if (!isAppend) renderOffline(el, s);
  }
  _lbState.loading = false;
}

function renderOffline(el, s) {
  var myName = (state.authUser?.displayName || state.authUser?.username || localStorage.getItem('vm_username') || 'Learner').replace(/^tg_/, '');
  var isPeriod = _lbState.period !== 'all';
  var displayXp = isPeriod ? 0 : (s.totalXP || 0);
  _lbUsers = [{ name: myName, xp: displayXp, totalXp: s.totalXP || 0, level: s.level || 1, achievements: (s.achievements || []).length, words: s.wordsLearned || 0, isMe: true, id: null }];
  renderFullLeaderboard(el, { users: [{ total_xp: s.totalXP || 0 }], period: 'all', total: 1, page: 1, totalPages: 1 }, s);
}

function renderFullLeaderboard(el, data, s) {
  var maxXp = Math.max.apply(null, _lbUsers.map(function (u) { return u.xp; }).concat([1]));
  var isPeriod = _lbState.period !== 'all';
  var periodLabel = _lbState.period === 'weekly' ? 'Week' : _lbState.period === 'monthly' ? 'Month' : '';

  var listHtml = _lbUsers.map(function (u, i) {
    var pct = Math.min(100, (u.xp / maxXp) * 100);
    var rankCls = i < 3 ? ['gold', 'silver', 'bronze'][i] : '';
    var rowRankCls = i < 3 ? ['lb-gold-row', 'lb-silver-row', 'lb-bronze-row'][i] : '';
    var rankIcon = i === 0 ? '<i class="ti ti-crown"></i>' : i === 1 ? '<i class="ti ti-medal-2"></i>' : i === 2 ? '<i class="ti ti-medal"></i>' : '<span class="lb-rank-num">' + (_lbState.page > 1 ? (_lbState.page - 1) * 30 + i + 1 : i + 1) + '</span>';
    var meCls = u.isMe ? 'lb-me' : '';

    // Rank change indicator (only for non-all periods)
    var changeHtml = '';
    if (isPeriod && u.prevPeriodXp !== undefined) {
      if (u.xp > u.prevPeriodXp) changeHtml = '<span class="lb-change up" title="Up from last ' + periodLabel.toLowerCase() + '"><i class="ti ti-arrow-up"></i></span>';
      else if (u.xp < u.prevPeriodXp) changeHtml = '<span class="lb-change down" title="Down from last ' + periodLabel.toLowerCase() + '"><i class="ti ti-arrow-down"></i></span>';
      else if (u.xp === 0 && u.prevPeriodXp === 0) changeHtml = '';
      else changeHtml = '<span class="lb-change same" title="Same as last ' + periodLabel.toLowerCase() + '"><i class="ti ti-minus"></i></span>';
    }

    return '<div class="lb-row ' + meCls + ' ' + rowRankCls + '" data-user-id="' + (u.id || '') + '" ' + (u.id ? 'onclick="showUserPopup(\'' + u.id + '\')"' : '') + ' ' + (u.isMe ? 'id="lb-my-row"' : '') + ' style="animation-delay:' + (i * 0.03) + 's">' +
      '<div class="lb-rank ' + rankCls + '">' + rankIcon + '</div>' +
      '<div class="lb-avatar" style="background:' + (u.isMe ? 'var(--lb-blue, #5856D6)' : 'linear-gradient(135deg, var(--lb-blue, #5856D6), var(--lb-blue-dark, #007AFF))') + '">' + u.name[0].toUpperCase() + '</div>' +
      '<div class="lb-info">' +
        '<div class="lb-name-row"><span class="lb-name">' + u.name + '</span>' + changeHtml + (u.isMe ? '<span class="lb-badge">YOU</span>' : '') + '</div>' +
        '<div class="lb-bar-wrap"><span class="lb-bar" style="width:' + pct + '%"></span></div>' +
      '</div>' +
      '<div class="lb-cell lvl"><span class="lv">Lv.' + u.level + '</span></div>' +
      (isPeriod ? '<div class="lb-cell xp"><span class="xv">' + u.xp.toLocaleString() + '</span><span class="xb-sm">' + periodLabel + '</span></div>' : '<div class="lb-cell xp"><span class="xv">' + u.xp.toLocaleString() + '</span><span class="xb-sm">Total</span></div>') +
      '<div class="lb-cell ach"><span class="av"><i class="ti ti-trophy" style="font-size:11px"></i> ' + u.achievements + '</span></div>' +
    '</div>';
  }).join('');

  fetchStats();
  function fetchStats() {
    var baseUrl = SECURE_API && SECURE_API.getBaseUrl ? SECURE_API.getBaseUrl() : '';
    fetch(baseUrl + '/api/leaderboard/stats', { credentials: 'include' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d) {
          var statsEl = document.getElementById('lb-total-stats');
          if (statsEl) statsEl.innerHTML = '<span><i class="ti ti-circle-filled" style="color:#34C759;font-size:8px;vertical-align:middle"></i> ' + d.onlineNow + ' online</span> · <span><i class="ti ti-users" style="font-size:12px;vertical-align:middle"></i> ' + d.totalUsers + ' total</span>';
        }
      })
      .catch(function () {});
  }

  var loadMoreHtml = _lbState.hasMore ? '<button class="lb-load-more" id="lb-load-more" onclick="loadMore()"><i class="ti ti-chevrons-down" style="font-size:12px"></i> Show More (' + (_lbState.total - _lbUsers.length) + ' left)</button>' : '';

  var emptyHtml = _lbUsers.length === 0
    ? '<div class="lb-empty"><div class="lb-empty-icon"><i class="ti ti-search"></i></div><div class="lb-empty-text">No learners found' + (_lbState.search ? ' matching "' + escHtml(_lbState.search) + '"' : '') + '</div></div>'
    : '';

  el.innerHTML =
    '<div class="lb-hero">' +
      '<div class="lb-hero-inner">' +
        '<div class="lb-hero-top">' +
          '<div class="lb-hero-icon"><i class="ti ti-trophy"></i></div>' +
          '<div>' +
            '<div class="lb-hero-title">Leaderboard</div>' +
            '<div class="lb-hero-sub">' + (_lbState.period === 'weekly' ? 'This week\'s top learners' : _lbState.period === 'monthly' ? 'This month\'s top learners' : 'All-time top learners') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="lb-hero-stats">' +
          '<div class="lb-hero-stat"><span class="lbs-val">' + (s.level || 1) + '</span><span class="lbs-lbl">Level</span></div>' +
          '<div class="lb-hero-stat"><span class="lbs-val">' + (s.totalXP || 0).toLocaleString() + '</span><span class="lbs-lbl">XP</span></div>' +
          '<div class="lb-hero-stat"><span class="lbs-val">' + ((s.achievements || []).length) + '</span><span class="lbs-lbl">Awards</span></div>' +
          '<div class="lb-hero-stat"><span class="lbs-val lb-my-rank">#' + (_lbState.myRank > 0 ? _lbState.myRank : '—') + '</span><span class="lbs-lbl">Rank</span></div>' +
        '</div>' +
        '<div class="lb-hero-footer" id="lb-total-stats"><span>Loading stats...</span></div>' +
      '</div>' +
    '</div>' +
    '<div class="lb-controls">' +
      '<div class="lb-tabs">' +
        '<button class="lb-tab ' + (_lbState.period === 'all' ? 'active' : '') + '" data-period="all" onclick="switchPeriod(\'all\')"><i class="ti ti-infinity" style="font-size:12px"></i> All Time</button>' +
        '<button class="lb-tab ' + (_lbState.period === 'weekly' ? 'active' : '') + '" data-period="weekly" onclick="switchPeriod(\'weekly\')"><i class="ti ti-calendar-week" style="font-size:12px"></i> Weekly</button>' +
        '<button class="lb-tab ' + (_lbState.period === 'monthly' ? 'active' : '') + '" data-period="monthly" onclick="switchPeriod(\'monthly\')"><i class="ti ti-calendar-month" style="font-size:12px"></i> Monthly</button>' +
      '</div>' +
      '<div class="lb-search-wrap">' +
        '<input class="lb-search" id="lb-search-input" type="text" placeholder="Search learners..." value="' + escHtml(_lbState.search) + '" oninput="onLBSearch()">' +
        (_lbState.search ? '<button class="lb-search-clear" onclick="document.getElementById(\'lb-search-input\').value=\'\';_lbState.search=\'\';_lbState.page=1;renderLeaderboardModule()"><i class="ti ti-x"></i></button>' : '') +
      '</div>' +
    '</div>' +
    '<div class="lb-list">' + listHtml + '</div>' +
    emptyHtml +
    loadMoreHtml;

  updateTopbarRank();

  setTimeout(function () {
    var myRow = document.getElementById('lb-my-row');
    if (myRow) myRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 150);

  // Auto-refresh every 30 seconds
  if (_lbRefreshTimer) clearInterval(_lbRefreshTimer);
  _lbRefreshTimer = setInterval(function () {
    if (document.getElementById('page-leaderboard')?.classList.contains('active')) {
      renderLeaderboardModule();
    }
  }, 30000);
}

function appendRows(el, newUsers, data) {
  var listEl = el.querySelector('.lb-list');
  var loadMoreBtn = document.getElementById('lb-load-more');
  var maxXp = Math.max.apply(null, _lbUsers.map(function (u) { return u.xp; }).concat([1]));
  var isPeriod = _lbState.period !== 'all';
  var periodLabel = _lbState.period === 'weekly' ? 'Week' : _lbState.period === 'monthly' ? 'Month' : '';
  var offset = _lbUsers.length - newUsers.length;

  var html = newUsers.map(function (u, i) {
    var idx = offset + i;
    var pct = Math.min(100, (u.xp / maxXp) * 100);
    var rankCls = idx < 3 ? ['gold', 'silver', 'bronze'][idx] : '';
    var rowRankCls = idx < 3 ? ['lb-gold-row', 'lb-silver-row', 'lb-bronze-row'][idx] : '';
    var rankIcon = idx === 0 ? '<i class="ti ti-crown"></i>' : idx === 1 ? '<i class="ti ti-medal-2"></i>' : idx === 2 ? '<i class="ti ti-medal"></i>' : '<span class="lb-rank-num">' + (idx + 1) + '</span>';
    var meCls = u.isMe ? 'lb-me' : '';
    var changeHtml = '';
    if (isPeriod && u.prevPeriodXp !== undefined) {
      if (u.xp > u.prevPeriodXp) changeHtml = '<span class="lb-change up" title="Up from last ' + periodLabel.toLowerCase() + '"><i class="ti ti-arrow-up"></i></span>';
      else if (u.xp < u.prevPeriodXp) changeHtml = '<span class="lb-change down" title="Down from last ' + periodLabel.toLowerCase() + '"><i class="ti ti-arrow-down"></i></span>';
      else if (u.xp > 0 || u.prevPeriodXp > 0) changeHtml = '<span class="lb-change same" title="Same as last ' + periodLabel.toLowerCase() + '"><i class="ti ti-minus"></i></span>';
    }
    return '<div class="lb-row ' + meCls + ' ' + rowRankCls + ' lb-row-new" data-user-id="' + (u.id || '') + '" ' + (u.id ? 'onclick="showUserPopup(\'' + u.id + '\')"' : '') + ' style="animation-delay:' + (i * 0.03) + 's">' +
      '<div class="lb-rank ' + rankCls + '">' + rankIcon + '</div>' +
      '<div class="lb-avatar" style="background:' + (u.isMe ? 'var(--lb-blue, #5856D6)' : 'linear-gradient(135deg, var(--lb-blue, #5856D6), var(--lb-blue-dark, #007AFF))') + '">' + u.name[0].toUpperCase() + '</div>' +
      '<div class="lb-info">' +
        '<div class="lb-name-row"><span class="lb-name">' + u.name + '</span>' + changeHtml + (u.isMe ? '<span class="lb-badge">YOU</span>' : '') + '</div>' +
        '<div class="lb-bar-wrap"><span class="lb-bar" style="width:' + pct + '%"></span></div>' +
      '</div>' +
      '<div class="lb-cell lvl"><span class="lv">Lv.' + u.level + '</span></div>' +
      (isPeriod ? '<div class="lb-cell xp"><span class="xv">' + u.xp.toLocaleString() + '</span><span class="xb-sm">' + periodLabel + '</span></div>' : '<div class="lb-cell xp"><span class="xv">' + u.xp.toLocaleString() + '</span><span class="xb-sm">Total</span></div>') +
      '<div class="lb-cell ach"><span class="av"><i class="ti ti-trophy" style="font-size:11px"></i> ' + u.achievements + '</span></div>' +
    '</div>';
  }).join('');

  if (listEl) listEl.insertAdjacentHTML('beforeend', html);
  if (loadMoreBtn) {
    var remaining = _lbState.total - _lbUsers.length;
    if (remaining > 0) {
      loadMoreBtn.textContent = 'Show More (' + remaining + ' left)';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }
}
