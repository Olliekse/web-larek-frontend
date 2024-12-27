import { IEvents } from './events';

/**
 * Type guard to check if an object is an instance of Model
 * @param {unknown} obj - Object to check
 * @returns {boolean} True if object is a Model instance
 */
export const isModel = (obj: unknown): obj is Model<any> => {
	return obj instanceof Model;
};

/**
 * Abstract base class for data models in the application
 * Provides state management and event emission functionality
 * @template T The type of state data managed by the model
 */
export abstract class Model<T> {
	/** Event emitter for model state changes */
	protected events: IEvents;
	/** Internal state storage */
	private state: T;

	/**
	 * Creates a new model instance
	 * @param {Partial<T>} data - Initial state data
	 * @param {IEvents} events - Event emitter for state changes
	 */
	constructor(data: Partial<T>, events: IEvents) {
		this.state = data as T;
		this.events = events;
	}

	/**
	 * Gets the current state of the model
	 * @returns {T} The current state
	 */
	public getState(): T {
		return this.state;
	}

	/**
	 * Updates the model's state
	 * @protected
	 * @param {T} newState - New state to set
	 */
	protected updateState(newState: T) {
		this.state = newState;
	}

	/**
	 * Emits a state change event
	 * @protected
	 * @param {string} event - Name of the event to emit
	 */
	protected emitChanges(event: string) {
		this.events.emit(event);
	}
}
