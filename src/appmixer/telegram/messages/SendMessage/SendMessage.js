'use strict';

module.exports = {

    async receive(context) {

        const { chatId, text, parseMode, disableWebPagePreview, disableNotification } = context.messages.in.content;
        
        // Validate inputs
        if (!chatId) {
            throw new context.CancelError('Chat ID is required');
        }
        
        if (!text) {
            throw new context.CancelError('Message text is required');
        }
        
        if (text.length > 4096) {
            throw new context.CancelError('Message text cannot exceed 4096 characters');
        }

        // Build the request payload
        const payload = {
            chat_id: chatId,
            text: text
        };

        // Add optional parameters if provided
        if (parseMode && parseMode !== '') {
            payload.parse_mode = parseMode;
        }
        
        if (disableWebPagePreview === true) {
            payload.disable_web_page_preview = true;
        }
        
        if (disableNotification === true) {
            payload.disable_notification = true;
        }

        // Make the API call
        const url = `https://api.telegram.org/bot${context.auth.botToken}/sendMessage`;
        
        try {
            const response = await context.httpRequest({
                url: url,
                method: 'POST',
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.data || !response.data.ok) {
                const errorMessage = response.data?.description || 'Unknown error occurred';
                throw new context.CancelError(`Failed to send message: ${errorMessage}`);
            }

            // Return the message data
            return context.sendJson(response.data.result, 'out');

        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.description || 'Unknown API error';
                throw new context.CancelError(`Telegram API error: ${errorMessage}`);
            }
            
            // Re-throw if it's already a CancelError
            if (error instanceof context.CancelError) {
                throw error;
            }
            
            // Generic error handling
            throw new context.CancelError(`Failed to send message: ${error.message}`);
        }
    }
};