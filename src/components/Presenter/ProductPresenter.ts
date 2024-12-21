import { BasePresenter } from '../base/presenter';
import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { ApiModel } from '../Model/apiModel';
import { CardPreview } from '../View/CardPreviewView';
import { ICartModel } from '../Model/CartModel';
import { StateService } from '../../services/StateService';

export class ProductPresenter extends BasePresenter {
	private gallery: HTMLElement;

	constructor(
		private stateService: StateService,
		private cartModel: ICartModel,
		private view: CardPreview,
		private api: ApiModel,
		events: IEvents
	) {
		super(events);
		this.gallery = document.querySelector('.gallery');

		this.events.on(
			'state:products:changed',
			this.handleProductsReceived.bind(this)
		);
		this.events.on('state:cart:changed', this.updateGalleryState.bind(this));

		this.events.on('card:select', (product: IProduct) => {
			this.stateService.openModal(
				this.view.renderModal(product),
				product.title
			);
		});

		this.events.on('card:addCart', (product: IProduct) => {
			this.stateService.addToCart(product);
			this.cartModel.setSelectedСard(product);
		});
	}

	private updateGalleryState(): void {
		const cart = this.stateService.getCart();
		this.stateService.getProducts().forEach((product) => {
			const cardElement = this.gallery.querySelector(
				`[data-product-id="${product.id}"]`
			);
			if (cardElement) {
				const cardInstance = (cardElement as any).__cardInstance;
				if (cardInstance?.updateButtonState) {
					const isInCart = cart.items.some((item) => item.id === product.id);
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
		try {
			const products = await this.api.getListProductCard();
			this.stateService.setProducts(products);
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
			const products = this.stateService.getProducts();
			this.gallery.innerHTML = '';
			products.forEach(this.renderProductCard.bind(this));
		} catch (error) {
			console.error('Error rendering products:', error);
		}
	}
}
