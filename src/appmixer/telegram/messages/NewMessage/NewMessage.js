"use strict";

const TelegramBot = require("node-telegram-bot-api");

module.exports = {
  async start(context) {
    const botToken = context.auth.botToken;

    if (!botToken) {
      throw new Error(
        "Telegram bot token is required. Please configure authentication."
      );
    }

    try {
      const bot = new TelegramBot(botToken, { polling: false });

      // Validate bot token
      await bot.getMe();

      const webhookUrl = context.getWebhookUrl();

      // Set webhook with Telegram
      await bot.setWebHook(webhookUrl, {
        max_connections: 40,
        allowed_updates: ["message", "edited_message"],
      });

      // Store webhook info in context state for cleanup
      return context.saveState({
        webhookUrl: webhookUrl,
      });
    } catch (error) {
      if (
        error.message.includes("ENOTFOUND") ||
        error.message.includes("401")
      ) {
        throw new Error(`Invalid Telegram bot token: ${error.message}`);
      }
      throw new Error(`Failed to register webhook: ${error.message}`);
    }
  },

  async stop(context) {
    try {
      const botToken = context.auth.accessToken;
      if (botToken && context.state.webhookUrl) {
        const bot = new TelegramBot(botToken, { polling: false });
        await bot.deleteWebHook();
      }
    } catch (error) {
      // Use AppMixer logging instead of console.error
      await context.log({
        step: "webhook-cleanup-error",
        error: error.message,
        component: "telegram-newmessage",
      });
      // Don't throw - allow graceful cleanup
    }
  },

  async receive(context) {
    if (context.messages.webhook) {
      const update = context.messages.webhook.content.data;

      // Handle regular messages
      if (update.message) {
        const message = update.message;

        // Filter by chat ID if specified
        if (
          context.properties.chatId &&
          message.chat.id.toString() !== context.properties.chatId.toString()
        ) {
          return; // Ignore messages from other chats
        }

        // Filter bot messages if requested
        if (
          context.properties.ignoreBotMessages &&
          message.from &&
          message.from.is_bot
        ) {
          return; // Ignore bot messages
        }

        // Filter by message type if specified
        if (
          context.properties.messageType &&
          context.properties.messageType !== "all"
        ) {
          const messageType = context.properties.messageType;
          let hasRequestedType = false;

          switch (messageType) {
            case "text":
              hasRequestedType = !!message.text;
              break;
            case "photo":
              hasRequestedType = !!message.photo;
              break;
            case "document":
              hasRequestedType = !!message.document;
              break;
            case "video":
              hasRequestedType = !!message.video;
              break;
            case "audio":
              hasRequestedType = !!message.audio;
              break;
            case "voice":
              hasRequestedType = !!message.voice;
              break;
            case "sticker":
              hasRequestedType = !!message.sticker;
              break;
            case "location":
              hasRequestedType = !!message.location;
              break;
            case "contact":
              hasRequestedType = !!message.contact;
              break;
          }

          if (!hasRequestedType) {
            return; // Skip messages that don't match the requested type
          }
        }

        // Emit the message data
        await context.sendJson(message, "message");
      }

      // Handle edited messages
      if (update.edited_message) {
        const message = update.edited_message;

        // Apply same filters as regular messages
        if (
          context.properties.chatId &&
          message.chat.id.toString() !== context.properties.chatId.toString()
        ) {
          return;
        }

        if (
          context.properties.ignoreBotMessages &&
          message.from &&
          message.from.is_bot
        ) {
          return;
        }

        // Emit the edited message data (with edit_date field populated)
        await context.sendJson(message, "message");
      }

      // Send OK response to Telegram
      return context.response();
    }
  },
};
