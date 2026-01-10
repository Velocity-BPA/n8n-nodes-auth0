/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { auth0ApiRequest, auth0ApiRequestAllItems } from '../../transport';
import { encodeUserId, removeEmptyFields, parseJson } from '../../utils/helpers';

export async function createUser(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const connection = this.getNodeParameter('connection', index) as string;
	const email = this.getNodeParameter('email', index) as string;
	const password = this.getNodeParameter('password', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		connection,
		email,
		password,
	};

	if (additionalFields.emailVerified !== undefined) {
		body.email_verified = additionalFields.emailVerified;
	}
	if (additionalFields.verifyEmail !== undefined) {
		body.verify_email = additionalFields.verifyEmail;
	}
	if (additionalFields.username) {
		body.username = additionalFields.username;
	}
	if (additionalFields.phoneNumber) {
		body.phone_number = additionalFields.phoneNumber;
	}
	if (additionalFields.phoneVerified !== undefined) {
		body.phone_verified = additionalFields.phoneVerified;
	}
	if (additionalFields.name) {
		body.name = additionalFields.name;
	}
	if (additionalFields.nickname) {
		body.nickname = additionalFields.nickname;
	}
	if (additionalFields.givenName) {
		body.given_name = additionalFields.givenName;
	}
	if (additionalFields.familyName) {
		body.family_name = additionalFields.familyName;
	}
	if (additionalFields.picture) {
		body.picture = additionalFields.picture;
	}
	if (additionalFields.userMetadata) {
		body.user_metadata = parseJson(additionalFields.userMetadata as string);
	}
	if (additionalFields.appMetadata) {
		body.app_metadata = parseJson(additionalFields.appMetadata as string);
	}
	if (additionalFields.blocked !== undefined) {
		body.blocked = additionalFields.blocked;
	}

	const response = await auth0ApiRequest.call(this, 'POST', '/users', body);
	return [{ json: response as IDataObject }];
}

export async function getUser(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const query: IDataObject = {};
	if (options.fields) {
		query.fields = (options.fields as string[]).join(',');
	}
	if (options.includeFields !== undefined) {
		query.include_fields = options.includeFields;
	}

	const response = await auth0ApiRequest.call(
		this,
		'GET',
		`/users/${encodeUserId(userId)}`,
		undefined,
		query,
	);
	return [{ json: response as IDataObject }];
}

export async function getUserByEmail(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const email = this.getNodeParameter('email', index) as string;

	const query: IDataObject = {
		email,
	};

	const response = await auth0ApiRequest.call(this, 'GET', '/users-by-email', undefined, query);
	return Array.isArray(response)
		? response.map((item) => ({ json: item }))
		: [{ json: response as IDataObject }];
}

export async function getAllUsers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const query: IDataObject = {};

	if (options.searchQuery) {
		query.q = options.searchQuery;
	}
	if (options.connection) {
		query.connection = options.connection;
	}
	if (options.fields) {
		query.fields = (options.fields as string[]).join(',');
	}
	if (options.includeFields !== undefined) {
		query.include_fields = options.includeFields;
	}
	if (options.sort) {
		query.sort = options.sort;
	}

	let response: IDataObject[];

	if (returnAll) {
		response = await auth0ApiRequestAllItems.call(this, 'GET', '/users', undefined, query, 'users');
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		query.per_page = limit;
		query.page = 0;
		const result = await auth0ApiRequest.call(this, 'GET', '/users', undefined, query);
		response = (result as IDataObject).users as IDataObject[] || result as IDataObject[];
	}

	return response.map((item) => ({ json: item }));
}

