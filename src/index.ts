import './scss/styles.scss';

import { Modal } from './components/base/modal';
import { Catalog } from './components/catalog';
import { ProductDetails } from './components/product';
import { ICartItem, IProduct, IOrderForm, IOrder } from './types';
import { createElement, ensureElement } from './utils/utils';
import { Cart } from './components/cart';
import { OrderForm } from './components/order';
import { ContactsForm } from './components/contacts';
import { Api } from './utils/api';
import { API_URL, CDN_URL } from './utils/constants';
import { Notification } from './components/notification';
const api = new Api(API_URL, CDN_URL);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const catalog = new Catalog(ensureElement<HTMLElement>('.gallery'));

const notification = new Notification(createElement('div'));
document.body.appendChild(notification.element);

const toggleLoader = (state: boolean) => {
	document.body.classList.toggle('loading', state);
};

const updateCartCounter = () => {
	const counter = document.querySelector('.header__basket-counter');
	if (counter) {
		counter.textContent = String(cartItems.length);
	}
};

const savedCart = localStorage.getItem('cart');
const cartItems: ICartItem[] = savedCart ? JSON.parse(savedCart) : [];

const cart = new Cart(createElement('div'));
cart.render(cartItems);
updateCartCounter();

toggleLoader(true);
api
	.getProducts()
	.then((products) => {
		catalog.render(products);
	})
	.catch((error) => {
		notification.render({
			type: 'error',
			message: 'Failed to load products',
		});
	})
	.finally(() => {
		toggleLoader(false);
	});

cart.on('cart:checkout', () => {
	orderData = {};
	const orderForm = new OrderForm(createElement('div'));

	orderForm.on(
		'order:submit',
		(formData: { payment: 'card' | 'cash'; address: string }) => {
			const contactsForm = new ContactsForm(createElement('div'));

			contactsForm.on(
				'contacts:submit',
				(contactsData: { email: string; phone: string }) => {
					const fullOrderData: IOrder = {
						payment: formData.payment,
						address: formData.address,
						email: contactsData.email,
						phone: contactsData.phone,
						items: cartItems.map((item) => item.id),
					};

					toggleLoader(true);
					api
						.orderProducts(fullOrderData)
						.then(() => {
							cartItems.length = 0;
							cart.render(cartItems);
							localStorage.removeItem('cart');

							updateCartCounter();

							modal.close();
							notification.render({
								type: 'success',
								message: 'Order placed successfully!',
							});
						})
						.catch(error => {
							notification.render({
								type: 'error',
								message: 'Failed to place order',
							});
						})
						.finally(() => {
							toggleLoader(false);
						});
				}
			);

			modal.render({ content: contactsForm.element });
		}
	);

	modal.render({ content: orderForm.element });
	modal.open();
});

catalog.on('card:select', (product: IProduct) => {
	const details = new ProductDetails(createElement('div'));
	details.render(product);

	details.on('product:add', (product: IProduct) => {
		const cartItem: ICartItem = {
			...product,
			cartPosition: cartItems.length + 1,
		};

		cartItems.push(cartItem);
		cart.render(cartItems);
		modal.close();

		updateCartCounter();
	});

	modal.render({ content: details.element });
	modal.open();
});

const cartButton = document.querySelector('.header__basket');
cartButton?.addEventListener('click', () => {
	modal.render({ content: cart.element });
	modal.open();
});

cart.on('cart:remove', (item: ICartItem) => {
	const index = cartItems.findIndex((cartItem) => cartItem.id === item.id);
	if (index !== -1) {
		cartItems.splice(index, 1);
		cart.render(cartItems);

		updateCartCounter();
	}
});

catalog.on('card:select', (product: IProduct) => {
	console.log('Selected product:', product);
});

let orderData: Partial<IOrderForm> = {};

const contactsForm = new ContactsForm(createElement('div'));

contactsForm.on('contacts:submit', (contactsData: Partial<IOrderForm>) => {
	orderData = { ...orderData, ...contactsData };

	const orderItems = cartItems.map((item) => item.id);
	api
		.orderProducts({
			...(orderData as IOrderForm),
			items: orderItems,
		})
		.then(() => {
			cartItems.length = 0;
			cart.render(cartItems);

			const success = ensureElement<HTMLTemplateElement>('#success');
			const successContent = success.content.cloneNode(true) as HTMLElement;
			modal.render({ content: successContent });
		})
		.catch((error) => {
			console.error('Order failed:', error);
		});
});
