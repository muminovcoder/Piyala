// =============================================
// Piyala — App Enhancements Module
// Premium UX improvements, onboarding, animations
// =============================================

// ===== ONBOARDING SURVEY (5 questions) =====
const ONBOARDING_SURVEY = [
  {
    icon: '<i class="ti ti-target-arrow"></i>',
    title: 'What\'s your English level?',
    type: 'radio',
    name: 'level',
    options: [
      { value: 'beginner', label: '<i class="ti ti-seedling"></i> Beginner', desc: 'Just starting out' },
      { value: 'elementary', label: '<i class="ti ti-abc"></i> Elementary', desc: 'Basic words & phrases' },
      { value: 'intermediate', label: '<i class="ti ti-books"></i> Intermediate', desc: 'Can hold conversations' },
      { value: 'advanced', label: '<i class="ti ti-star"></i> Advanced', desc: 'Fluent, want to refine' },
      { value: 'native', label: '<i class="ti ti-world"></i> Native', desc: 'Already fluent' },
    ],
  },
  {
    icon: '<i class="ti ti-calendar-clock"></i>',
    title: 'How many lessons per day?',
    type: 'radio',
    name: 'daily_goal',
    options: [
      { value: '5', label: '<i class="ti ti-coffee"></i> 5 min', desc: 'Quick & easy' },
      { value: '10', label: '<i class="ti ti-bolt"></i> 10 min', desc: 'Casual pace' },
      { value: '15', label: '<i class="ti ti-flame"></i> 15 min', desc: 'Recommended' },
      { value: '30', label: '<i class="ti ti-muscle"></i> 30 min', desc: 'Serious learner' },
      { value: 'unlimited', label: '<i class="ti ti-infinity"></i> Unlimited', desc: 'Let me decide' },
    ],
  },
  {
    icon: '<i class="ti ti-share"></i>',
    title: 'How did you find us?',
    type: 'radio',
    name: 'source',
    options: [
      { value: 'instagram', label: '<i class="ti ti-brand-instagram"></i> Instagram', desc: '' },
      { value: 'telegram', label: '<i class="ti ti-brand-telegram"></i> Telegram', desc: '' },
      { value: 'youtube', label: '<i class="ti ti-brand-youtube"></i> YouTube', desc: '' },
      { value: 'twitter', label: '<i class="ti ti-brand-x"></i> Twitter / X', desc: '' },
      { value: 'facebook', label: '<i class="ti ti-brand-facebook"></i> Facebook', desc: '' },
      { value: 'friend', label: '<i class="ti ti-users"></i> Friend', desc: '' },
      { value: 'other', label: '<i class="ti ti-dots"></i> Other', desc: '' },
    ],
  },
  {
    icon: '<i class="ti ti-flag"></i>',
    title: 'What\'s your main goal?',
    type: 'radio',
    name: 'goal',
    options: [
      { value: 'exam', label: '<i class="ti ti-file-text"></i> Exam Prep', desc: 'IELTS, TOEFL, etc.' },
      { value: 'work', label: '<i class="ti ti-briefcase"></i> Work / Business', desc: 'Professional English' },
      { value: 'travel', label: '<i class="ti ti-plane"></i> Travel', desc: 'For trips abroad' },
      { value: 'daily', label: '<i class="ti ti-message"></i> Daily Life', desc: 'Everyday conversations' },
      { value: 'academic', label: '<i class="ti ti-school"></i> Academic', desc: 'University & research' },
      { value: 'general', label: '<i class="ti ti-sparkles"></i> General', desc: 'Just for fun' },
    ],
  },
  {
    icon: '<i class="ti ti-heart"></i>',
    title: 'Which topics interest you?',
    type: 'radio',
    name: 'interest',
    options: [
      { value: 'academic', label: '<i class="ti ti-microscope"></i> Academic', desc: 'Science, history, etc.' },
      { value: 'business', label: '<i class="ti ti-building"></i> Business', desc: 'Finance, marketing' },
      { value: 'daily', label: '<i class="ti ti-home"></i> Daily Life', desc: 'Everyday vocabulary' },
      { value: 'technology', label: '<i class="ti ti-device-laptop"></i> Technology', desc: 'Tech & coding' },
      { value: 'literature', label: '<i class="ti ti-book"></i> Literature', desc: 'Books & arts' },
      { value: 'all', label: '<i class="ti ti-category"></i> All Topics', desc: 'Everything!' },
    ],
  },
];

