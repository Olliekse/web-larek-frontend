import { IEvents } from './events';

export interface IPresenter {
	init(): void;
	destroy(): void;
}

/** Base class for all presenters in the app */
export abstract class BasePresenter implements IPresenter {
	/**
	 * Creates a new presenter
	 * @param events - Event system for communication
	 */
	constructor(protected events: IEvents) {}

	init(): void {}

	destroy(): void {}
}
