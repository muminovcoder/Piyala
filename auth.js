let tgStepData = { username: '', code: '', sessionId: '' };
let tgPollInterval = null;

function cancelTelegramAuth() {
  document.getElementById('tg-reg-area').style.display = 'none';
  document.getElementById('auth-login-form').style.display = 'block';
  document.getElementById('tg-login-area').style.display = 'none';
  if (tgPollInterval) { clearInterval(tgPollInterval); tgPollInterval = null; }
  tgStepData = { username: '', code: '', sessionId: '' };
}

function showTgStep(step) {
  ['tg-step-form', 'tg-step-4', 'tg-step-success'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === step ? 'block' : 'none';
  });
}

function startTelegramAuth() {
  document.getElementById('tg-reg-area').style.display = 'block';
  document.getElementById('auth-login-form').style.display = 'none';
  document.getElementById('tg-login-area').style.display = 'none';
  showTgStep('tg-step-form');
  const errEl = document.getElementById('tg-reg-error');
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
}

async function sendTelegramRegister() {
  const phoneInput = document.getElementById('tg-phone-input');
  const usernameInput = document.getElementById('tg-username-input');
  const passInput = document.getElementById('tg-password-input');
  const confirmInput = document.getElementById('tg-confirm-input');
  const phone = phoneInput.value.trim();
  const username = usernameInput.value.trim().replace('@', '');
  const password = passInput.value;
  const confirm = confirmInput.value;
  const errEl = document.getElementById('tg-reg-error');
  const btn = document.getElementById('tg-send-btn');

  if (!phone || phone.length < 7) {
    if (errEl) { errEl.textContent = 'Please enter a valid phone number'; errEl.style.display = 'block'; }
    return;
  }
  if (!username || username.length < 3) {
    if (errEl) { errEl.textContent = 'Please enter a valid Telegram username'; errEl.style.display = 'block'; }
    return;
  }
  if (!password || password.length < 8) {
    if (errEl) { errEl.textContent = 'Password must be at least 8 characters'; errEl.style.display = 'block'; }
    return;
  }
  if (password !== confirm) {
    if (errEl) { errEl.textContent = 'Passwords do not match'; errEl.style.display = 'block'; }
    return;
  }

  errEl.style.display = 'none';
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span> Sending...';

  try {
    const result = await SECURE_API.telegramRegister(phone, username, password);
    if (!result || !result.success) {
      if (errEl) { errEl.textContent = result?.error || 'Server error'; errEl.style.display = 'block'; }
      btn.disabled = false;
      btn.textContent = 'Send Code';
      return;
    }

    tgStepData.username = username;
    tgStepData.sessionId = result.sessionId;
    document.getElementById('tg-username-display').textContent = '@' + username;

    showTgStep('tg-step-4');
    document.getElementById('tg-code-input').value = '';
    document.getElementById('tg-code-input').focus();

    btn.disabled = false;
    btn.textContent = 'Send Code';
  } catch (err) {
    if (errEl) { errEl.textContent = err.message || 'Failed to send code'; errEl.style.display = 'block'; }
    btn.disabled = false;
    btn.textContent = 'Send Code';
  }
}

