// src/components/base/modal.ts

import { View } from './view';
import { ensureElement } from '../../utils/utils';

export interface IModalContent {
	content: HTMLElement;
	title?: string;
}

export class Modal extends View<IModalContent> {
	private static template =
		ensureElement<HTMLTemplateElement>('#modal-container');
	private _closeButton: HTMLButtonElement;
	private _content: HTMLElement;
	private _title: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		const content = (
			this.constructor as typeof Modal
		).template.content.cloneNode(true) as HTMLElement;
		this.container.append(content);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);
		this._content = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);
		this._title = ensureElement<HTMLElement>('.modal__title', this.container);

		this._closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener(
			'click',
			this.handleOutsideClick.bind(this)
		);
	}

	render(data: IModalContent): void {
		this._content.innerHTML = '';
		this._content.append(data.content);

		if (data.title) {
			this._title.textContent = data.title;
		}
	}

	open(): void {
		this.container.classList.add('modal_active');
		this.emit('modal:open');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.emit('modal:close');
		this._content.innerHTML = '';
	}

	private handleOutsideClick(event: MouseEvent): void {
		if (event.target === this.container) {
			this.close();
		}
	}
}
