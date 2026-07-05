require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const https = require('https');
const http = require('http');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE = process.env.API_BASE_URL || 'http://localhost:3001';
const POLL_INTERVAL = 1000;
const ADMIN_ID = 5684720948;

if (!BOT_TOKEN) {
  module.exports = { startBot: function() { console.log('Telegram bot disabled: no token'); }, isAvailable: false };
  return;
}

let lastUpdateId = 0;
let pollRetryDelay = 1000;
const pendingAdminActions = new Map();

const PREMIUM_TIERS = ['Basic', 'Premium', 'Premium Ultra'];

function tgApi(method, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const opts = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/${method}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    };
    const req = https.request(opts, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve(null); } });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function backendCall(path, payload) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const url = new URL(`${API_BASE}${path}`);
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { resolve(null); }
      });
    });
    req.on('error', (e) => { console.error('Backend call error:', e.message); resolve(null); });
    req.write(data);
    req.end();
  });
}

function backendGet(path) {
  return new Promise((resolve) => {
    const url = new URL(`${API_BASE}${path}`);
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.get(url, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { resolve(null); }
      });
    });
    req.on('error', (e) => { console.error('Backend GET error:', e.message); resolve(null); });
  });
}

async function registerBotUser(user, chatId) {
  const result = await backendCall('/api/auth/telegram/bot/register-user', {
    user: { id: user.id, username: user.username, first_name: user.first_name, last_name: user.last_name },
    chatId,
    isAdmin: user.id === ADMIN_ID,
  });
  return result;
}

function sendMessage(chatId, text, extra) {
  const payload = { chat_id: chatId, text, ...extra };
  return tgApi('sendMessage', payload);
}

function sendKeyboard(chatId, text, buttons) {
  return sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: buttons,
      resize_keyboard: true,
    },
  });
}

async function handleStart(update) {
  const msg = update.message;
  const user = msg.from;
  const chatId = msg.chat.id;
  const firstName = user.first_name || 'User';

  // Register/store bot user via backend (idempotent)
  await registerBotUser(user, chatId);

  if (user.id === ADMIN_ID) {
    await sendKeyboard(chatId,
      `👑 *Admin Panel — Piyala*\n\nWelcome back, *${firstName}!*\n\nChoose an option:`,
      [
        [{ text: '📊 Bot & Website Stats', callback_data: 'admin_stats' }],
        [{ text: '🎁 Give Premium to User', callback_data: 'admin_give_premium' }],
        [{ text: '📋 List Premium Users', callback_data: 'admin_list_premium' }],
        [{ text: '🆕 Pending Payments', callback_data: 'admin_pending_payments' }],
        [{ text: '📢 Broadcast to Website', callback_data: 'admin_broadcast' }],
        [{ text: '🌐 Open Website', url: 'https://vocabmasterai.site' }],
      ]
    );
  } else {
    // Forward to webhook — it handles pending code delivery or sends welcome
    await backendCall('/api/auth/telegram/tg-webhook', {
      message: { from: user, chat: { id: chatId }, text: '/start' },
    });
  }
}

