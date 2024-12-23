import { IEvents } from '../base/events';
import { IOrder } from '../../types';
import { AppState } from './AppState';

interface FormErrors {
	[key: string]: string;
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
	getOrderLot(): IOrder;
	resetForm(): void;
}

/** Manages form data and validation rules */
export class FormModel implements IFormModel {
	protected payment: string;
	protected email: string;
	protected phone: string;
	protected address: string;
	protected formErrors: FormErrors = {};

	constructor(protected events: IEvents, protected appState: AppState) {
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
	}

	protected setEmail(value: string): void {
		this.email = value;
	}

	protected setPhone(value: string): void {
		this.phone = value;
	}

	protected setAddress(value: string): void {
		this.address = value;
	}

	setOrderAddress(field: string, value: string): void {
		if (field === 'address') {
			this.setAddress(value);
		}

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.getOrderLot());
		}
	}

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.getAddress()) {
			errors.address = 'Необходимо указать адрес';
		} else if (!this.getPayment()) {
			errors.payment = 'Выберите способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:address', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderData(field: string, value: string): void {
		if (field === 'phone') {
			let formattedPhone = value;

			// Allow plus sign only at the start
			if (formattedPhone.startsWith('+')) {
				formattedPhone = '+' + formattedPhone.slice(1).replace(/\D/g, '');
			} else {
				formattedPhone = formattedPhone.replace(/\D/g, '');
			}

			// Group digits for better readability
			if (formattedPhone.length > 0) {
				const groups = formattedPhone.match(/.{1,3}/g) || [];
				formattedPhone = groups.join(' ');
			}

			this.setPhone(formattedPhone);
		} else if (field === 'email') {
			this.setEmail(value);
		}

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.getOrderLot());
		}
	}

	validateContacts(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.getEmail() || !this.getPhone()) {
			errors.contacts = 'Необходимо указать email и телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return this.getEmail().length > 0 && this.getPhone().length > 0;
	}

	getOrderLot(): IOrder {
		const cart = this.appState.getCart();
		return {
			payment: this.getPayment(),
			email: this.getEmail(),
			phone: this.getPhone(),
			address: this.getAddress(),
			total: cart.total,
			items: cart.items.map((item) => item.id),
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
