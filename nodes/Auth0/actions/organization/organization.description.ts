/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['organization'],
			},
		},
		options: [
			{
				name: 'Add Connection',
				value: 'addConnection',
				description: 'Enable a connection for an organization',
				action: 'Add connection to organization',
			},
			{
				name: 'Add Members',
				value: 'addMembers',
				description: 'Add users to an organization',
				action: 'Add members to organization',
			},
			{
				name: 'Assign Member Roles',
				value: 'assignMemberRoles',
				description: 'Assign roles to an organization member',
				action: 'Assign roles to member',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new organization',
				action: 'Create an organization',
			},
			{
				name: 'Create Invitation',
				value: 'createInvitation',
				description: 'Invite a user to an organization',
				action: 'Create organization invitation',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an organization',
				action: 'Delete an organization',
			},
			{
				name: 'Delete Invitation',
				value: 'deleteInvitation',
				description: 'Cancel a pending invitation',
				action: 'Delete organization invitation',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an organization by ID or name',
				action: 'Get an organization',
			},
			{
				name: 'Get Connections',
				value: 'getConnections',
				description: 'List enabled connections for an organization',
				action: 'Get organization connections',
			},
			{
				name: 'Get Invitations',
				value: 'getInvitations',
				description: 'List pending invitations for an organization',
				action: 'Get organization invitations',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many organizations',
				action: 'Get many organizations',
			},
			{
				name: 'Get Member Roles',
				value: 'getMemberRoles',
				description: 'Get roles for an organization member',
				action: 'Get member roles',
			},
			{
				name: 'Get Members',
				value: 'getMembers',
				description: 'List members of an organization',
				action: 'Get organization members',
			},
			{
				name: 'Remove Connection',
				value: 'removeConnection',
				description: 'Disable a connection for an organization',
				action: 'Remove connection from organization',
			},
			{
				name: 'Remove Member Roles',
				value: 'removeMemberRoles',
				description: 'Remove roles from an organization member',
				action: 'Remove roles from member',
			},
			{
				name: 'Remove Members',
				value: 'removeMembers',
				description: 'Remove users from an organization',
				action: 'Remove members from organization',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update organization settings',
				action: 'Update an organization',
			},
		],
		default: 'get',
	},
];

