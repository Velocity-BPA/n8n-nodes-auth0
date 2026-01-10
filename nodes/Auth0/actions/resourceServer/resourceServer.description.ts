/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const resourceServerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['resourceServer'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new API (Resource Server)',
				action: 'Create an API',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an API',
				action: 'Delete an API',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an API by ID',
				action: 'Get an API',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many APIs',
				action: 'Get many APIs',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an API',
				action: 'Update an API',
			},
		],
		default: 'getAll',
	},
];

export const resourceServerFields: INodeProperties[] = [
	// ----------------------------------
	//         resourceServer:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['resourceServer'],
				operation: ['create'],
			},
		},
		description: 'The friendly name of the API',
	},
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['resourceServer'],
				operation: ['create'],
			},
		},
		description: 'The unique identifier (audience) for the API. This is used as the audience parameter in authorization calls.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['resourceServer'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Allow Offline Access',
				name: 'allow_offline_access',
				type: 'boolean',
				default: false,
				description: 'Whether refresh tokens can be issued for this API',
			},
			{
				displayName: 'Enforce Policies',
				name: 'enforce_policies',
				type: 'boolean',
				default: false,
				description: 'Whether to enforce authorization policies',
			},
			{
				displayName: 'Scopes (JSON)',
				name: 'scopes',
				type: 'json',
				default: '[]',
				description: 'JSON array of scope objects with value and description properties',
			},
			{
				displayName: 'Signing Algorithm',
				name: 'signing_alg',
				type: 'options',
				options: [
					{ name: 'RS256', value: 'RS256' },
					{ name: 'HS256', value: 'HS256' },
				],
				default: 'RS256',
				description: 'The algorithm used to sign JWTs for this API',
			},
			{
				displayName: 'Skip Consent For Verifiable First Party Clients',
				name: 'skip_consent_for_verifiable_first_party_clients',
				type: 'boolean',
				default: true,
				description: 'Whether to skip the consent dialog for first-party clients',
			},
			{
				displayName: 'Token Dialect',
				name: 'token_dialect',
				type: 'options',
				options: [
					{ name: 'Access Token', value: 'access_token' },
					{ name: 'Access Token Auth-Z', value: 'access_token_authz' },
				],
				default: 'access_token',
				description: 'The dialect of the access token',
			},
			{
				displayName: 'Token Lifetime (Seconds)',
				name: 'token_lifetime',
				type: 'number',
				default: 86400,
				description: 'The amount of time in seconds that the token will be valid',
			},
			{
				displayName: 'Token Lifetime For Web (Seconds)',
				name: 'token_lifetime_for_web',
				type: 'number',
				default: 7200,
				description: 'The amount of time in seconds that the token will be valid for web applications',
			},
		],
	},

	// ----------------------------------
	//         resourceServer:get
	// ----------------------------------
	{
		displayName: 'API ID',
		name: 'resourceServerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['resourceServer'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the API (Resource Server)',
	},

	// ----------------------------------
	//         resourceServer:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['resourceServer'],
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
				resource: ['resourceServer'],
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
				resource: ['resourceServer'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Include Is System',
				name: 'is_system',
				type: 'boolean',
				default: false,
				description: 'Whether to include system APIs',
			},
		],
	},

	// ----------------------------------
	//         resourceServer:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['resourceServer'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Allow Offline Access',
				name: 'allow_offline_access',
				type: 'boolean',
				default: false,
				description: 'Whether refresh tokens can be issued for this API',
			},
			{
				displayName: 'Enforce Policies',
				name: 'enforce_policies',
				type: 'boolean',
				default: false,
				description: 'Whether to enforce authorization policies',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The friendly name of the API',
			},
			{
				displayName: 'Scopes (JSON)',
				name: 'scopes',
				type: 'json',
				default: '[]',
				description: 'JSON array of scope objects with value and description properties',
			},
			{
				displayName: 'Signing Algorithm',
				name: 'signing_alg',
				type: 'options',
				options: [
					{ name: 'RS256', value: 'RS256' },
					{ name: 'HS256', value: 'HS256' },
				],
				default: 'RS256',
				description: 'The algorithm used to sign JWTs for this API',
			},
			{
				displayName: 'Skip Consent For Verifiable First Party Clients',
				name: 'skip_consent_for_verifiable_first_party_clients',
				type: 'boolean',
				default: true,
				description: 'Whether to skip the consent dialog for first-party clients',
			},
			{
				displayName: 'Token Dialect',
				name: 'token_dialect',
				type: 'options',
				options: [
					{ name: 'Access Token', value: 'access_token' },
					{ name: 'Access Token Auth-Z', value: 'access_token_authz' },
				],
				default: 'access_token',
				description: 'The dialect of the access token',
			},
			{
				displayName: 'Token Lifetime (Seconds)',
				name: 'token_lifetime',
				type: 'number',
				default: 86400,
				description: 'The amount of time in seconds that the token will be valid',
			},
			{
				displayName: 'Token Lifetime For Web (Seconds)',
				name: 'token_lifetime_for_web',
				type: 'number',
				default: 7200,
				description: 'The amount of time in seconds that the token will be valid for web applications',
			},
		],
	},
];