async function verifyTelegramCode() {
  const codeInput = document.getElementById('tg-code-input');
  const code = codeInput.value.trim();
  const errEl = document.getElementById('tg-reg-error');
  const btn = document.getElementById('tg-verify-btn');

  if (!code || code.length < 4) {
    if (errEl) { errEl.textContent = 'Please enter the verification code from Telegram'; errEl.style.display = 'block'; }
    return;
  }

  errEl.style.display = 'none';
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span> Verifying...';

  try {
    const result = await SECURE_API.telegramVerifyCode(code, tgStepData.sessionId);

    if (!result || !result.success) {
      if (errEl) { errEl.textContent = result?.error || 'Invalid code or session expired'; errEl.style.display = 'block'; }
      btn.disabled = false;
      btn.textContent = 'Verify & Login';
      return;
    }

    showTgStep('tg-step-success');
    state.authUser = result.user;
    if (result.csrfToken) { try { sessionStorage.setItem('vm_csrf', result.csrfToken); } catch(_) {} }
    btn.disabled = false;
    btn.textContent = 'Verify & Login';

    const userName = state.authUser.displayName || (state.authUser.username || '').replace(/^tg_/, '');
    localStorage.setItem('vm_username', userName);
    if (typeof updateAuthUI === 'function') updateAuthUI();
    if (typeof updateSidebarXP === 'function') updateSidebarXP();

    setTimeout(async () => {
      // Push local (anonymous) data to newly authenticated account first
      await SECURE_API.syncData(state.stats, state.favorites, state.recentWords, state.grammar).catch(() => {});
      // Then load from server (merge, don't overwrite local)
      const data = await SECURE_API.loadData().catch(() => null);
      if (data) {
        if (data.stats) {
          state.stats.totalXP = Math.max(state.stats.totalXP || 0, data.stats.totalXP || 0);
          state.stats.streak = Math.max(state.stats.streak || 0, data.stats.streak || 0);
          state.stats.level = getLevel(state.stats.totalXP);
          state.stats.wordsLearned = Math.max(state.stats.wordsLearned || 0, data.stats.wordsLearned || 0);
          state.stats.correctAnswers = Math.max(state.stats.correctAnswers || 0, data.stats.correctAnswers || 0);
          state.stats.totalQuestions = Math.max(state.stats.totalQuestions || 0, data.stats.totalQuestions || 0);
          if (data.stats.heatmap) {
            var _h = state.stats.heatmap || {};
            for (var _d in data.stats.heatmap) { _h[_d] = Math.max(_h[_d] || 0, data.stats.heatmap[_d]); }
            state.stats.heatmap = _h;
          }
          if (data.stats.achievements && data.stats.achievements.length) {
            var _a = state.stats.achievements || [];
            data.stats.achievements.forEach(function(_ach) { if (_a.indexOf(_ach) === -1) _a.push(_ach); });
            state.stats.achievements = _a;
          }
        }
        if (data.favorites?.length) {
          var _existing = {};
          (state.favorites || []).forEach(function(f) { if (f.word) _existing[f.word] = true; });
          data.favorites.forEach(function(f) { if (f.word && !_existing[f.word]) state.favorites.push(f); });
        }
        if (data.grammar) {
          for (var _gk in data.grammar) {
            if (state.grammar[_gk] === undefined || state.grammar[_gk] === null) state.grammar[_gk] = data.grammar[_gk];
          }
        }
        saveState();
        updateSidebarXP();
      }
      closeAuthModal();
      if (typeof refreshDashboard === 'function') refreshDashboard();
      if (typeof updateSidebarXP === 'function') updateSidebarXP();
      if (typeof updateOnlineUsers === 'function') updateOnlineUsers();
    }, 800);
  } catch (err) {
    if (errEl) { errEl.textContent = err.message || 'Verification failed'; errEl.style.display = 'block'; }
    btn.disabled = false;
    btn.textContent = 'Verify & Login';
  }
}

function showTgLogin() {
  document.getElementById('tg-login-area').style.display = 'block';
  document.getElementById('auth-login-form').style.display = 'none';
  document.getElementById('tg-reg-area').style.display = 'none';
  const errEl = document.getElementById('tg-login-error');
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
}

function cancelTgLogin() {
  document.getElementById('tg-login-area').style.display = 'none';
  document.getElementById('auth-login-form').style.display = 'block';
  document.getElementById('tg-reg-area').style.display = 'none';
  const errEl = document.getElementById('tg-login-error');
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
}

