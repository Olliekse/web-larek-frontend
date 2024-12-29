# Web Larek Frontend

Веб-приложение на TypeScript для магазина товаров для разработчиков, где пользователи могут просматривать и покупать товары, используя виртуальную валюту под названием "синапс". Этот проект демонстрирует современные практики фронтенд-разработки с использованием TypeScript, архитектуры, основанной на событиях, и компонентного дизайна.

🔗 **Демо**: [Web Larek Frontend](https://olliekse.github.io/web-larek-frontend/)

![Скриншот магазина Web Larek](screenshot.png)
_Скриншот магазина Web Larek, показывающий различные товары для разработчиков с их ценами в синапсах_

## Особенности

- 🎨 Интерактивный каталог продуктов с категориями
- 🛒 Корзина покупок в реальном времени с сохранением в localStorage
- 💳 Многошаговый процесс оформления заказа
- 📱 Адаптивный дизайн
- 🔍 Модальные предварительные просмотры продуктов
- ✨ Чистый и современный интерфейс

## Технологический стек

- **TypeScript** (^5.0.4) - Основной язык программирования
- **Webpack** (^5.81.0) - Модульная сборка и разработка
- **SCSS** (^1.62.1) - Стилизация (с использованием методологии BEM)
- **Архитектура, основанная на событиях** - Для коммуникации между компонентами
- **LocalStorage** - Для сохранения корзины

## Начало работы

### Предварительные требования

- Node.js (v16 или выше)
- npm или yarn

### Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/olliekse/web-larek-frontend.git
cd web-larek-frontend
```

2. Установите зависимости:

```bash
npm install
# или
yarn install
```

3. Запустите сервер разработки:

```bash
npm start
# или
yarn start
```

4. Сборка для продакшена:

```bash
npm run build
# или
yarn build
```

### Доступные скрипты

- `npm start` - Запускает сервер разработки
- `npm run build` - Сборка для продакшена
- `npm run lint` - Запускает ESLint
- `npm run format` - Форматирует код с помощью Prettier
- `npm run deploy` - Развёртывание на GitHub Pages

## Архитектура проекта

Проект следует компонентной архитектуре с коммуникацией между компонентами, основанной на событиях. Вот обзор основных архитектурных элементов:

Архитектура основана на двух ключевых принципах:

- **Изоляция компонентов**: Каждый UI-элемент (карточки, формы, модальные окна) является независимым модулем со своей логикой и зоной ответственности
- **Событийное взаимодействие**: Компоненты обмениваются данными через централизованную систему событий, а не напрямую

Пример типичного взаимодействия:

1. Компонент Card отправляет событие "add-to-basket" при выборе товара
2. Компонент AppData обрабатывает изменение состояния и отправляет событие "basket:changed"
3. Компонент Basket, подписанный на "basket:changed", обновляет свое отображение

Такой подход обеспечивает ряд преимуществ:

- Слабая связанность между компонентами
- Улучшенная поддерживаемость благодаря возможности независимой модификации компонентов
- Четкий поток данных через приложение
- Упрощенное тестирование благодаря четко определенному взаимодействию компонентов

### Диаграмма классов

![Диаграмма классов Web Larek](UML.png)
_Диаграмма классов UML, показывающая отношения и структуру основных компонентов_

Диаграмма показывает:

- **Иерархия компонентов**: Все UI-компоненты наследуются от базового класса Component
- **Управление состоянием**: AppData управляет данными приложения и изменениями состояния
- **Интеграция API**: LarekAPI обрабатывает всю коммуникацию с бэкендом
- **Система событий**: EventEmitter позволяет компонентам общаться между собой
- **UI-компоненты**: Card, Modal, Basket и Form обрабатывают взаимодействие с пользователем

### Система компонентов

#### Базовые компоненты

##### EventEmitter

Основная система обработки событий, которая позволяет компонентам общаться между всеми частями приложения.

```typescript
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
	eventName: string;
	data: unknown;
};

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

export class EventEmitter implements IEvents {
	_events: Map<EventName, Set<Subscriber>>;

