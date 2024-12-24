import { BasePresenter } from '../base/presenter';
import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { ProductApi } from '../../services/api/ProductApi';
import { CardPreview } from '../view/CardPreviewView';
import { AppState } from '../model/AppState';
import { ApiError } from '../../services/api/BaseApi';

/** Handles product display and interactions */
export class ProductPresenter extends BasePresenter {
	private gallery: HTMLElement;

	constructor(
		private appState: AppState,
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
			this.appState.openModal(this.view.renderModal(product), product.title);
		});

		this.events.on('card:addCart', (product: IProduct) => {
			this.appState.addToCart(product);
		});
	}

	private updateGalleryState(): void {
		const cart = this.appState.getCart();
		this.appState.getProducts().forEach((product) => {
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
			this.appState.setLoading('products', true);
			const products = await this.api.getListProductCard();
			this.appState.setProducts(products);
		} catch (error) {
			console.error('Failed to load products:', error);
			if (error instanceof ApiError) {
				switch (error.type) {
					case 'network':
						this.appState.setError(
							'Network connection error. Please check your internet connection.'
						);
						break;
					case 'server':
						this.appState.setError('Server error. Please try again later.');
						break;
					default:
						this.appState.setError(error.message);
				}
			} else {
				this.appState.setError('Failed to load products');
			}
		} finally {
			this.appState.setLoading('products', false);
		}
	}

	private handleProductsReceived(): void {
		if (!this.gallery) {
			throw new Error('Gallery element not found');
		}

		try {
			const products = this.appState.getProducts();
			this.gallery.innerHTML = '';
			products.forEach(this.renderProductCard.bind(this));
		} catch (error) {
			console.error('Error rendering products:', error);
		}
	}
}
