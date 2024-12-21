import { BasePresenter } from '../base/presenter';
import { IFormModel } from '../model/FormModel';
import { IContacts } from '../view/ContactsView';
import { IEvents } from '../base/events';
import { StateService } from '../../services/StateService';

/** Handles contact form logic and validation */
export class ContactsPresenter extends BasePresenter {
	constructor(
		private formModel: IFormModel,
		private view: IContacts,
		private stateService: StateService,
		events: IEvents
	) {
		super(events);

		this.events.on('contacts:changeInput', this.handleInput.bind(this));
		this.events.on('contacts:submit', this.handleSubmit.bind(this));
		this.events.on('formErrors:change', this.handleFormErrors.bind(this));
	}

	private handleInput({
		field,
		value,
	}: {
		field: string;
		value: string;
	}): void {
		this.formModel.setOrderData(field, value);
		this.validateForm();
	}

	private handleSubmit(): void {
		if (this.formModel.validateContacts()) {
			const cart = this.stateService.getCart();
			this.formModel.total = cart.total;
			this.formModel.items = cart.items.map((item) => item.id);

			const successContent = document
				.querySelector<HTMLTemplateElement>('#success')
				.content.cloneNode(true) as HTMLElement;

			const totalElement = successContent.querySelector(
				'.order-success__description'
			);
			if (totalElement) {
				totalElement.textContent = `Списано ${cart.total} синапсов`;
			}

			const successButton = successContent.querySelector(
				'.order-success__close'
			);
			if (successButton) {
				successButton.addEventListener('click', () => {
					this.stateService.closeModal();
					this.stateService.clearCart();
				});
			}

			this.stateService.openModal(successContent, 'Заказ оформлен');
			this.view.resetForm();
			this.formModel.resetForm();
		}
	}

	private handleFormErrors(errors: Record<string, string>): void {
		const errorMessage = Object.values(errors).join(', ');
		this.view.error = errorMessage;
	}

	private validateForm(): void {
		const isValid = this.formModel.validateContacts();
		this.view.valid = isValid;
	}
}
