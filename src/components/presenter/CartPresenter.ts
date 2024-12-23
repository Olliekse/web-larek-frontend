import { BasePresenter } from '../base/presenter';
import { ICart } from '../view/CartView';
import { IEvents } from '../base/events';
import { AppState } from '../model/AppState';
import { IProduct } from '../../types';

interface CartState {
	items: IProduct[];
	total: number;
}

/** Presenter for handling shopping cart logic */
export class CartPresenter extends BasePresenter {
	/**
	 * Creates a new CartPresenter instance
	 * @param appState - Service for managing application state
	 * @param view - Cart view instance
	 * @param events - Event emitter instance
	 */
	constructor(
		private appState: AppState,
		private view: ICart,
		events: IEvents
	) {
		super(events);

		// Listen to state changes
		this.events.on('state:cart:changed', (cartState: CartState) => {
			this.view.renderItems(cartState.items);
			this.view.renderHeaderCartCounter(cartState.items.length);
			this.view.renderSumAllProducts(cartState.total);
		});

		// Handle cart opening
		this.events.on('cart:open', () => {
			const cart = this.appState.getCart();
			this.view.renderItems(cart.items);
			this.view.renderSumAllProducts(cart.total);
			this.events.emit('modal:open', {
				content: this.view.render(),
				title: 'Корзина',
			});
		});

		// Initialize cart state
		const cart = this.appState.getCart();
		if (cart.items.length) {
			this.view.renderItems(cart.items);
			this.view.renderHeaderCartCounter(cart.items.length);
			this.view.renderSumAllProducts(cart.total);
		}

		// Handle item removal
		this.events.on('cart:removeItem', (item: IProduct) => {
			this.appState.removeFromCart(item.id);
		});
	}

	/**
	 * Initializes the cart presenter and updates header counter
	 */
	init(): void {
		const cart = this.appState.getCart();
		this.view.renderHeaderCartCounter(cart.items.length);
	}
}
