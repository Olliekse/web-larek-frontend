import { BasePresenter } from '../base/presenter';
import { IEvents } from '../base/events';
import { CardPreview } from '../view/CardPreviewView';
import { AppState } from '../model/AppState';

/** Interface for modal view functionality */
export interface IModalView {
	/** Opens the popup */
	open(): void;
	/** Closes the popup */
	close(): void;
	/** Puts content in the popup */
	setContent(content: HTMLElement): void;
	/** Sets the popup title */
	setTitle(title: string): void;
}

interface ModalState {
	isOpen: boolean;
	content?: HTMLElement;
	title?: string;
}

/** Controls the popup window behavior */
export class ModalPresenter extends BasePresenter {
	/**
	 * Creates a new ModalPresenter instance
	 * @param view - Modal view instance
	 * @param cardView - Card preview view instance
	 * @param appState - Application state model
	 * @param events - Event emitter instance
	 */
	constructor(
		private view: IModalView,
		private cardView: CardPreview,
		private appState: AppState,
		events: IEvents
	) {
		super(events);

		this.events.on('state:modal:changed', (modalState: ModalState) => {
			if (modalState.isOpen) {
				this.view.open();
				if (modalState.content) {
					this.view.setContent(modalState.content);
				}
				if (modalState.title) {
					this.view.setTitle(modalState.title);
				}
			} else {
				this.view.close();
			}
		});

		this.events.on('modal:close', () => {
			this.appState.closeModal();
		});

		this.events.on('modal:open', (modalState: ModalState) => {
			this.appState.openModal(modalState.content, modalState.title);
		});
	}
}
