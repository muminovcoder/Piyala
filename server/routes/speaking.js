const express = require('express');
const { query } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/security');

const router = express.Router();

const GROQ_KEYS = [
  process.env.GROQ_KEY_1,
  process.env.GROQ_KEY_2,
  process.env.GROQ_KEY_3,
  process.env.GROQ_KEY_4,
].filter(Boolean);

const GROQ_MODELS = ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'llama-3.1-70b-versatile'];

async function callGroq(messages, temperature = 0.7, maxTokens = 1000, timeoutMs = 10000, prefer70B = false) {
  const models = prefer70B ? ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'llama-3.1-8b-instant'] : GROQ_MODELS;
  for (const key of GROQ_KEYS) {
    for (const model of models) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens })
        });
        clearTimeout(timeout);
        if (!res.ok) continue;
        const data = await res.json();
        if (data.choices?.[0]?.message?.content) return data.choices[0].message.content.trim();
      } catch (_) { continue; }
    }
  }
  return null;
}

// ════════════════════════════════════════════
//  AI SPEAKING MOCK — Public endpoints (no auth required)
// ════════════════════════════════════════════

router.post('/ai/generate-questions', aiLimiter, async (req, res) => {
  try {
    const { type, topic } = req.body;
    const levelDesc = 'IELTS level (B1-C1)';
    let prompt;
    if (type === 'part1') {
      prompt = `You are an IELTS Speaking examiner. Generate exactly 4 Part 1 (Introduction & Interview) questions on familiar topics like home, family, work, studies, hobbies. Level: ${levelDesc}. Return ONLY a valid JSON array of 4 objects, each with "q" (question), "hint" (one-line guidance), and "part": 1. Example format: [{"q":"Question?","hint":"Hint text","part":1}]`;
    } else if (type === 'part2') {
      const topics = ['Describe a memorable journey or trip you have taken.','Describe a person who has had a significant influence on your life.','Describe a skill you would like to learn in the future.','Describe a book that has influenced you.','Describe a place you would like to visit again.','Describe a piece of technology that is important to you.'];
      const selected = topic || topics[Math.floor(Math.random() * topics.length)];
      prompt = `You are an IELTS Speaking examiner. Generate exactly 1 Part 2 (Cue Card) question. Topic: "${selected}". Level: ${levelDesc}. Return ONLY a valid JSON array with 1 object: {"q":"${selected}","hint":"You will have 1 minute to prepare. Speak for 1-2 minutes.","part":2,"isCueCard":true,"topic":"${selected}","points":["Point 1 about what","Point 2 about details","Point 3 about description","Point 4 about explanation"]}`;
    } else if (type === 'part3') {
      prompt = `You are an IELTS Speaking examiner. Generate exactly 4 Part 3 (Two-way Discussion) questions on abstract topics related to society, technology, culture, education or the environment. Level: ${levelDesc}. Questions should require analysis and opinion. Return ONLY a valid JSON array of 4 objects, each with "q" (question), "hint" (one-line guidance), and "part": 3. Example format: [{"q":"Question?","hint":"Hint text","part":3}]`;
    } else {
      const p1Topics = ['home and family', 'work or studies', 'hobbies and free time', 'travel and holidays'];
      const p2Topics = ['Describe a memorable journey or trip you have taken.','Describe a person who has had a significant influence on your life.','Describe a skill you would like to learn in the future.'];
      const selectedP2 = p2Topics[Math.floor(Math.random() * p2Topics.length)];
      prompt = `You are an IELTS Speaking examiner. Generate questions for a FULL IELTS Speaking test. Level: ${levelDesc}.

Part 1 (4 questions): Introduction on topics like ${p1Topics.join(', ')}. Return as objects with "q" and "hint".
Part 2 (1 cue card): Topic: "${selectedP2}". Include "q", "hint", "isCueCard": true, "topic", "points" (4 bullet points).
Part 3 (3 questions): Abstract discussion related to the Part 2 theme. Return as objects with "q" and "hint".

Return ONLY a valid JSON array of 8 questions in order: [4 part1 objects, 1 part2 object, 3 part3 objects]. Each object must have a "part" field (1, 2, or 3).`;
    }
    const content = await callGroq([{ role: 'user', content: prompt }], 0.7, 2000, 15000);
    if (!content) return res.status(503).json({ error: 'AI service unavailable' });
    let questions;
    try {
      const cleaned = content.replace(/```json|```/g, '').trim();
      questions = JSON.parse(cleaned);
      if (!Array.isArray(questions)) throw new Error('Not an array');
    } catch (e) {
      return res.status(503).json({ error: 'AI returned invalid format' });
    }
    res.json({ questions });
  } catch (err) {
    console.error('AI generate questions error:', err.message);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

router.post('/ai/evaluate', aiLimiter, async (req, res) => {
  try {
    const { answers, mockType } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length === 0) return res.status(400).json({ error: 'No answers provided' });
    var filtered = answers.filter(function(a) { return a.answer !== null && a.answer !== ''; });
    if (filtered.length === 0) {
      return res.json({ feedback: { overall_band: 0, fc: 0, lr: 0, gra: 0, p: 0, level_description: 'No response — No answer provided', strengths: '', improvements: 'No responses to evaluate.', tips: 'Try to answer every question in your next mock.' } });
    }

    // Extract pronunciation confidence from speech recognition
    var confidences = filtered.map(function(a) { return a.pronunConfidence; }).filter(function(c) { return c !== null && c !== undefined; });
    var avgConfidence = confidences.length > 0
      ? confidences.reduce(function(s, c) { return s + c; }, 0) / confidences.length
      : null;

    var qa = filtered.map((a, i) => `Q${i+1} (Part ${a.part}): ${a.question}\nAnswer: ${a.answer}`).join('\n\n');
    const prompt = `You are a strict, official IELTS Speaking examiner from the British Council. Evaluate the following candidate responses from an IELTS Speaking test (${mockType === 'full' ? 'Full test' : 'Part ' + (filtered[0]?.part || 1) + ' only'}).

### OFFICIAL IELTS BAND DESCRIPTORS (be precise):
- Band 9: Expert user — fully operational, appropriate, accurate, fluent with complete understanding
- Band 8: Very good user — fully operational with only occasional unsystematic inaccuracies. Handles complex argumentation well
- Band 7: Good user — has operational command with occasional inaccuracies and inappropriate usage. Can handle complex language
- Band 6: Competent user — uses reasonably accurate language but with limited range and some errors
- Band 5: Modest user — partial command, coping with overall meaning but likely to make many errors
- Band 4: Limited user — basic competence limited to familiar situations, frequent problems

### SCORING CALIBRATION (use these exact examples):
A fluent 3-4 sentence answer with good vocabulary and no errors → Band 7.0-7.5
A fluent 3-4 sentence answer with good vocabulary and 1-2 minor errors → Band 6.5-7.0
A 2-3 sentence answer with basic vocabulary and no errors → Band 6.0-6.5
A 2-3 sentence answer with basic vocabulary and some errors → Band 5.0-5.5
A 1-2 sentence short answer with simple vocabulary → Band 4.0-5.0
Very short/one-word answers → Band 3.0-4.0
Empty or no answer → Band 0-1.0

### STRICT RULES:
- Short answers (1-2 sentences) with basic vocabulary: MAX Band 5.5
- Multiple grammar/filler errors: MAX Band 5.5
- Average answer length, some good vocabulary, some errors: Band 6.0-6.5
- Good length (3+ sentences), good vocabulary, minor errors: Band 7.0-7.5
- Long, fluent, sophisticated, complex structures, no errors: Band 8.0-9.0
- Band 9 is EXTREMELY rare — only for truly native-level flawless performance

CANDIDATE RESPONSES:
${qa}

### PRONUNCIATION ASSESSMENT:
The candidate's speech was analyzed by two engines:
1. Browser SpeechRecognition — measures clarity by comparing recognition alternatives (gap between top and second-best interpretation)
2. Groq Whisper (word-level) — measures per-word confidence from the acoustic model

Below is the average pronunciation clarity score across all answers. Higher = clearer pronunciation.

Average Pronunciation Clarity: ${avgConfidence !== null ? (avgConfidence * 100).toFixed(0) + '%' : 'Not available (answers were typed)'}

Use this clarity to inform the Pronunciation (P) band:
- Clarity >= 90% → Candidate speaks clearly, minimal hesitation between alternatives, pronunciation is very good → P score may be higher
- Clarity 75-89% → Some pronunciation issues detected but generally clear
- Clarity 50-74% → Noticeable pronunciation problems affecting intelligibility; engine hesitates between alternatives
- Clarity < 50% → Significant pronunciation difficulties; speech was hard to recognize, many alternatives compete
- No clarity data (typed answer) → Evaluate pronunciation from written style as before
- IMPORTANT: Evaluate ALL criteria (FC, LR, GRA) from the answer content as usual, but use the clarity score as REAL pronunciation data for the P band.

Evaluate strictly on the 4 official IELTS Speaking criteria (0.5 increments):
1. Fluency & Coherence (FC) — flow, hesitation, logical linking
2. Lexical Resource (LR) — vocabulary range, less common items, paraphrase
3. Grammatical Range & Accuracy (GRA) — structure variety, tenses, error frequency
4. Pronunciation (P) — use the pronunciation clarity score ABOVE as REAL pronunciation data, combined with the written style

Return ONLY a valid JSON object in this exact format (no markdown, no extra text):
{
  "overall_band": 5.5,
  "fc": 5.5,
  "lr": 5.0,
  "gra": 5.0,
  "p": 5.5,
  "level_description": "IELTS Band 5 — Modest user. Partial command, coping with overall meaning in most situations, though is likely to make many mistakes.",
  "strengths": "Strength 1\\nStrength 2\\nStrength 3",
  "improvements": "Improvement 1\\nImprovement 2\\nImprovement 3",
  "tips": "Tip 1\\nTip 2\\nTip 3"
}

Be strict — real IELTS examiners assign Band 7 only to genuinely good answers with range and few errors. Most candidates score Band 5-6.`;
    const content = await callGroq([{ role: 'user', content: prompt }], 0.3, 2000, 30000, true);
    if (!content) return res.status(503).json({ error: 'AI evaluation unavailable' });
    let feedback;
    try {
      const cleaned = content.replace(/```json|```/g, '').trim();
      feedback = JSON.parse(cleaned);
      if (!feedback.overall_band) throw new Error('Invalid feedback structure');
    } catch (e) {
      return res.status(503).json({ error: 'AI returned invalid feedback format' });
    }

    // Post-process: enforce confidence-based pronunciation caps
    if (avgConfidence !== null && feedback.p !== undefined) {
      // If confidence is very low, limit max pronunciation band
      if (avgConfidence < 0.5 && feedback.p > 4.0) feedback.p = Math.min(feedback.p, 4.0);
      else if (avgConfidence < 0.65 && feedback.p > 5.0) feedback.p = Math.min(feedback.p, 5.0);
      else if (avgConfidence < 0.80 && feedback.p > 6.0) feedback.p = Math.min(feedback.p, 6.0);
      // If confidence is excellent, allow higher pronunciation band
      if (avgConfidence >= 0.90 && feedback.p < 6.0 && feedback.p > 0) feedback.p = Math.min(feedback.p + 0.5, 9.0);
      // Recalculate overall_band as average of all 4 criteria
      if (feedback.fc && feedback.lr && feedback.gra) {
        feedback.overall_band = Math.round(((feedback.fc + feedback.lr + feedback.gra + feedback.p) / 4) * 2) / 2;
      }
    }

    res.json({ feedback });
  } catch (err) {
    console.error('AI evaluate error:', err.message);
    res.status(500).json({ error: 'Failed to evaluate answers' });
  }
});

router.post('/ai/transcribe', aiLimiter, async (req, res) => {
  try {
    const { audio, mimeType } = req.body;
    if (!audio) return res.status(400).json({ error: 'No audio data' });
    const audioBuffer = Buffer.from(audio, 'base64');
    const ext = 'webm';
    const ct = mimeType || 'audio/webm';
    let result = null;
    for (const key of GROQ_KEYS) {
      try {
        const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
        const header = '--' + boundary + '\r\nContent-Disposition: form-data; name="file"; filename="recording.' + ext + '"\r\nContent-Type: ' + ct + '\r\n\r\n';
        const footer = '\r\n--' + boundary + '\r\nContent-Disposition: form-data; name="model"\r\n\r\nwhisper-large-v3\r\n--' + boundary + '\r\nContent-Disposition: form-data; name="language"\r\n\r\nen\r\n--' + boundary + '\r\nContent-Disposition: form-data; name="response_format"\r\n\r\nverbose_json\r\n--' + boundary + '--\r\n';
        const body = Buffer.concat([Buffer.from(header, 'utf-8'), audioBuffer, Buffer.from(footer, 'utf-8')]);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'multipart/form-data; boundary=' + boundary },
          body
        });
        clearTimeout(timeout);
        if (!groqRes.ok) {
          const errBody = await groqRes.text().catch(() => '');
          console.warn('Groq Whisper error [' + key.slice(0, 8) + ']:', groqRes.status, errBody.slice(0, 200));
          continue;
        }
        const d = await groqRes.json();
        if (d.text) {
          result = { text: d.text.trim() };
          // Extract word-level confidence from verbose_json
          if (d.segments && Array.isArray(d.segments)) {
            var wordConfidences = [];
            d.segments.forEach(function(seg) {
              if (seg.words && Array.isArray(seg.words)) {
                seg.words.forEach(function(w) {
                  if (w.word && w.probability !== undefined) {
                    wordConfidences.push({ word: w.word, confidence: w.probability });
                  }
                });
              }
            });
            if (wordConfidences.length > 0) {
              result.wordConfidences = wordConfidences;
              var avgConf = wordConfidences.reduce(function(s, wc) { return s + wc.confidence; }, 0) / wordConfidences.length;
              result.avgWordConfidence = Math.round(avgConf * 1000) / 1000;
            }
          }
          break;
        }
      } catch (e) {
        console.warn('Groq Whisper fetch error:', e.message);
        continue;
      }
    }
    if (!result) return res.status(503).json({ error: 'Transcription failed - all Groq keys exhausted' });
    res.json(result);
  } catch (err) {
    console.error('Transcribe error:', err.message);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

const ttsCache = new Map();
router.get('/ai/tts', async (req, res) => {
  try {
    const text = req.query.text;
    if (!text || text.length > 500) return res.status(400).json({ error: 'Text required (max 500 chars)' });
    var ttsText = text.replace(/\s*([.!?])\s*/g, '$1 ').replace(/  +/g, ' ').trim();

    // Accept accent parameter from client, default to en-US
    const tl = req.query.tl || 'en';
    const langMap = { 'en': 'en', 'en-US': 'en', 'en-GB': 'en-GB', 'en-AU': 'en', 'en-IN': 'en' };
    const ttsLang = langMap[tl] || 'en';

    const cacheKey = ttsLang + ':' + ttsText.toLowerCase().replace(/\s+/g, ' ').trim();
    const cached = ttsCache.get(cacheKey);
    if (cached) {
      res.set('Content-Type', 'audio/mpeg');
      res.set('Content-Length', cached.length);
      res.set('X-TTS-Cache', 'HIT');
      return res.send(cached);
    }
    const maxLen = 200;
    const chunks = [];
    for (let i = 0; i < ttsText.length; i += maxLen) chunks.push(ttsText.slice(i, i + maxLen));
    const audioBuffers = [];
    for (const chunk of chunks) {
      const url = 'https://translate.google.com/translate_tts?ie=UTF-8&q=' + encodeURIComponent(chunk) + '&tl=' + ttsLang + '&client=tw-ob';
      const controller = new AbortController();
      const t = setTimeout(function() { controller.abort(); }, 10000);
      const resp = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } });
      clearTimeout(t);
      if (!resp.ok) throw new Error('Google TTS returned ' + resp.status);
      const buf = Buffer.from(await resp.arrayBuffer());
      audioBuffers.push(buf);
    }
    const combined = Buffer.concat(audioBuffers);
    if (ttsCache.size > 200) {
      const firstKey = ttsCache.keys().next().value;
      ttsCache.delete(firstKey);
    }
    ttsCache.set(cacheKey, combined);
    res.set('Content-Type', 'audio/mpeg');
    res.set('Content-Length', combined.length);
    res.set('Cache-Control', 'public, max-age=86400');
    res.set('X-TTS-Cache', 'MISS');
    res.send(combined);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ════════════════════════════════════════════
//  AUTH-REQUIRED ENDPOINTS
// ════════════════════════════════════════════
router.use(authenticate);

router.get('/available', async (req, res) => {
  try {
    const user = req.user;
    // Update current user's last_login_at so they appear online
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]).catch(function(){});
    // Try strict online check first (last 15 min)
    let result = await query(
      `SELECT u.id, u.username, u.display_name
       FROM users u
       WHERE u.is_active = TRUE
         AND u.last_login_at > NOW() - INTERVAL '15 minutes'
         AND u.id != $1
       ORDER BY RANDOM() LIMIT 10`,
      [user.id]
    );
    // Fallback: if no online users, try ANY other active user
    if (result.rows.length === 0) {
      result = await query(
        `SELECT u.id, u.username, u.display_name
         FROM users u
         WHERE u.is_active = TRUE
           AND u.id != $1
         ORDER BY RANDOM() LIMIT 10`,
        [user.id]
      );
    }
    res.json({ partners: result.rows });
  } catch (err) {
    console.error('Speaking available error:', err);
    res.status(500).json({ error: 'Failed to find partners' });
  }
});

