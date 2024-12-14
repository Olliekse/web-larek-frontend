import { View } from './base/view';
import { IOrderForm } from '../types';
import { ensureElement } from '../utils/utils';

export class OrderForm extends View<IOrderForm> {
	private static template = ensureElement<HTMLTemplateElement>('#order');
	private _cardButton: HTMLButtonElement;
	private _cashButton: HTMLButtonElement;
	private _addressInput: HTMLInputElement;
	private _submitButton: HTMLButtonElement;
	private _paymentMethod: string | null = null;

	constructor(container: HTMLElement) {
		super(container);

		const content = (
			this.constructor as typeof OrderForm
		).template.content.cloneNode(true) as HTMLElement;
		this.container.append(content);

		this._cardButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.container
		);
		this._cashButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.container
		);
		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.container
		);

		this._cardButton.addEventListener('click', () => {
			this.setPaymentMethod('card');
		});
		this._cashButton.addEventListener('click', () => {
			this.setPaymentMethod('cash');
		});
		this._addressInput.addEventListener('input', () => {
			this.validateForm();
		});
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			console.log('Form submitted', {
				payment: this._paymentMethod,
				address: this._addressInput.value.trim(),
			});
			this.handleSubmit(e);
		});
	}

	render(data: Partial<IOrderForm>): void {
		if (data.payment) {
			this._paymentMethod = data.payment;
			this._cardButton.classList.toggle(
				'button_alt-active',
				data.payment === 'card'
			);
			this._cashButton.classList.toggle(
				'button_alt-active',
				data.payment === 'cash'
			);
		}
		if (data.address) {
			this._addressInput.value = data.address;
		}
		this.validateForm();
	}

	private setPaymentMethod(method: 'card' | 'cash'): void {
		this._paymentMethod = method;
		this.render({ payment: method });
	}

	private validateForm(): void {
		const address = this._addressInput.value.trim();
		const isValid = address.length > 0 && this._paymentMethod !== null;

		if (process.env.NODE_ENV === 'development') {
			console.log('OrderForm validation:', {
				address,
				paymentMethod: this._paymentMethod,
				isValid,
			});
		}

		this._submitButton.disabled = !isValid;

		this.emit('order:validate', {
			payment: this._paymentMethod,
			address: address,
			valid: isValid,
		});
	}

	private handleSubmit(e: Event): void {
		e.preventDefault();
		const data = {
			payment: this._paymentMethod,
			address: this._addressInput.value.trim(),
		};
		console.log('Emitting order:submit with data:', data);
		this.emit('order:submit', data);
	}
}
