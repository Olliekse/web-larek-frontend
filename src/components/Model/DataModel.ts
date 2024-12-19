import { IProduct } from '../../types';
import { IEvents } from '../base/events';

export interface IDataModel {
	productCards: IProduct[];
	selectedСard: IProduct;
	setPreview(item: IProduct): void;
}

export class DataModel implements IDataModel {
	protected _productCards: IProduct[];
	selectedСard: IProduct;

	constructor(protected events: IEvents) {
		this._productCards = [];
	}

	set productCards(data: IProduct[]) {
		this._productCards = data;
		this.events.emit('productCards:receive');
	}

	get productCards() {
		return this._productCards;
	}

	setPreview(item: IProduct) {
		this.selectedСard = item;
		this.events.emit('modalCard:open', item);
	}
}
