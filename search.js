// =============================================
// ADVANCED SEARCH
// =============================================
let searchDebounce = null;

async function initSearchPage() {
  if (typeof requirePremium === 'function' && !(await requirePremium('Advanced Search'))) return;
  const input = document.getElementById('page-search-input');
  if (!input) return;
  input.removeEventListener('keydown', initSearchPage._keydown);
  input.addEventListener('keydown', initSearchPage._keydown = e => { if (e.key === 'Enter') runPageSearch(); });
  input.addEventListener('input', () => {
    const btn = document.getElementById('search-clear-btn');
    if (btn) btn.style.display = input.value ? 'flex' : 'none';
  });
  renderSearchHistory();
}

function clearPageSearch() {
  const input = document.getElementById('page-search-input');
  if (input) input.value = '';
  const btn = document.getElementById('search-clear-btn');
  if (btn) btn.style.display = 'none';
  const container = document.getElementById('page-search-results');
  if (container) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">Search for Words</div>
        <div class="empty-desc">Enter a word, concept, or topic to explore related vocabulary</div>
      </div>`;
  }
}

function getSearchHistory() {
  try { return JSON.parse(localStorage.getItem('vm_search_history') || '[]'); } catch { return []; }
}

function addSearchHistory(q) {
  let h = getSearchHistory().filter(s => s !== q);
  h.unshift(q);
  if (h.length > 8) h = h.slice(0, 8);
  localStorage.setItem('vm_search_history', JSON.stringify(h));
  renderSearchHistory();
}

function clearSearchHistory() {
  localStorage.removeItem('vm_search_history');
  renderSearchHistory();
}

function renderSearchHistory() {
  const h = getSearchHistory();
  const container = document.getElementById('search-recent');
  const list = document.getElementById('search-recent-list');
  if (!container || !list) return;
  if (!h.length) { container.style.display = 'none'; return; }
  container.style.display = 'block';
  list.innerHTML = h.map(q =>
    `<span class="srch-tag" onclick="document.getElementById('page-search-input').value='${q.replace(/'/g,"\\'")}';runPageSearch()">${q}</span>`
  ).join('');
}

function setSearchFilter(el) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  state.searchFilter = el.dataset.filter;
}

