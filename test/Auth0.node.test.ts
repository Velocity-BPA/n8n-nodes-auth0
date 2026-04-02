/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Auth0 } from '../nodes/Auth0/Auth0.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Auth0 Node', () => {
  let node: Auth0;

  beforeAll(() => {
    node = new Auth0();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Auth0');
      expect(node.description.name).toBe('auth0');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Users Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				domain: 'https://test.auth0.com',
				accessToken: 'test-token',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	test('should get users successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getUsers')
			.mockReturnValueOnce('email:*')
			.mockReturnValueOnce('v3')
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(50)
			.mockReturnValueOnce(true)
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce(true);

		const mockResponse = [{ user_id: 'auth0|123', email: 'test@example.com' }];
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://test.auth0.com/api/v2/users',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			qs: {
				q: 'email:*',
				search_engine: 'v3',
				page: 0,
				per_page: 50,
				include_totals: true,
				include_fields: true,
			},
			json: true,
		});
	});

	test('should create user successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createUser')
			.mockReturnValueOnce('Username-Password-Authentication')
			.mockReturnValueOnce('test@example.com')
			.mockReturnValueOnce('password123')
			.mockReturnValueOnce('testuser')
			.mockReturnValueOnce('Test User')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('{}')
			.mockReturnValueOnce('{}')
			.mockReturnValueOnce(false)
			.mockReturnValueOnce(false)
			.mockReturnValueOnce('')
			.mockReturnValueOnce(false)
			.mockReturnValueOnce('');

		const mockResponse = { user_id: 'auth0|123', email: 'test@example.com' };
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual(mockResponse);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://test.auth0.com/api/v2/users',
			headers: {
				'Authorization': 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			body: {
				connection: 'Username-Password-Authentication',
				email: 'test@example.com',
				password: 'password123',
				username: 'testuser',
				name: 'Test User',
				user_metadata: {},
				app_metadata: {},
				email_verified: false,
				verify_email: false,
				phone_verified: false,
			},
			json: true,
		});
	});

	test('should handle errors properly', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getUsers');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeUsersOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ error: 'API Error' });
	});

	test('should assign user roles successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('assignUserRoles')
			.mockReturnValueOnce('auth0|123')
			.mockReturnValueOnce('["role1", "role2"]');

		const mockResponse = {};
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeUsersOperations.call(mockExecuteF

describe('Organizations Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://test.auth0.com/api/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getOrganizations operation', () => {
		it('should get all organizations successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getOrganizations')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(false)
				.mockReturnValueOnce('')
				.mockReturnValueOnce('');

			const mockResponse = [
				{ id: 'org1', name: 'Organization 1' },
				{ id: 'org2', name: 'Organization 2' },
			];

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeOrganizationsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors when getting organizations', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getOrganizations');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(
				executeOrganizationsOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('API Error');
		});
	});

	describe('getOrganization operation', () => {
		it('should get organization by ID successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getOrganization')
				.mockReturnValueOnce('org123');

			const mockResponse = { id: 'org123', name: 'Test Organization' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeOrganizationsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors when getting organization by ID', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getOrganization')
				.mockReturnValueOnce('org123');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Organization not found'));

			await expect(
				executeOrganizationsOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Organization not found');
		});
	});

	describe('createOrganization operation', () => {
		it('should create organization successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createOrganization')
				.mockReturnValueOnce('Test Org')
				.mockReturnValueOnce('Test Organization')
				.mockReturnValueOnce('{}')
				.mockReturnValueOnce('{}');

			const mockResponse = { id: 'org123', name: 'Test Org' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeOrganizationsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors when creating organization', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createOrganization')
				.mockReturnValueOnce('Test Org');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Creation failed'));

			await expect(
				executeOrganizationsOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Creation failed');
		});
	});

	describe('updateOrganization operation', () => {
		it('should update organization successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateOrganization')
				.mockReturnValueOnce('org123')
				.mockReturnValueOnce('Updated Org')
				.mockReturnValueOnce('Updated Organization')
				.mockReturnValueOnce('{}')
				.mockReturnValueOnce('{}');

			const mockResponse = { id: 'org123', name: 'Updated Org' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeOrganizationsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors when updating organization', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateOrganization')
				.mockReturnValueOnce('org123');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Update failed'));

			await expect(
				executeOrganizationsOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Update failed');
		});
	});

	describe('deleteOrganization operation', () => {
		it('should delete organization successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteOrganization')
				.mockReturnValueOnce('org123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});

			const result = await executeOrganizationsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: {},
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors when deleting organization', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteOrganization')
				.mockReturnValueOnce('org123');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Delete failed'));

			await expect(
				executeOrganizationsOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('Delete failed');
		});
	});

	describe('getOrganizationMembers operation', () => {
		it('should get organization members successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getOrganizationMembers')
				.mockReturnValueOnce('org123')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(false);

			const mockResponse = [{ user_id: 'user1' }, { user_id: 'user2' }];
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse

describe('Connections Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        domain: 'https://test-tenant.auth0.com',
        accessToken: 'test-access-token'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn()
      }
    };
  });

  describe('getConnections operation', () => {
    it('should get all connections successfully', async () => {
      const mockResponse = [{ id: 'con_123', name: 'test-connection', strategy: 'auth0' }];
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getConnections')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(0);

      const result = await executeConnectionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://test-tenant.auth0.com/api/v2/connections?per_page=50&page=0',
        headers: {
          'Authorization': 'Bearer test-access-token',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });

    it('should handle errors when getting connections', async () => {
      const mockError = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getConnections');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeConnectionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('createConnection operation', () => {
    it('should create connection successfully', async () => {
      const mockResponse = { id: 'con_123', name: 'new-connection', strategy: 'auth0' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createConnection')
        .mockReturnValueOnce('new-connection')
        .mockReturnValueOnce('auth0')
        .mockReturnValueOnce('{}')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      const result = await executeConnectionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('deleteConnection operation', () => {
    it('should delete connection successfully', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteConnection')
        .mockReturnValueOnce('con_123');

      const result = await executeConnectionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ success: true, connectionId: 'con_123' });
    });
  });
});

describe('Applications Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token', 
        baseUrl: 'https://test-tenant.auth0.com/api/v2' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn().mockResolvedValue({ client_id: 'test123', name: 'Test App' }) 
      },
    };
  });

  describe('getApplications operation', () => {
    it('should get all applications successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getApplications')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce('');

      const result = await executeApplicationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://test-tenant.auth0.com/api/v2/clients?include_fields=true&per_page=50&include_totals=false&is_global=false&is_first_party=false',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: { client_id: 'test123', name: 'Test App' }, pairedItem: { item: 0 } }]);
    });

    it('should handle errors when getting applications fails', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getApplications');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeApplicationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getApplication operation', () => {
    it('should get application by ID successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getApplication')
        .mockReturnValueOnce('app123')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(true);

      const result = await executeApplicationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://test-tenant.auth0.com/api/v2/clients/app123?include_fields=true',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: { client_id: 'test123', name: 'Test App' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('createApplication operation', () => {
    it('should create application successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createApplication')
        .mockReturnValueOnce('Test App')
        .mockReturnValueOnce('Test Description')
        .mockReturnValueOnce('spa')
        .mockReturnValueOnce('https://example.com/logo.png')
        .mockReturnValueOnce('https://example.com/callback')
        .mockReturnValueOnce('https://example.com')
        .mockReturnValueOnce('https://example.com')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false);

      const result = await executeApplicationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://test-tenant.auth0.com/api/v2/clients',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'Test App',
          app_type: 'spa',
          description: 'Test Description',
          logo_uri: 'https://example.com/logo.png',
          callbacks: ['https://example.com/callback'],
          allowed_origins: ['https://example.com'],
          web_origins: ['https://example.com'],
          sso: false,
          sso_disabled: false,
          cross_origin_auth: false,
          custom_login_page_on: false,
        },
        json: true,
      });
      expect(result).toEqual([{ json: { client_id: 'test123', name: 'Test App' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('deleteApplication operation', () => {
    it('should delete application successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteApplication')
        .mockReturnValueOnce('app123');

      const result = await executeApplicationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://test-tenant.auth0.com/api/v2/clients/app123',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: { client_id: 'test123', name: 'Test App' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('rotateApplicationSecret operation', () => {
    it('should rotate application secret successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('rotateApplicationSecret')
        .mockReturnValueOnce('app123');

      const result = await executeApplicationsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://test-tenant.auth0.com/api/v2/clients/app123/rotate-secret',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: { client_id: 'test123', name: 'Test App' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Roles Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				domain: 'https://test.auth0.com',
				accessToken: 'test-token',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getRoles', () => {
		it('should get all roles successfully', async () => {
			const mockResponse = { roles: [{ id: 'role_123', name: 'test-role' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getRoles');

			const result = await executeRolesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://test.auth0.com/api/v2/roles',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				qs: {},
				json: true,
			});
		});

		it('should handle errors', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getRoles');

			await expect(executeRolesOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
		});
	});

	describe('createRole', () => {
		it('should create role successfully', async () => {
			const mockResponse = { id: 'role_123', name: 'new-role' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'createRole';
				if (param === 'name') return 'new-role';
				if (param === 'description') return 'Test role';
				return undefined;
			});

			const result = await executeRolesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://test.auth0.com/api/v2/roles',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: { name: 'new-role', description: 'Test role' },
				json: true,
			});
		});
	});

	describe('assignRolePermissions', () => {
		it('should assign permissions to role successfully', async () => {
			const mockResponse = {};
			const permissions = [{ permission_name: 'read:users', resource_server_identifier: 'api' }];
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'assignRolePermissions';
				if (param === 'roleId') return 'role_123';
				if (param === 'permissions') return permissions;
				return undefined;
			});

			const result = await executeRolesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://test.auth0.com/api/v2/roles/role_123/permissions',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: { permissions },
				json: true,
			});
		});
	});

	describe('deleteRole', () => {
		it('should delete role successfully', async () => {
			const mockResponse = {};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'deleteRole';
				if (param === 'roleId') return 'role_123';
				return undefined;
			});

			const result = await executeRolesOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://test.auth0.com/api/v2/roles/role_123',
				headers: {
					Authorization: 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});
});

