import { INodePropertyOptions } from 'n8n-workflow';

export const events: INodePropertyOptions[] = [
	{
		name: 'NewMessage',
		value: 'updateNewMessage',
	},
	{
		name: 'MessageContent',
		value: 'updateMessageContent',
	},
];

export const defaultEvents = events.slice(0,2).map(i => i.value)
