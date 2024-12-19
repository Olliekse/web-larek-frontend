import { IProduct } from "../../types/index";
import { IEvents } from "../base/events";

export interface ICartModel {
  cartProducts: IProduct[];
  getCounter: () => number;
  getSumAllProducts: () => number;
  setSelectedСard(data: IProduct): void;
  deleteCardToCart(item: IProduct): void;
  clearCartProducts(): void;
  isProductInCart(productId: string): boolean;
}

export class CartModel implements ICartModel {
  protected _cartProducts: IProduct[];

  constructor(protected events: IEvents) {
    const savedCart = localStorage.getItem('cartProducts');
    this._cartProducts = savedCart ? JSON.parse(savedCart) : [];
    
    this.events.on('cart:state:get', () => {
        this.events.emit('cart:changed', this._cartProducts);
    });

    this.events.on('cart:clear', () => {
        this.clearCartProducts();
    });
  }

  set cartProducts(data: IProduct[]) {
    this._cartProducts = data;
    localStorage.setItem('cartProducts', JSON.stringify(this._cartProducts));
    this.events.emit('cart:changed', this._cartProducts);
  }

  get cartProducts() {
    return this._cartProducts;
  }

  getCounter() {
    return this.cartProducts.length;
  }

  getSumAllProducts() {
    let sumAll = 0;
    this.cartProducts.forEach(item => {
      sumAll = sumAll + item.price;
    });
    return sumAll;
  }

  setSelectedСard(data: IProduct) {
    if (!this.isProductInCart(data.id)) {
      this._cartProducts.push(data);
      this.saveToLocalStorage();
      this.events.emit('cart:changed', this._cartProducts);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cartProducts', JSON.stringify(this._cartProducts));
  }

  deleteCardToCart(item: IProduct) {
    const index = this._cartProducts.indexOf(item);
    if (index >= 0) {
      this._cartProducts.splice(index, 1);
      localStorage.setItem('cartProducts', JSON.stringify(this._cartProducts));
      this.events.emit('cart:changed', this._cartProducts);
    }
  }

  clearCartProducts() {
    this.cartProducts = [];
    localStorage.removeItem('cartProducts');
    this.events.emit('cart:changed', []);
    this.events.emit('cart:update-counter', { count: 0 });
  }

  isProductInCart(productId: string): boolean {
    return this._cartProducts.some(item => item.id === productId);
  }

  getProductCount(): number {
    return this._cartProducts.length;
  }
}