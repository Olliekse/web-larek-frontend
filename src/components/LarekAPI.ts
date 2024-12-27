import { IProduct, IOrder, IOrderResult } from '../types';
import { Api, ApiListResponse } from './base/api';

/**
 * API client for handling communication with the backend
 * Extends the base Api class with specific methods for the Web Larek store
 */
export class LarekAPI extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	/**
	 * Fetches the list of products from the API
	 * Adds CDN URL to product images
	 * @returns Promise with array of products
	 */
	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	/**
	 * Creates a new order in the system
	 * @param order Order data to be submitted
	 * @returns Promise with order result
	 */
	createOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
