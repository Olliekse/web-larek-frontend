import { Card, IActions } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/events';

export class CardPreview extends Card {
	text: HTMLElement;
	protected button: HTMLButtonElement;
	private currentProduct: IProduct;

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		super(template, events, {
			onClick: (e: MouseEvent) => {
				e.preventDefault();
				if (this.currentProduct) {
					this.handleCardSelect(this.currentProduct);
				}
			}
		});
		this.initializeElements();
		
		this.events.on('cart:changed', (items: IProduct[]) => {
			this.cartItems = items;
		});
	}

	protected initializeElements(): void {
		super.initializeElements();
		this.button = this.elements.card.querySelector('.card__button') as HTMLButtonElement;
		
		if (this.button) {
			this.button.addEventListener('click', this.handleButtonClick.bind(this));
		}
	}

	private handleButtonClick(e: Event): void {
		e.stopPropagation();
		this.events.emit('card:addCart', this.currentProduct);
	}

	render(data: IProduct): HTMLElement {
		const cardElement = super.render(data);
		
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

		const cardElement = document.createElement('div');
		cardElement.classList.add('card', 'card_full');

		const leftColumn = document.createElement('div');
		leftColumn.classList.add('card__column');

		const rightColumn = document.createElement('div');
		rightColumn.classList.add('card__column');

		const image = document.createElement('img');
		image.classList.add('card__image');
		image.src = data.image;
		image.alt = data.title;
		leftColumn.appendChild(image);

		const category = document.createElement('div');
		category.classList.add(
			'card__category',
			`card__category_${this.getCategoryClass(data.category)}`
		);
		category.textContent = data.category;
		rightColumn.appendChild(category);

		const title = document.createElement('h3');
		title.classList.add('card__title');
		title.textContent = data.title;
		rightColumn.appendChild(title);

		const description = document.createElement('div');
		description.classList.add('card__text');
		description.textContent = data.description;
		rightColumn.appendChild(description);

		const priceRow = document.createElement('div');
		priceRow.classList.add('card__row');

		const button = document.createElement('button');
		button.classList.add('button', 'card__button');

		if (this.isInCart(data)) {
			button.setAttribute('disabled', 'true');
			button.textContent = 'В корзине';
		} else {
			button.textContent = data.price ? 'В корзину' : 'Не продается';
			if (!data.price) {
				button.setAttribute('disabled', 'true');
			}
			button.addEventListener('click', (e) => {
				e.stopPropagation();
				this.events.emit('card:addCart', this.currentProduct);

				button.setAttribute('disabled', 'true');
				button.textContent = 'В корзине';
				this.events.emit('modal:close');
				this.events.emit('cart:changed', this.cartItems);
			});
		}
		priceRow.appendChild(button);

		const price = document.createElement('div');
		price.classList.add('card__price');
		price.textContent = this.formatPrice(data.price);
		priceRow.appendChild(price);

		rightColumn.appendChild(priceRow);

		cardElement.appendChild(leftColumn);
		cardElement.appendChild(rightColumn);

		return cardElement;
	}

	private isInCart(product: IProduct): boolean {
		return this.cartItems.some(item => item.id === product.id);
	}

	private handleCardSelect(product: IProduct): void {
		this.events.emit('cart:state:get');
		
		setTimeout(() => {
			const modalCard = this.renderModal(product);
			this.events.emit('modal:open', {
				content: modalCard,
				title: product.title
			});
		}, 0);
	}
}
