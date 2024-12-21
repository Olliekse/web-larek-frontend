import { EventName, EventPayloadMap } from '../../types/events';

export interface IEvents {
	on<T extends EventName>(
		event: T,
		callback: (data: EventPayloadMap[T]) => void
	): void;
	emit<T extends EventName>(event: T, data?: EventPayloadMap[T]): void;
	trigger<T extends EventName>(
		event: T,
		context?: Partial<EventPayloadMap[T]>
	): (data: EventPayloadMap[T]) => void;
}

export class EventEmitter implements IEvents {
	private _events: Map<EventName, Set<Function>>;

	constructor() {
		this._events = new Map<EventName, Set<Function>>();
	}

	on<T extends EventName>(
		eventName: T,
		callback: (data: EventPayloadMap[T]) => void
	) {
		if (!this._events.has(eventName)) {
			this._events.set(eventName, new Set<Function>());
		}
		this._events.get(eventName)?.add(callback);
	}

	off(eventName: EventName, callback: Function) {
		if (this._events.has(eventName)) {
			this._events.get(eventName)!.delete(callback);
			if (this._events.get(eventName)?.size === 0) {
				this._events.delete(eventName);
			}
		}
	}

	emit<T extends EventName>(eventName: T, data?: EventPayloadMap[T]) {
		this._events.forEach((subscribers, name) => {
			if (name === '*') {
				subscribers.forEach((callback) => callback({ eventName, data }));
			}
			if (name === eventName) {
				subscribers.forEach((callback) => callback(data));
			}
		});
	}

	onAll(callback: (event: { eventName: EventName; data: unknown }) => void) {
		this.on('*' as EventName, callback);
	}

	offAll() {
		this._events = new Map<EventName, Set<Function>>();
	}

	trigger<T extends EventName>(
		eventName: T,
		context?: Partial<EventPayloadMap[T]>
	) {
		return (event: Partial<EventPayloadMap[T]> = {}) => {
			this.emit(eventName, {
				...(event || {}),
				...(context || {}),
			} as EventPayloadMap[T]);
		};
	}
}