export const organizationFields: INodeProperties[] = [
	// ----------------------------------
	//         organization:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'my-organization',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['create'],
			},
		},
		description: 'The unique name of the organization (lowercase, no spaces)',
	},
	{
		displayName: 'Display Name',
		name: 'displayName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'My Organization',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['create'],
			},
		},
		description: 'The display name of the organization',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['create', 'addConnection'],
			},
		},
		options: [
			{
				displayName: 'Assign Membership On Login',
				name: 'assignMembershipOnLogin',
				type: 'boolean',
				default: false,
				description: 'Whether users logging in with this connection will be automatically added as members',
				displayOptions: {
					show: {
						'/operation': ['addConnection'],
					},
				},
			},
			{
				displayName: 'Logo URL',
				name: 'logoUrl',
				type: 'string',
				default: '',
				description: 'URL to the organization\'s logo',
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata for the organization (JSON object)',
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
			},
			{
				displayName: 'Page Background Color',
				name: 'pageBackgroundColor',
				type: 'string',
				default: '',
				placeholder: '#ffffff',
				description: 'Page background color for the organization',
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
			},
			{
				displayName: 'Primary Color',
				name: 'primaryColor',
				type: 'string',
				default: '',
				placeholder: '#0059d6',
				description: 'Primary brand color for the organization',
				displayOptions: {
					show: {
						'/operation': ['create'],
					},
				},
			},
			{
				displayName: 'Show As Button',
				name: 'showAsButton',
				type: 'boolean',
				default: true,
				description: 'Whether to show this connection as a button on the login page',
				displayOptions: {
					show: {
						'/operation': ['addConnection'],
					},
				},
			},
		],
	},

	// ----------------------------------
	//         organization:get
	// ----------------------------------
	{
		displayName: 'Identifier Type',
		name: 'identifierType',
		type: 'options',
		default: 'id',
		options: [
			{
				name: 'ID',
				value: 'id',
			},
			{
				name: 'Name',
				value: 'name',
			},
		],
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['get'],
			},
		},
		description: 'Whether to look up the organization by ID or name',
	},
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'org_xxx or my-organization',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['get'],
			},
		},
		description: 'The organization ID (org_xxx) or name',
	},

	// ----------------------------------
	//         organization:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['getAll', 'getMembers', 'getMemberRoles', 'getConnections', 'getInvitations'],
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
				resource: ['organization'],
				operation: ['getAll', 'getMembers', 'getMemberRoles', 'getConnections', 'getInvitations'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         organization:update/delete/members/connections
	// ----------------------------------
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'org_xxx',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['update', 'delete', 'getMembers', 'addMembers', 'removeMembers', 'getMemberRoles', 'assignMemberRoles', 'removeMemberRoles', 'getConnections', 'addConnection', 'removeConnection', 'getInvitations', 'createInvitation', 'deleteInvitation'],
			},
		},
		description: 'The ID of the organization (org_xxx)',
	},

	// ----------------------------------
	//         organization:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				description: 'The display name of the organization',
			},
			{
				displayName: 'Logo URL',
				name: 'logoUrl',
				type: 'string',
				default: '',
				description: 'URL to the organization\'s logo',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata for the organization (JSON object)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The unique name of the organization',
			},
			{
				displayName: 'Page Background Color',
				name: 'pageBackgroundColor',
				type: 'string',
				default: '',
				placeholder: '#ffffff',
				description: 'Page background color for the organization',
			},
			{
				displayName: 'Primary Color',
				name: 'primaryColor',
				type: 'string',
				default: '',
				placeholder: '#0059d6',
				description: 'Primary brand color for the organization',
			},
		],
	},

	// ----------------------------------
	//         organization:addMembers/removeMembers
	// ----------------------------------
	{
		displayName: 'Member IDs',
		name: 'memberIds',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: [],
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['addMembers', 'removeMembers'],
			},
		},
		description: 'The user IDs to add or remove from the organization',
	},

	// ----------------------------------
	//         organization:getMemberRoles/assignMemberRoles/removeMemberRoles
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
				resource: ['organization'],
				operation: ['getMemberRoles', 'assignMemberRoles', 'removeMemberRoles'],
			},
		},
		description: 'The user ID of the organization member',
	},

	// ----------------------------------
	//         organization:assignMemberRoles/removeMemberRoles
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
				resource: ['organization'],
				operation: ['assignMemberRoles', 'removeMemberRoles'],
			},
		},
		description: 'The role IDs to assign or remove',
	},

	// ----------------------------------
	//         organization:addConnection/removeConnection
	// ----------------------------------
	{
		displayName: 'Connection ID',
		name: 'connectionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['addConnection', 'removeConnection'],
			},
		},
		description: 'The ID of the connection to enable or disable',
	},

	// ----------------------------------
	//         organization:createInvitation
	// ----------------------------------
	{
		displayName: 'Inviter Name',
		name: 'inviterName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['createInvitation'],
			},
		},
		description: 'The name of the person sending the invitation',
	},
	{
		displayName: 'Invitee Email',
		name: 'inviteeEmail',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['createInvitation'],
			},
		},
		description: 'The email address of the person being invited',
	},
	{
		displayName: 'Client ID',
		name: 'clientId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['createInvitation'],
			},
		},
		description: 'The client ID of the application for the invitation',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['createInvitation'],
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
				displayName: 'Connection ID',
				name: 'connectionId',
				type: 'string',
				default: '',
				description: 'The connection to use for the invitation',
			},
			{
				displayName: 'Roles',
				name: 'roles',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				description: 'Role IDs to assign to the user when they accept',
			},
			{
				displayName: 'Send Invitation Email',
				name: 'sendInvitationEmail',
				type: 'boolean',
				default: true,
				description: 'Whether to send an invitation email',
			},
			{
				displayName: 'TTL (Seconds)',
				name: 'ttlSec',
				type: 'number',
				default: 604800,
				description: 'Time to live for the invitation in seconds (default 7 days)',
			},
			{
				displayName: 'User Metadata',
				name: 'userMetadata',
				type: 'json',
				default: '{}',
				description: 'User-editable metadata (JSON object)',
			},
		],
	},

	// ----------------------------------
	//         organization:deleteInvitation
	// ----------------------------------
	{
		displayName: 'Invitation ID',
		name: 'invitationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['deleteInvitation'],
			},
		},
		description: 'The ID of the invitation to delete',
	},
];
