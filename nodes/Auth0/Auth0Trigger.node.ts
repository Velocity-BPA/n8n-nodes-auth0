/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';


// Log licensing notice once on module load
const LICENSING_NOTICE = `
[Velocity BPA Licensing Notice]
This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`;

let licensingNoticeLogged = false;

export class Auth0Trigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Auth0 Trigger',
		name: 'auth0Trigger',
		icon: 'file:auth0.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Receive events from Auth0 Log Streams',
		defaults: {
			name: 'Auth0 Trigger',
		},
		inputs: [],
		outputs: ['main'] as const,
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				options: [
					{
						name: 'API Operation',
						value: 'sapi',
						description: 'API operation events',
					},
					{
						name: 'Email Verification Success',
						value: 'sv',
						description: 'Email verification success',
					},
					{
						name: 'Failed Exchange',
						value: 'fce',
						description: 'Failed exchange authorization code for tokens',
					},
					{
						name: 'Failed Login',
						value: 'f',
						description: 'Failed login attempt',
					},
					{
						name: 'Failed Logout',
						value: 'flo',
						description: 'Failed logout',
					},
					{
						name: 'Failed Signup',
						value: 'fs',
						description: 'Failed signup attempt',
					},
					{
						name: 'Guardian - MFA Factor Enrolled',
						value: 'gd_enrollment_complete',
						description: 'MFA factor enrolled',
					},
					{
						name: 'Guardian - MFA Started',
						value: 'gd_start_auth',
						description: 'MFA authentication started',
					},
					{
						name: 'Limit - Anomaly Detection',
						value: 'limit_wc',
						description: 'Anomaly detection blocked login',
					},
					{
						name: 'Limit - Rate Limit',
						value: 'limit_mu',
						description: 'Rate limit hit',
					},
					{
						name: 'MFA Challenge Failure',
						value: 'mfar',
						description: 'MFA challenge failed',
					},
					{
						name: 'MFA Challenge Success',
						value: 'mfa',
						description: 'MFA challenge succeeded',
					},
					{
						name: 'Password Change Failure',
						value: 'fcp',
						description: 'Failed password change',
					},
					{
						name: 'Password Change Success',
						value: 'scp',
						description: 'Successful password change',
					},
					{
						name: 'Success Exchange',
						value: 'sce',
						description: 'Successful exchange authorization code for tokens',
					},
					{
						name: 'Success Login',
						value: 's',
						description: 'Successful login',
					},
					{
						name: 'Success Logout',
						value: 'slo',
						description: 'Successful logout',
					},
					{
						name: 'Success Signup',
						value: 'ss',
						description: 'Successful signup',
					},
					{
						name: 'User Blocked',
						value: 'limit_ui',
						description: 'User blocked due to suspicious activity',
					},
					{
						name: 'User Deleted',
						value: 'du',
						description: 'User deleted',
					},
				],
				description: 'The events to listen for',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Full Event Data',
						name: 'includeFullData',
						type: 'boolean',
						default: true,
						description: 'Whether to include the full event data or just the summary',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Log licensing notice once
				if (!licensingNoticeLogged) {
					console.warn(LICENSING_NOTICE);
					licensingNoticeLogged = true;
				}
				
				// For webhook-based triggers, we return true as the webhook URL
				// needs to be manually configured in Auth0 Log Streams
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Auth0 Log Streams require manual configuration
				// Return true to indicate the webhook is ready
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Log streams need to be manually removed from Auth0
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		const events = this.getNodeParameter('events', []) as string[];
		const options = this.getNodeParameter('options', {}) as IDataObject;

		// Auth0 sends log events as an array
		let logEvents: IDataObject[] = [];

		if (Array.isArray(bodyData)) {
			logEvents = bodyData as IDataObject[];
		} else if (bodyData.logs && Array.isArray(bodyData.logs)) {
			logEvents = bodyData.logs as IDataObject[];
		} else if (bodyData.data) {
			// Handle single event or data wrapper
			logEvents = Array.isArray(bodyData.data) 
				? bodyData.data as IDataObject[]
				: [bodyData.data as IDataObject];
		} else {
			// Single event
			logEvents = [bodyData as IDataObject];
		}

		// Filter events based on selected event types
		const filteredEvents = events.length > 0
			? logEvents.filter((event) => {
					const eventType = event.type as string;
					return events.includes(eventType);
				})
			: logEvents;

		if (filteredEvents.length === 0) {
			// No matching events, still acknowledge the webhook
			return {
				noWebhookResponse: true,
			};
		}

		// Format output based on options
		const returnData = filteredEvents.map((event) => {
			if (options.includeFullData === false) {
				// Return summary only
				return {
					json: {
						type: event.type,
						description: event.description,
						date: event.date,
						user_id: event.user_id,
						user_name: event.user_name,
						ip: event.ip,
						client_id: event.client_id,
						client_name: event.client_name,
					} as IDataObject,
				};
			}
			return { json: event };
		});

		return {
			workflowData: [returnData],
		};
	}
}