export async function updateUser(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.email) {
		body.email = updateFields.email;
	}
	if (updateFields.emailVerified !== undefined) {
		body.email_verified = updateFields.emailVerified;
	}
	if (updateFields.verifyEmail !== undefined) {
		body.verify_email = updateFields.verifyEmail;
	}
	if (updateFields.password) {
		body.password = updateFields.password;
	}
	if (updateFields.connection) {
		body.connection = updateFields.connection;
	}
	if (updateFields.username) {
		body.username = updateFields.username;
	}
	if (updateFields.phoneNumber) {
		body.phone_number = updateFields.phoneNumber;
	}
	if (updateFields.phoneVerified !== undefined) {
		body.phone_verified = updateFields.phoneVerified;
	}
	if (updateFields.name) {
		body.name = updateFields.name;
	}
	if (updateFields.nickname) {
		body.nickname = updateFields.nickname;
	}
	if (updateFields.givenName) {
		body.given_name = updateFields.givenName;
	}
	if (updateFields.familyName) {
		body.family_name = updateFields.familyName;
	}
	if (updateFields.picture) {
		body.picture = updateFields.picture;
	}
	if (updateFields.userMetadata) {
		body.user_metadata = parseJson(updateFields.userMetadata as string);
	}
	if (updateFields.appMetadata) {
		body.app_metadata = parseJson(updateFields.appMetadata as string);
	}
	if (updateFields.blocked !== undefined) {
		body.blocked = updateFields.blocked;
	}

	const response = await auth0ApiRequest.call(
		this,
		'PATCH',
		`/users/${encodeUserId(userId)}`,
		removeEmptyFields(body),
	);
	return [{ json: response as IDataObject }];
}

export async function deleteUser(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;

	await auth0ApiRequest.call(this, 'DELETE', `/users/${encodeUserId(userId)}`);
	return [{ json: { success: true, userId } }];
}

export async function blockUser(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;

	const response = await auth0ApiRequest.call(
		this,
		'PATCH',
		`/users/${encodeUserId(userId)}`,
		{ blocked: true },
	);
	return [{ json: response as IDataObject }];
}

export async function unblockUser(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;

	const response = await auth0ApiRequest.call(
		this,
		'PATCH',
		`/users/${encodeUserId(userId)}`,
		{ blocked: false },
	);
	return [{ json: response as IDataObject }];
}

