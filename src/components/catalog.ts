import { View } from './base/view';
import { IProduct } from '../types';
import { ProductCard } from './card';
import { createElement } from '../utils/utils';

export class Catalog extends View<IProduct[]> {
	protected _products: ProductCard[] = [];

	constructor(container: HTMLElement) {
		super(container);
	}

	render(data: IProduct[]): void {
		this.container.innerHTML = '';

		this._products = data.map((product) => {
			const card = new ProductCard(this.container);
			card.render(product);

			card.on('card:select', (product: IProduct) => {
				this.emit('card:select', product);
			});

			return card;
		});
	}
}