	constructor() {
		this._events = new Map<EventName, Set<Subscriber>>();
	}

	// Установка обработчика события
	on<T extends object>(eventName: EventName, callback: (event: T) => void) {
		if (!this._events.has(eventName)) {
			this._events.set(eventName, new Set<Subscriber>());
		}
		this._events.get(eventName)?.add(callback);
	}

	// Удаление обработчика события
	off(eventName: EventName, callback: Subscriber) {
		if (this._events.has(eventName)) {
			this._events.get(eventName)!.delete(callback);
			if (this._events.get(eventName)?.size === 0) {
				this._events.delete(eventName);
			}
		}
	}

	// Вызов события с данными
	emit<T extends object>(eventName: string, data?: T) {
		this._events.forEach((subscribers, name) => {
			if (name === '*')
				subscribers.forEach((callback) =>
					callback({
						eventName,
						data,
					})
				);
			if (
				(name instanceof RegExp && name.test(eventName)) ||
				name === eventName
			) {
				subscribers.forEach((callback) => callback(data));
			}
		});
	}

	// Прослушивание всех событий
	onAll(callback: (event: EmitterEvent) => void) {
		this.on('*', callback);
	}

	// Сброс всех обработчиков
	offAll() {
		this._events = new Map<string, Set<Subscriber>>();
	}

	// Создание триггера, генерирующего событие при вызове
	trigger<T extends object>(eventName: string, context?: Partial<T>) {
		return (event: object = {}) => {
			this.emit(eventName, {
				...(event || {}),
				...(context || {}),
			});
		};
	}
}
```

##### Component

Абстрактный базовый класс для всех UI-компонентов в приложении. Обеспечивает общую функциональность для рендеринга и обработки событий.

```typescript
export abstract class Component<T> {
	/** Корневой DOM-элемент компонента */
	protected container: HTMLElement;
	/** Эмиттер событий для коммуникации компонентов */
	protected events: IEvents;

	/**
	 * Создает новый экземпляр компонента
	 * @param {HTMLElement} container - Корневой элемент для этого компонента
	 * @param {IEvents} [events] - Опциональный эмиттер событий для коммуникации компонентов
	 */
	constructor(container: HTMLElement, events?: IEvents) {
		this.container = container;
		this.events = events;
	}

	/**
	 * Устанавливает текстовое содержимое HTML-элемента
	 */
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	/**
	 * Устанавливает источник и альтернативный текст для элемента изображения
	 */
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	/**
	 * Устанавливает или удаляет атрибут disabled у HTML-элемента
	 */
	protected setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) {
				element.setAttribute('disabled', 'disabled');
			} else {
				element.removeAttribute('disabled');
			}
		}
	}

	/**
	 * Отправляет событие через эмиттер событий компонента
	 */
	protected emit(event: string, payload?: object) {
		if (this.events) {
			this.events.emit(event, payload);
		}
	}

	/**
	 * Рендерит компонент с предоставленными данными
	 * Должен быть реализован каждым классом компонента
	 */
	abstract render(data?: Partial<T>): HTMLElement;
}
```

##### Model

Базовый класс для всех моделей данных в приложении. Реализует управление состоянием с безопасными обновлениями типов.

```typescript
/**
 * Проверка типа для определения, является ли объект экземпляром Model
 */
export const isModel = (obj: unknown): obj is Model<any> => {
	return obj instanceof Model;
};

export abstract class Model<T> {
	/** Эмиттер событий для изменений состояния модели */
	protected events: IEvents;
	/** Внутреннее хранилище состояния */
	private state: T;

	/**
	 * Создает новый экземпляр модели
	 * @param {Partial<T>} data - Начальные данные состояния
	 * @param {IEvents} events - Эмиттер событий для изменений состояния
	 */
	constructor(data: Partial<T>, events: IEvents) {
		this.state = data as T;
		this.events = events;
	}

	/**
	 * Получает текущее состояние модели
	 */
	public getState(): T {
		return this.state;
	}

