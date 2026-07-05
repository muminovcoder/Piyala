/* ==========================================================================
   Piyala — Speaking Practice Module (v2)
   Real-time peer-to-peer & AI speaking with WebRTC, SpeechRecognition, AI TTS
   ========================================================================== */

const SPEAKING = (() => {
  'use strict';

  // ─── Constants ────────────────────────────────────────────────────────────
  const COLORS = ['#5B3DE8','#22D3EE','#F59E0B','#EF4444','#EC4899','#00C48C','#7C6FFF','#FF6B35'];

  const TURN_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    {
      urls: process.env.TURN_URL || 'turn:openrelay.metered.ca:80',
      username: process.env.TURN_USERNAME || 'openrelayproject',
      credential: process.env.TURN_CREDENTIAL || 'openrelayproject',
    },
    {
      urls: process.env.TURN_URL_TLS || 'turn:openrelay.metered.ca:443',
      username: process.env.TURN_USERNAME || 'openrelayproject',
      credential: process.env.TURN_CREDENTIAL || 'openrelayproject',
    },
  ];

  const STATES = {
    IDLE: 'idle',
    SEARCHING: 'searching',
    REQUESTED: 'requested',
    ACCEPTED: 'accepted',
    IN_SESSION: 'in_session',
    COMPLETE: 'complete',
    FEEDBACK: 'feedback',
    ERROR: 'error',
  };

  const VALID_TRANSITIONS = {
    [STATES.IDLE]:     [STATES.SEARCHING, STATES.ACCEPTED],
    [STATES.SEARCHING]: [STATES.IDLE, STATES.REQUESTED, STATES.ERROR],
    [STATES.REQUESTED]: [STATES.IDLE, STATES.ACCEPTED, STATES.ERROR],
    [STATES.ACCEPTED]:  [STATES.IN_SESSION, STATES.IDLE, STATES.ERROR],
    [STATES.IN_SESSION]: [STATES.COMPLETE, STATES.ERROR],
    [STATES.COMPLETE]:  [STATES.FEEDBACK],
    [STATES.FEEDBACK]:  [STATES.IDLE],
    [STATES.ERROR]:     [STATES.IDLE],
  };

  const DEFAULT_SETTINGS = {
    questionCount: 6,
    timeLimit: 120,
    topic: 'general',
    accent: 'en-US',
    voiceRate: 0.85,
    autoAdvance: false,
  };

  // ─── State ────────────────────────────────────────────────────────────────
  let _state = STATES.IDLE;
  let _gender = 'any';
  let _level = 'beginner';
  let _currentRequestId = null;
  let _currentSessionId = null;
  let _questions = [];
  let _currentIndex = 0;
  let _whoStarts = null;
  let _partnerInfo = null;
  let _pollTimer = null;
  let _requestPollTimer = null;
  let _sessionPollTimer = null;
  let _feedbackData = null;
  let _notiActive = false;
  let _pendingSessionJoin = null;
  let _ws = null;
  let _localStream = null;
  let _peerConnection = null;
  let _micEnabled = false;
  let _rating = 0;
  let _wsConnected = false;
  let _wsReconnectAttempts = 0;
  let _wsReconnectTimer = null;
  let _wsIntendedClose = false;
  let _speechRecognition = null;
  let _isRecognizing = false;
  let _settings = { ...DEFAULT_SETTINGS };
  let _notificationEl = null;

  // ─── DOM Helpers (XSS-safe) ──────────────────────────────────────────────
  const dom = {
    el(tag, attrs = {}, ...children) {
      const el = document.createElement(tag);
      for (const [k, v] of Object.entries(attrs)) {
        if (k === 'className') el.className = v;
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (k.startsWith('on')) el[k] = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else el.setAttribute(k, v);
      }
      for (const child of children) {
        if (child == null) continue;
        if (typeof child === 'string' || typeof child === 'number') {
          el.appendChild(document.createTextNode(String(child)));
        } else if (child instanceof Node) {
          el.appendChild(child);
        } else if (Array.isArray(child)) {
          el.append(...child.filter(Boolean));
        }
      }
      return el;
    },

    text(s) {
      if (!s) return '';
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    icon(name, style = {}) {
      return dom.el('i', { className: `ti ti-${name}`, style });
    },

    btn(label, cls, onClick, extra = {}) {
      const b = dom.el('button', { className: `sp-btn ${cls}`, ...extra }, label);
      if (onClick) b.addEventListener('click', onClick);
      return b;
    },

    skeleton(lines = 3) {
      const items = [];
      for (let i = 0; i < lines; i++) {
        const w = 60 + Math.random() * 40;
        items.push(dom.el('div', {
          className: 'sp-skeleton-line',
          style: { width: `${w}%` },
        }));
      }
      return dom.el('div', { className: 'sp-skeleton' }, ...items);
    },

    clear(parent) {
      while (parent?.firstChild) parent.removeChild(parent.firstChild);
    },

    html(el, content) {
      dom.clear(el);
      if (typeof content === 'string') {
        el.innerHTML = content;
      } else if (content instanceof Node) {
        el.appendChild(content);
      }
    },
  };

  // ─── State Machine ────────────────────────────────────────────────────────
  function setState(newState) {
    const allowed = VALID_TRANSITIONS[_state] || [];
    if (!allowed.includes(newState) && _state !== STATES.ERROR) {
      console.warn(`SPEAKING: Invalid transition ${_state} → ${newState}`);
      return false;
    }
    const prev = _state;
    _state = newState;
    window.dispatchEvent(new CustomEvent('speaking-state-change', {
      detail: { prev, current: _state },
    }));
    return true;
  }

  // ─── Error Handling ──────────────────────────────────────────────────────
  function handleError(context, err) {
    const msg = err?.message || err || 'Unknown error';
    console.error(`SPEAKING [${context}]:`, err);
    showNotification(`Error: ${msg}`, 'error');
    setState(STATES.ERROR);
    return null;
  }

  function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('sp-notification-overlay');
    if (!container) return;
    const colors = {
      info: '#5856D6',
      success: '#34C759',
      error: '#FF3B30',
      warning: '#FF9500',
    };
    const color = colors[type] || colors.info;
    const noti = dom.el('div', { className: 'sp-notification', style: { borderTop: `3px solid ${color}` } },
      dom.el('div', { className: 'sp-noti-text' }, message),
    );
    container.appendChild(noti);
    setTimeout(() => {
      noti.style.opacity = '0';
      noti.style.transform = 'translateY(-10px)';
      setTimeout(() => noti.remove(), 300);
    }, duration);
  }

  // ─── Base URL / Fetch ─────────────────────────────────────────────────────
  function _baseUrl() {
    return typeof SECURE_API !== 'undefined' && SECURE_API.getBaseUrl
      ? SECURE_API.getBaseUrl()
      : '';
  }

  function _baseWsUrl() {
    return _baseUrl().replace(/^http/, 'ws') + '/ws';
  }

  async function _fetch(url, options, _retried) {
    try {
      const r = await fetch(url, options);
      if (r.status === 401 && !_retried) {
        const d = await r.json().catch(() => ({}));
        if (d?.code === 'TOKEN_EXPIRED' && typeof SECURE_API !== 'undefined') {
          const ok = await SECURE_API.refreshTokens();
          if (ok) return fetch(url, options);
        }
        return r;
      }
      return r;
    } catch (err) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        showNotification('Network error — please check your connection', 'warning');
      }
      throw err;
    }
  }

  async function _api(method, path, body = null) {
    const opts = {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) opts.body = JSON.stringify(body);
    const r = await _fetch(`${_baseUrl()}${path}`, opts);
    if (!r.ok) {
      const err = await r.json().catch(() => ({ error: r.statusText }));
      throw new Error(err.error || `Request failed (${r.status})`);
    }
    return r.json();
  }

  // ─── Auth ─────────────────────────────────────────────────────────────────
  function _authUser() {
    return state?.authUser || null;
  }

  // ─── Voice Recognition (Speech-to-Text) ──────────────────────────────────
  function _initSpeechRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      console.warn('SPEAKING: SpeechRecognition not supported in this browser');
      return null;
    }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = _settings.accent || 'en-US';
    recognition.maxAlternatives = 5;
    return recognition;
  }

  function _startVoiceRecognition(onResult, onError, onEnd) {
    if (_isRecognizing) return;
    if (!_speechRecognition) {
      _speechRecognition = _initSpeechRecognition();
    }
    if (!_speechRecognition) {
      if (onError) onError(new Error('Speech recognition not supported'));
      return;
    }
    _speechRecognition.lang = _settings.accent || 'en-US';
    _isRecognizing = true;

    _speechRecognition.onresult = (event) => {
      let interim = '';
      let final = '';
      let clarityAvg = 0;
      let clarityCount = 0;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const topAlt = event.results[i][0];
        const transcript = topAlt.transcript;
        if (event.results[i].isFinal) {
          const topConf = topAlt.confidence || 0;
          const secondConf = (event.results[i][1]?.confidence) || 0;
          const thirdConf = (event.results[i][2]?.confidence) || 0;
          const gap = topConf - secondConf;
          const secondGap = secondConf - thirdConf;
          const clarity = Math.min(1, Math.max(0, topConf * 0.50 + Math.min(gap, 1) * 0.40 + Math.min(secondGap, 0.5) * 0.10));
          final += transcript;
          clarityAvg += clarity;
          clarityCount++;
        } else {
          interim += transcript;
        }
      }
      if (onResult) onResult({
        final,
        interim,
        isFinal: !!final,
        pronunClarity: clarityCount > 0 ? clarityAvg / clarityCount : null,
      });
    };

    _speechRecognition.onerror = (event) => {
      _isRecognizing = false;
      if (event.error === 'no-speech') {
        // silently retry
        setTimeout(() => _startVoiceRecognition(onResult, onError, onEnd), 300);
        return;
      }
      if (onError) onError(new Error(`Speech error: ${event.error}`));
    };

    _speechRecognition.onend = () => {
      _isRecognizing = false;
      if (onEnd) onEnd();
    };

    try {
      _speechRecognition.start();
    } catch (err) {
      _isRecognizing = false;
      if (onError) onError(err);
    }
  }

  function _stopVoiceRecognition() {
    if (_speechRecognition && _isRecognizing) {
      try { _speechRecognition.stop(); } catch (_) { /* ignore */ }
    }
    _isRecognizing = false;
  }

  // ─── TTS: Real Human Voice ──────────────────────────────────────────────
  function _speakWithAI(text, accent = 'en-US', rate = 0.85) {
    if (!text) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    _stopVoiceRecognition();
    _speakWithNeuralTTS(text, accent, rate);
  }

  function _findBestNeuralVoice(targetAccent) {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    const targetLang = targetAccent || 'en-US';
    const targetBase = targetLang.slice(0, 2);

    const scored = voices
      .filter(v => v.lang.startsWith(targetBase))
      .map(v => {
        const name = v.name.toLowerCase();
        let score = 0;

        // Exact accent match
        if (v.lang === targetLang) score += 50;

        // Neural/premium/enhanced voices (most natural)
        if (name.includes('neural')) score += 100;
        else if (name.includes('premium')) score += 90;
        else if (name.includes('enhanced')) score += 80;

        // Platform-specific natural voices
        if (name.includes('google') && name.includes('wavenet')) score += 90;
        if (name.includes('apple') && name.includes('premium')) score += 85;
        if (name.includes('samantha') || name.includes('zoe')) score += 75;
        if (name.includes('daniel') || name.includes('karen')) score += 70;

        // Microsoft Neural (most natural on Windows/Edge)
        if (name.includes('microsoft jenny') || name.includes('microsoft aria') || name.includes('microsoft toni')) score += 110;
        if (name.includes('microsoft mark') || name.includes('microsoft ryan') || name.includes('microsoft guy')) score += 108;
        if (name.includes('microsoft david neural') || name.includes('microsoft zira neural')) score += 105;
        if (name.includes('microsoft libby') || name.includes('microsoft natasha') || name.includes('microsoft clara')) score += 107;

        // Google Neural voices (Android/Chrome)
        if (name.includes('google uk english female') || name.includes('google uk female')) score += 85;
        if (name.includes('google us english')) score += 80;

        // Female voice preference for language learning
        const isFemale = name.includes('female') || name.includes('zira') || name.includes('jenny') ||
                         name.includes('aria') || name.includes('samantha') || name.includes('zoe') ||
                         name.includes('karen') || name.includes('toni') || name.includes('libby') ||
                         name.includes('natasha') || name.includes('clara');
        if (isFemale) score += 5;

        return { voice: v, score };
      });

    scored.sort((a, b) => b.score - a.score);
    return scored.length ? scored[0].voice : null;
  }

  function _speakWithNeuralTTS(text, accent, rate) {
    const voices = window.speechSynthesis?.getVoices() || [];

    // Wait for voices to load if needed
    if (voices.length === 0) {
      const onVoices = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
        _speakWithNeuralTTS(text, accent, rate);
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoices);
      return;
    }

    // Split into sentences for natural pacing
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let idx = 0;

    function playNext() {
      if (idx >= sentences.length) return;
      const s = sentences[idx].trim();
      if (!s) { idx++; playNext(); return; }

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(s);
      utter.lang = accent || 'en-US';
      utter.rate = rate || 0.85;
      utter.pitch = 1.0;
      utter.volume = 1.0;

      const best = _findBestNeuralVoice(accent);
      if (best) utter.voice = best;

      utter.onend = () => { idx++; setTimeout(playNext, 250); };
      utter.onerror = () => { idx++; setTimeout(playNext, 250); };
      window.speechSynthesis.speak(utter);
    }

    playNext();
  }

  // ─── Voice selector UI ──────────────────────────────────────────────────
  function renderVoiceSelector() {
    const voices = window.speechSynthesis?.getVoices() || [];
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    const accents = [...new Set(enVoices.map(v => v.lang))];

    const accentOptions = accents.length > 0
      ? accents.map(a => dom.el('option', {
          value: a,
          selected: a === _settings.accent || undefined,
        }, a))
      : [dom.el('option', { value: 'en-US', selected: true }, 'en-US (default)')];

    const select = dom.el('select', {
      className: 'sp-voice-select',
      onchange: (e) => {
        _settings.accent = e.target.value;
        localStorage.setItem('vm_speaking_accent', _settings.accent);
      },
    }, ...accentOptions);

    return dom.el('div', { className: 'sp-voice-selector' },
      dom.el('label', { className: 'sp-voice-label' }, 'Voice Accent:'),
      select,
    );
  }

  // ─── WebSocket with Reconnect ───────────────────────────────────────────
  function _connectWS() {
    if (_ws) {
      _wsIntendedClose = true;
      try { _ws.close(); } catch (_) { /* ignore */ }
    }
    _wsIntendedClose = false;
    _wsReconnectAttempts = 0;

    const connect = () => {
      if (_wsIntendedClose) return;
      const url = _baseWsUrl();
      try {
        _ws = new WebSocket(url);
      } catch (err) {
        _scheduleWSReconnect();
        return;
      }

      _ws.onopen = () => {
        _wsConnected = true;
        _wsReconnectAttempts = 0;
        if (_currentSessionId) {
          _ws.send(JSON.stringify({ type: 'join', sessionId: _currentSessionId }));
        }
        _updateMicUI();
      };

      _ws.onmessage = (event) => {
        let msg;
        try { msg = JSON.parse(event.data); } catch (_) { return; }
        _handleWSMessage(msg);
      };

      _ws.onclose = (event) => {
        _wsConnected = false;
        _ws = null;
        _updateMicUI();
        if (!_wsIntendedClose && event.code !== 1000) {
          _scheduleWSReconnect();
        }
      };

      _ws.onerror = () => {
        _wsConnected = false;
        // onclose will fire after onerror
      };
    };

    connect();
  }

  function _scheduleWSReconnect() {
    if (_wsIntendedClose) return;
    const delay = Math.min(1000 * Math.pow(2, _wsReconnectAttempts), 30000);
    _wsReconnectAttempts++;
    if (_wsReconnectTimer) clearTimeout(_wsReconnectTimer);
    _wsReconnectTimer = setTimeout(() => {
      if (_state === STATES.IN_SESSION || _state === STATES.SEARCHING || _state === STATES.REQUESTED) {
        _connectWS();
      }
    }, delay);
  }

  function _disconnectWS() {
    _wsIntendedClose = true;
    if (_wsReconnectTimer) {
      clearTimeout(_wsReconnectTimer);
      _wsReconnectTimer = null;
    }
    if (_ws) {
      try {
        if (_ws.readyState === WebSocket.OPEN) {
          _ws.send(JSON.stringify({ type: 'leave' }));
        }
        _ws.close();
      } catch (_) { /* ignore */ }
      _ws = null;
    }
    _wsConnected = false;
    _updateMicUI();
  }

  function _handleWSMessage(msg) {
    switch (msg.type) {
      case 'room-joined':
        _wsConnected = true;
        _updateMicUI();
        if (msg.userCount === 2) {
          setTimeout(() => _initWebRTC(msg.isFirst), 500);
        }
        break;
      case 'peer-joined':
        _initWebRTC(true);
        break;

      // ─── Session Push Updates (no more polling!) ───
      case 'session-update':
        if (msg.sessionId === _currentSessionId && _state === STATES.IN_SESSION) {
          _applySessionUpdate(msg.data);
        }
        break;
      case 'request-accepted':
        if (msg.requestId === _currentRequestId) {
          _handleRequestAccepted(msg.sessionId);
        }
        break;
      case 'request-received':
        _showRequestNotification(msg.request);
        break;

      case 'offer':
        if (msg.sdp) {
          if (!_peerConnection) _initWebRTC(false);
          _peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp))
            .then(() => _peerConnection.createAnswer())
            .then((desc) => _peerConnection.setLocalDescription(desc))
            .then(() => {
              if (_ws) _ws.send(JSON.stringify({ type: 'answer', sdp: _peerConnection.localDescription }));
            })
            .catch((err) => console.error('SPEAKING: offer handling error:', err));
        }
        break;
      case 'answer':
        if (msg.sdp && _peerConnection) {
          _peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp))
            .catch((err) => console.error('SPEAKING: answer handling error:', err));
        }
        break;
      case 'ice-candidate':
        if (msg.candidate && _peerConnection) {
          _peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate))
            .catch(() => { /* ignore benign ICE errors */ });
        }
        break;
    }
  }

  function _applySessionUpdate(data) {
    if (data.current_index !== undefined && data.current_index !== _currentIndex) {
      _currentIndex = data.current_index;
      if (_currentIndex >= (_settings.questionCount || 6)) {
        setState(STATES.COMPLETE);
        _renderComplete();
        _submitFeedback();
      } else {
        try {
          if (data.questions) {
            const qs = typeof data.questions === 'string' ? JSON.parse(data.questions) : data.questions;
            if (qs?.length > 0) _questions = qs;
          }
        } catch (_) { /* ignore */ }
        if (data.who_starts) _whoStarts = data.who_starts;
        _renderSession();
      }
    }
  }

  function _handleRequestAccepted(sessionId) {
    _currentRequestId = null;
    _pendingSessionJoin = {
      sessionId,
      partner: _partnerInfo,
      level: _level || 'beginner',
    };
    setState(STATES.ACCEPTED);
    _renderJoinButton(_pendingSessionJoin);
  }

  // ─── WebRTC ──────────────────────────────────────────────────────────────
  function _initWebRTC(isOfferer) {
    if (_peerConnection) {
      _peerConnection.close();
      _peerConnection = null;
    }

    _peerConnection = new RTCPeerConnection({ iceServers: TURN_SERVERS });

    _peerConnection.onicecandidate = (event) => {
      if (event.candidate && _ws && _ws.readyState === WebSocket.OPEN) {
        _ws.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate }));
      }
    };

    _peerConnection.ontrack = (event) => {
      let audioEl = document.getElementById('sp-remote-audio');
      if (!audioEl) {
        audioEl = dom.el('audio', { id: 'sp-remote-audio', autoplay: 'true' });
        document.body.appendChild(audioEl);
      }
      audioEl.srcObject = event.streams[0];
    };

    _peerConnection.oniceconnectionstatechange = () => {
      if (_peerConnection?.iceConnectionState === 'disconnected' ||
          _peerConnection?.iceConnectionState === 'failed') {
        showNotification('Connection lost — trying to reconnect...', 'warning');
      }
    };

    if (_localStream) {
      for (const track of _localStream.getTracks()) {
        _peerConnection.addTrack(track, _localStream);
      }
    }

    if (isOfferer) {
      _peerConnection.createOffer()
        .then((desc) => _peerConnection.setLocalDescription(desc))
        .then(() => {
          if (_ws) {
            _ws.send(JSON.stringify({ type: 'offer', sdp: _peerConnection.localDescription }));
          }
        })
        .catch((err) => console.error('SPEAKING: createOffer error:', err));
    }
  }

  // ─── Microphone ──────────────────────────────────────────────────────────
  function _toggleMic() {
    if (_micEnabled) {
      _disableMic();
    } else {
      _enableMic();
    }
  }

  async function _enableMic() {
    if (location.protocol !== 'https:' &&
        location.hostname !== 'localhost' &&
        location.hostname !== '127.0.0.1') {
      showNotification('Microphone requires HTTPS', 'warning');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      _localStream = stream;
      _micEnabled = true;
      if (_peerConnection) {
        for (const track of stream.getTracks()) {
          _peerConnection.addTrack(track, stream);
        }
      }
      _updateMicUI();
    } catch (err) {
      showNotification(`Microphone access denied: ${err.message}`, 'error');
      _updateMicUI();
    }
  }

  function _disableMic() {
    if (_localStream) {
      for (const t of _localStream.getTracks()) t.stop();
      _localStream = null;
    }
    if (_peerConnection) {
      for (const s of _peerConnection.getSenders()) {
        if (s.track?.kind === 'audio') _peerConnection.removeTrack(s);
      }
    }
    _micEnabled = false;
    _updateMicUI();
  }

  function _updateMicUI() {
    const btn = document.getElementById('sp-mic-btn');
    if (btn) {
      btn.innerHTML = _micEnabled
        ? '<i class="ti ti-volume"></i> Microphone On'
        : '<i class="ti ti-volume-off"></i> Microphone Off';
    }
    const statusEl = document.querySelector('.sp-mic-status');
    if (statusEl) {
      if (_wsConnected) {
        statusEl.innerHTML = '<span style="color:#34C759">●</span> Connected';
      } else if (_ws) {
        statusEl.innerHTML = '<span style="color:#FF9500">●</span> Connecting...';
      } else {
        statusEl.innerHTML = '<span style="color:#FF3B30">●</span> Disconnected';
      }
    }
  }

  // ─── Cleanup ─────────────────────────────────────────────────────────────
  function _cleanupMedia() {
    _disconnectWS();
    if (_peerConnection) { _peerConnection.close(); _peerConnection = null; }
    if (_localStream) {
      for (const t of _localStream.getTracks()) t.stop();
      _localStream = null;
    }
    _micEnabled = false;
    _stopVoiceRecognition();
    const audioEl = document.getElementById('sp-remote-audio');
    if (audioEl) {
      audioEl.pause();
      audioEl.srcObject = null;
      audioEl.remove();
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function _stopPoll(type) {
    if ((!type || type === 'request') && _requestPollTimer) {
      clearInterval(_requestPollTimer);
      _requestPollTimer = null;
    }
    if ((!type || type === 'session') && _sessionPollTimer) {
      clearInterval(_sessionPollTimer);
      _sessionPollTimer = null;
    }
    if ((!type || type === 'main') && _pollTimer) {
      clearInterval(_pollTimer);
      _pollTimer = null;
    }
  }

  function _resetAll() {
    _cleanupMedia();
    _stopPoll();
    _state = STATES.IDLE;
    _currentRequestId = null;
    _currentSessionId = null;
    _questions = [];
    _currentIndex = 0;
    _whoStarts = null;
    _partnerInfo = null;
    _feedbackData = null;
    _rating = 0;
    _pendingSessionJoin = null;
    _speechRecognition = null;
    _isRecognizing = false;
  }

  // ─── Avatar helpers ─────────────────────────────────────────────────────
  function _avatarColor(name) {
    let n = 0;
    for (let i = 0; i < (name || '').length; i++) n += name.charCodeAt(i);
    return COLORS[n % COLORS.length];
  }

  function _initial(name) {
    return (name || 'U')[0].toUpperCase();
  }

  // ─── Settings Panel ─────────────────────────────────────────────────────
  function renderSettingsPanel() {
    return dom.el('div', { className: 'sp-settings-panel' },
      dom.el('div', { className: 'sp-settings-title' },
        dom.icon('settings', { color: '#5856D6' }), ' Session Settings',
      ),
      dom.el('div', { className: 'sp-settings-row' },
        dom.el('label', {}, 'Questions:'),
        dom.el('select', {
          className: 'sp-settings-select',
          onchange: (e) => { _settings.questionCount = parseInt(e.target.value); },
        },
          ...[4, 6, 8, 10].map(n => dom.el('option', {
            value: String(n),
            selected: n === _settings.questionCount ? 'selected' : undefined,
          }, `${n} questions`)),
        ),
      ),
      dom.el('div', { className: 'sp-settings-row' },
        dom.el('label', {}, 'Topic:'),
        dom.el('select', {
          className: 'sp-settings-select',
          onchange: (e) => { _settings.topic = e.target.value; },
        },
          ...['general', 'daily life', 'travel', 'technology', 'culture', 'business'].map(t =>
            dom.el('option', {
              value: t,
              selected: t === _settings.topic ? 'selected' : undefined,
            }, t.charAt(0).toUpperCase() + t.slice(1)),
          ),
        ),
      ),
      renderVoiceSelector(),
    );
  }

  // ─── Render Functions ────────────────────────────────────────────────────
  function renderPage() {
    const el = document.getElementById('speaking-content');
    if (!el) return;

    if (_pendingSessionJoin) {
      dom.clear(el);
      el.appendChild(dom.el('div', { className: 'sp-container' },
        dom.el('div', { id: 'sp-main' }, _renderJoinButtonDOM(_pendingSessionJoin)),
      ));
      return;
    }

    _resetAll();
    _loadSettings();

    dom.clear(el);
    el.appendChild(dom.el('div', { className: 'sp-container' },
      dom.el('div', { className: 'sp-hero' },
        dom.el('span', { className: 'sp-hero-icon' },
          dom.icon('microphone', { fontSize: '44px', color: '#5856D6' }),
        ),
        dom.el('h1', { className: 'sp-hero-title' }, 'Speaking Practice'),
        dom.el('p', { className: 'sp-hero-sub' },
          'Practice English with real learners or AI. Voice recognition, real-time feedback, and accent support.',
        ),
      ),
      dom.el('div', { id: 'sp-main' }, _renderIdle()),
      dom.el('div', { id: 'sp-requests-incoming', style: { marginTop: '16px' } }),
      dom.el('div', { id: 'sp-requests-sent', style: { marginTop: '16px' } }),
    ));
    _pollRequests();
    setState(STATES.IDLE);
  }

  function _loadSettings() {
    try {
      const saved = localStorage.getItem('vm_speaking_settings');
      if (saved) Object.assign(_settings, JSON.parse(saved));
      const accent = localStorage.getItem('vm_speaking_accent');
      if (accent) _settings.accent = accent;
    } catch (_) { /* ignore */ }
  }

  function _saveSettings() {
    try {
      localStorage.setItem('vm_speaking_settings', JSON.stringify(_settings));
    } catch (_) { /* ignore */ }
  }

  function _renderIdle() {
    return dom.el('div', { style: { marginBottom: '12px' } },
      dom.el('button', { className: 'page-back-btn', onclick: () => goBack() }, '← Back'),
      dom.el('div', { className: 'sp-card' },
        dom.el('div', { className: 'sp-card-title' },
          dom.icon('target', { color: '#5856D6' }), 'Find a Speaking Partner',
        ),
        dom.el('div', { className: 'sp-card-desc' },
          'Choose your preferences and we\'ll match you with an online learner.',
        ),
        dom.el('div', { className: 'sp-section-label' },
          dom.icon('users', { fontSize: '12px' }), ' Partner Preference',
        ),
        dom.el('div', { className: 'sp-options', id: 'sp-gender-options' },
          dom.el('div', { className: 'sp-option selected', dataset: { gender: 'any' } },
            dom.icon('user'), ' Any',
          ),
          dom.el('div', { className: 'sp-option', dataset: { gender: 'male' } },
            dom.icon('man'), ' Male',
          ),
          dom.el('div', { className: 'sp-option', dataset: { gender: 'female' } },
            dom.icon('woman'), ' Female',
          ),
        ),
        dom.el('div', { className: 'sp-section-label' },
          dom.icon('chart-bar', { fontSize: '12px' }), ' Your Level',
        ),
        dom.el('div', { className: 'sp-options', id: 'sp-level-options' },
          ...['beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced'].map(l =>
            dom.el('div', {
              className: `sp-option${l === 'beginner' ? ' selected' : ''}`,
              dataset: { level: l },
            },
              dom.icon({
                beginner: 'seeding',
                elementary: 'book',
                intermediate: 'books',
                'upper-intermediate': 'book-2',
                advanced: 'stack-3',
              }[l] || 'book'),
              ` ${l.charAt(0).toUpperCase()}${l.slice(1)}`,
            ),
          ),
        ),
        renderSettingsPanel(),
        dom.btn(' Find Speaking Partner', 'sp-btn-primary', findPartner,
          { id: 'sp-find-btn', style: { width: '100%', marginTop: '12px' } },
        ),
      ),
    );
  }

  function _renderSkeleton() {
    return dom.el('div', { className: 'sp-card' },
      dom.el('div', { className: 'sp-searching' },
        dom.el('div', { className: 'sp-searching-anim' },
          dom.icon('search', { fontSize: '44px', color: '#5856D6' }),
        ),
        dom.skeleton(3),
      ),
    );
  }

  // ─── Find Partner ───────────────────────────────────────────────────────
  function findPartner() {
    const user = _authUser();
    if (!user) {
      showNotification('Please sign in to use Speaking Practice.', 'warning');
      return;
    }
    _gender = document.querySelector('#sp-gender-options .selected')?.getAttribute('data-gender') || 'any';
    _level = document.querySelector('#sp-level-options .selected')?.getAttribute('data-level') || 'beginner';
    _saveSettings();

    const el = document.getElementById('sp-main');
    if (el) dom.html(el, _showSearching());
    setState(STATES.SEARCHING);
    _startSearch();
  }

  function _showSearching() {
    return dom.el('div', { className: 'sp-card' },
      dom.el('div', { className: 'sp-searching' },
        dom.el('div', { className: 'sp-searching-anim' },
          dom.icon('search', { fontSize: '44px', color: '#5856D6' }),
        ),
        dom.el('div', { className: 'sp-searching-text' }, 'Finding a speaking partner...'),
        dom.el('div', { className: 'sp-searching-sub' },
          'Searching online learners at ',
          dom.el('strong', {}, _level.charAt(0).toUpperCase() + _level.slice(1)),
          ' level',
        ),
        dom.btn(' Cancel', 'sp-btn-secondary', cancelSearch,
          { style: { marginTop: '20px' } },
        ),
      ),
    );
  }

  async function _startSearch() {
    try {
      const data = await _api('GET', '/api/speaking/available');
      if (!data?.partners?.length) {
        showNotification('No partners available right now.', 'warning');
        _showNoPartners();
        return;
      }
      _tryNextPartner(data.partners, 0);
    } catch (err) {
      handleError('startSearch', err);
      _showNoPartners();
    }
  }

  async function _tryNextPartner(partners, index) {
    if (index >= partners.length) {
      showNotification('Could not connect to any partner.', 'warning');
      _showNoPartners();
      return;
    }
    const p = partners[index];
    try {
      const data = await _api('POST', '/api/speaking/request', {
        toUserId: p.id,
        genderPref: _gender,
        level: _level,
      });
      if (data?.requestId) {
        _currentRequestId = data.requestId;
        _partnerInfo = p;
        setState(STATES.REQUESTED);
        const el = document.getElementById('sp-main');
        if (el) dom.html(el, _showRequestSent(p, data.requestId));
        _waitForAcceptanceWS();
      } else {
        _tryNextPartner(partners, index + 1);
      }
    } catch (err) {
      _tryNextPartner(partners, index + 1);
    }
  }

  function _showNoPartners() {
    const el = document.getElementById('sp-main');
    if (!el) return;
    setState(STATES.IDLE);
    dom.html(el,
      dom.el('div', { style: { marginBottom: '12px' } },
        dom.el('button', { className: 'page-back-btn', onclick: () => goBack() }, '← Back'),
        dom.el('div', { className: 'sp-card' },
          dom.el('div', { className: 'sp-empty' },
            dom.el('div', { className: 'sp-empty-icon' },
              dom.icon('mood-sad', { fontSize: '44px', color: 'var(--ios-muted)' }),
            ),
            dom.el('div', { className: 'sp-empty-title' }, 'No Partners Available'),
            dom.el('div', { className: 'sp-empty-text' },
              'No online learners match your criteria right now. Try different preferences or come back later.',
            ),
            dom.btn(' Try Again', 'sp-btn-primary', renderPage,
              { style: { marginTop: '16px' } },
            ),
          ),
        ),
      ),
    );
  }

  function _showRequestSent(partner, requestId) {
    const name = partner.display_name || partner.username || 'Learner';
    return dom.el('div', { className: 'sp-card' },
      dom.el('div', { className: 'sp-searching' },
        dom.el('div', { className: 'sp-searching-anim', style: { animationDuration: '2s' } },
          dom.icon('hourglass', { fontSize: '44px', color: '#5856D6' }),
        ),
        dom.el('div', { className: 'sp-searching-text' },
          'Request sent to ',
          dom.el('strong', {}, dom.text(name)),
        ),
        dom.el('div', { className: 'sp-searching-sub' }, 'Waiting for them to accept...'),
        _renderPartnerChip(name),
        dom.el('div', { style: { marginTop: '16px' } },
          dom.btn(' Cancel Request', 'sp-btn-secondary', cancelRequest),
        ),
      ),
    );
  }

  function _renderPartnerChip(name) {
    return dom.el('div', { className: 'sp-partner-chip' },
      dom.el('span', {
        className: 'sp-partner-chip-avatar',
        style: { background: _avatarColor(name) },
      }, _initial(name)),
      dom.el('span', { className: 'sp-partner-chip-name' }, dom.text(name)),
    );
  }

  // ─── Wait for acceptance via WebSocket ──────────────────────────────────
  function _waitForAcceptanceWS() {
    // Connect to WS for push-based acceptance
    _connectWS();
    // Fallback polling in case WS doesn't deliver
    _stopPoll();
    _pollTimer = setInterval(() => {
      if (!_currentRequestId || _state === STATES.ACCEPTED) { _stopPoll(); return; }
      _api('GET', '/api/speaking/my-requests')
        .then((data) => {
          if (!data?.requests) return;
          const match = data.requests.find(
            r => r.id === _currentRequestId && r.status === 'accepted',
          );
          if (match) {
            _stopPoll();
            _handleRequestAccepted(match.session_id);
          }
        })
        .catch(() => { /* keep polling */ });
    }, 5000);
  }

  function cancelRequest() {
    _currentRequestId = null;
    _partnerInfo = null;
    renderPage();
  }

  function cancelSearch() {
    renderPage();
  }

  // ─── Session ────────────────────────────────────────────────────────────
  async function _joinSession() {
    if (!_pendingSessionJoin) return;
    _currentSessionId = _pendingSessionJoin.sessionId;
    if (_pendingSessionJoin.partner) _partnerInfo = _pendingSessionJoin.partner;
    _currentRequestId = null;
    _pendingSessionJoin = null;

    const el = document.getElementById('sp-main');
    if (el) {
      dom.html(el,
        dom.el('div', { className: 'sp-card' },
          dom.el('div', { className: 'sp-searching' },
            dom.el('div', { className: 'sp-searching-anim', style: { animationDuration: '1.2s' } },
              dom.icon('microphone', { fontSize: '44px', color: '#5856D6' }),
            ),
            dom.el('div', { className: 'sp-searching-text' }, 'Starting session...'),
          ),
        ),
      );
    }
    setState(STATES.IN_SESSION);
    await _startSession();
  }

  async function _startSession() {
    try {
      const data = await _api('POST', `/api/speaking/session/${_currentSessionId}/start-ai`);
      if (data?.questions) {
        _questions = data.questions;
        _currentIndex = data.currentIndex || 0;
        _whoStarts = data.whoStarts;
        setState(STATES.IN_SESSION);
        _renderSession();
        _connectWS(); // ensures WS is connected for push updates
      } else {
        throw new Error('No questions received');
      }
    } catch (err) {
      handleError('startSession', err);
    }
  }

  function _renderSession() {
    const el = document.getElementById('sp-main');
    if (!el) return;

    const user = _authUser();
    const userId = user?.id;
    const progressPct = Math.round((_currentIndex / (_settings.questionCount || 6)) * 100);
    const pName = _partnerInfo?.display_name || _partnerInfo?.username || 'Partner';

    dom.clear(el);
    el.appendChild(dom.el('div', { className: 'sp-card' },
      dom.el('div', { className: 'sp-room' },
        dom.el('div', { className: 'sp-room-header' },
          dom.el('div', { className: 'sp-room-partner' },
            dom.el('span', {
              className: 'sp-room-partner-avatar',
              style: { background: _avatarColor(pName) },
            }, _initial(pName)),
            dom.el('div', {},
              dom.el('div', { className: 'sp-room-partner-name' }, dom.text(pName)),
              dom.el('div', { style: { fontSize: '11px', color: 'var(--ios-secondary-label)' } },
                _level.charAt(0).toUpperCase() + _level.slice(1),
              ),
            ),
          ),
          dom.el('div', { className: 'sp-room-progress' },
            `Question ${_currentIndex + 1} / ${_settings.questionCount || 6}`,
          ),
        ),
        dom.el('div', { className: 'sp-room-progress-bar' },
          dom.el('div', {
            className: 'sp-room-progress-fill',
            style: { width: `${progressPct}%` },
          }),
        ),
        dom.el('div', { id: 'sp-session-content' }, _renderQuestion()),
      ),
    ));
  }

  function _renderQuestion() {
    const user = _authUser();
    const userId = user?.id;
    const q = _questions[_currentIndex] || '';
    const maxQuestions = _settings.questionCount || 6;

    if (_currentIndex >= maxQuestions) {
      setState(STATES.COMPLETE);
      _renderComplete();
      _submitFeedback();
      return dom.el('div', {});
    }

    const isFirstSpeaker = _whoStarts === userId;
    const myTurn = (_currentIndex % 2 === 0) === isFirstSpeaker;

    // Speak question with AI voice
    setTimeout(() => _speakWithAI(q, _settings.accent, _settings.voiceRate), 400);

    const turnHint = (myTurn && !_micEnabled)
      ? dom.el('div', { style: { fontSize: '11px', color: 'var(--ios-orange)', marginTop: '4px' } },
          dom.icon('bulb'), ' Click microphone above to enable your voice',
        )
      : null;

    const turnHtml = myTurn
      ? dom.el('div', { className: 'sp-answer-turn is-me' },
          dom.icon('microphone'), ' Your turn to answer!', turnHint,
        )
      : dom.el('div', { className: 'sp-answer-turn' },
          dom.icon('clock'), ' Waiting for your partner to answer...',
        );

    const micLabel = _micEnabled
      ? '<i class="ti ti-volume"></i> Microphone On'
      : '<i class="ti ti-volume-off"></i> Microphone Off';

    const micBtn = dom.el('div', { className: 'sp-mic-bar' },
      dom.el('button', {
        className: 'sp-mic-btn',
        id: 'sp-mic-btn',
        onclick: _toggleMic,
      }, micLabel),
      _wsConnected
        ? dom.el('span', { className: 'sp-mic-status' },
            dom.el('span', { style: { color: '#34C759' } }, '●'), ' Connected',
          )
        : (_ws
            ? dom.el('span', { className: 'sp-mic-status' },
                dom.el('span', { style: { color: '#FF9500' } }, '●'), ' Connecting...',
              )
            : null),
    );

    return dom.el('div', {},
      dom.el('div', { className: 'sp-question' },
        dom.el('div', { className: 'sp-question-label' }, `Question ${_currentIndex + 1}`),
        dom.el('div', { className: 'sp-question-text' }, dom.text(q)),
      ),
      micBtn,
      dom.el('div', { id: 'sp-answer-section' },
        turnHtml,
        myTurn
          ? dom.el('div', { className: 'sp-answer-input-wrap' },
              dom.el('textarea', {
                className: 'sp-answer-input',
                id: 'sp-answer-input',
                placeholder: 'Type your answer here...',
                rows: '3',
              }),
              dom.el('button', {
                className: 'sp-btn sp-btn-primary',
                id: 'sp-sprec-btn',
                onclick: _startVoiceAnswer,
                style: { background: 'linear-gradient(135deg, #34C759, #30B0C7)' },
              }, dom.icon('microphone'), ' Speak'),
              dom.btn(' Next ' + dom.icon('arrow-right').outerHTML, 'sp-btn-primary', submitAnswer,
                { id: 'sp-submit-btn' },
              ),
            )
          : null,
      ),
    );
  }

  // ─── Voice Answer (Speech-to-Text) ──────────────────────────────────────
  function _startVoiceAnswer() {
    const input = document.getElementById('sp-answer-input');
    if (!input) return;
    const btn = document.getElementById('sp-sprec-btn');
    if (_isRecognizing) {
      _stopVoiceRecognition();
      if (btn) btn.innerHTML = '<i class="ti ti-microphone"></i> Speak';
      return;
    }

    if (btn) btn.innerHTML = '<i class="ti ti-microphone"></i> Listening...';
    input.placeholder = 'Listening...';

    _startVoiceRecognition(
      (result) => {
        if (result.isFinal) {
          input.value = (input.value ? input.value + ' ' : '') + result.final;
          input.placeholder = 'Type your answer here...';
          if (btn) btn.innerHTML = '<i class="ti ti-microphone"></i> Speak';
        } else {
          input.placeholder = result.interim || 'Listening...';
        }
      },
      (err) => {
        console.error('SPEAKING: voice recognition error:', err);
        if (btn) btn.innerHTML = '<i class="ti ti-microphone"></i> Speak';
        input.placeholder = 'Type your answer here...';
      },
      () => {
        if (btn) btn.innerHTML = '<i class="ti ti-microphone"></i> Speak';
        input.placeholder = 'Type your answer here...';
      },
    );
  }

  // ─── Submit Answer ──────────────────────────────────────────────────────
  async function submitAnswer() {
    const input = document.getElementById('sp-answer-input');
    if (!input) return;
    let answer = input.value.trim();

    // If empty and voice recognition produced text, check interim
    if (!answer) {
      showNotification('Please type or speak your answer first.', 'warning');
      return;
    }

    const btn = document.getElementById('sp-submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    _stopVoiceRecognition();

    try {
      const data = await _api('POST', `/api/speaking/session/${_currentSessionId}/answer`, { answer });
      if (data) {
        _currentIndex = data.currentIndex;
        if (data.whoNext) _whoStarts = data.whoNext;
        if (data.isComplete) {
          setState(STATES.COMPLETE);
          _renderComplete();
          _submitFeedback();
        } else {
          _renderSession();
        }
      }
    } catch (err) {
      handleError('submitAnswer', err);
      if (btn) { btn.disabled = false; btn.textContent = 'Next'; }
    }
  }

  // ─── Session Poll (fallback) ────────────────────────────────────────────
  function _pollSession() {
    _stopPoll('session');
    _sessionPollTimer = setInterval(() => {
      if (_state !== STATES.IN_SESSION && _state !== STATES.COMPLETE) {
        _stopPoll('session');
        return;
      }
      if (!_currentSessionId) return;
      _api('GET', `/api/speaking/session/${_currentSessionId}`)
        .then((data) => {
          if (!data?.session) return;
          const s = data.session;
          if (s.current_index !== undefined && s.current_index !== _currentIndex) {
            _applySessionUpdate(s);
          }
        })
        .catch(() => { /* keep polling */ });
    }, 10000); // Poll less frequently now (WS push is primary)
  }

  // ─── Complete & Feedback ────────────────────────────────────────────────
  function _renderComplete() {
    const el = document.getElementById('sp-main');
    if (!el) return;
    dom.html(el,
      dom.el('div', { className: 'sp-card' },
        dom.el('div', { className: 'sp-complete' },
          dom.el('div', { className: 'sp-complete-icon' },
            dom.icon('celebration', { fontSize: '52px', color: '#5856D6' }),
          ),
          dom.el('div', { className: 'sp-complete-title' }, 'Great Conversation!'),
          dom.el('div', { className: 'sp-complete-sub' },
            `You completed all ${_settings.questionCount || 6} questions. Analyzing your speaking performance...`,
          ),
          dom.el('div', { className: 'sp-searching-anim', style: { fontSize: '32px', marginTop: '8px' } },
            dom.icon('sparkles', { color: '#5856D6' }),
          ),
        ),
      ),
    );
  }

  async function _submitFeedback() {
    try {
      const data = await _api('POST', `/api/speaking/session/${_currentSessionId}/feedback`);
      if (data?.feedback) {
        _feedbackData = data.feedback;
        _renderFeedback();
      } else {
        _retryFeedback();
      }
    } catch (err) {
      _retryFeedback();
    }
  }

  function _retryFeedback() {
    setTimeout(async () => {
      try {
        const data = await _api('GET', `/api/speaking/session/${_currentSessionId}`);
        if (data?.session) {
          let fb = data.session.feedback;
          try { fb = typeof fb === 'string' ? JSON.parse(fb) : fb; } catch (_) { /* ignore */ }
          const user = _authUser();
          const uid = user?.id;
          if (fb?.[uid]) {
            _feedbackData = fb[uid];
            _renderFeedback();
            return;
          }
        }
        if (!_feedbackData) _submitFeedback();
      } catch (err) {
        if (!_feedbackData) _submitFeedback();
      }
    }, 5000);
  }

  function _renderFeedback() {
    const el = document.getElementById('sp-main');
    if (!el) return;

    const fb = _feedbackData || {
      myFeedback: 'Great effort! Try expanding your answers with more details.',
      myScore: 75,
      myStrengths: ['Good participation'],
      myWeaknesses: ['Could add more detail'],
      myTip: 'Practice using descriptive vocabulary',
      partnerFeedback: 'Your partner did well!',
      partnerScore: 75,
      partnerStrengths: ['Communication'],
      partnerWeaknesses: [],
    };

    const pName = _partnerInfo?.display_name || _partnerInfo?.username || 'Partner';

    // Feedback with AI voice reading the score
    const scoreText = `Your speaking score is ${fb.myScore} out of 100. ${fb.myFeedback}`;
    setTimeout(() => _speakWithAI(scoreText, _settings.accent, 0.9), 1000);

    dom.clear(el);
    el.appendChild(dom.el('div', {},
      dom.el('div', { className: 'sp-card' },
        dom.el('div', { className: 'sp-complete', style: { paddingBottom: '16px' } },
          dom.el('div', { className: 'sp-complete-icon' },
            dom.icon('celebration', { fontSize: '52px', color: '#5856D6' }),
          ),
          dom.el('div', { className: 'sp-complete-title' }, 'Session Complete!'),
          dom.el('div', { className: 'sp-complete-sub' }, 'Here is your speaking performance analysis'),
        ),
      ),
      dom.el('div', { className: 'sp-feedback-grid' },
        // My feedback card
        dom.el('div', { className: 'sp-fb-card' },
          dom.el('div', { className: 'sp-fb-card-header' },
            dom.icon('user', { fontSize: '18px', color: '#5856D6' }),
            dom.el('span', { className: 'sp-fb-card-name' }, 'You'),
          ),
          dom.el('div', { className: 'sp-fb-score' }, String(fb.myScore || 75)),
          dom.el('div', { className: 'sp-fb-label' }, 'Your Score'),
          dom.el('div', { className: 'sp-fb-text' }, dom.text(fb.myFeedback || '')),
          fb.myStrengths?.length
            ? dom.el('div', { className: 'sp-fb-section' },
                dom.el('div', { className: 'sp-fb-section-title' },
                  dom.icon('muscle', { color: '#34C759' }), ' Strengths',
                ),
                ...fb.myStrengths.map(s =>
                  dom.el('span', { className: 'sp-fb-tag sp-fb-tag-good' }, dom.text(s)),
                ),
              )
            : null,
          fb.myWeaknesses?.length
            ? dom.el('div', { className: 'sp-fb-section' },
                dom.el('div', { className: 'sp-fb-section-title' },
                  dom.icon('trending-up', { color: '#FF9500' }), ' Areas to Improve',
                ),
                ...fb.myWeaknesses.map(s =>
                  dom.el('span', { className: 'sp-fb-tag sp-fb-tag-bad' }, dom.text(s)),
                ),
              )
            : null,
          fb.myTip
            ? dom.el('div', { className: 'sp-fb-tip' },
                dom.icon('bulb', { color: '#5856D6', style: { marginRight: '4px' } }),
                dom.text(fb.myTip),
              )
            : null,
        ),
        // Partner feedback card
        dom.el('div', { className: 'sp-fb-card' },
          dom.el('div', { className: 'sp-fb-card-header' },
            dom.el('span', {
              className: 'sp-room-partner-avatar',
              style: {
                background: _avatarColor(pName),
                width: '24px', height: '24px', fontSize: '12px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', color: '#fff',
              },
            }, _initial(pName)),
            dom.el('span', { className: 'sp-fb-card-name' }, dom.text(pName)),
          ),
          dom.el('div', { className: 'sp-fb-score' }, String(fb.partnerScore || 75)),
          dom.el('div', { className: 'sp-fb-label' }, 'Partner Score'),
          dom.el('div', { className: 'sp-fb-text' }, dom.text(fb.partnerFeedback || '')),
          fb.partnerStrengths?.length
            ? dom.el('div', { className: 'sp-fb-section' },
                dom.el('div', { className: 'sp-fb-section-title' },
                  dom.icon('muscle', { color: '#34C759' }), ' Strengths',
                ),
                ...fb.partnerStrengths.map(s =>
                  dom.el('span', { className: 'sp-fb-tag sp-fb-tag-good' }, dom.text(s)),
                ),
              )
            : null,
          fb.partnerWeaknesses?.length
            ? dom.el('div', { className: 'sp-fb-section' },
                dom.el('div', { className: 'sp-fb-section-title' },
                  dom.icon('trending-up', { color: '#FF9500' }), ' Areas to Improve',
                ),
                ...fb.partnerWeaknesses.map(s =>
                  dom.el('span', { className: 'sp-fb-tag sp-fb-tag-bad' }, dom.text(s)),
                ),
              )
            : null,
        ),
      ),
      // Rating
      dom.el('div', { className: 'sp-rating', id: 'sp-rating' },
        dom.el('div', { className: 'sp-rating-label' }, 'Rate your practice session'),
        dom.el('div', { className: 'sp-stars' },
          ...[1, 2, 3, 4, 5].map(n =>
            dom.el('span', {
              className: 'sp-star',
              dataset: { val: String(n) },
              onclick: () => _submitRating(n),
            }, '☆'),
          ),
        ),
        dom.el('div', {
          id: 'sp-rating-msg',
          style: { fontSize: '13px', color: 'var(--ios-secondary-label)', minHeight: '20px' },
        }),
      ),
      dom.el('div', { style: { textAlign: 'center', marginTop: '16px' } },
        dom.btn(' Finish', 'sp-btn-primary', _finishSession, { id: 'sp-finish-btn' }),
        dom.btn(' Dashboard', 'sp-btn-secondary', closeAndGoHome,
          { style: { marginLeft: '8px' } },
        ),
      ),
    ));
    setState(STATES.FEEDBACK);
    _stopPoll('session');
    _stopPoll();
  }

  // ─── Rating ─────────────────────────────────────────────────────────────
  function _submitRating(val) {
    _rating = val;
    for (const s of document.querySelectorAll('.sp-star')) {
      const sv = parseInt(s.getAttribute('data-val'), 10);
      if (sv <= val) { s.classList.add('active'); s.textContent = '★'; }
      else { s.classList.remove('active'); s.textContent = '☆'; }
    }
    const msg = document.getElementById('sp-rating-msg');
    if (msg) msg.textContent = 'Rating saved! Thanks for your feedback.';
    _api('POST', `/api/speaking/session/${_currentSessionId}/rate`, { rating: val })
      .catch(() => { /* rating is non-critical */ });
  }

  function _finishSession() {
    _cleanupMedia();
    _resetAll();
    if (typeof Router !== 'undefined') Router.navigate('/');
  }

  function closeAndGoHome() {
    _cleanupMedia();
    _resetAll();
    if (typeof Router !== 'undefined') Router.navigate('/');
  }

  // ─── Incoming Request Polling (with WS push) ────────────────────────────
  function _pollRequests() {
    _stopPoll('request');
    // WebSocket will also deliver incoming requests via push
    _requestPollTimer = setInterval(() => {
      const user = _authUser();
      if (!user || _notiActive) return;
      _api('GET', '/api/speaking/pending')
        .then((data) => {
          if (data?.requests?.length > 0) {
            _showRequestNotification(data.requests[0]);
          }
        })
        .catch(() => { /* keep polling */ });
    }, 10000);
  }

  function _showRequestNotification(request) {
    _notiActive = true;
    let overlay = document.getElementById('sp-notification-overlay');
    if (!overlay) {
      overlay = dom.el('div', { id: 'sp-notification-overlay', className: 'sp-notification-overlay' });
      document.body.appendChild(overlay);
    }
    const name = request.display_name || request.username || 'A learner';

    // Create notification container if needed
    const notiContainer = overlay;
    dom.clear(notiContainer);

    const noti = dom.el('div', { className: 'sp-notification' },
      dom.el('div', { className: 'sp-noti-icon' },
        dom.icon('microphone', { fontSize: '40px', color: '#5856D6' }),
      ),
      dom.el('div', { className: 'sp-noti-title' }, 'Speaking Request!'),
      dom.el('div', { className: 'sp-noti-text' },
        dom.el('strong', {}, dom.text(name)),
        ' wants to practice speaking with you!',
        dom.el('br'),
        dom.el('span', { style: { fontSize: '12px', color: 'var(--ios-secondary-label)' } },
          `Level: ${dom.text(request.level || 'beginner')}`,
        ),
      ),
      dom.el('div', { className: 'sp-noti-actions' },
        dom.btn(' Accept', 'sp-btn-success', () => {
          overlay.classList.remove('active');
          _notiActive = false;
          _partnerInfo = {
            id: request.from_user_id,
            username: request.username,
            display_name: request.display_name,
            level: request.level || 'beginner',
          };
          _respondToRequest(noti._requestId, 'accept');
        }, { id: 'sp-noti-accept' }),
        dom.btn(' Decline', 'sp-btn-danger', () => {
          overlay.classList.remove('active');
          _notiActive = false;
          _respondToRequest(noti._requestId, 'decline');
        }, { id: 'sp-noti-decline' }),
      ),
    );
    noti._requestId = request.id;
    notiContainer.appendChild(noti);
    notiContainer.classList.add('active');
  }

  async function _respondToRequest(requestId, action) {
    try {
      const data = await _api('POST', '/api/speaking/respond', { requestId, action });
      if (data?.sessionId && action === 'accept') {
        _pendingSessionJoin = {
          sessionId: data.sessionId,
          partner: _partnerInfo,
          level: _partnerInfo?.level || 'beginner',
        };
        // Navigate to speaking page
        for (const p of document.querySelectorAll('.page')) p.classList.remove('active');
        for (const n of document.querySelectorAll('.nav-item')) n.classList.remove('active');
        const pp = document.getElementById('page-speaking');
        if (pp) {
          pp.classList.add('active');
          pp.classList.remove('page-entrance');
          void pp.offsetWidth;
          pp.classList.add('page-entrance');
        }
        if (typeof Router !== 'undefined') {
          Router.replaceHash('/speaking/with-people');
        } else {
          for (const n of document.querySelectorAll('[data-route-path="/speaking/with-people"]')) {
            n.classList.add('active');
          }
          state.currentPage = 'speaking';
          history.replaceState(
            { page: 'speaking', sub: null, path: '/speaking/with-people' },
            '',
            '#/speaking/with-people',
          );
        }
        document.title = 'Speaking with People - Piyala';
        const sc = document.getElementById('speaking-content');
        if (sc) {
          dom.html(sc,
            dom.el('div', { className: 'sp-container' },
              dom.el('div', { id: 'sp-main' }, _renderJoinButtonDOM(_pendingSessionJoin)),
            ),
          );
        }
      }
    } catch (err) {
      handleError('respondToRequest', err);
    }
  }

  function _renderJoinButtonDOM(data) {
    const name = data.partner?.display_name || data.partner?.username || 'Partner';
    const lvl = data.level || 'beginner';
    return dom.el('div', { className: 'sp-card', style: { textAlign: 'center', padding: '32px 24px' } },
      dom.el('div', { className: 'sp-card-icon', style: { marginBottom: '12px' } },
        dom.icon('microphone', { fontSize: '40px', color: '#5856D6' }),
      ),
      dom.el('div', { className: 'sp-card-title', style: { fontSize: '20px', marginBottom: '6px' } },
        'Session Ready!',
      ),
      dom.el('div', { style: { fontSize: '14px', color: 'var(--ios-secondary-label)', marginBottom: '20px', lineHeight: '1.6' } },
        'Your speaking partner ',
        dom.el('strong', {}, dom.text(name)),
        ` (${lvl.charAt(0).toUpperCase() + lvl.slice(1)}) is waiting.`,
        dom.el('br'),
        'Click below to join the practice session.',
      ),
      _renderPartnerChip(name),
      dom.btn(' Join Speaking', 'sp-btn-primary', _joinSession,
        { style: { fontSize: '16px', padding: '12px 36px' } },
      ),
    );
  }

  // ─── Public API ─────────────────────────────────────────────────────────
  function init() {
    renderPage();
  }

  function globalInit() {
    _pollRequests();

    // Create notification overlay container
    const existing = document.getElementById('sp-notification-overlay');
    if (!existing) {
      const overlay = dom.el('div', { id: 'sp-notification-overlay', className: 'sp-notification-overlay' });
      // Only add the backdrop, notifications are rendered dynamically inside
      document.body.appendChild(overlay);
    }

    // Delegate click events for option selectors
    document.addEventListener('click', (e) => {
      const gOpt = e.target.closest('#sp-gender-options .sp-option');
      if (gOpt) {
        for (const o of document.querySelectorAll('#sp-gender-options .sp-option')) {
          o.classList.remove('selected');
        }
        gOpt.classList.add('selected');
        return;
      }
      const lOpt = e.target.closest('#sp-level-options .sp-option');
      if (lOpt) {
        for (const o of document.querySelectorAll('#sp-level-options .sp-option')) {
          o.classList.remove('selected');
        }
        lOpt.classList.add('selected');
      }
    });

    // Load voices for TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices(); // pre-load
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        // voices loaded
      }, { once: true });
    }
  }

  // ─── Auto-init ──────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', globalInit);
  } else {
    globalInit();
  }

  return {
    renderPage,
    init,
    findPartner,
    cancelSearch,
    cancelRequest,
    submitAnswer,
    closeAndGoHome,
    _joinSession,
    _toggleMic,
    _submitRating,
    _finishSession,
    _startVoiceAnswer,
    _speakWithAI,
  };
})();
