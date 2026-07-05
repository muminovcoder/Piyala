// =============================================
// Piyala — Books Module
// IELTS vocabulary study guides
// =============================================

// ===== BOOKS LIST =====
const BOOKS_LIST = [
  {
    id: 'ielts-advanced',
    title: 'Vocabulary for IELTS Advanced',
    author: 'Pauline Cullen',
    desc: '1103 academic words with definitions, examples & synonyms across 9 units.',
    level: 'Advanced',
    pages: 1103,
    icon: '<i class="ti ti-book-2"></i>',
    gradient: 'linear-gradient(135deg, #0D9488, #0891B2, #5856D6)',
    tags: ['IELTS', 'Band 7+', 'Academic', '9 Units']
  }
];

// ===== ESCAPE QUOTES =====
function escapeQuotes(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ===== UTILITY =====
function getUnitWordCount(unit) {
  return unit === 'all' ? IELTS_WORDS.length : IELTS_WORDS.filter(w => w.u === unit).length;
}

// ===== RENDER BOOKS =====
function renderBooks() {
  const el = document.getElementById('books-content');
  if (state.booksPage === 'library') renderBooksLibrary(el);
  else renderBooksReading(el);
}

// ===== LIBRARY VIEW =====
function renderBooksLibrary(el) {
  el.innerHTML = `
    <div class="books-hero">
      <div class="books-hero-bg"></div>
      <div class="books-hero-content">
        <div class="books-hero-icon"><i class="ti ti-books"></i></div>
        <div class="books-hero-title">Vocabulary Library</div>
        <div class="books-hero-sub">${IELTS_WORDS.length}+ academic words organized for IELTS success</div>
        <div class="books-hero-stats">
          <div class="books-hero-stat"><span class="bh-stat-val">${IELTS_WORDS.length}</span><span class="bh-stat-lbl">Words</span></div>
          <div class="books-hero-stat"><span class="bh-stat-val">9</span><span class="bh-stat-lbl">Units</span></div>
          <div class="books-hero-stat"><span class="bh-stat-val">${IELTS_WORDS.reduce((s,w) => s + (w.syns?.length || 0), 0)}</span><span class="bh-stat-lbl">Synonyms</span></div>
        </div>
      </div>
    </div>
    <div class="books-library-grid">
      ${BOOKS_LIST.map((b, i) => `
        <div class="books-lib-card" onclick="openBook('${b.id}')" style="animation-delay:${i*0.08}s">
          <div class="books-lib-cover" style="background:${b.gradient}">
            <div class="books-lib-cover-glow"></div>
            <div class="books-lib-cover-dots"><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div class="books-lib-icon">${b.icon}</div>
            <div class="books-lib-level">${b.level}</div>
          </div>
          <div class="books-lib-info">
            <div class="books-lib-top">
              <div class="books-lib-badges">${b.tags.map(t => `<span class="bl-badge">${t}</span>`).join('')}</div>
              <div class="books-lib-rating"><span class="bl-dot filled"></span><span class="bl-dot filled"></span><span class="bl-dot filled"></span><span class="bl-dot filled"></span><span class="bl-dot"></span></div>
            </div>
            <div class="books-lib-title">${b.title}</div>
            <div class="books-lib-author"><i class="ti ti-user"></i> ${b.author}</div>
            <div class="books-lib-desc">${b.desc}</div>
            <div class="books-lib-meta">
              <span><i class="ti ti-abc"></i> ${b.pages} words</span>
              <span><i class="ti ti-layers-intersect"></i> ${b.level}</span>
              <span><i class="ti ti-infinity"></i> Lifetime</span>
            </div>
            <button class="books-open-btn" onclick="event.stopPropagation();openBook('${b.id}')">
              <i class="ti ti-book"></i> Open Book <i class="ti ti-arrow-right"></i>
            </button>
          </div>
        </div>`).join('')}
    </div>`;
}

// ===== READING VIEW =====
function openBook(id) {
  state.booksPage = 'reading';
  state.booksTopic = 'all';
  renderBooks();
  // Update URL hash for deep linking (e.g., #/learn/books/ielts-advanced)
  if (typeof Router !== 'undefined') {
    Router.replaceHash('/learn/books/' + id);
  }
}

function closeBook() {
  state.booksPage = 'library';
  renderBooks();
  if (typeof Router !== 'undefined') {
    Router.navigate('/learn/books');
  }
}

function filterBooksTopic(topic) {
  state.booksTopic = topic;
  renderBooks();
}

window._openBookWord = function(word, def, ex, pos, synsStr) {
  const syns = synsStr ? synsStr.split(',').filter(Boolean) : [];
  const wordData = {
    word, definition: def, example: ex, partOfSpeech: pos,
    synonyms: syns, antonyms: [], related: [], phonetic: ''
  };
  showWordModal(wordData);
};

window._saveBookWord = function(word, def, pos) {
  const existing = state.favorites.find(f => f.word === word);
  if (existing) { toast('Already in favorites', 'info', 1500); return; }
  state.favorites.push({ word, definition: def, partOfSpeech: pos, synonyms: [], antonyms: [], example: '', phonetic: '' });
  localStorage.setItem('vm_favorites', JSON.stringify(state.favorites));
  toast('Saved to favorites', 'success', 1500);
  updateFavCount();
};

function renderBooksReading(el) {
  const activeTopic = state.booksTopic || 'all';
  const unitNames = ['Communication','Environment','Technology','Health','Education','Economy','Society','Science','Lifestyle'];
  const filtered = activeTopic === 'all' ? IELTS_WORDS : IELTS_WORDS.filter(w => w.u === activeTopic);

  el.innerHTML = `
    <div class="books-back-row">
      <button class="books-back-lib" onclick="closeBook()"><i class="ti ti-arrow-left" style="font-size:14px;margin-right:4px"></i> Back to Library</button>
      <span class="books-back-count">${filtered.length} word${filtered.length !== 1 ? 's' : ''}</span>
    </div>
    <div class="books-header-card">
      <div class="books-header-glow"></div>
      <div class="books-header-content">
        <div class="books-header-icon"><i class="ti ti-book-2"></i></div>
        <div class="books-header-info">
          <div class="books-header-title">Vocabulary for IELTS Advanced</div>
          <div class="books-header-sub">by Pauline Cullen &middot; ${IELTS_WORDS.length} words &middot; 9 Units &middot; Band 7+</div>
          <div class="books-header-desc">High-level academic vocabulary organized by theme. Click any word to see full details.</div>
        </div>
      </div>
      <div class="books-header-stats">
        <div class="books-hstat"><span class="books-hstat-val">${filtered.length}</span><span class="books-hstat-lbl">Showing</span></div>
        <div class="books-hstat"><span class="books-hstat-val">${activeTopic === 'all' ? 9 : 1}</span><span class="books-hstat-lbl">Unit${activeTopic === 'all' ? 's' : ''}</span></div>
        <div class="books-hstat"><span class="books-hstat-val">${filtered.reduce((s,w) => s + (w.syns?.length || 0), 0)}</span><span class="books-hstat-lbl">Synonyms</span></div>
      </div>
    </div>
    <div class="books-topic-bar">
      <span class="books-topic-chip ${activeTopic === 'all' ? 'active' : ''}" onclick="filterBooksTopic('all')">
        <i class="ti ti-books" style="font-size:14px;margin-right:4px"></i> All Units <span class="books-chip-count">${IELTS_WORDS.length}</span>
      </span>
      ${unitNames.map((name, i) => {
        const cnt = getUnitWordCount(String(i + 1));
        return `<span class="books-topic-chip ${activeTopic === String(i + 1) ? 'active' : ''}" onclick="filterBooksTopic('${i + 1}')" title="${name}">
          <i class="ti ti-book" style="font-size:14px;margin-right:4px"></i> Unit ${i + 1} <span class="books-chip-count">${cnt}</span>
        </span>`;
      }).join('')}
    </div>
    <div class="books-word-grid" id="books-word-grid">
      ${filtered.map((w, i) => `
        <div class="books-word-card" style="animation-delay:${i*0.015}s" onclick="window._openBookWord('${escapeQuotes(w.w)}','${escapeQuotes(w.def)}','${escapeQuotes(w.ex)}','${escapeQuotes(w.pos)}','${escapeQuotes((w.syns||[]).join(','))}')">
          <div class="books-word-head">
            <span class="books-word">${w.w}</span>
            <span class="books-pos">${w.pos}</span>
          </div>
          <div class="books-def">${w.def}</div>
          <div class="books-ex">${w.ex}</div>
          ${w.syns?.length ? `<div class="books-syns"><i class="ti ti-link" style="font-size:12px;margin-right:4px"></i><span class="books-syns-label">Synonyms:</span> ${w.syns.slice(0,3).join(', ')}${w.syns.length > 3 ? '<span class="books-syns-more">+'+ (w.syns.length - 3) +' more</span>' : ''}</div>` : ''}
          <div class="books-actions-row">
            <button class="books-pronounce-btn" onclick="event.stopPropagation();pronounceWord('${escapeQuotes(w.w)}')" title="Pronounce"><i class="ti ti-volume"></i></button>
            <button class="books-save-btn" onclick="event.stopPropagation();window._saveBookWord('${escapeQuotes(w.w)}','${escapeQuotes(w.def)}','${escapeQuotes(w.pos)}')" title="Save to favorites"><i class="ti ti-star"></i></button>
          </div>
        </div>`).join('')}
    </div>`;
}