	/**
	 * Обновляет состояние модели
	 */
	protected updateState(newState: T) {
		this.state = newState;
	}

	/**
	 * Отправляет событие изменения состояния
	 */
	protected emitChanges(event: string) {
		this.events.emit(event);
	}
}
```

#### Основные компоненты

##### AppData

Центральный компонент управления состоянием, который обрабатывает все данные приложения. Управляет каталогом продуктов, корзиной покупок, состоянием предварительного просмотра и обработкой заказов.

```typescript
class AppData extends Model<IAppState> {
	// Обновляет каталог продуктов и уведомляет подписчиков
	setCatalog(items: IProduct[]): void;

	// Добавляет продукт в корзину покупок
	addToBasket(item: IProduct): void;

	// Удаляет продукт из корзины по ID
	removeFromBasket(id: string): void;

	// Очищает все товары из корзины
	clearBasket(): void;

	// Устанавливает продукт для предварительного просмотра
	setPreview(item: IProduct | null): void;

	// Обновляет конкретное поле в форме заказа
	setOrderField(field: keyof IAppState['order'], value: string | number): void;

	// Проверяет текущие данные заказа
	validateOrder(): Partial<Record<keyof IAppState['order'], string>>;
}
```

##### Card

Компонент для отображения информации о продукте в различных контекстах. Обрабатывает разные режимы отображения: просмотр каталога, предварительный просмотр и элемент корзины.

```typescript
class Card extends Component<ICard> {
	// Элемент, отображающий название продукта
	protected _title: HTMLElement;

	// Необязательный элемент изображения продукта
	protected _image?: HTMLImageElement;

	// Элемент, показывающий категорию продукта
	protected _category?: HTMLElement;

	// Элемент, отображающий цену продукта
	protected _price: HTMLElement;

	// Интерактивная кнопка для действий с карточкой
	protected _button?: HTMLButtonElement;

	// Обновляет уникальный идентификатор карточки
	set id(value: string);

	// Устанавливает название продукта
	set title(value: string);

	// Обновляет источник изображения продукта
	set image(value: string);

	// Управляет состоянием выбора карточки
	set selected(value: boolean);

	// Управляет состоянием отключения карточки
	set disabled(value: boolean);

	// Форматирует и отображает цену продукта
	protected setPrice(value: number | null): void;

	// Устанавливает категорию и применяет соответствующее стилизование
	protected setCategory(value: string): void;

	// Рендерит карточку с предоставленными данными о продукте
	render(data: ICard): HTMLElement;
}
```

##### PreviewCard

Расши��енная версия компонента Card для детального просмотра продуктов. Добавляет возможность отображения описания, сохраняя всю базовую функциональность карточки.

```typescript
class PreviewCard extends Card {
	// Элемент для отображения подробного описания продукта
	protected _description: HTMLElement;

	// Создает карточку предварительного просмотра с поддержкой описания
	constructor(container: HTMLElement, actions?: ICardActions);

	// Устанавливает текст описания продукта
	set description(value: string);

	// Обновляет видимость описания
	protected setDescriptionVisible(visible: boolean): void;

	// Рендерит карточку предварительного просмотра с полными данными о продукте
	render(data: ICard & { description?: string }): HTMLElement;
}
```

##### Modal

Компонент модального окна для отображения контента в оверлее. Обрабатывает открытие, закрытие и управление контентом с правильной блокировкой прокрутки.

```typescript
class Modal extends Component<IModalData> {
	// Кнопка для закрытия модального окна
	protected _closeButton: HTMLButtonElement;

	// Контейнер для контента модального окна
	protected _content: HTMLElement;

	// Внешний контейнер для позиционирования модального окна
	protected _container: HTMLElement;

	// Создает модальное окно с кнопкой закрытия и обработчиками событий
	constructor(container: HTMLElement, events: IEvents);

	// Обновляет элемент контента модального окна
	set content(value: HTMLElement);

	// Открывает модальное окно и блокирует прокрутку страницы
	open(): void;

