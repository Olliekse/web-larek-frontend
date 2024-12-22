import { IEvents } from '../base/events';

export interface IModalView {
    open(): void;
    close(): void;
    setContent(content: HTMLElement): void;
    setTitle(title: string): void;
}

export class ModalView implements IModalView {
    protected _content: HTMLElement;
    protected _title: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected pageWrapper: HTMLElement;

    constructor(
        protected container: HTMLElement,
        protected events: IEvents
    ) {
        if (!container) {
            throw new Error('Modal container element not found');
        }
        
        this._content = container.querySelector('.modal__content');
        this._title = container.querySelector('.modal__title');
        this.closeButton = container.querySelector('.modal__close');
        this.pageWrapper = document.querySelector('.page__wrapper');
        
        if (!this._content || !this.pageWrapper) {
            throw new Error('Required modal elements not found');
        }
        
        this.closeButton?.addEventListener('click', () => {
            this.events.emit('modal:close');
        });
        
        this.container.addEventListener('click', () => {
            this.events.emit('modal:close');
        });
        
        this.container.querySelector('.modal__container')
            ?.addEventListener('click', (event: Event) => event.stopPropagation());

        this.events.on('modal:update', (data: { content: HTMLElement, title?: string }) => {
            this.setContent(data.content);
            if (data.title) {
                this.setTitle(data.title);
            }
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.pageWrapper.classList.add('page__wrapper_locked');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.pageWrapper.classList.remove('page__wrapper_locked');
        this._content.innerHTML = '';
    }

    setContent(content: HTMLElement): void {
        if (this._content) {
            this._content.innerHTML = '';
            this._content.appendChild(content);
        }
    }

    setTitle(title: string): void {
        if (this._title) {
            this._title.textContent = title;
        }
    }
} 