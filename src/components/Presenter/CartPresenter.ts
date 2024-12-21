import { BasePresenter } from '../base/presenter';
import { ICartModel } from '../Model/CartModel';
import { ICart } from '../View/CartView';
import { IProduct } from '../../types';
import { IEvents } from '../base/events';

export class CartPresenter extends BasePresenter {
	constructor(private model: ICartModel, private view: ICart, events: IEvents) {
		super(events);
		this.events.on('cart:open', this.handleCartOpen.bind(this));
		this.events.on('cart:removeItem', this.handleRemoveItem.bind(this));
		this.events.on('cart:addItem', this.handleAddItem.bind(this));
		this.events.on('cart:clear', () => {
			this.model.clearCartProducts();
			this.updateCart();
		});

		const savedCart = localStorage.getItem('cartProducts');
		if (savedCart) {
			this.model.cartProducts = JSON.parse(savedCart);
			this.updateCart();
		}
	}

	private handleCartOpen(): void {
		this.updateCart();
		const content = this.view.render();

		this.events.emit('modal:open', {
			content: content,
			title: 'Корзина',
		});
	}

	private handleAddItem(item: IProduct): void {
		this.model.setSelectedСard(item);
		this.updateCart();
	}

	private handleRemoveItem(item: IProduct): void {
		this.model.deleteCardToCart(item);
		this.updateCart();
	}

	private updateCart(): void {
		this.view.renderItems(this.model.cartProducts);
		this.view.renderHeaderCartCounter(this.model.getCounter());
		this.view.renderSumAllProducts(this.model.getSumAllProducts());
	}
}
