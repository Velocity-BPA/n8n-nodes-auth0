/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';
import { ACTION_TRIGGERS } from '../../utils/helpers';

export const actionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['action'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new action',
				action: 'Create an action',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an action',
				action: 'Delete an action',
			},
			{
				name: 'Deploy',
				value: 'deploy',
				description: 'Deploy an action',
				action: 'Deploy an action',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an action by ID',
				action: 'Get an action',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many actions',
				action: 'Get many actions',
			},
			{
				name: 'Get Trigger Bindings',
				value: 'getTriggerBindings',
				description: 'Get actions bound to a trigger',
				action: 'Get trigger bindings',
			},
			{
				name: 'Get Triggers',
				value: 'getTriggers',
				description: 'Get available triggers',
				action: 'Get triggers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an action',
				action: 'Update an action',
			},
			{
				name: 'Update Trigger Bindings',
				value: 'updateTriggerBindings',
				description: 'Update actions bound to a trigger',
				action: 'Update trigger bindings',
			},
		],
		default: 'getAll',
	},
];

export const actionFields: INodeProperties[] = [
	// ----------------------------------
	//         action:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['create'],
			},
		},
		description: 'The name of the action',
	},
	{
		displayName: 'Trigger',
		name: 'trigger',
		type: 'options',
		required: true,
		options: ACTION_TRIGGERS.map((t) => ({
			name: t.name,
			value: t.value,
		})),
		default: 'post-login',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['create'],
			},
		},
		description: 'The trigger for the action',
	},
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		required: true,
		default: `exports.onExecutePostLogin = async (event, api) => {
  console.log('Hello from Auth0 Action!');
};`,
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['create'],
			},
		},
		description: 'The JavaScript code for the action',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Dependencies (JSON)',
				name: 'dependencies',
				type: 'json',
				default: '[]',
				description: 'JSON array of NPM dependencies. Example: [{"name": "lodash", "version": "4.17.21"}]',
			},
			{
				displayName: 'Runtime',
				name: 'runtime',
				type: 'options',
				options: [
					{ name: 'Node 18', value: 'node18' },
					{ name: 'Node 16', value: 'node16' },
					{ name: 'Node 12', value: 'node12' },
				],
				default: 'node18',
				description: 'The Node.js runtime version',
			},
			{
				displayName: 'Secrets (JSON)',
				name: 'secrets',
				type: 'json',
				default: '[]',
				description: 'JSON array of secrets. Example: [{"name": "MY_SECRET", "value": "secret_value"}]',
			},
		],
	},

	// ----------------------------------
	//         action:get
	// ----------------------------------
	{
		displayName: 'Action ID',
		name: 'actionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['get', 'update', 'delete', 'deploy'],
			},
		},
		description: 'The ID of the action',
	},

	// ----------------------------------
	//         action:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['action'],
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
				resource: ['action'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Trigger ID',
				name: 'triggerId',
				type: 'options',
				options: ACTION_TRIGGERS.map((t) => ({
					name: t.name,
					value: t.value,
				})),
				default: '',
				description: 'Filter by trigger',
			},
			{
				displayName: 'Deployed',
				name: 'deployed',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by deployment status',
			},
			{
				displayName: 'Installed',
				name: 'installed',
				type: 'boolean',
				default: false,
				description: 'Whether to include actions from the marketplace',
			},
		],
	},

	// ----------------------------------
	//         action:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Code',
				name: 'code',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				description: 'The JavaScript code for the action',
			},
			{
				displayName: 'Dependencies (JSON)',
				name: 'dependencies',
				type: 'json',
				default: '[]',
				description: 'JSON array of NPM dependencies',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the action',
			},
			{
				displayName: 'Runtime',
				name: 'runtime',
				type: 'options',
				options: [
					{ name: 'Node 18', value: 'node18' },
					{ name: 'Node 16', value: 'node16' },
					{ name: 'Node 12', value: 'node12' },
				],
				default: 'node18',
				description: 'The Node.js runtime version',
			},
			{
				displayName: 'Secrets (JSON)',
				name: 'secrets',
				type: 'json',
				default: '[]',
				description: 'JSON array of secrets',
			},
		],
	},

	// ----------------------------------
	//         action:getTriggers
	// ----------------------------------
	// No additional fields needed

	// ----------------------------------
	//         action:getTriggerBindings
	// ----------------------------------
	{
		displayName: 'Trigger ID',
		name: 'triggerId',
		type: 'options',
		required: true,
		options: ACTION_TRIGGERS.map((t) => ({
			name: t.name,
			value: t.value,
		})),
		default: 'post-login',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['getTriggerBindings', 'updateTriggerBindings'],
			},
		},
		description: 'The trigger to get/update bindings for',
	},

	// ----------------------------------
	//         action:updateTriggerBindings
	// ----------------------------------
	{
		displayName: 'Bindings (JSON)',
		name: 'bindings',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: {
			show: {
				resource: ['action'],
				operation: ['updateTriggerBindings'],
			},
		},
		description: 'JSON array of binding references. Example: [{"ref": {"type": "action_id", "value": "ACTION_ID"}, "display_name": "My Action"}]',
	},
];
