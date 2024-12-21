import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { IDOMService } from '../../services/DOMService';

/** Interface for card click actions */
export interface IActions {
	onClick: (event: MouseEvent) => void;
}

/** Interface defining required card functionality */
export interface ICard {
	render(data: IProduct): HTMLElement;
	setCategory(value: string): void;
}

/** Base class for card components */
export class Card implements ICard {
	protected readonly elements: {
		card: HTMLElement;
		category: HTMLElement;
		title: HTMLElement;
		image: HTMLImageElement;
		price: HTMLElement;
	};

	/**
	 * Creates a new Card instance
	 * @param template - HTML template for the card
	 * @param events - Event emitter instance
	 * @param domService - DOM manipulation service
	 * @param actions - Optional click handlers
	 */
	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		protected domService: IDOMService,
		protected actions?: IActions
	) {
		this.elements = {
			card: template.content
				.querySelector('.card')
				.cloneNode(true) as HTMLElement,
			category: null,
			title: null,
			image: null,
			price: null,
		};

		this.initializeElements();

		if (actions?.onClick) {
			this.elements.card.addEventListener('click', actions.onClick);
		}
	}

	/**
	 * Initializes card elements from the template
	 */
	protected initializeElements(): void {
		const { card } = this.elements;
		this.elements.category = card.querySelector('.card__category');
		this.elements.title = card.querySelector('.card__title');
		this.elements.image = card.querySelector('.card__image');
		this.elements.price = card.querySelector('.card__price');
	}

	/**
	 * Renders the card with product data
	 * @param data - Product data to display
	 * @returns HTMLElement - The rendered card element
	 */
	render(data: IProduct): HTMLElement {
		const cardElement = this.elements.card.cloneNode(true) as HTMLElement;
		const category = cardElement.querySelector(
			'.card__category'
		) as HTMLElement;
		const title = cardElement.querySelector('.card__title') as HTMLElement;
		const image = cardElement.querySelector('.card__image') as HTMLImageElement;
		const price = cardElement.querySelector('.card__price') as HTMLElement;

		this.domService.setContent(category, data.category);
		this.domService.addClass(
			category,
			`card__category_${this.getCategoryClass(data.category)}`
		);

		this.domService.setContent(title, data.title);
		this.domService.setAttributes(image, {
			src: data.image,
			alt: data.title,
		});
		this.domService.setContent(price, this.formatPrice(data.price));

		return cardElement;
	}

	/**
	 * Maps Russian category names to CSS class names
	 * @param category - Category name in Russian
	 * @returns CSS class name suffix
	 */
	protected getCategoryClass(category: string): string {
		const categoryMap: Record<string, string> = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			другое: 'other',
			дополнительное: 'additional',
			кнопка: 'button',
		};
		return categoryMap[category as keyof typeof categoryMap] || 'other';
	}

	/**
	 * Formats the price for display
	 * @param price - Product price in synapses
	 * @returns Formatted price string
	 */
	protected formatPrice(price: number | undefined): string {
		if (price === undefined || price === null) {
			return 'Бесценно';
		}
		return `${price} синапсов`;
	}

	/**
	 * Updates the category display
	 * @param value - New category value to display
	 */
	setCategory(value: string): void {
		if (this.elements.category) {
			this.domService.setContent(this.elements.category, value);
		}
	}
}
