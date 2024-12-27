import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';

/**
 * Interface defining the success message data
 * Used to display the total amount spent
 */
interface ISuccess {
	total: number; // Total amount spent in synapses
}

/**
 * Success component for displaying order completion message
 * Shows the total amount spent and provides a close button
 * Emits close event when user dismisses the message
 */
export class Success extends Component<ISuccess> {
	protected _close: HTMLElement; // Close button element
	protected _total: HTMLElement; // Element displaying total amount

	/**
	 * Initializes the success message component
	 * Sets up elements and close button event listener
	 * @param container The success message container
	 * @param events Event emitter for component interactions
	 */
	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		// Initialize required elements using utility function
		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		// Set up close button click handler
		if (this._close) {
			this._close.addEventListener('click', () => {
				this.events.emit('success:close'); // Emit event when success message is closed
			});
		}
	}

	/**
	 * Updates the displayed total amount
	 * Formats the amount with currency unit (synapses)
	 * @param total The total amount to display
	 */
	set total(total: number) {
		this.setText(this._total, `Списано ${total} синапсов`);
	}

	/**
	 * Renders the success message with the total amount
	 * @param data Object containing the total amount spent
	 * @returns The success message container element
	 */
	render(data: ISuccess): HTMLElement {
		this.total = data.total;
		return this.container;
	}
}
