'use strict';

module.exports = {

    async receive(context) {

        const { chatId, text, parseMode, buttons, disableWebPagePreview, disableNotification } = context.messages.in.content;
        
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

        if (!buttons || !Array.isArray(buttons)) {
            throw new context.CancelError('Buttons array is required');
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

        // Process buttons and create inline keyboard
        try {
            let parsedButtons = buttons;
            
            // If buttons is a string, parse it as JSON
            if (typeof buttons === 'string') {
                parsedButtons = JSON.parse(buttons);
            }

            // Validate button structure
            if (!Array.isArray(parsedButtons)) {
                throw new Error('Buttons must be an array of rows');
            }

            // Validate each button row
            const inlineKeyboard = parsedButtons.map((row, rowIndex) => {
                if (!Array.isArray(row)) {
                    throw new Error(`Button row ${rowIndex} must be an array`);
                }
                
                return row.map((button, buttonIndex) => {
                    if (!button || typeof button !== 'object') {
                        throw new Error(`Button at row ${rowIndex}, position ${buttonIndex} must be an object`);
                    }
                    
                    if (!button.text) {
                        throw new Error(`Button at row ${rowIndex}, position ${buttonIndex} must have a 'text' property`);
                    }

                    // Create the button object
                    const inlineButton = { text: button.text };
                    
                    // Add callback_data or url (one is required)
                    if (button.callback_data) {
                        inlineButton.callback_data = button.callback_data;
                    } else if (button.url) {
                        inlineButton.url = button.url;
                    } else {
                        throw new Error(`Button at row ${rowIndex}, position ${buttonIndex} must have either 'callback_data' or 'url'`);
                    }
                    
                    return inlineButton;
                });
            });

            payload.reply_markup = {
                inline_keyboard: inlineKeyboard
            };

        } catch (error) {
            throw new context.CancelError(`Invalid buttons format: ${error.message}`);
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