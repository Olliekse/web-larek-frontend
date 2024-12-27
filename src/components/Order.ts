import { Component } from './base/Component';
import { IEvents } from './base/events';
import { IOrderForm } from '../types';

/**
 * Component handling the order form functionality
 * Manages user input for contact and delivery information
 * Emits events when form fields are updated
 */
export class Order extends Component<IOrderForm> {
	private readonly fields: Record<keyof IOrderForm, HTMLInputElement>;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		// Initialize all form fields
		this.fields = {
			phone: container.querySelector('input[name="phone"]'),
			email: container.querySelector('input[name="email"]'),
			address: container.querySelector('input[name="address"]'),
		};

		// Handle input events
		this.container.addEventListener('input', this.handleInput.bind(this));
	}

	/**
	 * Handles input events from form fields
	 * Emits 'input' event with field name and new value
	 * @param event Input event from form field
	 */
	protected handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const field = target.name as keyof IOrderForm;
		if (field in this.fields) {
			this.emit('input', { field, value: target.value });
		}
	}

	/**
	 * Sets the field value in the form
	 * @param field Field name to set
	 * @param value Value to set
	 */
	protected setField(field: keyof IOrderForm, value: string) {
		if (this.fields[field]) {
			this.fields[field].value = value;
		}
	}

	/**
	 * Renders the order form with provided data
	 * Updates form fields if corresponding values are provided
	 * @param data Partial form data to render
	 * @returns The form container element
	 */
	render(data: Partial<IOrderForm>): HTMLElement {
		// Update all provided fields
		(Object.keys(data) as Array<keyof IOrderForm>).forEach((field) => {
			if (data[field] !== undefined) {
				this.setField(field, data[field]);
			}
		});

		return this.container;
	}
}
