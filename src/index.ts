import './scss/styles.scss';

import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ApiModel } from './components/Model/apiModel';
import { DataModel } from './components/Model/DataModel';
import { Card } from './components/View/Card';
import { CardPreview } from './components/View/CardPreview';
import { IProduct, IOrder } from './types';
import { Modal } from './components/View/Modal';
import { ensureElement } from './utils/utils';
import { CartModel } from './components/Model/CartModel';
import { Cart } from './components/View/Cart';
import { CartItem } from './components/View/CartItem';
import { FormModel } from './components/Model/FormModel';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';
import { Success } from './components/View/Success';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cartItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const apiModel = new ApiModel(CDN_URL, API_URL);
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cart = new Cart(cartTemplate, events);
const cartModel = new CartModel();
window.cartModel = cartModel;  // Now properly typed
const formModel = new FormModel(events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);

/********** Отображения карточек товара на странице **********/
events.on('productCards:receive', () => {
  dataModel.productCards.forEach(item => {
    const card = new Card(cardCatalogTemplate, events, { onClick: () => events.emit('card:select', item) });
    ensureElement<HTMLElement>('.gallery').append(card.render(item));
  });
});

/********** Получить объект данных "IProductItem" карточки по которой кликнули **********/
events.on('card:select', (item: IProduct) => { dataModel.setPreview(item) });

/********** Открываем модальное окно карточки товара **********/
events.on('modalCard:open', (item: IProduct) => {
  const cardPreview = new CardPreview(cardPreviewTemplate, events)
  modal.render({
    content: cardPreview.render(item),
    title: 'Карточка товара'
  });
});

/********** Добавление карточки товара в корзину **********/
events.on('card:addCart', () => {
  cartModel.setSelectedСard(dataModel.selectedСard);
  cart.renderHeaderCartCounter(cartModel.getCounter());
  modal.close();
});

/********** Открытие модального окна корзины **********/
events.on('cart:open', () => {
  cart.renderSumAllProducts(cartModel.getSumAllProducts());
  let i = 0;
  cart.items = cartModel.cartProducts.map((item) => {
    const cartItem = new CartItem(cartItemTemplate, events, {
      onClick: () => events.emit('cart:removeItem', item)
    });
    i = i + 1;
    return cartItem.render(item, i);
  });
  modal.render({
    content: cart.render(),
    title: 'Корзина'
  });
});

/********** Удаление карточки товара из корзины **********/
events.on('cart:removeItem', (item: IProduct) => {
  cartModel.deleteCardToCart(item);
  cart.renderHeaderCartCounter(cartModel.getCounter());
  cart.renderSumAllProducts(cartModel.getSumAllProducts());
  let i = 0;
  cart.items = cartModel.cartProducts.map((item) => {
    const cartItem = new CartItem(cartItemTemplate, events, {
      onClick: () => events.emit('cart:removeItem', item)
    });
    i = i + 1;
    return cartItem.render(item, i);
  });
});

/********** Открытие модального окна "способа оплаты" и "адреса доставки" **********/
events.on('order:open', () => {
  modal.render({
    content: order.render(),
    title: 'Оформление заказа'
  });
  formModel.items = cartModel.cartProducts.map(item => item.id); // передаём список id товаров которые покупаем
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => { formModel.payment = button.name }) // передаём способ оплаты

/********** Отслеживаем изменение в поле в вода "адреса доставки" **********/
events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.field, data.value);
});

/********** Валидация данных строки "address" и payment **********/
events.on('formErrors:address', (errors: Partial<IOrder>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

/********** Открытие модального окна "Email" и "Телефон" **********/
events.on('contacts:open', () => {
  formModel.total = cartModel.getSumAllProducts();
  modal.render({
    content: contacts.render(),
    title: 'Контакты'
  });
});

/********** Отслеживаем изменение в полях вода "Email" и "Телефон" **********/
events.on(`contacts:changeInput`, (data: { field: string, value: string }) => {
  formModel.setOrderData(data.field, data.value);
});

/********** Валидация данных строки "Email" и "Телефон" **********/
events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

/********** Открытие модального окна "Заказ оформлен" **********/
events.on('success:open', () => {
  apiModel.postOrderLot(formModel.getOrderLot())
    .then((data) => {
      const success = new Success(successTemplate, events);
      modal.render({
        content: success.render(cartModel.getSumAllProducts()),
        title: 'Заказ оформлен'
      });
      cartModel.clearCartProducts();
      cart.renderHeaderCartCounter(cartModel.getCounter());
    })
    .catch(error => console.log(error));
});

events.on('success:close', () => modal.close());

/********** Блокируем прокрутку страницы при открытие модального окна **********/
events.on('modal:open', () => {
  modal.locked = true;
});

/********** Разблокируем прокрутку страницы при закрытие модального окна **********/
events.on('modal:close', () => {
  modal.locked = false;
});

/********** Получаем данные с сервера **********/
apiModel.getListProductCard()
  .then(function (data: IProduct[]) {
    dataModel.productCards = data;
  })
  // .then(dataModel.setProductCards.bind(dataModel))
  .catch(error => console.log(error))