import { Card, IActions } from './CardView';
import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { IDOMService } from '../../services/DOMService';

export class CardPreview extends Card {
	text: HTMLElement;
	protected button: HTMLButtonElement;
	private currentProduct: IProduct;
	protected cartItems: IProduct[] = [];

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		protected domService: IDOMService,
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
		this.button = this.elements.card.querySelector(
			'.card__button'
		) as HTMLButtonElement;

		if (this.button) {
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
		const cardElement = super.render(data);
		this.currentProduct = data;

		(cardElement as any).__cardInstance = this;
		(cardElement as any).__productData = data;

		cardElement.classList.add('gallery__item');
		cardElement.addEventListener('click', (e: MouseEvent) => {
			e.preventDefault();
			const productData = (cardElement as any).__productData;
			if (productData) {
				this.handleCardSelect(productData);
			}
		});

		const text = cardElement.querySelector('.card__text');
		if (text) {
			text.textContent = data.description;
		}

		this.updateButtonState(false, data.price !== undefined);

		return cardElement;
	}

	updateButtonState(isInCart: boolean, canBePurchased: boolean = true): void {
		if (!this.button) return;

		if (isInCart) {
			this.button.setAttribute('disabled', 'true');
			this.button.textContent = 'В корзине';
		} else {
			this.button.textContent = canBePurchased ? 'В корзину' : 'Не продается';
			this.button.disabled = !canBePurchased;
		}
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

	private createButton(data: IProduct): HTMLElement {
		const button = this.domService.createElement('button', [
			'button',
			'card__button',
		]);

		if (this.isInCart(data)) {
			this.domService.setAttributes(button, { disabled: 'true' });
			this.domService.setContent(button, 'В корзине');
		} else {
			this.domService.setContent(
				button,
				data.price ? 'В корзину' : 'Не продается'
			);
			if (!data.price) {
				this.domService.setAttributes(button, { disabled: 'true' });
			}
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
		this.events.emit('cart:state:get');

		setTimeout(() => {
			const modalCard = this.renderModal(product);
			this.events.emit('modal:open', {
				content: modalCard,
				title: product.title,
			});
		}, 0);
	}
}
