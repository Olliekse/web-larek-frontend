import { View } from './base/view';
import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';

export class ProductCard extends View<IProduct> {
	private static template = ensureElement<HTMLTemplateElement>('#card-catalog');

	private _title: HTMLElement;
	private _price: HTMLElement;
	private _category: HTMLElement;
	private _image = ensureElement<HTMLImageElement>(
		'.card__image',
		this.container
	);
	private _button: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._category = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);
		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._button = ensureElement<HTMLElement>('.button', this.container);

		this._button.addEventListener('click', this.handleClick.bind(this));
	}

	render(data: IProduct): void {
		this.state = data;
		this._title.textContent = data.title;
		this._price.textContent = `${data.price} синапсов`;
		this._category.textContent = data.category;
		this._image.src = data.image;
		this._image.alt = data.title;
	}

	private handleClick(): void {
		this.emit('card:click', this.state);
	}
}
