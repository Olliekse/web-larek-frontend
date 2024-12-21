import { BaseApi, ApiListResponse } from './BaseApi';
import { IOrder, IProduct } from '../../types';
import { API_CONFIG } from '../../config/api.config';

export interface IProductApi {
	cdn: string;
	items: IProduct[];
	getListProductCard: () => Promise<IProduct[]>;
	postOrderLot: (order: IOrder) => Promise<IOrder>;
}

/** Handles product-related API requests */
export class ProductApi extends BaseApi implements IProductApi {
	cdn: string;
	items: IProduct[];

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	/** Gets list of products from the server */
	getListProductCard(): Promise<IProduct[]> {
		return this.get(API_CONFIG.ENDPOINTS.products).then(
			(data: ApiListResponse<IProduct>) =>
				data.items.map((item) => ({
					...item,
					image: item.image.startsWith('http')
						? item.image
						: this.cdn + item.image,
				}))
		);
	}

	/** Sends order data to the server */
	postOrderLot(order: IOrder): Promise<IOrder> {
		return this.post(API_CONFIG.ENDPOINTS.orders, order).then(
			(data: IOrder) => data
		);
	}
}
