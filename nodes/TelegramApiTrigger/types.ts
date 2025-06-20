export interface TelegramMessage {
  _: string
  messageId: number
  text: string
  date: number
  senderId?: string
  chatId?: string
  isGroup: boolean
  isPrivate: boolean
  isChannel: boolean
  message: any
  rawEvent: any
}

export interface TelegramEventOptions {
  ignoreGroups?: boolean
  ignoreBots?: boolean
}

export interface TelegramUpdateEvent {
  _: string
  update: any
}

export type TelegramEventHandler = (event: any) => Promise<void>

export const TELEGRAM_EVENTS = {
  NEW_MESSAGE: 'updateNewMessage',
  MESSAGE_CONTENT: 'updateMessageContent',
  MESSAGE_EDITED: 'updateMessageEdited',
  MESSAGE_DELETED: 'updateDeleteMessages',
  CHAT_ACTION: 'updateChatAction',
  USER_STATUS: 'updateUserStatus',
} as const

export type TelegramEventType = (typeof TELEGRAM_EVENTS)[keyof typeof TELEGRAM_EVENTS]
