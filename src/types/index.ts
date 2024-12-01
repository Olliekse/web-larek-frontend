/** Event system base types */
type EventName = string | RegExp;
type Subscriber = Function;

/** Structure of emitted events */
type EmitterEvent = {
    eventName: string;
    data: unknown;
};

/** 
 * Product data structure
 * Represents a single product in the catalog
 */
export interface IProduct {
    /** Unique identifier for the product */
    id: string;
    /** Product name/title */
    title: string;
    /** Detailed product description */
    description: string;
    /** Product category/type */
    category: string;
    /** Product price in currency units */
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
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
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
 * Application state interface
 * Defines the complete state structure of the application
 */
export interface IAppState {
    /** List of products in catalog */
    catalog: IProduct[];
    /** Current shopping cart state */
    cart: ICart;
    /** Current order form state, null if no order in progress */
    order: IOrderForm | null;
    /** Currently previewed item ID, null if no preview active */
    preview: string | null;
}