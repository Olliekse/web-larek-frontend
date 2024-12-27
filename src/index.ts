import './scss/styles.scss';

import { LarekAPI } from './components/LarekAPI';
import { EventEmitter } from './components/base/events';
import { AppData } from './components/AppData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Form } from './components/common/Form';
import { Success } from './components/common/Success';
import { ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';

/**
 * Application initialization
 */

// Initialize core services
const events = new EventEmitter();
const page = new Page(document.body, events);
const api = new LarekAPI(CDN_URL, API_URL);

// Initialize modal windows
const modalContainers = Array.from(
	document.querySelectorAll<HTMLElement>('.modal')
);

const modal = new Modal(modalContainers[0], events);
const basketModal = new Modal(modalContainers[1], events);
const orderModal = new Modal(modalContainers[2], events);
const successModal = new Modal(modalContainers[3], events);

// Get HTML templates
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Initialize components
const basket = new Basket(
	basketTemplate.content.querySelector('.basket'),
	events
);
const success = new Success(
	successTemplate.content.querySelector('.order-success'),
	events
);

/**
 * Application state initialization
 */
const appData = new AppData(
	{
		catalog: [],
		basket: JSON.parse(localStorage.getItem('basket') || '[]'),
		preview: null,
		order: {
			email: '',
			phone: '',
			address: '',
			payment: '',
			items: [],
			total: 0,
		},
	},
	events
);

// Initialize basket counter from localStorage
const savedBasket = JSON.parse(localStorage.getItem('basket') || '[]');
page.counter = savedBasket.length;

/**
 * Event handlers
 */

// Handle catalog updates
events.on('items:changed', () => {
	const state = appData.getState();
	page.catalog = state.catalog.map((item) => {
		const cardElement = cardCatalogTemplate.content.cloneNode(
			true
		) as HTMLElement;
		const card = new Card(cardElement.firstElementChild as HTMLElement, {
			onClick: () => {
				appData.setPreview(item);
				modal.open();
			},
		});

		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Handle basket counter clicks
const basketCounter = document.querySelector('.header__basket');
if (basketCounter) {
	basketCounter.addEventListener('click', () => {
		const state = appData.getState();
		const basketItems = state.basket.map((item) => {
			const cardElement = basketItemTemplate.content.cloneNode(
				true
			) as HTMLElement;
			const card = new Card(cardElement.firstElementChild as HTMLElement, {
				onDelete: () => {
					appData.removeFromBasket(item.id);
				},
			});
			return card.render({
				title: item.title,
				price: item.price,
				category: item.category,
			});
		});

		const basketTotal = state.basket.reduce((sum, item) => sum + item.price, 0);
		basketModal.render({
			content: basket.render({
				items: basketItems,
				total: basketTotal,
			}),
		});
		basketModal.open();
	});
}

// Handle product preview
events.on('preview:changed', () => {
	const state = appData.getState();
	const item = state.preview;
	if (item) {
		const isInBasket = state.basket.some(
			(basketItem) => basketItem.id === item.id
		);
		const card = new Card(
			cardPreviewTemplate.content.cloneNode(true) as HTMLElement,
			{
				onClick: () => {
					if (item.price !== null) {
						appData.addToBasket(item);
						modal.close();
					}
				},
			}
		);

		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				price: item.price,
				category: item.category,
				description: item.description,
			}),
		});

		card.disabled = isInBasket || item.price === null;
	} else {
		modal.close();
	}
});

// Handle basket changes
events.on('basket:changed', () => {
	const state = appData.getState();
	page.counter = state.basket.length;

	const basketItems = state.basket.map((item) => {
		const cardElement = basketItemTemplate.content.cloneNode(
			true
		) as HTMLElement;
		const card = new Card(cardElement.firstElementChild as HTMLElement, {
			onDelete: () => {
				appData.removeFromBasket(item.id);
			},
		});
		return card.render({
			title: item.title,
			price: item.price,
			category: item.category,
		});
	});

	const basketTotal = state.basket.reduce((sum, item) => sum + item.price, 0);
	basketModal.render({
		content: basket.render({
			items: basketItems,
			total: basketTotal,
		}),
	});

	localStorage.setItem('basket', JSON.stringify(state.basket));
});

// Handle checkout process
events.on('basket:checkout', () => {
	basketModal.close();
	const orderForm = new Form(
		orderTemplate.content.cloneNode(true) as HTMLFormElement,
		events
	);
	orderModal.render({
		content: orderForm.render({
			valid: false,
			errors: [],
		}),
	});
	orderModal.open();
});

// Handle form input
events.on('input', (data: { field: string; value: string }) => {
	if (
		data.field === 'email' ||
		data.field === 'phone' ||
		data.field === 'address'
	) {
		appData.setOrderField(data.field, data.value);
	}
});

// Handle form submission
events.on('submit', (data: { payment: string; address: string }) => {
	if (data.payment && data.address) {
		appData.setOrderField('address', data.address);
		appData.setOrderField('payment', data.payment);
		const contactsForm = new Form(
			contactsTemplate.content.cloneNode(true) as HTMLFormElement,
			events
		);
		orderModal.render({
			content: contactsForm.render({
				valid: false,
				errors: [],
			}),
		});
	}
});

// Handle contacts form submission
events.on('contacts:submit', (data: { email: string; phone: string }) => {
	appData.setOrderField('email', data.email);
	appData.setOrderField('phone', data.phone);

	const state = appData.getState();
	api
		.createOrder({
			...state.order,
			items: state.basket.map((item) => item.id),
			total: state.basket.reduce((sum, item) => sum + item.price, 0),
		})
		.then((result) => {
			orderModal.close();
			successModal.render({
				content: success.render({
					total: result.total,
				}),
			});
			successModal.open();
			appData.clearBasket();
		})
		.catch(console.error);
});

// Handle success modal close
events.on('success:close', () => {
	successModal.close();
});

// Start the app
api
	.getProductList()
	.then((items) => {
		appData.setCatalog(items);
		// Trigger initial render of catalog
		const state = appData.getState();
		page.catalog = state.catalog.map((item) => {
			const cardElement = cardCatalogTemplate.content.cloneNode(
				true
			) as HTMLElement;
			const card = new Card(cardElement.firstElementChild as HTMLElement, {
				onClick: () => {
					appData.setPreview(item);
					modal.open();
				},
			});

			return card.render({
				title: item.title,
				image: item.image,
				price: item.price,
				category: item.category,
			});
		});
	})
	.catch(console.error);
