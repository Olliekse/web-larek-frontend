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
			if (this.state.price) {
				this.emit('product:add', this.state);
			}
		});
	}

	render(data: IProduct): void {
		this.state = data;
		this._title.textContent = data.title;
		this._image.src = data.image;
		this._image.alt = data.title;
		this._description.textContent = data.description;
		this._category.textContent = data.category;
		this._price.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';

		const categoryClasses: { [key: string]: string } = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			'другое': 'other',
			'дополнительное': 'additional',
			'кнопка': 'button'
		};

		const categoryClass = categoryClasses[data.category.toLowerCase()] || data.category.toLowerCase();
		this._category.className = `card__category card__category_${categoryClass}`;
		
		const isInCart = Boolean(data.inCart);
		
		if (!data.price) {
			this._button.disabled = true;
			this._button.textContent = 'Не продается';
		} else if (isInCart) {
			this._button.disabled = true;
			this._button.textContent = 'В корзине';
		} else {
			this._button.disabled = false;
			this._button.textContent = 'В корзину';
		}
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	get description(): string {
		return this._description.textContent || '';
	}

	set description(value: string) {
		this._description.textContent = value;
	}

	get price(): number | null {
		const priceText = this._price.textContent;
		if (!priceText) return null;
		return parseInt(priceText.replace(/\D/g, ''));
	}

	set price(value: number) {
		this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set category(value: string) {
		this._category.textContent = value;
		this._category.className = `card__category card__category_${value.toLowerCase()}`;
	}

	get image(): string {
		return this._image.src;
	}

	set image(value: string) {
		this._image.src = value;
		this._image.alt = this.title;
	}
}
