import { IEvents } from '../base/events';
import { IProduct } from '../../types';
import { CartItemCard } from './CartItemCardView';
import { IDOMService } from '../../services/DOMService';

/** Interface for cart functionality */
export interface ICart {
	/** Renders the cart items */
	renderItems(elements: HTMLElement[]): void;
	/** Updates the cart counter in header */
	renderHeaderCartCounter(count: number): void;
	/** Updates total sum display */
	renderSumAllProducts(sum: number): void;
	/** Renders the cart view */
	render(): HTMLElement;
}

/** Cart view component for displaying shopping cart contents */
export class Cart implements ICart {
	protected readonly elements: {
		cart: HTMLElement;
		title: HTMLElement;
		list: HTMLElement;
		button: HTMLButtonElement;
		price: HTMLElement;
		headerButton: HTMLElement;
		headerCounter: HTMLElement;
	};
	private cartElement: HTMLElement;

	/**
	 * Creates a new Cart instance
	 * @param template - Cart template
	 * @param events - Event emitter
	 * @param domService - DOM service
	 * @param headerButton - Header cart button element
	 * @param headerCounter - Header cart counter element
	 */
	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		protected domService: IDOMService,
		headerButton: HTMLElement,
		headerCounter: HTMLElement
	) {
		this.cartElement = template.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLElement;

		this.elements = {
			cart: this.cartElement,
			title: this.cartElement.querySelector('.modal__title'),
			list: this.cartElement.querySelector('.basket__list'),
			button: this.cartElement.querySelector('.basket__button'),
			price: this.cartElement.querySelector('.basket__price'),
			headerButton,
			headerCounter,
		};

		this.elements.button.addEventListener('click', () => {
			this.events.emit('order:open');
		});

		this.elements.headerButton.addEventListener('click', () => {
			this.events.emit('cart:open');
		});

		this.events.on('cart:update-counter', (data: { count: number }) => {
			this.renderHeaderCartCounter(data.count);
		});
	}

	/**
	 * Updates the cart counter display in header
	 * @param count - Number of items in cart
	 */
	renderHeaderCartCounter(count: number): void {
		this.domService.setContent(this.elements.headerCounter, String(count));
	}

	/**
	 * Updates total sum display
	 * @param sum - Total sum of products in cart
	 */
	renderSumAllProducts(sum: number): void {
		this.domService.setContent(this.elements.price, `${sum} синапсов`);
	}

	/**
	 * Renders the cart items
	 * @param elements - Array of cart item elements
	 */
	renderItems(elements: HTMLElement[]): void {
		if (!elements.length) {
			this.elements.button.setAttribute('disabled', 'disabled');
			const emptyMessage = this.domService.createElement('p');
			this.domService.setContent(emptyMessage, 'Корзина пуста');
			this.elements.list.replaceChildren(emptyMessage);
			return;
		}

		this.elements.list.replaceChildren(...elements);
		this.elements.button.removeAttribute('disabled');
	}

	/**
	 * Renders the cart view
	 * @returns - Cart view element
	 */
	render(): HTMLElement {
		return this.cartElement;
	}
}
