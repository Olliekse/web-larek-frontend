import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

/**
 * Interface defining the structure of the shopping cart view
 * Contains the list of items and total price
 */
interface IBasketView {
	items: HTMLElement[]; // Array of rendered product elements
	total: number; // Total price in synapses
}

/**
 * Component managing the shopping cart functionality
 * Handles display of cart items, total calculation, and checkout process
 * Emits events for cart interactions
 */
export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement; // Container for cart items
	protected _total: HTMLElement; // Display for total price
	protected _button: HTMLButtonElement; // Checkout button

	/**
	 * Initializes the basket component
	 * Sets up DOM elements and event listeners
	 * @param container Main basket container element
	 * @param events Event emitter for component communication
	 */
	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('basket:checkout');
			});
		}
	}

	/**
	 * Updates the list of items in the cart
	 * Disables checkout button if cart is empty
	 * @param items Array of rendered product elements
	 */
	set items(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
		this.setDisabled(this._button, items.length === 0);
	}

	/**
	 * Updates the total price display
	 * Formats the price with currency unit (synapses)
	 * @param total New total price value
	 */
	set total(total: number) {
		this.setText(this._total, `${total.toString()} синапсов`);
	}

	/**
	 * Renders the basket with provided data
	 * Updates both items list and total price
	 * @param data Basket view data containing items and total
	 * @returns The basket container element
	 */
	render(data: IBasketView): HTMLElement {
		this.items = data.items;
		this.total = data.total;
		return this.container;
	}
}
