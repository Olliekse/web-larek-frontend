import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

/**
 * Interface defining the possible actions that can be performed on a card
 * @interface ICardActions
 */
export interface ICardActions {
	/** Callback function for click events on the card or its button */
	onClick?: () => void;
	/** Callback function for delete events, specifically for basket items */
	onDelete?: (event: Event) => void;
}

/**
 * Interface defining the structure of a card's data
 * @interface ICard
 */
export interface ICard {
	/** Unique identifier for the card */
	id?: string;
	/** Title/name of the product */
	title: string;
	/** Detailed description of the product */
	description?: string;
	/** URL of the product image */
	image?: string;
	/** Product category (e.g., 'софт-скил', 'хард-скил', etc.) */
	category: string;
	/** Price in synapses (null if not for sale) */
	price: number | null;
	/** Whether the card is in a selected state */
	selected?: boolean;
}

/**
 * Component class representing a product card in the store
 * Handles rendering and interaction for individual product displays
 * @extends Component<ICard>
 */
export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;

	/**
	 * Creates an instance of Card
	 * @param {HTMLElement | DocumentFragment} container - The container element for the card
	 * @param {ICardActions} [actions] - Optional actions for card interaction
	 */
	constructor(
		container: HTMLElement | DocumentFragment,
		actions?: ICardActions
	) {
		const element =
			container instanceof DocumentFragment
				? (container.firstElementChild as HTMLElement)
				: container;

		super(element);

		// Get all elements
		this._title = ensureElement('.card__title', element);
		this._price = ensureElement('.card__price', element);
		this._category = element.querySelector('.card__category');
		this._image = element.querySelector('.card__image');
		this._button = element.querySelector('.button');

		// Handle basket items differently
		const isBasketItem = element.classList.contains('basket__item');
		if (!isBasketItem && !this._category) {
			throw new Error('Card elements not found');
		}

		// Set up event listeners
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				// If no button, make the whole card clickable
				element.addEventListener('click', actions.onClick);
			}
		}

		if (actions?.onDelete) {
			const deleteButton = element.querySelector('.basket__item-delete');
			if (deleteButton) {
				deleteButton.addEventListener('click', actions.onDelete);
			}
		}
	}

	/**
	 * Sets the card's ID in the dataset
	 * @param {string} value - The ID to set
	 */
	set id(value: string) {
		this.container.dataset.id = value;
	}

	/**
	 * Gets the card's ID from the dataset
	 * @returns {string} The card's ID or empty string if not set
	 */
	get id(): string {
		return this.container.dataset.id || '';
	}

	/**
	 * Sets the card's title text
	 * @param {string} value - The title to set
	 */
	set title(value: string) {
		this.setText(this._title, value);
	}

	/**
	 * Sets the card's image source
	 * @param {string} value - The image URL
	 */
	set image(value: string) {
		if (this._image) {
			this._image.src = value;
			this._image.alt = this.title;
		}
	}

	/**
	 * Sets the selected state of the card
	 * @param {boolean} value - Whether the card is selected
	 */
	set selected(value: boolean) {
		if (this._button) {
			this.setDisabled(this._button, value);
			this._button.classList.toggle('button_disabled', value);
		}
	}

	/**
	 * Sets the disabled state of the card
	 * @param {boolean} value - Whether the card is disabled
	 */
	set disabled(value: boolean) {
		if (this._button) {
			this.setDisabled(this._button, value);
			this._button.classList.toggle('button_disabled', value);
		}
	}

	/**
	 * Sets the price display of the card
	 * @protected
	 * @param {number | null} value - The price in synapses or null if priceless
	 */
	protected setPrice(value: number | null) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button && value === null) {
			this.setDisabled(this._button, true);
		}
	}

	/**
	 * Sets the category of the card and applies appropriate styling
	 * @protected
	 * @param {string} value - The category name
	 */
	protected setCategory(value: string) {
		if (this._category && !this.container.classList.contains('basket__item')) {
			this.setText(this._category, value);
			this._category.className = 'card__category';

			// Map category names to their CSS classes
			const categoryClasses: Record<string, string> = {
				'софт-скил': 'card__category_soft',
				'хард-скил': 'card__category_hard',
				другое: 'card__category_other',
				дополнительное: 'card__category_additional',
				кнопка: 'card__category_button',
			};

			const categoryClass =
				categoryClasses[value.toLowerCase()] || 'card__category_other';
			this._category.classList.add(categoryClass);
		}
	}

	/**
	 * Renders the card with the provided data
	 * @param {ICard} data - The data to render
	 * @returns {HTMLElement} The rendered card element
	 */
	render(data: ICard): HTMLElement {
		if (data.id) this.id = data.id;
		if (data.title) this.title = data.title;
		if (data.image) this.image = data.image;
		if (data.category) this.setCategory(data.category);
		this.setPrice(data.price);

		if (this._button && !this.container.classList.contains('basket__item')) {
			this.setText(
				this._button,
				data.price === null ? 'Не продаётся' : 'В корзину'
			);
			this.selected = data.price === null;
		}

		return this.container;
	}
}

/**
 * Extended card class that includes a description
 * Used for detailed preview displays
 * @extends Card
 */
export class PreviewCard extends Card {
	protected _description: HTMLElement;

	/**
	 * Creates an instance of PreviewCard
	 * @param {HTMLElement} container - The container element
	 * @param {ICardActions} [actions] - Optional actions for card interaction
	 */
	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
		this._description = ensureElement('.card__text', container);
	}

	/**
	 * Renders the preview card with description
	 * @param {ICard} data - The data to render
	 * @returns {HTMLElement} The rendered preview card element
	 */
	render(data: ICard): HTMLElement {
		super.render(data);
		if (data.description) {
			this.setText(this._description, data.description);
		}
		return this.container;
	}
}
