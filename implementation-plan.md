# Telegram Connector Implementation Plan

This document outlines the step-by-step implementation plan for building a Telegram Bot API connector for AppMixer. The plan is divided into small, independent phases that can be completed iteratively.

## Overview

The Telegram connector will enable workflow automation through Telegram bots, focusing on:
- ✅ Simple authentication using bot tokens
- ✅ Listening for new messages (webhook-based triggers)
- ✅ Sending messages back to users
- ✅ Basic file operations (photos, documents)
- ✅ Bot management and chat information

## Implementation Phases

### Phase 1: Basic Connector Structure ✅
**Goal**: Set up the foundational structure and service definition

**Tasks**:
- [x] Create service directory: `/src/appmixer/telegram/`
- [x] Create `service.json` with service metadata
- [x] Create `bundle.json` with connector information
- [x] Add service icon and branding assets
- [x] Create basic `package.json` with dependencies

**Reference Documentation**:
- [`docs/03_basic_structure.md`](docs/03_basic_structure.md) - Directory structure and service organization
- [`docs/04_manifest.md`](docs/04_manifest.md) - Service and component manifest files
- [`src/appmixer/slack/service.json`](src/appmixer/slack/service.json) - Similar messaging service example

**Dependencies**:
- `node-telegram-bot-api` - Main Telegram Bot API library

---

### Phase 2: Authentication Module ⬜
**Goal**: Implement bot token authentication

**Tasks**:
- [ ] Create `auth.js` with API key authentication
- [ ] Implement token validation using `/getMe` endpoint
- [ ] Add profile information retrieval
- [ ] Test authentication flow

**Reference Documentation**:
- [`docs/07_authentication.md`](docs/07_authentication.md) - Authentication patterns and implementation
- [`docs/telegram-api.md`](docs/telegram-api.md) - Telegram Bot API authentication
- [`src/appmixer/line/auth.js`](src/appmixer/line/auth.js) - Similar API key authentication

**API Endpoints**:
- `GET /getMe` - Validate bot token and get bot information

---

### Phase 3: Core Message Trigger ⬜ 
**Goal**: Implement webhook-based message listening

**Tasks**:
- [ ] Create `messages/` module directory
- [ ] Create `NewMessage` trigger component
- [ ] Implement webhook registration/management
- [ ] Add message parsing and filtering
- [ ] Test webhook reception and message processing

**Reference Documentation**:
- [`docs/05_behavior.md`](docs/05_behavior.md) - Component behavior and webhook handling
- [`docs/10_example_webhook.md`](docs/10_example_webhook.md) - Webhook trigger implementation
- [`src/appmixer/slack/messages/NewChannelMessageRT/`](src/appmixer/slack/messages/NewChannelMessageRT/) - Real-time message trigger example

**API Endpoints**:
- `POST /setWebhook` - Register webhook URL
- `POST /getWebhookInfo` - Get webhook status
- `POST /deleteWebhook` - Remove webhook

---

### Phase 4: Basic Message Sending ⬜
**Goal**: Implement sending text messages

**Tasks**:
- [ ] Create `SendMessage` component
- [ ] Add support for text formatting (HTML/Markdown)
- [ ] Implement chat ID validation
- [ ] Add error handling for message sending
- [ ] Test message delivery

**Reference Documentation**:
- [`docs/telegram-api.md`](docs/telegram-api.md) - Message sending examples
- [`src/appmixer/slack/messages/SendChannelMessage/`](src/appmixer/slack/messages/SendChannelMessage/) - Message sending component
- [`src/appmixer/discord/messages/SendMessage/`](src/appmixer/discord/messages/SendMessage/) - Similar implementation

**API Endpoints**:
- `POST /sendMessage` - Send text messages

---

### Phase 5: Keyboard Support ⬜
**Goal**: Add inline keyboard functionality to messages

**Tasks**:
- [ ] Extend `SendMessage` with keyboard options
- [ ] Create `SendMessageWithKeyboard` component
- [ ] Implement inline keyboard handling
- [ ] Add callback query processing
- [ ] Test interactive message flows

**Reference Documentation**:
- [`docs/telegram-api.md`](docs/telegram-api.md) - Keyboard and callback examples
- [`src/appmixer/slack/messages/`](src/appmixer/slack/messages/) - Interactive message components

**API Endpoints**:
- `POST /sendMessage` - Send messages with inline keyboards
- `POST /answerCallbackQuery` - Respond to button presses

---

### Phase 6: File Operations ⬜
**Goal**: Support sending and receiving files

**Tasks**:
- [ ] Create `files/` module directory
- [ ] Create `SendPhoto` component
- [ ] Create `SendDocument` component
- [ ] Implement file download handling
- [ ] Add file size and type validation

**Reference Documentation**:
- [`docs/telegram-api.md`](docs/telegram-api.md) - File operation examples
- [`src/appmixer/slack/files/`](src/appmixer/slack/files/) - File handling components

**API Endpoints**:
- `POST /sendPhoto` - Send photo messages
- `POST /sendDocument` - Send document files
- `GET /getFile` - Get file information and download URLs

---

