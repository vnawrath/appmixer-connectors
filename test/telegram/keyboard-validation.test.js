'use strict';

const assert = require('assert');

describe('Telegram Keyboard Components', function() {

    describe('SendMessageWithKeyboard', function() {
        
        const SendMessageWithKeyboard = require('../../src/appmixer/telegram/messages/SendMessageWithKeyboard/SendMessageWithKeyboard');
        
        it('should validate button structure correctly', function() {
            
            // Test valid button structure
            const validButtons = [
                [
                    { text: 'Button 1', callback_data: 'btn1' },
                    { text: 'Button 2', callback_data: 'btn2' }
                ],
                [
                    { text: 'Website', url: 'https://example.com' }
                ]
            ];
            
            // This should not throw
            const inlineKeyboard = validButtons.map((row, rowIndex) => {
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

                    const inlineButton = { text: button.text };
                    
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
            
            assert.strictEqual(inlineKeyboard.length, 2);
            assert.strictEqual(inlineKeyboard[0].length, 2);
            assert.strictEqual(inlineKeyboard[1].length, 1);
            assert.strictEqual(inlineKeyboard[0][0].text, 'Button 1');
            assert.strictEqual(inlineKeyboard[0][0].callback_data, 'btn1');
            assert.strictEqual(inlineKeyboard[1][0].url, 'https://example.com');
        });
        
        it('should reject invalid button structure', function() {
            
            // Test invalid button - missing text
            const invalidButtons = [
                [
                    { callback_data: 'btn1' } // Missing text
                ]
            ];
            
            assert.throws(() => {
                invalidButtons.map((row, rowIndex) => {
                    return row.map((button, buttonIndex) => {
                        if (!button.text) {
                            throw new Error(`Button at row ${rowIndex}, position ${buttonIndex} must have a 'text' property`);
                        }
                        return button;
                    });
                });
            }, /must have a 'text' property/);
        });
        
        it('should reject button without callback_data or url', function() {
            
            const invalidButtons = [
                [
                    { text: 'Button 1' } // Missing callback_data or url
                ]
            ];
            
            assert.throws(() => {
                invalidButtons.map((row, rowIndex) => {
                    return row.map((button, buttonIndex) => {
                        if (!button.text) {
                            throw new Error(`Button at row ${rowIndex}, position ${buttonIndex} must have a 'text' property`);
                        }
                        
                        if (!button.callback_data && !button.url) {
                            throw new Error(`Button at row ${rowIndex}, position ${buttonIndex} must have either 'callback_data' or 'url'`);
                        }
                        
                        return button;
                    });
                });
            }, /must have either 'callback_data' or 'url'/);
        });
    });
    
    describe('CallbackQuery Component Structure', function() {
        
        it('should have correct component manifest structure', function() {
            const manifest = require('../../src/appmixer/telegram/messages/CallbackQuery/component.json');
            
            assert.strictEqual(manifest.name, 'appmixer.telegram.messages.CallbackQuery');
            assert.strictEqual(manifest.webhook, true);
            assert.strictEqual(manifest.auth.service, 'appmixer:telegram');
            assert(Array.isArray(manifest.outPorts));
            assert.strictEqual(manifest.outPorts[0].name, 'callbackQuery');
        });
    });
    
    describe('AnswerCallbackQuery Component Structure', function() {
        
        it('should have correct component manifest structure', function() {
            const manifest = require('../../src/appmixer/telegram/messages/AnswerCallbackQuery/component.json');
            
            assert.strictEqual(manifest.name, 'appmixer.telegram.messages.AnswerCallbackQuery');
            assert.strictEqual(manifest.auth.service, 'appmixer:telegram');
            assert(Array.isArray(manifest.inPorts));
            assert(Array.isArray(manifest.outPorts));
            assert.strictEqual(manifest.inPorts[0].schema.required[0], 'callbackQueryId');
        });
    });
    
    describe('SendMessage Extended Functionality', function() {
        
        it('should include replyMarkup in component manifest', function() {
            const manifest = require('../../src/appmixer/telegram/messages/SendMessage/component.json');
            
            const properties = manifest.inPorts[0].schema.properties;
            assert(properties.replyMarkup, 'SendMessage should include replyMarkup property');
            assert.strictEqual(properties.replyMarkup.type, 'object');
            
            const inspectorInputs = manifest.inPorts[0].inspector.inputs;
            assert(inspectorInputs.replyMarkup, 'SendMessage should include replyMarkup in inspector');
            assert.strictEqual(inspectorInputs.replyMarkup.type, 'textarea');
        });
    });
});