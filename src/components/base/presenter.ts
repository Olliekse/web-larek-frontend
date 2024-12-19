import { IEvents } from './events';

export interface IPresenter {
	init(): void;
	destroy(): void;
}

export abstract class BasePresenter implements IPresenter {
	constructor(protected events: IEvents) {}

	init(): void {}

	destroy(): void {}
}
