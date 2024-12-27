/**
 * Generic type for API list responses
 * @template Type The type of items in the response
 */
export type ApiListResponse<Type> = {
	/** Total number of items available */
	total: number;
	/** Array of items returned */
	items: Type[];
};

/**
 * Valid HTTP methods for POST-like operations
 */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/**
 * Base API client class
 * Provides common functionality for making HTTP requests
 */
export class Api {
	/** Base URL for all API requests */
	readonly baseUrl: string;
	/** Default request options */
	protected options: RequestInit;

	/**
	 * Creates a new API client instance
	 * @param {string} baseUrl - Base URL for all API requests
	 * @param {RequestInit} [options={}] - Default fetch options
	 */
	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	/**
	 * Handles API response
	 * Automatically parses JSON and handles errors
	 * @protected
	 * @param {Response} response - Fetch Response object
	 * @returns {Promise<object>} Parsed response data
	 * @throws {string} Error message if request fails
	 */
	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	/**
	 * Makes a GET request to the API
	 * @param {string} uri - URI to append to base URL
	 * @returns {Promise<object>} Parsed response data
	 */
	get(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	/**
	 * Makes a POST, PUT, or DELETE request to the API
	 * @param {string} uri - URI to append to base URL
	 * @param {object} data - Data to send in request body
	 * @param {ApiPostMethods} [method='POST'] - HTTP method to use
	 * @returns {Promise<object>} Parsed response data
	 */
	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}
