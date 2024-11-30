# Web-Larek Frontend

[Russian](#russian-version) | [English](#english-version)

![UML scheme](https://github.com/user-attachments/assets/666b481e-5504-4acb-99e9-5cbf813982f2)


---

## 🇷🇺 Russian Version

## Содержание

- [Описание проекта](#описание-проекта)
- [Архитектура приложения](#архитектура-приложения)
- [Возможности и реализация](#возможности-и-реализация)
- [Компоненты](#компоненты)
- [Система событий](#система-событий)
- [Установка и разработка](#установка-и-разработка)
- [Технические детали](#технические-детали)

## Описание проекта

Это мой учебный проект - магазин мерча для разработчиков. Здесь можно тратить "синапсы" (виртуальная валюта) на забавные айтемы для разработчиков. В процессе работы над ним я освоил TypeScript и архитектуру MVP, научился делать отзывчивую галерею, работать с корзиной и валидацией форм.

## Архитектура приложения

### Почему MVP и события?

В этом проекте я использую паттерн MVP (Model-View-Presenter) и событийно-ориентированный подход, потому что:

- Разделение ответственности упрощает отладку
- События помогают избежать сильной связанности кода
- Легче добавлять новые функции (например, новые виды карточек)

### Пример взаимодействия: добавление товара в корзину

1. **Действие пользователя → View**

   - Пользователь нажимает "В корзину" на ProductCard
   - ProductCard генерирует событие `cart:add` с данными товара
   - `card.emit('cart:add', { id: productId })`

2. **Обработка в Presenter (index.ts)**

   - Презентер ловит событие
   - Вызывает метод модели: `appState.addToCart(product)`

3. **Обновление в Model (AppState)**

   - AppState добавляет товар в массив `_cart`
   - Генерирует событие `cart:changed`
   - `this.events.emit('cart:changed', this._cart)`

4. **Обновление View**
   - Презентер получает новые данные из модели
   - Обновляет CartView: `cartView.render(appState.getCart())`
   - Обновляет счетчик в шапке: `headerView.updateCounter()`

### Другие примеры взаимодействий

#### Открытие карточки товара

1. Клик по карточке → `card:select`
2. Презентер получает данные товара
3. Открывает модальное окно с детальной информацией

#### Оформление заказа

1. Клик по кнопке заказа → `order:submit`
2. Валидация формы
3. Отправка данных на сервер
4. Очистка корзины при успехе

## Возможности и реализация

### Основные функции

- Галерея товаров с категориями (софт-скилы, другое)
- Корзина с подсчётом синапсов в реальном времени
- Система модальных окон для деталей товара и форм
- Двухэтапный процесс оформления заказа

### Компоненты

Самые интересные части для меня:

- `card-catalog`: Карточки товаров в галерее (с анимацией при наведении!)
- `card-preview`: Модальное окно с деталями товара
- `card-basket`: Корзина с возможностью удаления товаров
- Формы заказа с валидацией (мой первый опыт с TypeScript и формами)

## Система событий

### Основные события

- `cart:add` - добавление в корзину
- `cart:remove` - удаление из корзины
- `cart:changed` - обновление корзины
- `order:submit` - отправка заказа
- `modal:open` - открытие окна
- `modal:close` - закрытие окна

## Установка и разработка

### Установка проекта

1. Клонируем репозиторий:

```bash
git clone https://github.com/Olliekse/web-larek-frontend
```

2. Устанавливаем зависимости:

```bash
npm install
```

3. Запускаем проект:

```bash
npm run dev
```

4. Собираем для продакшена:

```bash
npm run build
```

### Окружение разработки

Использовал современный стек:

- Webpack (сборка)
- TypeScript (типизация)
- SCSS (стили)

## Технические детали

<details>
<summary>Подробная техническая информация</summary>

### Конструкторы и поля классов

#### AppState

Конструктор: `constructor(events: IEvents)`

- Назначение: Инициализация менеджера состояния приложения
- Параметры:
  - `events: IEvents` - Система событий

Поля:

- `_events: IEvents` - Система обработки событий
- `_products: IProduct[]` - Хранилище каталога товаров
- `_cart: ICart` - Состояние корзины
- `_order: IOrder` - Данные заказа

#### View

Конструктор: `constructor(container: HTMLElement)`

- Назначение: Создание базового компонента представления
- Параметры:
  - `container: HTMLElement` - Корневой DOM элемент

Поля:

- `_container: HTMLElement` - Корневой элемент компонента
- `_template: HTMLTemplateElement` - HTML шаблон компонента

#### Modal

Конструктор: `constructor(container: HTMLElement, events: IEvents)`

- Назначение: Создание менеджера модальных окон
- Параметры:
  - `container: HTMLElement` - Контейнер модального окна
  - `events: IEvents` - Система событий

Поля:

- `_closeButton: HTMLElement` - Кнопка закрытия окна
- `_content: HTMLElement` - Контейнер содержимого окна

#### ProductCard

Конструктор: `constructor(container: HTMLElement, events: IEvents)`

- Назначение: Создание карточки товара
- Параметры:
  - `container: HTMLElement` - Контейнер карточки
  - `events: IEvents` - Система событий

Поля:

- `_data: IProduct` - Информация о товаре
- `_button: HTMLButtonElement` - Кнопка добавления в корзину

</details>

---

## 🌐 English Version

## Table of Contents

- [Project Description](#project-description)
- [Application Architecture](#application-architecture)
- [Features & Implementation](#features--implementation)
- [Components](#components)
- [Event System](#event-system)
- [Setup & Development](#setup--development)
- [Technical Details](#technical-details)

## Project Description

This is my learning project - a merch store for developers. Users can spend "synapses" (virtual currency) on fun dev-themed items. While building this, I learned TypeScript and MVP architecture, implemented a responsive gallery, and worked with cart functionality and form validation.

## Application Architecture

### Why MVP and Events?

In this project, I'm using the MVP (Model-View-Presenter) pattern and event-driven approach because:

- Separation of concerns makes debugging easier
- Events help avoid tight coupling
- It's easier to add new features (like new card types)

### Interaction Example: Adding to Cart

1. **User Action → View**

   - User clicks "Add to Cart" on ProductCard
   - ProductCard generates `cart:add` event with product data
   - `card.emit('cart:add', { id: productId })`

2. **Handling in Presenter (index.ts)**

   - Presenter catches the event
   - Calls model method: `appState.addToCart(product)`

3. **Update in Model (AppState)**

   - AppState adds product to `_cart` array
   - Generates `cart:changed` event
   - `this.events.emit('cart:changed', this._cart)`

4. **View Update**
   - Presenter gets new data from model
   - Updates CartView: `cartView.render(appState.getCart())`
   - Updates header counter: `headerView.updateCounter()`

### Other Interaction Examples

#### Opening Product Details

1. Click on card → `card:select`
2. Presenter fetches product data
3. Opens modal with detailed information

#### Checkout Process

1. Click checkout button → `order:submit`
2. Form validation
3. Send data to server
4. Clear cart on success

## Features & Implementation

### Core Features

- Product gallery with categories (soft-skills, other)
- Real-time cart with synapse total
- Modal system for product details and forms
- Two-step checkout process

### Components

The fun parts I built:

- `card-catalog`: Product cards in the gallery (with hover animations!)
- `card-preview`: Modal window for product details
- `card-basket`: Cart with remove functionality
- Order forms with validation (my first TypeScript forms experience)

## Event System

### Core Events

- `cart:add` - add to cart
- `cart:remove` - remove from cart
- `cart:changed` - cart updated
- `order:submit` - submit order
- `modal:open` - open window
- `modal:close` - close window

## Setup & Development

### Installation Steps

1. Clone the repo:

```bash
git clone https://github.com/Olliekse/web-larek-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

### Development Environment

Used modern tools:

- Webpack for bundling
- TypeScript for type safety
- SCSS for styling

## Technical Details

<details>
<summary>View Technical Details</summary>

### Class Constructors and Fields

#### AppState

Constructor: `constructor(events: IEvents)`

- Purpose: Initializes application state manager
- Parameters:
  - `events: IEvents` - Event emission system

Fields:

- `_events: IEvents` - Event system for state changes
- `_products: IProduct[]` - Product catalog storage
- `_cart: ICart` - Shopping cart state
- `_order: IOrder` - Current order data

#### View

Constructor: `constructor(container: HTMLElement)`

- Purpose: Creates base view component
- Parameters:
  - `container: HTMLElement` - Root DOM element

Fields:

- `_container: HTMLElement` - Root element of component
- `_template: HTMLTemplateElement` - HTML template for component

#### Modal

Constructor: `constructor(container: HTMLElement, events: IEvents)`

- Purpose: Creates modal window manager
- Parameters:
  - `container: HTMLElement` - Modal container
  - `events: IEvents` - Event system

Fields:

- `_closeButton: HTMLElement` - Close button
- `_content: HTMLElement` - Content container

#### ProductCard

Constructor: `constructor(container: HTMLElement, events: IEvents)`

- Purpose: Creates product card
- Parameters:
  - `container: HTMLElement` - Card container
  - `events: IEvents` - Event system

Fields:

- `_data: IProduct` - Product information
- `_button: HTMLButtonElement` - Add to cart button

</details>
