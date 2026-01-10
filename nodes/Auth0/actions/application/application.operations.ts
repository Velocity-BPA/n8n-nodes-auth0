/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { auth0ApiRequest, auth0ApiRequestAllItems } from '../../transport';
import { removeEmptyFields, parseJson } from '../../utils/helpers';

export async function createApplication(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const name = this.getNodeParameter('name', index) as string;
	const appType = this.getNodeParameter('appType', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		name,
		app_type: appType,
	};

	if (additionalFields.description) {
		body.description = additionalFields.description;
	}
	if (additionalFields.logoUri) {
		body.logo_uri = additionalFields.logoUri;
	}
	if (additionalFields.callbacks) {
		body.callbacks = additionalFields.callbacks;
	}
	if (additionalFields.allowedLogoutUrls) {
		body.allowed_logout_urls = additionalFields.allowedLogoutUrls;
	}
	if (additionalFields.allowedOrigins) {
		body.allowed_origins = additionalFields.allowedOrigins;
	}
	if (additionalFields.webOrigins) {
		body.web_origins = additionalFields.webOrigins;
	}
	if (additionalFields.grantTypes) {
		body.grant_types = additionalFields.grantTypes;
	}
	if (additionalFields.tokenEndpointAuthMethod) {
		body.token_endpoint_auth_method = additionalFields.tokenEndpointAuthMethod;
	}
	if (additionalFields.clientMetadata) {
		body.client_metadata = parseJson(additionalFields.clientMetadata as string);
	}
	if (additionalFields.initiateLoginUri) {
		body.initiate_login_uri = additionalFields.initiateLoginUri;
	}
	if (additionalFields.oidcConformant !== undefined) {
		body.oidc_conformant = additionalFields.oidcConformant;
	}

	const response = await auth0ApiRequest.call(this, 'POST', '/clients', body);
	return [{ json: response as IDataObject }];
}

export async function getApplication(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clientId = this.getNodeParameter('clientId', index) as string;
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
		`/clients/${clientId}`,
		undefined,
		query,
	);
	return [{ json: response as IDataObject }];
}

export async function getAllApplications(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const options = this.getNodeParameter('options', index) as IDataObject;

	const query: IDataObject = {};

	if (options.appType) {
		query.app_type = options.appType;
	}
	if (options.isFirstParty !== undefined) {
		query.is_first_party = options.isFirstParty;
	}
	if (options.isGlobal !== undefined) {
		query.is_global = options.isGlobal;
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
			'/clients',
			undefined,
			query,
			'clients',
		);
	} else {
		const limit = this.getNodeParameter('limit', index) as number;
		query.per_page = limit;
		const result = await auth0ApiRequest.call(this, 'GET', '/clients', undefined, query);
		response = (result as IDataObject).clients as IDataObject[] || result as IDataObject[];
	}

	return response.map((item) => ({ json: item }));
}

export async function updateApplication(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clientId = this.getNodeParameter('clientId', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

	const body: IDataObject = {};

	if (updateFields.name) {
		body.name = updateFields.name;
	}
	if (updateFields.description) {
		body.description = updateFields.description;
	}
	if (updateFields.logoUri) {
		body.logo_uri = updateFields.logoUri;
	}
	if (updateFields.callbacks) {
		body.callbacks = updateFields.callbacks;
	}
	if (updateFields.allowedLogoutUrls) {
		body.allowed_logout_urls = updateFields.allowedLogoutUrls;
	}
	if (updateFields.allowedOrigins) {
		body.allowed_origins = updateFields.allowedOrigins;
	}
	if (updateFields.webOrigins) {
		body.web_origins = updateFields.webOrigins;
	}
	if (updateFields.grantTypes) {
		body.grant_types = updateFields.grantTypes;
	}
	if (updateFields.tokenEndpointAuthMethod) {
		body.token_endpoint_auth_method = updateFields.tokenEndpointAuthMethod;
	}
	if (updateFields.clientMetadata) {
		body.client_metadata = parseJson(updateFields.clientMetadata as string);
	}
	if (updateFields.initiateLoginUri) {
		body.initiate_login_uri = updateFields.initiateLoginUri;
	}
	if (updateFields.oidcConformant !== undefined) {
		body.oidc_conformant = updateFields.oidcConformant;
	}
	if (updateFields.jwtConfiguration) {
		body.jwt_configuration = parseJson(updateFields.jwtConfiguration as string);
	}
	if (updateFields.refreshToken) {
		body.refresh_token = parseJson(updateFields.refreshToken as string);
	}

	const response = await auth0ApiRequest.call(
		this,
		'PATCH',
		`/clients/${clientId}`,
		removeEmptyFields(body),
	);
	return [{ json: response as IDataObject }];
}

export async function deleteApplication(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clientId = this.getNodeParameter('clientId', index) as string;

	await auth0ApiRequest.call(this, 'DELETE', `/clients/${clientId}`);
	return [{ json: { success: true, clientId } }];
}

export async function rotateApplicationSecret(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clientId = this.getNodeParameter('clientId', index) as string;

	const response = await auth0ApiRequest.call(
		this,
		'POST',
		`/clients/${clientId}/rotate-secret`,
	);
	return [{ json: response as IDataObject }];
}

export async function getApplicationCredentials(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clientId = this.getNodeParameter('clientId', index) as string;

	const response = await auth0ApiRequest.call(this, 'GET', `/clients/${clientId}/credentials`);
	return Array.isArray(response)
		? response.map((item) => ({ json: item }))
		: [{ json: response as IDataObject }];
}

export async function createApplicationCredential(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clientId = this.getNodeParameter('clientId', index) as string;
	const credentialType = this.getNodeParameter('credentialType', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		credential_type: credentialType,
	};

	if (additionalFields.name) {
		body.name = additionalFields.name;
	}
	if (additionalFields.pem) {
		body.pem = additionalFields.pem;
	}
	if (additionalFields.algorithm) {
		body.alg = additionalFields.algorithm;
	}
	if (additionalFields.expiresAt) {
		body.expires_at = additionalFields.expiresAt;
	}

	const response = await auth0ApiRequest.call(
		this,
		'POST',
		`/clients/${clientId}/credentials`,
		body,
	);
	return [{ json: response as IDataObject }];
}

export async function deleteApplicationCredential(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const clientId = this.getNodeParameter('clientId', index) as string;
	const credentialId = this.getNodeParameter('credentialId', index) as string;

	await auth0ApiRequest.call(this, 'DELETE', `/clients/${clientId}/credentials/${credentialId}`);
	return [{ json: { success: true, clientId, credentialId } }];
}

import type { ApplicationOperation } from '../../utils/types';

export async function executeApplicationOperation(
	this: IExecuteFunctions,
	operation: ApplicationOperation,
	index: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return createApplication.call(this, index);
		case 'get':
			return getApplication.call(this, index);
		case 'getAll':
			return getAllApplications.call(this, index);
		case 'update':
			return updateApplication.call(this, index);
		case 'delete':
			return deleteApplication.call(this, index);
		case 'rotateSecret':
			return rotateApplicationSecret.call(this, index);
		case 'getCredentials':
			return getApplicationCredentials.call(this, index);
		case 'createCredential':
			return createApplicationCredential.call(this, index);
		case 'deleteCredential':
			return deleteApplicationCredential.call(this, index);
		default:
			throw new Error(`The operation "${operation}" is not supported for Application resource`);
	}
}
