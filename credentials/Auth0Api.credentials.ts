import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Auth0ManagementApi implements ICredentialType {
	name = 'auth0ManagementApi';
	displayName = 'Auth0 Management API';
	documentationUrl = 'https://auth0.com/docs/api/management/v2';
	properties: INodeProperties[] = [
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: '',
			placeholder: 'your-tenant.auth0.com',
			description: 'Your Auth0 tenant domain',
			required: true,
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'Machine to Machine Application Client ID',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Machine to Machine Application Client Secret',
			required: true,
		},
		{
			displayName: 'Audience',
			name: 'audience',
			type: 'string',
			default: '',
			placeholder: 'https://your-tenant.auth0.com/api/v2/',
			description: 'The audience for the Management API (typically your domain + /api/v2/)',
			required: true,
		},
	];
}