router.post('/request', async (req, res) => {
  try {
    const user = req.user;
    const { toUserId, genderPref, level } = req.body;
    if (!toUserId) return res.status(400).json({ error: 'Missing toUserId' });
    const existing = await query(
      `SELECT id FROM speaking_requests WHERE from_user_id = $1 AND to_user_id = $2 AND status = 'pending' LIMIT 1`,
      [user.id, toUserId]
    );
    if (existing.rows.length > 0) {
      return res.json({ requestId: existing.rows[0].id, message: 'Request already sent' });
    }
    const result = await query(
      `INSERT INTO speaking_requests (from_user_id, to_user_id, gender_pref, level, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING id`,
      [user.id, toUserId, genderPref || 'any', level || 'beginner']
    );
    // Push notification to target user via WebSocket
    try {
      const wss = req.app.locals.wss;
      if (wss && wss.sendToUser) {
        wss.sendToUser(toUserId, {
          type: 'request-received',
          request: {
            id: result.rows[0].id,
            from_user_id: user.id,
            username: user.username,
            display_name: user.display_name || user.username,
            level: level || 'beginner',
          },
        });
      }
    } catch (_) { /* WS push is non-critical */ }
    res.json({ requestId: result.rows[0].id, message: 'Request sent' });
  } catch (err) {
    console.error('Speaking request error:', err);
    res.status(500).json({ error: 'Failed to send request' });
  }
});

