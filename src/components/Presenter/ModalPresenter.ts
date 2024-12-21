import { IModalView } from '../View/ModalView';
import { IEvents } from '../base/events';
import { BasePresenter } from '../base/presenter';
import { CardPreview } from '../View/CardPreviewView';
import { CartModel, ICartModel } from '../Model/CartModel';
import { IProduct } from '../../types';

export class ModalPresenter extends BasePresenter {
	constructor(
		private view: IModalView,
		private cardView: CardPreview,
		private cartModel: ICartModel,
		events: IEvents
	) {
		super(events);

		this.events.on('modal:open', this.handleOpen.bind(this));
		this.events.on('modal:close', this.handleClose.bind(this));
		this.events.on('modal:product:open', this.handleProductOpen.bind(this));
	}

	private handleProductOpen(product: IProduct): void {
		this.events.emit('cart:state:get');

		setTimeout(() => {
			const modalCard = this.cardView.renderModal(product);
			this.handleOpen({
				content: modalCard,
				title: product.title,
			});
		}, 0);
	}

	private handleOpen(data: { content: HTMLElement; title?: string }): void {
		this.view.setContent(data.content);
		if (data.title) {
			this.view.setTitle(data.title);
		}
		this.view.open();
	}

	private handleClose(): void {
		this.view.close();
	}
}
