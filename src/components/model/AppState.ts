import { IEvents } from '../base/events';
import { IProduct } from '../../types';

interface ICart {
	items: IProduct[];
	total: number;
}

interface IModal {
	isOpen: boolean;
	content?: HTMLElement;
	title?: string;
}

export interface IAppState {
	getCart(): ICart;
	getModal(): IModal;
	getProducts(): IProduct[];
	getLoading(): LoadingState;
	getError(): string | null;
}

export type LoadingState = {
	products: boolean;
	order: boolean;
	cart: boolean;
};

/** Manages application state and data */
export class AppState implements IAppState {
	private state = {
		cart: {
			items: [] as IProduct[],
		},
		modal: {
			isOpen: false,
		} as IModal,
		products: [] as IProduct[],
		loading: {
			products: false,
			order: false,
			cart: false,
		},
		error: null as string | null,
	};

	constructor(private events: IEvents) {
		const savedCart = localStorage.getItem('cartProducts');
		if (savedCart) {
			this.state.cart.items = JSON.parse(savedCart);
			this.events.emit('state:cart:changed', this.getCart());
		}
	}

	private calculateCartTotal(): number {
		return this.state.cart.items.reduce(
			(sum, item) => sum + (item.price || 0),
			0
		);
	}

	addToCart(product: IProduct): void {
		if (!this.state.cart.items.some((item) => item.id === product.id)) {
			this.state.cart.items.push(product);
			this.saveCartToStorage();
			this.events.emit('state:cart:changed', this.getCart());
			this.events.emit('cart:changed', [...this.state.cart.items]);
		}
	}

	removeFromCart(productId: string): void {
		this.state.cart.items = this.state.cart.items.filter(
			(item) => item.id !== productId
		);
		this.saveCartToStorage();
		this.events.emit('state:cart:changed', this.getCart());
	}

	clearCart(): void {
		this.state.cart.items = [];
		localStorage.removeItem('cartProducts');
		this.events.emit('state:cart:changed', this.getCart());
		this.events.emit('form:reset');
	}

	private saveCartToStorage(): void {
		localStorage.setItem('cartProducts', JSON.stringify(this.state.cart.items));
	}

	openModal(content: HTMLElement, title?: string): void {
		this.state.modal = { isOpen: true, content, title };
		this.events.emit('state:modal:changed', this.getModal());
	}

	closeModal(): void {
		this.state.modal = { isOpen: false };
		this.events.emit('state:modal:changed', this.getModal());
	}

	setProducts(products: IProduct[]): void {
		this.state.products = [...products];
		this.events.emit('state:products:changed', this.getProducts());
	}

	getState(): Readonly<typeof this.state> {
		return { ...this.state };
	}

	getCart(): ICart {
		return {
			items: [...this.state.cart.items],
			total: this.calculateCartTotal(),
		};
	}

	getModal(): IModal {
		return { ...this.state.modal };
	}

	getProducts(): IProduct[] {
		return [...this.state.products];
	}

	getLoading(): LoadingState {
		return { ...this.state.loading };
	}

	getError(): string | null {
		return this.state.error;
	}

	isProductInCart(productId: string): boolean {
		return this.state.cart.items.some((item) => item.id === productId);
	}

	setLoading(type: keyof LoadingState, value: boolean): void {
		this.state.loading[type] = value;
		this.events.emit('state:loading', {
			type,
			value,
			isAnyLoading: this.isAnyLoading(),
		});
	}

	isLoading(type: keyof LoadingState): boolean {
		return this.state.loading[type];
	}

	isAnyLoading(): boolean {
		return Object.values(this.state.loading).some(Boolean);
	}

	setError(message: string | null): void {
		this.state.error = message;
		this.events.emit('state:error', message);
	}
}
