import { NodeConnectionType, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { N8NPropertiesBuilder, N8NPropertiesBuilderConfig } from '@devlikeapro/n8n-openapi-node';
import * as doc from './openapi.json';

const config: N8NPropertiesBuilderConfig = {};
const parser = new N8NPropertiesBuilder(doc, config);
const properties = parser.build();

export class ShopwareAdminNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Shopware Admin Node',
		name: 'shopwareAdminNode',
		group: ['transform'],
		version: 1,
		description: 'Shopware Admin Node',
		defaults: {
			name: 'Shopware Admin Node',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [NodeConnectionType.Main],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'shopwareAdminCredentialsApi',
				required: true,
			},
		],
		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			baseURL: '={{$credentials.url}}',
		},
		properties,
	};
}
