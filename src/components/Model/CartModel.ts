import { IProduct } from "../../types/index";

export interface ICartModel {
  cartProducts: IProduct[];
  getCounter: () => number;
  getSumAllProducts: () => number;
  setSelectedСard(data: IProduct): void;
  deleteCardToCart(item: IProduct): void;
  clearCartProducts(): void;
}

export class CartModel implements ICartModel {
  protected _cartProducts: IProduct[]; // список карточек товара в корзине

  constructor() {
    // Load cart data from localStorage on initialization
    const savedCart = localStorage.getItem('cartProducts');
    this._cartProducts = savedCart ? JSON.parse(savedCart) : [];
  }

  set cartProducts(data: IProduct[]) {
    this._cartProducts = data;
    // Save to localStorage whenever cart is updated
    localStorage.setItem('cartProducts', JSON.stringify(this._cartProducts));
  }

  get cartProducts() {
    return this._cartProducts;
  }

  // количество товара в корзине
  getCounter() {
    return this.cartProducts.length;
  }

  // сумма всех товаров в корзине
  getSumAllProducts() {
    let sumAll = 0;
    this.cartProducts.forEach(item => {
      sumAll = sumAll + item.price;
    });
    return sumAll;
  }

  // добавить карточку товара в корзину
  setSelectedСard(data: IProduct) {
    this._cartProducts.push(data);
    // Save after adding item
    localStorage.setItem('cartProducts', JSON.stringify(this._cartProducts));
  }

  // удалить карточку товара из корзины
  deleteCardToCart(item: IProduct) {
    const index = this._cartProducts.indexOf(item);
    if (index >= 0) {
      this._cartProducts.splice(index, 1);
      // Save after removing item
      localStorage.setItem('cartProducts', JSON.stringify(this._cartProducts));
    }
  }

  clearCartProducts() {
    this.cartProducts = [];
    // Clear localStorage when cart is cleared
    localStorage.removeItem('cartProducts');
  }
}