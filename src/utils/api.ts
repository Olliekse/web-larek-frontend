import { IProduct } from "../types";

import { IOrder } from '../types';

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
	readonly baseUrl: string;
	readonly cdn: string;
	protected options: RequestInit;

	constructor(baseUrl: string, cdn: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.cdn = cdn;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		return response.json().then((data) => {
			const errorMessage = data.error?.message || data.error || data.message || response.statusText;
			console.error('API Error:', {
				status: response.status,
				statusText: response.statusText,
				data,
				errorMessage
			});
			throw new Error(errorMessage);
		});
	}

	get(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		console.log('API Request:', {
			url: this.baseUrl + uri,
			method,
			data
		});
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
	getProducts() {
		return this.get('/product').then((data: ApiListResponse<IProduct>) => {
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		});
	}

	orderProducts(order: IOrder) {
		console.log('Raw order data:', JSON.stringify(order, null, 2));

		return this.post('/order', order).then(response => {
			console.log('API Response:', response);
			return response as { id: string };
		});
	}
}
