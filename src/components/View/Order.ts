import { IEvents } from '../base/events';

export interface IOrder {
	formOrder: HTMLFormElement;
	buttonAll: HTMLButtonElement[];
	paymentSelection: String;
	formErrors: HTMLElement;
	valid: boolean;
	error: string;
	render(): HTMLElement;
	resetForm(): void;
}

export class Order implements IOrder {
	formOrder: HTMLFormElement;
	buttonAll: HTMLButtonElement[];
	buttonSubmit: HTMLButtonElement;
	formErrors: HTMLElement;
	private _valid: boolean = false;
	private _error: string = '';

	constructor(template: HTMLTemplateElement, protected events: IEvents) {
		this.formOrder = template.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.buttonAll = Array.from(this.formOrder.querySelectorAll('.button_alt'));
		this.buttonSubmit = this.formOrder.querySelector('.order__button');
		this.formErrors = this.formOrder.querySelector('.form__errors');

		this.buttonAll.forEach((item) => {
			item.addEventListener('click', () => {
				this.paymentSelection = item.name;
				events.emit('order:paymentSelection', { payment: item.name });
			});
		});

		this.formOrder.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.events.emit(`order:changeAddress`, { field, value });
		});

		this.formOrder.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.events.emit('order:submit');
		});

		this.buttonSubmit.addEventListener('click', (event: Event) => {
			event.preventDefault();
			if (this._valid) {
				this.events.emit('order:submit');
			}
		});
	}

	set paymentSelection(paymentMethod: string) {
		this.buttonAll.forEach((item) => {
			item.classList.toggle('button_alt-active', item.name === paymentMethod);
		});
	}

	get valid(): boolean {
		return this._valid;
	}

	set valid(value: boolean) {
		this._valid = value;
		this.buttonSubmit.disabled = !value;
	}

	get error(): string {
		return this._error;
	}

	set error(value: string) {
		this.formErrors.textContent = value;
	}

	render() {
		return this.formOrder;
	}

	resetForm(): void {
		this.formOrder.reset();
		this.buttonAll.forEach((button) => {
			button.classList.remove('button_alt-active');
		});
		this.formErrors.textContent = '';
	}
}
