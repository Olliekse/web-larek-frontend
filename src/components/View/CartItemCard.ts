import { Card } from './Card';
import { IEvents } from '../base/events';
import { IProduct } from '../../types';
import { createElement } from '../../utils/utils';

export interface ICartItemCard {
	title: string;
	price: number | null;
	index: number;
}

export class CartItemCard extends Card {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _container: HTMLElement;
	protected _deleteButton: HTMLButtonElement;
	protected _index: HTMLElement;
	protected data: IProduct = null;

	constructor(
		container: HTMLElement,
		protected events: IEvents,
		protected actions?: { onClick: (event: MouseEvent) => void }
	) {
		const template = document.querySelector(
			'#card-basket'
		) as HTMLTemplateElement;
		super(template, events);

		this._container = createElement('div', {
			className: 'basket__item card card_compact',
		});

		this._index = createElement('div', {
			className: 'basket__item-index',
		});

		this._title = createElement('h3', {
			className: 'card__title',
		});

		this._price = createElement('span', {
			className: 'card__price',
		});

		this._deleteButton = createElement('button', {
			className: 'basket__item-delete',
		}) as HTMLButtonElement;

		this._container.appendChild(this._index);
		this._container.appendChild(this._title);
		this._container.appendChild(this._price);
		this._container.appendChild(this._deleteButton);

		container.appendChild(this._container);

		this._deleteButton.addEventListener('click', (e: Event) => {
			e.preventDefault();
			this.events.emit('card:delete', this.data);
		});

		if (actions?.onClick) {
			this._container.addEventListener('click', actions.onClick);
		}
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number | null) {
		this._price.textContent = value ? `${value} синапсов` : '';
	}

	set index(value: number) {
		this._index.textContent = value.toString();
	}

	set product(value: IProduct) {
		this.data = value;
	}

	render(data: IProduct): HTMLElement {
		this.product = data;
		this.title = data.title;
		this.price = data.price;
		return this._container;
	}

	setIndex(index: number): void {
		this.index = index;
	}
}
