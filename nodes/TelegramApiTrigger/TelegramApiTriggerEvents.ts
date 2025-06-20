import { INodePropertyOptions } from 'n8n-workflow'

export const events: INodePropertyOptions[] = [
  {
    name: 'New Message',
    value: 'updateNewMessage',
  },
  {
    name: 'Message Content',
    value: 'updateMessageContent',
  },
  {
    name: 'Message Edited',
    value: 'updateMessageEdited',
  },
  {
    name: 'Message Deleted',
    value: 'updateDeleteMessages',
  },
  {
    name: 'Chat Action (Typing)',
    value: 'updateChatAction',
  },
  {
    name: 'User Status',
    value: 'updateUserStatus',
  },
]

export const defaultEvents = ['updateNewMessage']
