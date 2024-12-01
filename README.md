# Web-Larek Frontend

[Russian](#russian-version) | [English](#english-version)

![UML schematic](https://github.com/user-attachments/assets/62d6282c-526e-422f-85b5-50ff39202928)

---

## Russian Version

### Содержание

- [Описание проекта](#описание-проекта)
- [Архитектура приложения](#архитектура-приложения)
  - [Почему MVP и события?](#почему-mvp-и-события)
  - [Базовые классы](#базовые-классы)
  - [Разделение слоев](#разделение-слоев)
  - [Компоненты приложения](#компоненты-приложения)
  - [Модели данных и состояние](#модели-данных-и-состояние)
- [Система событий](#система-событий)
  - [События пользовательского интерфейса](#события-пользовательского-интерфейса)
  - [События изменения данных](#события-изменения-данных)
  - [События состояния приложения](#события-состояния-приложения)
- [Примеры взаимодействия компонентов](#примеры-взаимодействия-компонентов)
  - [1. Пример взаимодействия: Добавление в корзину](#1-пример-взаимодействия-добавление-в-корзину)
  - [2. Пример взаимодействия: Оформление заказа](#2-пример-взаимодействия-оформление-заказа)
- [Структура компонентов](#структура-компонентов)
- [Установка и разработка](#установка-и-разработка)
  - [Установка](#установка)
  - [Запуск для разработки](#запуск-для-разработки)
  - [Сборка проекта](#сборка-проекта)
- [Структура проекта](#структура-проекта)
- [Технические детали](#технические-детали)
  - [Стек технологий](#стек-технологий)
  - [API Интеграция](#api-интеграция)
  - [Особенности реализации](#особенности-реализации)

### Описание проекта

Это мой учебный проект - магазин мерча для разработчиков. Здесь можно тратить "синапсы" (виртуальная валюта) на забавные айтемы для разработчиков. В процессе работы над ним я освоил TypeScript и архитектуру MVP, научился делать отзывчивую галерею, работать с корзиной и валидацией форм. Проект помог мне понять, как строить масштабируемые веб-приложения и работать с современными инструментами разработки.

### Архитектура приложения

#### Почему MVP и события?

В этом проекте я использовал паттерн MVP (Model-View-Presenter) и событийно-ориентированный подход. Давайте разберем, почему я выбрал именно эти подходы:

##### Model-View-Presenter (MVP)

MVP разделяет приложение на три основных слоя:

- **Model (Модель)**:

  - Отвечает за данные и бизнес-логику
  - Управляет состоянием приложения (каталог, корзина, заказ)
  - Выполняет валидацию данных
  - Взаимодействует с API
  - Генерирует события при изменении данных
  - Не зависит от других слоев

- **View (Представление)**:

  - Отвечает за отображение данных пользователю
  - Обрабатывает пользовательский ввод
  - Генерирует события при действиях пользователя
  - Обновляет UI при получении новых данных
  - Не содержит бизнес-логики

- **Presenter (Презентер)**:
  - Соединяет Model и View
  - Обрабатывает события от обоих слоев
  - Координирует обновление данных и интерфейса
  - Управляет бизнес-логикой приложения
  - Находится в главном файле приложения (index.ts)

Такое разделение дает:

- Четкое разграничение ответственности
- Улучшенную тестируемость кода
- Упрощенную поддержку и масштабирование

##### Событийно-ориентированный подход

Я реализовал взаимодействие между компонентами через события, потому что это дает:

- Слабую связанность кода
- Независимость компонентов друг от друга
- Простоту добавления новой функциональности
- Централизованное управление состоянием
- Удобное логирование и отладку

#### Базовые классы

```typescript
/**
 * EventEmitter - Базовый брокер событий
 * Отвечает за:
 * - Управление подписками на события
 * - Доставку событий подписчикам
 * - Поддержку RegExp и wildcards в именах событий
 */
interface IEvents {
	/** Подписка на событие
	 * @param event - Имя события или RegExp для фильтрации событий
	 * @param callback - Функция-обработчик события
	 */
	on<T extends object>(event: EventName, callback: (data: T) => void): void;

	/** Отписка от события
	 * @param event - Имя события
	 * @param callback - Функция-обработчик для удаления
	 */
	off(event: EventName, callback: Function): void;

	/** Инициировать событие
	 * @param event - Имя события
	 * @param data - Данные события
	 */
	emit<T extends object>(event: string, data?: T): void;

	/** Подписка на все события
	 * @param callback - Функция-обработчик всех событий
	 */
	onAll(callback: (event: EmitterEvent) => void): void;

	/** Сбросить все обработчики */
	offAll(): void;

	/** Создать триггер события
	 * @param event - Имя события
	 * @param context - Контекст для данных события
	 * @returns Функция-генератор события
	 */
	trigger<T extends object>(event: string, context?: Partial<T>): void;
}

/**
 * Component<T> - Абстрактный базовый класс для всех UI компонентов
 * Отвечает за:
 * - Базовую функциональность UI компонентов
 * - Управление DOM-элементом компонента
 */
abstract class Component<T> {
	/** Корневой DOM-элемент компонента */
	protected container: HTMLElement;

	/**
	 * @param container - DOM-элемент, в котором размещается компонент
	 */
	constructor(container: HTMLElement) {
		this.container = container;
	}

	/**
	 * Отрисовка компонента
	 * @param data - Данные для отрисовки
	 */
	abstract render(data?: T): void;
}

/**
 * TemplatedComponent<T> - Базовый класс для компонентов с шаблонами
 * Наследуется от Component<T>
 * Добавляет:
 * - Поддержку HTML-шаблонов
 * - Методы работы с шаблонами
 */
abstract class TemplatedComponent<T> extends Component<T> {
	/** HTML-шаблон компонента */
	protected template: HTMLTemplateElement;

	constructor(container: HTMLElement) {
		super(container);
		this.template = this.getTemplate();
	}

	/**
	 * Получение шаблона компонента
	 * @returns HTML-шаблон
	 */
	protected abstract getTemplate(): HTMLTemplateElement;
}
```

#### Разделение слоев

##### Слой модели (Model)

- `AppState`: Управление состоянием приложения
  - Каталог товаров
  - Операции с корзиной
  - Состояние заказа
- `OrderModel`: Обработка заказов
  - Валидация форм
  - Обработка способов оплаты
  - Отправка заказа

##### Слой представления (View)

- `ProductCard`: Компоненты отображения товаров
  - Отрисовка элементов каталога
  - Обработка взаимодействий
- `CartView`: Интерфейс корзины
  - Отображение содержимого
  - Обновление итогов
- `Modal`: Система модальных окон
  - Отображение любого контента
  - Управление жизненным циклом

##### Слой презентера (Presenter)

- Связывает Model и View
- Настраивает слушатели событий
- Обрабатывает бизнес-логику
- Управляет потоком приложения

#### Компоненты приложения

##### ProductCard extends TemplatedComponent<IProduct>

```typescript
/**
 * ProductCard - Компонент карточки товара
 * Отвечает за:
 * - Отображение информации о товаре
 * - Обработку действий с товаром (добавление в корзину)
 */
class ProductCard extends TemplatedComponent<IProduct> {
	private buttonElement: HTMLButtonElement;
	private priceElement: HTMLElement;
	private titleElement: HTMLElement;
	private imageElement: HTMLImageElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		// Инициализация элементов
	}

	/**
	 * Отрисовка карточки товара
	 * @param product - Данные о товаре
	 */
	render(product: IProduct): void {
		// Логика отрисовки
	}

	/**
	 * Обработчик клика по кнопке
	 * Генерирует событие cart:add
	 */
	private handleClick(): void {
		this.events.emit('cart:add', { id: this.product.id });
	}
}
```

##### CartView extends TemplatedComponent<ICart>

```typescript
/**
 * CartView - Компонент корзины
 * Отвечает за:
 * - Отображение товаров в корзине
 * - Управление количеством товаров
 * - Отображение общей суммы
 */
class CartView extends TemplatedComponent<ICart> {
	private itemsContainer: HTMLElement;
	private totalElement: HTMLElement;
	private checkoutButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		// Инициализация элементов
	}

	/**
	 * Отрисовка корзины
	 * @param cart - Данные корзины
	 */
	render(cart: ICart): void {
		// Логика отрисовки
	}

	/**
	 * Обновление суммы
	 * @param total - Общая сумма
	 */
	updateTotal(total: number): void {
		// Обновление отображения суммы
	}
}
```

##### OrderForm extends TemplatedComponent<IOrderForm>

```typescript
/**
 * OrderForm - Компонент формы заказа
 * Отвечает за:
 * - Отображение формы заказа
 * - Валидацию введенных данных
 * - Отправку данных заказа
 */
class OrderForm extends TemplatedComponent<IOrderForm> {
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private addressInput: HTMLInputElement;
	private paymentInputs: NodeListOf<HTMLInputElement>;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		// Инициализация элементов формы
	}

	/**
	 * Отрисовка формы
	 * @param data - Начальные данные формы
	 */
	render(data?: IOrderForm): void {
		// Логика отрисовки
	}

	/**
	 * Валидация формы
	 * @returns Результат валидации
	 */
	validate(): IValidationResult {
		// Логика валидации
	}
}
```

##### Modal extends Component<any>

```typescript
/**
 * Modal - Компонент модального окна
 * Отвечает за:
 * - Отображение модальных окон
 * - Управление состоянием окна (открыто/закрыто)
 * - Обработку действий с окном
 */
class Modal extends Component<any> {
	private closeButton: HTMLElement;
	private contentContainer: HTMLElement;
	private isOpen: boolean = false;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		// Инициализация элементов
	}

	/**
	 * Открытие модального окна
	 * @param content - Содержимое окна
	 */
	open(content: HTMLElement): void {
		// Логика открытия
	}

	/**
	 * Закрытие модального окна
	 */
	close(): void {
		// Логика закрытия
	}
}
```

#### Модели данных и состояние

```typescript
/**
 * IProduct - Интерфейс товара
 * Описывает структуру данных товара в каталоге
 */
interface IProduct {
	id: string; // Уникальный идентификатор товара
	title: string; // Название товара
	description: string; // Описание товара
	category: string; // Категория товара
	price: number; // Цена товара
	image: string; // URL изображения товара
}

/**
 * ICartItem - Интерфейс товара в корзине
 * Расширяет IProduct дополнительными полями для корзины
 */
interface ICartItem extends IProduct {
	quantity: number; // Количество товара в корзине
	position: number; // Позиция товара в корзине
}

/**
 * ICart - Интерфейс корзины
 * Описывает структуру данных корзины покупок
 */
interface ICart {
	items: ICartItem[]; // Массив товаров в корзине
	total: number; // Общая сумма заказа
}

/**
 * IOrderForm - Интерфейс формы заказа
 * Описывает структуру данных для оформления заказа
 */
interface IOrderForm {
	email: string; // Email покупателя
	phone: string; // Телефон покупателя
	address: string; // Адрес доставки
	payment: 'card' | 'cash'; // Способ оплаты
}
```

### Система событий

#### События пользовательского интерфейса

- `card:click` - Клик по карточке товара
- `card:select` - Выбор карточки товара для просмотра
- `cart:add` - Добавление товара в корзину
- `cart:remove` - Удаление товара из корзины
- `cart:update` - Обновление количества товара
- `cart:open` - Открытие корзины
- `cart:close` - Закрытие корзины
- `order:open` - Открытие формы заказа
- `order:submit` - Отправка формы заказа
- `modal:open` - Открытие модального окна
- `modal:close` - Закрытие модального окна
- `payment:select` - Выбор способа оплаты

#### События изменения данных

- `cart:changed` - Изменение состояния корзины
- `catalog:loaded` - Загрузка каталога товаров
- `catalog:filtered` - Фильтрация каталога
- `order:validated` - Результат валидации формы заказа
- `order:created` - Создание заказа
- `order:completed` - Успешное оформление заказа
- `payment:confirmed` - Подтверждение оплаты
- `preview:changed` - Изменение товара в превью

#### События состояния приложения

- `app:ready` - Приложение инициализировано
- `app:error` - Ошибка в приложении
- `app:loading` - Загрузка данных
- `modal:before-open` - Подготовка к открытию модального окна
- `modal:after-open` - Модальное окно открыто
- `modal:before-close` - Подготовка к закрытию модального окна
- `modal:after-close` - Модальное окно закрыто

### Примеры взаимодействия компонентов

#### 1. Пример взаимодействия: Добавление в корзину

1. **Слой представления (ProductCard)**

```typescript
class ProductCard extends Component<IProduct> {
	private _button: HTMLButtonElement;

	protected _handleClick() {
		// View генерирует событие
		this.events.emit('cart:add', {
			id: this._data.id,
		});
	}
}
```

2. **Слой презентера (index.ts)**

```typescript
// Presenter обрабатывает событие
events.on('cart:add', (item: IProduct) => {
	// Вызывает метод модели
	appState.addToCart(item);
});
```

3. **Слой модели (AppState)**

```typescript
class AppState {
	private _cart: ICart = [];

	addToCart(item: IProduct): void {
		this._cart.push(item);
		// Model генерирует событие изменения
		this.events.emit('cart:changed', this._cart);
	}
}
```

4. **Слой презентера (index.ts)**

```typescript
// Presenter обрабатывает событие модели
events.on('cart:changed', (cart: ICart) => {
	// Получает данные из модели и обновляет представления
	cartView.render(cart);
	headerView.updateCounter(cart.length);
});
```

5. **Слой представления (CartView)**

```typescript
class CartView extends Component<ICart> {
	render(cart: ICart): void {
		// View обновляет UI новыми данными
		this._container.innerHTML = this.renderCart(cart);
	}
}
```

#### 2. Пример взаимодействия: Оформление заказа

1. **Слой представления (OrderForm)**

```typescript
class OrderForm extends Component<IOrderForm> {
	private _submitButton: HTMLButtonElement;

	protected _handleSubmit(e: Event) {
		e.preventDefault();
		// View валидирует и генерирует событие
		const formData = {
			email: this._emailInput.value,
			phone: this._phoneInput.value,
			address: this._addressInput.value,
			payment: this._paymentInput.value,
		};
		this.events.emit('order:submit', formData);
	}
}
```

2. **Слой презентера (index.ts)**

```typescript
// Presenter обрабатывает событие
events.on('order:submit', async (data: IOrderForm) => {
	// Показывает состояние загрузки
	appState.setLoading(true);
	// Вызывает метод модели
	await appState.submitOrder(data);
});
```

3. **Слой модели (AppState)**

```typescript
class AppState {
	private _currentOrder: IOrderForm | null = null;

	async submitOrder(data: IOrderForm): Promise<void> {
		try {
			// Отправка в API
			const response = await api.post('/order', {
				...data,
				items: this._cart,
			});
			// Очистка корзины и генерация событий
			this._cart = [];
			this.events.emit('order:completed', response);
			this.events.emit('cart:changed', this._cart);
		} catch (error) {
			this.events.emit('order:error', error);
		}
	}
}
```

4. **Слой презентера (index.ts)**

```typescript
// Presenter обрабатывает успех/ошибку
events.on('order:completed', (response) => {
	appState.setLoading(false);
	modalView.show('Заказ успешно оформлен!');
});

events.on('order:error', (error) => {
	appState.setLoading(false);
	modalView.show('Ошибка оформления: ' + error.message);
});
```

5. **Слой представления (Modal)**

```typescript
class Modal extends Component<string> {
	show(message: string): void {
		// View обновляет UI результатом
		this._container.textContent = message;
		this._container.classList.add('modal_active');
	}
}
```

### Структура компонентов

```
Component<T>
├── Modal (управление всеми попапами)
├── ProductCard
│ ├── CatalogCard
│ └── PreviewCard
├── CartView
└── OrderForm
```

Каждый компонент отвечает за определенную функциональность и взаимодействует через события. Modal является универсальным компонентом для отображения любого контента в модальном окне.

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

- TypeScript - Строгая типизация и ООП
- HTML5 & CSS3 - Современные веб-стандарты
- SCSS - Продвинутые стили
- Webpack - Сборка проекта
- ESLint - Проверка кода
- Prettier - Форматирование кода

#### API Интеграция

Проект использует класс Api для взаимодействия с REST API:

```typescript
/**
 * Api - Класс для работы с REST API
 * Отвечает за:
 * - HTTP запросы к серверу
 * - Обработку ответов
 * - Обработку ошибок
 */
class Api {
	constructor(baseUrl: string, options?: RequestInit) {
		// Инициализация
	}

	/**
	 * GET-запрос
	 * @param uri - Путь запроса
	 * @returns Promise с данными
	 */
	async get(uri: string): Promise<object> {
		// Реализация GET
	}

	/**
	 * POST-запрос
	 * @param uri - Путь запроса
	 * @param data - Данные для отправки
	 * @returns Promise с ответом
	 */
	async post(uri: string, data: object): Promise<object> {
		// Реализация POST
	}
}
```

Автоматически обрабатывает:

- JSON преобразование
- Ошибки HTTP
- Заголовки запросов
- Параметры запросов

#### Особенности реализации

- Строгая типизация через TypeScript
- Событийно-ориентированная архитектура
- Компонентный подход к UI
- Клиентская валидация форм
- Отзывчивый дизайн

[⬆️ К началу](#web-larek-frontend)

---

## English Version

### Table of Contents

- [Project Description](#project-description)
- [Application Architecture](#application-architecture)
  - [Why MVP and Events?](#why-mvp-and-events)
  - [Base Classes](#base-classes)
  - [Layer Separation](#layer-separation)
  - [Application Components](#application-components)
  - [Data Models and State](#data-models-and-state)
- [Event System](#event-system)
  - [User Interface Events](#user-interface-events)
  - [Data Change Events](#data-change-events)
  - [Application State Events](#application-state-events)
- [Component Interaction Examples](#component-interaction-examples)
  - [1. Interaction Example: Adding to Cart](#1-interaction-example-adding-to-cart)
  - [2. Interaction Example: Submitting Order](#2-interaction-example-submitting-order)
- [Component Structure](#component-structure)
- [Installation and Development](#installation-and-development)
  - [Installation](#installation)
  - [Development Run](#development-run)
  - [Build Project](#build-project)
- [Project Structure](#project-structure)
- [Technical Details](#technical-details)
  - [Technology Stack](#technology-stack)
  - [API Integration](#api-integration)
  - [Implementation Features](#implementation-features)

### Project Description

This is my learning project - a merchandise store for developers. Here you can spend "synapses" (virtual currency) on fun developer items. While working on it, I mastered TypeScript and MVP architecture, learned how to create a responsive gallery, work with shopping cart functionality and form validation. This project helped me understand how to build scalable web applications and work with modern development tools.

### Application Architecture

#### Why MVP and Events?

In this project, I used the MVP (Model-View-Presenter) pattern and event-driven approach. Let's examine why I chose these approaches:

##### Model-View-Presenter (MVP)

MVP divides the application into three main layers:

- **Model**:

  - Responsible for data and business logic
  - Manages application state (catalog, cart, order)
  - Performs data validation
  - Interacts with API
  - Generates events when data changes
  - Independent of other layers

- **View**:

  - Responsible for displaying data to user
  - Handles user input
  - Generates events for user actions
  - Updates UI when receiving new data
  - Contains no business logic

- **Presenter**:
  - Connects Model and View
  - Handles events from both layers
  - Coordinates data and interface updates
  - Manages application business logic
  - Located in main application file (index.ts)

This separation provides:

- Clear separation of responsibilities
- Improved code testability
- Simplified maintenance and scaling

##### Event-Driven Approach

I implemented component interaction through events because it provides:

- Loose code coupling
- Component independence
- Easy functionality addition
- Centralised state management
- Convenient logging and debugging

#### Base Classes

```typescript
/**
 * EventEmitter - Base event broker
 * Responsible for:
 * - Managing event subscriptions
 * - Delivering events to subscribers
 * - Supporting RegExp and wildcards in event names
 */
interface IEvents {
	/** Subscribe to event
	 * @param event - Event name or RegExp for event filtering
	 * @param callback - Event handler function
	 */
	on<T extends object>(event: EventName, callback: (data: T) => void): void;

	/** Unsubscribe from event
	 * @param event - Event name
	 * @param callback - Handler function to remove
	 */
	off(event: EventName, callback: Function): void;

	/** Emit event
	 * @param event - Event name
	 * @param data - Event data
	 */
	emit<T extends object>(event: string, data?: T): void;

	/** Subscribe to all events
	 * @param callback - Handler for all events
	 */
	onAll(callback: (event: EmitterEvent) => void): void;

	/** Reset all handlers */
	offAll(): void;

	/** Create event trigger
	 * @param event - Event name
	 * @param context - Context for event data
	 * @returns Event generator function
	 */
	trigger<T extends object>(event: string, context?: Partial<T>): void;
}

/**
 * Component<T> - Abstract base class for all UI components
 * Responsible for:
 * - Basic UI component functionality
 * - Managing component's DOM element
 */
abstract class Component<T> {
	/** Root DOM element of component */
	protected container: HTMLElement;

	/**
	 * @param container - DOM element where component is placed
	 */
	constructor(container: HTMLElement) {
		this.container = container;
	}

	/**
	 * Render component
	 * @param data - Data for rendering
	 */
	abstract render(data?: T): void;
}

/**
 * TemplatedComponent<T> - Base class for components with templates
 * Inherits from Component<T>
 * Adds:
 * - HTML template support
 * - Template handling methods
 */
abstract class TemplatedComponent<T> extends Component<T> {
	/** Component's HTML template */
	protected template: HTMLTemplateElement;

	constructor(container: HTMLElement) {
		super(container);
		this.template = this.getTemplate();
	}

	/**
	 * Get component template
	 * @returns HTML template
	 */
	protected abstract getTemplate(): HTMLTemplateElement;
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

#### Application Components

##### ProductCard extends TemplatedComponent<IProduct>

```typescript
/**
 * ProductCard - Product card component
 * Responsible for:
 * - Displaying product information
 * - Handling product actions (adding to cart)
 */
class ProductCard extends TemplatedComponent<IProduct> {
	private buttonElement: HTMLButtonElement;
	private priceElement: HTMLElement;
	private titleElement: HTMLElement;
	private imageElement: HTMLImageElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		// Elements initialization
	}

	/**
	 * Render product card
	 * @param product - Product data
	 */
	render(product: IProduct): void {
		// Rendering logic
	}

	/**
	 * Button click handler
	 * Generates cart:add event
	 */
	private handleClick(): void {
		this.events.emit('cart:add', { id: this.product.id });
	}
}
```

##### CartView extends TemplatedComponent<ICart>

```typescript
/**
 * CartView - Shopping cart component
 * Responsible for:
 * - Displaying cart items
 * - Managing item quantities
 * - Showing total amount
 */
class CartView extends TemplatedComponent<ICart> {
	private itemsContainer: HTMLElement;
	private totalElement: HTMLElement;
	private checkoutButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		// Elements initialization
	}

	/**
	 * Render cart
	 * @param cart - Cart data
	 */
	render(cart: ICart): void {
		// Rendering logic
	}

	/**
	 * Update total amount
	 * @param total - Total sum
	 */
	updateTotal(total: number): void {
		// Total display update
	}
}
```

##### OrderForm extends TemplatedComponent<IOrderForm>

```typescript
/**
 * OrderForm - Order form component
 * Responsible for:
 * - Displaying order form
 * - Input data validation
 * - Order submission
 */
class OrderForm extends TemplatedComponent<IOrderForm> {
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private addressInput: HTMLInputElement;
	private paymentInputs: NodeListOf<HTMLInputElement>;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		// Form elements initialization
	}

	/**
	 * Render form
	 * @param data - Initial form data
	 */
	render(data?: IOrderForm): void {
		// Rendering logic
	}

	/**
	 * Form validation
	 * @returns Validation result
	 */
	validate(): IValidationResult {
		// Validation logic
	}
}
```

##### Modal extends Component<any>

```typescript
/**
 * Modal - Modal window component
 * Responsible for:
 * - Displaying modal windows
 * - Managing window state (open/closed)
 * - Handling window actions
 */
class Modal extends Component<any> {
	private closeButton: HTMLElement;
	private contentContainer: HTMLElement;
	private isOpen: boolean = false;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		// Elements initialization
	}

	/**
	 * Open modal window
	 * @param content - Window content
	 */
	open(content: HTMLElement): void {
		// Opening logic
	}

	/**
	 * Close modal window
	 */
	close(): void {
		// Closing logic
	}
}
```

#### Data Models and State

```typescript
/**
 * IProduct - Product interface
 * Describes product data structure in catalog
 */
interface IProduct {
	id: string; // Unique product identifier
	title: string; // Product name
	description: string; // Product description
	category: string; // Product category
	price: number; // Product price
	image: string; // Product image URL
}

/**
 * ICartItem - Cart item interface
 * Extends IProduct with additional cart fields
 */
interface ICartItem extends IProduct {
	quantity: number; // Item quantity in cart
	position: number; // Item position in cart
}

/**
 * ICart - Shopping cart interface
 * Describes shopping cart data structure
 */
interface ICart {
	items: ICartItem[]; // Array of cart items
	total: number; // Order total amount
}

/**
 * IOrderForm - Order form interface
 * Describes order submission data structure
 */
interface IOrderForm {
	email: string; // Customer email
	phone: string; // Customer phone
	address: string; // Delivery address
	payment: 'card' | 'cash'; // Payment method
}
```

### Event System

#### User Interface Events

- `card:click` - Product card click
- `card:select` - Product card selection for viewing
- `cart:add` - Adding product to cart
- `cart:remove` - Removing product from cart
- `cart:update` - Updating product quantity
- `cart:open` - Opening cart
- `cart:close` - Closing cart
- `order:open` - Opening order form
- `order:submit` - Order form submission
- `modal:open` - Opening modal window
- `modal:close` - Closing modal window
- `payment:select` - Payment method selection

#### Data Change Events

- `cart:changed` - Cart state changes
- `catalog:loaded` - Product catalog loading
- `catalog:filtered` - Catalog filtering
- `order:validated` - Order form validation result
- `order:created` - Order creation
- `order:completed` - Successful order completion
- `payment:confirmed` - Payment confirmation
- `preview:changed` - Product preview changes

#### Application State Events

- `app:ready` - Application initialised
- `app:error` - Application error
- `app:loading` - Data loading
- `modal:before-open` - Preparing to open modal window
- `modal:after-open` - Modal window opened
- `modal:before-close` - Preparing to close modal window
- `modal:after-close` - Modal window closed

### Component Interaction Examples

#### 1. Interaction Example: Adding to Cart

Here's a look at the complete flow of adding an item to cart:

1. **View Layer (ProductCard)**

```typescript
class ProductCard extends Component<IProduct> {
	private _button: HTMLButtonElement;

	protected _handleClick() {
		// View generates event
		this.events.emit('cart:add', {
			id: this._data.id,
		});
	}
}
```

2. **Presenter Layer (index.ts)**

```typescript
// Presenter handles event
events.on('cart:add', (item: IProduct) => {
	// Calls model method
	appState.addToCart(item);
});
```

3. **Model Layer (AppState)**

```typescript
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

```typescript
// Presenter handles model event
events.on('cart:changed', (cart: ICart) => {
	// Gets data from model and updates views
	cartView.render(cart);
	headerView.updateCounter(cart.length);
});
```

5. **View Layer (CartView)**

```typescript
class CartView extends Component<ICart> {
	render(cart: ICart): void {
		// View updates UI with new data
		this._container.innerHTML = this.renderCart(cart);
	}
}
```

#### 2. Interaction Example: Submitting Order

Here's the complete flow of submitting an order:

1. **View Layer (OrderForm)**

```typescript
class OrderForm extends Component<IOrderForm> {
	private _submitButton: HTMLButtonElement;

	protected _handleSubmit(e: Event) {
		e.preventDefault();
		// View validates and generates event
		const formData = {
			email: this._emailInput.value,
			phone: this._phoneInput.value,
			address: this._addressInput.value,
			payment: this._paymentInput.value,
		};
		this.events.emit('order:submit', formData);
	}
}
```

2. **Presenter Layer (index.ts)**

```typescript
// Presenter handles event
events.on('order:submit', async (data: IOrderForm) => {
	// Shows loading state
	appState.setLoading(true);
	// Calls model method
	await appState.submitOrder(data);
});
```

3. **Model Layer (AppState)**

```typescript
class AppState {
	private _currentOrder: IOrderForm | null = null;

	async submitOrder(data: IOrderForm): Promise<void> {
		try {
			// Send to API
			const response = await api.post('/order', {
				...data,
				items: this._cart,
			});
			// Clear cart and emit events
			this._cart = [];
			this.events.emit('order:completed', response);
			this.events.emit('cart:changed', this._cart);
		} catch (error) {
			this.events.emit('order:error', error);
		}
	}
}
```

4. **Presenter Layer (index.ts)**

```typescript
// Presenter handles success/error
events.on('order:completed', (response) => {
	appState.setLoading(false);
	modalView.show('Order successful!');
});

events.on('order:error', (error) => {
	appState.setLoading(false);
	modalView.show('Order failed: ' + error.message);
});
```

5. **View Layer (Modal)**

```typescript
class Modal extends Component<string> {
	show(message: string): void {
		// View updates UI with result
		this._container.textContent = message;
		this._container.classList.add('modal_active');
	}
}
```

### Component Structure

```
Component<T>
├── Modal (manages all popups)
├── ProductCard
│ ├── CatalogCard
│ └── PreviewCard
├── CartView
└── OrderForm
```

Each component is responsible for specific functionality and communicates through events. Modal is a universal component for displaying any content in a modal window.

### Installation and Development

#### Installing Dependencies

```bash
npm install
```

#### Development Run

```bash
npm run dev
```

#### Project Build

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

- TypeScript - Strong typing and OOP
- HTML5 & CSS3 - Modern web standards
- SCSS - Advanced styling
- Webpack - Project bundling
- ESLint - Code checking
- Prettier - Code formatting

#### API Integration

The project uses Api class for REST API interactions:

```typescript
/**
 * Api - Class for working with REST API
 * Responsible for:
 * - HTTP requests to server
 * - Response handling
 * - Error handling
 */
class Api {
	constructor(baseUrl: string, options?: RequestInit) {
		// Initialization
	}

	/**
	 * GET request
	 * @param uri - Request path
	 * @returns Promise with data
	 */
	async get(uri: string): Promise<object> {
		// GET implementation
	}

	/**
	 * POST request
	 * @param uri - Request path
	 * @param data - Data to send
	 * @returns Promise with response
	 */
	async post(uri: string, data: object): Promise<object> {
		// POST implementation
	}
}
```

Automatically handles:

- JSON conversion
- HTTP errors
- Request headers
- Request parameters

#### Implementation Features

- Strict typing through TypeScript
- Event-driven architecture
- Component-based UI approach
- Client-side form validation
- Responsive design

[⬆️ Back to Top](#web-larek-frontend)
