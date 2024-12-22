import { Card, IActions } from './CardView';
import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { IDOMService } from '../../services/DOMService';
import { StateService } from '../../services/StateService';
import { API_CONFIG } from '../../config/api.config';

interface CardElement extends HTMLElement {
	__cardInstance?: CardPreview;
	__productData?: IProduct;
}

interface ButtonState {
	text: string;
	disabled: boolean;
}

const BUTTON_TEXT = {
	IN_CART: 'В корзине',
	ADD_TO_CART: 'В корзину',
	NOT_FOR_SALE: 'Не продается',
} as const;

/** Represents a preview card with interactive button states */
export class CardPreview extends Card {
	protected button!: HTMLButtonElement;
	private currentProduct!: IProduct;
	protected cartItems: IProduct[] = [];

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		protected domService: IDOMService,
		protected stateService: StateService,
		protected actions?: IActions
	) {
		super(template, events, domService, actions);
		this.initializeElements();

		this.events.emit('cart:state:get');

		this.events.on('cart:changed', (items: IProduct[]) => {
			this.cartItems = items || [];
			if (this.currentProduct) {
				this.updateButtonState(this.isInCart(this.currentProduct), true);
			}
		});
	}

	protected initializeElements(): void {
		super.initializeElements();
		const button = this.elements.card.querySelector('.card__button');
		if (button instanceof HTMLButtonElement) {
			this.button = button;
			this.button.addEventListener('click', this.handleButtonClick.bind(this));
		}
	}

	private handleButtonClick(e: Event): void {
		e.preventDefault();
		e.stopPropagation();
		if (this.currentProduct) {
			this.events.emit('card:addCart', this.currentProduct);
			this.events.emit('modal:close');
		}
	}

	render(data: IProduct): HTMLElement {
		const cardElement = super.render(data) as CardElement;
		this.currentProduct = data;

		cardElement.__cardInstance = this;
		cardElement.__productData = data;

		cardElement.classList.add('gallery__item');
		cardElement.addEventListener('click', (e: MouseEvent) => {
			e.preventDefault();
			const productData = (cardElement as CardElement).__productData;
			if (productData) {
				this.handleCardSelect(productData);
			}
		});

		const text = cardElement.querySelector('.card__text');
		if (text) {
			text.textContent = data.description;
		}

		this.updateButtonState(
			false,
			data.price !== undefined && data.price !== null
		);

		return cardElement;
	}

	/**
	 * Updates button state based on cart and purchase availability
	 * @param isInCart - Whether the item is currently in cart
	 * @param canBePurchased - Whether the item can be purchased
	 */
	updateButtonState(isInCart: boolean, canBePurchased: boolean = true): void {
		if (!this.button) return;

		const buttonState = this.getButtonState(isInCart, canBePurchased);

		this.button.textContent = buttonState.text;
		this.button.disabled = buttonState.disabled;
	}

	setCategory(value: string): void {
		const categoryElement = this.elements.card.querySelector('.card__category');
		if (categoryElement) {
			categoryElement.textContent = value;
		}
	}

	renderModal(data: IProduct): HTMLElement {
		this.currentProduct = data;

		const cardElement = this.domService.createElement('div', [
			'card',
			'card_full',
		]);
		const leftColumn = this.domService.createElement('div', 'card__column');
		const rightColumn = this.domService.createElement('div', 'card__column');

		const image = this.domService.createElement(
			'img',
			'card__image'
		) as HTMLImageElement;
		this.domService.setAttributes(image, {
			src: data.image,
			alt: data.title,
		});
		this.domService.appendChild(leftColumn, image);

		const category = this.domService.createElement('div', [
			'card__category',
			`card__category_${this.getCategoryClass(data.category)}`,
		]);
		this.domService.setContent(category, data.category);
		this.domService.appendChild(rightColumn, category);

		const title = this.domService.createElement('h3', 'card__title');
		this.domService.setContent(title, data.title);
		this.domService.appendChild(rightColumn, title);

		const description = this.domService.createElement('div', 'card__text');
		this.domService.setContent(description, data.description);
		this.domService.appendChild(rightColumn, description);

		const priceRow = this.domService.createElement('div', 'card__row');
		const button = this.createButton(data);
		const price = this.createPrice(data);

		this.domService.appendChild(priceRow, button);
		this.domService.appendChild(priceRow, price);
		this.domService.appendChild(rightColumn, priceRow);

		this.domService.appendChild(cardElement, leftColumn);
		this.domService.appendChild(cardElement, rightColumn);

		return cardElement;
	}

	/**
	 * Creates a button with appropriate state and event listeners
	 * @param data - Product data to create button for
	 * @returns HTMLElement - The created button
	 */
	private createButton(data: IProduct): HTMLElement {
		const button = this.domService.createElement('button', [
			'button',
			'card__button',
		]);

		const isInCart = this.stateService.isProductInCart(data.id);
		const canBePurchased = data.price !== undefined && data.price !== null;

		const buttonState = this.getButtonState(isInCart, canBePurchased);

		this.domService.setContent(button, buttonState.text);
		if (buttonState.disabled) {
			this.domService.setAttributes(button, { disabled: 'true' });
		}

		if (!isInCart) {
			button.addEventListener('click', this.handleButtonClick.bind(this));
		}

		return button;
	}

	private createPrice(data: IProduct): HTMLElement {
		const price = this.domService.createElement('div', 'card__price');
		this.domService.setContent(price, this.formatPrice(data.price));
		return price;
	}

	private isInCart(product: IProduct): boolean {
		return this.cartItems.some((item) => item.id === product.id);
	}

	private handleCardSelect(product: IProduct): void {
		this.events.emit('card:select', product);
	}

	private getButtonState(
		isInCart: boolean,
		canBePurchased: boolean
	): ButtonState {
		return {
			text: isInCart
				? BUTTON_TEXT.IN_CART
				: canBePurchased
				? BUTTON_TEXT.ADD_TO_CART
				: BUTTON_TEXT.NOT_FOR_SALE,
			disabled: isInCart || !canBePurchased,
		};
	}
}
