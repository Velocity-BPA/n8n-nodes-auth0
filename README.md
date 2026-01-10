# n8n-nodes-auth0

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Auth0 Management API providing 8 resources and 80+ operations for user management, organizations, connections, applications, roles, APIs, logs, and actions. Includes OAuth 2.0 token caching and webhook triggers.

![n8n](https://img.shields.io/badge/n8n-community--node-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Features

- **8 Resource Categories**: User, Organization, Connection, Application, Role, Resource Server (API), Log, Action
- **80+ Operations**: Full CRUD operations plus specialized management functions
- **OAuth 2.0 Token Management**: Automatic token refresh with intelligent caching
- **Webhook Triggers**: Real-time event handling via Auth0 Log Streams
- **Pagination Support**: Automatic handling of paginated responses
- **Type-Safe**: Full TypeScript implementation with comprehensive type definitions
- **Error Handling**: Detailed error messages with Auth0-specific error codes

## Installation

### Community Nodes (Recommended)

1. Open n8n and navigate to **Settings** → **Community Nodes**
2. Click **Install a community node**
3. Enter `n8n-nodes-auth0`
4. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the node
npm install n8n-nodes-auth0
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-auth0.git
cd n8n-nodes-auth0

# Install dependencies and build
npm install
npm run build

# Link to n8n (Linux/macOS)
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-auth0

# Restart n8n
```

## Credentials Setup

Create Auth0 Management API credentials with the following configuration:

| Field | Description | Example |
|-------|-------------|---------|
| Domain | Your Auth0 tenant domain | `your-tenant.auth0.com` |
| Client ID | Management API application client ID | `abc123...` |
| Client Secret | Management API application client secret | `xyz789...` |
| Audience | API audience (optional) | `https://your-tenant.auth0.com/api/v2/` |

### Auth0 Setup Steps

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **APIs** → **Auth0 Management API**
3. Go to the **Machine to Machine Applications** tab
4. Authorize your application with the required scopes
5. Copy the Client ID and Client Secret

### Required Scopes

Select the scopes based on the resources you need:

| Resource | Required Scopes |
|----------|-----------------|
| User | `read:users`, `create:users`, `update:users`, `delete:users` |
| Organization | `read:organizations`, `create:organizations`, `update:organizations`, `delete:organizations`, `read:organization_members`, `create:organization_members`, `delete:organization_members`, `read:organization_connections`, `create:organization_connections`, `delete:organization_connections`, `read:organization_invitations`, `create:organization_invitations`, `delete:organization_invitations`, `read:organization_member_roles`, `create:organization_member_roles`, `delete:organization_member_roles` |
| Connection | `read:connections`, `create:connections`, `update:connections`, `delete:connections` |
| Application | `read:clients`, `create:clients`, `update:clients`, `delete:clients`, `read:client_credentials`, `create:client_credentials`, `delete:client_credentials` |
| Role | `read:roles`, `create:roles`, `update:roles`, `delete:roles`, `read:role_members`, `create:role_members`, `delete:role_members` |
| Resource Server | `read:resource_servers`, `create:resource_servers`, `update:resource_servers`, `delete:resource_servers` |
| Log | `read:logs` |
| Action | `read:actions`, `create:actions`, `update:actions`, `delete:actions`, `read:triggers`, `update:triggers` |

## Resources & Operations

### User

Manage Auth0 users and their identities.

| Operation | Description |
|-----------|-------------|
| Create | Create a new user |
| Get | Get user by ID |
| Get by Email | Search user by email |
| Get Many | List all users with pagination |
| Update | Update user properties |
| Delete | Remove user permanently |
| Block | Block user from logging in |
| Unblock | Unblock blocked user |
| Get Roles | List roles assigned to user |
| Assign Roles | Assign roles to user |
| Remove Roles | Remove roles from user |
| Get Permissions | List user permissions |
| Assign Permissions | Assign direct permissions |
| Remove Permissions | Remove permissions |
| Get Logs | Get user's log events |
| Get Enrollments | List MFA enrollments |
| Delete Enrollment | Remove MFA enrollment |
| Invalidate Browsers | Invalidate remembered browsers |
| Link Accounts | Link identity accounts |
| Unlink Accounts | Unlink identity accounts |

### Organization

Manage organizations for B2B use cases.

| Operation | Description |
|-----------|-------------|
| Create | Create new organization |
| Get | Get organization by ID or name |
| Get Many | List all organizations |
| Update | Update organization settings |
| Delete | Remove organization |
| Get Members | List organization members |
| Add Members | Add users to organization |
| Remove Members | Remove users from organization |
| Get Member Roles | Get roles for member |
| Assign Member Roles | Assign roles to member |
| Remove Member Roles | Remove roles from member |
| Get Connections | List enabled connections |
| Add Connection | Enable connection |
| Remove Connection | Disable connection |
| Get Invitations | List pending invitations |
| Create Invitation | Invite user |
| Delete Invitation | Cancel invitation |

### Connection

Manage identity connections and authentication sources.

| Operation | Description |
|-----------|-------------|
| Create | Create new connection |
| Get | Get connection by ID |
| Get Many | List all connections |
| Update | Update connection settings |
| Delete | Remove connection |
| Get Status | Check connection health |

**Supported Strategies**: auth0, google-oauth2, facebook, twitter, linkedin, github, windowslive, waad, samlp, oidc, ad, email, sms, apple, okta

### Application (Client)

Manage Auth0 applications and credentials.

| Operation | Description |
|-----------|-------------|
| Create | Create new application |
| Get | Get application by ID |
| Get Many | List all applications |
| Update | Update application settings |
| Delete | Remove application |
| Rotate Secret | Rotate client secret |
| Get Credentials | List application credentials |
| Create Credential | Create credential |
| Delete Credential | Remove credential |

**App Types**: spa, native, regular_web, non_interactive

### Role

Manage roles and role assignments.

| Operation | Description |
|-----------|-------------|
| Create | Create new role |
| Get | Get role by ID |
| Get Many | List all roles |
| Update | Update role details |
| Delete | Remove role |
| Get Permissions | List role permissions |
| Add Permissions | Add permissions to role |
| Remove Permissions | Remove permissions |
| Get Users | List users with role |
| Assign Users | Assign users to role |
| Remove Users | Remove users from role |

### Resource Server (API)

Manage APIs and their scopes.

| Operation | Description |
|-----------|-------------|
| Create | Create new API |
| Get | Get API by ID |
| Get Many | List all APIs |
| Update | Update API settings |
| Delete | Remove API |

### Log

Access Auth0 log events.

| Operation | Description |
|-----------|-------------|
| Get | Get specific log event |
| Get Many | List log events with filters |
| Search | Search logs with Lucene query |

### Action

Manage Auth0 Actions for extensibility.

| Operation | Description |
|-----------|-------------|
| Create | Create new action |
| Get | Get action by ID |
| Get Many | List all actions |
| Update | Update action code/settings |
| Delete | Remove action |
| Deploy | Deploy action version |
| Get Triggers | List available triggers |
| Get Trigger Bindings | List actions bound to trigger |
| Update Trigger Bindings | Update bindings |

**Supported Triggers**: post-login, credentials-exchange, pre-user-registration, post-user-registration, post-change-password, send-phone-message

## Trigger Node

The Auth0 Trigger node receives events from Auth0 Log Streams via webhooks.

### Supported Events

- Success Login / Failed Login
- Success Signup / Failed Signup
- Password Change Success / Failure
- Email Verification Success
- MFA Challenge Success / Failure
- Guardian MFA Events
- User Blocked / Deleted
- API Operations
- Rate Limit Events

### Setup

1. Add the Auth0 Trigger node to your workflow
2. Copy the webhook URL
3. In Auth0 Dashboard, go to **Monitoring** → **Streams** → **Create Log Stream**
4. Select **Webhook** and configure the endpoint
5. Select the event types to stream

## Usage Examples

### Create a User

```javascript
// Node Configuration
Resource: User
Operation: Create
Connection: Username-Password-Authentication
Email: user@example.com
Password: SecurePassword123!
Email Verified: true
User Metadata: {"department": "Engineering"}
```

### Search Users by Email

```javascript
// Node Configuration
Resource: User
Operation: Get by Email
Email: user@example.com
```

### List Organization Members

```javascript
// Node Configuration
Resource: Organization
Operation: Get Members
Organization ID: org_abc123
Return All: true
```

### Search Logs

```javascript
// Node Configuration
Resource: Log
Operation: Search
Query: type:s AND user_name:*@example.com
Sort Direction: Newest First
Limit: 100
```

## Auth0 Concepts

### User IDs

Auth0 user IDs follow the format `provider|id`:
- Database users: `auth0|507f1f77bcf86cd799439011`
- Social users: `google-oauth2|115015401084603946628`
- Enterprise users: `waad|user@domain.com`

### Organizations

Organizations enable B2B scenarios with isolated member pools, branding, and connection settings. Each organization can have its own members, roles, and enabled connections.

### Actions

Auth0 Actions are serverless functions that run at specific points in the authentication flow (triggers). They can modify claims, enrich user profiles, or integrate with external systems.

## Error Handling

The node provides detailed error messages from the Auth0 API:

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Bad Request | Validation errors in request body |
| 401 | Unauthorized | Invalid or expired token |
| 403 | Forbidden | Insufficient API scopes |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 429 | Too Many Requests | Rate limit exceeded |

## Security Best Practices

1. **Use least privilege**: Only grant required scopes to your Management API application
2. **Protect credentials**: Store client secrets securely, never in code
3. **Monitor access**: Review Auth0 logs for suspicious Management API activity
4. **Rotate secrets**: Periodically rotate client secrets
5. **Limit access**: Restrict Management API access to specific IP addresses if possible

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-auth0/issues)
- [Auth0 Documentation](https://auth0.com/docs)
- [n8n Community](https://community.n8n.io/)

## Acknowledgments

- [Auth0](https://auth0.com/) for their excellent identity platform
- [n8n](https://n8n.io/) for the workflow automation platform
- The open source community for inspiration and guidance
