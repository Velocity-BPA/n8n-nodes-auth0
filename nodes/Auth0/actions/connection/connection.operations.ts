/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { auth0ApiRequest, auth0ApiRequestAllItems } from '../../transport';
import { removeEmptyFields, parseJson } from '../../utils/helpers';

export async function createConnection(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const strategy = this.getNodeParameter('strategy', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		name,
		strategy,
	};

	if (additionalFields.enabledClients) {
		body.enabled_clients = additionalFields.enabledClients;
	}
	if (additionalFields.options) {
		body.options = parseJson(additionalFields.options as string);
	}
	if (additionalFields.realms) {
		body.realms = additionalFields.realms;
	}
	if (additionalFields.metadata) {
		body.metadata = parseJson(additionalFields.metadata as string);
	}
	if (additionalFields.isDomainConnection !== undefined) {
		body.is_domain_connection = additionalFields.isDomainConnection;
	}

	const response = await auth0ApiRequest.call(this, 'POST', '/connections', body);
	return [{ json: response as IDataObject }];
}

export async function getConnection(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const connectionId = this.getNodeParameter('connectionId', index) as string;
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
		`/connections/${connectionId}`,
		undefined,
		query,
	);
	return [{ json: response as IDataObject }];
}

export async function getAllConnections(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const query: IDataObject = {};

	if (options.strategy) {
		query.strategy = options.strategy;
	}
	if (options.name) {
		query.name = options.name;
	}
	if (options.fields) {
		query.fields = (options.fields as string[]).join(',');
	}
	if (options.includeFields !== undefined) {
		query.include_fields = options.includeFields;
	}

	let response: IDataObject[];

	if (returnAll) {
		response = await auth0ApiRequestAllItems.call(
			this,
			'GET',
			'/connections',
			undefined,
			query,
			'connections',
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		query.per_page = limit;
		const result = await auth0ApiRequest.call(this, 'GET', '/connections', undefined, query);
		response = Array.isArray(result) ? result as IDataObject[] : [result as IDataObject];
	}

	return response.map((item) => ({ json: item }));
}

export async function updateConnection(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const connectionId = this.getNodeParameter('connectionId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.displayName) {
		body.display_name = updateFields.displayName;
	}
	if (updateFields.enabledClients) {
		body.enabled_clients = updateFields.enabledClients;
	}
	if (updateFields.options) {
		body.options = parseJson(updateFields.options as string);
	}
	if (updateFields.realms) {
		body.realms = updateFields.realms;
	}
	if (updateFields.metadata) {
		body.metadata = parseJson(updateFields.metadata as string);
	}
	if (updateFields.isDomainConnection !== undefined) {
		body.is_domain_connection = updateFields.isDomainConnection;
	}

	const response = await auth0ApiRequest.call(
		this,
		'PATCH',
		`/connections/${connectionId}`,
		removeEmptyFields(body),
	);
	return [{ json: response as IDataObject }];
}

export async function deleteConnection(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const connectionId = this.getNodeParameter('connectionId', index) as string;

	await auth0ApiRequest.call(this, 'DELETE', `/connections/${connectionId}`);
	return [{ json: { success: true, connectionId } }];
}

export async function getConnectionStatus(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const connectionId = this.getNodeParameter('connectionId', index) as string;

	const response = await auth0ApiRequest.call(this, 'GET', `/connections/${connectionId}/status`);
	return [{ json: response as IDataObject }];
}

import type { ConnectionOperation } from '../../utils/types';

export async function executeConnectionOperation(
	this: IExecuteFunctions,
	operation: ConnectionOperation,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return createConnection.call(this, index);
		case 'get':
			return getConnection.call(this, index);
		case 'getAll':
			return getAllConnections.call(this, index);
		case 'update':
			return updateConnection.call(this, index);
		case 'delete':
			return deleteConnection.call(this, index);
		case 'getStatus':
			return getConnectionStatus.call(this, index);
		default:
			throw new Error(`The operation "${operation}" is not supported for Connection resource`);
	}
}
