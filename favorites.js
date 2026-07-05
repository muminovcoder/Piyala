// =============================================
// FAVORITES
// =============================================
let favSortOrder = 'newest';

function renderFavorites() {
  if (!window._vmRevalidated) { API.revalidateStoredData(); window._vmRevalidated = true; }
  updateFavCount();
  const el = document.getElementById('favorites-container');
  const searchWrap = document.getElementById('fav-search-wrap');
  if (!state.favorites.length) {
    if (searchWrap) searchWrap.style.display = 'none';
    el.innerHTML = `<div class="empty-state"><div class="empty-icon"><i class="ti ti-star" style="font-size:48px;color:var(--ios-muted)"></i></div><div class="empty-title">No Saved Words Yet</div><div class="empty-desc">Save words while exploring to build your personal vocabulary list</div><button class="ios-btn ios-btn-primary" onclick="showPage('explore')" style="background:linear-gradient(135deg,#FF2D55,#AF52DE);color:#fff;border:none"><i class="ti ti-compass"></i> Start Exploring</button></div>`;
    return;
  }
  if (searchWrap) searchWrap.style.display = 'block';
  const q = String(document.getElementById('fav-search-input')?.value || '').trim().toLowerCase();
  let list = state.favorites;
  if (q) list = list.filter(w => String(w.word || '').toLowerCase().includes(q) || String(w.definition || '').toLowerCase().includes(q));
  if (favSortOrder === 'alpha') list = [...list].sort((a, b) => a.word.localeCompare(b.word));
  else list = [...list];
  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <span style="font-size:12px;color:var(--ios-secondary-label)">${list.length} of ${state.favorites.length} saved</span>
    </div>
    <div class="fav-grid">${list.map((w, i) => {
      const realIdx = state.favorites.indexOf(w);
      const lvl = getCEFRLevel(w.word);
      const lvlColors = { A1:'#10B981', A2:'#34D399', B1:'#F59E0B', B2:'#FF6B35', C1:'#EF4444', C2:'#DC2626' };
      const lvlColor = lvlColors[lvl] || '#5B3DE8';
      return `
      <div class="fav-card" onclick="showWordModal(state.favorites[${realIdx}])" style="animation-delay:${Math.min(i * 0.04, 0.5)}s">
        <div class="fav-head">
          <span class="fav-word">${w.word}</span>
          ${w.partOfSpeech ? `<span class="fav-pos">${w.partOfSpeech}</span>` : ''}
          <span style="font-size:9px;font-weight:700;padding:2px 7px;border-radius:6px;background:${lvlColor}18;color:${lvlColor};border:1px solid ${lvlColor}33;letter-spacing:0.3px">${lvl}</span>
        </div>
        ${w.phonetic ? `<div style="font-size:11px;color:var(--ios-muted);font-family:var(--font-mono);margin-bottom:4px">${w.phonetic}</div>` : ''}
        <div class="fav-def">${(w.definition || '').substring(0, 90)}${(w.definition || '').length > 90 ? '...' : ''}</div>
        <div class="fav-actions">
          <button class="fav-btn-icon" onclick="event.stopPropagation();pronounceWord('${w.word}')" title="Listen"><i class="ti ti-player-play"></i></button>
          <button class="fav-btn-icon" onclick="event.stopPropagation();addToFlashcards(state.favorites[${realIdx}]);toast('Added to flashcards!','success')" title="Flashcard"><i class="ti ti-cards"></i></button>
          <button class="fav-btn-icon del" onclick="event.stopPropagation();removeFavorite(${realIdx})" title="Remove"><i class="ti ti-trash"></i></button>
        </div>
      </div>`;
    }).join('')}</div>`;
}

function favSort() {
  favSortOrder = favSortOrder === 'newest' ? 'alpha' : 'newest';
  document.getElementById('fav-sort-btn').innerHTML = favSortOrder === 'newest' ? '<i class="ti ti-calendar"></i> Newest' : '<i class="ti ti-abc"></i> A-Z';
  renderFavorites();
}

function filterFavorites() { renderFavorites(); }

function removeFavorite(i) {
  const word = state.favorites[i]?.word;
  state.favorites.splice(i, 1);
  localStorage.setItem('vm_favorites', JSON.stringify(state.favorites));
  if (state.isOnline && word) SECURE_API.recordWord(word, 'unfavorite');
  renderFavorites();
  updateFavCount();
  toast('Removed from favorites', 'info');
}

function clearFavorites() {
  if (!confirm('Clear all favorites?')) return;
  state.favorites = [];
  localStorage.setItem('vm_favorites', JSON.stringify([]));
  renderFavorites();
  updateFavCount();
  toast('Favorites cleared', 'info');
}

function updateFavCount() {
  const badge = document.getElementById('fav-count-badge');
  if (!badge) return;
  const count = (state.favorites || []).length;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline' : 'none';
}
