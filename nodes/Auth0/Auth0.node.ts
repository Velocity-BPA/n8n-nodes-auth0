/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

// User resource
import { userOperations, userFields } from './actions/user';
import { executeUserOperation } from './actions/user/user.operations';
import type { UserOperation } from './utils/types';

// Organization resource
import { organizationOperations, organizationFields } from './actions/organization';
import { executeOrganizationOperation } from './actions/organization/organization.operations';
import type { OrganizationOperation } from './utils/types';

// Connection resource
import { connectionOperations, connectionFields } from './actions/connection';
import { executeConnectionOperation } from './actions/connection/connection.operations';
import type { ConnectionOperation } from './utils/types';

// Application resource
import { applicationOperations, applicationFields } from './actions/application';
import { executeApplicationOperation } from './actions/application/application.operations';
import type { ApplicationOperation } from './utils/types';

// Role resource
import { roleOperations, roleFields } from './actions/role';
import { executeRoleOperation } from './actions/role/role.operations';
import type { RoleOperation } from './utils/types';

// Resource Server resource
import { resourceServerOperations, resourceServerFields } from './actions/resourceServer';
import { executeResourceServerOperation } from './actions/resourceServer/resourceServer.operations';
import type { ResourceServerOperation } from './utils/types';

// Log resource
import { logOperations, logFields } from './actions/log';
import { executeLogOperation } from './actions/log/log.operations';
import type { LogOperation } from './utils/types';

// Action resource
import { actionOperations, actionFields } from './actions/action';
import { executeActionOperation } from './actions/action/action.operations';
import type { ActionOperation } from './utils/types';

// Log licensing notice once on module load
const LICENSING_NOTICE = `
[Velocity BPA Licensing Notice]
This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;

let licensingNoticeLogged = false;

export class Auth0 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Auth0',
		name: 'auth0',
		icon: 'file:auth0.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Auth0 Management API',
		defaults: {
			name: 'Auth0',
		},
		inputs: ['main'] as const,
		outputs: ['main'] as const,
		credentials: [
			{
				name: 'auth0ManagementApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Action',
						value: 'action',
					},
					{
						name: 'Application',
						value: 'application',
					},
					{
						name: 'Connection',
						value: 'connection',
					},
					{
						name: 'Log',
						value: 'log',
					},
					{
						name: 'Organization',
						value: 'organization',
					},
					{
						name: 'Resource Server (API)',
						value: 'resourceServer',
					},
					{
						name: 'Role',
						value: 'role',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			},
			// User
			...userOperations,
			...userFields,
			// Organization
			...organizationOperations,
			...organizationFields,
			// Connection
			...connectionOperations,
			...connectionFields,
			// Application
			...applicationOperations,
			...applicationFields,
			// Role
			...roleOperations,
			...roleFields,
			// Resource Server
			...resourceServerOperations,
			...resourceServerFields,
			// Log
			...logOperations,
			...logFields,
			// Action
			...actionOperations,
			...actionFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log licensing notice once per node load
		if (!licensingNoticeLogged) {
			console.warn(LICENSING_NOTICE);
			licensingNoticeLogged = true;
		}

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[] = [];

				switch (resource) {
					case 'user':
						result = await executeUserOperation.call(this, operation as UserOperation, i);
						break;
					case 'organization':
						result = await executeOrganizationOperation.call(this, operation as OrganizationOperation, i);
						break;
					case 'connection':
						result = await executeConnectionOperation.call(this, operation as ConnectionOperation, i);
						break;
					case 'application':
						result = await executeApplicationOperation.call(this, operation as ApplicationOperation, i);
						break;
					case 'role':
						result = await executeRoleOperation.call(this, operation as RoleOperation, i);
						break;
					case 'resourceServer':
						result = await executeResourceServerOperation.call(this, operation as ResourceServerOperation, i);
						break;
					case 'log':
						result = await executeLogOperation.call(this, operation as LogOperation, i);
						break;
					case 'action':
						result = await executeActionOperation.call(this, operation as ActionOperation, i);
						break;
					default:
						throw new Error(`The resource "${resource}" is not supported`);
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
