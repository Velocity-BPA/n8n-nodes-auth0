/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { auth0ApiRequest, auth0ApiRequestAllItems } from '../../transport';
import { removeEmptyFields, parseJson } from '../../utils/helpers';

export async function createOrganization(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const displayName = this.getNodeParameter('displayName', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		name,
		display_name: displayName,
	};

	if (additionalFields.metadata) {
		body.metadata = parseJson(additionalFields.metadata as string);
	}
	if (additionalFields.logoUrl || additionalFields.primaryColor || additionalFields.pageBackgroundColor) {
		body.branding = {
			logo_url: additionalFields.logoUrl,
			colors: {
				primary: additionalFields.primaryColor,
				page_background: additionalFields.pageBackgroundColor,
			},
		};
	}

	const response = await auth0ApiRequest.call(this, 'POST', '/organizations', body);
	return [{ json: response as IDataObject }];
}

export async function getOrganization(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const identifier = this.getNodeParameter('identifier', index) as string;
	const identifierType = this.getNodeParameter('identifierType', index) as string;

	let endpoint: string;
	if (identifierType === 'id') {
		endpoint = `/organizations/${identifier}`;
	} else {
		endpoint = `/organizations/name/${identifier}`;
	}

	const response = await auth0ApiRequest.call(this, 'GET', endpoint);
	return [{ json: response as IDataObject }];
}

export async function getAllOrganizations(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	let response: IDataObject[];

	if (returnAll) {
		response = await auth0ApiRequestAllItems.call(
			this,
			'GET',
			'/organizations',
			undefined,
			undefined,
			'organizations',
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		const result = await auth0ApiRequest.call(this, 'GET', '/organizations', undefined, {
			per_page: limit,
		});
		response = (result as IDataObject).organizations as IDataObject[] || result as IDataObject[];
	}

	return response.map((item) => ({ json: item }));
}

export async function updateOrganization(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.name) {
		body.name = updateFields.name;
	}
	if (updateFields.displayName) {
		body.display_name = updateFields.displayName;
	}
	if (updateFields.metadata) {
		body.metadata = parseJson(updateFields.metadata as string);
	}
	if (updateFields.logoUrl || updateFields.primaryColor || updateFields.pageBackgroundColor) {
		body.branding = {
			logo_url: updateFields.logoUrl,
			colors: {
				primary: updateFields.primaryColor,
				page_background: updateFields.pageBackgroundColor,
			},
		};
	}

	const response = await auth0ApiRequest.call(
		this,
		'PATCH',
		`/organizations/${organizationId}`,
		removeEmptyFields(body),
	);
	return [{ json: response as IDataObject }];
}

export async function deleteOrganization(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;

	await auth0ApiRequest.call(this, 'DELETE', `/organizations/${organizationId}`);
	return [{ json: { success: true, organizationId } }];
}

export async function getOrganizationMembers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	let response: IDataObject[];

	if (returnAll) {
		response = await auth0ApiRequestAllItems.call(
			this,
			'GET',
			`/organizations/${organizationId}/members`,
			undefined,
			undefined,
			'members',
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		const result = await auth0ApiRequest.call(
			this,
			'GET',
			`/organizations/${organizationId}/members`,
			undefined,
			{ per_page: limit },
		);
		response = (result as IDataObject).members as IDataObject[] || result as IDataObject[];
	}

	return response.map((item) => ({ json: item }));
}

export async function addOrganizationMembers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const memberIds = this.getNodeParameter('memberIds', index) as string[];

	await auth0ApiRequest.call(this, 'POST', `/organizations/${organizationId}/members`, {
		members: memberIds,
	});
	return [{ json: { success: true, organizationId, membersAdded: memberIds } }];
}

export async function removeOrganizationMembers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const memberIds = this.getNodeParameter('memberIds', index) as string[];

	await auth0ApiRequest.call(this, 'DELETE', `/organizations/${organizationId}/members`, {
		members: memberIds,
	});
	return [{ json: { success: true, organizationId, membersRemoved: memberIds } }];
}

