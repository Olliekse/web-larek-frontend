import { createElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export interface ICart {
  cart: HTMLElement;
  title: HTMLElement;
  cartList: HTMLElement;
  button: HTMLButtonElement;
  cartPrice: HTMLElement;
  headerCartButton: HTMLButtonElement;
  headerCartCounter: HTMLElement;
  renderHeaderCartCounter(value: number): void;
  renderSumAllProducts(sumAll: number): void;
  render(): HTMLElement;
}

export class Cart implements ICart {
  cart: HTMLElement;
  title: HTMLElement;
  cartList: HTMLElement;
  button: HTMLButtonElement;
  cartPrice: HTMLElement;
  headerCartButton: HTMLButtonElement;
  headerCartCounter: HTMLElement;
  
  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.cart = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this.title = this.cart.querySelector('.modal__title');
    this.cartList = this.cart.querySelector('.basket__list');
    this.button = this.cart.querySelector('.basket__button');
    this.cartPrice = this.cart.querySelector('.basket__price');
    this.headerCartButton = document.querySelector('.header__basket');
    this.headerCartCounter = document.querySelector('.header__basket-counter');
    
    this.button.addEventListener('click', () => { this.events.emit('order:open') });
    this.headerCartButton.addEventListener('click', () => { this.events.emit('cart:open') });

    const savedCart = localStorage.getItem('cartProducts');
    if (savedCart) {
      const cartItems = JSON.parse(savedCart);
      this.renderHeaderCartCounter(cartItems.length);
    } else {
      this.renderHeaderCartCounter(0);
    }

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.cartList.replaceChildren(...items);
      this.button.removeAttribute('disabled');
    } else {
      this.button.setAttribute('disabled', 'disabled');
      this.cartList.replaceChildren(createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' }));
    }
  }

  renderHeaderCartCounter(value: number) {
    this.headerCartCounter.textContent = String(value);
  }
  
  renderSumAllProducts(sumAll: number) {
    this.cartPrice.textContent = String(sumAll + ' синапсов');
  }

  render() {
    this.title.textContent = 'Корзина';
    return this.cart;
  }
}