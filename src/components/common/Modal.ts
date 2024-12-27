import { Component } from '../base/Component';
import { IEvents } from '../base/events';

/**
 * Interface defining the modal window content
 * Used to update the modal's inner content
 */
interface IModalData {
	content: HTMLElement; // The HTML element to display inside the modal
}

/**
 * Modal component for displaying content in a popup window
 * Handles opening, closing, and content management
 * Supports clicking outside to close
 */
export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement; // Button to close the modal
	protected _content: HTMLElement; // Container for modal content
	protected _container: HTMLElement; // Main modal container

	/**
	 * Initializes the modal component and sets up event listeners
	 * @param container The modal's container element
	 * @param events Event emitter for modal interactions
	 */
	constructor(container: HTMLElement, events: IEvents) {
		super(container);

		// Initialize modal elements
		this._closeButton = container.querySelector('.modal__close');
		this._content = container.querySelector('.modal__content');
		this._container = container.querySelector('.modal__container');

		// Set up close button click handler
		if (this._closeButton) {
			this._closeButton.addEventListener('click', () => {
				this.close();
			});
		}

		// Set up click outside content handler
		this.container.addEventListener('click', (event: MouseEvent) => {
			if (
				event.target instanceof Element &&
				event.target.classList.contains('modal')
			) {
				this.close();
			}
		});
	}

	/**
	 * Updates the modal's content
	 * Replaces existing content with new HTML element
	 */
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	/**
	 * Opens the modal window
	 * Prevents scrolling of the main page while modal is open
	 */
	open() {
		document.documentElement.style.overflow = 'hidden';
		document.body.style.overflow = 'hidden';
		this.container.classList.add('modal_active');
	}

	/**
	 * Closes the modal window
	 * Restores page scrolling and hides the modal
	 */
	close() {
		document.documentElement.style.overflow = '';
		document.body.style.overflow = '';
		this.container.classList.remove('modal_active');
	}

	/**
	 * Renders the modal with new content
	 * @param data Object containing the HTML element to display
	 * @returns The modal container element
	 */
	render(data: IModalData): HTMLElement {
		this.content = data.content;
		return this.container;
	}
}
