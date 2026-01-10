/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

export interface IAuth0User extends IDataObject {
	user_id?: string;
	email?: string;
	email_verified?: boolean;
	username?: string;
	phone_number?: string;
	phone_verified?: boolean;
	created_at?: string;
	updated_at?: string;
	identities?: IAuth0Identity[];
	app_metadata?: IDataObject;
	user_metadata?: IDataObject;
	picture?: string;
	name?: string;
	nickname?: string;
	multifactor?: string[];
	last_ip?: string;
	last_login?: string;
	logins_count?: number;
	blocked?: boolean;
	given_name?: string;
	family_name?: string;
}

export interface IAuth0Identity extends IDataObject {
	connection?: string;
	user_id?: string;
	provider?: string;
	isSocial?: boolean;
}

export interface IAuth0Organization extends IDataObject {
	id?: string;
	name?: string;
	display_name?: string;
	branding?: IAuth0Branding;
	metadata?: IDataObject;
	enabled_connections?: IAuth0EnabledConnection[];
}

export interface IAuth0Branding extends IDataObject {
	logo_url?: string;
	colors?: {
		primary?: string;
		page_background?: string;
	};
}

export interface IAuth0EnabledConnection extends IDataObject {
	connection_id?: string;
	assign_membership_on_login?: boolean;
	show_as_button?: boolean;
}

export interface IAuth0Connection extends IDataObject {
	id?: string;
	name?: string;
	strategy?: string;
	options?: IDataObject;
	enabled_clients?: string[];
	realms?: string[];
	metadata?: IDataObject;
	is_domain_connection?: boolean;
}

export interface IAuth0Application extends IDataObject {
	client_id?: string;
	name?: string;
	description?: string;
	app_type?: string;
	logo_uri?: string;
	callbacks?: string[];
	allowed_logout_urls?: string[];
	allowed_origins?: string[];
	web_origins?: string[];
	grant_types?: string[];
	client_secret?: string;
	jwt_configuration?: IAuth0JWTConfiguration;
	encryption_key?: IDataObject;
	sso?: boolean;
	cross_origin_auth?: boolean;
	cross_origin_loc?: string;
	custom_login_page_on?: boolean;
	custom_login_page?: string;
	custom_login_page_preview?: string;
	form_template?: string;
	is_heroku_app?: boolean;
	addons?: IDataObject;
	token_endpoint_auth_method?: string;
	client_metadata?: IDataObject;
	mobile?: IDataObject;
	initiate_login_uri?: string;
	native_social_login?: IDataObject;
	refresh_token?: IDataObject;
}

export interface IAuth0JWTConfiguration extends IDataObject {
	lifetime_in_seconds?: number;
	scopes?: IDataObject;
	alg?: string;
	secret_encoded?: boolean;
}

export interface IAuth0Role extends IDataObject {
	id?: string;
	name?: string;
	description?: string;
}

export interface IAuth0Permission extends IDataObject {
	permission_name?: string;
	description?: string;
	resource_server_identifier?: string;
	resource_server_name?: string;
}

export interface IAuth0ResourceServer extends IDataObject {
	id?: string;
	identifier?: string;
	name?: string;
	scopes?: IAuth0Scope[];
	signing_alg?: string;
	signing_secret?: string;
	allow_offline_access?: boolean;
	skip_consent_for_verifiable_first_party_clients?: boolean;
	token_lifetime?: number;
	token_lifetime_for_web?: number;
	enforce_policies?: boolean;
	token_dialect?: string;
}

export interface IAuth0Scope extends IDataObject {
	value?: string;
	description?: string;
}

export interface IAuth0Log extends IDataObject {
	log_id?: string;
	date?: string;
	type?: string;
	description?: string;
	connection?: string;
	connection_id?: string;
	client_id?: string;
	client_name?: string;
	ip?: string;
	user_agent?: string;
	details?: IDataObject;
	user_id?: string;
	user_name?: string;
	audience?: string;
	scope?: string;
	strategy?: string;
	strategy_type?: string;
	hostname?: string;
	auth0_client?: IDataObject;
	location_info?: IDataObject;
}

export interface IAuth0Action extends IDataObject {
	id?: string;
	name?: string;
	supported_triggers?: IAuth0Trigger[];
	code?: string;
	dependencies?: IAuth0Dependency[];
	runtime?: string;
	secrets?: IAuth0Secret[];
	deployed_version?: IDataObject;
	installed_integration_id?: string;
	integration?: IDataObject;
	status?: string;
	all_changes_deployed?: boolean;
	created_at?: string;
	updated_at?: string;
}

export interface IAuth0Trigger extends IDataObject {
	id?: string;
	version?: string;
}

export interface IAuth0Dependency extends IDataObject {
	name?: string;
	version?: string;
}

export interface IAuth0Secret extends IDataObject {
	name?: string;
	value?: string;
	updated_at?: string;
}

export interface IAuth0Invitation extends IDataObject {
	id?: string;
	organization_id?: string;
	inviter?: IDataObject;
	invitee?: IDataObject;
	invitation_url?: string;
	created_at?: string;
	expires_at?: string;
	client_id?: string;
	connection_id?: string;
	app_metadata?: IDataObject;
	user_metadata?: IDataObject;
	roles?: string[];
	ticket_id?: string;
}

export interface IAuth0MFAEnrollment extends IDataObject {
	id?: string;
	status?: string;
	type?: string;
	name?: string;
	identifier?: string;
	phone_number?: string;
	auth_method?: string;
	enrolled_at?: string;
	last_auth?: string;
}

export type Auth0Resource =
	| 'user'
	| 'organization'
	| 'connection'
	| 'application'
	| 'role'
	| 'resourceServer'
	| 'log'
	| 'action';

export type UserOperation =
	| 'create'
	| 'get'
	| 'getByEmail'
	| 'getAll'
	| 'update'
	| 'delete'
	| 'block'
	| 'unblock'
	| 'getRoles'
	| 'assignRoles'
	| 'removeRoles'
	| 'getPermissions'
	| 'assignPermissions'
	| 'removePermissions'
	| 'getLogs'
	| 'getEnrollments'
	| 'deleteEnrollment'
	| 'invalidateBrowsers'
	| 'linkAccounts'
	| 'unlinkAccounts';

export type OrganizationOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete'
	| 'getMembers'
	| 'addMembers'
	| 'removeMembers'
	| 'getMemberRoles'
	| 'assignMemberRoles'
	| 'removeMemberRoles'
	| 'getConnections'
	| 'addConnection'
	| 'removeConnection'
	| 'getInvitations'
	| 'createInvitation'
	| 'deleteInvitation';

export type ConnectionOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete'
	| 'getStatus';

export type ApplicationOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete'
	| 'rotateSecret'
	| 'getCredentials'
	| 'createCredential'
	| 'deleteCredential';

export type RoleOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete'
	| 'getPermissions'
	| 'addPermissions'
	| 'removePermissions'
	| 'getUsers'
	| 'assignUsers'
	| 'removeUsers';

export type ResourceServerOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete';

export type LogOperation = 'get' | 'getAll' | 'search';

export type ActionOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete'
	| 'deploy'
	| 'getTriggers'
	| 'getTriggerBindings'
	| 'updateTriggerBindings';