async function handleAdminCallback(query) {
  const data = query.data;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;

  if (userId !== ADMIN_ID) {
    await tgApi('answerCallbackQuery', {
      callback_query_id: query.id,
      text: '⛔ You are not authorized as admin.',
      show_alert: true,
    });
    return;
  }

  if (data === 'admin_stats') {
    const stats = await backendGet('/api/auth/telegram/admin/stats');
    if (!stats) {
      await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Failed to get stats', show_alert: true });
      return;
    }
    await tgApi('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text: `📊 *Piyala — Statistics*\n\n👥 *Website Users:* \`${stats.websiteUsers || 0}\`\n🤖 *Bot Users:* \`${stats.botUsers || 0}\`\n👑 *Premium Users:* \`${stats.premiumUsers || 0}\`\n\n📅 *Last Updated:* ${new Date().toLocaleString()}`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔄 Refresh', callback_data: 'admin_stats' }],
          [{ text: '🔙 Back to Admin', callback_data: 'admin_back' }],
        ],
      },
    });
    await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Stats updated!' });
  }

  else if (data === 'admin_give_premium') {
    await tgApi('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text: `🎁 *Give Premium to User*\n\nSend me the *User ID* (short ID like \`12345678\` or full UUID) of the user you want to give premium to.\n\nTo cancel, send /cancel`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [[{ text: '🔙 Cancel', callback_data: 'admin_back' }]] },
    });
    pendingAdminActions.set(chatId, { action: 'awaiting_user_id' });
    await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Enter user ID' });
  }

  else if (data === 'admin_list_premium') {
    const result = await backendGet('/api/auth/telegram/admin/premium-users');
    const users = result?.users || [];
    let text = '👑 *Premium Users*\n\n';
    if (users.length === 0) {
      text += 'No premium users yet.';
    } else {
      users.forEach((u, i) => {
        text += `${i + 1}. \`${u.short_id}\` — *${u.tier}* — ${u.display_name}\n`;
      });
    }
    await tgApi('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [[{ text: '🔙 Back to Admin', callback_data: 'admin_back' }]] },
    });
    await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Done' });
  }

  else if (data === 'admin_pending_payments') {
    const result = await backendGet('/api/auth/telegram/admin/pending-payments');
    const requests = result?.requests || [];
    let text = '🆕 *Pending Payments*\n\n';
    if (requests.length === 0) {
      text += 'No pending payments.';
    } else {
      requests.forEach((r, i) => {
        const amount = r.period === 'yearly' ? (r.country && r.country !== 'UZ' ? r.tier + ' USD' : r.tier) : r.tier;
        text += `${i + 1}. *${r.tier}* — ${r.display_name || r.username}\n`;
        text += `   🆔 \`${r.short_id}\` | 💳 ${r.card_type}\n`;
        text += `   📞 ${r.phone || 'N/A'} | 🌍 ${r.country || 'N/A'}\n`;
        text += `   🕐 ${new Date(r.created_at).toLocaleString()}\n\n`;
      });
    }
    await tgApi('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [[{ text: '🔙 Back to Admin', callback_data: 'admin_back' }]] },
    });
    await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Done' });
  }

  else if (data === 'admin_back') {
    pendingAdminActions.delete(chatId);
    await tgApi('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text: `👑 *Admin Panel — Piyala*\n\nChoose an option:`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📊 Bot & Website Stats', callback_data: 'admin_stats' }],
          [{ text: '🎁 Give Premium to User', callback_data: 'admin_give_premium' }],
          [{ text: '📋 List Premium Users', callback_data: 'admin_list_premium' }],
        [{ text: '🆕 Pending Payments', callback_data: 'admin_pending_payments' }],
        [{ text: '📢 Broadcast to Website', callback_data: 'admin_broadcast' }],
        [{ text: '🌐 Open Website', url: 'https://vocabmasterai.site' }],
        ],
      },
    });
  }

  // Broadcast to Website — step 1: ask for message
  else if (data === 'admin_broadcast') {
    pendingAdminActions.set(chatId, { action: 'awaiting_broadcast_msg' });
    await tgApi('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text: '📢 *Broadcast to Website*\n\nXabar matnini yuboring.\n\nBekor qilish uchun /cancel yozing.',
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [[{ text: '🔙 Cancel', callback_data: 'admin_back' }]] },
    });
    await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Xabar matnini yozing' });
  }

  // Broadcast — step 3: expiry selection
  else if (data.startsWith('broadcast_expiry_')) {
    const days = parseInt(data.replace('broadcast_expiry_', ''));
    const pendingAction = pendingAdminActions.get(chatId);
    if (!pendingAction || !pendingAction.broadcastMessage) {
      await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Session expired. Try again.', show_alert: true });
      return;
    }
    var expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    var bcResult = await backendCall('/api/notifications/bot-broadcast', {
      title: pendingAction.broadcastTitle || 'Admin Announcement',
      message: pendingAction.broadcastMessage,
      expiresIn: days,
    });
    pendingAdminActions.delete(chatId);
    if (bcResult && bcResult.success) {
      await tgApi('editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text: '✅ *Broadcast yuborildi!*\n\nBarcha foydalanuvchilar website notification panelida ko\'radi.\n\n📌 *' + (pendingAction.broadcastTitle || 'Admin Announcement') + '*\n' + pendingAction.broadcastMessage,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🔙 Back to Admin', callback_data: 'admin_back' }]] },
      });
      await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: '✅ Broadcast yuborildi!' });
    } else {
      await tgApi('editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text: '❌ Xatolik: ' + (bcResult?.error || 'Broadcast yuborilmadi'),
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🔙 Back to Admin', callback_data: 'admin_back' }]] },
      });
      await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Xatolik yuz berdi', show_alert: true });
    }
  }

  // Payment approve
  else if (data.startsWith('payment_approve_')) {
    const paymentId = data.replace('payment_approve_', '');
    const result = await backendCall('/api/auth/telegram/payment/approve', { paymentId });
    if (result && result.success) {
      await tgApi('editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text: `✅ *Payment Approved!*\n\nPremium has been granted successfully and the user has been notified.`,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🔙 Back to Admin', callback_data: 'admin_back' }]] },
      });
      await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: '✅ Approved! User notified.' });
    } else {
      await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: result?.error || 'Failed to approve', show_alert: true });
    }
  }

  // Payment reject - ask for reason
  else if (data.startsWith('payment_reject_')) {
    const paymentId = data.replace('payment_reject_', '');
    pendingAdminActions.set(chatId, { action: 'awaiting_reject_reason', paymentId });
    await tgApi('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text: `❌ *Reject Payment*\n\nPlease send a reason for rejection.\n\nThe user will receive this message.\n\nTo cancel, send /cancel`,
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: [[{ text: '🔙 Cancel', callback_data: 'admin_back' }]] },
    });
    await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Enter rejection reason' });
  }

  // Premium tier selection from inline keyboard
  else if (data.startsWith('premium_tier_')) {
    const tier = data.replace('premium_tier_', '');
    const pendingAction = pendingAdminActions.get(chatId);
    if (!pendingAction || !pendingAction.targetUserId) {
      await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Session expired. Use /givepremium again.', show_alert: true });
      return;
    }

    const result = await backendCall('/api/auth/telegram/admin/give-premium', {
      userId: pendingAction.targetUserId,
      tier,
      grantedByAdminId: userId,
    });

    if (result && result.success) {
      await tgApi('editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text: `✅ *Premium Granted Successfully!*\n\nUser: \`${pendingAction.targetShortId || pendingAction.targetUserId}\`\nTier: *${tier}*\n\nUser has been notified in the bot.`,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: [[{ text: '🔙 Back to Admin', callback_data: 'admin_back' }]] },
      });

      // Notify the granted user
      if (result.userChatId) {
        await sendMessage(result.userChatId,
          `🎉 *Congratulations!*\n\nYou have been granted *${tier}* Premium! 🎊\n\nEnjoy all the premium features now available in your account.\n\n[Open Piyala](https://vocabmasterai.site)`,
          { parse_mode: 'Markdown', disable_web_page_preview: true }
        );
      }

      await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: `✅ ${tier} premium granted!` });
    } else {
      await tgApi('answerCallbackQuery', { callback_query_id: query.id, text: result?.error || 'Failed to grant premium', show_alert: true });
    }
    pendingAdminActions.delete(chatId);
  }
}

