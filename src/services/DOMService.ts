export interface IDOMService {
	createElement(tag: string, className?: string | string[]): HTMLElement;
	setContent(element: HTMLElement, content: string): void;
	setAttributes(element: HTMLElement, attributes: Record<string, string>): void;
	addClass(element: HTMLElement, className: string | string[]): void;
	removeClass(element: HTMLElement, className: string | string[]): void;
	appendChild(parent: HTMLElement, child: HTMLElement): void;
}

export class DOMService implements IDOMService {
	createElement(tag: string, className?: string | string[]): HTMLElement {
		const element = document.createElement(tag);
		if (className) {
			this.addClass(element, className);
		}
		return element;
	}

	setContent(element: HTMLElement, content: string): void {
		element.textContent = content;
	}

	setAttributes(
		element: HTMLElement,
		attributes: Record<string, string>
	): void {
		Object.entries(attributes).forEach(([key, value]) => {
			element.setAttribute(key, value);
		});
	}

	addClass(element: HTMLElement, className: string | string[]): void {
		if (Array.isArray(className)) {
			element.classList.add(...className);
		} else {
			element.classList.add(className);
		}
	}

	removeClass(element: HTMLElement, className: string | string[]): void {
		if (Array.isArray(className)) {
			element.classList.remove(...className);
		} else {
			element.classList.remove(className);
		}
	}

	appendChild(parent: HTMLElement, child: HTMLElement): void {
		parent.appendChild(child);
	}
}
