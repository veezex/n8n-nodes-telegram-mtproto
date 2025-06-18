import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { description } from './TelegramMTPROTO.description';

export class TelegramMTPROTO implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Telegram MTPROTO',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-name-miscased
		name: 'telegramMTPROTO',
		icon: { light: 'file:TelegramMTPROTO.svg', dark: 'file:TelegramMTPROTO.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Telegram MTPROTO API',
		defaults: {
			name: 'Telegram MTPROTO',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'httpbinApi',
				required: false,
			},
		],
		requestDefaults: {
			baseURL: 'https://httpbin.org',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		/**
		 * In the properties array we have two mandatory options objects required
		 *
		 * [Resource & Operation]
		 *
		 * https://docs.n8n.io/integrations/creating-nodes/code/create-first-node/#resources-and-operations
		 */
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'HTTP Verb',
						value: 'httpVerb',
					},
				],
				default: 'httpVerb',
			},

			...description,
		],
	};
}
