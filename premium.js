const PREMIUM_TIERS = [
  {
    tier: 'Free', monthly: '0 UZS', badge: '', audience: 'For casual learners & trying out',
    monthlyUSD: '$0',
    color: '#94a3b8', icon: 'ti-gift', popular: false, features: [
      '120 words per day', 'Basic dictionary & translation',
      'Simple stats & progress tracking', 'Flashcards (30 per group)',
      'Ads included'
    ]
  },
  {
    tier: 'Premium', monthly: '62,000 UZS', badge: 'BEST SELLER', audience: 'Most popular — serious learners choose this',
    monthlyUSD: '$4.99',
    color: '#f59e0b', icon: 'ti-crown', popular: true, features: [
      'Unlimited words & full dictionary', 'Completely ad-free',
      'All grammar topics', 'Advanced analytics & deep progress reports',
      'Unlimited flashcards + smart review system',
      'Daily challenges & bonus XP',
      'AI Tutor (grammar assistant)',
      'Personalized practice (error analysis & review)',
      'Speaking & pronunciation exercises',
      'Weekly & monthly detailed reports'
    ]
  }
];

try { localStorage.removeItem('vm_plan_history_seeded'); localStorage.removeItem('vm_plan_history'); } catch(e) {}

const PAYMENT_CARDS = {
  Humo: '9860 1601 4234 2713',
  UzCard: '5614 6818 1830 7401',
  Visa: '4231 2000 9114 5283',
  Uzum: '4614 9903 5388 3272',
};
const CARD_HOLDER = 'Muhammadsolixon Mominov';

let premiumPaymentCountry = 'UZ';
let premiumPaymentCurrency = 'UZS';

function getCurrentPlan() {
  return localStorage.getItem('vm_plan') || 'Free';
}

function setCurrentPlan(tier) {
  localStorage.setItem('vm_plan', tier);
  if (typeof state !== 'undefined') state.currentPlan = tier;
  updateSidebarPlan();
}

async function syncPremiumFromServer() {
  if (!state || !state.authUser) return;
  if (typeof SECURE_API === 'undefined' || !SECURE_API.getPremiumInfo) return;
  try {
    const data = await SECURE_API.getPremiumInfo();
    if (data && data.tier) {
      setCurrentPlan(data.tier);
      if (data.expiresAt && data.tier !== 'Free') {
        localStorage.setItem('vm_premium_expires', data.expiresAt);
      } else {
        localStorage.removeItem('vm_premium_expires');
      }
      return data;
    }
  } catch (e) {}
  return false;
}

function getPremiumExpiresRemaining() {
  const expires = localStorage.getItem('vm_premium_expires');
  if (!expires) return null;
  const diff = new Date(expires) - new Date();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return { days, hours, total: diff };
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem('vm_plan_history')) || []; }
  catch(e) { return []; }
}

function saveHistory(h) {
  localStorage.setItem('vm_plan_history', JSON.stringify(h));
}

async function fetchPaymentHistory() {
  if (!state || !state.authUser) return;
  try {
    const data = await SECURE_API.apiRequest('GET', '/api/auth/telegram/payment/history?userId=' + state.authUser.id);
    if (data && data.requests) {
      const h = data.requests.map(r => ({
        tier: r.tier,
        period: r.period,
        amount: r.amount || '',
        date: new Date(r.created_at).toLocaleDateString(),
        method: r.card_type,
        status: r.status === 'approved' ? 'active' : r.status,
      }));
      saveHistory(h);
    }
  } catch(e) {}
}

function updateSidebarPlan() {
  const badge = document.getElementById('premium-nav-badge');
  if (!badge) return;
  const plan = getCurrentPlan();
  const t = PREMIUM_TIERS.find(x => x.tier === plan) || PREMIUM_TIERS[0];
  badge.textContent = plan;
  badge.style.background = 'color-mix(in srgb, ' + t.color + ' 20%, transparent)';
  badge.style.color = t.color;
  badge.style.borderColor = 'color-mix(in srgb, ' + t.color + ' 30%, transparent)';
  const premiumBadge = document.getElementById('sidebar-premium-badge');
  if (premiumBadge) {
    premiumBadge.style.display = plan !== 'Free' ? 'block' : 'none';
  }
}

function formatPrice(t, currency) {
  if (currency === 'USD') return t.monthlyUSD;
  return t.monthly;
}

