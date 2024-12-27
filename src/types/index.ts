export interface IOrder {
	email: string;
	phone: string;
	address: string;
	payment: string;
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IProduct {
	id: string;
	title: string;
	description?: string;
	image: string;
	price: number;
	category: string;
}

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: IProduct | null;
	order: IOrder;
}
