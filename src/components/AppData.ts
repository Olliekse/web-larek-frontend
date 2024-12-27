import { Model } from './base/Model';
import { IEvents } from './base/events';
import { IOrder, IProduct, IAppState } from '../types';

/**
 * Types for action payloads
 */
export type OrderUpdatePayload = {
	field: keyof IAppState['order'];
	value: string | number;
};

/**
 * Action types for state mutations
 */
export enum ActionType {
	SET_CATALOG = 'SET_CATALOG',
	ADD_TO_BASKET = 'ADD_TO_BASKET',
	REMOVE_FROM_BASKET = 'REMOVE_FROM_BASKET',
	CLEAR_BASKET = 'CLEAR_BASKET',
	SET_PREVIEW = 'SET_PREVIEW',
	UPDATE_ORDER = 'UPDATE_ORDER',
}

/**
 * Main application data management class that handles the state of the web store.
 * Implements a simple state management pattern with actions and mutations.
 */
export class AppData extends Model<IAppState> {
	/**
	 * Creates an instance of AppData.
	 * @param {Partial<IAppState>} data - Initial state data for the application
	 * @param {IEvents} events - Event emitter instance for handling state changes
	 */
	constructor(data: Partial<IAppState>, events: IEvents) {
		super(data, events);
	}

	/**
	 * Dispatches an action to modify the state
	 * @private
	 * @param {ActionType} type - Type of action to perform
	 * @param {IProduct[] | IProduct | string | OrderUpdatePayload | null} payload - Data for the action
	 */
	private dispatch(
		type: ActionType,
		payload: IProduct[] | IProduct | string | OrderUpdatePayload | null
	) {
		let newState: Partial<IAppState> = {};
		let order: IAppState['order'];
		let field: keyof IAppState['order'];
		let value: string | number;

		switch (type) {
			case ActionType.SET_CATALOG:
				newState = { catalog: payload as IProduct[] };
				break;
			case ActionType.ADD_TO_BASKET:
				newState = {
					basket: [...this.getState().basket, payload as IProduct],
				};
				break;
			case ActionType.REMOVE_FROM_BASKET:
				newState = {
					basket: this.getState().basket.filter(
						(item) => item.id !== (payload as string)
					),
				};
				break;
			case ActionType.CLEAR_BASKET:
				newState = { basket: [] };
				break;
			case ActionType.SET_PREVIEW:
				newState = { preview: payload as IProduct };
				break;
			case ActionType.UPDATE_ORDER:
				({ field, value } = payload as OrderUpdatePayload);
				order = { ...this.getState().order };

				if (field === 'total') {
					order.total = Number(value);
				} else if (field !== 'items') {
					order[field] = value as string;
				}
				newState = { order };
				break;
		}

		this.updateState({
			...this.getState(),
			...newState,
		});

		const eventMap: Record<ActionType, string> = {
			[ActionType.SET_CATALOG]: 'items:changed',
			[ActionType.ADD_TO_BASKET]: 'basket:changed',
			[ActionType.REMOVE_FROM_BASKET]: 'basket:changed',
			[ActionType.CLEAR_BASKET]: 'basket:changed',
			[ActionType.SET_PREVIEW]: 'preview:changed',
			[ActionType.UPDATE_ORDER]: 'order:changed',
		};

		this.emitChanges(eventMap[type]);
	}

	/**
	 * Sets the product catalog with new items.
	 * @param {IProduct[]} items - Array of products to set as the catalog
	 * @emits {items:changed} When catalog is updated
	 */
	setCatalog(items: IProduct[]) {
		this.dispatch(ActionType.SET_CATALOG, items);
	}

	/**
	 * Adds a product to the shopping basket.
	 * @param {IProduct} item - Product to add to the basket
	 * @emits {basket:changed} When item is added to basket
	 */
	addToBasket(item: IProduct) {
		this.dispatch(ActionType.ADD_TO_BASKET, item);
	}

	/**
	 * Removes a product from the shopping basket by its ID.
	 * @param {string} id - ID of the product to remove
	 * @emits {basket:changed} When item is removed from basket
	 */
	removeFromBasket(id: string) {
		this.dispatch(ActionType.REMOVE_FROM_BASKET, id);
	}

	/**
	 * Clears all items from the shopping basket.
	 * @emits {basket:changed} When basket is cleared
	 */
	clearBasket() {
		this.dispatch(ActionType.CLEAR_BASKET, null);
	}

	/**
	 * Sets the product to be previewed in detail view.
	 * @param {IProduct | null} item - Product to preview, or null to clear preview
	 * @emits {preview:changed} When preview item is set or cleared
	 */
	setPreview(item: IProduct | null) {
		this.dispatch(ActionType.SET_PREVIEW, item);
	}

	/**
	 * Updates a specific field in the order data.
	 * @param {keyof IAppState['order']} field - Name of the order field to update
	 * @param {string | number} value - New value for the field
	 * @emits {order:changed} When order field is updated
	 */
	setOrderField(field: keyof IAppState['order'], value: string | number) {
		this.dispatch(ActionType.UPDATE_ORDER, { field, value });
	}

	/**
	 * Validates the current order data.
	 * @returns {Partial<Record<keyof IAppState['order'], string>>} Object containing validation errors, if any
	 */
	validateOrder(): Partial<Record<keyof IAppState['order'], string>> {
		const order = this.getState().order;
		const requiredFields: Array<keyof IAppState['order']> = [
			'email',
			'phone',
			'address',
		];

		return requiredFields.reduce((errors, field) => {
			if (!order[field]) {
				errors[field] = `${field} is required`;
			}
			return errors;
		}, {} as Record<keyof IAppState['order'], string>);
	}
}
