/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	parseJson,
	parseJsonParameter,
	removeEmptyFields,
	encodeUserId,
	buildUserSearchQuery,
	buildLogSearchQuery,
	isValidEmail,
	isValidUserId,
	isValidOrganizationId,
	isValidE164Phone,
	simplifyAuth0Response,
	CONNECTION_STRATEGIES,
	APP_TYPES,
	GRANT_TYPES,
	ACTION_TRIGGERS,
	LOG_EVENT_TYPES,
} from '../../nodes/Auth0/utils/helpers';

describe('Auth0 Helpers', () => {
	describe('parseJson', () => {
		it('should parse valid JSON string', () => {
			const result = parseJson('{"key": "value"}');
			expect(result).toEqual({ key: 'value' });
		});

		it('should return object if already an object', () => {
			const obj = { key: 'value' };
			const result = parseJson(obj);
			expect(result).toEqual(obj);
		});

		it('should return empty object for invalid JSON', () => {
			const result = parseJson('invalid json');
			expect(result).toEqual({});
		});
	});

	describe('parseJsonParameter', () => {
		it('should parse valid JSON string', () => {
			const result = parseJsonParameter('{"key": "value"}');
			expect(result).toEqual({ key: 'value' });
		});

		it('should parse JSON array', () => {
			const result = parseJsonParameter('[1, 2, 3]');
			expect(result).toEqual([1, 2, 3]);
		});

		it('should return object if already an object', () => {
			const obj = { key: 'value' };
			const result = parseJsonParameter(obj);
			expect(result).toEqual(obj);
		});

		it('should return empty object for invalid JSON', () => {
			const result = parseJsonParameter('invalid json');
			expect(result).toEqual({});
		});

		it('should handle null', () => {
			const result = parseJsonParameter(null);
			expect(result).toEqual({});
		});

		it('should accept optional field name', () => {
			const result = parseJsonParameter('{"key": "value"}', 'testField');
			expect(result).toEqual({ key: 'value' });
		});
	});

	describe('removeEmptyFields', () => {
		it('should remove undefined fields', () => {
			const obj = { a: 1, b: undefined, c: 'test' };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should remove null fields', () => {
			const obj = { a: 1, b: null, c: 'test' };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should remove empty string fields', () => {
			const obj = { a: 1, b: '', c: 'test' };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 1, c: 'test' });
		});

		it('should keep zero and false values', () => {
			const obj = { a: 0, b: false, c: 'test' };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 0, b: false, c: 'test' });
		});

		it('should handle nested objects', () => {
			const obj = { a: 1, nested: { b: 2, c: undefined } };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 1, nested: { b: 2 } });
		});

		it('should handle arrays', () => {
			const obj = { a: 1, arr: [1, 2, 3] };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 1, arr: [1, 2, 3] });
		});

		it('should remove empty arrays', () => {
			const obj = { a: 1, arr: [] };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 1 });
		});
	});

	describe('encodeUserId', () => {
		it('should encode user ID with pipe character', () => {
			const result = encodeUserId('auth0|12345');
			expect(result).toBe('auth0%7C12345');
		});

		it('should handle double encoding properly', () => {
			const result = encodeUserId('auth0%7C12345');
			expect(result).toBe('auth0%257C12345');
		});

		it('should handle ID without special characters', () => {
			const result = encodeUserId('google-oauth2_12345');
			expect(result).toBe('google-oauth2_12345');
		});
	});

	describe('buildUserSearchQuery', () => {
		it('should build search query with email', () => {
			const result = buildUserSearchQuery({ email: 'test@example.com' });
			expect(result).toBe('email:"test@example.com"');
		});

		it('should build search query with multiple fields', () => {
			const result = buildUserSearchQuery({ email: 'test@example.com', name: 'Test' });
			expect(result).toContain('email:"test@example.com"');
			expect(result).toContain('name:"Test"');
			expect(result).toContain(' AND ');
		});

		it('should handle empty object', () => {
			const result = buildUserSearchQuery({});
			expect(result).toBe('');
		});

		it('should build query with connection', () => {
			const result = buildUserSearchQuery({ connection: 'Username-Password' });
			expect(result).toBe('identities.connection:"Username-Password"');
		});

		it('should build query with blocked status', () => {
			const result = buildUserSearchQuery({ blocked: true });
			expect(result).toBe('blocked:true');
		});
	});

	describe('buildLogSearchQuery', () => {
		it('should build log query with type', () => {
			const result = buildLogSearchQuery({ type: 's' });
			expect(result).toBe('type:s');
		});

		it('should build log query with userId', () => {
			const result = buildLogSearchQuery({ userId: 'auth0|123' });
			expect(result).toBe('user_id:"auth0|123"');
		});

		it('should build log query with multiple fields', () => {
			const result = buildLogSearchQuery({ type: 's', clientId: 'abc123' });
			expect(result).toContain('type:s');
			expect(result).toContain('client_id:abc123');
		});
	});

	describe('isValidEmail', () => {
		it('should return true for valid email', () => {
			expect(isValidEmail('test@example.com')).toBe(true);
		});

		it('should return false for invalid email', () => {
			expect(isValidEmail('invalid')).toBe(false);
		});

		it('should return false for empty string', () => {
			expect(isValidEmail('')).toBe(false);
		});

		it('should handle email with subdomain', () => {
			expect(isValidEmail('test@mail.example.com')).toBe(true);
		});
	});

	describe('isValidUserId', () => {
		it('should return true for valid auth0 user ID', () => {
			expect(isValidUserId('auth0|12345')).toBe(true);
		});

		it('should return true for Google OAuth user ID', () => {
			expect(isValidUserId('google-oauth2|12345')).toBe(true);
		});

		it('should return false for invalid user ID', () => {
			expect(isValidUserId('invalid')).toBe(false);
		});
	});

	describe('isValidOrganizationId', () => {
		it('should return true for valid org ID', () => {
			expect(isValidOrganizationId('org_abc123')).toBe(true);
		});

		it('should return false for invalid org ID', () => {
			expect(isValidOrganizationId('invalid')).toBe(false);
		});
	});

	describe('isValidE164Phone', () => {
		it('should return true for valid E.164 phone', () => {
			expect(isValidE164Phone('+15551234567')).toBe(true);
		});

		it('should return false for phone without plus', () => {
			expect(isValidE164Phone('15551234567')).toBe(false);
		});

		it('should return false for phone with invalid format', () => {
			expect(isValidE164Phone('+1-555-123-4567')).toBe(false);
		});
	});

	describe('simplifyAuth0Response', () => {
		it('should return original data if no fields specified', () => {
			const data = { a: 1, b: 2, c: 3 };
			const result = simplifyAuth0Response(data);
			expect(result).toEqual(data);
		});

		it('should filter to specified fields', () => {
			const data = { a: 1, b: 2, c: 3 };
			const result = simplifyAuth0Response(data, ['a', 'c']);
			expect(result).toEqual({ a: 1, c: 3 });
		});

		it('should handle missing fields gracefully', () => {
			const data = { a: 1, b: 2 };
			const result = simplifyAuth0Response(data, ['a', 'z']);
			expect(result).toEqual({ a: 1 });
		});
	});

	describe('Constants', () => {
		it('should have CONNECTION_STRATEGIES defined with correct structure', () => {
			expect(CONNECTION_STRATEGIES).toBeDefined();
			expect(Array.isArray(CONNECTION_STRATEGIES)).toBe(true);
			expect(CONNECTION_STRATEGIES.length).toBeGreaterThan(0);
			
			const auth0Strategy = CONNECTION_STRATEGIES.find(s => s.value === 'auth0');
			expect(auth0Strategy).toBeDefined();
			expect(auth0Strategy?.name).toBe('Auth0 Database');
			
			const googleStrategy = CONNECTION_STRATEGIES.find(s => s.value === 'google-oauth2');
			expect(googleStrategy).toBeDefined();
		});

		it('should have APP_TYPES defined with correct structure', () => {
			expect(APP_TYPES).toBeDefined();
			expect(Array.isArray(APP_TYPES)).toBe(true);
			
			const spaType = APP_TYPES.find(t => t.value === 'spa');
			expect(spaType).toBeDefined();
			expect(spaType?.name).toBe('Single Page Application');
			
			const nativeType = APP_TYPES.find(t => t.value === 'native');
			expect(nativeType).toBeDefined();
		});

		it('should have GRANT_TYPES defined with correct structure', () => {
			expect(GRANT_TYPES).toBeDefined();
			expect(Array.isArray(GRANT_TYPES)).toBe(true);
			
			const authCodeGrant = GRANT_TYPES.find(g => g.value === 'authorization_code');
			expect(authCodeGrant).toBeDefined();
			
			const clientCredentialsGrant = GRANT_TYPES.find(g => g.value === 'client_credentials');
			expect(clientCredentialsGrant).toBeDefined();
		});

		it('should have ACTION_TRIGGERS defined with correct structure', () => {
			expect(ACTION_TRIGGERS).toBeDefined();
			expect(Array.isArray(ACTION_TRIGGERS)).toBe(true);
			expect(ACTION_TRIGGERS.length).toBeGreaterThan(0);
			
			const postLogin = ACTION_TRIGGERS.find(t => t.value === 'post-login');
			expect(postLogin).toBeDefined();
			expect(postLogin?.name).toBe('Post Login');
		});

		it('should have LOG_EVENT_TYPES defined with correct structure', () => {
			expect(LOG_EVENT_TYPES).toBeDefined();
			expect(Array.isArray(LOG_EVENT_TYPES)).toBe(true);
			expect(LOG_EVENT_TYPES.length).toBeGreaterThan(0);
			
			const successLogin = LOG_EVENT_TYPES.find(t => t.value === 's');
			expect(successLogin).toBeDefined();
			expect(successLogin?.name).toBe('Success Login');
		});
	});
});