router.get('/pending', async (req, res) => {
  try {
    const user = req.user;
    const result = await query(
      `SELECT sr.id, sr.gender_pref, sr.level, sr.created_at,
              u.id as from_user_id, u.username, u.display_name
       FROM speaking_requests sr
       JOIN users u ON u.id = sr.from_user_id
       WHERE sr.to_user_id = $1 AND sr.status = 'pending'
       ORDER BY sr.created_at DESC LIMIT 5`,
      [user.id]
    );
    res.json({ requests: result.rows });
  } catch (err) {
    console.error('Speaking pending error:', err);
    res.status(500).json({ error: 'Failed to load requests' });
  }
});

router.get('/my-requests', async (req, res) => {
  try {
    const user = req.user;
    const result = await query(
      `SELECT sr.id, sr.gender_pref, sr.level, sr.status, sr.created_at,
              u.id as to_user_id, u.username, u.display_name
       FROM speaking_requests sr
       JOIN users u ON u.id = sr.to_user_id
       WHERE sr.from_user_id = $1 AND sr.status IN ('pending','accepted')
       ORDER BY sr.created_at DESC LIMIT 5`,
      [user.id]
    );
    res.json({ requests: result.rows });
  } catch (err) {
    console.error('Speaking my-requests error:', err);
    res.status(500).json({ error: 'Failed to load requests' });
  }
});

