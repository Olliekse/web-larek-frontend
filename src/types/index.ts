/** Product interface */
export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price?: number;
}

/** Order interface */
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
