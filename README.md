# Web-Larek Frontend

[Russian](#russian-version) | [English](#english-version)

![UML scheme](https://github.com/user-attachments/assets/666b481e-5504-4acb-99e9-5cbf813982f2)


---

## Russian Version

### Содержание

- [Описание проекта](#описание-проекта)
- [Архитектура приложения](#архитектура-приложения)
  - [Почему MVP и события?](#почему-mvp-и-события)
  - [Базовые классы](#базовые-классы)
  - [Модели данных и состояние](#модели-данных-и-состояние)
  - [Разделение слоев](#разделение-слоев)
  - [Примеры взаимодействия](#пример-взаимодействия-добавление-товара-в-корзину)
- [Начальная инициализация](#начальная-инициализация)
- [Структура компонентов](#структура-компонентов)
- [Система событий](#система-событий)
- [Установка и разработка](#установка-и-разработка)
- [Технические детали](#технические-детали)

### Описание проекта

Это учебный проект - магазин мерча для разработчиков. Здесь можно тратить "синапсы" (виртуальная валюта) на забавные айтемы для разработчиков. В процессе работы над ним я освоил TypeScript и архитектуру MVP, научился делать отзывчивую галерею, работать с корзиной и валидацией форм.

### Архитектура приложения

#### Почему MVP и события?

В этом проекте используется паттерн MVP (Model-View-Presenter) и событийно-ориентированный подход, потому что:

- Разделение ответственности упрощает отладку
- События помогают избежать сильной связанности кода
- Легче добавлять новые функции

#### Базовые классы

```typescript
// EventEmitter - Базовый брокер событий, реализующий паттерн Observer
class EventEmitter {
	private _events: Map<string, Array<Function>>;

	on(event: string, callback: Function): void;
	emit(event: string, data?: any): void;
	off(event: string, callback: Function): void;
}

// Component<T> - Абстрактный базовый класс для всех UI компонентов
abstract class Component<T> {
	protected _container: HTMLElement;
	protected _template: HTMLTemplateElement;

	constructor(container: HTMLElement) {
		this._container = container;
		this._template = this.getTemplate();
	}

	abstract render(data?: T): void;
}
```

#### Модели данных и состояние

```typescript
// Данные товара
interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number;
	image: string;
}

// Состояние корзины
interface ICartItem extends IProduct {
	quantity: number;
}

type ICart = ICartItem[];

// Данные заказа
interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: 'card' | 'cash';
}
```

#### Разделение слоев

##### Слой Model

- `AppState`: Управление состоянием приложения
  - Каталог продуктов
  - Операции корзины
  - Состояние заказа
- `OrderModel`: Обработка заказов
  - Валидация форм
  - Обработка способа оплаты
  - Отправка заказа

##### Слой View

- `ProductCard`: Компоненты отображения товаров
  - Рендер элементов каталога
  - Обработка взаимодействий
- `CartView`: Интерфейс корзины
  - Отображение содержимого
  - Обновление итогов
- `Modal`: Система модальных окон
  - Отображение любого контента
  - Управление жизненным циклом

##### Слой Presenter (index.ts)

- Связывает Model и View
- Устанавливает слушатели событий
- Обрабатывает бизнес-логику
- Управляет потоком приложения

#### Пример взаимодействия: добавление товара в корзину

Рассмотрим полный цикл добавления товара в корзину:

1. **Слой View (ProductCard)**

```typescript:src/components/ProductCard.ts
class ProductCard extends Component<IProduct> {
    private _button: HTMLButtonElement;

    protected _handleClick() {
        // View генерирует событие
        this.events.emit('cart:add', {
            id: this._data.id
        });
    }
}
```

2. **Слой Presenter (index.ts)**

```typescript:src/index.ts
// Presenter обрабатывает событие
events.on('cart:add', (item: IProduct) => {
    // Вызывает метод модели
    appState.addToCart(item);
});
```

3. **Слой Model (AppState)**

```typescript:src/models/AppState.ts
class AppState {
    private _cart: ICart = [];

    addToCart(item: IProduct): void {
        this._cart.push(item);
        // Model генерирует событие изменения
        this.events.emit('cart:changed', this._cart);
    }
}
```

4. **Слой Presenter (index.ts)**

```typescript:src/index.ts
// Presenter обрабатывает событие модели
events.on('cart:changed', (cart: ICart) => {
    // Получает данные из модели и обновляет представления
    cartView.render(cart);
    headerView.updateCounter(cart.length);
});
```

5. **Слой View (CartView)**

```typescript:src/components/CartView.ts
class CartView extends Component<ICart> {
    render(cart: ICart): void {
        // View обновляет UI новыми данными
        this._container.innerHTML = this.renderCart(cart);
    }
}
```

### Начальная инициализация

1. Инициализация базовых сервисов:
   - Создание EventEmitter для обработки событий
   - Настройка API сервиса для работы с бэкендом
2. Создание экземпляров моделей:
   - Инициализация AppState для управления каталогом и корзиной
   - Создание OrderModel для обработки заказов
3. Создание компонентов представления:
   - Настройка CatalogView для галереи товаров
   - Инициализация CartView для корзины
   - Создание системы модальных окон
4. Настройка слушателей событий в index.ts:
   - Подключение событий модели к обновлениям представления
   - Настройка обработчиков пользовательских действий
5. Запуск приложения:
   - Загрузка начального каталога товаров с сервера
   - Рендер главной страницы с товарами
   - Инициализация пустой корзины

### Структура компонентов

```
Component<T>
├── Modal (управление всеми попапами)
├── ProductCard
│   ├── CatalogCard
│   └── PreviewCard
├── CartView
└── OrderForm
```

Каждый компонент отвечает за конкретную функциональность и общается через события. Modal является универсальным компонентом для отображения любого контента в модальном окне.

### Система событий

#### Основные события

- `cart:add` - добавление в корзину
- `cart:remove` - удаление из корзины
- `cart:changed` - обновление корзины
- `order:submit` - отправка заказа
- `modal:open` - открытие окна
- `modal:close` - закрытие окна

### Установка и разработка

#### Установка зависимостей

```bash
npm install
```

#### Запуск для разработки

```bash
npm run dev
```

#### Сборка проекта

```bash
npm run build
```

### Структура проекта

```
src/
├── common.blocks/   # SCSS блоки компонентов
│   ├── basket.scss
│   ├── button.scss
│   ├── card.scss
│   └── ...
├── components/     # TypeScript компоненты
│   ├── base/       # Базовые классы
│   │   ├── api.ts
│   │   ├── events.ts
│   │   ├── modal.ts
│   │   └── view.ts
│   ├── basket.ts
│   ├── card.ts
│   └── ...
├── images/        # Изображения и иконки
├── pages/         # HTML страницы
├── public/        # Статические файлы
├── scss/          # Стили
│   ├── mixins/    # SCSS миксины
│   ├── _variables.scss
│   └── styles.scss
├── types/         # TypeScript интерфейсы
├── utils/         # Вспомогательные функции
├── vendor/        # Внешние зависимости
│   ├── garamond/  # Шрифты
│   ├── glyphter/
│   └── ys-text/
└── index.ts       # Точка входа
```

### Технические детали

#### Стек технологий

- TypeScript
- HTML5 & CSS3
- Webpack
- ESLint
- Prettier

#### API Интеграция

Проект использует RESTful API для:

- Получения каталога товаров
- Обработки заказов
- Управления корзиной

#### Особенности реализации

- Строгая типизация данных через TypeScript
- Событийно-ориентированная архитектура
- Компонентный подход к UI
- Валидация форм на клиентской стороне
- Отзывчивый дизайн

## [⬆️ К началу](#web-larek-frontend)

---

## English Version

### Table of Contents

- [Project Description](#project-description)
- [Application Architecture](#application-architecture)
  - [Why MVP and Events?](#why-mvp-and-events)
  - [Base Classes](#base-classes)
  - [Data Models and State](#data-models-and-state)
  - [Layer Separation](#layer-separation)
  - [Interaction Examples](#interaction-example-adding-to-cart)
- [Initial Setup](#initial-setup)
- [Component Structure](#component-structure)
- [Event System](#event-system)
- [Installation and Development](#installation-and-development)
- [Technical Details](#technical-details)

### Project Description

This is an educational project - a merchandise store for developers. Users can spend "synapses" (virtual currency) on fun developer-themed items. Through this project, I learned TypeScript and MVP architecture, implemented a responsive gallery, and worked with shopping cart functionality and form validation.

### Application Architecture

#### Why MVP and Events?

This project uses the MVP (Model-View-Presenter) pattern and event-driven approach because:

- Separation of concerns simplifies debugging
- Events help avoid tight code coupling
- Easier to add new features

#### Base Classes

```typescript
// EventEmitter - Base event broker implementing Observer pattern
class EventEmitter {
	private _events: Map<string, Array<Function>>;

	on(event: string, callback: Function): void;
	emit(event: string, data?: any): void;
	off(event: string, callback: Function): void;
}

// Component<T> - Abstract base class for all UI components
abstract class Component<T> {
	protected _container: HTMLElement;
	protected _template: HTMLTemplateElement;

	constructor(container: HTMLElement) {
		this._container = container;
		this._template = this.getTemplate();
	}

	abstract render(data?: T): void;
}
```

#### Data Models and State

```typescript
// Product Data
interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number;
	image: string;
}

// Cart State
interface ICartItem extends IProduct {
	quantity: number;
}

type ICart = ICartItem[];

// Order Data
interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: 'card' | 'cash';
}
```

#### Layer Separation

##### Model Layer

- `AppState`: Application state management
  - Product catalog
  - Cart operations
  - Order state
- `OrderModel`: Order processing
  - Form validation
  - Payment method handling
  - Order submission

##### View Layer

- `ProductCard`: Product display components
  - Catalog item rendering
  - Interaction handling
- `CartView`: Shopping cart interface
  - Content display
  - Total updates
- `Modal`: Modal window system
  - Any content display
  - Lifecycle management

##### Presenter Layer (index.ts)

- Connects Model and View
- Sets up event listeners
- Handles business logic
- Manages application flow

#### Interaction Example: Adding to Cart

Let's look at the complete flow of adding an item to cart:

1. **View Layer (ProductCard)**

```typescript:src/components/ProductCard.ts
class ProductCard extends Component<IProduct> {
    private _button: HTMLButtonElement;

    protected _handleClick() {
        // View generates event
        this.events.emit('cart:add', {
            id: this._data.id
        });
    }
}
```

2. **Presenter Layer (index.ts)**

```typescript:src/index.ts
// Presenter handles event
events.on('cart:add', (item: IProduct) => {
    // Calls model method
    appState.addToCart(item);
});
```

3. **Model Layer (AppState)**

```typescript:src/models/AppState.ts
class AppState {
    private _cart: ICart = [];

    addToCart(item: IProduct): void {
        this._cart.push(item);
        // Model emits change event
        this.events.emit('cart:changed', this._cart);
    }
}
```

4. **Presenter Layer (index.ts)**

```typescript:src/index.ts
// Presenter handles model event
events.on('cart:changed', (cart: ICart) => {
    // Gets data from model and updates views
    cartView.render(cart);
    headerView.updateCounter(cart.length);
});
```

5. **View Layer (CartView)**

```typescript:src/components/CartView.ts
class CartView extends Component<ICart> {
    render(cart: ICart): void {
        // View updates UI with new data
        this._container.innerHTML = this.renderCart(cart);
    }
}
```

### Initial Setup

1. Initialize base services:
   - Create EventEmitter for event handling
   - Configure API service for backend communication
2. Create model instances:
   - Initialize AppState for managing catalog and cart
   - Create OrderModel for order processing
3. Create view components:
   - Configure CatalogView for product gallery
   - Initialize CartView for shopping cart
   - Create modal window system
4. Set up event listeners in index.ts:
   - Connect model events to view updates
   - Configure user action handlers
5. Start application:
   - Load initial product catalog from server
   - Render main page with products
   - Initialize empty cart

### Component Structure

```
Component<T>
├── Modal (manages all popups)
├── ProductCard
│   ├── CatalogCard
│   └── PreviewCard
├── CartView
└── OrderForm
```

Each component is responsible for a specific functionality and communicates through events. Modal is a universal component for displaying any content in a modal window.

### Event System

#### Main Events

- `cart:add` - adding to cart
- `cart:remove` - removing from cart
- `cart:changed` - cart update
- `order:submit` - order submission
- `modal:open` - opening a modal
- `modal:close` - closing a modal

### Installation and Development

#### Installation

```bash
npm install
```

#### Development Run

```bash
npm run dev
```

#### Build Project

```bash
npm run build
```

### Project Structure

```
src/
├── common.blocks/   # SCSS component blocks
│   ├── basket.scss
│   ├── button.scss
│   ├── card.scss
│   └── ...
├── components/     # TypeScript components
│   ├── base/       # Base classes
│   │   ├── api.ts
│   │   ├── events.ts
│   │   ├── modal.ts
│   │   └── view.ts
│   ├── basket.ts
│   ├── card.ts
│   └── ...
├── images/        # Images and icons
├── pages/         # HTML pages
├── public/        # Static files
├── scss/          # Styles
│   ├── mixins/    # SCSS mixins
│   ├── _variables.scss
│   └── styles.scss
├── types/         # TypeScript interfaces
├── utils/         # Helper functions
├── vendor/        # External dependencies
│   ├── garamond/  # Fonts
│   ├── glyphter/
│   └── ys-text/
└── index.ts       # Entry point
```

### Technical Details

#### Technology Stack

- TypeScript
- HTML5 & CSS3
- Webpack
- ESLint
- Prettier

#### API Integration

The project uses RESTful API for:

- Retrieving product catalog
- Processing orders
- Managing the cart

#### Implementation Features

- Strict data typing through TypeScript
- Event-driven architecture
- Component-based UI approach
- Client-side form validation
- Responsive design

[⬆️ Back to top](#web-larek-frontend)
