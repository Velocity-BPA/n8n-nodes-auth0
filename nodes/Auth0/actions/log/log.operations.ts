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
import type { LogOperation } from '../../utils/types';

export async function executeLogOperation(
	this: IExecuteFunctions,
	operation: LogOperation,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'get': {
			const logId = this.getNodeParameter('logId', i) as string;
			responseData = await auth0ApiRequest.call(this, 'GET', `/logs/${encodeURIComponent(logId)}`);
			break;
		}

		case 'getAll': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

			const qs: IDataObject = {};

			if (filters.type && (filters.type as string[]).length > 0) {
				// Build type query for multiple types: type:s OR type:f
				const types = filters.type as string[];
				qs.q = types.map((t) => `type:${t}`).join(' OR ');
			}
			if (filters.from) {
				qs.from = filters.from;
			}
			if (filters.sort) {
				qs.sort = filters.sort;
			}
			if (filters.include_totals !== undefined) {
				qs.include_totals = filters.include_totals;
			}

			if (returnAll) {
				responseData = await auth0ApiRequestAllItems.call(this, 'GET', '/logs', undefined, qs, 'logs');
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				qs.take = limit;
				const result = await auth0ApiRequest.call(this, 'GET', '/logs', undefined, qs) as IDataObject;
				responseData = (result.logs || result) as IDataObject[];
			}
			break;
		}

		case 'search': {
			const query = this.getNodeParameter('query', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const options = this.getNodeParameter('options', i, {}) as IDataObject;

			const qs: IDataObject = {
				q: query,
			};

			if (options.from) {
				qs.from = options.from;
			}
			if (options.sort) {
				qs.sort = options.sort;
			}
			if (options.include_totals !== undefined) {
				qs.include_totals = options.include_totals;
			}

			if (returnAll) {
				responseData = await auth0ApiRequestAllItems.call(this, 'GET', '/logs', undefined, qs, 'logs');
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				qs.take = limit;
				const result = await auth0ApiRequest.call(this, 'GET', '/logs', undefined, qs) as IDataObject;
				responseData = (result.logs || result) as IDataObject[];
			}
			break;
		}
	}

	return Array.isArray(responseData)
		? responseData.map((data) => ({ json: data }))
		: [{ json: responseData }];
}
