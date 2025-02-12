import {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeConnectionType,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import axios, { AxiosRequestConfig } from 'axios';

export class ShopwareAdminTriggerNode implements INodeType {
	description: INodeTypeDescription = {
		name: 'shopwareAdminTriggerNode',
		displayName: 'Shopware Trigger',
		icon: 'file:shopware.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["eventName"]}}',
		description: 'Shopware Trigger',
		defaults: {
			name: 'Shopware Trigger',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [],
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
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event Name',
				name: 'eventName',
				type: 'string',
				default: '',
				required: true,
				hint: 'https://developer.shopware.com/docs/resources/references/app-reference/webhook-events-reference.html',
			},
			{
				displayName: 'Only Live Version',
				name: 'onlyLiveVersion',
				type: 'boolean',
				default: true,
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const response = await axios({
					...(await authenticate.call(this)),
					url: `/search/webhook`,
					method: 'POST',
					data: {
						page: 1,
						limit: 100,
						filter: [
							{
								type: 'equals',
								field: 'name',
								value: `n8n-${this.getNode().id}`,
							},
						],
					},
				});

				if (response.data.total === 0) {
					return false;
				}

				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');

				const eventName = this.getNodeParameter('eventName') as string;
				const onlyLiveVersion = this.getNodeParameter('onlyLiveVersion') as boolean;

				try {
					await axios({
						...(await authenticate.call(this)),
						url: '/webhook',
						method: 'POST',
						data: {
							name: `n8n-${this.getNode().id}`,
							url: webhookUrl,
							eventName,
							onlyLiveVersion,
						},
					});
				} catch (error) {
					return false;
				}

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const response = await axios({
					...(await authenticate.call(this)),
					url: `/search/webhook`,
					method: 'POST',
					data: {
						page: 1,
						limit: 100,
						filter: [
							{
								type: 'equals',
								field: 'name',
								value: `n8n-${this.getNode().id}`,
							},
						],
					},
				});

				for (const webhookData of response.data.data) {
					try {
						await axios({
							...(await authenticate.call(this)),
							url: `/webhook/${webhookData.id}`,
							method: 'DELETE',
						});
					} catch (error) {
						return false;
					}
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();

		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject)],
		};
	}
}

async function authenticate(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
): Promise<AxiosRequestConfig> {
	const credentials = await this.getCredentials('shopwareAdminCredentialsApi');

	const axiosRequestConfig: AxiosRequestConfig = {
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
		url: credentials.url + '/oauth/token',
		data: {
			grant_type: 'client_credentials',
			client_id: credentials.clientId,
			client_secret: credentials.clientSecret,
		},
	};

	const result = await axios(axiosRequestConfig);

	const { access_token } = result.data;

	return {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
		baseURL: credentials.url as string,
	};
}
