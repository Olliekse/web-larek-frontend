import { BasePresenter } from '../base/presenter';
import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { ProductApi } from '../../services/api/ProductApi';
import { CardPreview } from '../view/CardPreviewView';
import { StateService } from '../../services/StateService';

/** Handles product display and interactions */
export class ProductPresenter extends BasePresenter {
	private gallery: HTMLElement;

	constructor(
		private stateService: StateService,
		private view: CardPreview,
		private api: ProductApi,
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
			this.stateService.setLoading(true);
			const products = await this.api.getListProductCard();
			this.stateService.setProducts(products);
		} catch (error) {
			console.error('Failed to load products:', error);
			this.stateService.setError('Failed to load products');
		} finally {
			this.stateService.setLoading(false);
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
