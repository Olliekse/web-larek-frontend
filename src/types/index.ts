// Event system types
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string;
    data: unknown;
};

// Product data structure
export interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
}

// Cart item extends product with cart position
export interface ICartItem extends IProduct {
    cartPosition: number;
}

// Cart is an array of cart items
export type ICart = ICartItem[];

// Order form data
export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: 'card' | 'cash';
}

// Success response from API
export interface ISuccessResponse {
    success: boolean;
    data: unknown;
}

// Error response from API
export interface IErrorResponse {
    success: boolean;
    error: {
        message: string;
        code: number;
    };
}

// Base event emitter interface
export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  off(event: EventName, callback: Function): void;
  emit<T extends object>(event: string, data?: T): void;
  onAll(callback: (event: EmitterEvent) => void): void;
  offAll(): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// Form field validation rules
export interface IFormState {
    valid: boolean;
    errors: string[];
}

// Base model state interface
export interface IAppState {
    catalog: IProduct[];
    cart: ICart;
    order: IOrderForm | null;
    preview: string | null;
}
