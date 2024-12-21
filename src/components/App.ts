import { EventEmitter } from './base/events';
import { CartModel } from './Model/CartModel';
import { FormModel } from './Model/FormModel';
import { DataModel } from './Model/DataModel';
import { Cart } from './View/CartView';
import { Order } from './View/OrderView';
import { Contacts } from './View/ContactsView';
import { CardPreview } from './View/CardPreviewView';
import { CartPresenter } from './Presenter/CartPresenter';
import { OrderPresenter } from './Presenter/OrderPresenter';
import { ContactsPresenter } from './Presenter/ContactsPresenter';
import { ProductPresenter } from './Presenter/ProductPresenter';
import { ApiModel } from './Model/apiModel';
import { ModalView } from './View/ModalView';
import { ModalPresenter } from './Presenter/ModalPresenter';
import { DOMService } from '../services/DOMService';

export class App {
	private cartPresenter: CartPresenter;
	private orderPresenter: OrderPresenter;
	private contactsPresenter: ContactsPresenter;
	private productPresenter: ProductPresenter;
	private modalPresenter: ModalPresenter;
	private readonly events: EventEmitter;
	private readonly domService: DOMService;

	constructor() {
		this.events = new EventEmitter();
		this.domService = new DOMService();
		this.initializeApp();
	}

	private getTemplate(id: string): HTMLTemplateElement {
		const template = document.querySelector<HTMLTemplateElement>(id);
		if (!template) {
			throw new Error(`Template ${id} not found`);
		}
		return template;
	}

	private initializeApp(): void {
		// Initialize API
		const api = new ApiModel(
			'https://larek-api.nomoreparties.co/content/weblarek/',
			'https://larek-api.nomoreparties.co/api/weblarek'
		);

		// Initialize models
		const cartModel = new CartModel(this.events);
		const formModel = new FormModel(this.events);
		const dataModel = new DataModel(this.events);

		// Get templates
		const templates = {
			cart: this.getTemplate('#basket'),
			cartItem: this.getTemplate('#card-basket'),
			order: this.getTemplate('#order'),
			contacts: this.getTemplate('#contacts'),
			card: this.getTemplate('#card-catalog'),
		};

		// Initialize views
		const cartView = new Cart(
			templates.cart,
			this.events,
			this.domService,
			templates.cartItem
		);
		const orderView = new Order(templates.order, this.events);
		const contactsView = new Contacts(templates.contacts, this.events);
		const cardView = new CardPreview(
			templates.card,
			this.events,
			this.domService
		);

		// Initialize modal
		const modalView = new ModalView(
			document.querySelector('.modal'),
			this.events
		);
		this.modalPresenter = new ModalPresenter(
			modalView,
			cardView,
			cartModel,
			this.events
		);

		// Initialize presenters
		this.cartPresenter = new CartPresenter(cartModel, cartView, this.events);
		this.orderPresenter = new OrderPresenter(
			formModel,
			orderView,
			contactsView,
			this.events
		);
		this.contactsPresenter = new ContactsPresenter(
			formModel,
			contactsView,
			cartModel,
			this.events
		);
		this.productPresenter = new ProductPresenter(
			dataModel,
			cartModel,
			cardView,
			api,
			this.events
		);

		// Setup order flow
		this.setupOrderFlow(orderView, modalView);
	}

	private setupOrderFlow(orderView: Order, modalView: ModalView): void {
		this.events.on('order:open', () => {
			modalView.close();
			orderView.render();
			this.events.emit('modal:open', {
				content: orderView.render(),
				title: 'Оформление',
			});
		});
	}

	async init(): Promise<void> {
		this.cartPresenter.init();
		this.orderPresenter.init();
		this.contactsPresenter.init();
		await this.productPresenter.init();
	}
}