export async function getUserRoles(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	let response: IDataObject[];

	if (returnAll) {
		response = await auth0ApiRequestAllItems.call(
			this,
			'GET',
			`/users/${encodeUserId(userId)}/roles`,
			undefined,
			undefined,
			'roles',
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		const result = await auth0ApiRequest.call(
			this,
			'GET',
			`/users/${encodeUserId(userId)}/roles`,
			undefined,
			{ per_page: limit },
		);
		response = (result as IDataObject).roles as IDataObject[] || result as IDataObject[];
	}

	return response.map((item) => ({ json: item }));
}

export async function assignUserRoles(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const roleIds = this.getNodeParameter('roleIds', index) as string[];

	await auth0ApiRequest.call(this, 'POST', `/users/${encodeUserId(userId)}/roles`, {
		roles: roleIds,
	});
	return [{ json: { success: true, userId, rolesAssigned: roleIds } }];
}

export async function removeUserRoles(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const roleIds = this.getNodeParameter('roleIds', index) as string[];

	await auth0ApiRequest.call(this, 'DELETE', `/users/${encodeUserId(userId)}/roles`, {
		roles: roleIds,
	});
	return [{ json: { success: true, userId, rolesRemoved: roleIds } }];
}

export async function getUserPermissions(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	let response: IDataObject[];

	if (returnAll) {
		response = await auth0ApiRequestAllItems.call(
			this,
			'GET',
			`/users/${encodeUserId(userId)}/permissions`,
			undefined,
			undefined,
			'permissions',
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		const result = await auth0ApiRequest.call(
			this,
			'GET',
			`/users/${encodeUserId(userId)}/permissions`,
			undefined,
			{ per_page: limit },
		);
		response = (result as IDataObject).permissions as IDataObject[] || result as IDataObject[];
	}

	return response.map((item) => ({ json: item }));
}

export async function assignUserPermissions(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const permissions = this.getNodeParameter('permissions', index) as IDataObject[];

	await auth0ApiRequest.call(this, 'POST', `/users/${encodeUserId(userId)}/permissions`, {
		permissions,
	});
	return [{ json: { success: true, userId, permissionsAssigned: permissions } }];
}

export async function removeUserPermissions(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const permissions = this.getNodeParameter('permissions', index) as IDataObject[];

	await auth0ApiRequest.call(this, 'DELETE', `/users/${encodeUserId(userId)}/permissions`, {
		permissions,
	});
	return [{ json: { success: true, userId, permissionsRemoved: permissions } }];
}

export async function getUserLogs(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;

	let response: IDataObject[];

	if (returnAll) {
		response = await auth0ApiRequestAllItems.call(
			this,
			'GET',
			`/users/${encodeUserId(userId)}/logs`,
			undefined,
			undefined,
			'logs',
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		const result = await auth0ApiRequest.call(
			this,
			'GET',
			`/users/${encodeUserId(userId)}/logs`,
			undefined,
			{ per_page: limit },
		);
		response = Array.isArray(result) ? result as IDataObject[] : [result as IDataObject];
	}

	return response.map((item) => ({ json: item }));
}

export async function getUserEnrollments(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;

	const response = await auth0ApiRequest.call(
		this,
		'GET',
		`/users/${encodeUserId(userId)}/enrollments`,
	);
	return Array.isArray(response)
		? response.map((item) => ({ json: item }))
		: [{ json: response as IDataObject }];
}

export async function deleteUserEnrollment(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const enrollmentId = this.getNodeParameter('enrollmentId', index) as string;

	await auth0ApiRequest.call(
		this,
		'DELETE',
		`/users/${encodeUserId(userId)}/enrollments/${enrollmentId}`,
	);
	return [{ json: { success: true, userId, enrollmentId } }];
}

export async function invalidateUserBrowsers(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;

	await auth0ApiRequest.call(
		this,
		'POST',
		`/users/${encodeUserId(userId)}/multifactor/actions/invalidate-remember-browser`,
	);
	return [{ json: { success: true, userId } }];
}

export async function linkUserAccounts(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const linkWith = this.getNodeParameter('linkWith', index) as IDataObject;

	const body: IDataObject = {};

	if (linkWith.provider) {
		body.provider = linkWith.provider;
	}
	if (linkWith.connectionId) {
		body.connection_id = linkWith.connectionId;
	}
	if (linkWith.linkWithUserId) {
		body.user_id = linkWith.linkWithUserId;
	}

	const response = await auth0ApiRequest.call(
		this,
		'POST',
		`/users/${encodeUserId(userId)}/identities`,
		body,
	);
	return [{ json: response as IDataObject }];
}

export async function unlinkUserAccounts(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', index) as string;
	const provider = this.getNodeParameter('provider', index) as string;
	const linkedUserId = this.getNodeParameter('linkedUserId', index) as string;

	const response = await auth0ApiRequest.call(
		this,
		'DELETE',
		`/users/${encodeUserId(userId)}/identities/${provider}/${linkedUserId}`,
	);
	return [{ json: response as IDataObject }];
}

import type { UserOperation } from '../../utils/types';

export async function executeUserOperation(
	this: IExecuteFunctions,
	operation: UserOperation,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return createUser.call(this, index);
		case 'get':
			return getUser.call(this, index);
		case 'getByEmail':
			return getUserByEmail.call(this, index);
		case 'getAll':
			return getAllUsers.call(this, index);
		case 'update':
			return updateUser.call(this, index);
		case 'delete':
			return deleteUser.call(this, index);
		case 'block':
			return blockUser.call(this, index);
		case 'unblock':
			return unblockUser.call(this, index);
		case 'getRoles':
			return getUserRoles.call(this, index);
		case 'assignRoles':
			return assignUserRoles.call(this, index);
		case 'removeRoles':
			return removeUserRoles.call(this, index);
		case 'getPermissions':
			return getUserPermissions.call(this, index);
		case 'assignPermissions':
			return assignUserPermissions.call(this, index);
		case 'removePermissions':
			return removeUserPermissions.call(this, index);
		case 'getLogs':
			return getUserLogs.call(this, index);
		case 'getEnrollments':
			return getUserEnrollments.call(this, index);
		case 'deleteEnrollment':
			return deleteUserEnrollment.call(this, index);
		case 'invalidateBrowsers':
			return invalidateUserBrowsers.call(this, index);
		case 'linkAccounts':
			return linkUserAccounts.call(this, index);
		case 'unlinkAccounts':
			return unlinkUserAccounts.call(this, index);
		default:
			throw new Error(`The operation "${operation}" is not supported for User resource`);
	}
}