async function submitTgLogin() {
  const usernameInput = document.getElementById('tg-login-username');
  const passInput = document.getElementById('tg-login-password');
  const username = usernameInput.value.trim().replace('@', '');
  const password = passInput.value;
  const errEl = document.getElementById('tg-login-error');
  const btn = document.getElementById('tg-login-btn');

  if (!username || !password) {
    if (errEl) { errEl.textContent = 'Please enter your Telegram username and password'; errEl.style.display = 'block'; }
    return;
  }

  errEl.style.display = 'none';
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span> Logging in...';

  try {
    const result = await SECURE_API.telegramLogin(username, password);
    if (!result || !result.success) {
      if (errEl) { errEl.textContent = result?.error || 'Invalid credentials'; errEl.style.display = 'block'; }
      btn.disabled = false;
      btn.textContent = 'Login';
      return;
    }

    state.authUser = result.user;
    if (result.csrfToken) { try { sessionStorage.setItem('vm_csrf', result.csrfToken); } catch(_) {} }
    btn.disabled = false;
    btn.textContent = 'Login';

    const userName = state.authUser.displayName || (state.authUser.username || '').replace(/^tg_/, '');
    localStorage.setItem('vm_username', userName);
    if (typeof updateAuthUI === 'function') updateAuthUI();
    if (typeof updateSidebarXP === 'function') updateSidebarXP();

    setTimeout(async () => {
      // Push local (anonymous) data to newly authenticated account first
      await SECURE_API.syncData(state.stats, state.favorites, state.recentWords, state.grammar).catch(() => {});
      // Then load from server (merge, don't overwrite local)
      const data = await SECURE_API.loadData().catch(() => null);
      if (data) {
        if (data.stats) {
          state.stats.totalXP = Math.max(state.stats.totalXP || 0, data.stats.totalXP || 0);
          state.stats.streak = Math.max(state.stats.streak || 0, data.stats.streak || 0);
          state.stats.level = getLevel(state.stats.totalXP);
          state.stats.wordsLearned = Math.max(state.stats.wordsLearned || 0, data.stats.wordsLearned || 0);
          state.stats.correctAnswers = Math.max(state.stats.correctAnswers || 0, data.stats.correctAnswers || 0);
          state.stats.totalQuestions = Math.max(state.stats.totalQuestions || 0, data.stats.totalQuestions || 0);
          if (data.stats.heatmap) {
            var _h = state.stats.heatmap || {};
            for (var _d in data.stats.heatmap) { _h[_d] = Math.max(_h[_d] || 0, data.stats.heatmap[_d]); }
            state.stats.heatmap = _h;
          }
          if (data.stats.achievements && data.stats.achievements.length) {
            var _a = state.stats.achievements || [];
            data.stats.achievements.forEach(function(_ach) { if (_a.indexOf(_ach) === -1) _a.push(_ach); });
            state.stats.achievements = _a;
          }
        }
        if (data.favorites?.length) {
          var _existing = {};
          (state.favorites || []).forEach(function(f) { if (f.word) _existing[f.word] = true; });
          data.favorites.forEach(function(f) { if (f.word && !_existing[f.word]) state.favorites.push(f); });
        }
        if (data.grammar) {
          for (var _gk in data.grammar) {
            if (state.grammar[_gk] === undefined || state.grammar[_gk] === null) state.grammar[_gk] = data.grammar[_gk];
          }
        }
        saveState();
        updateSidebarXP();
      }
      closeAuthModal();
      if (typeof refreshDashboard === 'function') refreshDashboard();
      if (typeof updateSidebarXP === 'function') updateSidebarXP();
      if (typeof updateOnlineUsers === 'function') updateOnlineUsers();
    }, 800);
  } catch (err) {
    if (errEl) { errEl.textContent = err.message || 'Login failed'; errEl.style.display = 'block'; }
    btn.disabled = false;
    btn.textContent = 'Login';
  }
}

