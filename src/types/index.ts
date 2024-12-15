type EventName = string | RegExp;

type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number;
	image: string;
}

export interface ICartItem extends IProduct {
	cartPosition: number;
}

export type ICart = ICartItem[];

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: 'card' | 'cash';
}

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	off(event: EventName, callback: Function): void;
	emit<T extends object>(event: string, data?: T): void;
	onAll(callback: (event: EmitterEvent) => void): void;
	offAll(): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IOrder {
	payment: 'card' | 'cash';
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