async function renderPremium() {
  const el = document.getElementById('premium-content');
  if (!el) return;

  const premiumData = await syncPremiumFromServer();
  await fetchPaymentHistory();

  updateSidebarPlan();

  const currentPlan = getCurrentPlan();
  const currentTier = PREMIUM_TIERS.find(t => t.tier === currentPlan) || PREMIUM_TIERS[0];
  const history = getHistory();
  const isPaid = currentPlan !== 'Free';
  const remaining = getPremiumExpiresRemaining();

  let historyHtml = state && state.authUser ? `
    <div class="premium-history">
      <div class="premium-history-title"><i class="ti ti-history"></i> Purchase History</div>
      ${history.length
        ? '<div class="premium-history-list">' + history.map(h => renderHistoryItem(h, isPaid)).join('') + '</div>'
        : '<div class="premium-history-empty"><i class="ti ti-shopping-bag"></i> No purchase history yet</div>'
      }
    </div>
  ` : '';

  el.innerHTML = `
    <div class="page-header ios-header-gradient" style="background:linear-gradient(135deg,#5856D6,#007AFF);padding:56px 24px 20px;text-align:center;margin-bottom:28px;">
      <div style="margin-bottom:8px;"><i class="ti ti-crown" style="font-size:44px;color:rgba(255,255,255,0.9);display:inline-block;"></i></div>
      <h2 class="page-title" style="font-size:22px;font-weight:700;color:#fff;margin:0 0 4px 0;letter-spacing:-0.3px;">Premium</h2>
      <div class="page-subtitle" style="font-size:13px;color:rgba(255,255,255,0.7);margin:0;">Unlock your full learning potential</div>
    </div>

    <div class="premium-current-plan">
      <div class="pcp-badge" style="--badge-color:${currentTier.color}">
        <i class="ti ${currentTier.icon}"></i>
        <span class="pcp-label">Current Plan</span>
        <span class="pcp-name">${currentPlan}</span>
      </div>
      ${isPaid && remaining ? '<div class="pcp-expires"><i class="ti ti-clock" style="font-size:12px;margin-right:3px;"></i>Expires in <strong>' + remaining.days + 'd ' + remaining.hours + 'h</strong></div>' : ''}
      ${isPaid ? '<button class="pcp-cancel" onclick="cancelPlan()">Cancel</button>' : ''}
    </div>

    <div class="premium-hero">
      <div class="premium-hero-bg"></div>
      <div class="premium-hero-grid"></div>
      <div class="premium-hero-glow"></div>
      <div class="premium-hero-content">
        <div class="premium-hero-icon"><i class="ti ti-crown"></i></div>
        <div class="premium-hero-title">Choose Your Plan</div>
        <div class="premium-hero-sub">Unlock all features and take your learning to the next level</div>
        <div class="premium-hero-compare">
          <div class="phc-item">
            <span class="phc-label"><i class="ti ti-gift"></i> Free</span>
            <span class="phc-value phc-value-free">120 <small>words/day</small></span>
          </div>
          <div class="phc-divider">
            <div class="phc-bar"><div class="phc-bar-fill" style="width:15%"></div></div>
            <div class="phc-vs">VS</div>
          </div>
          <div class="phc-item phc-item-prem">
            <span class="phc-label"><i class="ti ti-crown"></i> Premium</span>
            <span class="phc-value phc-value-prem">Unlimited</span>
          </div>
        </div>
      </div>
    </div>

    <div class="premium-grid" id="premium-grid"></div>

    ${historyHtml}

    <div class="premium-faq">
      <div class="premium-faq-header">
        <div class="premium-faq-title"><i class="ti ti-question-mark"></i> Frequently Asked Questions</div>
        <button class="pfaq-toggle-all" onclick="event.stopPropagation(); toggleAllFaq()">Expand All</button>
      </div>
      <div class="premium-faq-grid">
        <div class="premium-faq-item" onclick="toggleFaq(this)">
          <div class="pfi-q">
            <span class="pfi-icon"><i class="ti ti-credit-card"></i></span>
            <span>What payment methods are accepted?</span>
            <span class="pfi-arrow"><i class="ti ti-chevron-down"></i></span>
          </div>
          <div class="pfi-a">We accept <strong>Humo, UzCard, Visa, and Uzum</strong> transfers. For international users, USD pricing via Visa/Mastercard is also available.</div>
        </div>
        <div class="premium-faq-item" onclick="toggleFaq(this)">
          <div class="pfi-q">
            <span class="pfi-icon"><i class="ti ti-send"></i></span>
            <span>How does payment work?</span>
            <span class="pfi-arrow"><i class="ti ti-chevron-down"></i></span>
          </div>
          <div class="pfi-a">Select a plan, transfer the exact amount to any card shown, enter your transfer details, and submit. Admin will verify and activate your premium within minutes.</div>
        </div>
        <div class="premium-faq-item" onclick="toggleFaq(this)">
          <div class="pfi-q">
            <span class="pfi-icon"><i class="ti ti-refresh"></i></span>
            <span>Can I buy a new plan while active?</span>
            <span class="pfi-arrow"><i class="ti ti-chevron-down"></i></span>
          </div>
          <div class="pfi-a">No. You can only purchase a new plan after your current premium expires. This prevents billing overlaps and ensures fair usage.</div>
        </div>
        <div class="premium-faq-item" onclick="toggleFaq(this)">
          <div class="pfi-q">
            <span class="pfi-icon"><i class="ti ti-receipt"></i></span>
            <span>Can I get a refund?</span>
            <span class="pfi-arrow"><i class="ti ti-chevron-down"></i></span>
          </div>
          <div class="pfi-a">Yes! Full refund within <strong>14 days</strong> of purchase. After that, a pro-rata refund is available for the unused portion of your subscription.</div>
        </div>
      </div>
    </div>
  `;

  updatePremiumGrid();
}

