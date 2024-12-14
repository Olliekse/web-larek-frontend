import { View } from './base/view';
import { IOrderForm } from '../types';
import { ensureElement } from '../utils/utils';
import { formatPhone } from '../utils/mask';

export class ContactsForm extends View<{ email: string; phone: string }> {
	private static template = ensureElement<HTMLTemplateElement>('#contacts');

	private _emailInput: HTMLInputElement;
	private _phoneInput: HTMLInputElement;
	private _submitButton: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);

		const content = (
			this.constructor as typeof ContactsForm
		).template.content.cloneNode(true) as HTMLElement;
		this.container.append(content);

		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.container
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.container
		);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.container
		);

		this._emailInput.addEventListener('input', () => this.validateForm());
		this._phoneInput.addEventListener('input', () => {
			const value = this._phoneInput.value;
			this._phoneInput.value = formatPhone(value);
			this.validateForm();
		});
		this.container.addEventListener('submit', (e) => this.handleSubmit(e));
	}
	render(data: Partial<IOrderForm>): void {
		if (data.email) this._emailInput.value = data.email;
		if (data.phone) this._phoneInput.value = data.phone;
		this.validateForm();
	}

	private validateForm(): void {
		const email = this._emailInput.value.trim();
		const phone = this._phoneInput.value.trim();

		const isEmailValid = this.validateEmail(email);
		const isPhoneValid = this.validatePhone(phone);

		this._emailInput.classList.toggle(
			'input_invalid',
			!isEmailValid && email.length > 0
		);
		this._phoneInput.classList.toggle(
			'input_invalid',
			!isPhoneValid && phone.length > 0
		);

		const isValid = isEmailValid && isPhoneValid;
		this._submitButton.disabled = !isValid;

		this.emit('contacts:change', {
			email,
			phone,
		});
	}

	private validateEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	private validatePhone(phone: string): boolean {
		return phone.length === 16;
	}

	private handleSubmit(e: Event): void {
		e.preventDefault();
		this.emit('contacts:submit', {
			email: this._emailInput.value.trim(),
			phone: this._phoneInput.value.trim(),
		});
	}

	get email(): string {
		return this._emailInput.value;
	}

	set email(value: string) {
		this._emailInput.value = value;
		this.validateForm();
	}

	get phone(): string {
		return this._phoneInput.value;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
		this.validateForm();
	}

	get isValid(): boolean {
		return this.validateEmail(this.email) && this.validatePhone(this.phone);
	}
}
