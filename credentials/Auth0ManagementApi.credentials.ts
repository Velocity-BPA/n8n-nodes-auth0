/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
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
			description: 'Your Auth0 tenant domain (e.g., your-tenant.auth0.com or your-tenant.us.auth0.com)',
			required: true,
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'The Client ID of your Auth0 Management API application',
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
			description: 'The Client Secret of your Auth0 Management API application',
			required: true,
		},
		{
			displayName: 'Audience',
			name: 'audience',
			type: 'string',
			default: '',
			placeholder: 'https://your-tenant.auth0.com/api/v2/',
			description: 'The API audience (defaults to https://{domain}/api/v2/ if not specified)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.domain}}/api/v2',
			url: '/users',
			qs: {
				per_page: 1,
			},
		},
	};
}
