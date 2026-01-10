/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const roleOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['role'],
			},
		},
		options: [
			{
				name: 'Add Permissions',
				value: 'addPermissions',
				description: 'Add permissions to a role',
				action: 'Add permissions to a role',
			},
			{
				name: 'Assign Users',
				value: 'assignUsers',
				description: 'Assign users to a role',
				action: 'Assign users to a role',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new role',
				action: 'Create a role',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a role',
				action: 'Delete a role',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a role by ID',
				action: 'Get a role',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many roles',
				action: 'Get many roles',
			},
			{
				name: 'Get Permissions',
				value: 'getPermissions',
				description: 'Get permissions assigned to a role',
				action: 'Get role permissions',
			},
			{
				name: 'Get Users',
				value: 'getUsers',
				description: 'Get users assigned to a role',
				action: 'Get role users',
			},
			{
				name: 'Remove Permissions',
				value: 'removePermissions',
				description: 'Remove permissions from a role',
				action: 'Remove permissions from a role',
			},
			{
				name: 'Remove Users',
				value: 'removeUsers',
				description: 'Remove users from a role',
				action: 'Remove users from a role',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a role',
				action: 'Update a role',
			},
		],
		default: 'getAll',
	},
];

export const roleFields: INodeProperties[] = [
	// ----------------------------------
	//         role:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['role'],
				operation: ['create'],
			},
		},
		description: 'The name of the role',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['role'],
				operation: ['create'],
			},
		},
		description: 'The description of the role',
	},

	// ----------------------------------
	//         role:get
	// ----------------------------------
	{
		displayName: 'Role ID',
		name: 'roleId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['role'],
				operation: ['get', 'delete', 'update', 'getPermissions', 'addPermissions', 'removePermissions', 'getUsers', 'assignUsers', 'removeUsers'],
			},
		},
		description: 'The ID of the role',
	},

	// ----------------------------------
	//         role:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['role'],
				operation: ['getAll', 'getPermissions', 'getUsers'],
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
				resource: ['role'],
				operation: ['getAll', 'getPermissions', 'getUsers'],
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
				resource: ['role'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Name Filter',
				name: 'name_filter',
				type: 'string',
				default: '',
				description: 'Filter roles by name (case-insensitive)',
			},
		],
	},

	// ----------------------------------
	//         role:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['role'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the role',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'The description of the role',
			},
		],
	},

	// ----------------------------------
	//         role:addPermissions / removePermissions
	// ----------------------------------
	{
		displayName: 'Permissions',
		name: 'permissions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: { permissionValues: [] },
		displayOptions: {
			show: {
				resource: ['role'],
				operation: ['addPermissions', 'removePermissions'],
			},
		},
		placeholder: 'Add Permission',
		options: [
			{
				name: 'permissionValues',
				displayName: 'Permission',
				values: [
					{
						displayName: 'Resource Server Identifier',
						name: 'resource_server_identifier',
						type: 'string',
						required: true,
						default: '',
						description: 'The identifier of the resource server (API)',
					},
					{
						displayName: 'Permission Name',
						name: 'permission_name',
						type: 'string',
						required: true,
						default: '',
						description: 'The name of the permission (scope)',
					},
				],
			},
		],
		description: 'Permissions to add/remove',
	},

	// ----------------------------------
	//         role:assignUsers / removeUsers
	// ----------------------------------
	{
		displayName: 'User IDs',
		name: 'userIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['role'],
				operation: ['assignUsers', 'removeUsers'],
			},
		},
		description: 'Comma-separated list of user IDs to assign/remove',
	},
];
