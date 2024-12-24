import { IEvents } from '../base/events';
import { IOrder } from '../../types';

interface FormErrors {
	[key: string]: string;
}

export interface IOrderData {
	items: string[];
	total: number;
}

export interface IFormModel {
	getPayment(): string;
	getEmail(): string;
	getPhone(): string;
	getAddress(): string;
	setPayment(value: string): void;
	setOrderAddress(field: string, value: string): void;
	validateOrder(): boolean;
	setOrderData(field: string, value: string): void;
	validateContacts(): boolean;
	getOrderLot(orderData: IOrderData): IOrder;
	resetForm(): void;
}

/** Manages form data and validation rules */
export class FormModel implements IFormModel {
	protected payment: string;
	protected email: string;
	protected phone: string;
	protected address: string;
	protected formErrors: FormErrors = {};

	constructor(protected events: IEvents) {
		this.payment = '';
		this.email = '';
		this.phone = '';
		this.address = '';
	}

	getPayment(): string {
		return this.payment;
	}

	getEmail(): string {
		return this.email;
	}

	getPhone(): string {
		return this.phone;
	}

	getAddress(): string {
		return this.address;
	}

	setPayment(value: string): void {
		this.payment = value;
		this.events.emit('formData:changed', {
			field: 'payment',
			value,
			isValid: !!value,
		});
	}

	protected setEmail(value: string): void {
		this.email = value;
		this.events.emit('formData:changed', {
			field: 'email',
			value,
			isValid: !!value.trim(),
		});
	}

	protected setPhone(value: string): void {
		this.phone = value;
		this.events.emit('formData:changed', {
			field: 'phone',
			value,
			isValid: !!value.trim(),
		});
	}

	protected setAddress(value: string): void {
		this.address = value;
		this.events.emit('formData:changed', {
			field: 'address',
			value,
			isValid: !!value.trim(),
		});
	}

	setOrderAddress(field: string, value: string): void {
		if (field === 'address') {
			this.setAddress(value);
		}
	}

	setOrderData(field: string, value: string): void {
		if (field === 'phone') {
			this.setPhone(value);
		} else if (field === 'email') {
			this.setEmail(value);
		}
	}

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.getAddress().trim()) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.getPayment()) {
			errors.payment = 'Выберите способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:address', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.getEmail().trim()) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.getPhone().trim()) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	getOrderLot(orderData: IOrderData): IOrder {
		return {
			payment: this.getPayment(),
			email: this.getEmail(),
			phone: this.getPhone(),
			address: this.getAddress(),
			total: orderData.total,
			items: orderData.items,
		};
	}

	resetForm(): void {
		this.setPayment('');
		this.setEmail('');
		this.setPhone('');
		this.setAddress('');
		this.formErrors = {};
	}
}
