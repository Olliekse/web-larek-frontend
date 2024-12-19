import { IProduct } from '../../types';
import { IEvents } from '../base/events';

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	render(data: IProduct): HTMLElement;
	setCategory(value: string): void;
}

export class Card implements ICard {
	protected readonly elements: {
		card: HTMLElement;
		category: HTMLElement;
		title: HTMLElement;
		image: HTMLImageElement;
		price: HTMLElement;
	};
	protected cartItems: IProduct[] = [];

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		protected actions?: IActions
	) {
		this.elements = {
				card: template.content.querySelector('.card').cloneNode(true) as HTMLElement,
				category: null,
				title: null,
				image: null,
				price: null
		};

		this.initializeElements();

		if (actions?.onClick) {
			this.elements.card.addEventListener('click', actions.onClick);
		}
	}

	protected initializeElements(): void {
		const { card } = this.elements;
		this.elements.category = card.querySelector('.card__category');
		this.elements.title = card.querySelector('.card__title');
		this.elements.image = card.querySelector('.card__image');
		this.elements.price = card.querySelector('.card__price');
	}

	render(data: IProduct): HTMLElement {
		const cardElement = this.elements.card.cloneNode(true) as HTMLElement;
		
		const category = cardElement.querySelector('.card__category');
		const title = cardElement.querySelector('.card__title');
		const image = cardElement.querySelector('.card__image') as HTMLImageElement;
		const price = cardElement.querySelector('.card__price');

		category.textContent = data.category;
		category.className = `card__category card__category_${this.getCategoryClass(data.category)}`;
		
		title.textContent = data.title;
		image.src = data.image;
		image.alt = data.title;
		price.textContent = this.formatPrice(data.price);

		return cardElement;
	}

	protected getCategoryClass(category: string): string {
		const categoryMap: Record<string, string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			'другое': 'other',
			'дополнительное': 'additional',
			'кнопка': 'button'
		};
		return categoryMap[category as keyof typeof categoryMap] || 'other';
	}

	protected formatPrice(price: number | undefined): string {
		if (price === undefined || price === null) {
			return 'Бесценно';
		}
		return `${price} синапсов`;
	}

	setCategory(value: string): void {
		const categoryElement = this.elements.card.querySelector('.card__category');
		if (categoryElement) {
			categoryElement.textContent = value;
		}
	}
}