router.post('/respond', async (req, res) => {
  try {
    const user = req.user;
    const { requestId, action } = req.body;
    if (!requestId || !action) return res.status(400).json({ error: 'Missing requestId or action' });
    if (!['accept', 'decline'].includes(action)) return res.status(400).json({ error: 'Invalid action' });
    const reqCheck = await query(
      `SELECT id, from_user_id, to_user_id, level FROM speaking_requests WHERE id = $1 AND status = 'pending'`,
      [requestId]
    );
    if (reqCheck.rows.length === 0) return res.status(404).json({ error: 'Request not found or already handled' });
    if (reqCheck.rows[0].to_user_id !== user.id) return res.status(403).json({ error: 'Not your request' });
    await query(`UPDATE speaking_requests SET status = $1 WHERE id = $2`, [action === 'accept' ? 'accepted' : 'declined', requestId]);
    if (action === 'accept') {
      const rd = reqCheck.rows[0];
      const sess = await query(
        `INSERT INTO speaking_sessions (user1_id, user2_id, level, status)
         VALUES ($1, $2, $3, 'active') RETURNING id`,
        [rd.from_user_id, user.id, rd.level || 'beginner']
      );
      const sessionId = sess.rows[0].id;
      await query(`UPDATE speaking_requests SET session_id = $1 WHERE id = $2`, [sessionId, requestId]);
      return res.json({ sessionId, message: 'Session started' });
    }
    res.json({ message: 'Request declined' });
  } catch (err) {
    console.error('Speaking respond error:', err);
    res.status(500).json({ error: 'Failed to respond' });
  }
});