const AUTH_HTML = `
  <div id="auth-modal" onclick="if(event.target===this)closeAuthModal()">
    <div>
      <div class="auth-modal-header">
        <div class="auth-modal-title" id="auth-modal-title">Account</div>
        <button class="modal-close" onclick="closeAuthModal()"><i class="ti ti-x"></i></button>
      </div>
      <div id="auth-form-area">
        <div id="auth-login-form">
          <button type="button" class="ios-btn social-btn" id="tg-start-btn" onclick="startTelegramAuth()" style="justify-content:center">
            <i class="ti ti-send" style="color:#26A5E4"></i> Continue with Telegram Bot
          </button>
          <div style="margin-top:16px;border-top:1px solid var(--ios-separator);padding-top:14px;text-align:center;">
            <button class="ios-btn ios-btn-secondary auth-submit" onclick="showTgLogin()" style="justify-content:center">
              <i class="ti ti-key"></i> I have an account
            </button>
          </div>
        </div>
      </div>
      <div id="tg-reg-area" style="display:none">
        <div class="auth-modal-header">
          <div class="auth-modal-title"><i class="ti ti-send" style="color:#26A5E4;margin-right:6px"></i>Register with Telegram</div>
          <button class="modal-close" onclick="cancelTelegramAuth()"><i class="ti ti-x"></i></button>
        </div>
        <div id="tg-reg-error" class="auth-error-box"></div>

        <div id="tg-step-form" style="display:block;text-align:center">
          <i class="ti ti-device-mobile" style="font-size:40px;margin:6px 0 10px;color:#5856D6;display:block"></i>
          <p style="font-size:14px;font-weight:600;color:var(--ios-label);text-align:center;margin-bottom:4px">Register with Telegram Bot</p>
          <p style="font-size:12px;color:var(--ios-secondary-label);text-align:center;margin-bottom:16px;line-height:1.5">
            Enter your phone number, Telegram username, and create a password
          </p>
          <div class="auth-field" style="text-align:left">
            <label class="auth-label"><i class="ti ti-phone"></i> Phone Number</label>
            <input type="tel" id="tg-phone-input" class="auth-input" placeholder="+998901234567" autocomplete="tel" onkeydown="if(event.key==='Enter')document.getElementById('tg-username-input').focus()">
          </div>
          <div class="auth-field" style="text-align:left">
            <label class="auth-label"><i class="ti ti-send"></i> Telegram @username</label>
            <input type="text" id="tg-username-input" class="auth-input" placeholder="@username" autocomplete="off" onkeydown="if(event.key==='Enter')document.getElementById('tg-password-input').focus()">
          </div>
          <div class="auth-field" style="text-align:left">
            <label class="auth-label"><i class="ti ti-lock"></i> Password (min 8)</label>
            <input type="password" id="tg-password-input" class="auth-input" placeholder="Enter password" autocomplete="new-password" onkeydown="if(event.key==='Enter')document.getElementById('tg-confirm-input').focus()">
          </div>
          <div class="auth-field" style="text-align:left">
            <label class="auth-label"><i class="ti ti-lock"></i> Confirm Password</label>
            <input type="password" id="tg-confirm-input" class="auth-input" placeholder="Confirm password" autocomplete="new-password" onkeydown="if(event.key==='Enter')sendTelegramRegister()">
          </div>
          <p style="font-size:11px;color:var(--ios-secondary-label);margin-top:6px;line-height:1.4">
            <i class="ti ti-bulb" style="color:#FF9500"></i> Make sure you've messaged <strong style="color:#5856D6">@VocabMasterVerifyBot</strong> on Telegram before continuing
          </p>
          <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
            <button class="ios-btn" id="tg-send-btn" onclick="sendTelegramRegister()" style="background:linear-gradient(135deg,#5856D6,#007AFF);color:#fff;border:none;justify-content:center">
              <i class="ti ti-send"></i> Send Code via Telegram
            </button>
          </div>
        </div>

        <div id="tg-step-4" style="display:none;text-align:center">
          <i class="ti ti-key" style="font-size:40px;margin:6px 0 10px;color:#5856D6;display:block"></i>
          <p style="font-size:14px;font-weight:600;color:var(--ios-label);margin-bottom:4px">Check your Telegram</p>
          <p style="font-size:12px;color:var(--ios-secondary-label);margin-bottom:16px;line-height:1.5">
            A verification code has been sent to <strong id="tg-username-display" style="color:#5856D6">@username</strong><br>
            Open <strong style="color:#5856D6">@VocabMasterVerifyBot</strong> in Telegram and enter the code below
          </p>
          <div class="auth-field" style="max-width:220px;margin:0 auto">
            <label class="auth-label">Verification Code</label>
            <input type="text" id="tg-code-input" class="auth-input" placeholder="_ _ _ _ _ _" autocomplete="off" style="text-align:center;font-size:20px;font-weight:700;letter-spacing:6px" maxlength="6" oninput="this.value=this.value.replace(/\D/g,'').slice(0,6)" onkeydown="if(event.key==='Enter')verifyTelegramCode()">
          </div>
          <div style="margin-top:4px;font-size:11px;color:var(--ios-secondary-label)">
            Didn't receive a code?
            <button class="auth-toggle-btn" onclick="sendTelegramRegister()">Resend</button>
          </div>
          <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
            <button class="ios-btn" id="tg-verify-btn" onclick="verifyTelegramCode()" style="background:linear-gradient(135deg,#5856D6,#007AFF);color:#fff;border:none;justify-content:center">
              <i class="ti ti-check"></i> Verify & Login
            </button>
          </div>
        </div>

        <div id="tg-step-success" style="display:none;text-align:center;padding:20px 0">
          <i class="ti ti-circle-check" style="font-size:48px;color:#34C759;margin-bottom:10px;display:block"></i>
          <p style="font-size:16px;font-weight:600;color:var(--ios-label)">Account created successfully!</p>
          <p style="font-size:13px;color:var(--ios-secondary-label);margin-top:4px">Welcome to VocabMaster AI</p>
        </div>
      </div>

      <div id="tg-login-area" style="display:none">
        <div class="auth-modal-header">
          <div class="auth-modal-title"><i class="ti ti-send" style="color:#26A5E4;margin-right:6px"></i>Login with Telegram</div>
          <button class="modal-close" onclick="cancelTgLogin()"><i class="ti ti-x"></i></button>
        </div>
        <div id="tg-login-error" class="auth-error-box"></div>

        <i class="ti ti-key" style="font-size:40px;margin:6px 0 10px;color:#5856D6;display:block;text-align:center"></i>
        <p style="font-size:14px;font-weight:600;color:var(--ios-label);text-align:center;margin-bottom:4px">Login to your account</p>
        <p style="font-size:12px;color:var(--ios-secondary-label);text-align:center;margin-bottom:16px;line-height:1.5">
          Enter your Telegram username and password
        </p>
        <div class="auth-field">
          <label class="auth-label">Telegram @username</label>
          <input type="text" id="tg-login-username" class="auth-input" placeholder="@username" autocomplete="username" onkeydown="if(event.key==='Enter')document.getElementById('tg-login-password').focus()">
        </div>
        <div class="auth-field">
          <label class="auth-label">Password</label>
          <input type="password" id="tg-login-password" class="auth-input" placeholder="Enter your password" autocomplete="current-password" onkeydown="if(event.key==='Enter')submitTgLogin()">
        </div>
        <div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
          <button class="ios-btn" id="tg-login-btn" onclick="submitTgLogin()" style="background:linear-gradient(135deg,#5856D6,#007AFF);color:#fff;border:none;justify-content:center">
            <i class="ti ti-login"></i> Login
          </button>
        </div>
      </div>

      <div id="auth-user-info">
        <div class="auth-user-card">
          <div class="auth-avatar-lg" id="auth-avatar-display">U</div>
          <div class="auth-display-name" id="auth-display-name">User</div>
          <div class="auth-display-email" id="auth-display-email">email@example.com</div>
          <div class="auth-sync-badge"><i class="ti ti-circle-check" style="color:#34C759"></i> Synced to cloud</div>
          <button class="ios-btn ios-btn-secondary auth-signout" onclick="handleLogout()"><i class="ti ti-logout"></i> Sign Out</button>
        </div>
      </div>
    </div>
  </div>
`;

