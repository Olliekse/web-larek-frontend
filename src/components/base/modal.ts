import { View } from './view';
import { ensureElement } from '../../utils/utils';

export interface IModalContent {
	content: HTMLElement;
	title?: string;
}

export class Modal extends View<IModalContent> {
	private _closeButton: HTMLButtonElement;
	private _content: HTMLElement;
	private _title: HTMLElement;
	private _modalContainer: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this._modalContainer =
			container.querySelector('.modal__container') ||
			document.createElement('div');
		if (!this._modalContainer.parentElement) {
			this._modalContainer.className = 'modal__container';
			container.append(this._modalContainer);
		}

		this._content =
			this._modalContainer.querySelector('.modal__content') ||
			document.createElement('div');
		if (!this._content.parentElement) {
			this._content.className = 'modal__content';
			this._modalContainer.append(this._content);
		}

		this._title =
			this._modalContainer.querySelector('.modal__title') ||
			document.createElement('h3');
		if (!this._title.parentElement) {
			this._title.className = 'modal__title';
			this._modalContainer.insertBefore(this._title, this._content);
		}

		this._closeButton =
			this._modalContainer.querySelector('.modal__close') ||
			document.createElement('button');
		if (!this._closeButton.parentElement) {
			this._closeButton.className = 'modal__close';
			this._closeButton.type = 'button';
			this._modalContainer.append(this._closeButton);
		}

		this._closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener('click', (event) => {
			if (event.target === this.container) {
				this.close();
			}
		});
	}

	render(data: IModalContent): void {
		this._content.innerHTML = '';
		this._content.append(data.content);
		this._title.textContent = data.title || '';

		const priceElements = this._content.querySelectorAll('.card__price');
		priceElements.forEach((element) => {
			if (element.textContent?.includes('null')) {
				element.textContent = 'Цена по запросу';
			}
		});
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
}
