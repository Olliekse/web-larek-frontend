/** Response type for list endpoints */
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

/** Custom API error type */
export type ApiErrorType = 'network' | 'validation' | 'server' | 'auth';

interface ApiErrorResponse {
	error: string;
	code?: string;
	details?: Record<string, string>;
}

export class ApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly message: string,
		public readonly type: ApiErrorType,
		public readonly details?: Record<string, string>
	) {
		super(message);
		this.name = 'ApiError';
	}

	static fromResponse(status: number, data: ApiErrorResponse): ApiError {
		const type = ApiError.getTypeFromStatus(status);
		return new ApiError(status, data.error, type, data.details);
	}

	private static getTypeFromStatus(status: number): ApiErrorType {
		if (status === 0) return 'network';
		if (status === 401 || status === 403) return 'auth';
		if (status === 400 || status === 422) return 'validation';
		return 'server';
	}
}

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

	/**
	 * Handles API response
	 * @throws {ApiError} When response is not ok
	 */
	protected async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			const error = (await response.json().catch(() => ({
				error: response.statusText,
			}))) as ApiErrorResponse;

			throw ApiError.fromResponse(response.status, error);
		}

		try {
			return await response.json();
		} catch (error) {
			throw new ApiError(response.status, 'Invalid JSON response', 'server');
		}
	}

	/**
	 * Makes GET request
	 * @throws {ApiError} When request fails
	 */
	protected async get<T>(uri: string): Promise<T> {
		try {
			const response = await fetch(this.baseUrl + uri, {
				...this.options,
				method: 'GET',
			});
			return this.handleResponse<T>(response);
		} catch (error) {
			if (error instanceof ApiError) throw error;
			throw new ApiError(0, 'Network error', 'network');
		}
	}

	/**
	 * Makes POST request
	 * @throws {ApiError} When request fails
	 */
	protected async post<T>(uri: string, data: object): Promise<T> {
		try {
			const response = await fetch(this.baseUrl + uri, {
				...this.options,
				method: 'POST',
				body: JSON.stringify(data),
			});
			return this.handleResponse<T>(response);
		} catch (error) {
			if (error instanceof ApiError) throw error;
			throw new ApiError(0, 'Network error', 'network');
		}
	}
}
