import { View } from './base/view';
import { createElement, ensureElement } from '../utils/utils';
import { INotification } from '../types';

export class Notification extends View<INotification> {
protected _message: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

    this._message = createElement('div', {
			className: 'notification',
		});
		this.container.append(this._message);
	}

	render(data: INotification): void {
		this._message.className = `notification notification_${data.type}`;
		this._message.textContent = (data.message);

    setTimeout(() => {
      this._message.remove();
    }, 3000);
	}
}

