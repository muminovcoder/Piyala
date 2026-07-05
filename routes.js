// =============================================
// VocabMaster AI — Route Configuration
// Scalable nested URL hierarchy with SEO-friendly paths
// =============================================
// Architecture:
//   Each route maps a URL path to a page component.
//   Supports: parent-child nesting, dynamic params, section headers.
//
// Route properties:
//   id         — DOM page element ID (page-{id})
//   title      — Display name for breadcrumbs & nav
//   parent     — Parent path for breadcrumb traversal (null = root)
//   section    — true = nav section header (no page)
//   icon       — Nav icon emoji
//   nav        — Nav section grouping
//   dynamic    — true = matches dynamic segments like :param
//   component  — Initialization function name (optional)
//   sub        — Default sub-state parameter
// =============================================

const ROUTE_TREE = {

  // ────────────── ROOT ──────────────
  '/': {
    id: 'dashboard',
    title: 'General',
    icon: '📊',
    nav: 'General',
    parent: null,
    component: 'refreshDashboard',
  },


  // ────────────── LEARN ──────────────
  '/learn': {
    section: true,
    title: 'Learn',
    icon: '📖',
    nav: 'Learn',
    parent: null,
  },
  '/learn/explore': {
    id: 'explore',
    title: 'Explore Words',
    icon: '📖',
    nav: 'Learn',
    parent: '/learn',
    component: 'initExplorePage',
  },
  '/learn/flashcards': {
    id: 'flashcards',
    title: 'Flashcards',
    icon: '🗂️',
    nav: 'Learn',
    parent: '/learn',
    component: 'initFlashcards',
  },
  '/learn/books': {
    id: 'books',
    title: 'Books',
    icon: '📜',
    nav: 'Learn',
    parent: '/learn',
    component: 'renderBooks',
    sub: 'library',
  },
  '/learn/books/:bookId': {
    id: 'books',
    title: 'Book Reader',
    nav: 'Learn',
    parent: '/learn/books',
    dynamic: true,
    component: 'renderBooks',
  },
  '/learn/youtube': {
    id: 'youtube',
    title: 'StudyTube',
    icon: '▶️',
    nav: 'Learn',
    parent: '/learn',
    component: 'renderYoutube',
  },
  '/learn/youtube/:filter': {
    id: 'youtube',
    title: 'YouTube Filter',
    nav: 'Learn',
    parent: '/learn/youtube',
    dynamic: true,
  },
  '/learn/youtube/video/:slug': {
    id: 'video',
    title: 'YouTube Video',
    nav: 'Learn',
    parent: '/learn/youtube',
    dynamic: true,
    component: 'renderYoutubeVideo',
  },
  '/learn/youtube/watch/:videoId': {
    id: 'youtube',
    title: 'YouTube Video',
    nav: 'Learn',
    parent: '/learn/youtube',
    dynamic: true,
  },

  // ────────────── GAMES ──────────────
  '/games': {
    id: 'games',
    title: 'Vocabulary Games',
    icon: '🎮',
    nav: 'Games',
    parent: null,
    component: 'showGamesPage',
  },

  // ────────────── GRAMMAR ──────────────
  '/grammar': {
    id: 'grammar',
    title: 'Grammar Master',
    icon: '🎓',
    nav: 'Grammar',
    parent: null,
    component: 'renderGrammar',
  },

  // ────────────── PRACTICE ──────────────
  '/practice': {
    section: true,
    title: 'Practice',
    icon: '🔍',
    nav: 'Practice',
    parent: null,
  },
  '/practice/search': {
    id: 'search',
    title: 'Search',
    icon: '🔍',
    nav: 'Practice',
    parent: '/practice',
    component: 'initSearchPage',
  },
  '/practice/favorites': {
    id: 'favorites',
    title: 'Favorites',
    icon: '⭐',
    nav: 'Practice',
    parent: '/practice',
    component: 'renderFavorites',
  },

  // ────────────── TRACK ──────────────
  '/track': {
    section: true,
    title: 'Track',
    icon: '📈',
    nav: 'Track',
    parent: null,
  },
  '/track/progress': {
    id: 'progress',
    title: 'Progress',
    icon: '📈',
    nav: 'Track',
    parent: '/track',
    component: 'renderProgress',
  },
  '/track/achievements': {
    id: 'achievements',
    title: 'Achievements',
    icon: '🏆',
    nav: 'Track',
    parent: '/track',
    component: 'renderAchievements',
  },
  '/track/leaderboard': {
    id: 'leaderboard',
    title: 'Leaderboard',
    icon: '👑',
    nav: 'Track',
    parent: '/track',
    component: 'renderLeaderboard',
  },

  // ────────────── TOOLS ──────────────
  '/tools': {
    section: true,
    title: 'Tools',
    icon: '⏱️',
    nav: 'Tools',
    parent: null,
  },

  // ────────────── UPDATES ──────────────
  '/updates': {
    id: 'news',
    title: 'News & Roadmap',
    icon: '📰',
    nav: 'Updates',
    parent: null,
    component: 'renderNews',
  },

  // ────────────── PREMIUM ──────────────
  '/premium': {
    id: 'premium',
    title: 'Premium',
    icon: '👑',
    nav: 'Premium',
    parent: null,
    component: 'renderPremium',
  },

  // ────────────── SPEAKING (DISABLED) ──────────────
  '/speaking': {
    id: 'speaking-landing',
    title: 'Speaking Practice',
    icon: '🗣️',
    nav: 'Speaking',
    parent: null,
    component: 'renderSpeakingLanding',
    disabled: true,
  },
  '/speaking/with-people': {
    id: 'speaking',
    title: 'Speaking with People',
    icon: '🗣️',
    nav: 'Speaking',
    parent: '/speaking',
    component: 'renderSpeaking',
    disabled: true,
  },
  '/speaking/with-ai': {
    id: 'speaking-ai',
    title: 'Speaking with AI',
    icon: '🤖',
    nav: 'Speaking',
    parent: '/speaking',
    component: 'renderSpeakingAI',
    disabled: true,
  },

  // ────────────── INFO ──────────────
  '/company': {
    section: true,
    title: 'Info',
    icon: 'ℹ️',
    nav: 'Info',
    parent: null,
  },
  '/company/about': {
    id: 'about',
    title: 'About Us',
    icon: 'ℹ️',
    nav: 'Info',
    parent: '/company',
  },
  '/company/team': {
    id: 'team',
    title: 'Team',
    icon: '👥',
    nav: 'Info',
    parent: '/company',
  },
  '/company/founder': {
    id: 'founder',
    title: 'Founder',
    icon: '👑',
    nav: 'Info',
    parent: '/company',
  },
  '/company/privacy': {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: '🛡️',
    nav: 'Info',
    parent: '/company',
  },
  '/company/terms': {
    id: 'terms',
    title: 'Terms of Service',
    icon: '📄',
    nav: 'Info',
    parent: '/company',
  },
  '/company/cookies': {
    id: 'cookies',
    title: 'Cookie Policy',
    icon: '🍪',
    nav: 'Info',
    parent: '/company',
  },
  '/social': {
    id: 'social',
    title: 'Social Media',
    icon: '🌐',
    nav: 'Social',
    parent: null,
  },
  '/company/address': {
    id: 'address',
    title: 'Address',
    icon: '📍',
    nav: 'Info',
    parent: '/company',
  },

  // ────────────── ACCOUNT ──────────────
  '/account': {
    section: true,
    title: 'Account',
    icon: '👤',
    nav: 'Account',
    parent: null,
  },
  '/account/profile': {
    id: 'profile',
    title: 'Profile',
    icon: '👤',
    nav: 'Account',
    parent: '/account',
    component: 'renderProfile',
  },
  '/settings': {
    id: 'settings',
    title: 'Settings',
    icon: '⚙️',
    nav: 'Account',
    parent: null,
  },
};