	// Закрывает модальное окно и восстанавливает прокрутку страницы
	close(): void;

	// Рендерит модальное окно с предоставленным контентом
	render(data: IModalData): HTMLElement;
}
```

##### Form

Компонент формы, который обрабатывает проверку ввода пользователя и отправку данных. Поддерживает как формы заказа, так и контактной информации с проверкой в реальном времени.

```typescript
class Form extends Component<IFormState> {
	// Кнопка отправки, которая запускает отправку формы
	protected _submit: HTMLButtonElement;

	// Контейнер для сообщений об ошибках валидации
	protected _errors: HTMLElement;

	// Коллекция кнопок выбора метода оплаты
	protected _paymentButtons: NodeListOf<HTMLButtonElement>;

	// Поля ввода для данных пользователя
	protected _address: HTMLInputElement;
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	// Набор текущих ошибок валидации
	protected _validationErrors: Set<string>;

	// Основной элемент формы
	protected _form: HTMLFormElement;

	// Создает экземпляр формы и настраивает обработчики валидации
	constructor(container: HTMLElement, events: IEvents);

	// Проверяет все поля формы и обновляет состояние
	protected validateForm(): void;

	// Обрабатывает изменения в полях ввода с проверкой
	protected handleInput(event: Event): void;

	// Обрабатывает отправку формы с проверкой
	protected handleSubmit(event: Event): void;

	// Обновляет состояние кнопки отправки в зависимости от валидности
	set valid(value: boolean);

	// Обновляет отображение сообщений об ошибках
	set errors(value: string[]);

	// Рендерит форму с текущим состоянием
	render(state: IFormState): HTMLElement;
}
```

##### Success

Компонент для отображения успешного завершения заказа. Показывает сводку заказа и детали подтверждения.

```typescript
class Success extends Component<ISuccessProps> {
	// Элемент, отображающий общую сумму
	protected _total: HTMLElement;

	// Элемент, показывающий идентификатор заказа
	protected _id: HTMLElement;

	// Создает компонент сообщения об успешном заказе
	constructor(container: HTMLElement);

	// Устанавливает общую сумму с правильным форматированием
	protected setTotal(value: number): void;

	// Устанавливает идентификатор заказа
	protected setId(value: string): void;

	// Рендерит сообщение об успешном заказе с деталями заказа
	render(data: ISuccessProps): HTMLElement;
}
```

##### Basket

Компонент корзины покупок, который управляет отображением выбранных товаров и общей суммой.

```typescript
class Basket extends Component<IBasketView> {
	// Счетчик, показывающий количество товаров
	protected _counter: HTMLElement;

	// Элемент, отображающий общую сумму
	protected _total: HTMLElement;

	// Контейнер для товаров в корзине
	protected _items: HTMLElement;

	// Создает компонент корзины с обработчиками событий
	constructor(container: HTMLElement, events: IEvents);

	// Обновляет отображение счетчика товаров
	protected setCount(value: number): void;

	// Обновляет отображение общей суммы
	protected setTotal(value: number): void;

	// Рендерит корзину с текущими товарами и общей суммой
	render(data: IBasketView): HTMLElement;
}
```

##### Page

Основной компонент страницы, который организует макет и управляет глобальными элементами интерфейса.

```typescript
class Page extends Component<IPageState> {
	// Контейнер для каталога продуктов
	protected _catalog: HTMLElement;

	// Экземпляр корзины покупок
	protected _basket: Basket;

	// Экземпляр модального окна
	protected _modal: Modal;

	// Создает компонент страницы и инициализирует подкомпоненты
	constructor(container: HTMLElement, events: IEvents);

	// Обновляет отображение каталога с карточками продуктов
	set catalog(items: HTMLElement[]);

	// Показывает/скрывает индикатор загрузки
	protected toggleLoader(show: boolean): void;

