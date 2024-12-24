# Web Larek Frontend

## Table of Contents

1. [Project Description](#project-description)
2. [MVP Pattern Implementation](#mvp-pattern-implementation)
   - [Overview](#overview)
   - [Communication Flow](#communication-flow)
   - [Benefits](#benefits)
   - [UML Class Diagram](#uml-class-diagram)
3. [Key Features](#key-features)
4. [Technical Stack](#technical-stack)
5. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Development Setup](#development-setup)
6. [Project Structure](#project-structure)
7. [Class Documentation](#class-documentation)
   - [Base Classes](#base-classes)
   - [Models](#models)
   - [Views](#views)
   - [Presenters](#presenters)
8. [Event System](#event-system)
   - [🛒 Cart Events](#-cart-events)
   - [🔲 Modal Events](#-modal-events)
   - [🏷️ Product Events](#️-product-events)
   - [📝 Form Events](#-form-events)
9. [API Layer](#api-layer)
10. [Development Guidelines](#development-guidelines)
    - [Component Development](#component-development)
    - [Code Style](#code-style)
    - [Testing](#testing)
11. [User Interaction Examples](#user-interaction-examples)
    - [Adding Product to Cart](#1-adding-product-to-cart)
    - [Form Validation During Checkout](#2-form-validation-during-checkout)
    - [Opening Product Details Modal](#3-opening-product-details-modal)

---

## Project Description

A merchandise store for developers where users can spend "synapses" (virtual currency) on developer-themed items. Built using TypeScript and MVP architecture, featuring a responsive gallery, shopping cart functionality, and form validation.

🔗 **Live version**: https://olliekse.github.io/web-larek-frontend/

---

## MVP Pattern Implementation

This project implements the Model-View-Presenter (MVP) architectural pattern to separate concerns and improve maintainability:

### Overview

The application is divided into three main layers:

1. **Model Layer**: Handles business logic and data management

   - Manages application state
   - Handles data validation
   - Emits state change events

2. **View Layer**: Handles UI rendering and user interactions

   - Renders UI components
   - Captures user input
   - Emits user interaction events

3. **Presenter Layer**: Coordinates between Models and Views
   - Handles business logic
   - Updates Models based on View events
   - Updates Views based on Model changes

### Communication Flow

1. **User → View**: User interacts with UI elements
2. **View → Presenter**: View emits events that Presenter handles
3. **Presenter → Model**: Presenter calls Model methods to update data
4. **Model → Presenter**: Model emits events with updated state
5. **Presenter → View**: Presenter updates View with new data

### Benefits

1. **Separation of Concerns**

   - Clear boundaries between layers
   - Each layer has a single responsibility
   - DOM manipulation is centralized in Views
   - Presenters focus purely on business logic
   - Views receive DOM elements through constructors

2. **Testability**

   - Components can be tested in isolation
   - Easy to mock dependencies

3. **Maintainability**

   - Changes in one layer don't affect others
   - Clear responsibility boundaries

4. **Reusability**
   - Components can be reused across features
   - Flexible architecture for future changes

For detailed implementation of each component, see [Class Documentation](#class-documentation).
For event system details, see [Core Concepts - Event System](#event-system).

### UML Class Diagram

The following diagram illustrates the relationships between the main classes in the application:

![UML Class Diagram](./UML.png)

This diagram shows:

- Class hierarchies and inheritance relationships
- Component interactions and dependencies
- Event flow between components
- MVP pattern implementation structure

---

## Key Features

- 🎨 Responsive product gallery with dynamic updates
- 🛒 Real-time cart management with synapse currency
- 📝 Multi-step order form with validation
- 🔄 State management with event-driven updates
- 💳 Multiple payment methods (card/cash)
- 📱 Mobile-friendly design
- 🔌 Type-safe API communication with error handling

---

## Technical Stack

- **TypeScript** - Main programming language
- **SCSS** - Styling with BEM methodology
- **Webpack** - Module bundling and development server
- **Event-Driven Architecture** - Custom event system for component communication
- **MVP Pattern** - Model-View-Presenter architectural pattern

---

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build
```

### Development Setup

```bash
# Clone repository
git clone https://github.com/olliekse/web-larek-frontend.git

# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

---

## Project Structure

```
web-larek-frontend/
├── src/
│   ├── components/        # Application components (views, models, presenters)
│   ├── services/         # Service layer implementations
│   │   ├── api/         # API service implementations
│   │   └── DOMService.ts # DOM manipulation service
│   ├── utils/            # Utility functions and helpers
│   ├── common.blocks/    # Common block components
│   ├── config/           # Configuration files
│   ├── constants/        # Constants and enums
│   ├── images/           # Image assets
│   ├── pages/            # Page templates
│   ├── public/           # Public assets
│   ├── scss/            # SCSS styles
│   ├── types/           # TypeScript type definitions
│   ├── vendor/          # Third-party libraries
│   └── index.ts         # Application entry point
```

## Class Documentation

### Base Classes

1. **BasePresenter**

   - **Purpose**: Serves as the foundation for all presenters in the MVP pattern, providing common event handling and lifecycle management functionality. Acts as a bridge between Models and Views.
   - **Fields**:
     - `protected events: IEvents` - Event system instance
   - **Methods**:
     - `constructor(events: IEvents)` - Initialises presenter with event system
     - `protected init(): void` - Template method for initialisation
     - `protected destroy(): void` - Cleanup and event unsubscription

2. **Card**

   - **Purpose**: Provides a reusable foundation for all product card components, handling common DOM manipulation, template management, and category styling. Ensures consistent card rendering across the application.
   - **Fields**:
     - `protected elements: CardElements` - DOM element references
     - `protected template: HTMLTemplateElement` - Card template
     - `protected domService: IDOMService` - DOM manipulation service
   - **Methods**:
     - `protected initializeElements(): void` - Sets up DOM element references
     - `render(data: IProduct): HTMLElement` - Creates card element
     - `protected getCategoryClass(category: string): string` - Maps category to CSS class

3. **EventEmitter**
   - **Purpose**: Implements a robust event system that enables decoupled communication between components. Manages event subscription, unsubscription, and emission throughout the application lifecycle.
   - **Fields**:
     - `private events: Record<string, EventHandler[]>` - Event handler storage
   - **Methods**:
     - `on(event: string, handler: EventHandler): void` - Subscribes to event
     - `off(event: string, handler: EventHandler): void` - Unsubscribes from event
     - `emit(event: string, data?: unknown): void` - Triggers event handlers
     - `trigger(event: string): Function` - Creates event trigger function

### Models

1. **AppState**

   - **Purpose**: Acts as a central state management system for the entire application, maintaining product data, cart state, loading states, and modal visibility. Ensures consistent state updates and notifications across components.
   - **Fields**:
     - `private state` - Contains:
       - `cart: { items: IProduct[] }` - Cart items with localStorage persistence
       - `modal: IModal` - Modal window state
       - `products: IProduct[]` - Product list storage
       - `loading: LoadingState` - Loading states for different operations
       - `error: string | null` - Global error state
   - **Methods**:
     - `setProducts(products: IProduct[]): void` - Updates product list
     - `getProducts(): IProduct[]` - Retrieves product list
     - `addToCart(product: IProduct): void` - Adds product to cart with persistence
     - `removeFromCart(productId: string): void` - Removes cart item
     - `getCart(): CartState` - Gets current cart state with computed total
     - `clearCart(): void` - Clears cart and persists to localStorage
     - `isProductInCart(productId: string): boolean` - Checks if product is in cart
     - `setLoading(type: keyof LoadingState, value: boolean): void` - Updates loading state
     - `isLoading(type: keyof LoadingState): boolean` - Checks specific loading state
     - `isAnyLoading(): boolean` - Checks if any operation is loading
     - `setError(message: string | null): void` - Sets error state
     - `private calculateCartTotal(): number` - Computes current cart total

2. **FormModel**

   - **Purpose**: Manages form data validation and state. Handles basic validation to ensure required fields are filled before submission.
   - **Fields**:
     - `protected payment: string` - Payment method
     - `protected email: string` - User email
     - `protected phone: string` - User phone number
     - `protected address: string` - Delivery address
     - `protected formErrors: FormErrors` - Validation error storage
   - **Methods**:
     - `setOrderData(field: string, value: string): void` - Updates form data
     - `validateContacts(): boolean` - Validates that contact fields are not empty
     - `validateOrder(): boolean` - Validates that order fields are not empty
     - `getOrderLot(orderData: IOrderData): IOrder` - Prepares order data for submission
     - `resetForm(): void` - Resets all form fields and errors
     - Protected setters:
       - `protected setEmail(value: string): void` - Validates and sets email
       - `protected setPhone(value: string): void` - Validates and sets phone
       - `protected setAddress(value: string): void` - Validates and sets address

3. **OrderModel**
   - **Purpose**: Manages the complete order lifecycle, from item collection to payment method selection and contact information. Ensures order data integrity and validation before submission.
   - **Fields**:
     - `private orderData: IOrder` - Current order data
     - `private items: string[]` - Order item IDs
     - `private paymentMethod: PaymentMethod` - Selected payment method
   - **Methods**:
     - `setOrderItems(items: IProduct[]): void` - Updates order items
     - `setPaymentMethod(method: PaymentMethod): void` - Sets payment method
     - `setContactInfo(info: ContactInfo): void` - Updates contact details
     - `getOrderData(): IOrder` - Gets complete order data
     - `validateOrder(): boolean` - Validates order completeness

### Views

1. **CardPreview**

   - **Purpose**: Provides an interactive product display component that handles both gallery and modal views, managing product information presentation and user interactions with cart functionality.
   - **Constructor**:
     ```typescript
     constructor(
         template: HTMLTemplateElement,
         protected events: IEvents,
         protected domService: IDOMService,
         protected stateService: StateService,
         protected actions?: IActions
     )
     ```
   - **Fields**:
     - `protected elements: { card: HTMLElement }` - Base card element
     - `protected button: HTMLButtonElement` - Cart action button
     - `private currentProduct: IProduct` - Currently displayed product
   - **Methods**:
     - `protected initializeElements(): void` - Sets up card elements
     - `render(data: IProduct): HTMLElement` - Creates product card
     - `updateButtonState(isInCart: boolean, canBePurchased: boolean): void` - Updates button
     - `renderModal(data: IProduct): HTMLElement` - Creates modal view

2. **Cart**

   - **Purpose**: Delivers a comprehensive shopping cart interface that manages item display, total calculation, and checkout process initiation. Provides real-time updates of cart state.
   - **Fields**:
     - `protected _list: HTMLElement` - Container for cart items
     - `protected _total: HTMLElement` - Display for total price
     - `protected _button: HTMLButtonElement` - Checkout action button
     - `private _counter: HTMLElement` - Cart item counter in header
   - **Methods**:
     - `render(): HTMLElement` - Renders cart container
     - `renderItems(items: IProduct[]): void` - Updates cart items display
     - `renderSumAllProducts(total: number): void` - Updates total price
     - `renderHeaderCartCounter(count: number): void` - Updates cart counter
     - `updateTotal(total: number): void` - Updates total display with computed value
     - `clear(): void` - Clears cart contents

3. **OrderForm**

   - **Purpose**: Facilitates the order completion process with address input, payment method selection, and form validation. Guides users through the checkout flow with appropriate feedback.
   - **Fields**:
     - `private _addressInput: HTMLInputElement` - Delivery address input
     - `private _paymentButtons: HTMLButtonElement[]` - Payment method selection
     - `private _submitButton: HTMLButtonElement` - Order submission button
     - `private _errorDisplay: HTMLElement` - Validation error messages
   - **Methods**:
     - `validateAddress(): boolean` - Checks address validity
     - `setPaymentMethod(method: string): void` - Updates payment selection
     - `private handleSubmit(): void` - Processes form submission
     - `showSuccess(): void` - Displays success message

4. **ModalView**

   - **Purpose**: Implements a flexible modal window system that can display various types of content with consistent styling and behavior.
   - **Interface**: `IModalView`
     - `open(): void` - Opens the modal window
     - `close(): void` - Closes the modal window
     - `setContent(content: HTMLElement): void` - Updates modal content
     - `setTitle(title: string): void` - Updates modal title
   - **Fields**:
     - `protected _content: HTMLElement` - Content container
     - `protected _title: HTMLElement` - Title element
     - `protected closeButton: HTMLButtonElement` - Close button
     - `protected pageWrapper: HTMLElement` - Page wrapper for modal overlay
   - **Methods**:
     - `constructor(container: HTMLElement, events: IEvents)` - Initializes modal with error checking
     - `open(): void` - Opens modal with animation
     - `close(): void` - Closes modal with cleanup
     - `setContent(content: HTMLElement): void` - Updates content safely
     - `setTitle(title: string): void` - Updates title safely
   - **Error Handling**:
     - Validates required elements existence on initialization
     - Throws descriptive errors for missing elements
     - Prevents event bubbling for modal container clicks

5. **ContactsView**
   - **Purpose**: Pure view component for contact form display. Handles only UI rendering and user input capture, delegating all data processing to the model.
   - **Fields**:
     - `private _form: HTMLFormElement` - Form element
     - `private _button: HTMLButtonElement` - Submit button
     - `private _errors: HTMLElement` - Error display
     - `private _inputs: HTMLInputElement[]` - Form inputs
   - **Methods**:
     - `render(): HTMLElement` - Renders the contact form
     - `resetForm(): void` - Resets form state
     - `set valid(value: boolean)` - Updates form validation state
     - `set error(value: string)` - Displays validation errors

### Presenters

1. **ProductPresenter**

   - **Purpose**: Orchestrates product catalog functionality, managing product display, state updates, and user interactions. Coordinates between product data and visual representation.
   - **Fields**:
     - `private gallery: HTMLElement` - Product gallery container
     - `private appState: AppState` - Application state management
     - `private api: ProductApi` - Product API service
   - **Methods**:
     - `async init(): Promise<void>`
       - Initialises product display
       - Fetches products from API
       - Emits: `state:products:changed`
     - `private handleProductSelect(product: IProduct): void`
       - Opens product detail modal
       - Parameters:
         - `product`: Selected product
       - Emits: `modal:open`
     - `private updateProductStates(): void`
       - Updates product button states
       - Synchronises with cart state
       - Updates UI elements

2. **CartPresenter**

   - **Purpose**: Coordinates all shopping cart operations, managing state updates, item removal, and cart display. Ensures synchronization between cart view and underlying data.
   - **Fields**:
     - `private appState: AppState` - Application state management
     - `private view: ICart` - Cart view interface
     - `private modal: ModalView` - Modal window service
   - **Methods**:
     - `init(): void`
       - Sets up cart listeners
       - Initialises cart state
       - Updates cart counter
     - `private handleCartOpen(): void`
       - Opens cart modal
       - Updates cart display with computed total
       - Emits: `modal:open`
     - `private handleItemRemove(productId: string): void`
       - Removes item from cart
       - Updates cart state
       - Emits: `state:cart:changed`

3. **OrderPresenter**

   - **Purpose**: Manages the complete order submission flow, coordinating form validation, data collection, and API communication. Ensures a smooth checkout experience.
   - **Fields**:
     - `private formModel: FormModel` - Order form data
     - `private api: ProductApi` - API service
     - `private appState: AppState` - Application state management
   - **Methods**:
     - `init(): void`
       - Sets up form listeners
       - Initialises validation
       - Prepares order flow
     - `private handleSubmit(formData: IOrderForm): void`
       - Processes order submission
       - Validates form data
       - Calls API to create order
       - Emits: `order:success`
     - `private validateOrder(): boolean`
       - Checks order validity
       - Validates all fields
       - Returns: Validation result
     - `private handlePaymentSelection(method: PaymentMethod): void`
       - Updates payment method
       - Validates form state
       - Updates UI accordingly

4. **ModalPresenter**

   - **Purpose**: Controls modal window lifecycle and content management, coordinating between different views that require modal display. Manages modal state and transitions.
   - **Fields**:
     - `private view: ModalView` - Modal view instance
     - `private currentContent: HTMLElement | null` - Currently displayed content
     - `private isOpen: boolean` - Modal state tracker
   - **Methods**:
     - `init(): void`
       - Sets up modal event listeners
       - Initialises view state
       - Subscribes to events
     - `private handleOpen(content: HTMLElement, title?: string): void`
       - Opens modal with content
       - Parameters:
         - `content`: Content to display
         - `title`: Optional modal title
       - Emits: `modal:opened`
     - `private handleClose(): void`
       - Closes modal window
       - Cleans up content
       - Emits: `modal:closed`

5. **ContactsPresenter**

   - **Purpose**: Coordinates contact information collection and validation, managing form state and user input validation. Ensures valid contact data before order processing.
   - **Fields**:
     - `private formModel: FormModel` - Form data model
     - `private view: ContactsView` - Contact form view
     - `private api: ProductApi` - API service
   - **Methods**:
     - `init(): void`
       - Sets up form validation
       - Initialises event handlers
       - Prepares form state
     - `private handleSubmit(data: ContactInfo): void`
       - Processes form submission
       - Parameters:
         - `data`: Contact form data
       - Validates input
       - Emits: `contacts:valid`
     - `private validateForm(): boolean`
       - Performs form validation
       - Checks all required fields
       - Returns: Overall validity

6. **AppPresenter**
   - **Purpose**: Serves as the main application coordinator, initializing and managing all other presenters. Handles global state, error management, and high-level application flow.
   - **Fields**:
     - `private productPresenter: ProductPresenter` - Product management
     - `private cartPresenter: CartPresenter` - Cart operations
     - `private orderPresenter: OrderPresenter` - Order processing
     - `private modalPresenter: ModalPresenter` - Modal management
     - `private stateService: StateService` - Global state
   - **Methods**:
     - `async init(): Promise<void>`
       - Initialises all presenters
       - Sets up global event handlers
       - Loads initial data
     - `private setupEventHandlers(): void`
       - Configures global event system
       - Sets up inter-presenter communication
       - Handles global state changes
     - `private handleError(error: Error): void`
       - Global error handler
       - Shows error messages
       - Logs errors appropriately
     - `private loadInitialData(): Promise<void>`
       - Fetches initial application data
       - Updates global state
       - Initialises views

## Event System

### 🛒 Cart Events

- `cart:open` - Open cart modal
- `cart:changed` - Cart contents changed
- `cart:removeItem` - Request to remove item from cart
- `cart:state:get` - Request current cart state

### 🔲 Modal Events

- `modal:open` - Open modal with content
- `modal:close` - Close modal
- `modal:update` - Update modal content
- `state:modal:changed` - Modal state has changed

### 🏷️ Product Events

- `card:select` - Product card selected
- `card:addCart` - Request to add product to cart
- `state:products:changed` - Product list updated

### 📝 Form Events

- `contacts:changeInput` - Contact form input changed
- `contacts:submit` - Contact form submitted
- `formErrors:change` - Form validation errors updated
- `order:paymentSelection` - Payment method selected
- `order:changeAddress` - Delivery address changed
- `form:reset` - Reset form state

## API Layer

The API layer is implemented using a base API client class that handles:

- Type-safe request/response handling
- Error management
- Authentication
- Response transformation

Key features of the API layer:

- Centralised error handling with typed errors
- Generic request/response typing
- Clean separation between base functionality and specific implementations
- Consistent error handling across all API calls

## Development Guidelines

1. **DOM Manipulation**

   - **Centralization**:

     - All DOM queries are centralized in the `App` class
     - Elements are passed through constructors to components
     - Direct `querySelector` usage is prohibited in components

   - **DOMService Usage**:
     ```typescript
     class SomeView {
     	constructor(
     		protected container: HTMLElement,
     		protected domService: IDOMService
     	) {
     		// Use domService instead of direct DOM manipulation
     		this.domService.createElement('div', 'class-name');
     		this.domService.setContent(element, content);
     		this.domService.addClass(element, 'new-class');
     	}
     }
     ```

2. **Component Development**

   - Follow MVP pattern strictly
   - Keep DOM manipulation in View layer only
   - Pass DOM elements through constructors
   - Use TypeScript interfaces for better type safety
   - Implement event-driven communication
   - Use protected/private fields for better encapsulation

3. **State Management**

   - Use AppState for global state
   - Implement state changes through events
   - Validate state updates
   - Keep computed properties in getters

4. **Testing**

   - Write unit tests for business logic
   - Test component integration
   - Validate event handling
   - Mock DOM elements and services

5. **Code Style**
   - Use consistent naming conventions
   - Document public methods and interfaces
   - Follow SOLID principles
   - Avoid storing computed values
   - Maintain clean code without debug logs in production
   - Use TypeScript strict mode

## User Interaction Examples

Here are three common user interactions demonstrating the MVP pattern flow:

### 1. Adding Product to Cart

#### View (User Interaction)

```typescript
class CardView extends Card {
	protected initializeElements(): void {
		this.button.addEventListener('click', (e: Event) => {
			e.preventDefault();
			this.events.emit('card:addCart', this.currentProduct);
		});
	}
}
```

#### Presenter (Business Logic)

```typescript
class ProductPresenter extends BasePresenter {
	constructor(private appState: AppState, private view: CardView) {
		super();
		this.events.on('card:addCart', this.handleAddToCart.bind(this));
	}

	private handleAddToCart(product: IProduct): void {
		this.appState.addToCart(product);
		this.updateButtonState(product.id, true);
	}
}
```

#### Model (State Update)

```typescript
class AppState {
	private cart: CartState = { items: [] };

	public addToCart(product: IProduct): void {
		this.cart.items.push(product);
		this.events.emit('state:cart:changed', {
			items: this.cart.items,
			total: this.calculateCartTotal(),
		});
	}
}
```

### 2. Form Validation During Checkout

#### View (User Input)

```typescript
class ContactsView {
	constructor() {
		this._emailInput.addEventListener('input', (e: Event) => {
			const email = (e.target as HTMLInputElement).value;
			this.events.emit('form:input', { field: 'email', value: email });
		});
	}
}
```

#### Presenter (Validation Logic)

```typescript
class OrderPresenter extends BasePresenter {
	constructor(private formModel: FormModel, private view: ContactsView) {
		super();
		this.events.on('form:input', this.handleInput.bind(this));
	}

	private handleInput(data: { field: string; value: string }): void {
		this.formModel.setOrderData(data.field, data.value);
		const isValid = !this.formModel.validateOrder();
		this.view.valid = isValid;
	}
}
```

#### Model (Validation Rules)

```typescript
class FormModel {
	validateOrder(): boolean {
		return !this.email || !this.phone || !this.address;
	}

	setOrderData(field: string, value: string): void {
		this[field] = value;
		this.events.emit('formData:changed', {
			field,
			value,
			isValid: !!value,
		});
	}
}
```

### 3. Opening Product Details Modal

#### View (Gallery Interaction)

```typescript
class CardView extends Card {
	constructor(
		template: HTMLTemplateElement,
		protected events: IEvents,
		protected domService: IDOMService,
		protected container: HTMLElement
	) {
		super();
		this.initializeElements();
	}

	protected initializeElements(): void {
		this.container.addEventListener('click', () => {
			this.events.emit('card:select', this.currentProduct);
		});
	}
}
```

#### Presenter (Modal Coordination)

```typescript
class ProductPresenter extends BasePresenter {
	constructor(
		private appState: AppState,
		private view: CardView,
		private api: ProductApi,
		events: IEvents,
		private gallery: HTMLElement
	) {
		super(events);
	}

	private handleProductSelect(product: IProduct): void {
		const modalContent = this.view.renderModal(product);
		this.events.emit('modal:open', {
			content: modalContent,
			title: product.title,
		});
	}
}
```

#### Model (State Management)

```typescript
class AppState {
	setModalProduct(product: IProduct): void {
		this.currentModalProduct = product;
		this.events.emit('state:modal:product', {
			product,
			isInCart: this.isProductInCart(product.id),
		});
	}
}
```

Each example demonstrates:

- Clear separation of concerns (MVP pattern)
- Event-driven communication
- Unidirectional data flow
- State management
- User feedback

---

## Screenshot

![Project Screenshot](./screenshot.png)

The screenshot shows the main interface of the Web Larek store, featuring:

- Responsive product gallery
- Category-based styling
- Interactive cart functionality
- Clean, modern design
