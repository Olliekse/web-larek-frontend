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
import { AppState } from './model/AppState';
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
	private readonly appState: AppState;
	private readonly gallery: HTMLElement;
	private readonly modalElement: HTMLElement;
	private readonly pageWrapper: HTMLElement;

	constructor() {
		this.events = new EventEmitter();
		this.domService = new DOMService();
		this.appState = new AppState(this.events);

		// Get DOM elements once
		this.gallery = this.getElement('.gallery');
		this.modalElement = this.getElement('.modal');
		this.pageWrapper = this.getElement('.page__wrapper');

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
	 * Gets a DOM element by selector
	 * @param selector - CSS selector
	 * @throws Error if element is not found
	 */
	private getElement(selector: string): HTMLElement {
		const element = document.querySelector<HTMLElement>(selector);
		if (!element) {
			throw new Error(`Element ${selector} not found`);
		}
		return element;
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
			success: this.getTemplate('#success'),
		};

		const headerButton = this.getElement('.header__basket');
		const headerCounter = this.getElement('.header__basket-counter');

		const cartView = new Cart(
			templates.cart,
			this.events,
			this.domService,
			headerButton,
			headerCounter
		);
		const orderView = new Order(templates.order, this.events, this.domService);
		const contactsView = new ContactsView(
			templates.contacts,
			this.events,
			this.domService
		);

		const modalView = new ModalView(
			this.modalElement,
			this.pageWrapper,
			this.events
		);
		const cardView = new CardPreview(
			templates.card,
			this.events,
			this.domService,
			this.appState
		);
		this.modalPresenter = new ModalPresenter(
			modalView,
			cardView,
			this.appState,
			this.events
		);

		this.cartPresenter = new CartPresenter(
			this.appState,
			cartView,
			this.events,
			this.domService,
			templates.cartItem
		);
		this.orderPresenter = new OrderPresenter(
			formModel,
			orderView,
			contactsView,
			this.appState,
			this.events
		);
		this.contactsPresenter = new ContactsPresenter(
			formModel,
			contactsView,
			this.appState,
			api,
			this.events,
			templates.success
		);
		this.productPresenter = new ProductPresenter(
			this.appState,
			cardView,
			api,
			this.events,
			this.gallery
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
