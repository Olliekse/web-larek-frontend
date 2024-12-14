import { View } from './view';
import { ensureElement } from '../../utils/utils';
import { IModalData } from '../../types';

export class Modal extends View<IModalData> {
	private static template =
		ensureElement<HTMLTemplateElement>('#modal-container');
	private _closeButton: HTMLButtonElement;
	private _content: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);
		this._content = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener(
			'click',
			this.handleOutsideClick.bind(this)
		);
	}

	render(data: IModalData): void {
		this._content.innerHTML = '';
		this._content.append(data.content);
	}
	open(): void {
		this.container.classList.add('modal_active');
		this.emit('modal:open');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.emit('modal:close');
	}

	private handleOutsideClick(event: MouseEvent): void {
		if (event.target === this.container) {
			this.close();
		}
	}
}
