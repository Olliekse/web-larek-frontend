import { Card } from './CardView';
import { IEvents } from '../base/events';
import { IProduct } from '../../types';
import { IDOMService } from '../../services/DOMService';

export interface ICartItemCard {
	title: string;
	price: number | null;
	index: number;
}

interface CartItemElements {
	index: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	deleteButton: HTMLButtonElement;
}

/** Represents a cart item card with product information */
export class CartItemCard extends Card {
	protected _container: HTMLElement;
	protected data: IProduct = null;

	private readonly SELECTORS = {
		title: 'h3',
		price: 'span',
		index: 'div',
	} as const;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		protected domService: IDOMService,
		protected actions?: { onClick: (event: MouseEvent) => void }
	) {
		const template =
			document.querySelector<HTMLTemplateElement>('#card-basket');
		if (!template) {
			throw new Error('Card basket template not found');
		}
		super(template, events, domService);

		this.createElements();

		this.domService.appendChild(container, this._container);

		if (actions?.onClick) {
			this._container.addEventListener('click', actions.onClick);
		}
	}

	/** Creates and initializes all DOM elements for the cart item */
	private createElements(): void {
		this._container = this.domService.createElement('div', [
			'basket__item',
			'card',
			'card_compact',
		]);

		const elements: CartItemElements = {
			index: this.domService.createElement('div', 'basket__item-index'),
			title: this.domService.createElement('h3', 'card__title'),
			price: this.domService.createElement('span', 'card__price'),
			deleteButton: this.domService.createElement(
				'button',
				'basket__item-delete'
			) as HTMLButtonElement,
		};

		Object.values(elements).forEach((element) =>
			this.domService.appendChild(this._container, element)
		);

		elements.deleteButton.addEventListener('click', (e: Event) => {
			e.preventDefault();
			this.events.emit('card:delete', this.data);
		});
	}

	set title(value: string) {
		const titleElement = this._container.querySelector<HTMLElement>(
			this.SELECTORS.title
		);
		if (titleElement) {
			titleElement.textContent = value;
		}
	}

	set price(value: number | null) {
		const priceElement = this._container.querySelector<HTMLElement>(
			this.SELECTORS.price
		);
		if (priceElement) {
			priceElement.textContent = value ? `${value} синапсов` : '';
		}
	}

	set index(value: number) {
		const indexElement = this._container.querySelector<HTMLElement>(
			this.SELECTORS.index
		);
		if (indexElement) {
			indexElement.textContent = value.toString();
		}
	}

	set product(value: IProduct) {
		this.data = value;
	}

	/** Sets the product data and updates the view */
	render(data: IProduct): HTMLElement {
		this.product = data;
		this.title = data.title;
		this.price = data.price;
		return this._container;
	}

	/**
	 * Updates the index display of the cart item
	 * @param index - The position of the item in the cart
	 */
	setIndex(index: number): void {
		this.index = index;
	}
}