	// Рендерит страницу с начальным состоянием
	render(data: IPageState): HTMLElement;
}
```

## Техническая справка

### Взаимодействие компонентов

Ниже представлена визуализация того, как компоненты взаимодействуют в различных сценариях:

```mermaid
graph TD
    A[Действие пользователя] --> B[EventEmitter]
    B --> C{Тип события}
    C -->|Событие состояния| D[AppState]
    C -->|Событие UI| E[Component]
    D --> F[Обновление состояния]
    F --> G[Вызов события изменения]
    G --> E
    E --> H[Обновление UI]
```

#### Пример: Добавление в корзину

```mermaid
sequenceDiagram
    participant User
    participant Card
    participant AppState
    participant LocalStorage
    participant UI

    User->>Card: Нажать "Добавить в корзину"
    Card->>AppState: addToBasket(item)
    AppState->>AppState: Обновить состояние корзины
    AppState->>LocalStorage: Сохранить корзину
    AppState->>UI: Вызвать basket:changed
    UI->>UI: Обновить счетчик
```

### Примеры реализации

#### 1. Загрузка и предварительный просмотр продуктов

```typescript
// Этап 1: Инициализация API и получение списка продуктов
api
	.getProductList()
	.then((items) => {
		appData.setCatalog(items);
		const state = appData.getState();

		// Этап 2: Создание шаблона карточки для каждого продукта
		const cards = state.catalog.map((item) => {
			const cardElement = cardCatalogTemplate.content.cloneNode(
				true
			) as HTMLElement;

			// Этап 3: Настройка обработчика клика для предпросмотра
			const card = new Card(cardElement.firstElementChild as HTMLElement, {
				onClick: () => {
					appData.setPreview(item);
					modal.open();
				},
			});

			// Этап 4: Отрисовка карточки с данными продукта
			return card.render({
				title: item.title,
				image: item.image,
				price: item.price,
				category: item.category,
			});
		});

		// Этап 5: Обновление каталога страницы всеми карточками
		page.catalog = cards;
	})
	.catch(console.error);
```

#### 2. Управление корзиной покупок

```typescript
events.on('basket:changed', () => {
	// Этап 1: Получение текущего состояния и обновление счетчика
	const state = appData.getState();
	page.counter = state.basket.length;

	// Этап 2: Создание элементов карточек для товаров в корзине
	const basketItems = state.basket.map((item) => {
		const cardElement = basketItemTemplate.content.cloneNode(
			true
		) as HTMLElement;

		// Этап 3: Настройка функционала удаления
		const card = new Card(cardElement.firstElementChild as HTMLElement, {
			onDelete: () => {
				appData.removeFromBasket(item.id);
			},
		});

		// Этап 4: Отрисовка отдельного товара в корзине
		return card.render({
			title: item.title,
			price: item.price,
			category: item.category,
		});
	});

	// Этап 5: Обновление UI корзины и сохранение в хранилище
	const basketTotal = state.basket.reduce((sum, item) => sum + item.price, 0);
	basketModal.render({
		content: basket.render({
			items: basketItems,
			total: basketTotal,
		}),
	});
	localStorage.setItem('basket', JSON.stringify(state.basket));
});
```

#### 3. Обработка заказов

```typescript
events.on('contacts:submit', (data: { email: string; phone: string }) => {
	// Этап 1: Обновление полей заказа контактной информацией
	appData.setOrderField('email', data.email);
	appData.setOrderField('phone', data.phone);

	// Этап 2: Подготовка данных заказа
	const state = appData.getState();
	const orderData = {
		...state.order,
		items: state.basket.map((item) => item.id),
		total: state.basket.reduce((sum, item) => sum + item.price, 0),
	};

	// Этап 3: Отправка заказа в API
	api
		.createOrder(orderData)
		.then((result) => {
			// Этап 4: Обработка успешного заказа
			orderModal.close();
			successModal.render({
				content: success.render({
					total: result.total,
				}),
			});
			successModal.open();

			// Этап 5: Очистка после успешного заказа
			appData.clearBasket();
		})
		.catch(console.error);
});
```

### Система событий и справка по API

Приложение использует события для коммуникации между компонентами. Вот полная справка:

#### События состояния

| Имя события     | Данные                                 | Описание                                            |
| --------------- | -------------------------------------- | --------------------------------------------------- |
| items:changed   | `IProduct[]`                           | Обновлен каталог продуктов                          |
| preview:changed | `IProduct \| null`                     | Установлен/очищен предварительный просмотр продукта |
| basket:changed  | `{ items: IProduct[], total: number }` | Изменена корзина покупок                            |
| order:changed   | `IOrder`                               | Обновлены детали заказа                             |

#### События действий пользователя

| Имя события     | Данные                                 | Описание                     |
| --------------- | -------------------------------------- | ---------------------------- |
| input           | `{ field: string, value: string }`     | Изменено поле формы          |
| submit          | `{ payment: string, address: string }` | Отправлена форма заказа      |
| contacts:submit | `{ email: string, phone: string }`     | Отправлены контактные данные |

### Интеграция API

#### Api

Базовый класс для коммуникации с API. Предоставляет методы для выполнения HTTP-запросов и обработки ответов.

```typescript
/**
 * Общий тип для ответов API со списками
 */
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

