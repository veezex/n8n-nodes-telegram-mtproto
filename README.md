# n8n-nodes-telegram-mtproto

This is an n8n community node that provides Telegram MTPROTO API integration for real-time message listening and automation workflows.

This node allows you to listen for new Telegram messages using the official Telegram MTPROTO protocol through the telegram library. It's perfect for creating Telegram bots, message monitoring systems, auto-responders, and workflow automation based on incoming messages.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Quick Start](#quick-start)  
[Operations](#operations)  
[Credentials](#credentials)  
[Build Instructions](#build-instructions)  
[Compatibility](#compatibility)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Install from npm registry using bun:

```bash
npm install n8n-nodes-telegram-mtproto
```

## Quick Start

1. Get your Telegram API credentials from https://my.telegram.org/apps
2. Generate a session string using `bun run test:connection` (see [Credentials](#credentials) section)
3. Create a "Personal Telegram MTPROTO API" credential in n8n with your API details and session string
4. Add the "Telegram MTPROTO API Trigger" node to your workflow
5. Start your workflow to begin receiving new Telegram messages

## Operations

### Telegram MTPROTO API Trigger

This trigger node listens for new messages from Telegram using the MTPROTO protocol. The node automatically triggers when any new message is received in chats that your Telegram account has access to.

### Configuration Options

Currently, the trigger listens to all new messages without additional filtering options. Future versions may include options to filter by chat type or sender.

## Credentials

You need to create Telegram API credentials to use this node:

### Prerequisites

1. A Telegram account
2. Access to https://my.telegram.org/apps
3. Bun runtime installed (for session string generation)

### Setup Steps

1. Visit https://my.telegram.org/apps and log in
2. Click "API Development Tools"
3. Create a new application (any name is fine)
4. Save your `api_id` and `api_hash`

### Generating Session String

Due to Telegram's authentication requirements, you need to generate a session string manually:

1. Clone this repository or navigate to your n8n community nodes directory
2. Run the connection test script:
   ```bash
   bun run test:connection
   ```
3. Follow the prompts to enter:

   - Your API ID
   - Your API Hash
   - Your phone number (with country code, e.g., +1234567890)
   - Verification code sent to Telegram
   - 2FA password (if enabled)

4. The script will output a session string - copy this for use in n8n

### Creating n8n Credential

1. In n8n, create a "Personal Telegram MTPROTO API" credential
2. Enter your API ID, API Hash, phone number, and the session string from above

⚠️ **Important**: The session string is required for the node to work. This is a workaround to handle Telegram's interactive authentication process.

## Build Instructions

This project uses Bun as the primary build tool and package manager.

### Development Setup

1. Install Bun if you haven't already:

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Build the project:
   ```bash
   bun run build
   ```

### Available Scripts

- `bun run build` - Build the project for production
- `bun run dev` - Watch mode for development
- `bun run test:connection` - Test Telegram connection and generate session string
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier

## Compatibility

- **Minimum n8n version**: 1.82.0
- **Bun**: >=1.00
- **Node.js**: >=18.0.0 (if not using Bun)
- **Tested with**: n8n v1.82.0+

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Telegram API Documentation](https://core.telegram.org/api)
- [Telegram MTPROTO Library](https://github.com/gram-js/gramjs)
