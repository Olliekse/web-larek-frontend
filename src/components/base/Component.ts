import { IEvents } from './events';

/**
 * Abstract base class for all UI components
 * Provides common functionality for rendering and event handling
 * @template T The type of data the component will render
 */
export abstract class Component<T> {
	/** The root DOM element of the component */
	protected container: HTMLElement;
	/** Event emitter for component communication */
	protected events: IEvents;

	/**
	 * Creates a new component instance
	 * @param {HTMLElement} container - The root element for this component
	 * @param {IEvents} [events] - Optional event emitter for component communication
	 */
	constructor(container: HTMLElement, events?: IEvents) {
		this.container = container;
		this.events = events;
	}

	/**
	 * Sets the text content of an HTML element
	 * @protected
	 * @param {HTMLElement} element - The element to update
	 * @param {unknown} value - The value to set as text content
	 */
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	/**
	 * Sets the source and alt text of an image element
	 * @protected
	 * @param {HTMLImageElement} element - The image element to update
	 * @param {string} src - The source URL for the image
	 * @param {string} [alt] - Optional alternative text for the image
	 */
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	/**
	 * Sets or removes the disabled attribute of an HTML element
	 * @protected
	 * @param {HTMLElement} element - The element to update
	 * @param {boolean} state - Whether to disable (true) or enable (false) the element
	 */
	protected setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) {
				element.setAttribute('disabled', 'disabled');
			} else {
				element.removeAttribute('disabled');
			}
		}
	}

	/**
	 * Emits an event through the component's event emitter
	 * @protected
	 * @param {string} event - The name of the event to emit
	 * @param {object} [payload] - Optional data to send with the event
	 */
	protected emit(event: string, payload?: object) {
		if (this.events) {
			this.events.emit(event, payload);
		}
	}

	/**
	 * Renders the component with the provided data
	 * Must be implemented by each component class
	 * @abstract
	 * @param {Partial<T>} [data] - The data to render
	 * @returns {HTMLElement} The rendered component's container element
	 */
	abstract render(data?: Partial<T>): HTMLElement;
}
