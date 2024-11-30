# Web-Larek Frontend

[Russian](#описание-проекта) | [English](#project-description)

-------------------
🇷🇺 Russian Version
-------------------

## Содержание

- [Описание проекта](#описание-проекта)
- [Возможности и реализация](#возможности-и-реализация)
- [Архитектура (MVP)](#архитектура-mvp)
- [Компоненты](#компоненты)
- [Система событий](#система-событий)
- [Установка и разработка](#установка-и-разработка)
- [Технические детали](#технические-детали)

## Описание проекта

Это мой учебный проект - магазин мерча для разработчиков. Здесь можно тратить "синапсы" (виртуальная валюта) на забавные айтемы для разработчиков. В процессе работы над ним я освоил TypeScript и архитектуру MVP, научился делать отзывчивую галерею, работать с корзиной и валидацией форм.

### Почему MVP?
Этот паттерн помог мне:
- Держать код организованным по мере роста проекта
- Упростить тестирование (особенно логики корзины)
- Разобраться с разделением ответственности в приложении

## Возможности и реализация

### Основные функции
- Галерея товаров с категориями (софт-скилы, другое)
- Корзина с подсчётом синапсов в реальном времени
- Система модальных окон для деталей товара и форм
- Двухэтапный процесс оформления заказа

### UI Компоненты
Самые интересные части для меня:
- `card-catalog`: Карточки товаров в галерее (с анимацией при наведении!)
- `card-preview`: Модальное окно с деталями товара
- `card-basket`: Корзина с возможностью удаления товаров
- Формы заказа с валидацией (мой первый опыт с TypeScript и формами)

## Архитектура (MVP)

Разделил проект на три основные части:

### Model (AppState)
Мозг приложения:
- Хранит каталог товаров
- Следит за состоянием корзины
- Обрабатывает заказы
- Сообщает об изменениях через события

### View
Всё, что видит пользователь:
- Карточки товаров в галерее
- Корзина с обновляемой суммой
- Модальные окна для деталей и форм
- Формы оформления заказа

### Presenter (index.ts)
Связующее звено:
- Инициализирует компоненты
- Обрабатывает события
- Обновляет UI

## Система событий

### Как это работает
Пример добавления товара в корзину:
1. Клик по кнопке "В корзину"
2. Компонент отправляет событие `cart:add`
3. AppState обновляет корзину
4. Счётчик в шапке обновляется
5. Пересчитывается общая сумма

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

-------------------
🌐 English Version
-------------------

## Table of Contents

- [Project Description](#project-description)
- [Features & Implementation](#features--implementation)
- [Architecture (MVP)](#architecture-mvp)
- [Components](#components)
- [Event System](#event-system)
- [Setup & Development](#setup--development)
- [Technical Details](#technical-details)

## Project Description

Hi! This is my implementation of a dev-themed merch store project. I built it while learning TypeScript and exploring clean architecture patterns. It's a fun little shop where developers can spend virtual "synapses" on things like "Backend Anti-stress" and "BEM Pills" 😄

### Why MVP?
I chose MVP pattern because it helped me:
- Keep the code organised as features grew
- Make testing easier (especially the cart logic)
- Learn proper separation of concerns

## Features & Implementation

### Core Features
- Product gallery with categories (soft-skills, other)
- Real-time cart with synapse total
- Modal system for product details and forms
- Two-step checkout process

### UI Components
The fun parts I built:
- `card-catalog`: Product cards in the gallery (with hover animations!)
- `card-preview`: Modal window for product details
- `card-basket`: Cart with remove functionality
- Order forms with validation (my first TypeScript forms experience)

## Architecture (MVP)

Split the project into three main parts:

### Model (AppState)
The brains of the operation:
- Keeps track of all products
- Manages what's in your cart
- Handles order processing
- Tells everyone when something changes

### View
All the stuff you see:
- Product cards in the gallery
- The cart with its running total
- Popups for product details and checkout
- Forms for placing orders

### Presenter (index.ts)
The connector that:
- Sets everything up
- Handles all the events
- Updates the UI when needed

## Event System

### How It Works
When adding something to cart:
1. Click "Add to Cart" on a card
2. Component sends `cart:add` event
3. AppState updates the cart
4. Header counter updates
5. Cart recalculates total

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