function renderPremiumCard(t) {
  const currency = premiumPaymentCurrency;
  const price = formatPrice(t, currency);
  const isPopular = t.popular;
  const isCurrent = t.tier === getCurrentPlan();
  const isFree = t.tier === 'Free';

  const badgeHtml = isPopular && !isCurrent
    ? '<div class="pc-badge"><i class="ti ti-star" style="font-size:9px;"></i> ' + t.badge + '</div>'
    : '';

  const currentHtml = isCurrent
    ? '<div class="pc-current"><i class="ti ti-check" style="font-size:10px;"></i> Current Plan</div>'
    : '';

  const featIcons = {
    '120 words per day': 'ti-hierarchy-2',
    'Basic dictionary & translation': 'ti-book',
    'Simple stats & progress tracking': 'ti-chart-bar',
    'Flashcards (30 per group)': 'ti-notes',
    'Ads included': 'ti-ad',
    'Unlimited words & full dictionary': 'ti-book-2',
    'Completely ad-free': 'ti-ad-off',
    'All grammar topics': 'ti-grammar',
    'Advanced analytics & deep progress reports': 'ti-chart-infographic',
    'Unlimited flashcards + smart review system': 'ti-notes',
    'Daily challenges & bonus XP': 'ti-trophy',
    'Personalized practice (error analysis & review)': 'ti-repeat',
    'Speaking & pronunciation exercises': 'ti-microphone',
    'Weekly & monthly detailed reports': 'ti-file-report',
    'AI Tutor (grammar assistant)': 'ti-robot',
  };

  return `
    <div class="pc ${isPopular ? 'pc-popular' : ''} ${isCurrent ? 'pc-current-card' : ''}" style="--c:${t.color}">
      ${badgeHtml}
      ${currentHtml}
      ${!isCurrent && !isFree ? '<div class="pc-ripple"></div>' : ''}
      <div class="pc-head">
        <div class="pc-icon" style="color:${t.color}"><i class="ti ${t.icon}"></i></div>
        <div class="pc-name">${t.tier}</div>
        <div class="pc-price">
          <span class="pc-price-val">${price}</span>
          <span class="pc-price-period">/month</span>
        </div>
        <div class="pc-desc">${t.audience}</div>
      </div>
      <div class="pc-feats">
        ${t.features.map(f => {
          const icon = featIcons[f] || 'ti-check';
          return '<div class="pc-feat"><span class="pc-feat-icon"><i class="ti ' + icon + '"></i></span>' + f + '</div>';
        }).join('')}
      </div>
      ${isCurrent
        ? '<div class="pc-footer-current"><i class="ti ti-check" style="font-size:11px;margin-right:4px;"></i>Current Plan</div>'
        : isFree
          ? '<button class="pc-btn pc-btn-outline" onclick="buyPremium(\'Free\')"><i class="ti ti-send"></i> Get Started Free</button>'
          : '<button class="pc-btn" onclick="showPaymentModal(\'' + t.tier + '\')"><i class="ti ti-crown"></i> Subscribe Now</button>'
      }
    </div>
  `;
}