// =============================================
// ROUTER — Navigation engine
// =============================================
const Router = {
  _currentPath: '/',
  _params: {},
  _history: [],

  _routes: null,
  _buildLookup() {
    if (this._routes) return;
    this._routes = new Map();
    for (const [path, config] of Object.entries(ROUTE_TREE)) {
      this._routes.set(path, config);
    }
  },

  match(path) {
    this._buildLookup();
    if (this._routes.has(path)) {
      this._params = {};
      return { config: this._routes.get(path), params: {}, path };
    }
    for (const [routePath, config] of this._routes) {
      if (!routePath.includes(':')) continue;
      const routeParts = routePath.split('/');
      const pathParts = path.split('/');
      if (routeParts.length !== pathParts.length) continue;
      const params = {};
      let match = true;
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].slice(1)] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }
      if (match) {
        this._params = params;
        return { config, params, path: routePath };
      }
    }
    return null;
  },

  navigate(path, { replace } = {}) {
    if (!path) return;
    if (!path.startsWith('/')) path = '/' + path;
    console.log('[Router.navigate] path:', path, 'replace:', replace);
    const match = this.match(path);
    console.log('[Router.navigate] match result:', match ? 'found (' + match.config.id + ')' : 'NOT FOUND');
    if (!match) {
      console.warn(`Route not found: ${path}, falling back to dashboard`);
      this.navigate('/', { replace: true });
      return;
    }
    const { config, params } = match;
    const id = config.id;
    if (!id) {
      for (const [childPath, childConfig] of this._routes) {
        if (childConfig.parent === path && childConfig.id) {
          this.navigate(childPath, { replace });
          return;
        }
      }
      return;
    }

    this._currentPath = path;
    this._params = params;

    const sub = config.sub || null;
    const dynamicSub = params ? Object.values(params).join('/') : null;
    const hash = '#' + path;
    const stateObj = { page: id, sub: sub || dynamicSub, path, router: true };

    if (replace) {
      history.replaceState(stateObj, '', hash);
    } else {
      history.pushState(stateObj, '', hash);
    }

    // Reset currentPage so showPage() always runs its init logic
    // even if a prior popstate already set it to this page
    state.currentPage = null;
    showPage(id, sub || dynamicSub);
    this.renderBreadcrumbs(path);

    const canonicalLink = document.getElementById('canonical-link');
    if (canonicalLink) {
      canonicalLink.href = 'https://vocabmasterai.site' + path;
    }
    if (typeof updateBreadcrumbSchema === 'function') {
      updateBreadcrumbSchema(path);
    }

    if (!this._history.length || this._history[this._history.length - 1] !== path) {
      this._history.push(path);
    }

    this._updateNavState(path);
    this._savePageState();
  },

  back() {
    if (this._history.length < 2) {
      this.navigate('/', { replace: true });
      return;
    }
    this._history.pop();
    const prev = this._history.pop() || '/';
    this.navigate(prev, { replace: true });
  },

  getBreadcrumbs(path) {
    const trail = [];
    const parts = path.split('/').filter(Boolean);
    let current = '';
    for (const part of parts) {
      current += '/' + part;
      const match = this.match(current);
      if (match && match.config && !match.config.section) {
        trail.push({ path: current, title: match.config.title, icon: match.config.icon || '' });
      }
    }
    return trail;
  },

  renderBreadcrumbs(path) {
    const trail = this.getBreadcrumbs(path);
    if (trail.length <= 1) return;
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;
    const header = activePage.querySelector('.page-header');
    if (!header) return;
    const existing = header.querySelector('.route-breadcrumbs');
    if (existing) existing.remove();
    const breadEl = document.createElement('div');
    breadEl.className = 'route-breadcrumbs';
    breadEl.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text3);margin-bottom:8px;flex-wrap:wrap;';
    breadEl.innerHTML = trail.map((crumb, i) => {
      const isLast = i === trail.length - 1;
      const arrow = i > 0 ? '<span style="color:var(--text3);opacity:0.4;font-size:10px;">▸</span>' : '';
      if (isLast) {
        return `${arrow}<span style="color:var(--text1);font-weight:500">${crumb.icon ? crumb.icon + ' ' : ''}${crumb.title}</span>`;
      }
      return `${arrow}<a href="#${crumb.path}" onclick="Router.navigate('${crumb.path}');return false;" style="color:var(--accent2);text-decoration:none;transition:color 0.2s" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${crumb.icon ? crumb.icon + ' ' : ''}${crumb.title}</a>`;
    }).join('');
    header.prepend(breadEl);
  },

  _updateNavState(path) {
    const match = this.match(path);
    const id = match ? match.config.id : 'dashboard';
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const exact = document.querySelectorAll(`[data-route-path="${path}"]`);
    if (exact.length) {
      exact.forEach(n => n.classList.add('active'));
    } else {
      const routePaths = Array.from(document.querySelectorAll('[data-route-path]')).map(el => el.dataset.routePath).filter(Boolean);
      const sorted = routePaths.sort((a, b) => b.length - a.length);
      let matched = false;
      for (const rp of sorted) {
        if (path.startsWith(rp)) {
          document.querySelectorAll(`[data-route-path="${rp}"]`).forEach(n => n.classList.add('active'));
          matched = true;
          break;
        }
      }
      if (!matched) {
        document.querySelectorAll(`[onclick*="'${id}'"]`).forEach(n => n.classList.add('active'));
      }
    }
    state.currentPage = id;
  },

  _getPathForId(id) {
    for (const [path, config] of this._routes) {
      if (config.id === id) return path;
    }
    return null;
  },

  // Persist current route + page state so refresh restores exactly
  _savePageState() {
    try {
      const scrollKey = 'vm_route_scroll_' + this._currentPath.replace(/\//g, '_');
      sessionStorage.setItem('vm_route_path', this._currentPath);
      sessionStorage.setItem('vm_route_params', JSON.stringify(this._params));
      sessionStorage.setItem(scrollKey, String(window.scrollY));
    } catch (e) { /* ignore quota errors */ }
  },

  // Restore scroll position after page init
  _restoreScroll() {
    try {
      const scrollKey = 'vm_route_scroll_' + this._currentPath.replace(/\//g, '_');
      const saved = sessionStorage.getItem(scrollKey);
      if (saved) {
        requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)));
      }
    } catch (e) { /* ignore */ }
  },

  // Initialize from URL hash — returns the path that was navigated to (or null)
  init() {
    this._buildLookup();
    let hash = window.location.hash.slice(1) || '';
    console.log('[Router.init] raw hash:', JSON.stringify(hash));
    // If no hash AND we have a saved route from session, restore it
    if (!hash) {
      try {
        const saved = sessionStorage.getItem('vm_route_path');
        console.log('[Router.init] no hash, trying sessionStorage vm_route_path:', saved);
        if (saved) {
          hash = saved;
        }
      } catch (e) { /* ignore */ }
    }
    if (!hash) hash = '/';

    const oldToNew = {
      dashboard: '/', explore: '/learn/explore', flashcards: '/learn/flashcards',
      books: '/learn/books', youtube: '/learn/youtube', grammar: '/grammar',
      search: '/practice/search', favorites: '/practice/favorites',
      progress: '/track/progress', achievements: '/track/achievements',
      leaderboard: '/track/leaderboard',
      games: '/games',
      news: '/updates', premium: '/premium', profile: '/account/profile',
      about: '/company/about', team: '/company/team', founder: '/company/founder',
      address: '/company/address', privacy: '/company/privacy', terms: '/company/terms',
      cookies: '/company/cookies',
      settings: '/settings',
      speaking: '/speaking', 'speaking-landing': '/speaking',
    };
    const normalized = hash.startsWith('/') ? hash : (oldToNew[hash.split('/')[0]] || '/' + hash.split('/')[0]);
    console.log('[Router.init] normalized path:', normalized, '→ calling navigate');
    // Use replace:true on init so the initial hash doesn't add a history entry
    this.navigate(normalized, { replace: true });
    // Restore scroll after a short delay to let the page render
    setTimeout(() => this._restoreScroll(), 100);
    return normalized;
  },

  // Update hash without full navigation (for sub-state changes like filters)
  replaceHash(path) {
    if (!path.startsWith('/')) path = '/' + path;
    this._currentPath = path;
    this._params = {};
    const match = this.match(path);
    const stateObj = { page: match ? match.config.id : null, sub: null, path, router: true };
    history.replaceState(stateObj, '', '#' + path);
    if (this._history[this._history.length - 1] !== path) {
      this._history.push(path);
    }
    this._updateNavState(path);
  },

  getParams() {
    return { ...this._params };
  },

  getCurrentRoute() {
    return this.match(this._currentPath);
  },
};

function routerNavigate(path) {
  Router.navigate(path);
}
