/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	JsonObject,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

interface TokenCache {
	token: string;
	expiresAt: number;
	domain: string;
}

let tokenCache: TokenCache | null = null;

export async function getAccessToken(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
): Promise<string> {
	const credentials = await this.getCredentials('auth0ManagementApi');
	const domain = credentials.domain as string;
	const clientId = credentials.clientId as string;
	const clientSecret = credentials.clientSecret as string;
	const audience = (credentials.audience as string) || `https://${domain}/api/v2/`;

	const now = Date.now();

	// Check if we have a valid cached token for this domain
	if (tokenCache && tokenCache.domain === domain && tokenCache.expiresAt > now + 60000) {
		return tokenCache.token;
	}

	try {
		const response = await this.helpers.request({
			method: 'POST',
			url: `https://${domain}/oauth/token`,
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				grant_type: 'client_credentials',
				client_id: clientId,
				client_secret: clientSecret,
				audience,
			},
			json: true,
		});

		tokenCache = {
			token: response.access_token,
			expiresAt: now + (response.expires_in * 1000),
			domain,
		};

		return response.access_token;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'Failed to obtain Auth0 access token',
		});
	}
}

export async function auth0ApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('auth0ManagementApi');
	const domain = credentials.domain as string;
	const accessToken = await getAccessToken.call(this);

	const options: IDataObject = {
		method,
		url: `https://${domain}/api/v2${endpoint}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (body && Object.keys(body).length > 0 && method !== 'GET') {
		options.body = body;
	}

	if (query && Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject | IDataObject[];
	} catch (error) {
		const errorData = error as JsonObject;

		// Handle rate limiting
		if ((errorData.statusCode as number) === 429) {
			const responseObj = errorData.response as JsonObject | undefined;
			const headersObj = responseObj?.headers as JsonObject | undefined;
			const retryAfter = (headersObj?.['x-ratelimit-reset'] as number) || 60;
			throw new NodeApiError(this.getNode(), errorData, {
				message: `Rate limit exceeded. Retry after ${retryAfter} seconds.`,
			});
		}

		// Handle token expiration
		if ((errorData.statusCode as number) === 401) {
			tokenCache = null;
			throw new NodeApiError(this.getNode(), errorData, {
				message: 'Authentication failed. Token may have expired.',
			});
		}

		throw new NodeApiError(this.getNode(), errorData);
	}
}

export async function auth0ApiRequestAllItems(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
	propertyName?: string,
): Promise<IDataObject[]> {
	const results: IDataObject[] = [];
	let page = 0;
	const perPage = 50;

	do {
		const response = await auth0ApiRequest.call(this, method, endpoint, body, {
			...query,
			page,
			per_page: perPage,
			include_totals: true,
		});

		let items: IDataObject[];

		if (Array.isArray(response)) {
			items = response;
		} else if (propertyName && response[propertyName]) {
			items = response[propertyName] as IDataObject[];
		} else {
			// Try common property names
			const possibleKeys = ['users', 'roles', 'organizations', 'connections', 'clients', 'resource_servers', 'logs', 'actions', 'members', 'permissions'];
			const foundKey = possibleKeys.find(key => response[key]);
			if (foundKey) {
				items = response[foundKey] as IDataObject[];
			} else {
				items = [response];
			}
		}

		results.push(...items);

		if (items.length < perPage) {
			break;
		}

		page++;
	} while (true);

	return results;
}

export function handleAuth0Error(error: unknown): never {
	const errorData = error as JsonObject;
	const message = (errorData.message as string) || 'Unknown Auth0 API error';
	const statusCode = (errorData.statusCode as number) || 500;
	const errorCode = (errorData.error as string) || 'unknown_error';

	throw new Error(`Auth0 API Error [${statusCode}] ${errorCode}: ${message}`);
}
