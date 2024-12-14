import { View } from './base/view';
import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';

export class ProductDetails extends View<IProduct> {
	private static template = ensureElement<HTMLTemplateElement>('#card-preview');
	private _title: HTMLElement;
	private _image: HTMLImageElement;
	private _description: HTMLElement;
	private _category: HTMLElement;
	private _price: HTMLElement;
	private _button: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);

		const content = (
			this.constructor as typeof ProductDetails
		).template.content.cloneNode(true) as HTMLElement;
		this.container.append(content);

		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._description = ensureElement<HTMLElement>(
			'.card__text',
			this.container
		);
		this._category = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.container
		);

		this._button.addEventListener('click', () => {
			this.emit('product:add', this.state);
		});
	}

	render(data: IProduct): void {
		this.state = data;
		this._title.textContent = data.title;
		this._image.src = data.image;
		this._image.alt = data.title;
		this._description.textContent = data.description;
		this._category.textContent = data.category;
		this._price.textContent = `${data.price} синапсов`;
		this._category.className = `card__category card__category_${data.category.toLowerCase()}`;
	}
}
