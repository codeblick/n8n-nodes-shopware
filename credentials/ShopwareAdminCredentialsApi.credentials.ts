import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import {
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

export class ShopwareAdminCredentialsApi implements ICredentialType {
	name = 'shopwareAdminCredentialsApi';
	displayName = 'Shopware Admin Credentials API';
	documentationUrl = 'https://example.com';
	properties: INodeProperties[] = [
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: 'https://example.com',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
		},
	];

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
		const axiosRequestConfig: AxiosRequestConfig = {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
			url: credentials.domain + '/api/oauth/token',
			data: {
				grant_type: 'client_credentials',
				client_id: credentials.clientId,
				client_secret: credentials.clientSecret,
			},
		};

		const result = await axios(axiosRequestConfig);

		const { access_token } = result.data;

		const requestOptionsWithAuth: IHttpRequestOptions = {
			...requestOptions,
			headers: {
				...requestOptions.headers,
				Authorization: `Bearer ${access_token}`,
			},
			baseURL: credentials.domain as string,
		};

		return requestOptionsWithAuth;
	}

	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.domain}}/api/_info/version',
		},
		rules: [
			{
				type: 'responseCode',
				properties: {
					value: 200,
					message: 'Expected response code to be 200',
				},
			},
		],
	};
}