async function handleAdminMessage(msg) {
  const user = msg.from;
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (user.id !== ADMIN_ID) return;

  // Handle /cancel
  if (text.toLowerCase() === '/cancel') {
    pendingAdminActions.delete(chatId);
    await sendKeyboard(chatId,
      '✅ Cancelled. Use /admin to return to the admin panel.',
      [[{ text: '👑 Admin Panel', callback_data: 'admin_back' }]]
    );
    return;
  }

  // Handle /admin command
  if (text.toLowerCase() === '/admin') {
    pendingAdminActions.delete(chatId);
    await sendKeyboard(chatId,
      `👑 *Admin Panel — Piyala*\n\nWelcome back!\n\nChoose an option:`,
      [
        [{ text: '📊 Bot & Website Stats', callback_data: 'admin_stats' }],
        [{ text: '🎁 Give Premium to User', callback_data: 'admin_give_premium' }],
        [{ text: '📋 List Premium Users', callback_data: 'admin_list_premium' }],
        [{ text: '🆕 Pending Payments', callback_data: 'admin_pending_payments' }],
        [{ text: '📢 Broadcast to Website', callback_data: 'admin_broadcast' }],
        [{ text: '🌐 Open Website', url: 'https://vocabmasterai.site' }],
      ]
    );
    return;
  }

  // Handle /givepremium <user-id>
  if (text.toLowerCase().startsWith('/givepremium')) {
    const parts = text.split(/\s+/);
    if (parts.length < 2) {
      await sendMessage(chatId, 'Usage: /givepremium <user_id>\nExample: /givepremium 12345678', { parse_mode: 'Markdown' });
      return;
    }
    const targetUserId = parts.slice(1).join(' ');
    pendingAdminActions.set(chatId, { action: 'awaiting_user_id', targetUserId, targetShortId: targetUserId });
    await sendKeyboard(chatId,
      `🎁 *Select Premium Tier*\n\nTarget User: \`${targetUserId}\`\n\nChoose the premium tier to grant:`,
      [
        [{ text: '🚀 Basic', callback_data: 'premium_tier_Basic' }],
        [{ text: '👑 Premium', callback_data: 'premium_tier_Premium' }],
        [{ text: '⭐ Premium Ultra', callback_data: 'premium_tier_Premium Ultra' }],
        [{ text: '🔙 Cancel', callback_data: 'admin_back' }],
      ]
    );
    return;
  }

  // Handle /stats command
  if (text.toLowerCase() === '/stats') {
    const stats = await backendGet('/api/auth/telegram/admin/stats');
    if (!stats) {
      await sendMessage(chatId, '❌ Failed to fetch stats. Is the backend running?', {});
      return;
    }
    await sendMessage(chatId,
      `📊 *Piyala — Statistics*\n\n👥 *Website Users:* \`${stats.websiteUsers || 0}\`\n🤖 *Bot Users:* \`${stats.botUsers || 0}\`\n👑 *Premium Users:* \`${stats.premiumUsers || 0}\``,
      { parse_mode: 'Markdown' }
    );
    return;
  }

  // Handle broadcast message input
  const pendingAction = pendingAdminActions.get(chatId);
  if (pendingAction && pendingAction.action === 'awaiting_broadcast_msg') {
    var bcMessage = text.trim();
    if (!bcMessage) {
      await sendMessage(chatId, 'Xabar matni bo\'sh bo\'lishi mumkin emas. Qaytadan yozing yoki /cancel.');
      return;
    }
    // Parse optional title: "Sarlavha | Xabar"
    var bcTitle = 'Admin Announcement';
    var pipeIdx = bcMessage.indexOf(' | ');
    if (pipeIdx !== -1) {
      bcTitle = bcMessage.substring(0, pipeIdx).trim();
      bcMessage = bcMessage.substring(pipeIdx + 3).trim();
    }
    pendingAdminActions.set(chatId, {
      action: 'awaiting_broadcast_expiry',
      broadcastTitle: bcTitle,
      broadcastMessage: bcMessage,
    });
    await sendKeyboard(chatId,
      '📢 *Broadcast*\n\n' + bcTitle + '\n' + bcMessage + '\n\nQancha vaqt turishi kerak?',
      [
        [{ text: '1 kun', callback_data: 'broadcast_expiry_1' }, { text: '2 kun', callback_data: 'broadcast_expiry_2' }, { text: '3 kun', callback_data: 'broadcast_expiry_3' }],
        [{ text: '7 kun', callback_data: 'broadcast_expiry_7' }, { text: '14 kun', callback_data: 'broadcast_expiry_14' }, { text: '30 kun', callback_data: 'broadcast_expiry_30' }],
        [{ text: '🔙 Cancel', callback_data: 'admin_back' }],
      ]
    );
    return;
  }

  // Handle rejection reason input
  if (pendingAction && pendingAction.action === 'awaiting_reject_reason') {
    const reason = text;
    const result = await backendCall('/api/auth/telegram/payment/reject', {
      paymentId: pendingAction.paymentId,
      reason,
    });
    pendingAdminActions.delete(chatId);
    if (result && result.success) {
      await sendMessage(chatId,
        `✅ *Payment Rejected*\n\nThe user has been notified with the reason.`,
        { parse_mode: 'Markdown' }
      );
    } else {
      await sendMessage(chatId,
        `❌ Failed to reject payment. Please try again.`,
        { parse_mode: 'Markdown' }
      );
    }
    return;
  }

  if (pendingAction && pendingAction.action === 'awaiting_user_id') {
    const targetUserId = text.trim();
    pendingAdminActions.set(chatId, { action: 'awaiting_tier', targetUserId, targetShortId: targetUserId });
    await sendKeyboard(chatId,
      `🎁 *Select Premium Tier*\n\nTarget User: \`${targetUserId}\`\n\nChoose the premium tier to grant:`,
      [
        [{ text: '🚀 Basic', callback_data: 'premium_tier_Basic' }],
        [{ text: '👑 Premium', callback_data: 'premium_tier_Premium' }],
        [{ text: '⭐ Premium Ultra', callback_data: 'premium_tier_Premium Ultra' }],
        [{ text: '🔙 Cancel', callback_data: 'admin_back' }],
      ]
    );
    return;
  }
}