router.get('/session/:id', async (req, res) => {
  try {
    const user = req.user;
    const result = await query(
      `SELECT ss.*, u1.display_name as user1_name, u2.display_name as user2_name
       FROM speaking_sessions ss
       JOIN users u1 ON u1.id = ss.user1_id
       JOIN users u2 ON u2.id = ss.user2_id
       WHERE ss.id = $1 AND (ss.user1_id = $2 OR ss.user2_id = $2)`,
      [req.params.id, user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Session not found' });
    res.json({ session: result.rows[0] });
  } catch (err) {
    console.error('Speaking session error:', err);
    res.status(500).json({ error: 'Failed to load session' });
  }
});

router.post('/session/:id/start-ai', async (req, res) => {
  try {
    const user = req.user;
    const sess = await query(
      `SELECT * FROM speaking_sessions WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [req.params.id, user.id]
    );
    if (sess.rows.length === 0) return res.status(404).json({ error: 'Session not found' });
    const s = sess.rows[0];
    if (s.questions) {
      const qs = typeof s.questions === 'string' ? JSON.parse(s.questions) : s.questions;
      return res.json({ sessionId: s.id, questions: qs, currentIndex: s.current_index || 0, whoStarts: s.who_starts });
    }
    const levelDesc = {
      beginner: 'Beginner (A1-A2) — simple present, basic vocabulary about daily life, hobbies, family',
      elementary: 'Elementary (A2-B1) — past tense, future plans, preferences, opinions',
      intermediate: 'Intermediate (B1-B2) — conditionals, hypotheticals, describing experiences, giving advice',
      'upper-intermediate': 'Upper Intermediate (B2-C1) — complex topics, abstract ideas, debates, nuanced opinions',
      advanced: 'Advanced (C1-C2) — sophisticated discussions, idioms, cultural topics, persuasive arguments'
    }[s.level || 'beginner'] || 'Beginner (A1-A2)';
    const prompt = `You are an English speaking practice assistant. Generate exactly 6 conversation questions for a ${levelDesc} level learner. Rules: - Questions in English only - Vary difficulty - Return ONLY valid JSON array of 6 strings like: ["Q1?","Q2?","Q3?","Q4?","Q5?","Q6?"]`;
    let questions = null;
    const content = await callGroq([{ role: 'user', content: prompt }], 0.7, 1000, 10000);
    if (content) {
      try {
        const p = JSON.parse(content);
        if (Array.isArray(p) && p.length === 6) questions = p;
      } catch (_) {}
    }
    if (!questions) {
      questions = [
        'What do you enjoy doing in your free time?',
        'Can you describe a memorable trip you have taken?',
        'What are your plans for the future?',
        'How do you usually spend weekends?',
        'What is something new you learned recently?',
        'If you could visit any country, where would you go and why?'
      ];
    }
    const whoStarts = Math.random() < 0.5 ? s.user1_id : s.user2_id;
    await query(
      `UPDATE speaking_sessions SET questions = $1::jsonb, current_index = 0, who_starts = $2 WHERE id = $3`,
      [JSON.stringify(questions), whoStarts, s.id]
    );
    res.json({ sessionId: s.id, questions, currentIndex: 0, whoStarts });
  } catch (err) {
    console.error('Speaking start-ai error:', err);
    res.status(500).json({ error: 'Failed to start AI' });
  }
});

router.post('/session/:id/answer', async (req, res) => {
  try {
    const user = req.user;
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ error: 'Missing answer' });
    const sess = await query(
      `SELECT * FROM speaking_sessions WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [req.params.id, user.id]
    );
    if (sess.rows.length === 0) return res.status(404).json({ error: 'Session not found' });
    const s = sess.rows[0];
    const answers = s.answers || [];
    answers.push({ userId: user.id, answer, questionIndex: s.current_index || 0, timestamp: new Date().toISOString() });
    const nextIndex = (s.current_index || 0) + 1;
    let whoNext = null;
    if (nextIndex < 6) {
      whoNext = s.user1_id === user.id ? s.user2_id : s.user1_id;
    }
    const questions = typeof s.questions === 'string' ? JSON.parse(s.questions) : (s.questions || []);
    await query(
      `UPDATE speaking_sessions SET answers = $1::jsonb, current_index = $2 WHERE id = $3`,
      [JSON.stringify(answers), nextIndex, s.id]
    );
    // Push update to the other participant via WebSocket
    try {
      const wss = req.app.locals.wss;
      if (wss) {
        const partnerId = s.user1_id === user.id ? s.user2_id : s.user1_id;
        wss.sendToUser(partnerId, {
          type: 'session-update',
          sessionId: s.id,
          data: {
            current_index: nextIndex,
            who_starts: whoNext || s.who_starts,
            questions: s.questions,
          },
        });
      }
    } catch (_) { /* WS push is non-critical */ }
    res.json({ currentIndex: nextIndex, whoNext, question: nextIndex < 6 ? questions[nextIndex] : null, isComplete: nextIndex >= 6 });
  } catch (err) {
    console.error('Speaking answer error:', err);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

router.post('/session/:id/feedback', async (req, res) => {
  try {
    const user = req.user;
    const sess = await query(
      `SELECT * FROM speaking_sessions WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [req.params.id, user.id]
    );
    if (sess.rows.length === 0) return res.status(404).json({ error: 'Session not found' });
    const s = sess.rows[0];
    if (s.status !== 'active') return res.status(400).json({ error: 'Session already completed' });
    const userAnswers = (s.answers || []).filter(a => a.userId === user.id);
    if (userAnswers.length === 0) return res.status(400).json({ error: 'No answers to analyze' });
    const partnerId = s.user1_id === user.id ? s.user2_id : s.user1_id;
    const partnerAnswers = (s.answers || []).filter(a => a.userId === partnerId);
    const questions = typeof s.questions === 'string' ? JSON.parse(s.questions) : (s.questions || []);
    const myText = userAnswers.map(a => 'Q: ' + (questions[a.questionIndex] || '') + '\nA: ' + a.answer).join('\n\n');
    const partnerText = partnerAnswers.map(a => 'Q: ' + (questions[a.questionIndex] || '') + '\nA: ' + a.answer).join('\n\n');
    const prompt = 'You are an English speaking coach. Analyze these answers for a ' + (s.level || 'beginner') + ' level learner.\n\nMY ANSWERS:\n' + myText + '\n\nPARTNER ANSWERS:\n' + partnerText + '\n\nReturn ONLY valid JSON: {"myFeedback":"...","myScore":85,"myStrengths":["..."],"myWeaknesses":["..."],"myTip":"...","partnerFeedback":"...","partnerScore":78,"partnerStrengths":["..."],"partnerWeaknesses":["..."]}';
    let feedback = null;
    const content = await callGroq([{ role: 'user', content: prompt }], 0.5, 1500, 15000);
    if (content) {
      try {
        const p = JSON.parse(content);
        if (p.myFeedback) feedback = p;
      } catch (_) {}
    }
    if (!feedback) {
      feedback = {
        myFeedback: 'Good effort! Try to expand your answers with more details and examples.',
        myScore: 75,
        myStrengths: ['Good effort', 'Clear answers'],
        myWeaknesses: ['Could add more detail'],
        myTip: 'Try using more descriptive words in your answers.',
        partnerFeedback: 'Your partner showed good participation in the conversation.',
        partnerScore: 75,
        partnerStrengths: ['Participation'],
        partnerWeaknesses: ['N/A'],
      };
    }
    const existingFeedback = s.feedback || {};
    existingFeedback[user.id] = feedback;
    await query(
      `UPDATE speaking_sessions SET feedback = $1::jsonb WHERE id = $2`,
      [JSON.stringify(existingFeedback), s.id]
    );
    const bothDone = existingFeedback && existingFeedback[s.user1_id] && existingFeedback[s.user2_id];
    if (bothDone) {
      await query(`UPDATE speaking_sessions SET status = 'completed', completed_at = NOW() WHERE id = $1`, [s.id]);
    }
    res.json({ feedback });
  } catch (err) {
    console.error('Speaking feedback error:', err);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

router.post('/session/:id/rate', async (req, res) => {
  try {
    const user = req.user;
    const { rating } = req.body;
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be 1-5' });
    }
    const sess = await query(
      `SELECT * FROM speaking_sessions WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)`,
      [req.params.id, user.id]
    );
    if (sess.rows.length === 0) return res.status(404).json({ error: 'Session not found' });
    await query(`UPDATE speaking_sessions SET rating = $1 WHERE id = $2`, [rating, req.params.id]);
    res.json({ message: 'Rating saved', rating });
  } catch (err) {
    console.error('Speaking rating error:', err);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

module.exports = router;
