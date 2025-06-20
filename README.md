# n8n-nodes-telegram-mtproto

This is an n8n community node that provides Telegram MTPROTO API integration for real-time message listening and automation.

This node allows you to listen for Telegram messages, events, and user activity using the official Telegram MTPROTO protocol through the gramjs library. It's perfect for creating Telegram bots, message monitoring systems, auto-responders, and workflow automation based on Telegram activity.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Quick Start](#quick-start)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Documentation](#documentation)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Install from npm:
```bash
npm install n8n-nodes-telegram-mtproto
```

## Quick Start

1. Get your Telegram API credentials from https://my.telegram.org/
2. Create a "Personal Telegram MTPROTO API" credential in n8n
3. Add the "Telegram MTPROTO API Trigger" node to your workflow
4. Configure events to listen for (New Message, Message Edited, etc.)
5. Start your workflow to begin receiving Telegram events

## Operations

### Telegram MTPROTO API Trigger

This trigger node listens for real-time events from Telegram using the MTPROTO protocol:

- **New Message**: Triggers when a new message is received
- **Message Content**: Triggers when message content is updated  
- **Message Edited**: Triggers when a message is edited
- **Message Deleted**: Triggers when messages are deleted
- **Chat Action**: Triggers on typing indicators and other chat actions
- **User Status**: Triggers when user online/offline status changes

### Configuration Options

- **Events**: Select which Telegram events to listen for
- **Ignore Groups**: Skip messages from group chats
- **Ignore Bots**: Skip messages from bot accounts

## Credentials

You need to create Telegram API credentials to use this node:

### Prerequisites
1. A Telegram account
2. Access to https://my.telegram.org/

### Setup Steps
1. Visit https://my.telegram.org/ and log in
2. Click "API Development Tools"
3. Create a new application (any name is fine)
4. Save your `api_id` and `api_hash`
5. In n8n, create a "Personal Telegram MTPROTO API" credential
6. Enter your API ID, API Hash, and phone number

⚠️ **Note**: First-time authorization may require manual setup. See the [setup guide](./docs/TELEGRAM_SETUP.md) for detailed instructions.

## Compatibility

- **Minimum n8n version**: 1.82.0
- **Node.js**: >=18.0.0
- **Tested with**: n8n v1.82.0+

## Documentation

- [Setup Guide](./docs/TELEGRAM_SETUP.md) - Detailed setup instructions
- [Usage Examples](./docs/USAGE_EXAMPLES.md) - Workflow examples and use cases

_By the time users are looking for community nodes, they probably already know n8n basics. But if you expect new users, you can link to the [Try it out](https://docs.n8n.io/try-it-out/) documentation to help them get started._

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* _Link to app/service documentation._

## Version history

_This is another optional section. If your node has multiple versions, include a short description of available versions and what changed, as well as any compatibility impact._