const AUTH_STYLES = `
  #auth-modal {
    position:fixed; inset:0; z-index:400;
    background:rgba(0,0,0,0.5); backdrop-filter:blur(var(--glass-blur-sm)); -webkit-backdrop-filter:blur(var(--glass-blur-sm));
    display:none; align-items:center; justify-content:center; padding:20px;
  }
  #auth-modal > div {
    background:var(--ios-card); border:1px solid var(--ios-separator);
    border-radius:var(--radius-ios-lg);
    max-width:min(360px,calc(100vw - 32px)); width:100%;
    animation:modalIn 0.25s ease;
    padding:clamp(16px,3vw,20px);
  }
  .auth-modal-header {
    display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;
  }
  .auth-modal-title {
    font-size:17px; font-weight:700; color:var(--ios-label);
  }
  .auth-field { margin-bottom:10px; }
  .auth-label {
    font-size:11px; color:var(--ios-secondary-label); display:block; margin-bottom:3px; font-weight:600;
    display:flex; align-items:center; gap:4px;
  }
  .auth-input {
    width:100%; background:var(--ios-bg); border:1px solid var(--ios-separator);
    border-radius:var(--radius-ios); padding:10px 14px;
    color:var(--ios-label); font-size:13px;
    outline:none; transition:border-color 0.2s;
  }
  .auth-input:focus { border-color:#5856D6; }
  .auth-input::placeholder { color:var(--ios-muted); }
  #auth-error {
    color:#FF3B30; font-size:13px; margin-bottom:10px;
    display:none; padding:8px 12px; border-radius:var(--radius-ios);
    background:rgba(255,59,48,0.08); border:1px solid rgba(255,59,48,0.15);
    line-height:1.5;
  }
  .auth-submit { width:100%; justify-content:center; }
  .auth-toggle-btn {
    background:none; border:none; color:#5856D6;
    cursor:pointer; font-size:11px;
    text-decoration:underline; margin-left:2px;
  }
  .auth-user-card { text-align:center; padding:16px 0; }
  .auth-avatar-lg {
    width:60px; height:60px; border-radius:50%;
    background:linear-gradient(135deg,#5856D6,#007AFF);
    display:flex; align-items:center; justify-content:center;
    font-size:26px; font-weight:700; color:#fff;
    margin:0 auto 10px;
  }
  .auth-avatar-lg img { width:60px; height:60px; border-radius:50%; object-fit:cover; }
  .auth-display-name {
    font-size:17px; font-weight:700; color:var(--ios-label);
  }
  .auth-display-email { font-size:13px; color:var(--ios-secondary-label); margin-top:2px; }
  .auth-sync-badge {
    margin-top:14px; font-size:12px; color:#34C759;
    display:flex; align-items:center; justify-content:center; gap:4px;
  }
  .auth-signout {
    width:100%; justify-content:center; margin-top:16px;
  }
  .social-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; padding:11px 14px; font-size:14px; font-weight:600; cursor:pointer; border:1px solid var(--ios-separator); background:var(--ios-bg); border-radius:var(--radius-ios); color:var(--ios-label); transition:transform 0.12s ease; }
  .social-btn:active { transform:scale(0.97); }
  .social-btn:hover { border-color:#5856D6; }
  .auth-error-box {
    color:#FF3B30; font-size:13px; margin-bottom:10px;
    display:none; padding:8px 12px; border-radius:var(--radius-ios);
    background:rgba(255,59,48,0.08); border:1px solid rgba(255,59,48,0.15);
    line-height:1.5;
  }
  .btn-spinner {
    width:14px; height:14px; border:2px solid rgba(255,255,255,0.3);
    border-top-color:#fff; border-radius:50%;
    animation:spin 0.6s linear infinite;
    display:inline-block; vertical-align:middle;
  }
  @keyframes spin { to { transform:rotate(360deg); } }
`;

