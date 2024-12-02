# Web-Larek Frontend

[Russian](#russian-version) | [English](#english-version)

![UML schematic](https://github.com/user-attachments/assets/62d6282c-526e-422f-85b5-50ff39202928)

---

## Russian Version

### Содержание

- [Описание проекта](#описание-проекта)
- [Архитектура приложения](#архитектура-приложения)
  - [Почему MVP и события?](#почему-mvp-и-события)
    - [Model-View-Presenter (MVP)](#model-view-presenter-mvp)
    - [Событийно-ориентированный подход](#событийно-ориентированный-подход)
  - [Разделение слоёв](#разделение-слоёв)
    - [Слой модели (Model)](#слой-модели-model)
    - [Слой представления (View)](#слой-представления-view)
    - [Слой презентера (Presenter)](#слой-презентера-presenter)
- [Компоненты приложения](#компоненты-приложения)
  - [Базовые классы](#базовые-классы)
  - [Классы моделей](#классы-моделей)
  - [Компоненты представления](#компоненты-представления)
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

## Архитектура приложения

### Почему MVP и события?

В этом проекте используется паттерн MVP (Model-View-Presenter) и событийно-ориентированный подход. Вот почему:

#### Model-View-Presenter (MVP)

MVP разделяет приложение на три основных слоя:

- **Model (Модель)**:

  - Отвечает за данные и бизнес-логику
  - Управляет состоянием приложения
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

#### Событийно-ориентированный подход

Взаимодействие между компонентами реализовано через события, потому что это обеспечивает:

- Слабую связанность кода
- Независимость компонентов друг от друга
- Простоту добавления новой функциональности
- Централизованное управление состоянием
- Удобное логирование и отладку

### Разделение слоёв

#### Слой модели (Model)

- **AppState**: Управление состоянием приложения

  - Каталог товаров
  - Операции с корзиной
  - Состояние заказа

- **OrderModel**: Обработка заказов
  - Валидация форм
  - Обработка способов оплаты
  - Отправка заказа

#### Слой представления (View)

- **ProductCard**: Компоненты отображения товаров

  - Отрисовка элементов каталога
  - Обработка взаимодействий

- **CartView**: Интерфейс корзины

  - Отображение содержимого
  - Обновление итогов

- **Modal**: Система модальных окон
  - Отображение любого контента
  - Управление жизненным циклом

#### Слой презентера (Presenter)

- **Основные функции**:

  - Связывание Model и View
  - Настройка слушателей событий
  - Обработка бизнес-логики
  - Управление потоком приложения

- **Обработка событий**:
  - События пользовательского интерфейса
  - События изменения данных
  - События состояния приложения

## Компоненты приложения

### Базовые классы

```typescript
/**
 * EventEmitter - Базовый брокер событий
 * Отвечает за:
 * - Управление подписками на события
 * - Доставку событий подписчикам
 * - Поддержку RegExp и wildcards в именах событий
 */
class EventEmitter {
    /** Хранилище обработчиков событий */
    private _events: Map<EventName, Set<Callback>>;
    /** Обработчики всех событий */
    private _allEventHandlers: Set<Callback>;

    /**
     * Подписка на событие
     * @param event - Имя события или RegExp для фильтрации
     * @param callback - Функция-обработчик события
     */
    on<T extends object>(event: EventName, callback: (data: T) => void): void;

    /**
     * Отписка от события
     * @param event - Имя события
     * @param callback - Функция-обработчик для удаления
     */
    off(event: EventName, callback: Function): void;

    /**
     * Инициировать событие
     * @param event - Имя события
     * @param data - Данные события
     */
    emit<T extends object>(event: string, data?: T): void;

    /**
     * Подписка на все события
     * @param callback - Обработчик всех событий
     */
    onAll(callback: (event: EmitterEvent) => void): void;

    /** Сбросить все обработчики */
    offAll(): void;

    /**
     * Создать триггер события
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
 * - Обработку событий компонента
 */
abstract class Component<T> {
    /**
     * @param container - DOM элемент, в который будет вставлен компонент
     */
    protected constructor(protected readonly container: HTMLElement);

    /**
     * Отрисовка компонента
     * @param data - Данные для отрисовки
     */
    abstract render(data?: T): void;

    /** Очистка содержимого компонента */
    protected clear(): void;
}

/**
 * TemplatedComponent<T> - Базовый класс для компонентов с шаблонами
 * Наследуется от Component<T>
 * Отвечает за:
 * - Поддержку HTML-шаблонов
 * - Методы работы с шаблонами
 */
abstract class TemplatedComponent<T> extends Component<T> {
    /** HTML шаблон компонента */
    protected readonly template: HTMLTemplateElement;

    /**
     * @param container - DOM элемент для компонента
     * @param template - HTML шаблон компонента
     */
    protected constructor(container: HTMLElement, template: HTMLTemplateElement);

    /**
     * Клонирование шаблона
     * @returns HTML элемент, созданный из шаблона
     */
    protected clone(): HTMLElement;
}

**
 * Api - Класс для работы с REST API
 * Отвечает за:
 * - HTTP запросы к серверу
 * - Обработку ответов
 * - Обработку ошибок
 * - JSON преобразование
 * - Управление заголовками запросов
 */
class Api {
    /**
     * @param baseUrl - Базовый URL API
     * @param options - Дополнительные настройки fetch
     */
    constructor(
        private readonly baseUrl: string,
        private readonly options: RequestInit = {}
    );

    /**
     * Выполнить GET-запрос
     * @param uri - Путь эндпоинта
     * @returns Promise с типизированными данными ответа
     */
    async get<T>(uri: string): Promise<T>;

    /**
     * Выполнить POST-запрос
     * @param uri - Путь эндпоинта
     * @param data - Данные запроса
     * @returns Promise с типизированными данными ответа
     */
    async post<T>(uri: string, data: object): Promise<T>;

    /**
     * Внутренний метод для выполнения HTTP запросов
     * @param uri - Путь эндпоинта
     * @param method - HTTP метод
     * @param data - Опциональные данные запроса
     * @returns Promise с типизированными данными ответа
     */
    private async request<T>(uri: string, method: string, data?: object): Promise<T>;
}

/**
 * Form - Базовый класс для работы с формами
 * Отвечает за:
 * - Сбор данных формы
 * - Валидацию полей
 * - Отправку данных
 */
class Form<T> extends Component<T> {
    /** Ошибки валидации полей */
    protected _errors: ValidationErrors = {};

    /**
     * @param container - HTML форма
     * @param validator - Экземпляр валидатора
     */
    constructor(
        protected container: HTMLFormElement,
        protected validator: ValidationModel
    );

    /**
     * Установка обработчика отправки формы
     * @param handler - Функция обработки отправки
     */
    protected onSubmit(handler: (data: T) => void): void;

    /**
     * Валидация поля формы
     * @param field - Поле для валидации
     */
    protected validateField(field: HTMLInputElement): void;

    /**
     * Валидация всей формы
     * @returns Признак валидности формы
     */
    protected validateForm(): boolean;
}
```

### Классы моделей

```typescript
/**
 * AppState - Главный менеджер состояния приложения
 * Отвечает за:
 * - Управление каталогом товаров
 * - Состояние корзины
 * - Состояние заказа
 * - Генерацию событий изменения состояния
 */
class AppState extends EventEmitter {
	/** Каталог товаров */
	private _catalog: IProduct[] = [];
	/** Товары в корзине */
	private _cart: ICart = [];
	/** Состояние загрузки */
	private _loading: boolean = false;
	/** Текущий заказ */
	private _order: IOrderForm | null = null;

	/**
	 * @param api - Экземпляр для работы с API
	 */
	constructor(api: Api);

	/**
	 * Загрузка каталога товаров
	 * @returns Promise с массивом товаров
	 */
	async loadCatalog(): Promise<IProduct[]>;

	/**
	 * Добавление товара в корзину
	 * @param item - Товар для добавления
	 */
	addToCart(item: IProduct): void;

	/**
	 * Удаление товара из корзины
	 * @param id - ID товара для удаления
	 */
	removeFromCart(id: string): void;

	/**
	 * Получение содержимого корзины
	 * @returns Массив товаров в корзине
	 */
	getCart(): ICart;
}

/**
 * OrderModel - Обработка и валидация заказов
 * Отвечает за:
 * - Управление данными заказа
 * - Валидацию форм
 * - Отправку заказа
 * - Обработку оплаты
 */
class OrderModel extends EventEmitter {
	/** Данные заказа */
	private _data: IOrderForm;
	/** Ошибки валидации */
	private _errors: ValidationErrors = {};

	/**
	 * @param api - Экземпляр класса для работы с API
	 */
	constructor(api: Api);

	/**
	 * Валидация формы заказа
	 * @param form - Данные формы для проверки
	 * @returns Объект с ошибками валидации
	 */
	validate(form: IOrderForm): ValidationErrors;

	/**
	 * Отправка заказа
	 * @param form - Данные формы заказа
	 * @returns Promise с ответом сервера
	 */
	async submit(form: IOrderForm): Promise<IOrderResponse>;
}
```

### Компоненты представления

```typescript
/**
 * ProductCard - Базовый компонент карточки товара
 * Отвечает за:
 * - Отображение информации о товаре
 * - Обработку действий с товаром
 */
class ProductCard extends TemplatedComponent<IProduct> {
	/** Кнопка добавления в корзину */
	protected _button: HTMLButtonElement;
	/** Элемент с названием товара */
	protected _title: HTMLElement;
	/** Элемент с ценой */
	protected _price: HTMLElement;
	/** Элемент с изображением */
	protected _image: HTMLImageElement;

	/**
	 * @param container - DOM элемент для карточки
	 * @param template - HTML шаблон карточки
	 */
	constructor(container: HTMLElement, template: HTMLTemplateElement);

	/**
	 * Отрисовка карточки товара
	 * @param data - Данные о товаре
	 */
	render(data: IProduct): void;

	/** Обработчик клика по карточке */
	protected handleClick(): void;
}

/**
 * CartView - Компонент корзины
 * Отвечает за:
 * - Отображение товаров в корзине
 * - Управление количеством товаров
 * - Отображение общей суммы
 */
class CartView extends TemplatedComponent<ICart> {
	/** Список товаров */
	protected _list: HTMLElement;
	/** Элемент с общей суммой */
	protected _total: HTMLElement;
	/** Кнопка оформления заказа */
	protected _button: HTMLButtonElement;

	/**
	 * @param container - DOM элемент для корзины
	 * @param template - HTML шаблон корзины
	 */
	constructor(container: HTMLElement, template: HTMLTemplateElement);

	/**
	 * Отрисовка корзины
	 * @param cart - Массив товаров в корзине
	 */
	render(cart: ICart): void;

	/**
	 * Обновление общей суммы
	 * @param total - Новая сумма
	 */
	protected updateTotal(total: number): void;
}

/**
 * OrderForm - Компонент формы заказа
 * Отвечает за:
 * - Отображение формы заказа
 * - Валидацию полей
 * - Отправку формы
 */
class OrderForm extends Form<IOrderForm> {
	/** Поле email */
	protected _email: HTMLInputElement;
	/** Поле телефона */
	protected _phone: HTMLInputElement;
	/** Поле адреса */
	protected _address: HTMLInputElement;
	/** Радио-кнопки способа оплаты */
	protected _payment: NodeListOf<HTMLInputElement>;

	/**
	 * @param container - HTML форма заказа
	 * @param validator - Экземпляр валидатора
	 */
	constructor(container: HTMLFormElement, validator: ValidationModel);

	/**
	 * Отрисовка формы
	 * @param data - Начальные данные формы
	 */
	render(data?: IOrderForm): void;

	/** Обработчик отправки формы */
	protected handleSubmit(): void;
}

/**
 * Modal - Компонент модального окна
 * Отвечает за:
 * - Отображение модальных окон
 * - Управление состоянием окна
 * - Обработку действий в окне
 */
class Modal extends Component<HTMLElement> {
	/** Кнопка закрытия */
	protected _closeButton: HTMLElement;
	/** Контейнер для контента */
	protected _content: HTMLElement;
	/** Флаг открытого состояния */
	protected _isOpen: boolean = false;

	/**
	 * @param container - DOM элемент для модального окна
	 */
	constructor(container: HTMLElement);

	/**
	 * Отрисовка содержимого
	 * @param content - HTML элемент для отображения
	 */
	render(content: HTMLElement): void;

	/** Открытие модального окна */
	open(): void;

	/** Закрытие модального окна */
	close(): void;

	/** Обработчик закрытия окна */
	protected handleClose(): void;
}

/**
 * HeaderView - Компонент заголовка
 * Отвечает за:
 * - Отображение счетчика корзины
 * - Управление кнопкой корзины
 */
class HeaderView extends Component<number> {
	/** Счетчик товаров */
	protected _counter: HTMLElement;
	/** Кнопка корзины */
	protected _button: HTMLButtonElement;

	/**
	 * @param container - DOM элемент для заголовка
	 */
	constructor(container: HTMLElement);

	/**
	 * Отрисовка счетчика
	 * @param count - Количество товаров в корзине
	 */
	render(count: number): void;
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

Проект использует [класс Api](#базовые-классы) для взаимодействия с REST API. Этот класс предоставляет типизированный интерфейс для выполнения HTTP-запросов к бэкенду.

Пример использования:

```typescript
// Инициализация API с базовым URL
const api = new Api('https://api.example.com');

// Получение каталога товаров
const products = await api.get<IProduct[]>('/products');

// Отправка заказа
const orderResponse = await api.post<IOrderResponse>('/orders', {
	items: cart,
	customer: orderData,
});
```

Класс Api автоматически обрабатывает:

- Типобезопасность через дженерики
- Сериализацию/десериализацию JSON
- HTTP ошибки
- Заголовки запросов
- Конфигурацию базового URL

Пример обработки ошибок:

```typescript
try {
	const response = await api.post<IOrderResponse>('/orders', orderData);
	// Обработка успешного ответа
} catch (error) {
	if (error instanceof ApiError) {
		// Обработка специфических ошибок API
		console.error(`Ошибка API ${error.code}: ${error.message}`);
	} else {
		// Обработка сетевых или других ошибок
		console.error('Запрос не удался:', error);
	}
}
```

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
    - [Model-View-Presenter (MVP)](#model-view-presenter-mvp-1)
    - [Event-Driven Approach](#event-driven-approach)
  - [Layer Separation](#layer-separation)
    - [Model Layer](#model-layer)
    - [View Layer](#view-layer)
    - [Presenter Layer](#presenter-layer)
- [Application Components](#application-components)
  - [Base Classes](#base-classes)
  - [Model Classes](#model-classes)
  - [View Components](#view-components)
- [Event System](#event-system)
  - [User Interface Events](#user-interface-events)
  - [Data Change Events](#data-change-events)
  - [Application State Events](#application-state-events)
- [Component Interaction Examples](#component-interaction-examples)
  - [1. Interaction Example: Adding to Cart](#1-interaction-example-adding-to-cart)
  - [2. Interaction Example: Order Checkout](#2-interaction-example-order-checkout)
- [Component Structure](#component-structure)
- [Installation and Development](#installation-and-development)
  - [Installation](#installation)
  - [Development Launch](#development-launch)
  - [Project Build](#project-build)
- [Project Structure](#project-structure)
- [Technical Details](#technical-details)
  - [Technology Stack](#technology-stack)
  - [API Integration](#api-integration)
  - [Implementation Features](#implementation-features)

### Project Description

This is my learning project - a merchandise store for developers. Here you can spend "synapses" (virtual currency) on fun developer items. While working on it, I mastered TypeScript and MVP architecture, learned how to create a responsive gallery, work with shopping cart functionality and form validation. This project helped me understand how to build scalable web applications and work with modern development tools.

## Application Architecture

### Why MVP and Events?

This project uses the MVP (Model-View-Presenter) pattern and an event-driven approach. Here's why:

#### Model-View-Presenter (MVP)

MVP divides the application into three main layers:

- **Model**:

  - Handles data and business logic
  - Manages application state
  - Performs data validation
  - Interacts with the API
  - Generates events when data changes
  - Independent from other layers

- **View**:

  - Handles data display to users
  - Processes user input
  - Generates events for user actions
  - Updates UI when receiving new data
  - Contains no business logic

- **Presenter**:
  - Connects Model and View
  - Processes events from both layers
  - Coordinates data and interface updates
  - Manages application business logic
  - Located in the main application file (index.ts)

This separation provides:

- Clear separation of responsibilities
- Improved code testability
- Simplified maintenance and scaling

#### Event-Driven Approach

Component interaction is implemented through events because it provides:

- Loose code coupling
- Component independence
- Easy functionality addition
- Centralized state management
- Convenient logging and debugging

### Layer Separation

#### Model Layer

- **AppState**: Application state management

  - Product catalog
  - Cart operations
  - Order state

- **OrderModel**: Order processing
  - Form validation
  - Payment method handling
  - Order submission

#### View Layer

- **ProductCard**: Product display components

  - Catalog item rendering
  - Interaction handling

- **CartView**: Cart interface

  - Content display
  - Total updates

- **Modal**: Modal window system
  - Any content display
  - Lifecycle management

#### Presenter Layer

- **Main Functions**:

  - Model and View connection
  - Event listener setup
  - Business logic handling
  - Application flow management

- **Event Handling**:
  - User interface events
  - Data change events
  - Application state events

## Application Components

### Base Classes

```typescript
/**
 * EventEmitter - Base event broker
 * Responsible for:
 * - Managing event subscriptions
 * - Delivering events to subscribers
 * - Supporting RegExp and wildcards in event names
 */
class EventEmitter {
	/** Event handler storage */
	private _events: Map<EventName, Set<Callback>>;
	/** All events handlers */
	private _allEventHandlers: Set<Callback>;

	/** Subscribe to event
	 * @param event - Event name or RegExp for filtering
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
 * - Handling component events
 */
abstract class Component<T> {
	/**
	 * @param container - DOM element where component will be inserted
	 */
	protected constructor(protected readonly container: HTMLElement);

	/**
	 * Render component
	 * @param data - Data for rendering
	 */
	abstract render(data?: T): void;

	/** Clear component contents */
	protected clear(): void;
}

/**
 * TemplatedComponent<T> - Base class for components with templates
 * Extends Component<T>
 * Responsible for:
 * - HTML template support
 * - Template handling methods
 */
abstract class TemplatedComponent<T> extends Component<T> {
	/** Component's HTML template */
	protected readonly template: HTMLTemplateElement;

	/**
	 * @param container - DOM element for component
	 * @param template - Component's HTML template
	 */
	protected constructor(container: HTMLElement, template: HTMLTemplateElement);

	/**
	 * Clone template
	 * @returns HTML element created from template
	 */
	protected clone(): HTMLElement;
}

/**
 * Api - Class for REST API interaction
 * Responsible for:
 * - HTTP requests to server
 * - Response handling
 * - Error handling
 * - JSON conversion
 * - Request headers management
 */
class Api {
	/**
	 * @param baseUrl - API base URL
	 * @param options - Optional fetch configuration
	 */
	constructor(
		private readonly baseUrl: string,
		private readonly options: RequestInit = {}
	);

	/**
	 * Perform GET request
	 * @param uri - Endpoint path
	 * @returns Promise with typed response data
	 */
	async get<T>(uri: string): Promise<T>;

	/**
	 * Perform POST request
	 * @param uri - Endpoint path
	 * @param data - Request payload
	 * @returns Promise with typed response data
	 */
	async post<T>(uri: string, data: object): Promise<T>;

	/**
	 * Internal method for making HTTP requests
	 * @param uri - Endpoint path
	 * @param method - HTTP method
	 * @param data - Optional request payload
	 * @returns Promise with typed response data
	 */
	private async request<T>(
		uri: string,
		method: string,
		data?: object
	): Promise<T>;
}

/**
 * Form - Base class for form handling
 * Responsible for:
 * - Form data collection
 * - Field validation
 * - Data submission
 */
class Form<T> extends Component<T> {
	/** Field validation errors */
	protected _errors: ValidationErrors = {};

	/**
	 * @param container - HTML form
	 * @param validator - Validator instance
	 */
	constructor(
		protected container: HTMLFormElement,
		protected validator: ValidationModel
	);

	/**
	 * Set form submission handler
	 * @param handler - Submission handling function
	 */
	protected onSubmit(handler: (data: T) => void): void;

	/**
	 * Validate form field
	 * @param field - Field to validate
	 */
	protected validateField(field: HTMLInputElement): void;

	/**
	 * Validate entire form
	 * @returns Form validity status
	 */
	protected validateForm(): boolean;
}
```

### Model Classes

```typescript
/**
 * AppState - Main application state manager
 * Responsible for:
 * - Product catalog management
 * - Shopping cart state
 * - Order state
 * - State change event generation
 */
class AppState extends EventEmitter {
	/** Product catalog */
	private _catalog: IProduct[] = [];
	/** Cart items */
	private _cart: ICart = [];
	/** Loading state */
	private _loading: boolean = false;
	/** Current order */
	private _order: IOrderForm | null = null;

	/**
	 * @param api - API interaction instance
	 */
	constructor(api: Api);

	/**
	 * Load product catalog
	 * @returns Promise with array of products
	 */
	async loadCatalog(): Promise<IProduct[]>;

	/**
	 * Add item to cart
	 * @param item - Product to add
	 */
	addToCart(item: IProduct): void;

	/**
	 * Remove item from cart
	 * @param id - Product ID to remove
	 */
	removeFromCart(id: string): void;

	/**
	 * Get cart contents
	 * @returns Array of cart items
	 */
	getCart(): ICart;
}

/**
 * OrderModel - Order processing and validation
 * Responsible for:
 * - Order data management
 * - Form validation
 * - Order submission
 * - Payment processing
 */
class OrderModel extends EventEmitter {
	/** Order data */
	private _data: IOrderForm;
	/** Validation errors */
	private _errors: ValidationErrors = {};

	/**
	 * @param api - API interaction instance
	 */
	constructor(api: Api);

	/**
	 * Validate order form
	 * @param form - Form data to validate
	 * @returns Validation errors object
	 */
	validate(form: IOrderForm): ValidationErrors;

	/**
	 * Submit order
	 * @param form - Order form data
	 * @returns Promise with server response
	 */
	async submit(form: IOrderForm): Promise<IOrderResponse>;
}
```

### View Components

```typescript
/**
 * ProductCard - Base product card component
 * Responsible for:
 * - Displaying product information
 * - Handling product actions
 */
class ProductCard extends TemplatedComponent<IProduct> {
	/** Add to cart button */
	protected _button: HTMLButtonElement;
	/** Product title element */
	protected _title: HTMLElement;
	/** Price element */
	protected _price: HTMLElement;
	/** Image element */
	protected _image: HTMLImageElement;

	/**
	 * @param container - DOM element for card
	 * @param template - Card HTML template
	 */
	constructor(container: HTMLElement, template: HTMLTemplateElement);

	/**
	 * Render product card
	 * @param data - Product data
	 */
	render(data: IProduct): void;

	/** Card click handler */
	protected handleClick(): void;
}

/**
 * CartView - Shopping cart component
 * Responsible for:
 * - Displaying cart items
 * - Managing item quantities
 * - Showing total amount
 */
class CartView extends TemplatedComponent<ICart> {
	/** Items list */
	protected _list: HTMLElement;
	/** Total amount element */
	protected _total: HTMLElement;
	/** Checkout button */
	protected _button: HTMLButtonElement;

	/**
	 * @param container - DOM element for cart
	 * @param template - Cart HTML template
	 */
	constructor(container: HTMLElement, template: HTMLTemplateElement);

	/**
	 * Render cart
	 * @param cart - Array of cart items
	 */
	render(cart: ICart): void;

	/**
	 * Update total amount
	 * @param total - New total
	 */
	protected updateTotal(total: number): void;
}

/**
 * OrderForm - Order form component
 * Responsible for:
 * - Displaying order form
 * - Field validation
 * - Form submission
 */
class OrderForm extends Form<IOrderForm> {
	/** Email field */
	protected _email: HTMLInputElement;
	/** Phone field */
	protected _phone: HTMLInputElement;
	/** Address field */
	protected _address: HTMLInputElement;
	/** Payment method radio buttons */
	protected _payment: NodeListOf<HTMLInputElement>;

	/**
	 * @param container - Order HTML form
	 * @param validator - Validator instance
	 */
	constructor(container: HTMLFormElement, validator: ValidationModel);

	/**
	 * Render form
	 * @param data - Initial form data
	 */
	render(data?: IOrderForm): void;

	/** Form submission handler */
	protected handleSubmit(): void;
}

/**
 * Modal - Modal window component
 * Responsible for:
 * - Displaying modal windows
 * - Managing window state
 * - Handling window actions
 */
class Modal extends Component<HTMLElement> {
	/** Close button */
	protected _closeButton: HTMLElement;
	/** Content container */
	protected _content: HTMLElement;
	/** Open state flag */
	protected _isOpen: boolean = false;

	/**
	 * @param container - DOM element for modal
	 */
	constructor(container: HTMLElement);

	/**
	 * Render content
	 * @param content - HTML element to display
	 */
	render(content: HTMLElement): void;

	/** Open modal window */
	open(): void;

	/** Close modal window */
	close(): void;

	/** Close handler */
	protected handleClose(): void;
}

/**
 * HeaderView - Header component
 * Responsible for:
 * - Displaying cart counter
 * - Managing cart button
 */
class HeaderView extends Component<number> {
	/** Items counter */
	protected _counter: HTMLElement;
	/** Cart button */
	protected _button: HTMLButtonElement;

	/**
	 * @param container - DOM element for header
	 */
	constructor(container: HTMLElement);

	/**
	 * Render counter
	 * @param count - Number of items in cart
	 */
	render(count: number): void;
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

The project uses the [Api class](#base-classes) for REST API interactions. This class provides a typed interface for making HTTP requests to the backend.

Example usage:

```typescript
// Initialize API with base URL
const api = new Api('https://api.example.com');

// Fetch product catalog
const products = await api.get<IProduct[]>('/products');

// Submit an order
const orderResponse = await api.post<IOrderResponse>('/orders', {
	items: cart,
	customer: orderData,
});
```

The Api class automatically handles:

- Type safety through generics
- JSON serialization/deserialization
- HTTP error responses
- Request headers
- Base URL configuration

Error handling example:

```typescript
try {
	const response = await api.post<IOrderResponse>('/orders', orderData);
	// Handle success
} catch (error) {
	if (error instanceof ApiError) {
		// Handle specific API errors
		console.error(`API Error ${error.code}: ${error.message}`);
	} else {
		// Handle network or other errors
		console.error('Request failed:', error);
	}
}
```

#### Implementation Features

- Strict typing through TypeScript
- Event-driven architecture
- Component-based UI approach
- Client-side form validation
- Responsive design

[⬆️ Back to Top](#web-larek-frontend)
