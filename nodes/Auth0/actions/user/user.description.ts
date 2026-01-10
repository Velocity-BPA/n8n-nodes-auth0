/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Assign Permissions',
				value: 'assignPermissions',
				description: 'Assign direct permissions to a user',
				action: 'Assign permissions to a user',
			},
			{
				name: 'Assign Roles',
				value: 'assignRoles',
				description: 'Assign roles to a user',
				action: 'Assign roles to a user',
			},
			{
				name: 'Block',
				value: 'block',
				description: 'Block a user from logging in',
				action: 'Block a user',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new user',
				action: 'Create a user',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a user permanently',
				action: 'Delete a user',
			},
			{
				name: 'Delete Enrollment',
				value: 'deleteEnrollment',
				description: 'Remove an MFA enrollment from a user',
				action: 'Delete MFA enrollment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user by ID',
				action: 'Get a user',
			},
			{
				name: 'Get by Email',
				value: 'getByEmail',
				description: 'Search for a user by email address',
				action: 'Get user by email',
			},
			{
				name: 'Get Enrollments',
				value: 'getEnrollments',
				description: 'Get MFA enrollments for a user',
				action: 'Get user enrollments',
			},
			{
				name: 'Get Logs',
				value: 'getLogs',
				description: 'Get log events for a user',
				action: 'Get user logs',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many users',
				action: 'Get many users',
			},
			{
				name: 'Get Permissions',
				value: 'getPermissions',
				description: 'Get permissions assigned to a user',
				action: 'Get user permissions',
			},
			{
				name: 'Get Roles',
				value: 'getRoles',
				description: 'Get roles assigned to a user',
				action: 'Get user roles',
			},
			{
				name: 'Invalidate Browsers',
				value: 'invalidateBrowsers',
				description: 'Invalidate remembered browsers for MFA',
				action: 'Invalidate remembered browsers',
			},
			{
				name: 'Link Accounts',
				value: 'linkAccounts',
				description: 'Link user accounts from different identities',
				action: 'Link user accounts',
			},
			{
				name: 'Remove Permissions',
				value: 'removePermissions',
				description: 'Remove direct permissions from a user',
				action: 'Remove permissions from a user',
			},
			{
				name: 'Remove Roles',
				value: 'removeRoles',
				description: 'Remove roles from a user',
				action: 'Remove roles from a user',
			},
			{
				name: 'Unblock',
				value: 'unblock',
				description: 'Unblock a blocked user',
				action: 'Unblock a user',
			},
			{
				name: 'Unlink Accounts',
				value: 'unlinkAccounts',
				description: 'Unlink user accounts',
				action: 'Unlink user accounts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update user properties',
				action: 'Update a user',
			},
		],
		default: 'get',
	},
];

