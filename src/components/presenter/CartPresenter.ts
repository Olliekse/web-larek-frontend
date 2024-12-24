import { BasePresenter } from '../base/presenter';
import { AppState } from '../model/AppState';
import { ICart } from '../view/CartView';
import { IEvents } from '../base/events';
import { CartItemCard } from '../view/CartItemCardView';
import { IProduct } from '../../types';
import { IDOMService } from '../../services/DOMService';

interface ICartState {
	items: IProduct[];
	total: number;
}

/** Manages cart functionality and state */
export class CartPresenter extends BasePresenter {
	/**
	 * Creates a new CartPresenter instance
	 * @param appState - Service for managing application state
	 * @param view - Cart view instance
	 * @param events - Event emitter instance
	 * @param domService - DOM service instance
	 * @param itemTemplate - Cart item template instance
	 */
	constructor(
		private appState: AppState,
		private view: ICart,
		events: IEvents,
		private domService: IDOMService,
		private itemTemplate: HTMLTemplateElement
	) {
		super(events);

		this.events.on('cart:open', () => {
			this.events.emit('modal:open', {
				content: this.view.render(),
				title: 'Корзина',
			});
		});

		this.events.on('state:cart:changed', (cart: ICartState) => {
			this.renderCart(cart);
		});

		this.events.on('card:delete', (productId: string) => {
			this.appState.removeFromCart(productId);
		});
	}

	private createCartItem(item: IProduct, index: number): HTMLElement {
		const container = document.createElement('div');
		const cartItem = new CartItemCard(
			container,
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
	}

	private renderCart(cart: { items: IProduct[]; total: number }): void {
		const cartItems = cart.items.map((item, index) =>
			this.createCartItem(item, index)
		);

		this.view.renderItems(cartItems);
		this.view.renderSumAllProducts(cart.total);
		this.view.renderHeaderCartCounter(cart.items.length);
	}

	/**
	 * Initializes the cart presenter and updates header counter
	 */
	init(): void {
		const cart = this.appState.getCart();
		this.renderCart(cart);
	}
}
