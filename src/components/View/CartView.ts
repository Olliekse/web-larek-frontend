import { IProduct } from '../../types';
import { IEvents } from '../base/events';
import { CartItem } from './CartItem';

export class CartView {
    constructor(protected readonly template: HTMLTemplateElement, protected readonly events: IEvents) {}

    render(items: IProduct[]): HTMLElement {
        const container = document.createElement('div');
        items.forEach((item, index) => {
            const cartItem = new CartItem(this.template, this.events, {
                onClick: () => this.events.emit('card:removeFromCart', item)
            });
            container.appendChild(cartItem.render(item, index + 1));
        });
        return container;
    }
} 