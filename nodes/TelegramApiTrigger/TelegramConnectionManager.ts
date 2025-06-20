import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

export interface TelegramCredentials {
  apiId: number;
  apiHash: string;
  phoneNumber: string;
}

export class TelegramConnectionManager {
  private static instance: TelegramConnectionManager;
  private clients: Map<string, TelegramClient> = new Map();
  private sessions: Map<string, string> = new Map();

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
    const sessionString = this.sessions.get(clientKey) || '';
    const stringSession = new StringSession(sessionString);

    const client = new TelegramClient(
      stringSession,
      credentials.apiId,
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

      // Save session for next time if possible
      try {
        const session = client.session;
        if (session && typeof (session as any).save === 'function') {
          const savedSession = (session as any).save() as string;
          if (savedSession) {
            this.sessions.set(clientKey, savedSession);
          }
        }
      } catch (err) {
        console.warn('Could not save session:', err);
      }

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

  // Save session string for later use (for manual setup)
  saveSession(credentials: TelegramCredentials, sessionString: string): void {
    const clientKey = this.getClientKey(credentials);
    this.sessions.set(clientKey, sessionString);
  }

  // Get saved session string
  getSession(credentials: TelegramCredentials): string | undefined {
    const clientKey = this.getClientKey(credentials);
    return this.sessions.get(clientKey);
  }
}
