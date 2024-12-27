import { Component } from './base/Component';
import { IEvents } from './base/events';

/**
 * Interface defining the main page structure
 * Contains the shopping cart counter and product catalog
 */
interface IPage {
	counter: number; // Number of items in shopping cart
	catalog: HTMLElement[]; // Array of product card elements
}

/**
 * Page component managing the main application layout
 * Handles catalog display and cart counter updates
 * Listens for counter and catalog change events
 */
export class Page extends Component<IPage> {
	protected _counter: HTMLElement; // Shopping cart counter element
	protected _catalog: HTMLElement; // Product gallery container
	protected _wrapper: HTMLElement; // Main page wrapper

	/**
	 * Initializes the page component and sets up event listeners
	 * @param container The main page container element
	 * @param events Event emitter for page interactions
	 */
	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		// Initialize page elements
		this._counter = container.querySelector('.header__basket-counter');
		this._catalog = container.querySelector('.gallery');
		this._wrapper = container.querySelector('.page__wrapper');

		// Set up event listeners for counter and catalog updates
		if (events) {
			events.on('counter:changed', this.setCounter.bind(this));
			events.on('catalog:changed', this.setCatalog.bind(this));
		}
	}

	/**
	 * Updates the shopping cart counter display
	 * @param value Number of items in cart
	 */
	set counter(value: number) {
		this.setText(this._counter, value.toString());
	}

	/**
	 * Updates the product catalog display
	 * Replaces all current cards with new ones
	 * @param items Array of product card elements
	 */
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	/**
	 * Event handler for counter updates
	 * @param value New counter value
	 */
	protected setCounter(value: number) {
		this.counter = value;
	}

	/**
	 * Event handler for catalog updates
	 * @param items New catalog items
	 */
	protected setCatalog(items: HTMLElement[]) {
		this.catalog = items;
	}

	/**
	 * Renders the page with provided data
	 * Updates counter and catalog if provided
	 * @param data Partial page data to update
	 * @returns The page container element
	 */
	render(data: Partial<IPage>): HTMLElement {
		if (data.counter !== undefined) {
			this.counter = data.counter;
		}
		if (data.catalog) {
			this.catalog = data.catalog;
		}
		return this.container;
	}
}
