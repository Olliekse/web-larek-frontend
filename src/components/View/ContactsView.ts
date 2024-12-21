import { IEvents } from '../base/events';
import { IDOMService } from '../../services/DOMService';

/** Interface for contacts form functionality */
export interface IContacts {
	/** Renders the contacts form */
	render(): HTMLElement;
	/** Resets the form to initial state */
	resetForm(): void;
	/** Sets form validation state */
	set valid(value: boolean);
	/** Sets error message */
	set error(value: string);
}

/** View component for handling contact form display and interactions */
export class ContactsView implements IContacts {
	private _form: HTMLFormElement;
	private _button: HTMLButtonElement;
	private _errors: HTMLElement;
	private _inputs: HTMLInputElement[];

	/**
	 * Creates a new ContactsView instance
	 * @param template - Contact form template
	 * @param events - Event emitter instance
	 * @param domService - DOM manipulation service
	 */
	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		protected domService: IDOMService
	) {
		this._form = template.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this._button = this._form.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;
		this._errors = this._form.querySelector('.form__errors') as HTMLElement;
		this._inputs = Array.from(this._form.querySelectorAll('.form__input'));

		this._inputs.forEach((input) => {
			input.addEventListener('input', (e: Event) => {
				this.events.emit('contacts:changeInput', {
					field: (e.target as HTMLInputElement).name,
					value: (e.target as HTMLInputElement).value,
				});
			});
		});

		this._form.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit('contacts:submit');
		});

		// Add phone input handling
		const phoneInput = this._form.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;
		phoneInput.value = '+7';

		phoneInput.addEventListener('input', this.handlePhoneInput.bind(this));
		phoneInput.addEventListener('keydown', (e) => {
			if (
				e.key === 'Backspace' &&
				(e.target as HTMLInputElement).selectionStart <= 2
			) {
				e.preventDefault();
			}
		});
	}

	/**
	 * Handles phone input formatting and validation
	 * @param e - Input event
	 */
	private handlePhoneInput(e: Event): void {
		const input = e.target as HTMLInputElement;
		let value = input.value.replace(/\D/g, '');

		if (value.length > 11) {
			value = value.slice(0, 11);
		}

		let formatted = '+7';
		if (value.length > 1) formatted += ` ${value.slice(1, 4)}`;
		if (value.length > 4) formatted += ` ${value.slice(4, 7)}`;
		if (value.length > 7) formatted += ` ${value.slice(7, 9)}`;
		if (value.length > 9) formatted += ` ${value.slice(9)}`;

		input.value = formatted;
		this.events.emit('contacts:changeInput', {
			field: input.name,
			value: formatted,
		});
	}

	set error(value: string) {
		this.domService.setContent(this._errors, value);
	}

	set valid(value: boolean) {
		if (value) {
			this._button.removeAttribute('disabled');
		} else {
			this._button.setAttribute('disabled', 'disabled');
		}
	}

	render(): HTMLElement {
		return this._form;
	}

	resetForm(): void {
		this._form.reset();
		this.error = '';
	}
}