function renderHistoryItem(h, isPaidActive) {
  const isActive = isPaidActive && h.status === 'active';
  const tier = PREMIUM_TIERS.find(t => t.tier === h.tier) || PREMIUM_TIERS[0];
  return `
    <div class="ph-item ${isActive ? 'active' : ''}">
      <div class="ph-left">
        <div class="ph-icon" style="background:color-mix(in srgb, ${tier.color} 15%, transparent);color:${tier.color}"><i class="ti ${tier.icon}"></i></div>
        <div class="ph-info">
          <div class="ph-tier">${h.tier} <span class="ph-period">(${h.period === 'yearly' ? 'Yearly' : 'Monthly'})</span></div>
          <div class="ph-date">${h.date} · ${h.method}</div>
        </div>
      </div>
      <div class="ph-right">
        <div class="ph-amount">${h.amount}</div>
        <div class="ph-status ${h.status}">${isActive ? 'Active' : (h.status === 'approved' ? 'Approved' : h.status)}</div>
      </div>
    </div>
  `;
}

function updatePremiumGrid() {
  const grid = document.getElementById('premium-grid');
  if (!grid) return;
  grid.innerHTML = PREMIUM_TIERS.map(t => renderPremiumCard(t)).join('');
}

const COUNTRIES = [
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'AE', name: 'UAE' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'RU', name: 'Russia' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'KR', name: 'South Korea' },
  { code: 'JP', name: 'Japan' },
  { code: 'OTHER', name: 'Other' },
];

function isUzbekistan(countryCode) {
  return countryCode === 'UZ';
}