export async function getMemberRoles(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const userId = this.getNodeParameter('userId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	let response: IDataObject[];

	if (returnAll) {
		response = await auth0ApiRequestAllItems.call(
			this,
			'GET',
			`/organizations/${organizationId}/members/${encodeURIComponent(userId)}/roles`,
			undefined,
			undefined,
			'roles',
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		const result = await auth0ApiRequest.call(
			this,
			'GET',
			`/organizations/${organizationId}/members/${encodeURIComponent(userId)}/roles`,
			undefined,
			{ per_page: limit },
		);
		response = (result as IDataObject).roles as IDataObject[] || result as IDataObject[];
	}

	return response.map((item) => ({ json: item }));
}

export async function assignMemberRoles(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const userId = this.getNodeParameter('userId', index) as string;
	const roleIds = this.getNodeParameter('roleIds', index) as string[];

	await auth0ApiRequest.call(
		this,
		'POST',
		`/organizations/${organizationId}/members/${encodeURIComponent(userId)}/roles`,
		{ roles: roleIds },
	);
	return [{ json: { success: true, organizationId, userId, rolesAssigned: roleIds } }];
}

export async function removeMemberRoles(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const userId = this.getNodeParameter('userId', index) as string;
	const roleIds = this.getNodeParameter('roleIds', index) as string[];

	await auth0ApiRequest.call(
		this,
		'DELETE',
		`/organizations/${organizationId}/members/${encodeURIComponent(userId)}/roles`,
		{ roles: roleIds },
	);
	return [{ json: { success: true, organizationId, userId, rolesRemoved: roleIds } }];
}

export async function getOrganizationConnections(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	let response: IDataObject[];

	if (returnAll) {
		response = await auth0ApiRequestAllItems.call(
			this,
			'GET',
			`/organizations/${organizationId}/enabled_connections`,
			undefined,
			undefined,
			'enabled_connections',
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		const result = await auth0ApiRequest.call(
			this,
			'GET',
			`/organizations/${organizationId}/enabled_connections`,
			undefined,
			{ per_page: limit },
		);
		response = (result as IDataObject).enabled_connections as IDataObject[] || result as IDataObject[];
	}

	return response.map((item) => ({ json: item }));
}

export async function addOrganizationConnection(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const connectionId = this.getNodeParameter('connectionId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		connection_id: connectionId,
	};

	if (additionalFields.assignMembershipOnLogin !== undefined) {
		body.assign_membership_on_login = additionalFields.assignMembershipOnLogin;
	}
	if (additionalFields.showAsButton !== undefined) {
		body.show_as_button = additionalFields.showAsButton;
	}

	const response = await auth0ApiRequest.call(
		this,
		'POST',
		`/organizations/${organizationId}/enabled_connections`,
		body,
	);
	return [{ json: response as IDataObject }];
}

export async function removeOrganizationConnection(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const connectionId = this.getNodeParameter('connectionId', index) as string;

	await auth0ApiRequest.call(
		this,
		'DELETE',
		`/organizations/${organizationId}/enabled_connections/${connectionId}`,
	);
	return [{ json: { success: true, organizationId, connectionId } }];
}

export async function getOrganizationInvitations(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	let response: IDataObject[];

	if (returnAll) {
		response = await auth0ApiRequestAllItems.call(
			this,
			'GET',
			`/organizations/${organizationId}/invitations`,
			undefined,
			undefined,
			'invitations',
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		const result = await auth0ApiRequest.call(
			this,
			'GET',
			`/organizations/${organizationId}/invitations`,
			undefined,
			{ per_page: limit },
		);
		response = (result as IDataObject).invitations as IDataObject[] || result as IDataObject[];
	}

	return response.map((item) => ({ json: item }));
}

export async function createOrganizationInvitation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const inviterName = this.getNodeParameter('inviterName', index) as string;
	const inviteeEmail = this.getNodeParameter('inviteeEmail', index) as string;
	const clientId = this.getNodeParameter('clientId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		inviter: {
			name: inviterName,
		},
		invitee: {
			email: inviteeEmail,
		},
		client_id: clientId,
	};

	if (additionalFields.connectionId) {
		body.connection_id = additionalFields.connectionId;
	}
	if (additionalFields.ttlSec) {
		body.ttl_sec = additionalFields.ttlSec;
	}
	if (additionalFields.roles) {
		body.roles = additionalFields.roles;
	}
	if (additionalFields.sendInvitationEmail !== undefined) {
		body.send_invitation_email = additionalFields.sendInvitationEmail;
	}
	if (additionalFields.appMetadata) {
		body.app_metadata = parseJson(additionalFields.appMetadata as string);
	}
	if (additionalFields.userMetadata) {
		body.user_metadata = parseJson(additionalFields.userMetadata as string);
	}

	const response = await auth0ApiRequest.call(
		this,
		'POST',
		`/organizations/${organizationId}/invitations`,
		body,
	);
	return [{ json: response as IDataObject }];
}

export async function deleteOrganizationInvitation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const organizationId = this.getNodeParameter('organizationId', index) as string;
	const invitationId = this.getNodeParameter('invitationId', index) as string;

	await auth0ApiRequest.call(
		this,
		'DELETE',
		`/organizations/${organizationId}/invitations/${invitationId}`,
	);
	return [{ json: { success: true, organizationId, invitationId } }];
}

import type { OrganizationOperation } from '../../utils/types';

export async function executeOrganizationOperation(
	this: IExecuteFunctions,
	operation: OrganizationOperation,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return createOrganization.call(this, index);
		case 'get':
			return getOrganization.call(this, index);
		case 'getAll':
			return getAllOrganizations.call(this, index);
		case 'update':
			return updateOrganization.call(this, index);
		case 'delete':
			return deleteOrganization.call(this, index);
		case 'getMembers':
			return getOrganizationMembers.call(this, index);
		case 'addMembers':
			return addOrganizationMembers.call(this, index);
		case 'removeMembers':
			return removeOrganizationMembers.call(this, index);
		case 'getMemberRoles':
			return getMemberRoles.call(this, index);
		case 'assignMemberRoles':
			return assignMemberRoles.call(this, index);
		case 'removeMemberRoles':
			return removeMemberRoles.call(this, index);
		case 'getConnections':
			return getOrganizationConnections.call(this, index);
		case 'addConnection':
			return addOrganizationConnection.call(this, index);
		case 'removeConnection':
			return removeOrganizationConnection.call(this, index);
		case 'getInvitations':
			return getOrganizationInvitations.call(this, index);
		case 'createInvitation':
			return createOrganizationInvitation.call(this, index);
		case 'deleteInvitation':
			return deleteOrganizationInvitation.call(this, index);
		default:
			throw new Error(`The operation "${operation}" is not supported for Organization resource`);
	}
}
