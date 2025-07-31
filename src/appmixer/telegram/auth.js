'use strict';

module.exports = {
    type: 'apiKey',
    definition: {
        auth: {
            botToken: {
                type: 'password',
                name: 'Bot Token',
                tooltip: 'Get your bot token from @BotFather on Telegram. Format: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ'
            }
        },

        async requestProfileInfo(context) {
            const url = 'https://api.telegram.org/bot' + context.botToken + '/getMe';
            const { data } = await context.httpRequest({ 
                url, 
                method: 'GET' 
            });
            
            if (data && data.ok && data.result) {
                return data.result;
            } else {
                throw new Error('Could not retrieve Telegram bot information.');
            }
        },

        accountNameFromProfileInfo: 'username',

        validate: async (context) => {
            const url = 'https://api.telegram.org/bot' + context.botToken + '/getMe';
            const response = await context.httpRequest({ 
                url, 
                method: 'GET' 
            });

            if (!response.data || !response.data.ok || !response.data.result) {
                throw new Error('Authentication failed: Invalid bot token.');
            }
            
            return true;
        }
    }
};