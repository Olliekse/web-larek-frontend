import { Component } from '../base/Component';
import { IEvents } from '../base/events';

/**
 * Interface defining the form validation state
 * Used to track form validity and display error messages
 */
interface IFormState {
	valid: boolean; // Whether the form is currently valid
	errors: string[]; // List of validation error messages
}

/**
 * Form component handling both order and contact forms
 * Manages form validation, error display, and submission
 * Emits events for form interactions and submissions
 */
export class Form extends Component<IFormState> {
	protected _submit: HTMLButtonElement; // Form submit button
	protected _errors: HTMLElement; // Container for error messages
	protected _paymentButtons: NodeListOf<HTMLButtonElement>; // Payment method selection buttons
	protected _address: HTMLInputElement; // Delivery address input field
	protected _email: HTMLInputElement; // Email input field
	protected _phone: HTMLInputElement; // Phone number input field
	protected _validationErrors: Set<string> = new Set(); // Current validation errors
	protected _form: HTMLFormElement; // The form element itself

	/**
	 * Initializes the form component and sets up event listeners
	 * @param container The form container element
	 * @param events Event emitter for form interactions
	 */
	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		// Initialize form elements
		this._form = container.querySelector('form');
		this._submit =
			container.querySelector('.button[type="submit"]') ||
			container.querySelector('.button');
		this._errors = container.querySelector('.form__errors');
		this._paymentButtons = container.querySelectorAll(
			'.order__buttons .button'
		);
		this._address = container.querySelector('input[name="address"]');
		this._email = container.querySelector('input[name="email"]');
		this._phone = container.querySelector('input[name="phone"]');

		// Initial form validation
		this.validateForm();

		// Set up payment method selection handlers
		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', (e) => {
				e.preventDefault(); // Prevent form submission
				// Update payment button states
				this._paymentButtons.forEach((btn) => {
					btn.classList.remove('button_alt-active');
				});
				button.classList.add('button_alt-active');
				this.validateForm();
			});
		});

		// Set up input field validation handlers
		if (this._address) {
			this._address.addEventListener('input', () => this.validateForm());
		}
		if (this._email) {
			this._email.addEventListener('input', () => this.validateForm());
		}
		if (this._phone) {
			this._phone.addEventListener('input', () => this.validateForm());
		}

		// Set up form submission handler
		if (this._form) {
			this._form.addEventListener('submit', this.handleSubmit.bind(this));
		}
	}

	/**
	 * Validates all form fields and updates validation state
	 * Checks payment method selection, address, email, and phone
	 * Updates error messages and form validity
	 */
	protected validateForm() {
		this._validationErrors.clear();

		// Validate payment method selection
		if (this._paymentButtons.length > 0) {
			const hasSelectedPayment = Array.from(this._paymentButtons).some((btn) =>
				btn.classList.contains('button_alt-active')
			);
			if (!hasSelectedPayment) {
				this._validationErrors.add('Выберите способ оплаты');
			}
		}

		// Validate delivery address
		if (this._address && !this._address.value.trim()) {
			this._validationErrors.add('Укажите адрес доставки');
		}

		// Validate email
		if (this._email && !this._email.value.trim()) {
			this._validationErrors.add('Укажите email');
		}

		// Validate phone number
		if (this._phone && !this._phone.value.trim()) {
			this._validationErrors.add('Укажите телефон');
		}

		// Update form state with validation results
		this.errors = Array.from(this._validationErrors);
		this.valid = this._validationErrors.size === 0;
	}

	/**
	 * Handles input field changes
	 * Emits input events with field name and value
	 */
	protected handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const field = target.name;
		const value = target.value;

		this.emit('input', { field, value });
	}

	/**
	 * Handles form submission
	 * Prevents default form submission and emits appropriate events
	 * Different handling for order form vs contacts form
	 */
	protected handleSubmit(event: Event) {
		event.preventDefault();
		if (this._validationErrors.size === 0) {
			if (this._paymentButtons.length > 0) {
				// Handle order form submission
				const selectedPayment = Array.from(this._paymentButtons).find((btn) =>
					btn.classList.contains('button_alt-active')
				);
				const paymentMethod = selectedPayment?.getAttribute('name') || '';

				this.emit('submit', {
					payment: paymentMethod,
					address: this._address?.value || '',
				});
			} else {
				// Handle contacts form submission
				this.emit('contacts:submit', {
					email: this._email?.value || '',
					phone: this._phone?.value || '',
				});
			}
		}
	}

	/**
	 * Updates submit button state based on form validity
	 */
	set valid(value: boolean) {
		if (this._submit) {
			this.setDisabled(this._submit, !value);
		}
	}

	/**
	 * Updates error message display
	 * Creates div elements for each error message
	 */
	set errors(value: string[]) {
		if (this._errors) {
			this._errors.replaceChildren(
				...value.map((error) => {
					const div = document.createElement('div');
					div.textContent = error;
					return div;
				})
			);
		}
	}

	/**
	 * Renders the form with current state
	 * Updates validity and error messages
	 * @returns The form container element
	 */
	render(state: IFormState): HTMLElement {
		this.valid = state.valid;
		this.errors = state.errors;
		return this.container;
	}
}