function initAuth() {
  const s = document.createElement('style');
  s.textContent = AUTH_STYLES;
  document.head.appendChild(s);
  const el = document.createElement('div');
  el.innerHTML = AUTH_HTML;
  document.body.insertBefore(el.firstElementChild, document.body.firstChild);
}

function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.getElementById('auth-modal-title').textContent = state.authUser ? 'Account' : 'Connect with Telegram Bot';
  if (state.authUser) {
    document.getElementById('auth-login-form').style.display = 'none';
    document.getElementById('auth-user-info').style.display = 'block';
    const name = state.authUser?.displayName || (state.authUser?.username || '').replace(/^tg_/, '');
    const displayEmail = state.authUser?.telegram?.username
      ? '@' + state.authUser.telegram.username
      : (state.authUser.email || '');
    if (state.authUser?.avatarUrl) {
      document.getElementById('auth-avatar-display').innerHTML = '<img src="' + state.authUser.avatarUrl + '" alt="" style="width:64px;height:64px;border-radius:50%;object-fit:cover">';
    } else {
      document.getElementById('auth-avatar-display').textContent = name.length > 0 ? name[0].toUpperCase() : '?';
    }
    document.getElementById('auth-display-name').textContent = name;
    document.getElementById('auth-display-email').textContent = displayEmail;
  } else {
    document.getElementById('auth-login-form').style.display = 'block';
    document.getElementById('auth-user-info').style.display = 'none';
    document.getElementById('tg-reg-area').style.display = 'none';
    document.getElementById('tg-login-area').style.display = 'none';
  showTgStep('tg-step-form');
    const errEl = document.getElementById('tg-reg-error');
    if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.style.display = 'none';
  document.getElementById('tg-reg-area').style.display = 'none';
  document.getElementById('tg-login-area').style.display = 'none';
  if (tgPollInterval) { clearInterval(tgPollInterval); tgPollInterval = null; }
  tgStepData = { username: '', code: '', sessionId: '' };
}

