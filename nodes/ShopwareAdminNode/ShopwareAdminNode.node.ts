import {
	IHttpRequestMethods,
	INodeProperties,
	NodeConnectionType,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import { N8NPropertiesBuilder, N8NPropertiesBuilderConfig } from '@devlikeapro/n8n-openapi-node';
import * as doc from './openapi.json';

const config: N8NPropertiesBuilderConfig = {};
const parser = new N8NPropertiesBuilder(doc, config);
const properties = parser.build();

const resource = properties.find((property) => property.name === 'resource');
resource?.options?.push({
	name: 'Custom API Call',
	value: 'custom',
	description: 'You can make a custom API call',
});

const path: INodeProperties = {
	displayName: 'Path',
	name: 'path',
	type: 'string',
	default: '',
	description: 'The path to the endpoint',
	required: true,
	displayOptions: {
		show: {
			resource: ['custom'],
		},
	},
	routing: {
		request: {
			url: '=/{{$value}}',
		},
	},
};

properties.push(path);

const methods: IHttpRequestMethods[] = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'];

const method: INodeProperties = {
	displayName: 'Method',
	name: 'method',
	type: 'options',
	options: methods.map((method) => ({
		name: method,
		value: method,
		routing: {
			request: {
				method,
			},
		},
	})),
	default: '',
	description: 'The HTTP method to use',
	required: true,
	displayOptions: {
		show: {
			resource: ['custom'],
		},
	},
};

properties.push(method);

const body: INodeProperties = {
	displayName: 'Body',
	name: 'body',
	type: 'json',
	default: '',
	displayOptions: {
		show: {
			method: ['PATCH', 'POST', 'PUT'],
			resource: ['custom'],
		},
	},
};

properties.push(body);

const query: INodeProperties = {
	displayName: 'Query Parameters',
	name: 'query',
	type: 'json',
	default: '',
	displayOptions: {
		show: {
			method: ['GET'],
			resource: ['custom'],
		},
	},
};

properties.push(query);

export class ShopwareAdminNode implements INodeType {
	description: INodeTypeDescription = {
		name: 'shopwareAdminNode',
		displayName: 'Shopware',
		icon: 'file:shopware.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Shopware',
		defaults: {
			name: 'Shopware',
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
