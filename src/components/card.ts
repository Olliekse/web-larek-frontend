import { View } from './base/view';
import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';

export class ProductCard extends View<IProduct> {
	private static template = ensureElement<HTMLTemplateElement>('#card-catalog');
	private _title: HTMLElement;
	private _price: HTMLElement;
	private _category: HTMLElement;
	private _image: HTMLImageElement;

	constructor(container: HTMLElement) {
		super(container);

		const content = (this.constructor as typeof ProductCard).template.content.cloneNode(true) as HTMLElement;
		const button = content.querySelector('.card') as HTMLButtonElement;
		if (!button) {
			throw new Error('Card button not found in template');
		}

		this._title = ensureElement<HTMLElement>('.card__title', button);
		this._price = ensureElement<HTMLElement>('.card__price', button);
		this._category = ensureElement<HTMLElement>('.card__category', button);
		this._image = ensureElement<HTMLImageElement>('.card__image', button);

		button.addEventListener('click', () => {
			this.emit('card:select', this.state);
		});

		this.container.append(button);
	}

	render(data: IProduct): void {
		this.state = data;
		this.title = data.title;
		this.price = data.price;
		this.category = data.category;
		this.image = data.image;
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	get price(): number | null {
		const priceText = this._price.textContent;
		if (!priceText) return null;
		return parseInt(priceText.replace(/\D/g, ''));
	}

	set price(value: number) {
		this._price.textContent = value ? `${value} синапсов` : 'Цена по запросу';
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set category(value: string) {
		this._category.textContent = value;
		
		const categoryClasses: { [key: string]: string } = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			'другое': 'other',
			'дополнительное': 'additional',
			'кнопка': 'button'
		};

		const categoryClass = categoryClasses[value.toLowerCase()] || value.toLowerCase();
		this._category.className = `card__category card__category_${categoryClass}`;
	}

	get image(): string {
		return this._image.src;
	}

	set image(value: string) {
		this._image.src = value;
		this._image.alt = this.title;
	}
}
