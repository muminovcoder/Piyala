// =============================================
// Piyala — Activity Heatmap Module
// Standalone: renderHeatmap, setHeatmapDays,
// setBigHeatmapDays, tooltip, event listeners
// =============================================

let hmTooltip = null;

function getHmTooltip() {
  if (!hmTooltip) {
    hmTooltip = document.createElement('div');
    hmTooltip.className = 'hm-tooltip';
    document.body.appendChild(hmTooltip);
  }
  return hmTooltip;
}

function renderHeatmap(id, days) {
  const el = document.getElementById(id);
  if (!el) return;
  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];

  const cells = [];
  let totalWords = 0, activeDays = 0;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const count = state.stats.heatmap[key] || 0;
    if (count > 0) activeDays++;
    totalWords += count;
    cells.push({ date:key, day:d, count, level:count===0?0:count<3?1:count<7?2:count<14?3:4 });
  }

  let streak = 0;
  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i].count > 0) streak++;
    else break;
  }
  let best = 0, cur = 0;
  for (const c of cells) {
    if (c.count > 0) { cur++; if (cur > best) best = cur; }
    else cur = 0;
  }

  const weeks = [];
  let week = [];
  const firstDate = cells[0].day;
  const startDow = firstDate.getDay();
  for (let p = 0; p < startDow; p++) week.push(null);
  for (const c of cells) {
    week.push(c);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) weeks.push(week);

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let monthHTML = '<div class="hm-months" style="grid-template-columns:' + weeks.map(() => '1fr').join(' ') + '">';
  let lastM = -1;
  for (let wi = 0; wi < weeks.length; wi++) {
    const w = weeks[wi];
    const firstReal = w.find(c => c !== null);
    const m = firstReal ? firstReal.day.getMonth() : -1;
    if (m !== lastM) {
      monthHTML += `<span>${m >= 0 ? monthNames[m] : ''}</span>`;
      lastM = m;
    } else {
      monthHTML += '<span></span>';
    }
  }
  monthHTML += '</div>';

  const dayNames = ['','Mon','','Wed','','Fri',''];
  const cellW = days > 100 ? 10 : days > 50 ? 12 : 14;
  const cellGap = days > 100 ? 2 : 3;

  let gridHTML = `<div class="hm-grid" style="grid-template-columns:repeat(${weeks.length},1fr);grid-template-rows:repeat(7,${cellW}px);gap:${cellGap}px">`;
  for (let row = 0; row < 7; row++) {
    for (let wi = 0; wi < weeks.length; wi++) {
      const w = weeks[wi];
      const c = row < w.length ? w[row] : null;
      if (c) {
        const isToday = c.date === todayKey;
        gridHTML += `<div class="hm-cell${isToday?' today':''}" data-lvl="${c.level}" data-date="${c.date}" data-count="${c.count}" style="width:${cellW}px;height:${cellW}px"></div>`;
      } else {
        gridHTML += `<div style="width:${cellW}px;height:${cellW}px"></div>`;
      }
    }
  }
  gridHTML += '</div>';

  const hasActivity = activeDays > 0;
  const fire = streak >= 30 ? '🔥' : streak >= 14 ? '🔥' : streak >= 7 ? '🔥' : streak >= 3 ? '🔥' : '🔥';

  el.innerHTML = `
    <div class="hm-wrap">
      <div class="hm-header">
        <div class="hm-header-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Activity
        </div>
        <div class="hm-header-label">
          <span>${days}d overview</span>
          ${streak > 0 ? `<span style="color:#fbbf24;font-weight:700">${fire} ${streak}-day streak</span>` : ''}
        </div>
      </div>
      <div class="hm-table">
        <div class="hm-col-head">
          ${dayNames.map(d => `<span>${d}</span>`).join('')}
        </div>
        <div>
          ${monthHTML}
          ${hasActivity ? gridHTML : `<div class="hm-empty"><div class="hm-empty-icon">📊</div><div class="hm-empty-text">No activity yet</div><div class="hm-empty-sub">Start learning words to build your streak!</div></div>`}
        </div>
      </div>
      <div class="hm-stats">
        <div class="hm-stat">
          <span class="hm-stat-icon">📝</span>
          <div><div class="hm-stat-val">${totalWords}</div><div class="hm-stat-label">Words</div></div>
        </div>
        <div class="hm-stat">
          <span class="hm-stat-icon">📅</span>
          <div><div class="hm-stat-val">${activeDays}</div><div class="hm-stat-label">Active days</div></div>
        </div>
        <div class="hm-stat">
          <span class="hm-stat-icon">📊</span>
          <div><div class="hm-stat-val">${activeDays > 0 ? Math.round(totalWords / activeDays) : 0}</div><div class="hm-stat-label">Avg/day</div></div>
        </div>
        <div class="hm-stat">
          <span class="hm-stat-icon">🏆</span>
          <div><div class="hm-stat-val">${best}</div><div class="hm-stat-label">Best streak</div></div>
        </div>
        <div style="margin-left:auto">
          <div class="hm-legend">
            <span class="hm-legend-label">Less</span>
            <div class="hm-legend-bar">
              <div class="hm-legend-cell" data-lvl="0"></div>
              <div class="hm-legend-cell" data-lvl="1"></div>
              <div class="hm-legend-cell" data-lvl="2"></div>
              <div class="hm-legend-cell" data-lvl="3"></div>
              <div class="hm-legend-cell" data-lvl="4"></div>
            </div>
            <span class="hm-legend-label">More</span>
          </div>
        </div>
      </div>
    </div>`;

  // Staggered pop animation
  const allCells = el.querySelectorAll('.hm-cell');
  allCells.forEach((cell, i) => {
    if (parseInt(cell.dataset.count) > 0) {
      const delay = Math.min(i * 3, 600);
      cell.style.animationDelay = delay + 'ms';
      cell.classList.add('animate');
    }
  });

  // Tooltip
  const tooltip = getHmTooltip();
  el.querySelectorAll('.hm-cell').forEach(cell => {
    cell.addEventListener('mouseenter', e => {
      const date = cell.dataset.date;
      const count = parseInt(cell.dataset.count);
      const d = new Date(date + 'T12:00:00');
      const diffDays = Math.round((today - d) / 86400000);
      let relDate = '';
      if (diffDays === 0) relDate = 'Today';
      else if (diffDays === 1) relDate = 'Yesterday';
      else if (diffDays < 7) relDate = `${diffDays} days ago`;
      else if (diffDays < 30) relDate = `${Math.floor(diffDays / 7)}w ago`;
      else relDate = d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
      const options = { weekday:'short', year:'numeric', month:'short', day:'numeric' };
      tooltip.innerHTML = `
        <div class="hm-tooltip-date">${d.toLocaleDateString('en-US', options)} <span style="font-weight:400;color:var(--text3);font-size:11px">${relDate}</span></div>
        <div class="hm-tooltip-count"><strong>${count}</strong> ${count === 1 ? 'word' : 'words'}</div>
      `;
      tooltip.classList.add('show');
    });
    cell.addEventListener('mousemove', e => {
      let x = e.clientX + 16, y = e.clientY - 12;
      const r = tooltip.getBoundingClientRect();
      if (x + r.width > window.innerWidth - 8) x = e.clientX - r.width - 16;
      if (y + r.height > window.innerHeight - 8) y = e.clientY - r.height - 12;
      if (y < 4) y = e.clientY + 20;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    });
    cell.addEventListener('mouseleave', () => { tooltip.classList.remove('show'); });
  });
}

function setHeatmapDays(days) {
  state.heatmapDays = days;
  document.querySelectorAll('#page-dashboard .hm-range-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.hmDays) === days);
  });
  renderHeatmap('heatmap', days);
}

function setBigHeatmapDays(days) {
  state.heatmapDays = days;
  localStorage.setItem('vm_heatmapDays', days);
  document.querySelectorAll('#page-progress .hm-range-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.hmDays) === days);
  });
  renderHeatmap('big-heatmap', days);
}

function initHeatmapListeners() {
  document.querySelectorAll('#page-dashboard .hm-range-btn').forEach(btn => {
    btn.addEventListener('click', () => setHeatmapDays(parseInt(btn.dataset.hmDays)));
  });
  document.querySelectorAll('#page-progress .hm-range-btn').forEach(btn => {
    btn.addEventListener('click', () => setBigHeatmapDays(parseInt(btn.dataset.hmDays)));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeatmapListeners);
} else {
  initHeatmapListeners();
}
