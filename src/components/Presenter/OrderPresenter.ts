import { BasePresenter } from '../base/presenter';
import { IFormModel } from '../model/FormModel';
import { IOrder } from '../view/OrderView';
import { IContacts } from '../view/ContactsView';
import { IEvents } from '../base/events';
import { StateService } from '../../services/StateService';

/** Manages order processing and submission */
export class OrderPresenter extends BasePresenter {
	constructor(
		private formModel: IFormModel,
		private view: IOrder,
		private contactsView: IContacts,
		private stateService: StateService,
		events: IEvents
	) {
		super(events);

		this.events.on('order:paymentSelection', (data: { payment: string }) => {
			this.formModel.payment = data.payment;
			this.validateOrder();
		});

		this.events.on('order:changeAddress', this.handleAddressChange.bind(this));
		this.events.on('order:submit', this.handleSubmit.bind(this));
		this.events.on('formErrors:address', this.handleFormErrors.bind(this));

		this.events.on('form:reset', () => {
			this.formModel.resetForm();
			this.view.resetForm();
			this.contactsView.resetForm();
		});
	}

	private handleAddressChange({
		field,
		value,
	}: {
		field: string;
		value: string;
	}): void {
		this.formModel.setOrderAddress(field, value);
		this.validateOrder();
	}

	private handleSubmit(): void {
		if (this.formModel.validateOrder()) {
			this.events.emit('modal:update', {
				content: this.contactsView.render(),
				title: 'Контакты',
			});
			this.events.emit('contacts:open');
		}
	}

	private handleFormErrors(errors: Record<string, string>): void {
		const errorMessage = Object.values(errors).join(', ');
		this.view.error = errorMessage;
	}

	private validateOrder(): void {
		const isValid = this.formModel.validateOrder();
		this.view.valid = isValid;
	}
}
