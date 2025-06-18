import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { description } from './TelegramApiTrigger.description';

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
		/**
		 * In the properties array we have two mandatory options objects required
		 * [Resource & Operation]
		 *
		 * https://docs.n8n.io/integrations/creating-nodes/code/create-first-node/#resources-and-operations
		 */
		properties: [
			...description,
		],
	};
}
