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
import type { ResourceServerOperation } from '../../utils/types';
import { parseJsonParameter } from '../../utils/helpers';

export async function executeResourceServerOperation(
	this: IExecuteFunctions,
	operation: ResourceServerOperation,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'create': {
			const name = this.getNodeParameter('name', i) as string;
			const identifier = this.getNodeParameter('identifier', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			const body: IDataObject = {
				name,
				identifier,
			};

			if (additionalFields.signing_alg) {
				body.signing_alg = additionalFields.signing_alg;
			}
			if (additionalFields.token_lifetime) {
				body.token_lifetime = additionalFields.token_lifetime;
			}
			if (additionalFields.token_lifetime_for_web) {
				body.token_lifetime_for_web = additionalFields.token_lifetime_for_web;
			}
			if (additionalFields.allow_offline_access !== undefined) {
				body.allow_offline_access = additionalFields.allow_offline_access;
			}
			if (additionalFields.enforce_policies !== undefined) {
				body.enforce_policies = additionalFields.enforce_policies;
			}
			if (additionalFields.token_dialect) {
				body.token_dialect = additionalFields.token_dialect;
			}
			if (additionalFields.skip_consent_for_verifiable_first_party_clients !== undefined) {
				body.skip_consent_for_verifiable_first_party_clients = additionalFields.skip_consent_for_verifiable_first_party_clients;
			}
			if (additionalFields.scopes) {
				body.scopes = parseJsonParameter(additionalFields.scopes as string, 'scopes');
			}

			responseData = await auth0ApiRequest.call(this, 'POST', '/resource-servers', body);
			break;
		}

		case 'get': {
			const resourceServerId = this.getNodeParameter('resourceServerId', i) as string;
			responseData = await auth0ApiRequest.call(this, 'GET', `/resource-servers/${encodeURIComponent(resourceServerId)}`);
			break;
		}

		case 'getAll': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const options = this.getNodeParameter('options', i, {}) as IDataObject;

			const qs: IDataObject = {};
			if (options.is_system !== undefined) {
				qs.is_system = options.is_system;
			}

			if (returnAll) {
				responseData = await auth0ApiRequestAllItems.call(this, 'GET', '/resource-servers', undefined, qs);
			} else {
				const limit = this.getNodeParameter('limit', i) as number;
				qs.per_page = limit;
				qs.page = 0;
				const result = await auth0ApiRequest.call(this, 'GET', '/resource-servers', undefined, qs);
				responseData = (Array.isArray(result) ? result : result.resource_servers || [result]) as IDataObject[];
			}
			break;
		}

		case 'update': {
			const resourceServerId = this.getNodeParameter('resourceServerId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

			const body: IDataObject = {};

			if (updateFields.name) {
				body.name = updateFields.name;
			}
			if (updateFields.signing_alg) {
				body.signing_alg = updateFields.signing_alg;
			}
			if (updateFields.token_lifetime) {
				body.token_lifetime = updateFields.token_lifetime;
			}
			if (updateFields.token_lifetime_for_web) {
				body.token_lifetime_for_web = updateFields.token_lifetime_for_web;
			}
			if (updateFields.allow_offline_access !== undefined) {
				body.allow_offline_access = updateFields.allow_offline_access;
			}
			if (updateFields.enforce_policies !== undefined) {
				body.enforce_policies = updateFields.enforce_policies;
			}
			if (updateFields.token_dialect) {
				body.token_dialect = updateFields.token_dialect;
			}
			if (updateFields.skip_consent_for_verifiable_first_party_clients !== undefined) {
				body.skip_consent_for_verifiable_first_party_clients = updateFields.skip_consent_for_verifiable_first_party_clients;
			}
			if (updateFields.scopes) {
				body.scopes = parseJsonParameter(updateFields.scopes as string, 'scopes');
			}

			responseData = await auth0ApiRequest.call(this, 'PATCH', `/resource-servers/${encodeURIComponent(resourceServerId)}`, body);
			break;
		}

		case 'delete': {
			const resourceServerId = this.getNodeParameter('resourceServerId', i) as string;
			await auth0ApiRequest.call(this, 'DELETE', `/resource-servers/${encodeURIComponent(resourceServerId)}`);
			responseData = { success: true, resourceServerId };
			break;
		}
	}

	return Array.isArray(responseData)
		? responseData.map((data) => ({ json: data }))
		: [{ json: responseData }];
}