async function handleLogout() {
  await SECURE_API.logout();
  state.authUser = null;
  state.isOnline = false;
  updateAuthUI();
  closeAuthModal();
}

function updateAuthUI() {
  const badge = document.getElementById('sidebar-auth-badge');
  const avatar = document.getElementById('sidebar-avatar');
  const sidebarUsername = document.getElementById('sidebar-username');
  const sidebarUser = document.getElementById('sidebar-user');
  const greetingName = document.getElementById('greeting-name');
  const topbarName = document.getElementById('topbar-name');
  const topbarAvatar = document.getElementById('topbar-avatar');
  if (state.authUser) {
    if (badge) badge.style.display = 'block';
    if (sidebarUser) {
      sidebarUser.title = 'View Profile';
      sidebarUser.onclick = () => routerNavigate('/account/profile');
    }
    const name = state.authUser.displayName || (state.authUser.username || '').replace(/^tg_/, '');
    if (state.authUser.avatarUrl) {
      avatar.innerHTML = '<img src="' + state.authUser.avatarUrl + '" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover">';
    } else {
      avatar.textContent = name.length > 0 ? name[0].toUpperCase() : '?';
    }
    if (sidebarUsername) sidebarUsername.textContent = name;
    if (greetingName) greetingName.textContent = name;
    if (topbarName) topbarName.textContent = name;
    if (topbarAvatar) topbarAvatar.textContent = name.length > 0 ? name[0].toUpperCase() : 'U';
    localStorage.setItem('vm_username', name);
  } else {
    if (badge) badge.style.display = 'none';
    if (sidebarUser) {
      sidebarUser.title = 'Connect with Bot';
      sidebarUser.onclick = openAuthModal;
    }
    avatar.textContent = '🤖';
    if (sidebarUsername) sidebarUsername.textContent = 'Connect with Bot';
    if (topbarName) topbarName.textContent = 'Guest';
    if (topbarAvatar) topbarAvatar.textContent = 'U';
  }
  // Update sidebar premium badge
  const premiumBadge = document.getElementById('sidebar-premium-badge');
  if (premiumBadge) {
    const plan = (typeof getCurrentPlan === 'function') ? getCurrentPlan() : 'Free';
    premiumBadge.style.display = plan !== 'Free' ? 'block' : 'none';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuth);
} else {
  initAuth();
}
