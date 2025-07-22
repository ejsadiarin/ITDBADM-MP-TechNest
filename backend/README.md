# TechNest API Documentation

This document outlines the API endpoints for the TechNest backend, built with NestJS.

## Table of Contents

- [Authentication](#authentication)
- [Products](#products)
- [Cart](#cart)
- [Orders](#orders)
- [Admin](#admin)

---

## Authentication

Handles user registration and login.

### `POST /auth/register`

-   **Description:** Registers a new user.
-   **Request Body:**
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
-   **Success Response (201):**
    ```json
    {
      "user_id": 1,
      "username": "newuser",
      "email": "new@example.com",
      "role": "customer"
    }
    ```

### `POST /auth/login`

-   **Description:** Authenticates a user and returns a JSON Web Token (JWT).
-   **Request Body:**
    ```json
    {
      "email": "new@example.com",
      "password": "password123"
    }
    ```
-   **Success Response (200):**
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

### `GET /auth/profile`

-   **Description:** Gets the profile of the currently authenticated user.
-   **Authentication:** JWT Required.
-   **Success Response (200):**
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

### `GET /products`

-   **Description:** Gets a paginated, filterable list of products.
-   **Query Parameters:**
    -   `search` (string): Search term to match against product names and descriptions.
    -   `category` (string): Filter by category name.
    -   `brand` (string): Filter by brand name.
    -   `minPrice` (number): Minimum price.
    -   `maxPrice` (number): Maximum price.
    -   `sortBy` (string): Field to sort by (e.g., `price`, `name`). Defaults to `name`.
    -   `order` (string): Sort order (`asc` or `desc`). Defaults to `asc`.
    -   `page` (number): Page number for pagination. Defaults to `1`.
    -   `limit` (number): Number of items per page. Defaults to `20`.
-   **Success Response (200):**
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

-   **Description:** Gets detailed information for a single product.
-   **Success Response (200):**
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

### `POST /products`

-   **Description:** Creates a new product.
-   **Authentication:** Admin/Staff role required.
-   **Request Body:**
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
-   **Success Response (201):** Returns the newly created product object.

### `PATCH /products/:id`

-   **Description:** Updates an existing product.
-   **Authentication:** Admin/Staff role required.
-   **Request Body:** Partial product object.
-   **Success Response (200):** Returns the updated product object.

### `DELETE /products/:id`

-   **Description:** Deletes a product.
-   **Authentication:** Admin role required.
-   **Success Response (204):** No content.

---

## Cart

Manages the user's shopping cart.

### `GET /cart`

-   **Description:** Retrieves the current user's cart.
-   **Authentication:** JWT Required.
-   **Success Response (200):**
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

### `POST /cart/items`

-   **Description:** Adds an item to the cart or updates its quantity.
-   **Authentication:** JWT Required.
-   **Request Body:**
    ```json
    {
      "product_id": 2,
      "quantity": 1
    }
    ```
-   **Success Response (200):** Returns the updated cart object.

### `DELETE /cart/items/:productId`

-   **Description:** Removes an item from the cart.
-   **Authentication:** JWT Required.
-   **Success Response (200):** Returns the updated cart object.

---

## Orders

Handles order creation and history.

### `POST /orders`

-   **Description:** Creates a new order from the user's cart.
-   **Authentication:** JWT Required.
-   **Request Body:**
    ```json
    {
      "shipping_address": "123 Customer Lane"
    }
    ```
-   **Success Response (201):**
    ```json
    {
      "new_order_id": 101
    }
    ```

### `GET /orders`

-   **Description:** Gets a user's order history. Admins/Staff can view all orders and filter.
-   **Authentication:** JWT Required.
-   **Query (Admin/Staff):** `?status=pending`
-   **Success Response (200):**
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

-   **Description:** Gets details for a single order.
-   **Authentication:** JWT Required (user must own the order or be Admin/Staff).
-   **Success Response (200):**
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

### `PATCH /orders/:id/status`

-   **Description:** Updates the status of an order.
-   **Authentication:** Admin/Staff role required.
-   **Request Body:**
    ```json
    {
      "status": "shipped"
    }
    ```
-   **Success Response (200):** Returns the updated order object.

---

## Admin

Endpoints for administrative tasks.

### Users (`/admin/users`)

-   **`GET /`**: Lists all users.
-   **`GET /:id`**: Gets a single user's details.
-   **`PATCH /:id`**: Updates a user's role or other details.
-   **`DELETE /:id`**: Deletes a user.

### Inventory (`/admin/inventory`)

-   **`PATCH /:productId`**: Manually adjusts the stock for a product.
-   **Request Body:**
    ```json
    {
      "quantity": 50
    }
    ```
-   **Success Response (200):**
    ```json
    {
      "product_id": 1,
      "stock_quantity": 50
    }
    ```