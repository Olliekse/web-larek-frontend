# Web Larek Frontend

![UML](https://github.com/user-attachments/assets/4f912602-78bb-4512-98d5-460273f8c0ce)


## Содержание

1. [Описание проекта](#описание-проекта)
2. [Обзор архитектуры](#обзор-архитектуры)
3. [Описание данных](#описание-данных)
   - [Интерфейсы данных](#интерфейсы-данных)
   - [Модели данных](#модели-данных)
     - [CartModel](#cartmodel)
     - [ApiModel](#apimodel)
4. [Компоненты представления](#компоненты-представления)
   - [Базовые компоненты](#базовые-компоненты)
     - [EventEmitter](#eventemitter)
     - [View](#view)
     - [Modal](#modal)
   - [UI компоненты](#ui-компоненты)
     - [ProductCard](#productcard)
     - [ProductDetails](#productdetails)
     - [Catalog](#catalog)
     - [Cart](#cart)
     - [ContactsForm](#contactsform)
     - [OrderForm](#orderform)
5. [Система событий](#система-событий)
   - [События по компонентам](#события-по-компонентам)
     - [События модального окна](#события-модального-окна)
     - [События карточки товара](#события-карточки-товара)
     - [События корзины](#события-корзины)
     - [События формы контактов](#события-формы-контактов)
     - [События формы заказа](#события-формы-заказа)
   - [Примеры потока событий](#примеры-потока-событий)
6. [Структура проекта](#структура-проекта)
7. [Установка](#установка)
8. [Рекомендации по разработке](#рекомендации-по-разработке)

## Описание проекта

Магазин мерча для разработчиков, где пользователи могут тратить "синапсы" (виртуальная валюта) на тематические товары для разработчиков. Построен с использованием TypeScript и архитектуры MVP, включает адаптивную галерею, функционал корзины и валидацию форм.

Оперативная версия: https://olliekse.github.io/web-larek-frontend/

## Обзор архитектуры

Проект реализует паттерн Model-View-Presenter (MVP) с событийно-ориентированным подходом. Приложение разделено на три основных слоя:

1. **Слой Model**: Управляет данными и бизнес-логикой
2. **Слой View**: Управляет UI компонентами и взаимодействием с пользователем
3. **Слой Presenter**: Координирует взаимодействие между Model и View (реализован в index.ts)

## Описание данных

### Интерфейсы данных

```typescript
interface IProduct {
	id: string;
	title: string;
	price: number;
	category: string;
	image: string;
	description: string;
}

interface ICartItem extends IProduct {
	quantity: number;
}

interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: 'card' | 'cash';
}

interface IOrder extends IOrderForm {
	items: string[]; // ID товаров
	total: number;
}
```

### Модели данных

#### CartModel

Управляет состоянием и операциями корзины покупок:

```typescript
class Cart extends View<ICartItem[]> {
	// Основной функционал корзины
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	// Управление состоянием корзины
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

Обрабатывает все взаимодействия с сервером:

```typescript
class Api {
	readonly baseUrl: string;
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string) {
		this.baseUrl = baseUrl;
		this.cdn = cdn;
	}

	// Получение списка продуктов
	getProductList() {
		return this.get('/product').then((data: ApiListResponse<IProduct>) => {
			return data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}));
		});
	}

	// Обработка отправки заказа
	orderProducts(order: IOrder) {
		return this.post('/order', order).then((response) => {
			return response as { id: string };
		});
	}
}
```

Модели взаимодействуют с другими частями приложения через систему событий, генерируя события при изменении данных и реагируя на события, требующие обновления данных.

## Компоненты представления

### Базовые компоненты

#### EventEmitter

**Назначение**: Базовый класс, обеспечивающий функциональность событий
**Методы**:

- `on(event: string, callback: Function): void` - Подписка на событие
- `emit(event: string, data?: any): void` - Генерация события
- `off(event: string, callback: Function): void` - Отписка от события
- `offAll(): void` - Удаление всех подписок
- `trigger(event: string, context?: object): Function` - Создание функции-триггера события

#### View<T>

**Назначение**: Базовый класс для всех компонентов представления
**Конструктор**:

- `container: HTMLElement` - Корневой элемент компонента

**Поля**:

- `protected container: HTMLElement` - Корневой элемент компонента
- `protected state: T` - Состояние данных компонента

**Методы**:

- `render(data: T): void` - Обновляет отображение компонента
- `setState(state: Partial<T>): void` - Обновляет состояние компонента
- `getState(): T` - Возвращает текущее состояние
- `show(): void` - Показывает компонент
- `hide(): void` - Скрывает компонент

#### Modal

**Назначение**: Управляет функциональностью модального окна с содержимым и заголовком
**Конструктор**:

- `container: HTMLElement` - Корневой элемент модального окна

**Поля**:

- `private _closeButton: HTMLButtonElement` - Кнопка закрытия
- `private _content: HTMLElement` - Контейнер содержимого
- `private _title: HTMLElement` - Элемент заголовка

**Методы**:

- `render(data: IModalContent): void` - Обновляет содержимое и заголовок модального окна
- `open(): void` - Открывает модальное окно
- `close(): void` - Закрывает модальное окно и очищает содержимое
- `private handleOutsideClick(event: MouseEvent): void` - Обрабатывает клики вне модального окна

**Интерфейс**:

```typescript
interface IModalContent {
	content: HTMLElement;
	title?: string;
}
```

### UI компоненты

#### ProductCard (Карточка товара)

**Назначение**: Отображает информацию о товаре в каталоге
**Конструктор**:

- `container: HTMLElement` - Контейнер карточки
- Использует шаблон: '#card-catalog'

**Поля**:

- `private _title: HTMLElement` - Элемент заголовка
- `private _price: HTMLElement` - Элемент цены
- `private _category: HTMLElement` - Элемент категории
- `private _image: HTMLImageElement` - Элемент изображения товара

**Методы**:

- `render(data: IProduct): void` - Обновляет отображение карточки
- `setCategory(value: string): void` - Обновляет стиль категории
- Геттеры/сеттеры для title, price, category, image

**События**:

- `card:select` - Срабатывает при клике на карточку
  - Data: `IProduct` (данные товара)

#### ContactsForm

**Назначение**: Управляет формой контактных данных
**Конструктор**:

- `container: HTMLElement` - Контейнер формы

**Поля**:

- `private _email: HTMLInputElement` - Поле ввода email
- `private _phone: HTMLInputElement` - Поле ввода телефона
- `private _submitButton: HTMLButtonElement` - Кнопка отправки

**Методы**:

- `validateEmail(email: string): boolean` - Проверяет корректность email
- `validatePhone(phone: string): boolean` - Проверяет корректность телефона
- `get email(): string` - Возвращает значение email
- `get phone(): string` - Возвращает значение телефона

#### OrderForm

**Назначение**: Управляет формой оформления заказа
**Конструктор**:

- `container: HTMLElement` - Контейнер формы

**Поля**:

- `private _cardButton: HTMLButtonElement` - Кнопка оплаты картой
- `private _cashButton: HTMLButtonElement` - Кнопка оплаты наличными
- `private _addressInput: HTMLInputElement` - Поле ввода адреса
- `private _submitButton: HTMLButtonElement` - Кнопка отправки
- `private _paymentMethod: string | null` - Выбранный способ оплаты

**Методы**:

- `setPaymentMethod(method: string): void` - Устанавливает способ оплаты
- `validateAddress(): void` - Проверяет корректность адреса
- `validateForm(): void` - Проверяет валидность всей формы

## Система событий

### События по компонентам

#### События модального окна

- `modal:open` - При открытии модального окна
  - Данные: `void`
- `modal:close` - При закрытии модального окна
  - Данные: `void`

#### События карточки товара

- `card:click` - При клике на карточку товара
  - Данные: `IProduct` (полное состояние товара)

#### События корзины

- `cart:changed` - При изменении содержимого корзины
  - Данные: `ICartItem[]`
- `cart:cleared` - При очистке корзины
  - Данные: `void`

#### События формы контактов

- `form:validate` - При валидации формы
  - Данные: `{ field: string, value: string, valid: boolean }`

#### События формы заказа

- `payment:select` - При выборе способа оплаты
  - Данные: `{ method: string }`
- `address:validate` - При валидации адреса
  - Данные: `{ value: string, valid: boolean }`

### Примеры потока событий

1. **Взаимодействие с карточкой товара**:

```typescript
// Из card.ts
private handleClick(): void {
    this.emit('card:click', this.state);
}
```

2. **Валидация формы**:

```typescript
// Из ContactsForm.ts
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

3. **Выбор способа оплаты**:

```typescript
// Из OrderForm.ts
setPaymentMethod(method: string): void {
    this._paymentMethod = method;
    this.emit('payment:select', { method });
    this.validateForm();
}
```

4. **Валидация адреса**:

```typescript
// Из OrderForm.ts
validateAddress(): void {
    const isValid = this._addressInput.value.length > 0;
    this.emit('address:validate', { value: this._addressInput.value, valid: isValid });
}
```

5. **Операции модального окна**:

```typescript
// Из Modal.ts
open(): void {
    this.container.classList.add('modal_active');
    this.emit('modal:open');
}

close(): void {
    this.container.classList.remove('modal_active');
    this.emit('modal:close');
}
```

## Структура проекта

```
web-larek-frontend/
├── src/                      # Исходные файлы
│   ├── common.blocks/        # SCSS блоки компонентов
│   │   ├── basket.scss
│   │   ├── button.scss
│   │   ├── card.scss
│   │   └── ...
│   ├── components/          # TypeScript компоненты
│   │   ├── base/           # Базовые классы компонентов
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
│   ├── images/             # Изображения проекта
│   ├── pages/              # HTML страницы
│   │   └── index.html
│   ├── public/            # Статические ресурсы
│   ├── scss/             # SCSS стили
│   │   ├── mixins/
│   │   ├── _variables.scss
│   │   └── styles.scss
│   ├── types/            # Определения типов TypeScript
│   │   └── index.ts
│   ├── utils/            # Вспомогательные функции
│   │   ├── constants.ts
│   │   ├── mask.ts
│   │   └── utils.ts
│   ├── vendor/           # Сторонние ресурсы
│   │   ├── garamond/
│   │   ├── glyphter/
│   │   ├── ys-text/
│   │   └── normalize.css
│   └── index.ts         # Точка входа в приложение
├── .babelrc            # Конфигурация Babel
├── .env               # Переменные окружения
├── .eslintrc.js      # Конфигурация ESLint
├── package.json      # Зависимости проекта
├── tsconfig.json    # Конфигурация TypeScript
└── webpack.config.js # Конфигурация Webpack
```

## Установка

```bash
npm install
npm run start
```

## Рекомендации по разработке

1. Следовать разделению ответственности согласно паттерну MVP
2. Использовать событийно-ориентированное взаимодействие между компонентами
3. Обеспечивать правильную проверку типов
4. Соблюдать принцип единственной ответственности компонентов
5. Использовать базовые классы для общей функциональности
