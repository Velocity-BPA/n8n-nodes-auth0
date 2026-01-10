/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';
import { APP_TYPES, GRANT_TYPES } from '../../utils/helpers';

export const applicationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['application'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new application',
				action: 'Create an application',
			},
			{
				name: 'Create Credential',
				value: 'createCredential',
				description: 'Create a credential for an application',
				action: 'Create application credential',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an application',
				action: 'Delete an application',
			},
			{
				name: 'Delete Credential',
				value: 'deleteCredential',
				description: 'Delete a credential from an application',
				action: 'Delete application credential',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an application by client ID',
				action: 'Get an application',
			},
			{
				name: 'Get Credentials',
				value: 'getCredentials',
				description: 'List credentials for an application',
				action: 'Get application credentials',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many applications',
				action: 'Get many applications',
			},
			{
				name: 'Rotate Secret',
				value: 'rotateSecret',
				description: 'Rotate the client secret',
				action: 'Rotate application secret',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update application settings',
				action: 'Update an application',
			},
		],
		default: 'get',
	},
];

export const applicationFields: INodeProperties[] = [
	// ----------------------------------
	//         application:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['create'],
			},
		},
		description: 'The name of the application',
	},
	{
		displayName: 'Application Type',
		name: 'appType',
		type: 'options',
		required: true,
		default: 'regular_web',
		options: APP_TYPES,
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['create'],
			},
		},
		description: 'The type of application',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Allowed Logout URLs',
				name: 'allowedLogoutUrls',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'URLs that are allowed for logout redirects',
			},
			{
				displayName: 'Allowed Origins',
				name: 'allowedOrigins',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Allowed origins for CORS',
			},
			{
				displayName: 'Callback URLs',
				name: 'callbacks',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'URLs that are allowed for callbacks',
			},
			{
				displayName: 'Client Metadata',
				name: 'clientMetadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata for the application (JSON object)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the application',
			},
			{
				displayName: 'Grant Types',
				name: 'grantTypes',
				type: 'multiOptions',
				options: GRANT_TYPES,
				default: [],
				description: 'Enabled grant types',
			},
			{
				displayName: 'Initiate Login URI',
				name: 'initiateLoginUri',
				type: 'string',
				default: '',
				description: 'URL to initiate login',
			},
			{
				displayName: 'Logo URI',
				name: 'logoUri',
				type: 'string',
				default: '',
				description: 'URL to the application logo',
			},
			{
				displayName: 'OIDC Conformant',
				name: 'oidcConformant',
				type: 'boolean',
				default: true,
				description: 'Whether the application is OIDC conformant',
			},
			{
				displayName: 'Token Endpoint Auth Method',
				name: 'tokenEndpointAuthMethod',
				type: 'options',
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'Client Secret Basic', value: 'client_secret_basic' },
					{ name: 'Client Secret Post', value: 'client_secret_post' },
					{ name: 'Private Key JWT', value: 'private_key_jwt' },
				],
				default: 'client_secret_post',
				description: 'Token endpoint authentication method',
			},
			{
				displayName: 'Web Origins',
				name: 'webOrigins',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Allowed web origins',
			},
		],
	},

	// ----------------------------------
	//         application:get/update/delete/rotateSecret/getCredentials
	// ----------------------------------
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['get', 'update', 'delete', 'rotateSecret', 'getCredentials', 'createCredential', 'deleteCredential'],
			},
		},
		description: 'The client ID of the application',
	},

	// ----------------------------------
	//         application:get
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'multiOptions',
				options: [
					{ name: 'App Type', value: 'app_type' },
					{ name: 'Callbacks', value: 'callbacks' },
					{ name: 'Client ID', value: 'client_id' },
					{ name: 'Client Metadata', value: 'client_metadata' },
					{ name: 'Client Secret', value: 'client_secret' },
					{ name: 'Description', value: 'description' },
					{ name: 'Grant Types', value: 'grant_types' },
					{ name: 'JWT Configuration', value: 'jwt_configuration' },
					{ name: 'Name', value: 'name' },
					{ name: 'Web Origins', value: 'web_origins' },
				],
				default: [],
				description: 'Fields to include in the response',
			},
			{
				displayName: 'Include Fields',
				name: 'includeFields',
				type: 'boolean',
				default: true,
				description: 'Whether to include (true) or exclude (false) the specified fields',
			},
		],
	},

	// ----------------------------------
	//         application:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'App Type',
				name: 'appType',
				type: 'options',
				options: APP_TYPES,
				default: '',
				description: 'Filter by application type',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'multiOptions',
				options: [
					{ name: 'App Type', value: 'app_type' },
					{ name: 'Callbacks', value: 'callbacks' },
					{ name: 'Client ID', value: 'client_id' },
					{ name: 'Client Metadata', value: 'client_metadata' },
					{ name: 'Description', value: 'description' },
					{ name: 'Grant Types', value: 'grant_types' },
					{ name: 'Name', value: 'name' },
					{ name: 'Web Origins', value: 'web_origins' },
				],
				default: [],
				description: 'Fields to include in the response',
			},
			{
				displayName: 'Include Fields',
				name: 'includeFields',
				type: 'boolean',
				default: true,
				description: 'Whether to include (true) or exclude (false) the specified fields',
			},
			{
				displayName: 'Is First Party',
				name: 'isFirstParty',
				type: 'boolean',
				default: true,
				description: 'Whether to filter by first-party applications',
			},
			{
				displayName: 'Is Global',
				name: 'isGlobal',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by global applications',
			},
		],
	},

	// ----------------------------------
	//         application:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Allowed Logout URLs',
				name: 'allowedLogoutUrls',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'URLs that are allowed for logout redirects',
			},
			{
				displayName: 'Allowed Origins',
				name: 'allowedOrigins',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Allowed origins for CORS',
			},
			{
				displayName: 'Callback URLs',
				name: 'callbacks',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'URLs that are allowed for callbacks',
			},
			{
				displayName: 'Client Metadata',
				name: 'clientMetadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata for the application (JSON object)',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the application',
			},
			{
				displayName: 'Grant Types',
				name: 'grantTypes',
				type: 'multiOptions',
				options: GRANT_TYPES,
				default: [],
				description: 'Enabled grant types',
			},
			{
				displayName: 'Initiate Login URI',
				name: 'initiateLoginUri',
				type: 'string',
				default: '',
				description: 'URL to initiate login',
			},
			{
				displayName: 'JWT Configuration',
				name: 'jwtConfiguration',
				type: 'json',
				default: '{}',
				description: 'JWT configuration settings (JSON object)',
			},
			{
				displayName: 'Logo URI',
				name: 'logoUri',
				type: 'string',
				default: '',
				description: 'URL to the application logo',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the application',
			},
			{
				displayName: 'OIDC Conformant',
				name: 'oidcConformant',
				type: 'boolean',
				default: true,
				description: 'Whether the application is OIDC conformant',
			},
			{
				displayName: 'Refresh Token Configuration',
				name: 'refreshToken',
				type: 'json',
				default: '{}',
				description: 'Refresh token configuration settings (JSON object)',
			},
			{
				displayName: 'Token Endpoint Auth Method',
				name: 'tokenEndpointAuthMethod',
				type: 'options',
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'Client Secret Basic', value: 'client_secret_basic' },
					{ name: 'Client Secret Post', value: 'client_secret_post' },
					{ name: 'Private Key JWT', value: 'private_key_jwt' },
				],
				default: 'client_secret_post',
				description: 'Token endpoint authentication method',
			},
			{
				displayName: 'Web Origins',
				name: 'webOrigins',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Allowed web origins',
			},
		],
	},

	// ----------------------------------
	//         application:createCredential
	// ----------------------------------
	{
		displayName: 'Credential Type',
		name: 'credentialType',
		type: 'options',
		required: true,
		default: 'public_key',
		options: [
			{ name: 'Public Key', value: 'public_key' },
			{ name: 'Cert Subject DN', value: 'cert_subject_dn' },
			{ name: 'X509 Certificate', value: 'x509_cert' },
		],
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['createCredential'],
			},
		},
		description: 'The type of credential',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['createCredential'],
			},
		},
		options: [
			{
				displayName: 'Algorithm',
				name: 'algorithm',
				type: 'options',
				options: [
					{ name: 'RS256', value: 'RS256' },
					{ name: 'RS384', value: 'RS384' },
					{ name: 'PS256', value: 'PS256' },
				],
				default: 'RS256',
				description: 'Algorithm for the credential',
			},
			{
				displayName: 'Expires At',
				name: 'expiresAt',
				type: 'dateTime',
				default: '',
				description: 'Expiration date for the credential',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name for the credential',
			},
			{
				displayName: 'PEM',
				name: 'pem',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'PEM-encoded public key or certificate',
			},
		],
	},

	// ----------------------------------
	//         application:deleteCredential
	// ----------------------------------
	{
		displayName: 'Credential ID',
		name: 'credentialId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['application'],
				operation: ['deleteCredential'],
			},
		},
		description: 'The ID of the credential to delete',
	},
];