async function handleUpdate(update) {
  if (update.callback_query) {
    await handleAdminCallback(update.callback_query);
    return;
  }

  const msg = update.message;
  if (!msg || !msg.from) return;
  const user = msg.from;
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim().toLowerCase();

  // Save bot user on ANY interaction
  await registerBotUser(user, chatId);

  // Handle /start
  if (text.startsWith('/start')) {
    await handleStart(update);
    return;
  }

  // Handle admin commands
  if (user.id === ADMIN_ID) {
    await handleAdminMessage(msg);
    return;
  }

  // For regular users: forward to existing webhook for code delivery
  await backendCall('/api/auth/telegram/tg-webhook', {
    message: { from: user, chat: { id: chatId }, text: msg.text },
  });
}

async function poll() {
  try {
    const result = await tgApi('getUpdates', { offset: lastUpdateId + 1, timeout: 5 });
    if (result && result.ok) {
      pollRetryDelay = 1000;
      if (result.result.length > 0) {
        console.log(`Got ${result.result.length} update(s)`);
        for (const update of result.result) {
          if (update.update_id > lastUpdateId) lastUpdateId = update.update_id;
          handleUpdate(update);
        }
      }
    } else if (result && !result.ok) {
      if (result.description && result.description.includes('Conflict')) {
        pollRetryDelay = Math.min(pollRetryDelay * 2, 30000);
        console.log('Poll conflict — another instance running, retrying in ' + pollRetryDelay + 'ms');
      } else {
        console.error('Telegram API error:', result.description);
      }
    }
  } catch (e) { console.error('Poll error:', e.message); }
}

async function run() {
  await tgApi('deleteWebhook', { drop_pending_updates: true });
  await poll();
  setTimeout(run, pollRetryDelay);
}

if (require.main === module) {
  console.log(`Piyala Bot started (admin mode)`);
  console.log(`   Admin ID: ${ADMIN_ID}`);
  console.log(`   API: ${API_BASE}`);
  console.log(`   Polling interval: ${POLL_INTERVAL}ms`);
  run();
}

module.exports = { startBot: run };
