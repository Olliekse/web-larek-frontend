import { EventEmitter } from './events';

export abstract class View<T> extends EventEmitter {
	protected container: HTMLElement;
	protected state: T;

	constructor(container: HTMLElement) {
		super();
		this.container = container;
	}

	setState(state: Partial<T>) {
		this.state = { ...this.state, ...state };
		this.render(this.state);
	}

	getState(): T {
		return this.state;
	}

	get element(): HTMLElement {
		return this.container;
	}

	abstract render(state: T): void;
}
