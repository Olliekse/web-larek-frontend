# Web-Larek Frontend

[Russian](#описание-проекта) | [English](#project-description)

![UML diagram](https://github.com/user-attachments/assets/fba8dce7-9d44-4534-abe4-b47d55721fbc)

# Project Description
An e-commerce website for developers where you can purchase various developer-oriented products. The project includes a product catalog, shopping cart, and checkout process.

## Data Description

### Data Interfaces

#### Product

```
interface IProduct {
id: string; // Product ID
title: string; // Product name
description: string; // Product description
image: string; // Image URL
category: string; // Category: "soft-skill" | "hard-skill" | "other" | "additional"
price: number; // Price in synapses
}
```

#### Cart

```
interface ICartItem extends IProduct {
listNum: number; // Numeral position in cart
}

interface ICart {
items: ICartItem[]; // Cart items
total: number; // Total cost
}
```

#### Order

```
interface IOrder {
payment: 'online' | 'cash'; // Payment method
email: string; // Customer email
phone: string; // Customer phone
address: string; // Delivery address
total: number; // Order total
items: string[]; // Array of product IDs
}
```


## Data Models

### AppState
Central application state storage.
- Stores:
  - Product catalog
  - Cart state
  - Current order
- Methods:
  - `addToCart(item: IProduct): void`
  - `removeFromCart(itemId: string): void`
  - `setOrder(order: IOrder): void`
  - `clearCart(): void`

## View Components

### Base Components

#### View
Base class for all display components.
- Responsibilities:
  - Render UI elements
  - Handle basic UI interactions
  - Emit UI-related events

```
interface IView {
render(): void; // Render component
destroy(): void; // Clear markup
}
```

#### Modal
Base class for modal windows.

```
interface IModal {
open(): void; // Open modal window
close(): void; // Close modal window
}
```


### Application Components

#### ProductCard
Product card in catalog.
- Displays:
  - Product image
  - Title
  - Price
- Events:
  - Click opens detailed view

#### Cart
Shopping cart modal window.
- Displays:
  - List of selected products
  - Total cost
  - Checkout button
- Events:
  - Remove product
  - Proceed to checkout

#### OrderForm
Two-step checkout form.
- Step 1:
  - Payment method selection
  - Address input
- Step 2:
  - Email input
  - Phone input

## Architecture Overview

This project follows the Model-View-Presenter (MVP) architecture pattern:

- **Model**: Represented by `AppState`, handles data and business logic.
- **View**: Components like `ProductCard`, `Cart`, and `OrderForm` that render the UI.
- **Presenter**: Manages the communication between Model and View, implemented in `index.ts`.

Here's a high-level diagram of the component relationships:

```
       +-------------+
       |   AppState  |
       | (Data Model)|
       +-------------+
              ^
              |
              v
     +------------------+
     |     Presenter    |
     | (in index.ts)    |
     +------------------+
         ^          ^
         |          |
         v          v
+-------------+ +-----------+
|    View     | |   Modal   |
| Components  | | Components|
+-------------+ +-----------+
```

## Event System

### EventEmitter
Enables communication between components.

```
interface IEvents {
on<T>(event: string, handler: (data: T) => void): void;
emit<T>(event: string, data: T): void;
off(event: string, handler: Function): void;
}
```

### Application Events

```
enum EventType {
// Products
ProductSelected = 'product:selected',
AddToCart = 'cart:add',
RemoveFromCart = 'cart:remove',
// Cart
CartOpen = 'cart:open',
CartClose = 'cart:close',
// Order
OrderSubmit = 'order:submit',
OrderSuccess = 'order:success',
}
```
### Component Interaction Flow

1. User interacts with a View component (e.g., clicks "Add to Cart").
2. View emits an event (e.g., `AddToCart`).
3. Presenter (in `index.ts`) listens for this event.
4. Presenter updates the Model (`AppState`).
5. Model emits a change event.
6. Presenter listens for Model changes and updates relevant Views.

Example flow:
```
User Click -> ProductCard -> AddToCart event -> Presenter -> AppState -> 
Model Change event -> Presenter -> Update Cart View
```

## API Integration
Base URL: `https://larek-api.nomoreparties.co/api`

### API Methods
1. Get product list
   ```typescript
   GET /products
   Response: IProduct[]
   ```

2. Submit order
   ```typescript
   POST /order
   Body: IOrder
   Response: { id: string; total: number; }
   ```

## Installation and Launch
1. Clone repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

### Development Environment
- This project uses Webpack for bundling. Configuration can be found in `webpack.config.js`.
- TypeScript is used for type-checking. Configuration is in `tsconfig.json`.
- Styling is done with SCSS, compiled to CSS during the build process.

# Web-Larek Frontend

## Описание проекта
Интернет-магазин для разработчиков, где можно купить различные товары для программистов. Проект включает каталог товаров, корзину и оформление заказа.

## Описание данных

### Интерфейсы данных

#### Товар

```
interface IProduct {
id: string; // ID товара
title: string; // Название товара
description: string; // Описание товара
image: string; // Ссылка на изображение
category: string; // Категория: "софт-скил" | "хард-скил" | "другое" | "дополнительное"
price: number; // Цена в синапсах
}
```


#### Корзина

```
interface ICartItem extends IProduct {
listNum: number; // Номер позиции товара в корзине товара в корзине
}

interface ICart {
items: ICartItem[]; // Товары в корзине
total: number; // Общая стоимость
}
```


#### Заказ

```
interface IOrder {
payment: 'онлайн' | 'при получении'; // Способ оплаты
email: string; // Email покупателя
phone: string; // Телефон покупателя
address: string; // Адрес доставки
total: number; // Сумма заказа
items: string[]; // Массив ID товаров
}
```


## Модели данных

### AppState
Центральное хранилище состояния приложения.
- Хранит:
  - Каталог товаров
  - Состояние корзины
  - Текущий заказ
- Методы:
  - `addToCart(item: IProduct): void`
  - `removeFromCart(itemId: string): void`
  - `setOrder(order: IOrder): void`
  - `clearCart(): void`

## Компоненты представления

### Базовые компоненты

#### View
Базовый класс для всех компонентов отображения.

```
interface IView {
render(): void; // Отрисовка компонента
destroy(): void; // Очистка разметки
}
```


#### Modal
Базовый класс для модальных окон.

```
interface IModal extends IView {
open(): void; // Открытие модального окна
close(): void; // Закрытие модального окна
}
```

### Компоненты приложения

#### ProductCard
Карточка товара в каталоге.
- Отображает:
  - Изображение товара
  - Название
  - Цену
- События:
  - Клик по карточке открывает детальное представление

#### Cart
Модальное окно корзины.
- Отображает:
  - Список выбранных товаров
  - Общую стоимость
  - Кнопку оформления заказа
- События:
  - Удаление товара
  - Переход к оформлению

#### OrderForm
Форма оформления заказа (два шага).
- Шаг 1:
  - Выбор способа оплаты
  - Ввод адреса
- Шаг 2:
  - Ввод email
  - Ввод телефона

## Обзор архитектуры

Этот проект следует архитектурному паттерну Model-View-Presenter (MVP):

- **Модель**: Представлена классом `AppState`, обрабатывает данные и бизнес-логику.
- **Представление**: Компоненты, такие как `ProductCard`, `Cart` и `OrderForm`, которые отображают пользовательский интерфейс.
- **Презентер**: Управляет коммуникацией между Моделью и Представлением, реализован в `index.ts`.

Вот схема высокого уровня отношений между компонентами:

```
       +-------------+
       |   AppState  |
       | (Модель)    |
       +-------------+
              ^
              |
              v
     +------------------+
     |     Презентер    |
     |   (в index.ts)   |
     +------------------+
         ^          ^
         |          |
         v          v
+-------------+ +-----------+
| Компоненты  | | Модальные |
|Представления| | Окна      |
+-------------+ +-----------+
```

## Система событий

### EventEmitter
Обеспечивает коммуникацию между компонентами.

```
interface IEvents {
on<T>(event: string, handler: (data: T) => void): void;
emit<T>(event: string, data: T): void;
off(event: string, handler: Function): void;
}
```

### События приложения

```
enum EventType {
// Товары
ProductSelected = 'product:selected',
AddToCart = 'cart:add',
RemoveFromCart = 'cart:remove',
// Корзина
CartOpen = 'cart:open',
CartClose = 'cart:close',
// Заказ
OrderSubmit = 'order:submit',
OrderSuccess = 'order:success',
}
```
### Поток взаимодействия компонентов

1. Пользователь взаимодействует с компонентом Представления (например, нажимает "Добавить в корзину").
2. Представление генерирует событие (например, `AddToCart`).
3. Презентер (в `index.ts`) слушает это событие.
4. Презентер обновляет Модель (`AppState`).
5. Модель генерирует событие об изменении.
6. Презентер слушает изменения Модели и обновляет соответствующие Представления.

Пример потока:
```
Клик пользователя -> ProductCard -> событие AddToCart -> Презентер -> AppState -> 
событие изменения Модели -> Презентер -> Обновление представления корзины
```

## API Интеграция
Базовый URL: `https://larek-api.nomoreparties.co/api`

### Методы API
1. Получение списка товаров
   ```typescript
   GET /products
   Response: IProduct[]
   ```

2. Оформление заказа
   ```typescript
   POST /order
   Body: IOrder
   Response: { id: string; total: number; }
   ```

## Установка и запуск
1. Клонировать репозиторий
2. Установить зависимости: `npm install`
3. Запустить сервер разработки: `npm run dev`
4. Собрать для продакшена: `npm run build`

### Среда разработки
- Этот проект использует Webpack для сборки. Конфигурация находится в `webpack.config.js`.
- TypeScript используется для проверки типов. Конфигурация в `tsconfig.json`.
- Стили написаны на SCSS и компилируются в CSS во время сборки.
