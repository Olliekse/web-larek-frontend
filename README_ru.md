# Web Larek Frontend

## Содержание

1. [Описание проекта](#описание-проекта)
2. [Реализация паттерна MVP](#реализация-паттерна-mvp)
   - [Обзор](#обзор)
   - [Поток коммуникации](#поток-коммуникации)
   - [Преимущества](#преимущества)
3. [Ключевые особенности](#ключевые-особенности)
4. [Технический стек](#технический-стек)
5. [Начало работы](#начало-работы)
   - [Установка](#установка)
   - [Настройка разработки](#настройка-разработки)
6. [Структура проекта](#структура-проекта)
7. [Документация классов](#документация-классов)
   - [Базовые классы](#базовые-классы)
   - [Модели](#модели)
   - [Представления](#представления)
   - [Презентеры](#презентеры)
8. [Система событий](#система-событий)
   - [События корзины](#-события-корзины)
   - [События модального окна](#-события-модального-окна)
   - [События продуктов](#️-события-продуктов)
   - [События форм](#-события-форм)
9. [API слой](#api-слой)
10. [Рекомендации по разработке](#рекомендации-по-разработке)
    - [Разработка компонентов](#разработка-компонентов)
    - [Стиль кода](#стиль-кода)
    - [Тестирование](#тестирование)
11. [Примеры взаимодействия](#примеры-взаимодействия)
    - [Добавление товара в корзину](#1-добавление-товара-в-корзину)
    - [Валидация формы при оформлении заказа](#2-валидация-формы-при-оформлении-заказа)
    - [Открытие модального окна с деталями продукта](#3-открытие-модального-окна-с-деталями-продукта)

---

## Описание проекта

Магазин мерчендайза для разработчиков, где пользователи могут тратить "синапсы" (виртуальную валюту) на тематические товары для разработчиков. Построен с использованием TypeScript и архитектуры MVP, включает адаптивную галерею, функциональность корзины и валидацию форм.

🔗 **Живая версия**: https://olliekse.github.io/web-larek-frontend/

## Реализация паттерна MVP

Этот проект реализует архитектурный паттерн Model-View-Presenter (MVP) для разделения ответственности и улучшения поддерживаемости:

### Обзор

Приложение разделено на три основных слоя:

1. **Слой Model**: Обрабатывает бизнес-логику и управление данными

   - Управляет состоянием приложения
   - Обрабатывает валидацию данных

- Генерирует события изменения состояния

2. **Слой View**: Обрабатывает отображение UI и взаимодействие с пользователем

   - Отрисовывает UI компоненты
   - Обрабатывает пользовательский ввод
   - Генерирует события взаимодействия

3. **Слой Presenter**: Координирует работу между Models и Views
   - Обрабатывает бизнес-логику
   - Обновляет Models на основе событий View
   - Обновляет Views на основе изменений Model

### Поток коммуникации

1. **Пользователь → View**: Пользователь взаимодействует с элементами UI
2. **View → Presenter**: View генерирует события, которые обрабатывает Presenter
3. **Presenter → Model**: Presenter вызывает методы Model для обновления данных
4. **Model → Presenter**: Model генерирует события с обновленным состоянием
5. **Presenter → View**: Presenter обновляет View новыми данными

### Преимущества

1. **Разделение ответственности**

   - Четкие границы между слоями
   - Каждый слой имеет единственную ответственность

2. **Тестируемость**

   - Компоненты можно тестировать изолированно
   - Легко создавать моки зависимостей

3. **Поддерживаемость**

   - Изменения в одном слое не влияют на другие
   - Четкие границы ответственности

4. **Переиспользуемость**
   - Компоненты можно переиспользовать в разных функциях
   - Гибкая архитектура для будущих изменений

Для детальной реализации каждого компонента смотрите [Документация классов](#документация-классов).
Для деталей системы событий смотрите [Основные концепции - Система событий](#система-событий).

---

## Ключевые особенности

- 🎨 Адаптивная галерея продуктов с динамическими обновлениями
- 🛒 Управление корзиной в реальном времени с валютой "синапсы"
- 📝 Многошаговая форма заказа с валидацией
- 🔄 Управление состоянием с событийно-ориентированными обновлениями
- 💳 Несколько способов оплаты (карта/наличные)
- 📱 Адаптивный дизайн
- 🔌 Типобезопасное взаимодействие с API и обработка ошибок

---

## Технический стек

- **TypeScript** - Основной язык программирования
- **SCSS** - Стилизация с методологией BEM
- **Webpack** - Сборка модулей и сервер разработки
- **Event-Driven Architecture** - Пользовательская система событий для коммуникации компонентов
- **MVP Pattern** - Архитектурный паттерн Model-View-Presenter

---

## Начало работы

### Установка

```bash
# Установка зависимостей
npm install

# Запуск сервера разработки
npm run start

# Сборка для продакшена
npm run build
```

### Настройка разработки

```bash
# Клонирование репозитория
git clone https://github.com/olliekse/web-larek-frontend.git

# Установка зависимостей
npm install

# Запуск сервера разработки
npm run start

# Сборка для продакшена
npm run build

# Запуск тестов
npm run test

# Проверка кода
npm run lint
```

---

## Структура проекта

```
web-larek-frontend/
├── src/
│   ├── components/        # Компоненты приложения
│   ├── services/         # Реализации сервисного слоя
│   ├── utils/            # Вспомогательные функции и утилиты
│   ├── common.blocks/    # Общие блочные компоненты
│   ├── config/           # Конфигурационные файлы
│   ├── constants/        # Константы и перечисления
│   ├── images/           # Изображения
│   ├── pages/            # Шаблоны страниц
│   ├── public/           # Публичные ассеты
│   ├── scss/            # SCSS стили
│   ├── types/           # TypeScript определения типов
│   ├── vendor/          # Сторонние библиотеки
│   └── index.ts         # Точка входа приложения
```

---

## Документация классов

### Базовые классы

1. **BasePresenter**

   - **Назначение**: Служит основой для всех презентеров в паттерне MVP, обеспечивая общую функциональность обработки событий и управления жизненным циклом. Выступает в роли моста между Models и Views.
   - **Поля**:
     - `protected events: IEvents` - Экземпляр системы событий
   - **Методы**:
     - `constructor(events: IEvents)` - Инициализирует презентер с системой событий
     - `protected init(): void` - Шаблонный метод для инициализации
     - `protected destroy(): void` - Очистка и отписка от событий

2. **Card**

   - **Назначение**: Предоставляет переиспользуемую основу для всех компонентов карточек продуктов, обрабатывая общие манипуляции с DOM, управление шаблонами и стилизацию категорий. Обеспечивает единообразное отображение карточек во всем приложении.
   - **Поля**:
     - `protected elements: CardElements` - Ссылки на DOM элементы
     - `protected template: HTMLTemplateElement` - Шаблон карточки
     - `protected domService: IDOMService` - Сервис манипуляции с DOM
   - **Методы**:
     - `protected initializeElements(): void` - Настраивает ссылки на DOM элементы
     - `render(data: IProduct): HTMLElement` - Создает элемент карточки
     - `protected getCategoryClass(category: string): string` - Сопоставляет категорию с CSS классом

3. **EventEmitter**
   - **Назначение**: Реализует надежную систему событий, обеспечивающую слабосвязанную коммуникацию между компонентами. Управляет подпиской, отпиской и генерацией событий на протяжении жизненного цикла приложения.
   - **Поля**:
     - `private events: Record<string, EventHandler[]>` - Хранилище обработчиков событий
   - **Методы**:
     - `on(event: string, handler: EventHandler): void` - Подписывается на событие
     - `off(event: string, handler: EventHandler): void` - Отписывается от события
     - `emit(event: string, data?: unknown): void` - Вызывает обработчики событий
     - `trigger(event: string): Function` - Создает функцию-триггер события

### Модели

1. **StateService**

   - **Назначение**: Централизованно управляет глобальным состоянием приложения, включая каталог продуктов, корзину и состояние загрузки. Обеспечивает единый источник правды для всего приложения и уведомляет об изменениях через систему событий.
   - **Поля**:
     - `private products: IProduct[]` - Список всех продуктов
     - `private cart: CartState` - Состояние корзины
     - `private loading: Record<string, boolean>` - Состояния загрузки
     - `private modal: ModalState | null` - Состояние модального окна
   - **Методы**:
     - `setProducts(products: IProduct[]): void` - Обновляет каталог продуктов
     - `getProducts(): IProduct[]` - Возвращает список продуктов
     - `addToCart(product: IProduct): void` - Добавляет товар в корзину
     - `removeFromCart(productId: string): void` - Удаляет товар из корзины
     - `getCart(): CartState` - Возвращает текущее состояние корзины

2. **FormModel**

   - **Назначение**: Управляет состоянием форм, включая валидацию полей, отслеживание ошибок и форматирование данных. Обеспечивает надежную обработку пользовательского ввода и валидацию перед отправкой.
   - **Поля**:
     - `private data: Partial<IOrderForm>` - Данные формы
     - `private errors: FormErrors` - Ошибки валидации
   - **Методы**:
     - `constructor(events: IEvents)` - Инициализация с системой событий
     - `setField(field: keyof IOrderForm, value: string): void` - Обновляет поле формы
     - `validateField(field: keyof IOrderForm): boolean` - Проверяет валидность поля
     - `validateForm(): boolean` - Проверяет валидность всей формы
     - `getErrors(): FormErrors` - Возвращает текущие ошибки

3. **OrderModel**
   - **Назначение**: Обрабатывает бизнес-логику заказов, включая управление товарами, способами оплаты и контактной информацией. Обеспечивает корректное формирование и валидацию заказов перед отправкой.
   - **Поля**:
     - `private orderData: IOrder` - Данные заказа
     - `private items: string[]` - Список товаров
   - **Методы**:
     - `setOrderItems(items: IProduct[]): void` - Устанавливает товары заказа
     - `setPaymentMethod(method: 'card' | 'cash'): void` - Устанавливает способ оплаты
     - `setContactInfo(info: ContactInfo): void` - Устанавливает контактные данные
     - `getOrderData(): IOrder` - Возвращает данные заказа

### Представления

1. **CardPreview**

   - **Назначение**: Отвечает за отображение карточек продуктов в галерее, включая обработку взаимодействий с кнопками, отображение состояния товара (в корзине/доступен) и открытие модального окна с деталями. Обеспечивает единообразное представление продуктов во всем приложении.
   - **Поля**:
     - `protected elements: CardElements` - Элементы карточки
     - `protected button: HTMLButtonElement` - Кнопка действия
     - `private currentProduct: IProduct` - Текущий продукт
   - **Методы**:
     - `render(data: IProduct): HTMLElement` - Отрисовывает карточку
     - `updateButtonState(inCart: boolean, canBuy: boolean): void` - Обновляет состояние кнопки
     - `renderModal(data: IProduct): HTMLElement` - Отрисовывает модальное окно

2. **Cart**

   - **Назначение**: Управляет отображением корзины, включая список товаров, общую сумму и кнопку оформления заказа. Обеспечивает интерактивное обновление при изменении состояния корзины и обработку действий пользователя.
   - **Поля**:
     - `private cartList: HTMLElement` - Список товаров
     - `private totalElement: HTMLElement` - Элемент общей суммы
     - `private checkoutButton: HTMLButtonElement` - Кнопка оформления
     - `private cartCounter: HTMLElement` - Счетчик товаров
   - **Методы**:
     - `renderItems(items: IProduct[]): void` - Отрисовывает список товаров
     - `updateTotal(total: number): void` - Обновляет общую сумму
     - `updateCounter(count: number): void` - Обновляет счетчик товаров

3. **OrderForm**
   - **Назначение**: Отвечает за отображение и обработку формы заказа, включая валидацию полей в реальном времени, отображение ошибок и управление способами оплаты. Обеспечивает удобный процесс оформления заказа с мгновенной обратной связью.
   - **Поля**:
     - `private addressInput: HTMLInputElement` - Поле адреса
     - `private paymentOptions: HTMLElement[]` - Опции оплаты
     - `private submitButton: HTMLButtonElement` - Кнопка отправки
   - **Методы**:
     - `validateAddress(): boolean` - Проверяет адрес
     - `setPaymentMethod(method: string): void` - Устанавливает способ оплаты
     - `showSuccess(): void` - Показывает успешное оформление

### Презентеры

1. **ProductPresenter**

   - **Назначение**: Координирует взаимодействие между галереей продуктов (View) и состоянием приложения (Model). Обрабатывает действия пользователя с продуктами, управляет отображением деталей и обновлением состояния корзины. Обеспечивает согласованное представление каталога продуктов.
   - **Поля**:
     - `private gallery: HTMLElement` - Контейнер галереи
     - `private stateService: StateService` - Сервис состояния
     - `private api: ProductApi` - API сервис
   - **Методы**:
     - `async init(): Promise<void>` - Инициализирует отображение продуктов
     - `private handleProductSelect(product: IProduct): void` - Открывает детали продукта
     - `private updateProductStates(): void` - Обновляет состояния продуктов

2. **CartPresenter**

   - **Назначение**: Управляет взаимодействием между корзиной (View) и состоянием приложения (Model). Обрабатывает добавление/удаление товаров, обновление общей суммы и переход к оформлению заказа. Обеспечивает актуальное состояние корзины.
   - **Поля**:
     - `private stateService: StateService` - Управление состоянием
     - `private view: ICart` - Интерфейс корзины
     - `private modal: ModalView` - Модальное окно
   - **Методы**:
     - `init(): void` - Настраивает слушатели корзины
     - `private handleCartOpen(): void` - Открывает корзину
     - `private handleItemRemove(productId: string): void` - Удаляет товар

3. **OrderPresenter**
   - **Назначение**: Координирует процесс оформления заказа между формой (View) и моделями данных (Model). Обрабатывает валидацию полей, выбор способа оплаты и отправку заказа. Обеспечивает надежный процесс оформления заказа с обработкой ошибок.
   - **Поля**:
     - `private formModel: FormModel` - Модель формы
     - `private api: ProductApi` - API сервис
     - `private stateService: StateService` - Управление состоянием
   - **Методы**:
     - `init(): void` - Настраивает валидацию формы
     - `private handleSubmit(formData: IOrderForm): void` - Обрабатывает отправку
     - `private validateOrder(): boolean` - Проверяет валидность заказа

---

## Примеры взаимодействия

### 1. Добавление товара в корзину

Пример демонстрирует полный цикл MVP при добавлении товара в корзину:

```typescript
// 1. View: Обработка клика по кнопке
class CardView extends Card {
	protected addToCartButton: HTMLButtonElement;

	constructor() {
		this.addToCartButton.addEventListener('click', () => {
			this.events.emit('product:add', this.currentProduct);
		});
	}
}

// 2. Presenter: Обработка события добавления
class ProductPresenter extends BasePresenter {
	private handleProductAdd(product: IProduct): void {
		this.stateService.addToCart(product);
		this.events.emit('cart:changed');
	}
}

// 3. Model: Обновление состояния
class StateService {
	private cart: CartState = { items: [], total: 0 };

	public addToCart(product: IProduct): void {
		this.cart.items.push(product);
		this.cart.total += product.price;
		this.events.emit('state:cart:changed', this.cart);
	}
}

// 4. Presenter: Реакция на изменение состояния
class CartPresenter extends BasePresenter {
	private handleCartUpdate(cart: CartState): void {
		this.view.renderItems(cart.items);
		this.view.updateTotal(cart.total);
	}
}

// 5. View: Обновление интерфейса
class CartView {
	public updateTotal(total: number): void {
		this.totalElement.textContent = `${total} синапсов`;
	}
}
```

### 2. Валидация формы при оформлении заказа

Пример показывает процесс валидации формы заказа:

```typescript
// 1. View: Обработка ввода пользователя
class OrderForm {
	private emailInput: HTMLInputElement;

	constructor() {
		this.emailInput.addEventListener('input', (e: Event) => {
			const value = (e.target as HTMLInputElement).value;
			this.events.emit('form:input', { field: 'email', value });
		});
	}
}

// 2. Presenter: Валидация через модель
class OrderPresenter extends BasePresenter {
	private handleFormInput(data: { field: string; value: string }): void {
		this.formModel.setField(data.field, data.value);
		const isValid = this.formModel.validateField(data.field);
		this.events.emit('form:validation', {
			field: data.field,
			isValid,
			errors: this.formModel.getErrors(),
		});
	}
}

// 3. Model: Правила валидации
class FormModel {
	private validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValid = emailRegex.test(email);
		if (!isValid) {
			this.errors.email = 'Некорректный email адрес';
		}
		return isValid;
	}
}

// 4. View: Отображение ошибок
class OrderForm {
	public showFieldError(field: string, error: string): void {
		const errorElement = this.form.querySelector(`[data-error="${field}"]`);
		if (errorElement) {
			errorElement.textContent = error;
			errorElement.classList.add('visible');
		}
	}
}
```

### 3. Открытие модального окна с деталями продукта

Пример показывает работу с модальными окнами:

```typescript
// 1. View: Обработка клика по карточке
class CardPreview extends Card {
	constructor() {
		this.container.addEventListener('click', () => {
			if (!event.target.closest('.button')) {
				this.events.emit('product:select', this.currentProduct);
			}
		});
	}
}

// 2. Presenter: Открытие модального окна
class ProductPresenter extends BasePresenter {
	private handleProductSelect(product: IProduct): void {
		const modal = this.view.renderModal(product);
		this.events.emit('modal:open', { content: modal });
	}
}

// 3. Model: Обновление состояния
class StateService {
	private modal: ModalState | null = null;

	public setModal(modal: ModalState): void {
		this.modal = modal;
		this.events.emit('state:modal:changed', this.modal);
	}
}

// 4. View: Отображение модального окна
class ModalView {
	public open(content: HTMLElement): void {
		this.contentContainer.innerHTML = '';
		this.contentContainer.appendChild(content);
		this.container.classList.add('modal_active');
	}
}
```

Эти примеры демонстрируют:

- Четкое разделение ответственности между слоями MVP
- Событийно-ориентированную коммуникацию
- Однонаправленный поток данных
- Управление состоянием
- Обратную связь для пользователя

---

## Скриншот

![Web Larek Screenshot](./screenshot.png)

Интерфейс приложения демонстрирует:

- Адаптивную галерею продуктов с категориями
- Интерактивную корзину с подсчетом стоимости
- Модальные окна с деталями продуктов
- Форму оформления заказа с валидацией
- Современный и чистый дизайн
