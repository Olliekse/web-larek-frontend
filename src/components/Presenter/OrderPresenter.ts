import { IEvents } from '../base/events';
import { BasePresenter } from '../base/presenter';
import { IFormModel } from '../Model/FormModel';
import { IOrder } from '../View/Order';
import { IContacts } from '../View/Contacts';

export class OrderPresenter extends BasePresenter {
    constructor(
        private model: IFormModel,
        private view: IOrder,
        private contactsView: IContacts,
        events: IEvents
    ) {
        super(events);
        
        this.events.on('cart:clear', () => {
            this.view.resetForm();
            this.model.resetForm();
        });
    }

    init(): void {
        this.events.on('order:paymentSelection', this.handlePaymentSelection.bind(this));
        this.events.on('order:changeAddress', this.handleAddressChange.bind(this));
        this.events.on('order:submit', this.handleSubmit.bind(this));
        this.events.on('formErrors:address', this.handleFormErrors.bind(this));
    }

    private handlePaymentSelection(data: { payment: string }): void {
        this.model.payment = data.payment;
        this.validateOrder();
    }

    private handleAddressChange({ field, value }: { field: string, value: string }): void {
        this.model.setOrderAddress(field, value);
        this.validateOrder();
    }

    private handleSubmit(): void {
        if (this.model.validateOrder()) {
            this.events.emit('modal:update', {
                content: this.contactsView.render(),
                title: 'Контакты'
            });
            this.events.emit('contacts:open');
        }
    }

    private handleFormErrors(errors: Record<string, string>): void {
        const errorMessage = Object.values(errors).join(', ');
        this.view.error = errorMessage;
    }

    private validateOrder(): void {
        const isValid = this.model.validateOrder();
        this.view.valid = isValid;
    }
} 