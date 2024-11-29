# Web-Larek Frontend

[Russian](#описание-проекта) | [English](#project-description)

---

## 🇷🇺 Russian Version

## Содержание

- [Описание проекта](#описание-проекта)
- [Обзор архитектуры](#обзор-архитектуры)
- [Архитектурные слои (MVP)](#архитектурные-слои-mvp)
  - [Слой модели](#слой-модели)
  - [Слой представления](#слой-представления)
    - [Базовые классы](#базовые-классы)
    - [Компоненты приложения](#компоненты-приложения)
  - [Система событий и взаимодействие компонентов](#система-событий-и-взаимодействие-компонентов)
  - [Слой презентера](#слой-презентера)
- [Примеры взаимодействия](#примеры-взаимодействия)
- [Подход к разработке](#подход-к-разработке)
- [Установка и запуск](#установка-и-запуск)
- [Техническая документация](#техническая-документация)

## Table of Contents

- [Project Description](#project-description)
- [Architecture Overview](#architecture-overview)
- [Architectural Layers (MVP)](#architectural-layers-mvp)
  - [Model Layer](#model-layer)
  - [View Layer](#view-layer)
    - [Base Classes](#base-classes)
    - [Application Components](#application-components)
  - [Event System and Component Interaction](#event-system-and-component-interaction)
  - [Presenter Layer](#presenter-layer)
- [User Interaction Examples](#user-interaction-examples)
- [Development Approach](#development-approach)
- [Setup and Installation](#setup-and-installation)
- [Technical Reference](#technical-reference)

![UML](https://github.com/user-attachments/assets/2213cf33-47f1-427e-a4c9-887dba1fa891)

# Описание проекта

Интернет-магазин для разработчиков, где можно купить различные товары для программистов. Проект включает каталог товаров, корзину и оформление заказа.

## Обзор архитектуры

Проект построен на основе паттерна Model-View-Presenter (MVP) с событийно-ориентированной архитектурой:

- **Слой Модели**: Управляет состоянием приложения через класс AppState
- **Слой Представления**: Обрабатывает UI компоненты и взаимодействие с пользователем
- **Слой Презентера**: Координирует взаимодействие между Моделью и Представлением (реализован в index.ts)

Ключевые архитектурные решения:

- Событийно-ориентированное взаимодействие между слоями
- Единый источник истины для состояния приложения
- Переиспользуемая система модальных окон для всех всплывающих окон

## Архитектурные слои (MVP)

### Слой модели

#### Класс AppState

Центральный менеджер состояния приложения, отвечающий за:

- Управление каталогом товаров, корзиной и данными заказов
- Координацию изменений состояния во всем приложении
- Генерацию событий при изменении состояния
- Поддержание целостности и валидации данных

Ключевые обязанности:

- Управляет операциями корзины (добавление/удаление товаров)
- Обрабатывает процесс и статус заказов
- Предоставляет доступ к текущему состоянию приложения
- Обеспечивает согласованность данных между компонентами

### Слой представления

#### Базовые классы

##### Класс View

Базовый класс, который:

- Предоставляет основу для всех UI компонентов
- Управляет жизненным циклом компонентов (отрисовка/удаление)
- Обрабатывает базовые операции с DOM
- Стандартизирует инициализацию компонентов

##### Класс Modal

Универсальная система модальных окон, которая:

- Управляет всеми диалоговыми окнами в приложении
- Обрабатывает жизненный цикл модальных окон (открытие/закрытие)
- Обеспечивает единообразное поведение оверлея
- Поддерживает динамическую вставку контента

#### Компоненты приложения

##### Класс ProductCard

Отвечает за:

- Отображение информации о товаре в каталоге
- Обработку взаимодействия с кнопкой "Добавить в корзину"
- Генерацию событий, связанных с корзиной, при выборе товаров
- Управление визуальным состоянием карточки (доступен/недоступен)

Ключевые взаимодействия:

- Реагирует на клики пользователя по кнопке "Добавить в корзину"
- Генерирует события `cart:add` с данными товара
- Обновляет визуальное состояние в зависимости от статуса корзины

##### Класс Cart

Менеджер корзины покупок, отвечающий за:

- Отображение текущего содержимого корзины и общей суммы
- Управление обновлением количества товаров
- Обработку удаления товаров
- Инициацию процесса оформления заказа

Ключевые взаимодействия:

- Обновляет отображение при изменении состояния корзины
- Генерирует события для модификаций корзины
- Управляет расчетами общей стоимости
- Предоставляет точку входа в процесс оформления заказа

##### Класс OrderForm

Обработчик формы заказа, отвечающий за:

- Управление пользовательским вводом данных заказа
- Валидацию данных формы
- Обработку выбора способа оплаты
- Обработку отправки заказа

Ключевые взаимодействия:

- Выполняет валидацию пользовательского ввода в реальном времени
- Генерирует события при отправке формы
- Управляет состоянием формы и отображением ошибок
- Координирует процесс обработки платежа

### Система событий и взаимодействие компонентов

Приложение использует событийно-ориентированную архитектуру для управления коммуникацией между компонентами. Вот конкретный пример потока взаимодействия при добавлении товара в корзину:

1. Пользователь нажимает "Добавить в корзину" на карточке товара
2. Компонент ProductCard генерирует событие `cart:add` с данными товара
3. AppState обрабатывает событие и обновляет данные корзины
4. AppState генерирует событие `cart:changed`
5. Компонент Cart получает событие и обновляет отображение

Пример блок-схемы, иллюстрирующей процесс взаимодействия:

```
Действие пользователя -> Представление -> Событие -> Модель -> Событие -> Обновление представления
(Клик по кнопке) -> (ProductCard) -> (cart:add) -> (AppState) -> (cart:changed) -> (Cart)
```

Основные события, используемые в приложении:

- `cart:add` - добавление товара в корзину
- `cart:remove` - удаление товара из корзины
- `cart:changed` - обновление состояния корзины
- `order:submit` - отправка формы заказа
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна

### Слой презентера

Логика презентера реализована в основном скрипте приложения (`index.ts`). Он:

- Инициализирует все компоненты
- Устанавливает обработчики событий
- Управляет потоком данных между Моделью и Представлением
- Обрабатывает коммуникацию с API

## Примеры взаимодействия с пользователем

### Добавление товара в корзину

1. Пользователь нажимает "Добавить в корзину" на ProductCard
   - Компонент ProductCard генерирует событие `cart:add` с данными товара
2. Презентер получает событие и вызывает AppState.addToCart()
3. AppState обновляет данные корзины и генерирует событие `cart:changed`
4. Презентер получает `cart:changed` и обновляет представление Cart
5. Компонент Cart перерисовывается с новым товаром

### Процесс оформления заказа

1. Пользователь открывает корзину и нажимает "Оформить заказ"
   - Компонент Cart генерирует событие `modal:open` с формой заказа
2. Презентер показывает OrderForm в модальном окне
3. Пользователь заполняет форму и отправляет её
   - OrderForm генерирует событие `order:submit` с данными формы
4. Презентер валидирует и отправляет в AppState
5. AppState обновляет заказ и генерирует событие `order:changed`

## Подход к разработке

### Порядок реализации

1. Модели данных
   - Определение интерфейсов
   - Реализация AppState
   - Добавление генерации событий
2. Компоненты представления
   - Базовый класс View
   - Система модальных окон
   - Компоненты товаров
   - Компоненты корзины и заказа
3. Логика презентера
   - Обработчики событий
   - Интеграция с API
   - Инициализация компонентов

### Стратегия тестирования

- Модульные тесты для AppState
- Интеграционные тесты для потока событий
- E2E тесты для критических пользовательских сценариев

## Установка и запуск

### Шаги установки

1. Клонировать репозиторий:

```bash
git clone <https://github.com/Olliekse/web-larek-frontend>
```

2. Установить зависимости:

```bash
npm install
```

3. Запустить сервер разработки:

```bash
npm run dev
```

4. Создать сборку для продакшена:

```bash
npm run build
```

### Среда разработки

- Проект использует Webpack для сборки
- TypeScript для проверки типов
- SCSS для стилизации

## Техническая документация

<details>
<summary>Показать технические детали</summary>

### Конструкторы и поля классов

#### AppState

Конструктор: `constructor(events: IEvents)`

- Назначение: Инициализация менеджера состояния приложения
- Параметры:
  - `events: IEvents` - Система событий

Поля:

- `_events: IEvents` - Система событий для изменений состояния
- `_products: IProduct[]` - Хранилище каталога продуктов
- `_cart: ICart` - Состояние корзины
- `_order: IOrder` - Данные текущего заказа

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

## 🇬🇧 English Version

## Project Description

An e-commerce website for developers where you can purchase various developer-oriented products. The project includes a product catalog, shopping cart, and checkout process.

## Architecture Overview

This project follows the Model-View-Presenter (MVP) pattern with an event-driven architecture:

- **Model Layer**: Manages application state through AppState class
- **View Layer**: Handles UI components and user interactions
- **Presenter Layer**: Coordinates between Model and View (implemented in index.ts)

Key architectural decisions:

- Event-driven communication between layers
- Single source of truth for application state
- Reusable modal system for all popups

## Architectural Layers (MVP)

### Model Layer

#### AppState Class

Central application state manager responsible for:

- Managing the product catalog, cart, and order data
- Coordinating state changes across the application
- Emitting events when application state changes
- Maintaining data integrity and validation

Key responsibilities:

- Manages shopping cart operations (add/remove items)
- Handles order processing and status
- Provides access to current application state
- Ensures data consistency across components

### View Layer

#### Base Classes

##### View Class

Core base class that:

- Provides foundation for all UI components
- Manages component lifecycle (render/destroy)
- Handles basic DOM operations
- Standardizes component initialization

##### Modal Class

Universal modal window system that:

- Manages all popup dialogs in the application
- Handles modal lifecycle (open/close)
- Provides consistent overlay behavior
- Supports dynamic content injection

#### Application Components

##### ProductCard Class

Responsible for:

- Displaying individual product information in the catalog
- Handling "Add to Cart" user interactions
- Emitting cart-related events when products are selected
- Managing product card visual states (available/unavailable)

Key interactions:

- Responds to user clicks on "Add to Cart"
- Emits `cart:add` events with product data
- Updates visual state based on cart status

##### Cart Class

Shopping cart manager responsible for:

- Displaying current cart contents and total
- Managing item quantity updates
- Handling item removal
- Initiating checkout process

Key interactions:

- Updates display when cart state changes
- Emits events for cart modifications
- Manages cart total calculations
- Provides checkout flow entry point

##### OrderForm Class

Checkout form handler responsible for:

- Managing user input for order details
- Validating form data
- Handling payment method selection
- Processing order submission

Key interactions:

- Validates user inputs in real-time
- Emits events for form submission
- Manages form state and error display
- Coordinates with payment processing

### Event System and Component Interaction

The application uses an event-driven architecture to manage communication between components. Here's a concrete example of the interaction flow when adding an item to the cart:

1. User clicks "Add to Cart" on a product card
2. ProductCard component emits `cart:add` event with product data
3. AppState processes the event and updates cart data
4. AppState emits `cart:changed` event
5. Cart component receives the event and updates its display

Example flow diagram illustrating the interaction process:

```
User Action -> View -> Event -> Model -> Event -> View Update
(Click Button) -> (ProductCard) -> (cart:add) -> (AppState) -> (cart:changed) -> (Cart)
```

Main events used in the application:

- `cart:add` - add item to cart
- `cart:remove` - remove item from cart
- `cart:changed` - cart state updated
- `order:submit` - submit order form
- `modal:open` - open modal window
- `modal:close` - close modal window

### Presenter Layer

The presenter logic is implemented in the main application script (`index.ts`). It:

- Initializes all components
- Sets up event listeners
- Manages data flow between Model and View
- Handles API communication

## User Interaction Examples

### Adding Item to Cart

1. User clicks "Add to Cart" on ProductCard
   - ProductCard component emits `cart:add` with product data
2. Presenter receives event and calls AppState.addToCart()
3. AppState updates cart data and emits `cart:changed`
4. Presenter receives `cart:changed` and updates Cart view
5. Cart component re-renders with new item

### Checkout Process

1. User opens cart and clicks "Checkout"
   - Cart component emits `modal:open` with order form
2. Presenter shows OrderForm in modal
3. User completes form and submits
   - OrderForm emits `order:submit` with form data
4. Presenter validates and sends to AppState
5. AppState updates order and emits `order:changed`

## Development Approach

### Implementation Order

1. Data Models
   - Define interfaces
   - Implement AppState
   - Add event emissions
2. View Components
   - Base View class
   - Modal system
   - Product components
   - Cart and Order components
3. Presenter Logic
   - Event listeners
   - API integration
   - Component initialization

### Testing Strategy

- Unit tests for AppState
- Integration tests for event flow
- E2E tests for critical user paths

## Setup and Installation

### Installation Steps

1. Clone repository:

```bash
git clone <https://github.com/Olliekse/web-larek-frontend>
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

### Development Environment

- Project uses Webpack for bundling
- TypeScript for type checking
- SCSS for styling

## Technical Reference

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

- `_container: HTMLElement` - Component's root element
- `_template: HTMLTemplateElement` - Component's HTML template

#### Modal

Constructor: `constructor(container: HTMLElement, events: IEvents)`

- Purpose: Creates modal window manager
- Parameters:
  - `container: HTMLElement` - Modal container
  - `events: IEvents` - Event system

Fields:

- `_closeButton: HTMLElement` - Modal close button
- `_content: HTMLElement` - Modal content container

#### ProductCard

Constructor: `constructor(container: HTMLElement, events: IEvents)`

- Purpose: Creates product display card
- Parameters:
  - `container: HTMLElement` - Card container
  - `events: IEvents` - Event system

Fields:

- `_data: IProduct` - Product information
- `_button: HTMLButtonElement` - Add to cart button

</details>
