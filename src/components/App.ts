import { EventEmitter } from './base/events';
import { FormModel } from './model/FormModel';
import { Cart } from './view/CartView';
import { Order } from './view/OrderView';
import { ContactsView } from './view/ContactsView';
import { CartPresenter } from './presenter/CartPresenter';
import { OrderPresenter } from './presenter/OrderPresenter';
import { ContactsPresenter } from './presenter/ContactsPresenter';
import { ProductPresenter } from './presenter/ProductPresenter';
import { ProductApi } from '../services/api/ProductApi';
import { ModalView } from './view/ModalView';
import { ModalPresenter } from './presenter/ModalPresenter';
import { DOMService } from '../services/DOMService';
import { StateService } from '../services/StateService';
import { CardPreview } from './view/CardPreviewView';
import { API_CONFIG } from '../config/api.config';

/** Main application class that initializes and coordinates all components */
export class App {
	private cartPresenter: CartPresenter;
	private orderPresenter: OrderPresenter;
	private contactsPresenter: ContactsPresenter;
	private productPresenter: ProductPresenter;
	private modalPresenter: ModalPresenter;
	private readonly events: EventEmitter;
	private readonly domService: DOMService;
	private readonly stateService: StateService;

	constructor() {
		this.events = new EventEmitter();
		this.domService = new DOMService();
		this.stateService = new StateService(this.events);
		this.initializeApp();
	}

	/**
	 * Gets a template element by ID
	 * @param id - Template element ID
	 * @throws Error if template is not found
	 */
	private getTemplate(id: string): HTMLTemplateElement {
		const template = document.querySelector<HTMLTemplateElement>(id);
		if (!template) {
			throw new Error(`Template ${id} not found`);
		}
		return template;
	}

	/**
	 * Initializes all application components and sets up event handlers
	 */
	private initializeApp(): void {
		const api = new ProductApi(API_CONFIG.CDN_URL, API_CONFIG.API_URL);

		const formModel = new FormModel(this.events);

		const templates = {
			cart: this.getTemplate('#basket'),
			cartItem: this.getTemplate('#card-basket'),
			order: this.getTemplate('#order'),
			contacts: this.getTemplate('#contacts'),
			card: this.getTemplate('#card-catalog'),
		};

		const cartView = new Cart(
			templates.cart,
			this.events,
			this.domService,
			templates.cartItem
		);
		const orderView = new Order(templates.order, this.events, this.domService);
		const contactsView = new ContactsView(
			templates.contacts,
			this.events,
			this.domService
		);

		const modalView = new ModalView(
			document.querySelector('.modal'),
			this.events
		);
		const cardView = new CardPreview(
			templates.card,
			this.events,
			this.domService,
			this.stateService
		);
		this.modalPresenter = new ModalPresenter(
			modalView,
			cardView,
			this.stateService,
			this.events
		);

		this.cartPresenter = new CartPresenter(
			this.stateService,
			cartView,
			this.events
		);
		this.orderPresenter = new OrderPresenter(
			formModel,
			orderView,
			contactsView,
			this.stateService,
			this.events
		);
		this.contactsPresenter = new ContactsPresenter(
			formModel,
			contactsView,
			this.stateService,
			this.events
		);
		this.productPresenter = new ProductPresenter(
			this.stateService,
			cardView,
			api,
			this.events
		);

		this.setupOrderFlow(orderView, modalView);
	}

	/**
	 * Sets up the order flow event handlers
	 * @param orderView - Order view instance
	 * @param modalView - Modal view instance
	 */
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

	/**
	 * Initializes the application
	 * @throws Error if initialization fails
	 */
	async init(): Promise<void> {
		try {
			this.cartPresenter.init();
			this.orderPresenter.init();
			this.contactsPresenter.init();
			await this.productPresenter.init();
		} catch (error) {
			console.error('Failed to initialize application:', error);
			// Maybe show error to user via notification system
		}
	}
}
