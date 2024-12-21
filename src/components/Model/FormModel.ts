import { IEvents } from '../base/events';

interface FormErrors {
	[key: string]: string;
}

export interface IFormModel {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
	setOrderAddress(field: string, value: string): void;
	validateOrder(): boolean;
	setOrderData(field: string, value: string): void;
	validateContacts(): boolean;
	getOrderLot(): object;
	resetForm(): void;
}

/** Manages form data and validation rules */
export class FormModel implements IFormModel {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
	formErrors: FormErrors = {};

	constructor(protected events: IEvents) {
		this.payment = '';
		this.email = '';
		this.phone = '';
		this.address = '';
		this.total = 0;
		this.items = [];
	}

	setOrderAddress(field: string, value: string) {
		if (field === 'address') {
			this.address = value;
		}

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.getOrderLot());
		}
	}

	validateOrder() {
		const regexp = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
		const errors: typeof this.formErrors = {};

		if (!this.address) {
			errors.address = 'Необходимо указать адрес';
		} else if (!regexp.test(this.address)) {
			errors.address = 'Укажите настоящий адрес';
		} else if (!this.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:address', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderData(field: string, value: string) {
		if (field === 'phone') {
			const digits = value.replace(/\D/g, '');

			let normalizedDigits = digits.slice(0, 11);
			if (normalizedDigits.startsWith('8')) {
				normalizedDigits = '7' + normalizedDigits.slice(1);
			}

			if (normalizedDigits.length > 0) {
				let formatted = '+7';
				if (normalizedDigits.length > 1) {
					const areaCode = normalizedDigits.slice(1, 4);
					const prefix = normalizedDigits.slice(4, 7);
					const lineNumber1 = normalizedDigits.slice(7, 9);
					const lineNumber2 = normalizedDigits.slice(9, 11);

					formatted += areaCode.length > 0 ? ' ' + areaCode : '';
					formatted += prefix.length > 0 ? ' ' + prefix : '';
					formatted += lineNumber1.length > 0 ? ' ' + lineNumber1 : '';
					formatted += lineNumber2.length > 0 ? ' ' + lineNumber2 : '';
				}
				this.phone = formatted;
			} else {
				this.phone = '+7';
			}
		} else if (field === 'email') {
			this.email = value;
		}

		if (this.validateContacts()) {
			this.events.emit('order:ready', this.getOrderLot());
		}
	}

	validateContacts() {
		const regexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		const errors: typeof this.formErrors = {};

		if (!this.email) {
			errors.email = 'Необходимо указать email';
		} else if (!regexpEmail.test(this.email)) {
			errors.email = 'Некорректный адрес электронной почты';
		}

		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (this.phone.length < 11) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return this.email.length > 0 && this.phone.length > 3;
	}

	getOrderLot() {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.total,
			items: this.items,
		};
	}

	resetForm(): void {
		this.payment = '';
		this.email = '';
		this.phone = '';
		this.address = '';
		this.total = 0;
		this.items = [];
		this.formErrors = {};
	}
}
