import { ICredentialType, INodeProperties } from 'n8n-workflow'

export class TelegramMTPROTOApi implements ICredentialType {
  name = 'telegramMTPROTOApi'
  displayName = 'Personal Telegram MTPROTO API'
  documentationUrl = 'https://core.telegram.org/api/obtaining_api_id'
  properties: INodeProperties[] = [
    {
      displayName: 'App api_id',
      name: 'apiId',
      type: 'string',
      placeholder: '12348745646878',
      default: '',
      description: 'Your API ID from https://my.telegram.org/',
      required: true,
    },
    {
      displayName: 'App api_hash',
      name: 'apiHash',
      type: 'string',
      placeholder: '17d2f8ab587',
      default: '',
      description: 'Your API Hash from https://my.telegram.org/',
      required: true,
    },
    {
      displayName: 'Phone Number',
      name: 'phoneNumber',
      type: 'string',
      default: '00123456789',
      description: 'Telegram Account Phone Number, used as Login',
      required: true,
    },
  ]
}
