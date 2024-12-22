import { IEvents } from '../components/base/events';
import { IProduct } from '../types';

export interface IState {
	cart: {
		items: IProduct[];
		total: number;
	};
	modal: {
		isOpen: boolean;
		content?: HTMLElement;
		title?: string;
	};
	products: IProduct[];
	loading: LoadingState;
	error: string | null;
}

export type LoadingState = {
	products: boolean;
	order: boolean;
	cart: boolean;
};

export class StateService {
	private state: IState = {
		cart: {
			items: [],
			total: 0,
		},
		modal: {
			isOpen: false,
		},
		products: [],
		loading: {
			products: false,
			order: false,
			cart: false,
		},
		error: null,
	};

	constructor(private events: IEvents) {
		// Initialize state from localStorage if available
		const savedCart = localStorage.getItem('cartProducts');
		if (savedCart) {
			this.state.cart.items = JSON.parse(savedCart);
			this.updateCartTotal();
			this.events.emit('state:cart:changed', this.state.cart);
		}
	}

	private updateCartTotal(): void {
		this.state.cart.total = this.state.cart.items.reduce(
			(sum, item) => sum + (item.price || 0),
			0
		);
	}

	// Cart methods
	addToCart(product: IProduct): void {
		if (!this.state.cart.items.some((item) => item.id === product.id)) {
			this.state.cart.items.push(product);
			this.updateCartTotal();
			this.saveCartToStorage();
			this.events.emit('state:cart:changed', this.state.cart);
			this.events.emit('cart:changed', this.state.cart.items);
		}
	}

	removeFromCart(productId: string): void {
		this.state.cart.items = this.state.cart.items.filter(
			(item) => item.id !== productId
		);
		this.updateCartTotal();
		this.saveCartToStorage();
		this.events.emit('state:cart:changed', this.state.cart);
	}

	clearCart(): void {
		this.state.cart.items = [];
		this.state.cart.total = 0;
		localStorage.removeItem('cartProducts');
		this.events.emit('state:cart:changed', this.state.cart);
		this.events.emit('form:reset');
	}

	private saveCartToStorage(): void {
		localStorage.setItem('cartProducts', JSON.stringify(this.state.cart.items));
	}

	// Modal methods
	openModal(content: HTMLElement, title?: string): void {
		this.state.modal = { isOpen: true, content, title };
		this.events.emit('state:modal:changed', this.state.modal);
	}

	closeModal(): void {
		this.state.modal = { isOpen: false };
		this.events.emit('state:modal:changed', this.state.modal);
	}

	// Product methods
	setProducts(products: IProduct[]): void {
		this.state.products = products;
		this.events.emit('state:products:changed', this.state.products);
	}

	// Getters
	getState(): IState {
		return { ...this.state };
	}

	getCart() {
		return { ...this.state.cart };
	}

	getProducts() {
		return [...this.state.products];
	}

	isProductInCart(productId: string): boolean {
		return this.state.cart.items.some((item) => item.id === productId);
	}

	// Loading methods
	setLoading(type: keyof LoadingState, value: boolean): void {
		this.state.loading[type] = value;
		this.events.emit('state:loading', {
			type,
			value,
			isAnyLoading: Object.values(this.state.loading).some(Boolean),
		});
	}

	isLoading(type: keyof LoadingState): boolean {
		return this.state.loading[type];
	}

	isAnyLoading(): boolean {
		return Object.values(this.state.loading).some(Boolean);
	}

	// Error methods
	setError(message: string | null): void {
		this.state.error = message;
		this.events.emit('state:error', message);
	}
}