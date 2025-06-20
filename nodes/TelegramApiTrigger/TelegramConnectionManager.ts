import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

export interface TelegramCredentials {
  apiId: string
  apiHash: string
  sessionString: string
  phoneNumber: string
}

export class TelegramConnectionManager {
  private static instance: TelegramConnectionManager;
  private clients: Map<string, TelegramClient> = new Map();

  private constructor() {}

  static getInstance(): TelegramConnectionManager {
    if (!TelegramConnectionManager.instance) {
      TelegramConnectionManager.instance = new TelegramConnectionManager();
    }
    return TelegramConnectionManager.instance;
  }

  private getClientKey(credentials: TelegramCredentials): string {
    return `${credentials.apiId}_${credentials.phoneNumber}`;
  }

  async getClient(credentials: TelegramCredentials): Promise<TelegramClient> {
    const clientKey = this.getClientKey(credentials);

    if (this.clients.has(clientKey)) {
      const existingClient = this.clients.get(clientKey)!;
      if (existingClient.connected) {
        return existingClient;
      }
    }

    // Create new client with session (empty string for first time)
    const sessionString = credentials.sessionString
    const stringSession = new StringSession(sessionString);

    const client = new TelegramClient(
      stringSession,
      parseInt(credentials.apiId, 10),
      credentials.apiHash,
      {
        connectionRetries: 5,
        useIPV6: false,
      }
    );

    try {
      await client.start({
        phoneNumber: async () => credentials.phoneNumber,
        password: async () => {
          throw new Error('Two-factor authentication detected. Please disable 2FA temporarily or provide password functionality.');
        },
        phoneCode: async () => {
          throw new Error('Phone verification code is required. Please ensure you have authorized this application first.');
        },
        onError: (err) => {
          console.error('Telegram auth error:', err);
          throw err;
        },
      });

      this.clients.set(clientKey, client);
      return client;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Authentication failed: ${error.message}. Please ensure your credentials are correct and you have authorized this application with Telegram.`);
      }
      throw error;
    }
  }

  async disconnectClient(credentials: TelegramCredentials): Promise<void> {
    const clientKey = this.getClientKey(credentials);
    const client = this.clients.get(clientKey);

    if (client) {
      try {
        await client.disconnect();
      } catch (error) {
        console.error('Error disconnecting client:', error);
      }
      this.clients.delete(clientKey);
    }
  }

  async disconnectAll(): Promise<void> {
    const disconnectPromises = Array.from(this.clients.values()).map(client =>
      client.disconnect().catch(error => console.error('Error disconnecting client:', error))
    );

    await Promise.all(disconnectPromises);
    this.clients.clear();
  }
}