async function runPageSearch() {
  if (typeof requirePremium === 'function' && !(await requirePremium('Advanced Search'))) return;
  const query = document.getElementById('page-search-input').value.trim();
  if (!query) return;
  addSearchHistory(query);
  const container = document.getElementById('page-search-results');
  container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px"><div class="skeleton" style="height:20px;margin-bottom:10px"></div><div class="skeleton" style="height:20px;width:80%"></div></div>`;
  let words = [];
  const filter = state.searchFilter;
  if (filter === 'ml') words = await API.getByMeaning(query);
  else if (filter === 'sp') words = await API.getSimilarSpelling(query);
  else if (filter === 'rel_syn') words = await API.getSynonyms(query);
  else if (filter === 'rel_ant') words = await API.getAntonyms(query);
  else if (filter === 'rel_rhy') words = await API.getRhymes(query);
  else if (filter === 'rel_trg') words = await API.getRelated(query);
  else if (filter === 'topics') words = await API.getByTopic(query);
  if (!words.length) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><div class="empty-title">No Results</div><div class="empty-desc">Try a different search term or filter</div></div>`;
    return;
  }
  const defs = await Promise.all(words.slice(0, 12).map(w => API.getDefinition(w)));
  const valid = defs.filter(Boolean);
  container.innerHTML =
    `<div class="search-result-count">${valid.length} result${valid.length !== 1 ? 's' : ''} for "${query}"</div>` +
    valid.map((w, i) => {
      const lvl = getCEFRLevel(w.word);
      const lvlColors = { A1:'#10B981', A2:'#34D399', B1:'#F59E0B', B2:'#FF6B35', C1:'#EF4444', C2:'#DC2626' };
      const lvlColor = lvlColors[lvl] || '#5B3DE8';
      return `
      <div class="search-word-card" onclick="loadWordDisplay('${w.word}');showPage('explore')" style="animation-delay:${Math.min(i * 0.04, 0.5)}s">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-wrap:wrap">
          <div class="search-word-name">${w.word}</div>
          ${getCEFRBadge(w.word)}
          <span class="search-result-type">${w.partOfSpeech}</span>
          ${w.phonetic ? `<span style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">${w.phonetic}</span>` : ''}
        </div>
        <div class="search-word-def">${w.definition}</div>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();pronounceWord('${w.word}')">🔊</button>
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();saveToFavorites(${JSON.stringify(w).replace(/"/g,'&quot;')})">⭐</button>
        </div>
      </div>`;
    }).join('');
}

// Topbar autocomplete + search (Enter, keyboard nav, rich results)
(function() {
  const el = document.getElementById('topbar-search');
  if (!el) return;
  let selectedIndex = -1;

  el.addEventListener('keydown', function(e) {
    const drop = document.getElementById('search-results-dropdown');
    const items = drop?.querySelectorAll('.search-result-item');

    if (e.key === 'Enter') {
      e.preventDefault();
      // If keyboard-highlighted item exists, click it
      if (drop?.style.display === 'block' && selectedIndex >= 0 && items?.[selectedIndex]) {
        items[selectedIndex].click();
        return;
      }
      // Otherwise directly search the typed text
      const q = this.value.trim();
      if (q) {
        if (drop) drop.style.display = 'none';
        this.value = '';
        selectedIndex = -1;
        loadWordDisplay(q);
        showPage('explore');
      }
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!drop || drop.style.display !== 'block' || !items?.length) return;
      items.forEach(item => item.classList.remove('highlighted'));
      if (e.key === 'ArrowDown') {
        selectedIndex = (selectedIndex + 1) % items.length;
      } else {
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      }
      items[selectedIndex].classList.add('highlighted');
      items[selectedIndex].scrollIntoView({ block: 'nearest' });
      return;
    }

    if (e.key === 'Escape') {
      if (drop) drop.style.display = 'none';
      selectedIndex = -1;
    }
  });

  el.addEventListener('input', function() {
    clearTimeout(searchDebounce);
    selectedIndex = -1;
    const q = this.value.trim();
    const drop = document.getElementById('search-results-dropdown');
    if (!q) { if (drop) drop.style.display = 'none'; return; }
    searchDebounce = setTimeout(async () => {
      const words = await API.datamuse({ sp: q + '*', max: 8 });
      if (!words.length) { if (drop) drop.style.display = 'none'; return; }
      const defs = await Promise.all(words.slice(0, 6).map(w => API.getDefinition(w)));
      if (drop) {
        drop.style.display = 'block';
        drop.innerHTML = words.map((w, i) => {
          const def = defs[i];
          const pos = def?.partOfSpeech || '';
          const shortDef = def?.definition ? def.definition.slice(0, 65) + (def.definition.length > 65 ? '…' : '') : '';
          return `
          <div class="search-result-item" data-word="${w}" onclick="document.getElementById('topbar-search').value='';document.getElementById('search-results-dropdown').style.display='none';loadWordDisplay('${w}');showPage('explore')">
            <div style="display:flex;flex-direction:column;gap:2px;width:100%">
              <div style="display:flex;align-items:center;gap:6px">
                <span class="search-result-word">${w}</span>
                ${pos ? `<span class="search-result-type" style="font-size:9px;padding:1px 7px">${pos}</span>` : ''}
              </div>
              ${shortDef ? `<div style="font-size:11px;color:var(--text2);line-height:1.3;margin-top:1px">${shortDef}</div>` : ''}
            </div>
          </div>`;
        }).join('');
      }
    }, 200);
  });
})();
