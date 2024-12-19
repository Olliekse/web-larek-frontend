import { BasePresenter } from '../base/presenter';
import { IDataModel } from '../Model/DataModel';
import { ICard } from '../View/Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { ApiModel } from '../Model/apiModel';
import { CardPreview } from '../View/CardPreview';
import { CartModel } from '../Model/CartModel';
import { ICartModel } from '../Model/CartModel';

export class ProductPresenter extends BasePresenter {
	private gallery: HTMLElement;

	constructor(
		private model: IDataModel,
		private cartModel: ICartModel,
		private view: CardPreview,
		private api: ApiModel,
		events: IEvents
	) {
		super(events);
		this.gallery = document.querySelector('.gallery');

		this.events.on('card:addCart', this.handleAddToCart.bind(this));
		this.events.on('cart:changed', this.updateGalleryState.bind(this));
		this.events.on('productCards:receive', this.handleProductsReceived.bind(this));
		this.events.on('card:select', this.handleCardSelect.bind(this));
	}

	private handleAddToCart(product: IProduct): void {
		if (!this.cartModel.isProductInCart(product.id)) {
			this.cartModel.setSelectedСard(product);
		}
	}

	private updateGalleryState(): void {
		this.model.productCards.forEach((product) => {
			const cardElement = this.gallery.querySelector(
				`[data-product-id="${product.id}"]`
			);
			if (cardElement) {
				const cardInstance = (cardElement as any).__cardInstance;
				if (cardInstance && cardInstance.updateButtonState) {
					const isInCart = this.cartModel.isProductInCart(product.id);
					cardInstance.updateButtonState(isInCart, product.price !== undefined);
				}
			}
		});
	}

	private renderProductCard(product: IProduct): void {
		const cardElement = this.view.render(product);
		cardElement.setAttribute('data-product-id', product.id);
		this.gallery.appendChild(cardElement);
	}

	async init(): Promise<void> {
		this.events.on('productCards:receive', this.handleProductsReceived.bind(this));
		this.events.on('card:addCart', (product: IProduct) => {
			this.events.emit('cart:addItem', product);
			this.events.emit('cart:changed');
		});

		try {
			const products = await this.api.getListProductCard();
			this.model.productCards = products;
		} catch (error) {
			console.error('Failed to load products:', error);
		}
	}

	private handleProductsReceived(): void {
		if (!this.gallery) {
			console.error('Gallery element not found');
			return;
		}

		try {
			const products = this.model.productCards;
			this.gallery.innerHTML = '';
			products.forEach(this.renderProductCard.bind(this));
		} catch (error) {
			console.error('Error rendering products:', error);
		}
	}

	private handleCardSelect(product: IProduct): void {
		this.events.emit('modal:product:open', product);
	}
}
