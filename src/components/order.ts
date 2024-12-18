import { View } from './base/view';
import { ensureElement } from '../utils/utils';

export class OrderForm extends View<{ payment: string; address: string }> {
    private static template = ensureElement<HTMLTemplateElement>('#order');
    private readonly _cardButton: HTMLButtonElement;
    private readonly _cashButton: HTMLButtonElement;
    private readonly _addressInput: HTMLInputElement;
    private readonly _submitButton: HTMLButtonElement;
    private readonly _errorMessage: HTMLElement;
    private _paymentMethod: string | null = null;

    constructor(container: HTMLElement) {
        super(container);

        const content = (this.constructor as typeof OrderForm).template.content.cloneNode(true) as HTMLElement;
        this.container.append(content);

        this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

        this._errorMessage = document.createElement('span');
        this._errorMessage.className = 'modal__message';
        this._submitButton.parentElement?.appendChild(this._errorMessage);

        this._cardButton.addEventListener('click', () => this.setPaymentMethod('card'));
        this._cashButton.addEventListener('click', () => this.setPaymentMethod('cash'));
        this._addressInput.addEventListener('input', () => this.validateForm());

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.emit('order:submit', {
                    payment: this._paymentMethod,
                    address: this._addressInput.value
                });
            }
        });
    }

    private setPaymentMethod(method: 'card' | 'cash'): void {
        this._paymentMethod = method;
        this._cardButton.classList.toggle('button_alt-active', method === 'card');
        this._cashButton.classList.toggle('button_alt-active', method === 'cash');
        this.validateForm();
    }

    private validateForm(): boolean {
        const address = this._addressInput.value.trim();

        if (!address) {
            this._errorMessage.textContent = 'Необходимо указать адрес доставки';
            this._errorMessage.classList.add('modal__message_error');
        } else if (!this._paymentMethod) {
            this._errorMessage.textContent = 'Необходимо выбрать способ оплаты';
            this._errorMessage.classList.add('modal__message_error');
        } else {
            this._errorMessage.textContent = '';
            this._errorMessage.classList.remove('modal__message_error');
        }

        this._submitButton.disabled = !address || !this._paymentMethod;
        return Boolean(address && this._paymentMethod);
    }

    render(data: { payment?: string; address?: string }): void {
        if (data.payment) {
            this.setPaymentMethod(data.payment as 'card' | 'cash');
        }
        if (data.address) {
            this._addressInput.value = data.address;
        }
        this.validateForm();
    }

    get payment(): 'card' | 'cash' | null {
        return this._paymentMethod as 'card' | 'cash' | null;
    }

    set payment(value: 'card' | 'cash' | null) {
        this._paymentMethod = value;
        this._cardButton.classList.toggle('button_alt-active', value === 'card');
        this._cashButton.classList.toggle('button_alt-active', value === 'cash');
        this.validateForm();
    }

    get address(): string {
        return this._addressInput.value;
    }

    set address(value: string) {
        this._addressInput.value = value;
        this.validateForm();
    }

    get isValid(): boolean {
        return this._addressInput.value.trim().length > 0 && this._paymentMethod !== null;
    }
}