import { createElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IProduct } from '../../types';
import { CartItemCard } from './CartItemCardView';
import { IDOMService } from '../../services/DOMService';

export interface ICart {
	renderHeaderCartCounter(value: number): void;
	renderSumAllProducts(sumAll: number): void;
	render(): HTMLElement;
	renderItems(items: IProduct[]): void;
}

export class Cart implements ICart {
	protected readonly elements: {
		cart: HTMLElement;
		title: HTMLElement;
		list: HTMLElement;
		button: HTMLButtonElement;
		price: HTMLElement;
		headerButton: HTMLButtonElement;
		headerCounter: HTMLElement;
	};
	protected readonly itemTemplate: HTMLTemplateElement;
	private cartElement: HTMLElement;

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		protected domService: IDOMService,
		itemTemplate: HTMLTemplateElement
	) {
		this.itemTemplate = itemTemplate;
		this.cartElement = template.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLElement;

		this.elements = {
			cart: this.cartElement,
			title: this.cartElement.querySelector('.modal__title'),
			list: this.cartElement.querySelector('.basket__list'),
			button: this.cartElement.querySelector('.basket__button'),
			price: this.cartElement.querySelector('.basket__price'),
			headerButton: document.querySelector('.header__basket'),
			headerCounter: document.querySelector('.header__basket-counter'),
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

	renderItems(items: IProduct[]): void {
		if (!items.length) {
			this.elements.button.setAttribute('disabled', 'disabled');
			this.elements.list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			return;
		}

		const cartItems = items.map((item, index) => {
			const cartItem = new CartItemCard(
				this.itemTemplate,
				this.events,
				this.domService,
				{
					onClick: () => this.events.emit('cart:removeItem', item),
				}
			);
			const element = cartItem.render(item);
			cartItem.setIndex(index + 1);
			return element;
		});

		this.elements.list.replaceChildren(...cartItems);
		this.elements.button.removeAttribute('disabled');
	}

	render(): HTMLElement {
		return this.cartElement;
	}

	renderHeaderCartCounter(value: number): void {
		this.elements.headerCounter.textContent = String(value);
	}

	renderSumAllProducts(sumAll: number): void {
		this.elements.price.textContent = `${sumAll} синапсов`;
	}
}
