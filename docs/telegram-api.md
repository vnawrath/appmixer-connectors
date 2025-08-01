# Telegram Bot API Cheat Sheet for NodeJS Workflow Automation

This cheat sheet covers the essential Telegram Bot API operations for integrating Telegram bots into NodeJS workflow automation platforms.

## 🚀 Getting Started

### 1. Create a Bot
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` command
3. Follow instructions to get your bot token
4. Format: `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`

### 2. Installation
```bash
npm install node-telegram-bot-api
# For TypeScript support
npm install --save-dev @types/node-telegram-bot-api
```

## 🔧 Basic Setup

### Polling Mode (Development)
```javascript
const TelegramBot = require('node-telegram-bot-api');

const token = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Listen to all messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log('Received:', msg.text);
});
```

### Webhook Mode (Production)
```javascript
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = 'YOUR_BOT_TOKEN';
const bot = new TelegramBot(token);
const app = express();

// Set webhook
bot.setWebHook(`https://your-domain.com/bot${token}`);

// Handle webhook
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(3000);
```

## 📨 Sending Messages

### Basic Text Message
```javascript
bot.sendMessage(chatId, 'Hello World!');
```

### Formatted Messages
```javascript
// HTML formatting
bot.sendMessage(chatId, '<b>Bold</b> and <i>italic</i> text', {
  parse_mode: 'HTML'
});

// Markdown formatting
bot.sendMessage(chatId, '*Bold* and _italic_ text', {
  parse_mode: 'Markdown'
});
```

### With Keyboard
```javascript
const opts = {
  reply_markup: {
    keyboard: [
      ['Option 1', 'Option 2'],
      ['Option 3']
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

bot.sendMessage(chatId, 'Choose an option:', opts);
```

### Inline Keyboard
```javascript
const opts = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Button 1', callback_data: 'btn1' },
        { text: 'Button 2', callback_data: 'btn2' }
      ],
      [{ text: 'Website', url: 'https://example.com' }]
    ]
  }
};

bot.sendMessage(chatId, 'Choose action:', opts);
```

## 📥 Receiving Messages

### Text Messages
```javascript
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (text === '/start') {
    bot.sendMessage(chatId, 'Welcome!');
  }
});
```

### Command Handling with Regex
```javascript
// Handle /echo command
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const response = match[1]; // Captured text after /echo
  bot.sendMessage(chatId, response);
});
```

### Callback Queries (Inline Buttons)
```javascript
bot.on('callback_query', (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;
  const chatId = message.chat.id;
  
  if (data === 'btn1') {
    bot.sendMessage(chatId, 'You clicked Button 1!');
  }
  
  // Acknowledge the callback
  bot.answerCallbackQuery(callbackQuery.id);
});
```

## 🔐 Authentication & User Info

### Get Bot Information
```javascript
bot.getMe().then((botInfo) => {
  console.log('Bot info:', botInfo);
});
```

### Get Chat Information
```javascript
bot.getChat(chatId).then((chat) => {
  console.log('Chat info:', chat);
});
```

## 🌐 Webhook Management

### Set Webhook
```javascript
const webhookUrl = 'https://your-domain.com/webhook';

bot.setWebHook(webhookUrl, {
  max_connections: 40,
  allowed_updates: ['message', 'callback_query']
}).then(() => {
  console.log('Webhook set successfully');
});
```

### Get Webhook Info
```javascript
bot.getWebHookInfo().then((info) => {
  console.log('Webhook info:', info);
});
```

### Delete Webhook
```javascript
bot.deleteWebHook().then(() => {
  console.log('Webhook deleted');
});
```

## 📎 File Operations

### Send Photo
```javascript
// From URL
bot.sendPhoto(chatId, 'https://example.com/image.jpg');

// From local file
bot.sendPhoto(chatId, 'path/to/photo.jpg');

// From buffer
const photoBuffer = fs.readFileSync('photo.jpg');
bot.sendPhoto(chatId, photoBuffer);
```

### Send Document
```javascript
bot.sendDocument(chatId, 'path/to/document.pdf', {
  caption: 'Here is your document'
});
```

### Get File
```javascript
bot.on('photo', (msg) => {
  const fileId = msg.photo[msg.photo.length - 1].file_id;
  
  bot.getFile(fileId).then((file) => {
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    console.log('Download URL:', fileUrl);
  });
});
```

## 🛠 Workflow Integration Examples

### Simple Command Router
```javascript
const commands = {
  '/start': (chatId) => bot.sendMessage(chatId, 'Welcome to our service!'),
  '/help': (chatId) => bot.sendMessage(chatId, 'Available commands: /start, /help, /status'),
  '/status': (chatId) => bot.sendMessage(chatId, 'System is running normally')
};

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const command = msg.text;
  
  if (commands[command]) {
    commands[command](chatId);
  }
});
```

### User State Management
```javascript
const userStates = {};

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;
  
  if (text === '/register') {
    userStates[userId] = 'awaiting_name';
    bot.sendMessage(chatId, 'Please enter your name:');
    return;
  }
  
  if (userStates[userId] === 'awaiting_name') {
    // Process name registration
    userStates[userId] = null;
    bot.sendMessage(chatId, `Thank you, ${text}! Registration complete.`);
  }
});
```

### Error Handling
```javascript
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});

bot.on('webhook_error', (error) => {
  console.log('Webhook error:', error);
});

// Wrap API calls in try-catch
async function sendSafeMessage(chatId, text) {
  try {
    await bot.sendMessage(chatId, text);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}
```

## 📝 Best Practices

1. **Rate Limiting**: Telegram allows 30 messages per second per bot
2. **Error Handling**: Always handle API errors gracefully
3. **Webhook Security**: Validate incoming webhooks using secret tokens
4. **User Privacy**: Don't log sensitive user information
5. **Command Structure**: Use clear, consistent command naming
6. **State Management**: Store user sessions in a database for production
7. **Logging**: Implement proper logging for debugging and monitoring

## 🔗 Useful Resources

- [Official Telegram Bot API](https://core.telegram.org/bots/api)
- [node-telegram-bot-api Documentation](https://github.com/yagop/node-telegram-bot-api)
- [Telegraf Framework](https://github.com/telegraf/telegraf) (Alternative)
- [BotFather Commands](https://core.telegram.org/bots#botfather)