export const userFields: INodeProperties[] = [
	// ----------------------------------
	//         user:create
	// ----------------------------------
	{
		displayName: 'Connection',
		name: 'connection',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Username-Password-Authentication',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		description: 'The name of the database connection to create the user in',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		description: 'The email address of the user',
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		description: 'The password for the user',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'App Metadata',
				name: 'appMetadata',
				type: 'json',
				default: '{}',
				description: 'Application-specific metadata (JSON object)',
			},
			{
				displayName: 'Blocked',
				name: 'blocked',
				type: 'boolean',
				default: false,
				description: 'Whether the user is blocked',
			},
			{
				displayName: 'Email Verified',
				name: 'emailVerified',
				type: 'boolean',
				default: false,
				description: 'Whether the email is verified',
			},
			{
				displayName: 'Family Name',
				name: 'familyName',
				type: 'string',
				default: '',
				description: 'The family name (last name) of the user',
			},
			{
				displayName: 'Given Name',
				name: 'givenName',
				type: 'string',
				default: '',
				description: 'The given name (first name) of the user',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The full name of the user',
			},
			{
				displayName: 'Nickname',
				name: 'nickname',
				type: 'string',
				default: '',
				description: 'The nickname of the user',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				placeholder: '+1234567890',
				description: 'Phone number in E.164 format',
			},
			{
				displayName: 'Phone Verified',
				name: 'phoneVerified',
				type: 'boolean',
				default: false,
				description: 'Whether the phone number is verified',
			},
			{
				displayName: 'Picture URL',
				name: 'picture',
				type: 'string',
				default: '',
				description: 'URL to the user\'s profile picture',
			},
			{
				displayName: 'User Metadata',
				name: 'userMetadata',
				type: 'json',
				default: '{}',
				description: 'User-editable metadata (JSON object)',
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				description: 'Username (if connection requires it)',
			},
			{
				displayName: 'Verify Email',
				name: 'verifyEmail',
				type: 'boolean',
				default: false,
				description: 'Whether to send a verification email on creation',
			},
		],
	},

	// ----------------------------------
	//         user:get
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'auth0|123456789',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'update', 'delete', 'block', 'unblock', 'getRoles', 'assignRoles', 'removeRoles', 'getPermissions', 'assignPermissions', 'removePermissions', 'getLogs', 'getEnrollments', 'deleteEnrollment', 'invalidateBrowsers', 'linkAccounts', 'unlinkAccounts'],
			},
		},
		description: 'The ID of the user (e.g., auth0|123456789)',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'multiOptions',
				options: [
					{ name: 'App Metadata', value: 'app_metadata' },
					{ name: 'Blocked', value: 'blocked' },
					{ name: 'Created At', value: 'created_at' },
					{ name: 'Email', value: 'email' },
					{ name: 'Email Verified', value: 'email_verified' },
					{ name: 'Family Name', value: 'family_name' },
					{ name: 'Given Name', value: 'given_name' },
					{ name: 'Identities', value: 'identities' },
					{ name: 'Last Login', value: 'last_login' },
					{ name: 'Logins Count', value: 'logins_count' },
					{ name: 'Name', value: 'name' },
					{ name: 'Nickname', value: 'nickname' },
					{ name: 'Phone Number', value: 'phone_number' },
					{ name: 'Picture', value: 'picture' },
					{ name: 'Updated At', value: 'updated_at' },
					{ name: 'User ID', value: 'user_id' },
					{ name: 'User Metadata', value: 'user_metadata' },
					{ name: 'Username', value: 'username' },
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
	//         user:getByEmail
	// ----------------------------------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getByEmail'],
			},
		},
		description: 'The email address to search for',
	},

	// ----------------------------------
	//         user:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getAll', 'getRoles', 'getPermissions', 'getLogs'],
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
				resource: ['user'],
				operation: ['getAll', 'getRoles', 'getPermissions', 'getLogs'],
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
				resource: ['user'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Connection',
				name: 'connection',
				type: 'string',
				default: '',
				description: 'Filter by connection name',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'multiOptions',
				options: [
					{ name: 'App Metadata', value: 'app_metadata' },
					{ name: 'Blocked', value: 'blocked' },
					{ name: 'Created At', value: 'created_at' },
					{ name: 'Email', value: 'email' },
					{ name: 'Email Verified', value: 'email_verified' },
					{ name: 'Family Name', value: 'family_name' },
					{ name: 'Given Name', value: 'given_name' },
					{ name: 'Identities', value: 'identities' },
					{ name: 'Last Login', value: 'last_login' },
					{ name: 'Logins Count', value: 'logins_count' },
					{ name: 'Name', value: 'name' },
					{ name: 'Nickname', value: 'nickname' },
					{ name: 'Phone Number', value: 'phone_number' },
					{ name: 'Picture', value: 'picture' },
					{ name: 'Updated At', value: 'updated_at' },
					{ name: 'User ID', value: 'user_id' },
					{ name: 'User Metadata', value: 'user_metadata' },
					{ name: 'Username', value: 'username' },
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
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				placeholder: 'email:"john@example.com"',
				description: 'Lucene query to search users',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'string',
				default: '',
				placeholder: 'created_at:1',
				description: 'Field to sort by and direction (1 for ascending, -1 for descending)',
			},
		],
	},

	// ----------------------------------
	//         user:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'App Metadata',
				name: 'appMetadata',
				type: 'json',
				default: '{}',
				description: 'Application-specific metadata (JSON object)',
			},
			{
				displayName: 'Blocked',
				name: 'blocked',
				type: 'boolean',
				default: false,
				description: 'Whether the user is blocked',
			},
			{
				displayName: 'Connection',
				name: 'connection',
				type: 'string',
				default: '',
				description: 'The connection name (required when updating email or password)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'The new email address',
			},
			{
				displayName: 'Email Verified',
				name: 'emailVerified',
				type: 'boolean',
				default: false,
				description: 'Whether the email is verified',
			},
			{
				displayName: 'Family Name',
				name: 'familyName',
				type: 'string',
				default: '',
				description: 'The family name (last name) of the user',
			},
			{
				displayName: 'Given Name',
				name: 'givenName',
				type: 'string',
				default: '',
				description: 'The given name (first name) of the user',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The full name of the user',
			},
			{
				displayName: 'Nickname',
				name: 'nickname',
				type: 'string',
				default: '',
				description: 'The nickname of the user',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'The new password',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				placeholder: '+1234567890',
				description: 'Phone number in E.164 format',
			},
			{
				displayName: 'Phone Verified',
				name: 'phoneVerified',
				type: 'boolean',
				default: false,
				description: 'Whether the phone number is verified',
			},
			{
				displayName: 'Picture URL',
				name: 'picture',
				type: 'string',
				default: '',
				description: 'URL to the user\'s profile picture',
			},
			{
				displayName: 'User Metadata',
				name: 'userMetadata',
				type: 'json',
				default: '{}',
				description: 'User-editable metadata (JSON object)',
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				description: 'The username',
			},
			{
				displayName: 'Verify Email',
				name: 'verifyEmail',
				type: 'boolean',
				default: false,
				description: 'Whether to send a verification email',
			},
		],
	},

	// ----------------------------------
	//         user:assignRoles / removeRoles
	// ----------------------------------
	{
		displayName: 'Role IDs',
		name: 'roleIds',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: [],
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['assignRoles', 'removeRoles'],
			},
		},
		description: 'The IDs of the roles to assign or remove',
	},

	// ----------------------------------
	//         user:assignPermissions / removePermissions
	// ----------------------------------
	{
		displayName: 'Permissions',
		name: 'permissions',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['assignPermissions', 'removePermissions'],
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
						default: '',
						description: 'The identifier of the resource server (API)',
					},
					{
						displayName: 'Permission Name',
						name: 'permission_name',
						type: 'string',
						default: '',
						description: 'The name of the permission/scope',
					},
				],
			},
		],
		description: 'The permissions to assign or remove',
	},

	// ----------------------------------
	//         user:deleteEnrollment
	// ----------------------------------
	{
		displayName: 'Enrollment ID',
		name: 'enrollmentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['deleteEnrollment'],
			},
		},
		description: 'The ID of the MFA enrollment to delete',
	},

	// ----------------------------------
	//         user:linkAccounts
	// ----------------------------------
	{
		displayName: 'Link With',
		name: 'linkWith',
		type: 'collection',
		placeholder: 'Add Field',
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['linkAccounts'],
			},
		},
		options: [
			{
				displayName: 'Provider',
				name: 'provider',
				type: 'string',
				default: '',
				description: 'The identity provider of the secondary account (e.g., google-oauth2)',
			},
			{
				displayName: 'Connection ID',
				name: 'connectionId',
				type: 'string',
				default: '',
				description: 'The connection ID to link',
			},
			{
				displayName: 'User ID to Link',
				name: 'linkWithUserId',
				type: 'string',
				default: '',
				description: 'The user ID of the secondary account to link',
			},
		],
	},

	// ----------------------------------
	//         user:unlinkAccounts
	// ----------------------------------
	{
		displayName: 'Provider',
		name: 'provider',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['unlinkAccounts'],
			},
		},
		description: 'The identity provider of the linked account (e.g., google-oauth2)',
	},
	{
		displayName: 'Linked User ID',
		name: 'linkedUserId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['unlinkAccounts'],
			},
		},
		description: 'The user ID of the linked account to unlink',
	},
];
