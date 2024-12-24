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
}

/** Base abstract class for all card components */
export abstract class BaseCard implements ICard {
	protected elements: {
		title?: HTMLElement;
		price?: HTMLElement;
	} = {};

	constructor(
		protected events: IEvents,
		protected domService: IDOMService,
		protected actions?: IActions
	) {}

	abstract render(data: IProduct): HTMLElement;

	protected formatPrice(price: number | undefined): string {
		if (price === undefined || price === null) {
			return 'Бесценно';
		}
		return `${price} синапсов`;
	}

	protected initializeCommonElements(container: HTMLElement): void {
		this.elements.title = container.querySelector('.card__title');
		this.elements.price = container.querySelector('.card__price');
	}

	protected renderCommonElements(data: IProduct): void {
		if (this.elements.title) {
			this.domService.setContent(this.elements.title, data.title);
		}
		if (this.elements.price) {
			this.domService.setContent(
				this.elements.price,
				this.formatPrice(data.price)
			);
		}
	}
}

/** Product catalog card implementation */
export class Card extends BaseCard {
	protected readonly elements: {
		card: HTMLElement;
		category: HTMLElement;
		title: HTMLElement;
		image: HTMLImageElement;
		price: HTMLElement;
	};

	constructor(
		template: HTMLTemplateElement,
		events: IEvents,
		domService: IDOMService,
		actions?: IActions
	) {
		super(events, domService, actions);

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

	protected initializeElements(): void {
		const { card } = this.elements;
		this.elements.category = card.querySelector('.card__category');
		this.initializeCommonElements(card);
		this.elements.image = card.querySelector('.card__image');
	}

	render(data: IProduct): HTMLElement {
		const cardElement = this.elements.card.cloneNode(true) as HTMLElement;
		const category = cardElement.querySelector(
			'.card__category'
		) as HTMLElement;
		const image = cardElement.querySelector('.card__image') as HTMLImageElement;

		this.domService.setContent(category, data.category);
		this.domService.addClass(
			category,
			`card__category_${this.getCategoryClass(data.category)}`
		);

		this.domService.setAttributes(image, {
			src: data.image,
			alt: data.title,
		});

		this.initializeCommonElements(cardElement);
		this.renderCommonElements(data);

		return cardElement;
	}

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

	setCategory(value: string): void {
		if (this.elements.category) {
			this.domService.setContent(this.elements.category, value);
		}
	}
}
