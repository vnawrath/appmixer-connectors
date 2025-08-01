'use strict';

module.exports = {

    async receive(context) {

        const { callbackQueryId, text, showAlert, url, cacheTime } = context.messages.in.content;
        
        // Validate inputs
        if (!callbackQueryId) {
            throw new context.CancelError('Callback Query ID is required');
        }
        
        if (text && text.length > 200) {
            throw new context.CancelError('Notification text cannot exceed 200 characters');
        }

        // Build the request payload
        const payload = {
            callback_query_id: callbackQueryId
        };

        // Add optional parameters if provided
        if (text && text.trim() !== '') {
            payload.text = text;
        }
        
        if (showAlert === true) {
            payload.show_alert = true;
        }
        
        if (url && url.trim() !== '') {
            payload.url = url;
        }
        
        if (typeof cacheTime === 'number' && cacheTime >= 0) {
            payload.cache_time = cacheTime;
        }

        // Make the API call
        const apiUrl = `https://api.telegram.org/bot${context.auth.botToken}/answerCallbackQuery`;
        
        try {
            const response = await context.httpRequest({
                url: apiUrl,
                method: 'POST',
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.data || !response.data.ok) {
                const errorMessage = response.data?.description || 'Unknown error occurred';
                throw new context.CancelError(`Failed to answer callback query: ${errorMessage}`);
            }

            // Return the response data
            return context.sendJson({
                ok: response.data.ok,
                description: response.data.description || 'Callback query answered successfully'
            }, 'out');

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
            throw new context.CancelError(`Failed to answer callback query: ${error.message}`);
        }
    }
};