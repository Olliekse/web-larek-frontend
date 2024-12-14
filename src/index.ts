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
const api = new Api(API_URL, CDN_URL);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const catalog = new Catalog(ensureElement<HTMLElement>('.gallery'));

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
		console.error('Failed to load products:', error);
	})
	.finally(() => {
		toggleLoader(false);
	});

cart.on('cart:checkout', () => {
	const orderForm = new OrderForm(createElement('div'));

	orderForm.on(
		'order:submit',
		(formData: { payment: string; address: string }) => {
			const contactsForm = new ContactsForm(createElement('div'));

			contactsForm.on(
				'contacts:submit',
				(contactsData: { email: string; phone: string }) => {
					const total = cartItems.reduce((sum, item) => sum + item.price, 0);

					const fullOrderData: IOrder = {
						payment: formData.payment as 'card' | 'cash',
						email: contactsData.email,
						phone: contactsData.phone,
						address: formData.address,
						total,
						items: cartItems.map((item) => item.id),
					};

					console.log('Sending order:', fullOrderData);

					toggleLoader(true);
					api
						.orderProducts(fullOrderData)
						.then(() => {
							cartItems.length = 0;
							cart.render(cartItems);
							localStorage.removeItem('cart');
							updateCartCounter();

							const successTemplate =
								ensureElement<HTMLTemplateElement>('#success');
							const successContent = successTemplate.content.cloneNode(
								true
							) as HTMLElement;

							const totalElement = successContent.querySelector(
								'.order-success__description'
							);
							if (totalElement) {
								totalElement.textContent = `Списано ${total} синапсов`;
							}

							const closeButton = successContent.querySelector(
								'.order-success__close'
							);
							if (closeButton) {
								closeButton.addEventListener('click', () => {
									modal.close();
								});
							}

							modal.render({ content: successContent });
						})
						.catch((error) => {
							console.error('Order submission failed:', error);
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
		console.log('Adding product to cart:', JSON.stringify(product, null, 2));

		const cartItem: ICartItem = {
			...product,
			cartPosition: cartItems.length + 1,
		};

		console.log('Created cart item:', JSON.stringify(cartItem, null, 2));

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
