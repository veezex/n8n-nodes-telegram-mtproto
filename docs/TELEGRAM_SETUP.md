# Telegram MTPROTO API Setup Guide

This guide will help you set up the Telegram MTPROTO API trigger node for n8n.

## Prerequisites

1. A Telegram account
2. Access to https://my.telegram.org/

## Step 1: Get API Credentials

1. Visit https://my.telegram.org/
2. Log in with your Telegram account
3. Click on "API Development Tools"
4. Fill in the application details:
   - **App title**: Choose any name (e.g., "n8n Integration")
   - **Short name**: Choose a short name (e.g., "n8n")
   - **Description**: Optional
5. Click "Create application"
6. Save your `api_id` and `api_hash` - you'll need these for n8n

## Step 2: Configure n8n Credentials

1. In n8n, create a new credential of type "Personal Telegram MTPROTO API"
2. Fill in:
   - **App api_id**: Your API ID from step 1
   - **App api_hash**: Your API Hash from step 1  
   - **Phone Number**: Your Telegram phone number (with country code, e.g., +1234567890)

## Step 3: First Authorization

⚠️ **Important**: The first time you use the trigger, you may need to authorize the application.

Currently, this implementation has limitations with the initial authorization flow. You may need to:

1. Temporarily disable two-factor authentication on your Telegram account
2. Use a separate script to generate a session string and provide it to the connection manager
3. Or wait for future updates that include interactive authorization

## Step 4: Add the Trigger Node

1. Add a "Telegram MTPROTO API Trigger" node to your workflow
2. Select your credentials
3. Choose which events to listen for:
   - **New Message**: Listen for new messages
   - **Message Content**: Listen for message content changes
   - **Message Edited**: Listen for edited messages
   - **And more...**

## Step 5: Configure Options

- **Ignore Groups**: Skip messages from group chats
- **Ignore Bots**: Skip messages from bot accounts

## Troubleshooting

### Authentication Errors

If you get authentication errors:

1. Verify your API credentials are correct
2. Make sure your phone number includes the country code
3. Ensure you don't have two-factor authentication enabled
4. Try using a fresh session

### Connection Issues

- Check your internet connection
- Ensure Telegram isn't blocked by your ISP
- Try different server endpoints if available

### Performance Tips

- Use specific event filters instead of listening to all events
- Consider using the ignore options to reduce noise
- Monitor your workflow for memory usage with high-volume chats

## Security Notes

- Keep your API credentials secure
- Don't share your session strings
- Consider the privacy implications of processing Telegram messages
- Be aware of Telegram's API rate limits

## Support

For issues with this implementation, please check the project repository or create an issue.
