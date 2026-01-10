/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';
import { LOG_EVENT_TYPES } from '../../utils/helpers';

export const logOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['log'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific log event',
				action: 'Get a log event',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many log events',
				action: 'Get many log events',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search log events with Lucene query',
				action: 'Search log events',
			},
		],
		default: 'getAll',
	},
];

export const logFields: INodeProperties[] = [
	// ----------------------------------
	//         log:get
	// ----------------------------------
	{
		displayName: 'Log ID',
		name: 'logId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['get'],
			},
		},
		description: 'The ID of the log event',
	},

	// ----------------------------------
	//         log:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Event Types',
				name: 'type',
				type: 'multiOptions',
				options: LOG_EVENT_TYPES.map((type) => ({
					name: `${type.name} (${type.value})`,
					value: type.value,
				})),
				default: [],
				description: 'Filter by log event type',
			},
			{
				displayName: 'From Log ID',
				name: 'from',
				type: 'string',
				default: '',
				description: 'Log ID to start from (for pagination)',
			},
			{
				displayName: 'Include Totals',
				name: 'include_totals',
				type: 'boolean',
				default: false,
				description: 'Whether to include total count in response',
			},
			{
				displayName: 'Sort Direction',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Newest First', value: 'date:-1' },
					{ name: 'Oldest First', value: 'date:1' },
				],
				default: 'date:-1',
				description: 'Sort order for log events',
			},
		],
	},

	// ----------------------------------
	//         log:search
	// ----------------------------------
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['search'],
			},
		},
		description: 'Lucene query string for searching logs. Example: type:s OR type:f',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['search'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['search'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['log'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'From Log ID',
				name: 'from',
				type: 'string',
				default: '',
				description: 'Log ID to start from (for pagination)',
			},
			{
				displayName: 'Include Totals',
				name: 'include_totals',
				type: 'boolean',
				default: false,
				description: 'Whether to include total count in response',
			},
			{
				displayName: 'Sort Direction',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Newest First', value: 'date:-1' },
					{ name: 'Oldest First', value: 'date:1' },
				],
				default: 'date:-1',
				description: 'Sort order for log events',
			},
		],
	},
];
