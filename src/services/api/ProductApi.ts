import { BaseApi, ApiListResponse, ApiError } from './BaseApi';
import { IOrder, IProduct } from '../../types';
import { API_CONFIG } from '../../config/api.config';

export interface IProductApi {
	readonly cdn: string;
	getListProductCard(): Promise<IProduct[]>;
	orderProducts(order: IOrder): Promise<{ id: string }>;
}

/** Handles product-related API requests */
export class ProductApi extends BaseApi implements IProductApi {
	constructor(
		public readonly cdn: string,
		baseUrl: string,
		options?: RequestInit
	) {
		super(baseUrl, options);
	}

	/**
	 * Gets list of products from the server
	 * @throws {ApiError} When products cannot be fetched
	 */
	async getListProductCard(): Promise<IProduct[]> {
		const data = await this.get<ApiListResponse<IProduct>>(
			API_CONFIG.ENDPOINTS.products
		);

		return data.items.map((item: IProduct) => ({
			...item,
			image: item.image.startsWith('http') ? item.image : this.cdn + item.image,
		}));
	}

	/**
	 * Orders products from the server
	 * @throws {ApiError} When order cannot be processed
	 */
	async orderProducts(order: IOrder): Promise<{ id: string }> {
		return this.post<{ id: string }>(API_CONFIG.ENDPOINTS.orders, order);
	}
}
