import { IProduct } from '../../types';
import { IEvents } from '../base/events';

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	render(data: IProduct): HTMLElement;
}

export class Card implements ICard {
	protected _cardElement: HTMLElement;
	protected _cardCategory: HTMLElement;
	protected _cardTitle: HTMLElement;
	protected _cardImage: HTMLImageElement;
	protected _cardPrice: HTMLElement;
	protected _colors = <Record<string, string>>{
		дополнительное: 'additional',
		'софт-скил': 'soft',
		кнопка: 'button',
		'хард-скил': 'hard',
		другое: 'other',
	};

	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		actions?: IActions
	) {
		this._cardElement = template.content
			.querySelector('.card')
			.cloneNode(true) as HTMLElement;
		this._cardCategory = this._cardElement.querySelector('.card__category');
		this._cardTitle = this._cardElement.querySelector('.card__title');
		this._cardImage = this._cardElement.querySelector('.card__image');
		this._cardPrice = this._cardElement.querySelector('.card__price');

		if (actions?.onClick) {
			this._cardElement.addEventListener('click', actions.onClick);
		}
	}

	protected setText(element: HTMLElement, value: unknown): string {
		if (element) {
			return (element.textContent = String(value));
		}
	}

	set cardCategory(value: string) {
		this.setText(this._cardCategory, value);
		this._cardCategory.className = `card__category card__category_${this._colors[value]}`;
	}

	protected setPrice(value: number | null): string {
		if (value === null) {
			return 'Бесценно';
		}
		return String(value) + ' синапсов';
	}

	render(data: IProduct): HTMLElement {
		this._cardCategory.textContent = data.category;
		this.cardCategory = data.category;
		this._cardTitle.textContent = data.title;
		this._cardImage.src = data.image;
		this._cardImage.alt = this._cardTitle.textContent;
		this._cardPrice.textContent = this.setPrice(data.price);
		return this._cardElement;
	}

	private handlePhoneInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		let value = input.value.replace(/\D/g, ''); // Remove all non-digits
		
		// Limit to 11 digits (including the country code)
		if (value.length > 11) {
			value = value.slice(0, 11);
		}
		
		// Format the phone number
		if (value.length > 0) {
			let formattedNumber = '+7';
			
			if (value.length > 1) {
				formattedNumber += ' ' + value.slice(1, 4);
			}
			if (value.length > 4) {
				formattedNumber += ' ' + value.slice(4, 7);
			}
			if (value.length > 7) {
				formattedNumber += ' ' + value.slice(7, 9);
			}
			if (value.length > 9) {
				formattedNumber += ' ' + value.slice(9);
			}
			
			input.value = formattedNumber;
		} else {
			input.value = '+7';
		}
	}

	private initializeForm(): void {
		// ... other initialization code ...
		
		const phoneInput = this._cardElement.querySelector('.phone-input') as HTMLInputElement;
		phoneInput.value = '+7'; // Set initial value
		
		phoneInput.addEventListener('input', this.handlePhoneInput.bind(this));
		phoneInput.addEventListener('focus', (e) => {
			if ((e.target as HTMLInputElement).value === '') {
				(e.target as HTMLInputElement).value = '+7';
			}
		});
		
		// Prevent deletion of +7 prefix
		phoneInput.addEventListener('keydown', (e) => {
			const input = e.target as HTMLInputElement;
			if (e.key === 'Backspace' && input.value.length <= 2) {
				e.preventDefault();
			}
		});
	}
}