### Phase 7: Bot Management ⬜
**Goal**: Provide bot configuration and information components

**Tasks**:
- [ ] Create `bot/` module directory  
- [ ] Create `GetMe` component (bot information)
- [ ] Create `SetWebhook` component (webhook management)
- [ ] Create `GetWebhookInfo` component
- [ ] Add webhook URL validation

**Reference Documentation**:
- [`docs/telegram-api.md`](docs/telegram-api.md) - Bot management APIs
- [`src/appmixer/slack/auth.js`](src/appmixer/slack/auth.js) - Bot information handling

**API Endpoints**:
- `GET /getMe` - Get bot information
- `POST /setWebhook` - Configure webhook
- `GET /getWebhookInfo` - Get webhook status

---

### Phase 8: Chat Information ⬜
**Goal**: Add chat and user information components

**Tasks**:
- [ ] Create `chats/` module directory
- [ ] Create `GetChat` component
- [ ] Create `GetChatMember` component  
- [ ] Add user permission checking
- [ ] Test chat information retrieval

**Reference Documentation**:
- [`docs/telegram-api.md`](docs/telegram-api.md) - Chat information APIs
- [`src/appmixer/discord/members/`](src/appmixer/discord/members/) - Similar member/chat management

**API Endpoints**:
- `GET /getChat` - Get chat information
- `GET /getChatMember` - Get user information in chat

---

### Phase 9: Rate Limiting & Quotas ⬜
**Goal**: Implement proper rate limiting and quota management

**Tasks**:
- [ ] Create `quota.js` with Telegram API limits
- [ ] Configure rate limiting (30 messages/second)
- [ ] Add quota tracking and enforcement
- [ ] Test quota behavior under load

**Reference Documentation**:
- [`docs/08_quotas.md`](docs/08_quotas.md) - Quota implementation guide
- [`src/appmixer/slack/quota.js`](src/appmixer/slack/quota.js) - Quota configuration example

**Telegram Limits**:
- 30 messages per second per bot
- File size limits (photos: 10MB, documents: 50MB)

---

### Phase 10: Testing & Documentation ⬜
**Goal**: Comprehensive testing and component documentation

**Tasks**:
- [ ] Create unit tests for all components
- [ ] Create integration test flows
- [ ] Add component documentation and examples
- [ ] Validate error handling scenarios
- [ ] Performance testing with rate limits

**Reference Documentation**:
- [`README.md`](README.md) - Testing framework and guidelines
- [`test/slack/`](test/slack/) - Comprehensive test examples
- [`docs/09_example_twillio.md`](docs/09_example_twillio.md) - Complete connector example

**Test Scenarios**:
- Authentication validation
- Message sending/receiving
- Webhook management
- File operations
- Error conditions

---

## Component Architecture

### Directory Structure
```
src/appmixer/telegram/
├── auth.js                 # Bot token authentication
├── service.json           # Service metadata
├── bundle.json           # Bundle configuration  
├── package.json          # Dependencies
├── quota.js              # Rate limiting rules
├── lib.js                # Common utilities
├── messages/             # Message operations
│   ├── NewMessage/       # Webhook trigger for incoming messages
│   ├── SendMessage/      # Send text messages
│   └── SendMessageWithKeyboard/  # Send messages with inline keyboards
├── files/                # File operations
│   ├── SendPhoto/        # Send photo messages
│   ├── SendDocument/     # Send document files
│   └── GetFile/          # Download file information
├── bot/                  # Bot management
│   ├── GetMe/           # Get bot information
│   ├── SetWebhook/      # Configure webhook
│   └── GetWebhookInfo/  # Get webhook status
└── chats/               # Chat management
    ├── GetChat/         # Get chat information
    └── GetChatMember/   # Get user information
```

### Key Dependencies
- `node-telegram-bot-api`: Main Telegram Bot API client
- `express`: Webhook handling (if needed)

### Authentication Flow
1. User provides bot token from BotFather
2. Validate token using `/getMe` API call
3. Store bot information for profile display
4. Use token for all subsequent API calls

### Webhook Flow
1. Register webhook URL with Telegram
2. Receive POST requests from Telegram on new messages
3. Process and emit message data to workflow
4. Handle webhook validation and security

## Success Criteria

- ✅ Users can authenticate with bot tokens
- ✅ Real-time message triggers work via webhooks  
- ✅ Messages can be sent with text formatting
- ✅ Interactive keyboards function properly
- ✅ File uploads/downloads work correctly
- ✅ Rate limiting prevents API overuse
- ✅ Comprehensive test coverage
- ✅ Clear documentation and examples

## Technical Considerations

### Security
- Validate webhook authenticity using secret tokens
- Sanitize user inputs to prevent injection attacks
- Don't log sensitive user information

### Performance  
- Implement proper rate limiting (30 messages/second)
- Use efficient webhook processing
- Cache bot information to reduce API calls

### Error Handling
- Graceful handling of network failures
- User-friendly error messages
- Retry logic for transient failures

### UX Simplicity
- Minimal configuration required (just bot token)
- Clear component naming and descriptions
- Intuitive message formatting options
- Simple file upload interface