import { BaseCard } from './CardView';
import { IEvents } from '../base/events';
import { IProduct } from '../../types';
import { IDOMService } from '../../services/DOMService';

export interface ICartItemCard {
	title: string;
	price: number | null;
	index: number;
}

interface CartItemElements {
	index: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	deleteButton: HTMLButtonElement;
}

/** Represents a cart item card with product information */
export class CartItemCard extends BaseCard {
	protected _container: HTMLElement;
	private readonly elements: CartItemElements;

	constructor(
		container: HTMLElement,
		events: IEvents,
		domService: IDOMService,
		actions?: { onClick: (event: MouseEvent) => void }
	) {
		super(events, domService, actions);

		const template =
			document.querySelector<HTMLTemplateElement>('#card-basket');
		if (!template) {
			throw new Error('Card basket template not found');
		}

		this._container = template.content
			.querySelector('.basket__item')
			.cloneNode(true) as HTMLElement;
		this.elements = {
			index: this._container.querySelector('.basket__item-index'),
			title: this._container.querySelector('.card__title'),
			price: this._container.querySelector('.card__price'),
			deleteButton: this._container.querySelector('.basket__item-delete'),
		};

		this.domService.appendChild(container, this._container);

		if (actions?.onClick) {
			this._container.addEventListener('click', actions.onClick);
		}

		this.elements.deleteButton.addEventListener('click', (e: Event) => {
			e.preventDefault();
			this.events.emit('card:delete', this._container.dataset.productId);
		});
	}

	private setTitle(value: string): void {
		if (this.elements.title) {
			this.elements.title.textContent = value;
		}
	}

	private setPrice(value: number | null): void {
		if (this.elements.price) {
			this.elements.price.textContent = value ? this.formatPrice(value) : '';
		}
	}

	setIndex(value: number): void {
		if (this.elements.index) {
			this.elements.index.textContent = value.toString();
		}
	}

	render(data: IProduct): HTMLElement {
		this._container.dataset.productId = data.id;
		this.setTitle(data.title);
		this.setPrice(data.price);
		return this._container;
	}
}
