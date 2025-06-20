import {
  ApplicationError,
  IDataObject,
  INodeType,
  INodeTypeDescription,
  ITriggerFunctions,
  ITriggerResponse,
  NodeConnectionType,
} from 'n8n-workflow'
import { defaultEvents, events } from './TelegramApiTriggerEvents'
import { TelegramConnectionManager, TelegramCredentials } from './TelegramConnectionManager'
import { NewMessage } from 'telegram/events'

// https://docs.n8n.io/integrations/creating-nodes/build/
export class TelegramApiTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Telegram MTPROTO API Trigger',
    // eslint-disable-next-line n8n-nodes-base/node-class-description-name-miscased
    name: 'telegramApiTrigger',
    icon: { light: 'file:TelegramApiTrigger.svg', dark: 'file:TelegramApiTrigger.svg' },
    group: ['trigger'],
    version: 1,
    description: 'Telegram MTPROTO API Listener',
    defaults: {
      name: 'Telegram MTPROTO API Trigger',
    },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'telegramMTPROTOApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        options: [
          {
            name: '*',
            value: '*',
          },
          ...events,
        ],
        // eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-multi-options
        default: defaultEvents,
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add option',
        default: {},
        options: [
          {
            displayName: 'Ignore Groups',
            description: 'Whether to ignore messages from groups',
            name: 'ignoreGroups',
            type: 'boolean',
            default: false,
          },
          {
            displayName: 'Ignore Bots',
            description: 'Whether to ignore messages from bots',
            name: 'ignoreBots',
            type: 'boolean',
            default: false,
          },
        ],
      },
    ],
  }

  async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
    const credentials = (await this.getCredentials('telegramMTPROTOApi')) as TelegramCredentials
    const selectedEvents = this.getNodeParameter('events', []) as string[]
    const options = this.getNodeParameter('options', {}) as {
      ignoreGroups?: boolean
      ignoreBots?: boolean
    }

    const connectionManager = TelegramConnectionManager.getInstance()
    let client

    try {
      client = await connectionManager.getClient(credentials)
    } catch (error) {
      throw new ApplicationError(
        `Failed to connect to Telegram: ${error}. Please ensure your credentials are correct and you have authorized this application.`
      )
    }

    const emit = (data: IDataObject) => {
      this.emit([this.helpers.returnJsonArray([data])])
    }

    // Event handler for new messages
    const handleNewMessage = async (event: any) => {
      try {
        // Extract message data from event
        const message = event.message || event

        // Apply basic filters
        if (options.ignoreGroups && event.isGroup) {
          return
        }

        // Check if this event type should be processed
        if (
          selectedEvents.length > 0 &&
          !selectedEvents.includes('*') &&
          !selectedEvents.includes('updateNewMessage')
        ) {
          return
        }

        const messageData = {
          _: 'updateNewMessage',
          messageId: message.id,
          text: message.text || message.message || '',
          date: message.date,
          senderId: message.senderId?.toString() || message.fromId?.toString(),
          chatId: message.chatId?.toString() || message.peerId?.toString(),
          isGroup: event.isGroup || false,
          isPrivate: event.isPrivate || false,
          isChannel: event.isChannel || false,
          message: message,
          rawEvent: event,
        }

        emit(messageData)
      } catch (error) {
        console.error('Error processing new message:', error)
      }
    }

    let eventHandlerAdded = false
    let newMessageEvent: NewMessage | null = null

    // Start listening for updates
    if (this.getMode() !== 'manual') {
      try {
        newMessageEvent = new NewMessage({})
        client.addEventHandler(handleNewMessage, newMessageEvent)
        eventHandlerAdded = true
      } catch (error) {
        console.error('Error adding event handler:', error)
      }
    }

    // Cleanup function
    const closeFunction = async () => {
      try {
        if (eventHandlerAdded && newMessageEvent) {
          client.removeEventHandler(handleNewMessage, newMessageEvent)
        }
      } catch (error) {
        console.error('Error removing event handler:', error)
      }
    }

    // Manual trigger function (for testing)
    const manualTriggerFunction = async () => {
      return new Promise<void>((resolve, reject) => {
        const timeoutHandler = setTimeout(() => {
          try {
            if (manualEvent) {
              client.removeEventHandler(manualTestHandler, manualEvent)
            }
          } catch (error) {
            console.error('Error removing manual handler:', error)
          }
          reject(new Error('Timeout: No message received within 30 seconds'))
        }, 30000)

        const manualTestHandler = async (event: any) => {
          try {
            await handleNewMessage(event)
            clearTimeout(timeoutHandler)
            try {
              if (manualEvent) {
                client.removeEventHandler(manualTestHandler, manualEvent)
              }
            } catch (error) {
              console.error('Error removing manual handler:', error)
            }
            resolve()
          } catch (error) {
            clearTimeout(timeoutHandler)
            reject(error)
          }
        }

        const manualEvent = new NewMessage({})
        client.addEventHandler(manualTestHandler, manualEvent)
      })
    }

    return {
      closeFunction,
      manualTriggerFunction,
    }
  }
}
