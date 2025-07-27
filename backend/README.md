# TechNest API Documentation

This document outlines the API endpoints for the TechNest backend, built with NestJS.

## Table of Contents

- [Authentication](#authentication)
- [Products](#products)
- [Users](#users)
- [Categories](#categories)
- [Inventory](#inventory)
- [Cart](#cart)
- [Cart Items](#cart-items)
- [Orders](#orders)
- [Order Items](#order-items)
- [Transaction Logs](#transaction-logs)
- [Currencies](#currencies)
- [App Controller](#app-controller)

---

## Authentication

Handles user registration and login.

### `POST /auth/register`

- **Description:** Registers a new user.
- **Request Body:** `CreateUserDto`
  ```json
  {
    "username": "newuser",
    "email": "new@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "address": "123 Main St",
    "phone_number": "123-456-7890"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "user_id": 1,
    "username": "newuser",
    "email": "new@example.com",
    "role": "customer"
  }
  ```

### `POST /auth/login`

- **Description:** Authenticates a user and returns a JSON Web Token (JWT).
- **Request Body:**
  ```json
  {
    "email": "new@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### `GET /auth/profile`

- **Description:** Gets the profile of the currently authenticated user.
- **Authentication:** JWT Required.
- **Success Response (200):**
  ```json
  {
    "user_id": 1,
    "username": "newuser",
    "email": "new@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "address": "123 Main St",
    "phone_number": "123-456-7890",
    "role": "customer"
  }
  ```

---

## Products

Handles browsing and management of products.

### `POST /products`

- **Description:** Creates a new product.
- **Authentication:** Admin/Staff role required.
- **Request Body:** `CreateProductDto`
  ```json
  {
    "name": "New Gaming Mouse",
    "description": "A very fast mouse.",
    "price": 89.99,
    "category_id": 2,
    "brand": "GamerGear",
    "image_url": "/images/mouse.jpg"
  }
  ```
- **Success Response (201):** Returns the newly created product object.

### `GET /products`

- **Description:** Gets a paginated, filterable list of products.
- **Query Parameters:**
  - `search` (string): Search term to match against product names and descriptions.
  - `category` (string): Filter by category name.
  - `brand` (string): Filter by brand name.
  - `minPrice` (number): Minimum price.
  - `maxPrice` (number): Maximum price.
  - `sortBy` (string): Field to sort by (e.g., `price`, `name`). Defaults to `name`.
  - `order` (string): Sort order (`asc` or `desc`). Defaults to `asc`.
  - `page` (number): Page number for pagination. Defaults to `1`.
  - `limit` (number): Number of items per page. Defaults to `20`.
- **Success Response (200):**
  ```json
  [
    {
      "product_id": 1,
      "name": "Wireless Earbuds",
      "price": "79.99",
      "image_url": "/images/earbuds.jpg",
      "brand": "TechBrand",
      "category_name": "Audio"
    }
  ]
  ```

### `GET /products/:id`

- **Description:** Gets detailed information for a single product.
- **Success Response (200):**
  ```json
  {
    "product_id": 1,
    "name": "Wireless Earbuds",
    "description": "High-fidelity wireless earbuds.",
    "price": "79.99",
    "stock_quantity": 150,
    "category_name": "Audio",
    "brand": "TechBrand",
    "image_url": "/images/earbuds.jpg"
  }
  ```

### `PATCH /products/:id`

- **Description:** Updates an existing product.
- **Authentication:** Admin/Staff role required.
- **Request Body:** `UpdateProductDto` (Partial product object).
- **Success Response (200):** Returns the updated product object.

### `DELETE /products/:id`

- **Description:** Deletes a product.
- **Authentication:** Admin role required.
- **Success Response (204):** No content.

---

## Users

Manages user accounts.

### `POST /users`

- **Description:** Creates a new user.
- **Request Body:** `CreateUserDto`
  ```json
  {
    "username": "newuser",
    "email": "new@example.com",
    "password_hash": "hashedpassword123",
    "first_name": "John",
    "last_name": "Doe",
    "address": "123 Main St",
    "phone_number": "123-456-7890",
    "role": "customer"
  }
  ```
- **Success Response (201):** Returns the newly created user object.

### `GET /users`

- **Description:** Gets a list of all users.
- **Authentication:** Admin role required.
- **Success Response (200):** Returns an array of user objects.

### `GET /users/:id`

- **Description:** Gets detailed information for a single user.
- **Authentication:** Admin role required.
- **Success Response (200):** Returns a user object.

### `PATCH /users/:id`

- **Description:** Updates an existing user.
- **Authentication:** Admin role required.
- **Request Body:** `UpdateUserDto` (Partial user object).
- **Success Response (200):** Returns the updated user object.

### `DELETE /users/:id`

- **Description:** Deletes a user.
- **Authentication:** Admin role required.
- **Success Response (204):** No content.

---

## Categories

Manages product categories.

### `POST /categories`

- **Description:** Creates a new category.
- **Authentication:** Admin/Staff role required.
- **Request Body:** `CreateCategoryDto`
  ```json
  {
    "name": "New Category",
    "description": "Description for new category"
  }
  ```
- **Success Response (201):** Returns the newly created category object.

### `GET /categories`

- **Description:** Gets a list of all categories.
- **Success Response (200):** Returns an array of category objects.

### `GET /categories/:id`

- **Description:** Gets detailed information for a single category.
- **Success Response (200):** Returns a category object.

### `PATCH /categories/:id`

- **Description:** Updates an existing category.
- **Authentication:** Admin/Staff role required.
- **Request Body:** `UpdateCategoryDto` (Partial category object).
- **Success Response (200):** Returns the updated category object.

### `DELETE /categories/:id`

- **Description:** Deletes a category.
- **Authentication:** Admin role required.
- **Success Response (204):** No content.

---

## Inventory

Manages product inventory.

### `POST /inventory`

- **Description:** Creates a new inventory record.
- **Authentication:** Admin/Staff role required.
- **Request Body:** `CreateInventoryDto`
  ```json
  {
    "product_id": 1,
    "stock_quantity": 100
  }
  ```
- **Success Response (201):** Returns the newly created inventory object.

### `GET /inventory`

- **Description:** Gets a list of all inventory records.
- **Authentication:** Admin/Staff role required.
- **Success Response (200):** Returns an array of inventory objects.

### `GET /inventory/:id`

- **Description:** Gets detailed information for a single inventory record.
- **Authentication:** Admin/Staff role required.
- **Success Response (200):** Returns an inventory object.

### `PATCH /inventory/:id`

- **Description:** Updates an existing inventory record.
- **Authentication:** Admin/Staff role required.
- **Request Body:** `UpdateInventoryDto` (Partial inventory object).
- **Success Response (200):** Returns the updated inventory object.

### `DELETE /inventory/:id`

- **Description:** Deletes an inventory record.
- **Authentication:** Admin role required.
- **Success Response (204):** No content.

---

## Cart

Manages the user's shopping cart.

### `POST /cart`

- **Description:** Creates a new cart for a user.
- **Authentication:** JWT Required.
- **Request Body:** `CreateCartDto`
  ```json
  {
    "user_id": 1
  }
  ```
- **Success Response (201):** Returns the newly created cart object.

### `GET /cart`

- **Description:** Retrieves the current user's cart.
- **Authentication:** JWT Required.
- **Success Response (200):**
  ```json
  {
    "cart_id": 1,
    "items": [
      {
        "cart_item_id": 1,
        "product_id": 1,
        "quantity": 2,
        "name": "Wireless Earbuds",
        "price": "79.99"
      }
    ]
  }
  ```

### `GET /cart/:id`

- **Description:** Gets detailed information for a single cart.
- **Authentication:** JWT Required (user must own the cart or be Admin/Staff).
- **Success Response (200):** Returns a cart object.

### `PATCH /cart/:id`

- **Description:** Updates an existing cart.
- **Authentication:** JWT Required (user must own the cart or be Admin/Staff).
- **Request Body:** `UpdateCartDto` (Partial cart object).
- **Success Response (200):** Returns the updated cart object.

### `DELETE /cart/:id`

- **Description:** Deletes a cart.
- **Authentication:** Admin role required.
- **Success Response (204):** No content.

---

## Cart Items

Manages items within a user's shopping cart.

### `POST /cart-items`

- **Description:** Adds an item to the cart or updates its quantity.
- **Authentication:** JWT Required.
- **Request Body:** `CreateCartItemDto`
  ```json
  {
    "cart_id": 1,
    "product_id": 2,
    "quantity": 1
  }
  ```
- **Success Response (201):** Returns the newly created cart item object.

### `GET /cart-items`

- **Description:** Gets a list of all cart items.
- **Authentication:** Admin role required.
- **Success Response (200):** Returns an array of cart item objects.

### `GET /cart-items/:id`

- **Description:** Gets detailed information for a single cart item.
- **Authentication:** JWT Required (user must own the cart item or be Admin/Staff).
- **Success Response (200):** Returns a cart item object.

### `PATCH /cart-items/:id`

- **Description:** Updates an existing cart item.
- **Authentication:** JWT Required (user must own the cart item or be Admin/Staff).
- **Request Body:** `UpdateCartItemDto` (Partial cart item object).
- **Success Response (200):** Returns the updated cart item object.

### `DELETE /cart-items/:id`

- **Description:** Removes an item from the cart.
- **Authentication:** JWT Required (user must own the cart item or be Admin/Staff).
- **Success Response (204):** No content.

---

## Orders

Handles order creation and history.

### `POST /orders`

- **Description:** Creates a new order from the user's cart.
- **Authentication:** JWT Required.
- **Request Body:** `CreateOrderDto`
  ```json
  {
    "shipping_address": "123 Customer Lane"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "new_order_id": 101
  }
  ```

### `GET /orders`

- **Description:** Gets a user's order history. Admins/Staff can view all orders and filter.
- **Authentication:** JWT Required.
- **Query (Admin/Staff):** `?status=pending`
- **Success Response (200):**
  ```json
  [
    {
      "order_id": 101,
      "order_date": "2025-07-22T10:00:00.000Z",
      "total_amount": "169.98",
      "status": "pending"
    }
  ]
  ```

### `GET /orders/:id`

- **Description:** Gets details for a single order.
- **Authentication:** JWT Required (user must own the order or be Admin/Staff).
- **Success Response (200):**
  ```json
  {
    "order_id": 101,
    "order_date": "...",
    "total_amount": "169.98",
    "status": "pending",
    "shipping_address": "123 Customer Lane",
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "price_at_purchase": "79.99",
        "name": "Wireless Earbuds"
      }
    ]
  }
  ```

### `PATCH /orders/:id`

- **Description:** Updates an existing order.
- **Authentication:** Admin/Staff role required.
- **Request Body:** `UpdateOrderDto` (Partial order object).
- **Success Response (200):** Returns the updated order object.

### `DELETE /orders/:id`

- **Description:** Deletes an order.
- **Authentication:** Admin role required.
- **Success Response (204):** No content.

---

## Order Items

Manages items within an order.

### `POST /order-items`

- **Description:** Creates a new order item.
- **Authentication:** Admin/Staff role required.
- **Request Body:** `CreateOrderItemDto`
  ```json
  {
    "order_id": 1,
    "product_id": 1,
    "quantity": 2,
    "price_at_purchase": 99.99
  }
  ```
- **Success Response (201):** Returns the newly created order item object.

### `GET /order-items`

- **Description:** Gets a list of all order items.
- **Authentication:** Admin role required.
- **Success Response (200):** Returns an array of order item objects.

### `GET /order-items/:id`

- **Description:** Gets detailed information for a single order item.
- **Authentication:** Admin/Staff role required.
- **Success Response (200):** Returns an order item object.

### `PATCH /order-items/:id`

- **Description:** Updates an existing order item.
- **Authentication:** Admin/Staff role required.
- **Request Body:** `UpdateOrderItemDto` (Partial order item object).
- **Success Response (200):** Returns the updated order item object.

### `DELETE /order-items/:id`

- **Description:** Deletes an order item.
- **Authentication:** Admin role required.
- **Success Response (204):** No content.

---

## Transaction Logs

Manages transaction logs.

### `POST /transaction-logs`

- **Description:** Creates a new transaction log.
- **Authentication:** Admin role required.
- **Request Body:** `CreateTransactionLogDto`
  ```json
  {
    "action_type": "USER_LOGIN",
    "new_value": "User logged in",
    "old_value": "",
    "record_id": 1,
    "table_name": "users"
  }
  ```
- **Success Response (201):** Returns the newly created transaction log object.

### `GET /transaction-logs`

- **Description:** Gets a list of all transaction logs.
- **Authentication:** Admin role required.
- **Success Response (200):** Returns an array of transaction log objects.

### `GET /transaction-logs/:id`

- **Description:** Gets detailed information for a single transaction log.
- **Authentication:** Admin role required.
- **Success Response (200):** Returns a transaction log object.

### `PATCH /transaction-logs/:id`

- **Description:** Updates an existing transaction log.
- **Authentication:** Admin role required.
- **Request Body:** `UpdateTransactionLogDto` (Partial transaction log object).
- **Success Response (200):** Returns the updated transaction log object.

### `DELETE /transaction-logs/:id`

- **Description:** Deletes a transaction log.
- **Authentication:** Admin role required.
- **Success Response (204):** No content.

---

## Currencies

Manages currencies.

### `POST /currencies`

- **Description:** Creates a new currency.
- **Authentication:** Admin role required.
- **Request Body:** `CreateCurrencyDto`
  ```json
  {
    "currency_code": "PHP",
    "symbol": "₱",
    "exchange_rate_to_usd": 0.017
  }
  ```
- **Success Response (201):** Returns the newly created currency object.

### `GET /currencies`

- **Description:** Gets a list of all currencies.
- **Success Response (200):** Returns an array of currency objects.

### `GET /currencies/:id`

- **Description:** Gets detailed information for a single currency.
- **Success Response (200):** Returns a currency object.

### `PATCH /currencies/:id`

- **Description:** Updates an existing currency.
- **Authentication:** Admin role required.
- **Request Body:** `UpdateCurrencyDto` (Partial currency object).
- **Success Response (200):** Returns the updated currency object.

### `DELETE /currencies/:id`

- **Description:** Deletes a currency.
- **Authentication:** Admin role required.
- **Success Response (204):** No content.

---

## App Controller

### `GET /`

- **Description:** Returns a "Hello World!" message.
- **Success Response (200):** Returns "Hello World!"

