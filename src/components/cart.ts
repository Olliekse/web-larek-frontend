import { View } from './base/view';
import { ensureElement } from '../utils/utils';
import { ICartItem } from '../types';

export class Cart extends View<ICartItem[]> {
	private static template = ensureElement<HTMLTemplateElement>('#basket');
	private _list: HTMLElement;
	private _total: HTMLElement;
	private _button: HTMLButtonElement;

	constructor(container: HTMLElement) {
		super(container);

		const content = (
			this.constructor as typeof Cart
		).template.content.cloneNode(true) as HTMLElement;
		this.container.append(content);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this._button.addEventListener('click', () => {
			this.emit('cart:checkout');
		});
	}

	private calculateTotal(items: ICartItem[]): number {
		return items.reduce((total, item) => total + item.price, 0);
	}

	private saveCart(): void {
		localStorage.setItem('cart', JSON.stringify(this.state));
	}

	private loadCart(): ICartItem[] {
		const saved = localStorage.getItem('cart');
		return saved ? JSON.parse(saved) : [];
	}

	render(items: ICartItem[]): void {
		this.state = items;
		this._list.innerHTML = '';
		this.saveCart();

		items.forEach((item, index) => {
			const itemElement = this.createCardItem(item, index + 1);
			this._list.append(itemElement);
		});

		const total = this.calculateTotal(items);
		this._total.textContent = `${total} синапсов`;
		localStorage.setItem('cart', JSON.stringify(items));
	}

	private createCardItem(item: ICartItem, index: number): HTMLElement {
		const template = ensureElement<HTMLTemplateElement>('#card-basket');
		const element = template.content.cloneNode(true) as HTMLElement;

		ensureElement<HTMLElement>('.basket__item-index', element).textContent =
			String(index);
		ensureElement<HTMLElement>('.card__title', element).textContent =
			item.title;
		ensureElement<HTMLElement>(
			'.card__price',
			element
		).textContent = `${item.price} синапсов`;

		const deleteButton = ensureElement<HTMLButtonElement>(
			'.card__button',
			element
		);
		deleteButton.addEventListener('click', () => {
			this.emit('cart:remove', item);
		});

		return element;
	}

	get items(): ICartItem[] {
		return this.state;
	}

	set items(value: ICartItem[]) {
		this.render(value);
	}

	get total(): number {
		return this.state.reduce((sum, item) => sum + item.price, 0);
	}

	get isEmpty(): boolean {
		return this.state.length === 0;
	}
}
