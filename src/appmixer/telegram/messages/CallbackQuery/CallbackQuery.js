'use strict';

module.exports = {

    async webhook(context) {
        
        const { callbackData, chatId } = context.properties;
        const webhookData = context.messages.webhook.content.data;
        
        // Check if this is a callback query event
        if (!webhookData.callback_query) {
            return;
        }
        
        const callbackQuery = webhookData.callback_query;
        
        // Apply filters if specified
        if (callbackData && callbackQuery.data !== callbackData) {
            return;
        }
        
        if (chatId && callbackQuery.message && callbackQuery.message.chat.id.toString() !== chatId.toString()) {
            return;
        }
        
        // Output the callback query data
        return context.sendJson(callbackQuery, 'callbackQuery');
    },

    async start(context) {
        
        // Register webhook for callback queries
        const webhookUrl = context.getWebhookUrl();
        const botToken = context.auth.botToken;
        
        if (!botToken) {
            throw new context.CancelError('Bot token is required');
        }
        
        try {
            // Set webhook with Telegram API
            const response = await context.httpRequest({
                url: `https://api.telegram.org/bot${botToken}/setWebhook`,
                method: 'POST',
                data: {
                    url: webhookUrl,
                    allowed_updates: ['callback_query']
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.data || !response.data.ok) {
                const errorMessage = response.data?.description || 'Failed to set webhook';
                throw new context.CancelError(`Telegram API error: ${errorMessage}`);
            }
            
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.description || 'Unknown API error';
                throw new context.CancelError(`Failed to register webhook: ${errorMessage}`);
            }
            
            if (error instanceof context.CancelError) {
                throw error;
            }
            
            throw new context.CancelError(`Webhook registration failed: ${error.message}`);
        }
    },

    async stop(context) {
        
        const botToken = context.auth.botToken;
        
        if (!botToken) {
            return;
        }
        
        try {
            // Remove webhook
            await context.httpRequest({
                url: `https://api.telegram.org/bot${botToken}/deleteWebhook`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
        } catch (error) {
            // Log error but don't throw - stopping should be graceful
            console.error('Failed to remove webhook:', error.message);
        }
    }
};