/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';
import { CONNECTION_STRATEGIES } from '../../utils/helpers';

export const connectionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['connection'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new connection',
				action: 'Create a connection',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a connection',
				action: 'Delete a connection',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a connection by ID',
				action: 'Get a connection',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many connections',
				action: 'Get many connections',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Check connection health status',
				action: 'Get connection status',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update connection settings',
				action: 'Update a connection',
			},
		],
		default: 'get',
	},
];

export const connectionFields: INodeProperties[] = [
	// ----------------------------------
	//         connection:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'my-connection',
		displayOptions: {
			show: {
				resource: ['connection'],
				operation: ['create'],
			},
		},
		description: 'The unique name of the connection',
	},
	{
		displayName: 'Strategy',
		name: 'strategy',
		type: 'options',
		required: true,
		default: 'auth0',
		options: CONNECTION_STRATEGIES,
		displayOptions: {
			show: {
				resource: ['connection'],
				operation: ['create'],
			},
		},
		description: 'The connection strategy/type',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['connection'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Enabled Clients',
				name: 'enabledClients',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Application client IDs that can use this connection',
			},
			{
				displayName: 'Is Domain Connection',
				name: 'isDomainConnection',
				type: 'boolean',
				default: false,
				description: 'Whether this is a domain-level connection',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata for the connection (JSON object)',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'json',
				default: '{}',
				description: 'Strategy-specific configuration options (JSON object)',
			},
			{
				displayName: 'Realms',
				name: 'realms',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Connection realms',
			},
		],
	},

	// ----------------------------------
	//         connection:get/update/delete/getStatus
	// ----------------------------------
	{
		displayName: 'Connection ID',
		name: 'connectionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['connection'],
				operation: ['get', 'update', 'delete', 'getStatus'],
			},
		},
		description: 'The ID of the connection',
	},

	// ----------------------------------
	//         connection:get
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['connection'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'multiOptions',
				options: [
					{ name: 'Enabled Clients', value: 'enabled_clients' },
					{ name: 'ID', value: 'id' },
					{ name: 'Is Domain Connection', value: 'is_domain_connection' },
					{ name: 'Metadata', value: 'metadata' },
					{ name: 'Name', value: 'name' },
					{ name: 'Options', value: 'options' },
					{ name: 'Realms', value: 'realms' },
					{ name: 'Strategy', value: 'strategy' },
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
	//         connection:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['connection'],
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
				resource: ['connection'],
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
				resource: ['connection'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'multiOptions',
				options: [
					{ name: 'Enabled Clients', value: 'enabled_clients' },
					{ name: 'ID', value: 'id' },
					{ name: 'Is Domain Connection', value: 'is_domain_connection' },
					{ name: 'Metadata', value: 'metadata' },
					{ name: 'Name', value: 'name' },
					{ name: 'Options', value: 'options' },
					{ name: 'Realms', value: 'realms' },
					{ name: 'Strategy', value: 'strategy' },
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
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by connection name',
			},
			{
				displayName: 'Strategy',
				name: 'strategy',
				type: 'options',
				options: CONNECTION_STRATEGIES,
				default: '',
				description: 'Filter by connection strategy',
			},
		],
	},

	// ----------------------------------
	//         connection:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['connection'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				description: 'The display name of the connection',
			},
			{
				displayName: 'Enabled Clients',
				name: 'enabledClients',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Application client IDs that can use this connection',
			},
			{
				displayName: 'Is Domain Connection',
				name: 'isDomainConnection',
				type: 'boolean',
				default: false,
				description: 'Whether this is a domain-level connection',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata for the connection (JSON object)',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'json',
				default: '{}',
				description: 'Strategy-specific configuration options (JSON object)',
			},
			{
				displayName: 'Realms',
				name: 'realms',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Connection realms',
			},
		],
	},
];