/**
 * Допустимые HTTP-методы для POST-подобных операций
 */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/**
 * Базовый класс API-клиента
 * Предоставляет общую функциональность для выполнения HTTP-запросов
 */
export class Api {
	/** Базовый URL для всех API-запросов */
	readonly baseUrl: string;
	/** Параметры запросов по умолчанию */
	protected options: RequestInit;

	/**
	 * Создает новый экземпляр API-клиента
	 * @param {string} baseUrl - Базовый URL для всех API-запросов
	 * @param {RequestInit} [options={}] - Параметры fetch по умолчанию
	 */
	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	/**
	 * Обрабатывает ответ API
	 * Автоматически парсит JSON и обрабатывает ошибки
	 */
	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	/**
	 * Выполняет GET-запрос к API
	 */
	get(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	/**
	 * Выполняет POST, PUT или DELETE запрос к API
	 */
	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}

/**
 * API-клиент для взаимодействия с бэкендом
 * Расширяет базовый класс Api специфичными методами для магазина Web Larek
 */
export class LarekAPI extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	/**
	 * Получает список продуктов из API
	 * Добавляет CDN URL к изображениям продуктов
	 */
	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	/**
	 * Создает новый заказ в системе
	 */
	createOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
```

### Структура проекта

```
src/
├── components/          # Основные компоненты
│   ├── base/           # Базовые классы
│   │   ├── Component.ts    # Базовый UI-компонент
│   │   ├── events.ts      # Система событий
│   │   └── Model.ts       # Управление состоянием
│   ├── common/         # Общие компоненты
│   ├── AppData.ts      # Состояние приложения
│   ├── Card.ts         # Компонент карточки продукта
│   ├── LarekAPI.ts     # Клиент API
│   ├── Order.ts        # Управление заказами
│   └── Page.ts         # Макет страницы
├── types/              # Определения TypeScript
│   ├── index.ts        # Экспорты типов
│   ├── api.ts          # Типы API
│   └── common.ts       # Общие типы
├── utils/              # Утилитарные функции
│   ├── constants.ts    # Глобальные константы
│   └── utils.ts        # Вспомогательные функции
└── index.ts           # Точка входа приложения
```

## Руководство по разработке

1. **Обработка событий**

   - Используйте события для коммуникации между компонентами
   - Поддерживайте согласованность имен событий
   - Документируйте данные событий

2. **Управление состоянием**

   - Изменяйте состояние только через AppData
   - Используйте события для реакции на изменения состояния
   - Сохраняйте необходимые данные в localStorage

3. **Разработка компонентов**

   - Держите компоненты сфокусированными и с одной целью
   - Используйте интерфейсы TypeScript для свойств
   - Следуйте установленному жизненному циклу компонентов

4. **Стиль кода**
   - Используйте возможности TypeScript по назначению
   - Следуйте конфигурациям ESLint и Prettier
   - Пишите ясный, самодокументирующийся код