describe('Logs Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://test-domain.auth0.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getLogs operation', () => {
    it('should get logs successfully', async () => {
      const mockResponse = [
        { log_id: '1', type: 's', date: '2023-01-01T00:00:00.000Z' },
        { log_id: '2', type: 'f', date: '2023-01-01T01:00:00.000Z' },
      ];

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLogs')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('date:-1')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(true);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLogsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://test-domain.auth0.com/api/v2/logs?page=0&per_page=50&include_totals=false&sort=date%3A-1&include_fields=true',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle getLogs error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getLogs');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeLogsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: { error: 'API Error' },
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('getLog operation', () => {
    it('should get specific log successfully', async () => {
      const mockResponse = { log_id: '123', type: 's', date: '2023-01-01T00:00:00.000Z' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLog')
        .mockReturnValueOnce('123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeLogsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://test-domain.auth0.com/api/v2/logs/123',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle getLog error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLog')
        .mockReturnValueOnce('123');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Log not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeLogsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: { error: 'Log not found' },
          pairedItem: { item: 0 },
        },
      ]);
    });
  });
});

describe('Tickets Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				domain: 'test-domain.auth0.com',
				accessToken: 'test-token',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createPasswordChangeTicket operation', () => {
		it('should create password change ticket successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createPasswordChangeTicket')
				.mockReturnValueOnce('user123')
				.mockReturnValueOnce('conn123')
				.mockReturnValueOnce('test@example.com')
				.mockReturnValueOnce(true)
				.mockReturnValueOnce(false)
				.mockReturnValueOnce(3600)
				.mockReturnValueOnce('client123')
				.mockReturnValueOnce('org123');

			const mockResponse = {
				ticket: 'https://test-domain.auth0.com/lo/reset?ticket=abc123',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTicketsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://test-domain.auth0.com/api/v2/tickets/password-change',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					user_id: 'user123',
					connection_id: 'conn123',
					email: 'test@example.com',
					mark_email_as_verified: true,
					includeEmailInRedirect: false,
					ttl_sec: 3600,
					client_id: 'client123',
					organization_id: 'org123',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle createPasswordChangeTicket error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('createPasswordChangeTicket');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			const result = await executeTicketsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('createEmailVerificationTicket operation', () => {
		it('should create email verification ticket successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createEmailVerificationTicket')
				.mockReturnValueOnce('user123')
				.mockReturnValueOnce('client123')
				.mockReturnValueOnce('org123')
				.mockReturnValueOnce(7200)
				.mockReturnValueOnce(true);

			const mockResponse = {
				ticket: 'https://test-domain.auth0.com/lo/verify?ticket=xyz789',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTicketsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://test-domain.auth0.com/api/v2/tickets/email-verification',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					user_id: 'user123',
					client_id: 'client123',
					organization_id: 'org123',
					ttl_sec: 7200,
					includeEmailInRedirect: true,
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle createEmailVerificationTicket error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('createEmailVerificationTicket');
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Verification Error'));

			const result = await executeTicketsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([
				{
					json: { error: 'Verification Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});
});
