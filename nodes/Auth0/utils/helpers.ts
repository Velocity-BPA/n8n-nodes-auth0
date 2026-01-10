/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

/**
 * Simplifies the output of Auth0 API responses by removing unnecessary fields
 */
export function simplifyAuth0Response(data: IDataObject, fields?: string[]): IDataObject {
	if (!fields || fields.length === 0) {
		return data;
	}

	const result: IDataObject = {};
	for (const field of fields) {
		if (data[field] !== undefined) {
			result[field] = data[field];
		}
	}
	return result;
}

/**
 * Parses a JSON string or returns the object if already parsed
 */
export function parseJson(value: string | IDataObject): IDataObject {
	if (typeof value === 'string') {
		try {
			return JSON.parse(value) as IDataObject;
		} catch {
			return {};
		}
	}
	return value;
}

/**
 * Parses a JSON parameter that can be a string or object
 */
export function parseJsonParameter(value: unknown, _fieldName?: string): IDataObject | IDataObject[] {
	if (typeof value === 'string') {
		try {
			return JSON.parse(value);
		} catch {
			return {};
		}
	}
	if (typeof value === 'object' && value !== null) {
		return value as IDataObject | IDataObject[];
	}
	return {};
}

/**
 * Validates an Auth0 user ID format
 */
export function isValidUserId(userId: string): boolean {
	// Auth0 user IDs can be in format: auth0|xxx, google-oauth2|xxx, etc.
	return /^[a-zA-Z0-9_-]+\|[a-zA-Z0-9_-]+$/.test(userId);
}

/**
 * Validates an Auth0 organization ID format
 */
export function isValidOrganizationId(orgId: string): boolean {
	// Auth0 organization IDs are in format: org_xxx
	return /^org_[a-zA-Z0-9]+$/.test(orgId);
}

/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Validates a phone number in E.164 format
 */
export function isValidE164Phone(phone: string): boolean {
	const phoneRegex = /^\+[1-9]\d{1,14}$/;
	return phoneRegex.test(phone);
}

/**
 * Removes empty fields from an object
 */
export function removeEmptyFields(obj: IDataObject): IDataObject {
	const result: IDataObject = {};
	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null && value !== '') {
			if (typeof value === 'object' && !Array.isArray(value)) {
				const cleaned = removeEmptyFields(value as IDataObject);
				if (Object.keys(cleaned).length > 0) {
					result[key] = cleaned;
				}
			} else if (Array.isArray(value) && value.length > 0) {
				result[key] = value;
			} else if (!Array.isArray(value)) {
				result[key] = value;
			}
		}
	}
	return result;
}

/**
 * Encodes a user ID for use in API URLs
 */
export function encodeUserId(userId: string): string {
	return encodeURIComponent(userId);
}

/**
 * Builds a query string for Auth0 user search
 */
export function buildUserSearchQuery(params: {
	email?: string;
	name?: string;
	nickname?: string;
	connection?: string;
	blocked?: boolean;
}): string {
	const parts: string[] = [];

	if (params.email) {
		parts.push(`email:"${params.email}"`);
	}
	if (params.name) {
		parts.push(`name:"${params.name}"`);
	}
	if (params.nickname) {
		parts.push(`nickname:"${params.nickname}"`);
	}
	if (params.connection) {
		parts.push(`identities.connection:"${params.connection}"`);
	}
	if (params.blocked !== undefined) {
		parts.push(`blocked:${params.blocked}`);
	}

	return parts.join(' AND ');
}

/**
 * Builds a Lucene query for Auth0 log search
 */
export function buildLogSearchQuery(params: {
	type?: string;
	clientId?: string;
	userId?: string;
	connection?: string;
	description?: string;
}): string {
	const parts: string[] = [];

	if (params.type) {
		parts.push(`type:${params.type}`);
	}
	if (params.clientId) {
		parts.push(`client_id:${params.clientId}`);
	}
	if (params.userId) {
		parts.push(`user_id:"${params.userId}"`);
	}
	if (params.connection) {
		parts.push(`connection:"${params.connection}"`);
	}
	if (params.description) {
		parts.push(`description:*${params.description}*`);
	}

	return parts.join(' AND ');
}

/**
 * Connection strategy options for Auth0
 */
export const CONNECTION_STRATEGIES = [
	{ name: 'Auth0 Database', value: 'auth0' },
	{ name: 'Google OAuth2', value: 'google-oauth2' },
	{ name: 'Facebook', value: 'facebook' },
	{ name: 'Twitter', value: 'twitter' },
	{ name: 'LinkedIn', value: 'linkedin' },
	{ name: 'GitHub', value: 'github' },
	{ name: 'Microsoft Account', value: 'windowslive' },
	{ name: 'Azure AD', value: 'waad' },
	{ name: 'SAML', value: 'samlp' },
	{ name: 'OIDC', value: 'oidc' },
	{ name: 'LDAP', value: 'ad' },
	{ name: 'Passwordless Email', value: 'email' },
	{ name: 'Passwordless SMS', value: 'sms' },
	{ name: 'Apple', value: 'apple' },
	{ name: 'Okta', value: 'okta' },
];

/**
 * Application types for Auth0
 */
export const APP_TYPES = [
	{ name: 'Single Page Application', value: 'spa' },
	{ name: 'Native Application', value: 'native' },
	{ name: 'Regular Web Application', value: 'regular_web' },
	{ name: 'Machine to Machine', value: 'non_interactive' },
];

/**
 * Grant types for Auth0 applications
 */
export const GRANT_TYPES = [
	{ name: 'Authorization Code', value: 'authorization_code' },
	{ name: 'Implicit', value: 'implicit' },
	{ name: 'Refresh Token', value: 'refresh_token' },
	{ name: 'Client Credentials', value: 'client_credentials' },
	{ name: 'Password', value: 'password' },
	{ name: 'MFA OOB', value: 'http://auth0.com/oauth/grant-type/mfa-oob' },
	{ name: 'MFA OTP', value: 'http://auth0.com/oauth/grant-type/mfa-otp' },
	{ name: 'MFA Recovery Code', value: 'http://auth0.com/oauth/grant-type/mfa-recovery-code' },
	{ name: 'Device Code', value: 'urn:ietf:params:oauth:grant-type:device_code' },
];

/**
 * Action trigger types for Auth0
 */
export const ACTION_TRIGGERS = [
	{ name: 'Post Login', value: 'post-login' },
	{ name: 'Pre User Registration', value: 'pre-user-registration' },
	{ name: 'Post User Registration', value: 'post-user-registration' },
	{ name: 'Post Change Password', value: 'post-change-password' },
	{ name: 'Send Phone Message', value: 'send-phone-message' },
	{ name: 'Credentials Exchange', value: 'credentials-exchange' },
];

/**
 * Log event types for Auth0
 */
export const LOG_EVENT_TYPES = [
	{ name: 'Success Login', value: 's' },
	{ name: 'Success Exchange', value: 'seacft' },
	{ name: 'Success Logout', value: 'slo' },
	{ name: 'Success Signup', value: 'ss' },
	{ name: 'Success Verification Email', value: 'sv' },
	{ name: 'Success Change Password', value: 'scp' },
	{ name: 'Failed Login', value: 'f' },
	{ name: 'Failed Exchange', value: 'feacft' },
	{ name: 'Failed Signup', value: 'fs' },
	{ name: 'Failed Change Password', value: 'fcp' },
	{ name: 'Limit Warning', value: 'limit_wc' },
	{ name: 'API Operation', value: 'sapi' },
	{ name: 'User Blocked', value: 'limit_ui' },
	{ name: 'User Deleted', value: 'sdu' },
];
