import { ApiListResponse, Api } from '../base/api'
import { IOrder, IProduct } from '../../types/index';

export interface IApiModel {
  cdn: string;
  items: IProduct[];
  getListProductCard: () => Promise<IProduct[]>;
  postOrderLot: (order: IOrder) => Promise<IOrder>;
}

export class ApiModel extends Api {
  cdn: string;
  items: IProduct[];

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getListProductCard(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: item.image.startsWith('http') ? item.image : this.cdn + item.image
      }))
    );
  }

  postOrderLot(order: IOrder): Promise<IOrder> {
    return this.post(`/order`, order).then((data: IOrder) => data);
  }
}