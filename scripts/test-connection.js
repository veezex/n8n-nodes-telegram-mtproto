#!/usr/bin/env node

/**
 * Simple test script to verify Telegram MTPROTO connection
 * Run this to test your credentials before using in n8n
 */

const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function testConnection() {
  try {
    console.log('🔧 Telegram MTPROTO Connection Test\n');

    const apiId = parseInt(await askQuestion('Enter your API ID: '));
    const apiHash = await askQuestion('Enter your API Hash: ');
    const phoneNumber = await askQuestion('Enter your phone number (with country code, e.g., +1234567890): ');

    console.log('\n📞 Attempting to connect to Telegram...');

    const stringSession = new StringSession('');
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.start({
      phoneNumber: async () => phoneNumber,
      password: async () => {
        return await askQuestion('Enter your 2FA password (if enabled): ');
      },
      phoneCode: async () => {
        return await askQuestion('Enter the verification code you received: ');
      },
      onError: (err) => {
        console.error('❌ Authentication error:', err);
      },
    });

    console.log('✅ Successfully connected to Telegram!');
    console.log('📝 Session string (save this for n8n):');
    console.log(client.session.save());

    // Test sending a message to yourself
    try {
      await client.sendMessage('me', { message: 'Test from n8n-nodes-telegram-mtproto!' });
      console.log('📨 Test message sent to yourself successfully!');
    } catch (err) {
      console.log('⚠️  Could not send test message:', err.message);
    }

    await client.disconnect();
    console.log('🔌 Disconnected from Telegram');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('1. Verify your API ID and Hash are correct');
    console.log('2. Make sure your phone number includes country code');
    console.log('3. Check if 2FA is enabled and provide password');
    console.log('4. Ensure you have internet connection');
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = { testConnection };
