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

  // получаем массив объектов(карточек) с сервера
  getListProductCard(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  // получаем ответ от сервера по сделанному заказу
  postOrderLot(order: IOrder): Promise<IOrder> {
    return this.post(`/order`, order).then((data: IOrder) => data);
  }
}