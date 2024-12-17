# Web Larek Frontend

![UML](https://github.com/user-attachments/assets/93519c45-6d90-457e-9ef9-7ab77b39bebd)


## Table of Contents

1. [Project Description](#project-description)
2. [Architecture Overview](#architecture-overview)
3. [Data Description](#data-description)
   - [Data Interfaces](#data-interfaces)
   - [Data Models](#data-models)
     - [CartModel](#cartmodel)
     - [ApiModel](#apimodel)
4. [View Components](#view-components)
   - [Base Components](#base-components)
     - [EventEmitter](#eventemitter)
     - [View](#view)
     - [Modal](#modal)
   - [UI Components](#ui-components)
     - [ProductCard](#productcard)
     - [ProductDetails](#productdetails)
     - [Catalog](#catalog)
     - [Cart](#cart)
     - [ContactsForm](#contactsform)
     - [OrderForm](#orderform)
5. [Event System](#event-system)
   - [Events by Component](#events-by-component)
     - [Modal Events](#modal-events)
     - [ProductCard Events](#productcard-events)
     - [Cart Events](#cart-events)
     - [ContactsForm Events](#contactsform-events)
     - [OrderForm Events](#orderform-events)
   - [Event Flow Examples](#event-flow-examples)
6. [Project Structure](#project-structure)
7. [Installation](#installation)
8. [Development Guidelines](#development-guidelines)

## Project Description

A merchandise store for developers where users can spend "synapses" (virtual currency) on developer-themed items. Built using TypeScript and MVP architecture, featuring a responsive gallery, shopping cart functionality, and form validation.

Live version: https://olliekse.github.io/web-larek-frontend/

## Architecture Overview

This project implements the Model-View-Presenter (MVP) pattern with an event-driven approach. The application is divided into three main layers:

1. **Model Layer**: Handles data management and business logic
2. **View Layer**: Manages UI components and user interactions
3. **Presenter Layer**: Coordinates between Model and View (implemented in index.ts)

## Data Description

### Data Interfaces

```typescript
// Product interface
interface IProduct {
	id: string;
	title: string;
	price: number;
	image: string;
	category: string;
	description: string;
}
// Cart item interface
interface ICartItem {
	id: string;
	title: string;
	price: number;
}
// Order form interface
interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	items: string[];
}
```

### Data Models

#### CartModel

Manages shopping cart state and operations:

```typescript
class Cart extends View<ICartItem[]> {
	// Core cart functionality
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	// Cart state management
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
```

#### ApiModel

Handles all server communication:

```typescript
class Api {
	readonly baseUrl: string;
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string) {
		this.baseUrl = baseUrl;
		this.cdn = cdn;
	}

	// Fetches product list
	getProductList() {
		return this.get('/product').then((data: ApiListResponse<IProduct>) => {
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		});
	}

	// Handles order submission
	orderProducts(order: IOrder) {
		return this.post('/order', order).then((response) => {
			return response as { id: string };
		});
	}
}
```

The models communicate with other parts of the application through the event system, emitting events when data changes and responding to events that require data updates.

## View Components

### Base Components

#### EventEmitter

**Purpose**: Base class providing event handling functionality
**Methods**:

- `on(event: string, callback: Function): void` - Subscribe to event
- `emit(event: string, data?: any): void` - Trigger event
- `off(event: string, callback: Function): void` - Unsubscribe from event
- `offAll(): void` - Remove all event subscriptions
- `trigger(event: string, context?: object): Function` - Create event trigger function

#### View<T>

**Purpose**: Base class for all view components
**Constructor**:

- `container: HTMLElement` - Root element for component

**Fields**:

- `protected container: HTMLElement` - Component's root element
- `protected state: T` - Component's data state

**Methods**:

- `render(data: T): void` - Updates component display
- `setState(state: Partial<T>): void` - Updates component state
- `getState(): T` - Returns current state
- `show(): void` - Shows component
- `hide(): void` - Hides component

#### Modal

**Purpose**: Handles modal window functionality with content and title management

**Constructor**:

- `container: HTMLElement` - Modal root element

**Interface**:

```typescript
interface IModalContent {
	content: HTMLElement;
	title?: string;
}
```

**Fields**:

- `private _closeButton: HTMLButtonElement` - Close button element
- `private _content: HTMLElement` - Content container element
- `private _title: HTMLElement` - Title element
- `private _modalContainer: HTMLElement` - Container for modal content structure

**Methods**:

- `render(data: IModalContent): void` - Updates modal content and title, handles null price displays
- `open(): void` - Opens modal and emits 'modal:open'
- `close(): void` - Closes modal, cleans up content, and emits 'modal:close'

**Events**:

- `modal:open` - Emitted when modal opens
- `modal:close` - Emitted when modal closes

**Auto-close behavior**:

- Closes when clicking the close button
- Closes when clicking outside the modal content area

**Initialization behavior**:

- Dynamically creates missing modal structure elements if not found in container
- Maintains proper element hierarchy: container > modal\_\_container > (title, content, close button)

### UI Components

#### ProductCard

**Purpose**: Displays product information in catalog
**Constructor**:

- `container: HTMLElement` - Card container element
- Uses template: '#card-catalog'

**Fields**:

- `private _title: HTMLElement` - Title element
- `private _price: HTMLElement` - Price element
- `private _category: HTMLElement` - Category element
- `private _image: HTMLImageElement` - Product image element

**Methods**:

- `render(data: IProduct): void` - Updates card display
- `setCategory(value: string): void` - Updates category with styling
- Getters/Setters for title, price, category, image

**Events**:

- `card:select` - Emitted when card is clicked
  - Data: `IProduct` (product data)

#### ProductDetails

**Purpose**: Displays detailed product information in modal
**Constructor**:

- `container: HTMLElement` - Details container element

**Fields**:

- `private _title: HTMLElement` - Title element
- `private _image: HTMLImageElement` - Product image
- `private _description: HTMLElement` - Description element
- `private _category: HTMLElement` - Category element
- `private _price: HTMLElement` - Price element
- `private _button: HTMLButtonElement` - Action button

**Methods**:

- `render(data: IProduct): void` - Updates details display
- `setButtonText(text: string): void` - Updates button text
- `getCategory(): string` - Returns category text
- `setCategory(value: string): void` - Updates category with styling

#### Catalog

**Purpose**: Manages product gallery display
**Constructor**:

- `container: HTMLElement` - Gallery container

**Fields**:

- `protected _products: ProductCard[]` - Array of product cards

**Methods**:

- `render(data: IProduct[]): void` - Renders product grid

#### Cart

**Purpose**: Manages cart display
**Constructor**:

- `container: HTMLElement` - Cart container

**Fields**:

- `private _list: HTMLElement` - Cart items container
- `private _total: HTMLElement` - Total price element
- `private _button: HTMLButtonElement` - Checkout button

**Methods**:

- `render(items: ICartItem[]): void` - Updates cart display
- `updateTotal(total: number): void` - Updates total display
- `clearCart(): void` - Empties cart display
- `get items(): ICartItem[]` - Returns cart items
- `get total(): number` - Returns cart total
- `get isEmpty(): boolean` - Checks if cart is empty

#### ContactsForm

**Purpose**: Handles contact information form
**Constructor**:

- `container: HTMLElement` - Form container

**Fields**:

- `private _emailInput: HTMLInputElement` - Email input
- `private _phoneInput: HTMLInputElement` - Phone input
- `private _submitButton: HTMLButtonElement` - Submit button

**Methods**:

- `render(data: IOrderForm): void` - Updates form display
- `validateForm(): void` - Validates form inputs
- `validateEmail(email: string): boolean` - Validates email format
- `validatePhone(phone: string): boolean` - Validates phone format
- `get email(): string` - Returns email value
- `get phone(): string` - Returns phone value
- `get isValid(): boolean` - Returns form validity state

#### OrderForm

**Purpose**: Handles order form display and validation
**Constructor**:

- `container: HTMLElement` - Form container

**Fields**:

- `private _cardButton: HTMLButtonElement` - Card payment button
- `private _cashButton: HTMLButtonElement` - Cash payment button
- `private _addressInput: HTMLInputElement` - Address input
- `private _submitButton: HTMLButtonElement` - Submit button
- `private _paymentMethod: string | null` - Selected payment method

**Methods**:

- `render(data: IOrderForm): void` - Updates form display
- `validateForm(): void` - Validates form inputs
- `get address(): string` - Returns address value
- `set address(value: string)` - Sets address value
- `get payment(): string | null` - Returns payment method
- `set payment(value: string)` - Sets payment method
- `get isValid(): boolean` - Returns form validity state

### API Class

**Purpose**: Handles server communication
**Constructor**:

- `baseUrl: string` - API base URL
- `cdn: string` - CDN base URL
- `options: RequestInit` - Fetch options

**Methods**:

- `protected handleResponse(response: Response): Promise<object>` - Processes API responses
- `get(uri: string): Promise<object>` - Performs GET request
- `post(uri: string, data: object): Promise<object>` - Performs POST request
- `getProducts(): Promise<IProduct[]>` - Fetches product list
- `orderProducts(order: IOrder): Promise<{id: string}>` - Submits order

## Event System

### Events by Component

#### Modal Events

- `modal:open` - Emitted when modal opens
  - Data: `void`
- `modal:close` - Emitted when modal closes
  - Data: `void`

#### Card Events

- `card:click` - Emitted when product card is clicked
  - Data: `IProduct` (full product state)

#### Cart Events

- `cart:changed` - Emitted when cart contents change
  - Data: `ICartItem[]`
- `cart:cleared` - Emitted when cart is emptied
  - Data: `void`

#### ContactsForm Events

- `form:validate` - Emitted during form validation
  - Data: `{ field: string, value: string, valid: boolean }`

#### OrderForm Events

- `payment:select` - Emitted when payment method selected
  - Data: `{ method: string }`
- `address:validate` - Emitted when address is validated
  - Data: `{ value: string, valid: boolean }`

### Event Flow Examples

1. **Product Card Interaction**:

```typescript
// From card.ts
private handleClick(): void {
    this.emit('card:click', this.state);
}
```

2. **Form Validation**:

```typescript
// From ContactsForm.ts
validateEmail(email: string): boolean {
    const isValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    this.emit('form:validate', { field: 'email', value: email, valid: isValid });
    return isValid;
}

validatePhone(phone: string): boolean {
    const isValid = /^(\+7|8)?\s?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(phone);
    this.emit('form:validate', { field: 'phone', value: phone, valid: isValid });
    return isValid;
}
```

3. **Payment Selection**:

```typescript
// From OrderForm.ts
setPaymentMethod(method: string): void {
    this._paymentMethod = method;
    this.emit('payment:select', { method });
    this.validateForm();
}
```

4. **Address Validation**:

```typescript
// From OrderForm.ts
validateAddress(): void {
    const isValid = this._addressInput.value.length > 0;
    this.emit('address:validate', { value: this._addressInput.value, valid: isValid });
}
```

5. **Modal Operations**:

```typescript
// From Modal.ts
open(): void {
    this.container.classList.add('modal_active');
    this.emit('modal:open');
}

close(): void {
    this.container.classList.remove('modal_active');
    this.emit('modal:close');
}
```

## Project Structure

```
web-larek-frontend/
├── src/                      # Source files
│   ├── common.blocks/        # SCSS block components
│   │   ├── basket.scss
│   │   ├── button.scss
│   │   ├── card.scss
│   │   └── ...
│   ├── components/          # TypeScript components
│   │   ├── base/           # Base component classes
│   │   │   ├── api.ts
│   │   │   ├── events.ts
│   │   │   ├── modal.ts
│   │   │   └── view.ts
│   │   ├── card.ts
│   │   ├── cart.ts
│   │   ├── catalog.ts
│   │   ├── contacts.ts
│   │   ├── order.ts
│   │   └── ProductDetails.ts
│   ├── images/             # Project images
│   ├── pages/              # HTML pages
│   │   └── index.html
│   ├── public/            # Static assets
│   ├── scss/             # SCSS styles
│   │   ├── mixins/
│   │   ├── _variables.scss
│   │   └── styles.scss
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── constants.ts
│   │   ├── mask.ts
│   │   └── utils.ts
│   ├── vendor/           # Third-party assets
│   │   ├── garamond/
│   │   ├── glyphter/
│   │   ├── ys-text/
│   │   └── normalize.css
│   └── index.ts         # Application entry point
├── .babelrc            # Babel configuration
├── .env               # Environment variables
├── .eslintrc.js      # ESLint configuration
├── package.json      # Project dependencies
├── tsconfig.json    # TypeScript configuration
└── webpack.config.js # Webpack configuration
```

## Installation

```
bash
npm install
npm run start
```

## Development Guidelines

1. Follow MVP pattern separation of concerns
2. Use event-driven communication between components
3. Implement proper type checking
4. Keep components single-responsibility
5. Use base classes for shared functionality
