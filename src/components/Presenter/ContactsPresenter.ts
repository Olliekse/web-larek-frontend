import { IEvents } from '../base/events';
import { BasePresenter } from '../base/presenter';
import { IFormModel } from '../Model/FormModel';
import { IContacts } from '../View/Contacts';
import { ICartModel } from '../Model/CartModel';

export class ContactsPresenter extends BasePresenter {
    constructor(
        private model: IFormModel,
        private view: IContacts,
        private cartModel: ICartModel,
        events: IEvents
    ) {
        super(events);
    }

    init(): void {
        this.events.on('contacts:changeInput', this.handleInputChange.bind(this));
        this.events.on('contacts:submit', this.handleSubmit.bind(this));
        this.events.on('formErrors:change', this.handleFormErrors.bind(this));
        this.events.on('contacts:open', () => {
            this.validateForm();
        });
    }

    private handleInputChange({ field, value }: { field: string, value: string }): void {
        this.model.setOrderData(field, value);
        this.validateForm();
    }

    private handleSubmit(): void {
        if (this.model.validateContacts()) {
            const total = this.cartModel.getSumAllProducts();
            const successContent = document.querySelector<HTMLTemplateElement>('#success')
                .content.cloneNode(true) as HTMLElement;
            
            const totalElement = successContent.querySelector('.order-success__description');
            if (totalElement) {
                totalElement.textContent = `Списано ${total} синапсов`;
            }

            const successButton = successContent.querySelector('.order-success__close');
            if (successButton) {
                successButton.addEventListener('click', () => {
                    this.events.emit('modal:close');
                    this.events.emit('cart:clear');
                });
            }

            this.events.emit('modal:update', {
                content: successContent,
                title: 'Заказ оформлен'
            });
            
            this.view.resetForm();
            this.model.resetForm();
        }
    }

    private handleFormErrors(errors: Record<string, string>): void {
        const errorMessage = Object.values(errors).join(', ');
        this.view.error = errorMessage;
    }

    private validateForm(): void {
        const isValid = this.model.validateContacts();
        this.view.valid = isValid;
    }
} 