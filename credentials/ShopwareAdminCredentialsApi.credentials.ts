import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import {
	IAuthenticateGeneric,
	Icon,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';

export class ShopwareAdminCredentialsApi implements ICredentialType {
	name = 'shopwareAdminCredentialsApi';
	displayName = 'Shopware Admin Credentials API';
	icon: Icon = 'file:shopware.svg';
	documentationUrl =
		'https://docs.shopware.com/en/shopware-6-en/settings/system/integrationen?category=shopware-6-en/settings/system';
	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			default: 'https://example.com/api',
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

	genericAuth = true;

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	async authenticate(
		credentials: ICredentialDataDecryptedObject,
		requestOptions: IHttpRequestOptions,
	): Promise<IHttpRequestOptions> {
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

		const requestOptionsWithAuth: IHttpRequestOptions = {
			...requestOptions,
			headers: {
				...requestOptions.headers,
				Authorization: `Bearer ${access_token}`,
			},
		};

		return requestOptionsWithAuth;
	}

	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.url}}/_info/version',
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