let surveyStep = 0;
const surveyAnswers = {};

function initOnboarding() {
  const shown = localStorage.getItem('vm_onboarding_shown');
  if (shown === 'true') return;

  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('active'), 100);

  renderSurveyStep(0);
}

function renderSurveyStep(index) {
  const overlay = document.getElementById('onboarding-overlay');
  if (!overlay) return;

  const q = ONBOARDING_SURVEY[index];
  if (!q) { completeOnboarding(); return; }

  const isLast = index === ONBOARDING_SURVEY.length - 1;

  overlay.innerHTML = `
    <div class="onboarding-modal survey-modal">
      <div class="survey-progress">
        <div class="survey-progress-bar" style="width:${((index + 1) / ONBOARDING_SURVEY.length) * 100}%"></div>
      </div>
      <div class="survey-step">
        <div class="survey-icon">${q.icon}</div>
        <div class="survey-title">${q.title}</div>
        <div class="survey-options">
          ${q.options.map(opt => `
            <label class="survey-option ${surveyAnswers[q.name] === opt.value ? 'selected' : ''}" data-value="${opt.value}">
              <input type="radio" name="${q.name}" value="${opt.value}" ${surveyAnswers[q.name] === opt.value ? 'checked' : ''} style="display:none">
              <span class="survey-opt-label">${opt.label}</span>
              ${opt.desc ? `<span class="survey-opt-desc">${opt.desc}</span>` : ''}
            </label>
          `).join('')}
        </div>
      </div>
      <div class="survey-footer">
        <span class="survey-counter">${index + 1} / ${ONBOARDING_SURVEY.length}</span>
        <div class="survey-actions">
          <button class="vm-btn vm-btn-ghost" id="onb-skip">Skip</button>
          <button class="vm-btn vm-btn-primary" id="onb-next" ${surveyAnswers[q.name] ? '' : 'disabled'}>${isLast ? '🚀 Start' : 'Next →'}</button>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.survey-option').forEach(el => {
    el.addEventListener('click', () => {
      const name = q.name;
      const value = el.dataset.value;
      surveyAnswers[name] = value;
      document.querySelectorAll('.survey-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      el.querySelector('input').checked = true;
      document.getElementById('onb-next').disabled = false;
    });
  });

  document.getElementById('onb-next').addEventListener('click', () => {
    if (isLast) {
      saveSurveyAnswers();
      completeOnboarding();
    } else {
      renderSurveyStep(index + 1);
    }
  });

  document.getElementById('onb-skip').addEventListener('click', completeOnboarding);
}

function saveSurveyAnswers() {
  try {
    localStorage.setItem('vm_survey', JSON.stringify(surveyAnswers));
    // Apply daily goal
    if (surveyAnswers.daily_goal && surveyAnswers.daily_goal !== 'unlimited') {
      localStorage.setItem('vm_daily_goal', surveyAnswers.daily_goal);
    }
    if (surveyAnswers.level) {
      localStorage.setItem('vm_level', surveyAnswers.level);
    }
  } catch (e) { /* ignore */ }
}

function completeOnboarding() {
  const overlay = document.getElementById('onboarding-overlay');
  if (!overlay) return;

  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.3s ease';

  setTimeout(() => {
    overlay.remove();
    localStorage.setItem('vm_onboarding_shown', 'true');
  }, 300);
}

// ===== CREATE FLOATING ACTION BUTTON =====
function createFAB() {
  const fab = document.createElement('button');
  fab.className = 'vm-fab';
  fab.innerHTML = '<i class="ti ti-plus"></i>';
  fab.setAttribute('aria-label', 'Quick action');
  fab.title = 'Quick action';

  fab.addEventListener('click', () => {
    if (typeof routerNavigate === 'function') {
      routerNavigate('/learn/flashcards');
    }
  });

  document.body.appendChild(fab);
  return fab;
}

// ===== SKELETON LOADING UTILITY =====
function showSkeleton(containerId, count = 3, type = 'card') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  const skeletons = [];

  if (type === 'card') {
    for (let i = 0; i < count; i++) {
      const card = document.createElement('div');
      card.className = 'vm-skeleton-card';
      card.style.animationDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div class="vm-skeleton vm-skeleton-title"></div>
        <div class="vm-skeleton vm-skeleton-line"></div>
        <div class="vm-skeleton vm-skeleton-line"></div>
        <div class="vm-skeleton vm-skeleton-line" style="width:60%"></div>
      `;
      container.appendChild(card);
      skeletons.push(card);
    }
  } else if (type === 'stat') {
    const grid = document.createElement('div');
    grid.className = 'vm-skeleton-grid';
    for (let i = 0; i < count; i++) {
      const card = document.createElement('div');
      card.className = 'vm-skeleton-card';
      card.style.animationDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div class="vm-skeleton" style="width:36px;height:36px;border-radius:10px;margin-bottom:12px"></div>
        <div class="vm-skeleton" style="height:24px;width:60%;margin-bottom:6px"></div>
        <div class="vm-skeleton" style="height:12px;width:40%"></div>
      `;
      grid.appendChild(card);
      skeletons.push(card);
    }
    container.appendChild(grid);
  }

  return skeletons;
}

function hideSkeleton(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.vm-skeleton-card, .vm-skeleton-grid').forEach(el => {
    el.style.transition = 'opacity 0.2s ease';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 200);
  });
}

// ===== ENHANCED STAT COUNTER WITH EASING =====
function animateValue(el, target, suffix = '', duration = 1000) {
  if (!el) return;

  let start = parseInt(el.textContent.replace(/[^0-9-]/g, '')) || 0;
  if (start === target) return;

  const diff = target - start;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + diff * eased) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ===== CONFETTI EFFECT =====
function fireConfetti(count = 40) {
  const colors = ['#5B3DE8', '#7C6FFF', '#22D3EE', '#FBBF24', '#F43F5E', '#34D399', '#EC4899'];
  const container = document.body;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = (Math.random() * 6 + 4) + 'px';
    piece.style.height = (Math.random() * 6 + 4) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
    piece.style.animationDelay = (Math.random() * 0.5) + 's';

    container.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

// ===== MICRO-INTERACTION: CARD PRESS =====
function cardPress(e) {
  const card = e.currentTarget;
  card.style.transform = 'scale(0.97)';
  setTimeout(() => {
    card.style.transform = '';
  }, 150);
}

// ===== MICRO-INTERACTION: STAGGER ANIMATION =====
function applyStagger(containerId, className = 'animate-fadeIn') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const children = container.children;
  Array.from(children).forEach((child, i) => {
    child.style.opacity = '0';
    child.style.animation = `vmPageIn 0.4s ease ${i * 0.08}s forwards`;
  });
}

// ===== ENHANCED TOAST SYSTEM =====
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: '<i class="ti ti-circle-check" style="color:#34D399"></i>',
    error: '<i class="ti ti-alert-circle" style="color:#FB7185"></i>',
    info: '<i class="ti ti-info-circle" style="color:#7C6FFF"></i>',
    achievement: '<i class="ti ti-trophy" style="color:#FBBF24"></i>',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initScrollAnimations() {
  if (typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });
}

// ===== THEME AWARE CANVAS BACKGROUND =====
function enhanceCanvasBg() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const observer = new MutationObserver(() => {
    const theme = document.documentElement.getAttribute('data-theme');
    canvas.style.opacity = theme === 'light' ? '0.2' : theme === 'eye' ? '0.15' : '0.4';
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'd':
      case '1':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (typeof routerNavigate === 'function') routerNavigate('/');
        }
        break;
      case 'e':
      case '2':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (typeof routerNavigate === 'function') routerNavigate('/learn/explore');
        }
        break;
      case 'f':
      case '3':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (typeof routerNavigate === 'function') routerNavigate('/learn/flashcards');
        }
        break;
      case 'p':
      case '4':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (typeof routerNavigate === 'function') routerNavigate('/track/progress');
        }
        break;
      case '/':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          const searchInput = document.querySelector('#search-bar input, #page-search-input');
          if (searchInput) searchInput.focus();
        }
        break;
    }
  });
}

// ===== INTERCEPT ROUTER FOR BOTTOM NAV =====
function patchRouterForBottomNav() {
  if (typeof Router !== 'undefined' && Router._navigate) {
    const original = Router.navigate;
    Router.navigate = function(path) {
      original.call(this, path);
      if (typeof updateBottomNav === 'function') {
        updateBottomNav(path);
      }
    };
  }

  // Also patch the global routerNavigate if it exists
  if (typeof routerNavigate === 'function') {
    const original = routerNavigate;
    window.routerNavigate = function(path) {
      original(path);
      if (typeof updateBottomNav === 'function') {
        updateBottomNav(path);
      }
    };
  }
}

// ===== PATCH DASHBOARD REFRESH =====
function patchDashboard() {
  if (typeof refreshDashboard === 'function') {
    const original = refreshDashboard;
    window.refreshDashboard = function() {
      // Add stagger classes to dashboard cards
      const left = document.querySelector('.dashboard-left');
      const right = document.querySelector('.dashboard-right');

      if (left) {
        Array.from(left.children).forEach((child, i) => {
          child.classList.add(`stagger-${i + 1}`);
        });
      }

      if (right) {
        Array.from(right.children).forEach((child, i) => {
          child.classList.add(`stagger-${(left ? left.children.length : 0) + i + 1}`);
        });
      }

      // Call original
      original();

      // Enhanced stat animation
      updateEnhancedDashboard();
    };
  }
}

function updateEnhancedDashboard() {
  // If we have the enhanced dashboard elements, animate them
  const s = state && state.stats ? state.stats : {};

  document.querySelectorAll('.vm-stat-value').forEach(el => {
    const target = parseInt(el.dataset.target) || 0;
    if (target > 0) {
      animateValue(el, target);
    }
  });
}

// ===== INIT ALL ENHANCEMENTS =====
function initAppEnhancements() {
  // Create FAB
  createFAB();

  // Init onboarding
  setTimeout(initOnboarding, 1000);

  // Init keyboard shortcuts
  initKeyboardShortcuts();

  // Init scroll animations
  initScrollAnimations();

  // Enhance canvas
  enhanceCanvasBg();

  // Patch router
  patchRouterForBottomNav();

  // Patch dashboard
  patchDashboard();

  // Update bottom nav on initial route
  setTimeout(() => {
    const currentPath = window.location.hash.slice(1) || '/';
    if (typeof updateBottomNav === 'function') updateBottomNav(currentPath);
  }, 200);

  console.log('🔮 Piyala Enhancements loaded');
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAppEnhancements);
} else {
  initAppEnhancements();
}

// ===== EXPOSE UTILITIES GLOBALLY =====
window.animateValue = animateValue;
window.showSkeleton = showSkeleton;
window.hideSkeleton = hideSkeleton;
window.fireConfetti = fireConfetti;
window.showToast = showToast;
window.cardPress = cardPress;
