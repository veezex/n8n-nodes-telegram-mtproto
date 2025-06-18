import {
	ApplicationError,
	INodeType,
	INodeTypeDescription,
	ITriggerFunctions,
	ITriggerResponse,
	NodeConnectionType,
} from 'n8n-workflow';
import { defaultEvents, events } from './TelegramApiTriggerEvents';

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
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		throw new ApplicationError(
			'This node is not yet implemented. Please check back later or contribute to the project if you can help!',
		);
	}
}
