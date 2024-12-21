/** Response type for list endpoints */
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

/** Base class for API communication */
export class BaseApi {
	protected options: RequestInit;

	/**
	 * Creates API instance
	 * @param baseUrl - Server URL
	 * @param options - Request settings
	 */
	constructor(protected baseUrl: string, options: RequestInit = {}) {
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse(response: Response): Promise<any> {
		if (response.ok) return response.json();
		return response
			.json()
			.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	protected get(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	protected post(uri: string, data: object) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'POST',
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}
