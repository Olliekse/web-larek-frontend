import { View } from './base/view';
import { IOrderForm } from '../types';
import { ensureElement } from '../utils/utils';
import { formatPhone } from '../utils/mask';

export class ContactsForm extends View<{ email: string; phone: string }> {
	private static template = ensureElement<HTMLTemplateElement>('#contacts');

	private _emailInput: HTMLInputElement;
	private _phoneInput: HTMLInputElement;
	private _submitButton: HTMLButtonElement;
	private _errorMessage: HTMLElement;

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

		// Create error message element
		this._errorMessage = document.createElement('span');
		this._errorMessage.className = 'modal__message';
		// Insert after submit button
		this._submitButton.parentElement?.appendChild(this._errorMessage);

		this._emailInput.addEventListener('input', () => this.validateForm());
		this._phoneInput.addEventListener('input', (e) => {
			const input = e.target as HTMLInputElement;
			const value = input.value.replace(/\D+/g, '');
			
			// If more than 11 digits, truncate to first 11
			if (value.length > 11) {
				const truncatedValue = value.slice(0, 11);
				this._phoneInput.value = formatPhone(truncatedValue);
				return;
			}
			
			this._phoneInput.value = formatPhone(input.value);
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

		// Reset error states
		this._errorMessage.textContent = '';
		this._errorMessage.classList.remove('modal__message_error');
		this._emailInput.classList.remove('input_invalid');
		this._phoneInput.classList.remove('input_invalid');

		const errors: string[] = [];

		// Email validation
		if (!email) {
			errors.push('Необходимо указать email');
			this._emailInput.classList.add('input_invalid');
		} else if (!this.validateEmail(email)) {
			errors.push('Некорректный адрес электронной почты');
			this._emailInput.classList.add('input_invalid');
		}

		// Phone validation
		if (!phone) {
			errors.push('Необходимо указать телефон');
			this._phoneInput.classList.add('input_invalid');
		} else if (!this.validatePhone(phone)) {
			errors.push('Некорректный формат телефона');
			this._phoneInput.classList.add('input_invalid');
		}

		// Show combined error messages if any
		if (errors.length > 0) {
			this._errorMessage.textContent = errors.join('; ');
			this._errorMessage.classList.add('modal__message_error');
		}

		// Enable button if fields are not empty
		this._submitButton.disabled = !email || !phone;

		this.emit('contacts:change', {
			email,
			phone,
		});
	}

	private validateEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	private validatePhone(phone: string): boolean {
		// Changed to check for exactly 16 characters (format: +7 (XXX) XXX-XX-XX)
		return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone);
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
