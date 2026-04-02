# n8n-nodes-auth0

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Auth0 identity and access management platform. This node provides access to 7 core resources with full CRUD operations, enabling complete user identity management, organization administration, application configuration, and security monitoring workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Auth0](https://img.shields.io/badge/Auth0-Ready-orange)
![Identity](https://img.shields.io/badge/Identity-Management-green)
![SSO](https://img.shields.io/badge/SSO-Enabled-purple)

## Features

• **Complete User Management** - Create, update, delete users with metadata and profile management
• **Organization Administration** - Full organization lifecycle management with member assignments
• **Connection Configuration** - Manage database, social, and enterprise identity connections
• **Application Control** - Configure applications, clients, and their authentication settings
• **Role-Based Access** - Create and assign roles with granular permission management
• **Security Monitoring** - Access comprehensive logs for authentication and administrative events
• **Ticket Operations** - Handle password reset and email verification ticket workflows
• **Batch Processing** - Efficient bulk operations for user and organization management

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-auth0`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-auth0
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-auth0.git
cd n8n-nodes-auth0
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-auth0
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| Domain | Your Auth0 domain (e.g., your-tenant.auth0.com) | Yes |
| Client ID | Management API Client ID | Yes |
| Client Secret | Management API Client Secret | Yes |
| Audience | Management API Identifier (https://your-domain.auth0.com/api/v2/) | Yes |

## Resources & Operations

### 1. Users

| Operation | Description |
|-----------|-------------|
| Create | Create a new user with email, password, and profile data |
| Get | Retrieve user details by user ID |
| Update | Update user profile, metadata, and authentication settings |
| Delete | Remove a user from the Auth0 tenant |
| List | Get all users with filtering and pagination options |
| Get Roles | Retrieve roles assigned to a specific user |
| Assign Roles | Assign one or more roles to a user |
| Remove Roles | Remove roles from a user |

### 2. Organizations

| Operation | Description |
|-----------|-------------|
| Create | Create a new organization with name and metadata |
| Get | Retrieve organization details by organization ID |
| Update | Update organization name, display name, and metadata |
| Delete | Remove an organization from the tenant |
| List | Get all organizations with filtering and pagination |
| Get Members | Retrieve all members of an organization |
| Add Members | Add users to an organization with specific roles |
| Remove Members | Remove users from an organization |

### 3. Connections

| Operation | Description |
|-----------|-------------|
| Create | Create a new identity connection (database, social, enterprise) |
| Get | Retrieve connection details and configuration |
| Update | Update connection settings and configuration |
| Delete | Remove a connection from the tenant |
| List | Get all connections with filtering options |

### 4. Applications

| Operation | Description |
|-----------|-------------|
| Create | Create a new application/client |
| Get | Retrieve application configuration and settings |
| Update | Update application settings, callbacks, and metadata |
| Delete | Remove an application from the tenant |
| List | Get all applications with filtering and pagination |

### 5. Roles

| Operation | Description |
|-----------|-------------|
| Create | Create a new role with name and description |
| Get | Retrieve role details and permissions |
| Update | Update role name, description, and permissions |
| Delete | Remove a role from the tenant |
| List | Get all roles with filtering options |
| Get Permissions | Retrieve permissions assigned to a role |
| Add Permissions | Assign permissions to a role |
| Remove Permissions | Remove permissions from a role |

### 6. Logs

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a specific log entry by log ID |
| List | Get authentication and management logs with filtering |

### 7. Tickets

| Operation | Description |
|-----------|-------------|
| Create Password Change | Create a password change ticket for a user |
| Create Email Verification | Create an email verification ticket for a user |

## Usage Examples

```javascript
// Create a new user with custom metadata
{
  "email": "john.doe@company.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "user_metadata": {
    "department": "Engineering",
    "hire_date": "2024-01-15"
  },
  "app_metadata": {
    "roles": ["developer"],
    "permissions": ["read:projects", "write:code"]
  }
}
```

```javascript
// Create an organization with branding
{
  "name": "acme-corp",
  "display_name": "Acme Corporation",
  "metadata": {
    "industry": "Technology",
    "size": "500-1000",
    "location": "San Francisco, CA"
  },
  "branding": {
    "logo_url": "https://acme-corp.com/logo.png",
    "colors": {
      "primary": "#FF6B35",
      "page_background": "#FFFFFF"
    }
  }
}
```

```javascript
// Configure a social connection
{
  "strategy": "google-oauth2",
  "name": "google-oauth2",
  "options": {
    "client_id": "google-client-id",
    "client_secret": "google-client-secret",
    "allowed_audiences": ["company.com"],
    "scopes": ["email", "profile"]
  },
  "enabled_clients": ["app-client-id"]
}
```

```javascript
// Query authentication logs with filters
{
  "q": "type:s AND connection:Username-Password-Authentication",
  "page": 0,
  "per_page": 50,
  "sort": "date:-1",
  "fields": "date,type,client_name,user_name,ip",
  "include_fields": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API credentials | Verify Client ID, Secret, and Management API access |
| 403 Forbidden | Insufficient scope permissions | Ensure Management API has required scopes enabled |
| 404 Not Found | User, organization, or resource doesn't exist | Verify the resource ID exists in your Auth0 tenant |
| 409 Conflict | Resource already exists or constraint violation | Check for duplicate emails, names, or identifiers |
| 429 Rate Limited | Too many API requests | Implement rate limiting and retry logic in workflows |
| 400 Bad Request | Invalid parameters or payload format | Validate required fields and data types per Auth0 API docs |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-auth0/issues)
- **Auth0 Documentation**: [Auth0 Management API](https://auth0.com/docs/api/management/v2)
- **Auth0 Community**: [Auth0 Community Forum](https://community.auth0.com/)