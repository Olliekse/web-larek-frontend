import { EventName, EventPayloadMap } from '../../types/events';

/** Event handler function type */
export type EventHandler = (...args: unknown[]) => void;

/** For sending messages between parts of the app */
export interface IEvents {
	/** Listen for something happening */
	on(event: string, handler: EventHandler): void;
	/** Stop listening */
	off(event: string, handler: EventHandler): void;
	/** Tell others something happened */
	emit(event: string, ...args: unknown[]): void;
}

/** Event emitter implementation for application-wide events */
export class EventEmitter implements IEvents {
	private readonly events: Record<string, EventHandler[]> = {};

	on(event: string, handler: EventHandler): void {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(handler);
	}

	off(event: string, handler: EventHandler): void {
		if (this.events[event]) {
			this.events[event] = this.events[event].filter((h) => h !== handler);
			if (this.events[event].length === 0) {
				delete this.events[event];
			}
		}
	}

	emit(event: string, ...args: unknown[]): void {
		if (this.events[event]) {
			this.events[event].forEach((handler) => handler(...args));
		}
	}
}
