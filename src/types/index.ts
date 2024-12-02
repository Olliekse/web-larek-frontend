/** Event system base types */
type EventName = string | RegExp;
type Subscriber = Function;

/** Structure of emitted events */
type EmitterEvent = {
	eventName: string;
	data: unknown;
};

/**
 * IProduct - Product data interface
 * Represents a single product in the catalog.
 * Used in product cards, cart items, and order details.
 */
export interface IProduct {
	/** Unique product identifier from backend */
	id: string;
	/** Product name - displayed in UI */
	title: string;
	/** Full product description - shown in modal */
	description: string;
	/** Product category - used for filtering */
	category: string;
	/** Product price in synapses */
	price: number;
	/** URL to product image */
	image: string;
}

/**
 * Cart item structure
 * Extends product with additional cart-specific data
 */
export interface ICartItem extends IProduct {
	/** Position/order of item in cart */
	cartPosition: number;
}

/** Cart data structure as an array of cart items */
export type ICart = ICartItem[];

/**
 * Order form data structure
 * Contains customer and delivery information
 */
export interface IOrderForm {
	/** Customer email address */
	email: string;
	/** Customer phone number */
	phone: string;
	/** Delivery address */
	address: string;
	/** Payment method selection */
	payment: 'card' | 'cash';
}

/**
 * Success response structure from API
 * Used when request is successful
 */
export interface ISuccessResponse {
	/** Indicates successful operation */
	success: boolean;
	/** Response payload */
	data: unknown;
}

/**
 * Error response structure from API
 * Used when request fails
 */
export interface IErrorResponse {
	/** Indicates failed operation */
	success: boolean;
	/** Error details */
	error: {
		/** Error message */
		message: string;
		/** Error code */
		code: number;
	};
}

/**
 * Event system interface
 * Defines methods for event handling throughout the application
 */
export interface IEvents {
	/**
	 * Subscribe to an event
	 * @param event Event name or pattern to match
	 * @param callback Function to execute when event occurs
	 */
	on<T extends object>(event: EventName, callback: (data: T) => void): void;

	/**
	 * Unsubscribe from an event
	 * @param event Event to unsubscribe from
	 * @param callback Function to remove from subscribers
	 */
	off(event: EventName, callback: Function): void;

	/**
	 * Emit an event
	 * @param event Event name
	 * @param data Optional data to pass to subscribers
	 */
	emit<T extends object>(event: string, data?: T): void;

	/**
	 * Subscribe to all events
	 * @param callback Function to execute for any event
	 */
	onAll(callback: (event: EmitterEvent) => void): void;

	/** Remove all event subscriptions */
	offAll(): void;

	/**
	 * Create an event trigger function
	 * @param event Event name
	 * @param context Optional context to merge with trigger data
	 * @returns Function that will trigger the event when called
	 */
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

/**
 * Form validation state
 * Tracks form validity and error messages
 */
export interface IFormState {
	/** Whether the form is currently valid */
	valid: boolean;
	/** Array of validation error messages */
	errors: string[];
}

/**
 * IAppState - Main application state interface
 * Represents the complete state of the application at any given moment.
 * Used by the Presenter to manage application-wide state changes.
 */
export interface IAppState {
	/** Current product catalog - updated after API fetch */
	catalog: IProduct[];
	/** Shopping cart state - persists during session */
	cart: ICart;
	/** Current order being processed - null when no order in progress */
	currentOrder: IOrderForm | null;
	/** Modal window state - controls visibility and content */
	modal: {
		isOpen: boolean;
		content?: HTMLElement;
	};
	/** Global loading state - used for API operations */
	loading: boolean;
	/** Array of application errors - cleared on successful operations */
	errors: AppError[];
}
