import { IEvents } from '../base/events';
import { IDOMService } from '../../services/DOMService';

export interface IOrder {
	render(): HTMLElement;
	valid: boolean;
	error: string;
	resetForm(): void;
	setPaymentState(payment: string): void;
}

export class Order implements IOrder {
	protected _paymentButtons: HTMLButtonElement[];
	protected _address: HTMLInputElement;
	protected _button: HTMLButtonElement;
	protected _error: HTMLElement;
	protected _form: HTMLFormElement;

	constructor(
		protected template: HTMLTemplateElement,
		protected events: IEvents,
		protected domService: IDOMService
	) {
		this._form = template.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this._paymentButtons = Array.from(
			this._form.querySelectorAll('button[name="card"], button[name="cash"]')
		) as HTMLButtonElement[];
		this._address = this._form.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;
		this._button = this._form.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		this._error = this._form.querySelector('.form__errors') as HTMLElement;

		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				this.events.emit('order:paymentSelection', { payment: button.name });
			});
		});

		this._address.addEventListener('input', (e: Event) => {
			this.handleInput(e);
		});

		this._button.addEventListener('click', (e: Event) => {
			e.preventDefault();
			this.events.emit('order:submit');
		});
	}

	render(): HTMLElement {
		return this._form;
	}

	setPaymentState(payment: string): void {
		this._paymentButtons.forEach((btn) => {
			if (btn.name === payment) {
				this.domService.addClass(btn, 'button_alt-active');
			} else {
				this.domService.removeClass(btn, 'button_alt-active');
			}
		});
	}

	set valid(value: boolean) {
		if (value) {
			this._button.removeAttribute('disabled');
		} else {
			this._button.setAttribute('disabled', 'disabled');
		}
	}

	set error(value: string) {
		this.domService.setContent(this._error, value);
	}

	resetForm(): void {
		this._address.value = '';
		this._paymentButtons.forEach((button) => {
			this.domService.removeClass(button, 'button_alt-active');
		});
	}

	private handleInput(e: Event): void {
		this.events.emit('order:changeAddress', {
			field: (e.target as HTMLInputElement).name,
			value: (e.target as HTMLInputElement).value,
		});
	}
}
