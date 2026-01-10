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
import type { ActionOperation } from '../../utils/types';
import { parseJsonParameter } from '../../utils/helpers';

export async function executeActionOperation(
	this: IExecuteFunctions,
	operation: ActionOperation,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'create': {
			const name = this.getNodeParameter('name', i) as string;
			const trigger = this.getNodeParameter('trigger', i) as string;
			const code = this.getNodeParameter('code', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			const body: IDataObject = {
				name,
				supported_triggers: [
					{
						id: trigger,
						version: 'v2',
					},
				],
				code,
			};

			if (additionalFields.runtime) {
				body.runtime = additionalFields.runtime;
			}
			if (additionalFields.dependencies) {
				body.dependencies = parseJsonParameter(additionalFields.dependencies as string, 'dependencies');
			}
			if (additionalFields.secrets) {
				body.secrets = parseJsonParameter(additionalFields.secrets as string, 'secrets');
			}

			responseData = await auth0ApiRequest.call(this, 'POST', '/actions/actions', body);
			break;
		}

		case 'get': {
			const actionId = this.getNodeParameter('actionId', i) as string;
			responseData = await auth0ApiRequest.call(this, 'GET', `/actions/actions/${encodeURIComponent(actionId)}`);
			break;
		}

		case 'getAll': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

			const qs: IDataObject = {};

			if (filters.triggerId) {
				qs.triggerId = filters.triggerId;
			}
			if (filters.deployed !== undefined) {
				qs.deployed = filters.deployed;
			}
			if (filters.installed !== undefined) {
				qs.installed = filters.installed;
			}

			if (returnAll) {
				responseData = await auth0ApiRequestAllItems.call(this, 'GET', '/actions/actions', undefined, qs, 'actions');
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				qs.per_page = limit;
				qs.page = 0;
				const result = await auth0ApiRequest.call(this, 'GET', '/actions/actions', undefined, qs) as IDataObject;
				responseData = (result.actions || result) as IDataObject[];
			}
			break;
		}

		case 'update': {
			const actionId = this.getNodeParameter('actionId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

			const body: IDataObject = {};

			if (updateFields.name) {
				body.name = updateFields.name;
			}
			if (updateFields.code) {
				body.code = updateFields.code;
			}
			if (updateFields.runtime) {
				body.runtime = updateFields.runtime;
			}
			if (updateFields.dependencies) {
				body.dependencies = parseJsonParameter(updateFields.dependencies as string, 'dependencies');
			}
			if (updateFields.secrets) {
				body.secrets = parseJsonParameter(updateFields.secrets as string, 'secrets');
			}

			responseData = await auth0ApiRequest.call(this, 'PATCH', `/actions/actions/${encodeURIComponent(actionId)}`, body);
			break;
		}

		case 'delete': {
			const actionId = this.getNodeParameter('actionId', i) as string;
			await auth0ApiRequest.call(this, 'DELETE', `/actions/actions/${encodeURIComponent(actionId)}`);
			responseData = { success: true, actionId };
			break;
		}

		case 'deploy': {
			const actionId = this.getNodeParameter('actionId', i) as string;
			responseData = await auth0ApiRequest.call(this, 'POST', `/actions/actions/${encodeURIComponent(actionId)}/deploy`);
			break;
		}

		case 'getTriggers': {
			const result = await auth0ApiRequest.call(this, 'GET', '/actions/triggers') as IDataObject;
			responseData = (result.triggers || result) as IDataObject[];
			break;
		}

		case 'getTriggerBindings': {
			const triggerId = this.getNodeParameter('triggerId', i) as string;
			const result = await auth0ApiRequest.call(this, 'GET', `/actions/triggers/${encodeURIComponent(triggerId)}/bindings`) as IDataObject;
			responseData = (result.bindings || result) as IDataObject[];
			break;
		}

		case 'updateTriggerBindings': {
			const triggerId = this.getNodeParameter('triggerId', i) as string;
			const bindings = this.getNodeParameter('bindings', i) as string;

			const body: IDataObject = {
				bindings: parseJsonParameter(bindings, 'bindings'),
			};

			responseData = await auth0ApiRequest.call(this, 'PATCH', `/actions/triggers/${encodeURIComponent(triggerId)}/bindings`, body);
			break;
		}
	}

	return Array.isArray(responseData)
		? responseData.map((data) => ({ json: data }))
		: [{ json: responseData }];
}
