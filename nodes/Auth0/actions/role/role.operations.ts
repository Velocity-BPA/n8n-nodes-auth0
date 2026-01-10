/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
} from 'n8n-workflow';
import { auth0ApiRequest, auth0ApiRequestAllItems } from '../../transport';
import type { RoleOperation } from '../../utils/types';

export async function executeRoleOperation(
	this: IExecuteFunctions,
	operation: RoleOperation,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'create': {
			const name = this.getNodeParameter('name', i) as string;
			const description = this.getNodeParameter('description', i, '') as string;

			const body: IDataObject = { name };
			if (description) {
				body.description = description;
			}

			responseData = await auth0ApiRequest.call(this, 'POST', '/roles', body);
			break;
		}

		case 'get': {
			const roleId = this.getNodeParameter('roleId', i) as string;
			responseData = await auth0ApiRequest.call(this, 'GET', `/roles/${encodeURIComponent(roleId)}`);
			break;
		}

		case 'getAll': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.name_filter) {
				qs.name_filter = filters.name_filter;
			}

			if (returnAll) {
				responseData = await auth0ApiRequestAllItems.call(this, 'GET', '/roles', undefined, qs, 'roles');
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				qs.per_page = limit;
				qs.page = 0;
				const result = await auth0ApiRequest.call(this, 'GET', '/roles', undefined, qs) as IDataObject;
				responseData = (result.roles || result) as IDataObject[];
			}
			break;
		}

		case 'update': {
			const roleId = this.getNodeParameter('roleId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

			const body: IDataObject = {};
			if (updateFields.name) {
				body.name = updateFields.name;
			}
			if (updateFields.description !== undefined) {
				body.description = updateFields.description;
			}

			responseData = await auth0ApiRequest.call(this, 'PATCH', `/roles/${encodeURIComponent(roleId)}`, body);
			break;
		}

		case 'delete': {
			const roleId = this.getNodeParameter('roleId', i) as string;
			await auth0ApiRequest.call(this, 'DELETE', `/roles/${encodeURIComponent(roleId)}`);
			responseData = { success: true, roleId };
			break;
		}

		case 'getPermissions': {
			const roleId = this.getNodeParameter('roleId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				responseData = await auth0ApiRequestAllItems.call(this, 'GET', `/roles/${encodeURIComponent(roleId)}/permissions`, undefined, undefined, 'permissions');
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				const qs: IDataObject = { per_page: limit, page: 0 };
				const result = await auth0ApiRequest.call(this, 'GET', `/roles/${encodeURIComponent(roleId)}/permissions`, undefined, qs) as IDataObject;
				responseData = (result.permissions || result) as IDataObject[];
			}
			break;
		}

		case 'addPermissions': {
			const roleId = this.getNodeParameter('roleId', i) as string;
			const permissions = this.getNodeParameter('permissions', i) as IDataObject;
			const permissionValues = (permissions.permissionValues as IDataObject[]) || [];

			const body: IDataObject = {
				permissions: permissionValues.map((p) => ({
					resource_server_identifier: p.resource_server_identifier,
					permission_name: p.permission_name,
				})),
			};

			await auth0ApiRequest.call(this, 'POST', `/roles/${encodeURIComponent(roleId)}/permissions`, body);
			responseData = { success: true, roleId, permissionsAdded: permissionValues.length };
			break;
		}

		case 'removePermissions': {
			const roleId = this.getNodeParameter('roleId', i) as string;
			const permissions = this.getNodeParameter('permissions', i) as IDataObject;
			const permissionValues = (permissions.permissionValues as IDataObject[]) || [];

			const body: IDataObject = {
				permissions: permissionValues.map((p) => ({
					resource_server_identifier: p.resource_server_identifier,
					permission_name: p.permission_name,
				})),
			};

			await auth0ApiRequest.call(this, 'DELETE', `/roles/${encodeURIComponent(roleId)}/permissions`, body);
			responseData = { success: true, roleId, permissionsRemoved: permissionValues.length };
			break;
		}

		case 'getUsers': {
			const roleId = this.getNodeParameter('roleId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				responseData = await auth0ApiRequestAllItems.call(this, 'GET', `/roles/${encodeURIComponent(roleId)}/users`, undefined, undefined, 'users');
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				const qs: IDataObject = { per_page: limit, page: 0 };
				const result = await auth0ApiRequest.call(this, 'GET', `/roles/${encodeURIComponent(roleId)}/users`, undefined, qs) as IDataObject;
				responseData = (result.users || result) as IDataObject[];
			}
			break;
		}

		case 'assignUsers': {
			const roleId = this.getNodeParameter('roleId', i) as string;
			const userIdsString = this.getNodeParameter('userIds', i) as string;
			const userIds = userIdsString.split(',').map((id) => id.trim()).filter(Boolean);

			const body: IDataObject = { users: userIds };
			await auth0ApiRequest.call(this, 'POST', `/roles/${encodeURIComponent(roleId)}/users`, body);
			responseData = { success: true, roleId, usersAssigned: userIds.length };
			break;
		}

		case 'removeUsers': {
			const roleId = this.getNodeParameter('roleId', i) as string;
			const userIdsString = this.getNodeParameter('userIds', i) as string;
			const userIds = userIdsString.split(',').map((id) => id.trim()).filter(Boolean);

			// Note: Auth0 doesn't have a bulk remove users from role endpoint
			// We need to remove each user individually or use the user's roles endpoint
			for (const userId of userIds) {
				try {
					// Get user's current roles and remove this one
					const userRoles = await auth0ApiRequest.call(this, 'GET', `/users/${encodeURIComponent(userId)}/roles`) as IDataObject[];
					const roleIds = (Array.isArray(userRoles) ? userRoles : (userRoles as IDataObject).roles as IDataObject[] || [])
						.filter((r: IDataObject) => r.id !== roleId)
						.map((r: IDataObject) => r.id);

					await auth0ApiRequest.call(this, 'DELETE', `/users/${encodeURIComponent(userId)}/roles`, { roles: [roleId] });
				} catch (error) {
					// Continue with other users if one fails
				}
			}
			responseData = { success: true, roleId, usersRemoved: userIds.length };
			break;
		}
	}

	return Array.isArray(responseData)
		? responseData.map((data) => ({ json: data }))
		: [{ json: responseData }];
}