function showPaymentModal(tier) {
  if (!state || !state.authUser) {
    toast('Please sign in first to purchase premium.', 'warning');
    openAuthModal();
    return;
  }

  const currentPlan = getCurrentPlan();
  if (currentPlan !== 'Free') {
    toast('You already have an active premium plan. Wait until it expires.', 'warning');
    return;
  }

  const currency = premiumPaymentCurrency;

  const existing = document.getElementById('payment-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'payment-modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:500;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';

  const tierData = PREMIUM_TIERS.find(t => t.tier === tier);
  const cardOptions = Object.keys(PAYMENT_CARDS).map(card =>
    `<label class="pm-card-option">
      <input type="radio" name="pm-card-type" value="${card}" onchange="document.getElementById('pm-submit-btn').disabled=false">
      <span class="pm-card-radio">
        <span class="pm-card-radio-dot"></span>
        <span class="pm-card-info">
          <span class="pm-card-name">${card}</span>
          <span class="pm-card-number">${PAYMENT_CARDS[card]}</span>
        </span>
      </span>
    </label>`
  ).join('');

  const countryOptions = COUNTRIES.map(c =>
    `<option value="${c.code}" ${c.code === 'UZ' ? 'selected' : ''}>${c.name}</option>`
  ).join('');

  overlay.innerHTML = `
    <div class="pm-modal" style="background:var(--ios-card);border:1px solid var(--ios-separator);border-radius:var(--radius-ios-lg);max-width:520px;width:100%;padding:28px;animation:modalIn 0.3s ease;max-height:90vh;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <div style="font-size:20px;font-weight:700;color:var(--ios-label);"><i class="ti ti-credit-card" style="margin-right:8px;color:var(--ios-blue);"></i>Payment</div>
        <button onclick="closePaymentModal()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--ios-secondary-label);padding:4px;"><i class="ti ti-x"></i></button>
      </div>

      <div class="pm-plan-info" style="background:var(--ios-bg);border-radius:var(--radius-ios-md);padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:32px;margin-bottom:6px;"><i class="ti ${tierData.icon}"></i></div>
        <div style="font-size:18px;font-weight:700;color:var(--ios-label);">${tier}</div>
        <div style="font-size:22px;font-weight:800;color:${tierData.color};margin-top:4px;" id="pm-price-display">${currency === 'USD' ? tierData.monthlyUSD : tierData.monthly} <span style="font-size:13px;color:var(--ios-secondary-label);font-weight:400;">/ month</span></div>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:12px;font-weight:600;color:var(--ios-label);display:block;margin-bottom:4px;"><i class="ti ti-world" style="margin-right:4px;"></i>Country</label>
        <select id="pm-country" class="auth-input" style="margin-bottom:0;" onchange="onPaymentCountryChange()">
          ${countryOptions}
        </select>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:12px;font-weight:600;color:var(--ios-label);display:block;margin-bottom:4px;"><i class="ti ti-phone" style="margin-right:4px;"></i>Phone Number</label>
        <input type="tel" id="pm-phone-input" class="auth-input" placeholder="+998 90 123 45 67" style="margin-bottom:0;">
      </div>

      <div class="pm-receiver" style="background:linear-gradient(135deg,rgba(88,86,214,0.1),rgba(0,122,255,0.08));border:1px solid rgba(88,86,214,0.15);border-radius:var(--radius-ios-md);padding:16px;margin-bottom:16px;text-align:center;">
        <div style="font-size:12px;color:var(--ios-secondary-label);font-weight:600;text-transform:uppercase;letter-spacing:0.3px;">Send payment to</div>
        <div style="font-size:18px;font-weight:800;margin-top:6px;color:var(--ios-label);">${CARD_HOLDER}</div>
        <div style="font-size:12px;color:var(--ios-secondary-label);margin-top:4px;">Choose a card below and transfer the exact amount</div>
      </div>

      <div style="font-size:13px;font-weight:700;color:var(--ios-label);margin-bottom:10px;"><i class="ti ti-credit-card" style="margin-right:4px;"></i>Select the card you paid to:</div>
      <div class="pm-card-options" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        ${cardOptions}
      </div>

      <div style="font-size:13px;font-weight:700;color:var(--ios-label);margin-bottom:8px;"><i class="ti ti-hash" style="margin-right:4px;"></i>Enter your card number:</div>
      <input type="text" id="pm-card-number-input" class="auth-input" placeholder="9860 1601 4234 2713" maxlength="30" style="margin-bottom:20px;font-family:var(--font-mono);letter-spacing:1px;" oninput="this.value=this.value.replace(/[^0-9\\s]/g,'')">

      <button class="ios-btn" id="pm-submit-btn" disabled onclick="submitPayment('${tier}','monthly')" style="width:100%;justify-content:center;padding:14px;font-size:15px;background:linear-gradient(135deg,#5856D6,#007AFF);color:#fff;border:none;">
        <i class="ti ti-check"></i> I Have Paid — Submit for Verification
      </button>

      <div id="pm-status" style="margin-top:12px;font-size:13px;text-align:center;display:none;"></div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function onPaymentCountryChange() {
  const country = document.getElementById('pm-country').value;
  const isUzb = isUzbekistan(country);
  premiumPaymentCountry = country;
  premiumPaymentCurrency = isUzb ? 'UZS' : 'USD';

  const tierMatch = document.querySelector('.pm-plan-info');
  if (!tierMatch) return;

  const tierName = tierMatch.querySelector('div:nth-child(2)')?.textContent;
  const tierData = PREMIUM_TIERS.find(t => t.tier === tierName);
  if (!tierData) return;

  const currency = premiumPaymentCurrency;

  const periodEl = document.getElementById('pm-price-display');
  if (!periodEl) return;

  const monthlyPrice = formatPrice(tierData, currency);
  periodEl.innerHTML = monthlyPrice + ' <span style="font-size:13px;color:var(--ios-secondary-label);font-weight:400;">/ month</span>';
}

function closePaymentModal() {
  const el = document.getElementById('payment-modal-overlay');
  if (el) el.remove();
}

async function submitPayment(tier, period) {
  const selectedCard = document.querySelector('input[name="pm-card-type"]:checked');
  if (!selectedCard) {
    toast('Please select which card you paid to.', 'warning');
    return;
  }
  const cardType = selectedCard.value;
  const cardNumber = document.getElementById('pm-card-number-input').value.trim();
  if (!cardNumber) {
    toast('Please enter your card number.', 'warning');
    return;
  }
  const phone = document.getElementById('pm-phone-input').value.trim();
  if (!phone) {
    toast('Please enter your phone number.', 'warning');
    return;
  }
  const country = document.getElementById('pm-country').value;

  const btn = document.getElementById('pm-submit-btn');
  const status = document.getElementById('pm-status');
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader" style="animation:spin 1s linear infinite;"></i> Submitting...';
  status.style.display = 'block';
  status.style.color = 'var(--ios-secondary-label)';
  status.textContent = 'Submitting your payment request...';

  try {
    const result = await SECURE_API.apiRequest('POST', '/api/auth/telegram/payment/request', {
      userId: state.authUser.id,
      tier,
      period,
      cardType,
      cardNumber,
      phone,
      country,
    });

    if (result && result.success) {
      status.style.color = 'var(--ios-green)';
      status.innerHTML = '<i class="ti ti-circle-check" style="font-size:18px;"></i> Payment request submitted!<br><br><i class="ti ti-device-mobile" style="font-size:14px;"></i> <strong>Admin will verify your payment via Telegram bot.</strong><br><br>You will be notified once your premium is activated.<br><br>Please wait, this usually takes a few minutes.';
      btn.style.display = 'none';
      document.querySelector('.pm-card-options').style.opacity = '0.5';
      document.getElementById('pm-card-number-input').disabled = true;
      document.getElementById('pm-phone-input').disabled = true;
      document.getElementById('pm-country').disabled = true;
      startPremiumPolling();
    } else {
      throw new Error(result?.error || 'Failed to submit');
    }
  } catch (err) {
    status.style.display = 'block';
    status.style.color = 'var(--ios-red)';
    status.innerHTML = '<i class="ti ti-circle-x"></i> Error: ' + err.message;
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-check"></i> I Have Paid — Submit for Verification';
  }
}

let _premiumPollTimer = null;
function startPremiumPolling() {
  stopPremiumPolling();
  _premiumPollTimer = setInterval(async () => {
    const data = await syncPremiumFromServer();
    if (data && data.tier && data.tier !== 'Free') {
      stopPremiumPolling();
      toast('<i class="ti ti-crown"></i> Premium activated! Welcome to <strong>' + data.tier + '</strong>!', 'success', 5000);
      if (typeof renderPremium === 'function') renderPremium();
    }
  }, 10000);
}
function stopPremiumPolling() {
  if (_premiumPollTimer) {
    clearInterval(_premiumPollTimer);
    _premiumPollTimer = null;
  }
}

function buyPremium(tier, period) {
  if (tier === 'Free') {
    setCurrentPlan('Free');
    if (typeof routerNavigate === 'function') { routerNavigate('/'); } else { showPage('dashboard'); }
    toast('You are on the Free plan!', 'info');
    return;
  }
}

function toggleFaq(el) {
  const isOpen = el.classList.contains('pfaq-open');
  document.querySelectorAll('.premium-faq-item.pfaq-open').forEach(item => {
    item.classList.remove('pfaq-open');
  });
  if (!isOpen) el.classList.add('pfaq-open');
  updateFaqToggleBtn();
}

function toggleAllFaq() {
  const items = document.querySelectorAll('.premium-faq-item');
  const anyClosed = Array.from(items).some(item => !item.classList.contains('pfaq-open'));
  items.forEach(item => item.classList.toggle('pfaq-open', anyClosed));
  updateFaqToggleBtn();
}

function updateFaqToggleBtn() {
  const btn = document.querySelector('.pfaq-toggle-all');
  if (!btn) return;
  const items = document.querySelectorAll('.premium-faq-item');
  const open = document.querySelectorAll('.premium-faq-item.pfaq-open').length;
  btn.textContent = open === items.length ? 'Collapse All' : 'Expand All';
}

function requirePremium(feature) {
  const plan = getCurrentPlan();
  if (plan !== 'Free') return true;
  const msg = feature
    ? '<i class="ti ti-crown" style="color:var(--ios-blue)"></i> <strong>' + feature + '</strong> is a Premium feature. <a href="#" onclick="routerNavigate(\'/premium\');return false" style="color:var(--ios-blue);text-decoration:underline;">Upgrade now</a>'
    : '<i class="ti ti-crown" style="color:var(--ios-blue)"></i> This is a <strong>Premium</strong> feature. <a href="#" onclick="routerNavigate(\'/premium\');return false" style="color:var(--ios-blue);text-decoration:underline;">Upgrade now</a>';
  toast(msg, 'info', 5000);
  return false;
}

function premiumGuard(feature, route) {
  if (requirePremium(feature)) {
    if (typeof routerNavigate === 'function') routerNavigate(route);
    else if (typeof showPage === 'function') showPage(route);
  }
}

function cancelPlan() {
  const history = getHistory();
  if (history.length && history[0].status === 'active') {
    history[0].status = 'expired';
    saveHistory(history);
  }
  setCurrentPlan('Free');
  localStorage.removeItem('vm_premium_expires');
  toast('Plan cancelled. You are now on Free.', 'info', 3000);
  renderPremium();
}
