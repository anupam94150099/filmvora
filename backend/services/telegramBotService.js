import { searchTmdb } from './tmdbService.js';

class TelegramBotService {
  constructor() {
    this.token = process.env.TELEGRAM_BOT_TOKEN || '';
    this.channelUrl = process.env.TELEGRAM_CHANNEL_URL || 'https://t.me/filmvora_official';
    this.clientUrl = process.env.CLIENT_URL || 'http://localhost:5174';
    this.isRunning = false;
    this.lastUpdateId = 0;
    this.pollingInterval = null;
  }

  init(token, channelUrl, clientUrl) {
    if (token) this.token = token;
    if (channelUrl) this.channelUrl = channelUrl;
    if (clientUrl) this.clientUrl = clientUrl;
    if (this.token && this.token.trim()) {
      this.startPolling();
    } else {
      console.log('[Telegram Bot] Ready. Bot token can be set in Admin Settings or .env');
    }
  }

  async makeRequest(method, body = {}) {
    if (!this.token) return null;
    try {
      const url = `https://api.telegram.org/bot${this.token}/${method}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return await res.json();
    } catch (err) {
      console.error(`[Telegram Bot Error in ${method}]:`, err.message);
      return null;
    }
  }

  startPolling() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[Telegram Bot] Active and listening for incoming movie search queries...');
    this.pollUpdates();
    this.pollingInterval = setInterval(() => this.pollUpdates(), 3000);
  }

  stopPolling() {
    this.isRunning = false;
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  async pollUpdates() {
    if (!this.token || !this.isRunning) return;
    try {
      const data = await this.makeRequest('getUpdates', {
        offset: this.lastUpdateId + 1,
        timeout: 2,
        allowed_updates: ['message'],
      });
      if (data && data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          this.lastUpdateId = update.update_id;
          if (update.message) {
            await this.handleMessage(update.message);
          }
        }
      }
    } catch (err) {}
  }

  async handleMessage(msg) {
    const chatId = msg.chat?.id;
    const text = (msg.text || '').trim();
    if (!chatId || !text) return;

    if (text === '/start' || text === '/help') {
      const welcomeText = `🎬 *Welcome to FILMVORA Movie Search Bot!*\n\n🍿 *Stories Worth Watching.*\n\n⚡ Search *ANY* Bollywood, Hollywood, South Indian, or Anime movie & Web Series in the world!\n\n🔍 *How to use:*\nSimply send the movie name here (e.g. *Pushpa 2*, *Jawan*, *Avatar*, *Mirzapur*, *Oppenheimer*) and I will fetch instant 4K streaming and direct download links!`;
      await this.makeRequest('sendMessage', {
        chat_id: chatId,
        text: welcomeText,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🌐 Open FILMVORA Website', url: this.clientUrl },
              { text: '📢 Join Telegram Channel', url: this.channelUrl },
            ],
          ],
        },
      });
      return;
    }

    const query = text.replace(/^\/search\s+/i, '').trim();
    if (!query) return;

    await this.makeRequest('sendChatAction', { chat_id: chatId, action: 'typing' });
    const results = await searchTmdb(query, 1);

    if (!results || results.length === 0) {
      await this.makeRequest('sendMessage', {
        chat_id: chatId,
        text: `❌ No movies found matching *${query}*.\n\nSearch directly on our website:`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔍 Search on FILMVORA', url: `${this.clientUrl}/search?q=${encodeURIComponent(query)}` }],
          ],
        },
      });
      return;
    }

    const topResults = results.slice(0, 3);
    for (const movie of topResults) {
      const watchUrl = `${this.clientUrl}/watch/${movie.slug || movie._id}`;
      const downloadUrl = `${this.clientUrl}/movie/${movie.slug || movie._id}`;
      const caption = `🎬 *${movie.title}* (${movie.releaseYear})\n\n⭐ *IMDb:* ${movie.rating}/10 • 🎭 *Genre:* ${movie.genre}\n\n📖 ${(movie.description || '').slice(0, 160)}...\n\n👇 *Click below to Watch or Download:*`;
      const inlineKeyboard = [
        [
          { text: '▶️ Watch Online (4K)', url: watchUrl },
          { text: '⚡ Direct Download', url: downloadUrl },
        ],
        [
          { text: '📢 Official Channel', url: this.channelUrl },
        ],
      ];

      if (movie.posterUrl && movie.posterUrl.startsWith('http')) {
        await this.makeRequest('sendPhoto', {
          chat_id: chatId,
          photo: movie.posterUrl,
          caption: caption,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: inlineKeyboard },
        });
      } else {
        await this.makeRequest('sendMessage', {
          chat_id: chatId,
          text: caption,
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: inlineKeyboard },
        });
      }
    }
  }
}

export const telegramBot = new TelegramBotService();
export default telegramBot;
