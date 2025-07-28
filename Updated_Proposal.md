# **TechNest Online Store: Final Proposal**

This document provides a complete overview of the TechNest online store project, including its features, database design, and key technical implementations as required.

## **1. Project Overview**

*   **Online Store Name:** TechNest
*   **Product Description:** TechNest is a one-stop online store for the latest gadgets and tech accessories, from smartwatches and wireless earbuds to gaming peripherals and home tech gear.
*   **Target Customers:** Our primary customers are tech enthusiasts, including students, gamers, young professionals, and early adopters of new technology.

## **2. Key Features**

### **Customer View:**
*   **Product Search and Filtering:** Users can search for products and filter them by category, brand, and price.
*   **Browse Product Catalog:** A comprehensive catalog of all available products.
*   **User Login and Registration:** Secure user authentication and account creation.
*   **Shopping Cart:** Users can add items to a persistent cart, update quantities, and remove items.
*   **Mock Checkout Process:** A simulated checkout process to create an order (no real payment processing).
*   **Order History:** View past orders and their statuses.
*   **Currency Handling:** Support for multiple currencies (PHP, USD, KRW).

### **Admin View:**
*   **User Management Dashboard:** Admins can view, update, and delete user accounts.
*   **Product Management:** Admins can add, edit, and delete products from the store.

### **Staff View:**
*   **Inventory Stock Management:** Staff can access and update product inventory levels.

## **3. Database Models**

The following tables represent the core database structure for the TechNest application.

### **`users` Table**
Stores information about registered users, including customers, administrators, and staff.

| Column Name     | Data Type                               | Constraints                               | Description                                  |
| --------------- | --------------------------------------- | ----------------------------------------- | -------------------------------------------- |
| `user_id`       | INT                                     | PRIMARY KEY, AUTO_INCREMENT               | Unique identifier for each user.             |
| `username`      | VARCHAR(255)                            | NOT NULL, UNIQUE                          | User's chosen username.                      |
| `email`         | VARCHAR(255)                            | NOT NULL, UNIQUE                          | User's email address.                        |
| `password_hash` | VARCHAR(255)                            | NOT NULL                                  | Hashed password for security.                |
| `first_name`    | VARCHAR(255)                            | NULL                                      | User's first name.                           |
| `last_name`     | VARCHAR(255)                            | NULL                                      | User's last name.                            |
| `address`       | TEXT                                    | NULL                                      | User's shipping address.                     |
| `phone_number`  | VARCHAR(20)                             | NULL                                      | User's phone number.                         |
| `role`          | ENUM('customer', 'admin', 'staff')      | NOT NULL, DEFAULT 'customer'              | User's role (customer, admin, or staff).     |
| `created_at`    | TIMESTAMP                               | DEFAULT CURRENT_TIMESTAMP                 | Timestamp of user account creation.          |
| `updated_at`    | TIMESTAMP                               | DEFAULT CURRENT_TIMESTAMP ON UPDATE ...   | Timestamp of the last user account update.   |

### **`categories` Table**
Organizes products into different categories.

| Column Name     | Data Type    | Constraints                 | Description                                  |
| --------------- | ------------ | --------------------------- | -------------------------------------------- |
| `category_id`   | INT          | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each category.         |
| `name`          | VARCHAR(255) | NOT NULL, UNIQUE            | Name of the category.                        |
| `description`   | TEXT         | NULL                        | Optional description of the category.        |

### **`currencies` Table (New)**
Stores supported currencies and their exchange rates.

| Column Name            | Data Type                          | Constraints                 | Description                                  |
| ---------------------- | ---------------------------------- | --------------------------- | -------------------------------------------- |
| `currency_id`          | INT                                | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each currency.         |
| `currency_code`        | ENUM('PHP', 'USD', 'KRW')          | NOT NULL, UNIQUE            | The three-letter currency code.              |
| `symbol`               | ENUM('₱', '$', '₩')              | NOT NULL                    | The currency symbol.                         |
| `exchange_rate_to_usd` | DECIMAL(10, 4)                     | NOT NULL                    | Exchange rate relative to USD.               |

### **`products` Table (Modified)**
Stores details about each product.

| Column Name     | Data Type      | Constraints                               | Description                                  |
| --------------- | -------------- | ----------------------------------------- | -------------------------------------------- |
| `product_id`    | INT            | PRIMARY KEY, AUTO_INCREMENT               | Unique identifier for each product.          |
| `name`          | VARCHAR(255)   | NOT NULL                                  | Name of the product.                         |
| `description`   | TEXT           | NULL                                      | Detailed description of the product.         |
| `price`         | DECIMAL(10, 2) | NOT NULL, CHECK (price >= 0)              | Price of the product.                        |
| `category_id`   | INT            | NOT NULL, FOREIGN KEY                     | ID of the product's category.                |
| `currency_id`   | INT            | FOREIGN KEY                               | ID of the currency for the price.            |
| `image_url`     | VARCHAR(255)   | NULL                                      | URL to the product's main image.             |
| `brand`         | VARCHAR(255)   | NULL                                      | Brand of the product.                        |
| `created_at`    | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP                 | Timestamp when the product was added.        |
| `updated_at`    | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP ON UPDATE ...   | Timestamp of the last product detail update. |

### **`inventory` Table**
Manages stock levels for each product.

| Column Name      | Data Type | Constraints                               | Description                                  |
| ---------------- | --------- | ----------------------------------------- | -------------------------------------------- |
| `inventory_id`   | INT       | PRIMARY KEY, AUTO_INCREMENT               | Unique identifier for each inventory record. |
| `product_id`     | INT       | NOT NULL, UNIQUE, FOREIGN KEY             | ID of the product.                           |
| `stock_quantity` | INT       | NOT NULL, DEFAULT 0, CHECK (>= 0)         | Current quantity of the product in stock.    |
| `last_updated`   | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE ...   | Timestamp of the last stock update.          |

### **`orders` Table (Modified)**
Stores information about customer orders.

| Column Name        | Data Type                                                   | Constraints                               | Description                                  |
| ------------------ | ----------------------------------------------------------- | ----------------------------------------- | -------------------------------------------- |
| `order_id`         | INT                                                         | PRIMARY KEY, AUTO_INCREMENT               | Unique identifier for each order.            |
| `user_id`          | INT                                                         | NOT NULL, FOREIGN KEY                     | ID of the user who placed the order.         |
| `order_date`       | TIMESTAMP                                                   | DEFAULT CURRENT_TIMESTAMP                 | Date and time when the order was placed.     |
| `total_amount`     | DECIMAL(10, 2)                                              | NOT NULL, CHECK (>= 0)                    | Total amount of the order.                   |
| `status`           | ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') | NOT NULL, DEFAULT 'pending'               | Current status of the order.                 |
| `shipping_address` | TEXT                                                        | NOT NULL                                  | Shipping address for the order.              |
| `currency_id`      | INT                                                         | FOREIGN KEY                               | ID of the currency for the transaction.      |

### **`order_items` Table**
Links products to specific orders.

| Column Name         | Data Type      | Constraints                               | Description                                  |
| ------------------- | -------------- | ----------------------------------------- | -------------------------------------------- |
| `order_item_id`     | INT            | PRIMARY KEY, AUTO_INCREMENT               | Unique identifier for each order item.       |
| `order_id`          | INT            | NOT NULL, FOREIGN KEY                     | ID of the order this item belongs to.        |
| `product_id`        | INT            | NOT NULL, FOREIGN KEY                     | ID of the product ordered.                   |
| `quantity`          | INT            | NOT NULL, CHECK (> 0)                     | Quantity of the product ordered.             |
| `price_at_purchase` | DECIMAL(10, 2) | NOT NULL, CHECK (>= 0)                    | Price of the product at the time of purchase.|

### **`transaction_logs` Table (Previously `audit_logs`)**
Logs key payment and system events for tracking and auditing.

| Column Name        | Data Type    | Constraints                 | Description                                  |
| ------------------ | ------------ | --------------------------- | -------------------------------------------- |
| `log_id`           | INT          | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for each log entry.        |
| `user_id`          | INT          | NULL, FOREIGN KEY           | ID of the user who performed the action.     |
| `action_type`      | VARCHAR(50)  | NOT NULL                    | Type of action performed.                    |
| `table_name`       | VARCHAR(50)  | NOT NULL                    | Name of the table affected.                  |
| `record_id`        | INT          | NOT NULL                    | ID of the record affected.                   |
| `old_value`        | TEXT         | NULL                        | The value before the change.                 |
| `new_value`        | TEXT         | NULL                        | The value after the change.                  |
| `action_timestamp` | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP   | Timestamp of the action.                     |

## **4. Full SQL DDL Script**

```sql
CREATE DATABASE IF NOT EXISTS technest_db;
USE technest_db;

-- Core Tables
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    address TEXT,
    phone_number VARCHAR(20),
    role ENUM('customer', 'admin', 'staff') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS currencies (
    currency_id INT AUTO_INCREMENT PRIMARY KEY,
    currency_code ENUM('PHP', 'USD', 'KRW') NOT NULL UNIQUE,
    symbol ENUM('₱', '$', '₩') NOT NULL,
    exchange_rate_to_usd DECIMAL(10, 4) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    category_id INT NOT NULL,
    currency_id INT,
    image_url VARCHAR(255),
    brand VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (currency_id) REFERENCES currencies(currency_id)
);

CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE(cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    currency_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (currency_id) REFERENCES currencies(currency_id)
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase >= 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS transaction_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);
```

## **5. Triggers & Stored Procedures**

### **Triggers (9 Total)**

1.  **`before_insert_order_item_check_stock`**
    - **Event:** `BEFORE INSERT` on `order_items`
    - **Purpose:** Prevents an `order_item` from being inserted if there is not enough stock available for the product. This ensures that customers cannot order more items than are available in the inventory.
    ```sql
    DELIMITER $$
    CREATE TRIGGER before_insert_order_item_check_stock
    BEFORE INSERT ON order_items
    FOR EACH ROW
    BEGIN
        DECLARE available_stock INT;
        SELECT stock_quantity INTO available_stock FROM inventory WHERE product_id = NEW.product_id;
        IF NEW.quantity > available_stock THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock for this product.';
        END IF;
    END$$ 
    DELIMITER ;
    ```

2.  **`after_insert_order_item_decrease_stock`**
    - **Event:** `AFTER INSERT` on `order_items`
    - **Purpose:** Automatically decreases the `stock_quantity` in the `inventory` table after a new `order_item` is successfully added. This keeps the inventory levels accurate in real-time.
    ```sql
    DELIMITER $$
    CREATE TRIGGER after_insert_order_item_decrease_stock
    AFTER INSERT ON order_items
    FOR EACH ROW
    BEGIN
        UPDATE inventory SET stock_quantity = stock_quantity - NEW.quantity, last_updated = CURRENT_TIMESTAMP WHERE product_id = NEW.product_id;
    END$$ 
    DELIMITER ;
    ```

3.  **`after_update_order_status_increase_stock`**
    - **Event:** `AFTER UPDATE` on `orders`
    - **Purpose:** If an order's status is updated to `'cancelled'`, this trigger restocks the inventory by adding the quantities of the cancelled items back. This is essential for managing returns and cancellations.
    ```sql
    DELIMITER $$
    CREATE TRIGGER after_update_order_status_increase_stock
    AFTER UPDATE ON orders
    FOR EACH ROW
    BEGIN
        IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
            UPDATE inventory i
            JOIN order_items oi ON i.product_id = oi.product_id
            SET i.stock_quantity = i.stock_quantity + oi.quantity, i.last_updated = CURRENT_TIMESTAMP
            WHERE oi.order_id = NEW.order_id;
        END IF;
    END$$ 
    DELIMITER ;
    ```

4.  **`after_insert_order_item_update_order_total`**
    - **Event:** `AFTER INSERT` on `order_items`
    - **Purpose:** Ensures that the `total_amount` for an order in the `orders` table is correctly updated whenever a new `order_item` is added.
    ```sql
    DELIMITER $$
    CREATE TRIGGER after_insert_order_item_update_order_total
    AFTER INSERT ON order_items
    FOR EACH ROW
    BEGIN
        UPDATE orders
        SET total_amount = (SELECT SUM(quantity * price_at_purchase) FROM order_items WHERE order_id = NEW.order_id)
        WHERE order_id = NEW.order_id;
    END$$ 
    DELIMITER ;
    ```

5.  **`after_delete_order_item_update_order_total`**
    - **Event:** `AFTER DELETE` on `order_items`
    - **Purpose:** Ensures the `total_amount` for an order is updated whenever an `order_item` is removed. This is crucial for order modifications.
    ```sql
    DELIMITER $$
    CREATE TRIGGER after_delete_order_item_update_order_total
    AFTER DELETE ON order_items
    FOR EACH ROW
    BEGIN
        UPDATE orders
        SET total_amount = COALESCE((SELECT SUM(quantity * price_at_purchase) FROM order_items WHERE order_id = OLD.order_id), 0.00)
        WHERE order_id = OLD.order_id;
    END$$ 
    DELIMITER ;
    ```

6.  **`before_update_product_price_check_zero`**
    - **Event:** `BEFORE UPDATE` on `products`
    - **Purpose:** Prevents the price of a product from being updated to a negative value, maintaining data integrity.
    ```sql
    DELIMITER $$
    CREATE TRIGGER before_update_product_price_check_zero
    BEFORE UPDATE ON products
    FOR EACH ROW
    BEGIN
        IF NEW.price < 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product price cannot be negative.';
        END IF;
    END$$ 
    DELIMITER ;
    ```

7.  **`before_delete_user_check_orders`**
    - **Event:** `BEFORE DELETE` on `users`
    - **Purpose:** Prevents a user from being deleted if they have existing orders, which maintains referential integrity and prevents orphaned order records.
    ```sql
    DELIMITER $$
    CREATE TRIGGER before_delete_user_check_orders
    BEFORE DELETE ON users
    FOR EACH ROW
    BEGIN
        DECLARE order_count INT;
        SELECT COUNT(*) INTO order_count FROM orders WHERE user_id = OLD.user_id;
        IF order_count > 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete user; existing orders are associated with this user.';
        END IF;
    END$$ 
    DELIMITER ;
    ```

8.  **`log_product_price_update`**
    - **Event:** `AFTER UPDATE` on `products`
    - **Purpose:** Logs any changes to a product's price in the `transaction_logs` table. This is useful for tracking price history and for auditing purposes.
    ```sql
    DELIMITER $$
    CREATE TRIGGER log_product_price_update
    AFTER UPDATE ON products
    FOR EACH ROW
    BEGIN
        IF OLD.price <> NEW.price THEN
            INSERT INTO transaction_logs (action_type, table_name, record_id, old_value, new_value)
            VALUES ('UPDATE_PRODUCT_PRICE', 'products', NEW.product_id, OLD.price, NEW.price);
        END IF;
    END$$ 
    DELIMITER ;
    ```

9.  **`after_insert_order_log_transaction`**
    - **Event:** `AFTER INSERT` on `orders`
    - **Purpose:** Automatically logs a "creation" transaction whenever a new order is placed.
    ```sql
    DELIMITER $$
    CREATE TRIGGER after_insert_order_log_transaction
    AFTER INSERT ON orders
    FOR EACH ROW
    BEGIN
        INSERT INTO transaction_logs (user_id, action_type, table_name, record_id, new_value)
        VALUES (NEW.user_id, 'ORDER_CREATED', 'orders', NEW.order_id, CONCAT('Total: ', NEW.total_amount));
    END$$ 
    DELIMITER ;
    ```

### **Stored Procedures (5 Total)**

1.  **`GetProductDetails`**
    - **Purpose:** Retrieves all details for a specific product, including its category name and current stock quantity. This provides a comprehensive view of a single product for display on a product page.
    - **Parameters:**
      - `product_id_param INT`: The ID of the product to retrieve.
    ```sql
    DELIMITER $$
    CREATE PROCEDURE GetProductDetails(IN product_id_param INT)
    BEGIN
        SELECT
            p.product_id, p.name AS product_name, p.description AS product_description, p.price,
            c.name AS category_name, p.image_url, p.brand, i.stock_quantity, p.created_at, p.updated_at
        FROM products p
        JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN inventory i ON p.product_id = i.product_id
        WHERE p.product_id = product_id_param;
    END$$ 
    DELIMITER ;
    ```

2.  **`GetUsersWithPendingOrders`**
    - **Purpose:** Returns a list of users who currently have orders with a `'pending'` or `'processing'` status. This is useful for administrative purposes, such as identifying orders that need to be fulfilled.
    ```sql
    DELIMITER $$
    CREATE PROCEDURE GetUsersWithPendingOrders()
    BEGIN
        SELECT DISTINCT u.user_id, u.username, u.email, u.first_name, u.last_name, u.phone_number
        FROM users u
        JOIN orders o ON u.user_id = o.user_id
        WHERE o.status IN ('pending', 'processing');
    END$$ 
    DELIMITER ;
    ```

3.  **`CreateOrderFromCart`**
    - **Purpose:** Creates a new order for a user based on the items in their cart. It calculates the total price, moves cart items to order items, and then clears the user's cart.
    - **Parameters:**
      - `p_user_id INT`: The ID of the user placing the order.
      - `p_shipping_address TEXT`: The shipping address for the order.
    ```sql
    DELIMITER $$
    CREATE PROCEDURE CreateOrderFromCart(IN p_user_id INT, IN p_shipping_address TEXT)
    BEGIN
        DECLARE v_cart_id INT;
        DECLARE v_order_id INT;
        DECLARE v_currency_id INT;

        START TRANSACTION;

        SELECT cart_id INTO v_cart_id FROM cart WHERE user_id = p_user_id;

        IF v_cart_id IS NOT NULL AND (SELECT COUNT(*) FROM cart_items WHERE cart_id = v_cart_id) > 0 THEN
            SELECT p.currency_id INTO v_currency_id
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = v_cart_id
            LIMIT 1;

            INSERT INTO orders (user_id, shipping_address, total_amount, status, currency_id)
            VALUES (p_user_id, p_shipping_address, 0.00, 'pending', v_currency_id);
            SET v_order_id = LAST_INSERT_ID();

            INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
            SELECT v_order_id, ci.product_id, ci.quantity, p.price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = v_cart_id;

            IF @@error_count > 0 THEN
                ROLLBACK;
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error during order creation. Transaction rolled back.';
            ELSE
                DELETE FROM cart_items WHERE cart_id = v_cart_id;
                COMMIT;
                SELECT v_order_id AS new_order_id;
            END IF;
        ELSE
            ROLLBACK;
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cart is empty or does not exist.';
        END IF;
    END$$ 
    DELIMITER ;
    ```

4.  **`UpdateStock`**
    - **Purpose:** Safely updates the stock quantity for a given product.
    - **Parameters:**
        - `p_product_id INT`: The ID of the product to update.
        - `p_new_quantity INT`: The new stock quantity.
    ```sql
    DELIMITER $$
    CREATE PROCEDURE UpdateStock(IN p_product_id INT, IN p_new_quantity INT)
    BEGIN
        IF p_new_quantity < 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock quantity cannot be negative.';
        ELSE
            UPDATE inventory SET stock_quantity = p_new_quantity WHERE product_id = p_product_id;
        END IF;
    END$$ 
    DELIMITER ;
    ```

5.  **`LogTransaction`**
    - **Purpose:** Logs payment activity for an order in the `transaction_logs` table.
    - **Parameters:**
        - `p_user_id INT`: The ID of the user.
        - `p_order_id INT`: The ID of the order.
        - `p_payment_method VARCHAR(50)`: The payment method used.
        - `p_status VARCHAR(50)`: The status of the payment.
        - `p_amount DECIMAL(10,2)`: The amount of the transaction.
    ```sql
    -- Logs payment activity for an order in the transaction_logs table
    DELIMITER $$
    CREATE PROCEDURE LogTransaction(
        IN p_user_id INT,
        IN p_order_id INT,
        IN p_payment_method VARCHAR(50),
        IN p_status VARCHAR(50),
        IN p_amount DECIMAL(10,2)
    )
    BEGIN
        INSERT INTO transaction_logs (user_id, action_type, table_name, record_id, new_value)
        VALUES (
            p_user_id,
            'PAYMENT_ATTEMPT',
            'orders',
            p_order_id,
            CONCAT('Method: ', p_payment_method, ', Status: ', p_status, ', Amount: ', p_amount)
        );
    END
    $$ DELIMITER ;
    ```

## **6. ACID Transactions**

To ensure data integrity, key operations are wrapped in ACID-compliant transactions. This guarantees that all steps within a procedure either complete successfully or fail together, preventing inconsistent data states.

**Example: `CreateOrderFromCart` Stored Procedure**

This procedure is a critical transactional process. It ensures that creating an order, inserting order items, and clearing the user's cart is an atomic operation. If any step fails (e.g., an inventory trigger signals an error), the entire transaction is rolled back.

```sql
DELIMITER $$
CREATE PROCEDURE CreateOrderFromCart(IN p_user_id INT, IN p_shipping_address TEXT)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_order_id INT;
    DECLARE v_currency_id INT;

    -- Start the transaction
    START TRANSACTION;

    SELECT cart_id INTO v_cart_id FROM cart WHERE user_id = p_user_id;

    IF v_cart_id IS NOT NULL AND (SELECT COUNT(*) FROM cart_items WHERE cart_id = v_cart_id) > 0 THEN
        -- For simplicity, we'll use the currency of the first item in the cart.
        SELECT p.currency_id INTO v_currency_id
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.cart_id = v_cart_id
        LIMIT 1;

        -- Create the order record
        INSERT INTO orders (user_id, shipping_address, total_amount, status, currency_id)
        VALUES (p_user_id, p_shipping_address, 0.00, 'pending', v_currency_id);
        SET v_order_id = LAST_INSERT_ID();

        -- Move items from cart to order_items
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        SELECT v_order_id, ci.product_id, ci.quantity, p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.cart_id = v_cart_id;

        -- If any error occurred (e.g., from a trigger), roll back
        IF @@error_count > 0 THEN
            ROLLBACK;
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error during order creation. Transaction rolled back.';
        ELSE
            -- Clear the cart and commit
            DELETE FROM cart_items WHERE cart_id = v_cart_id;
            COMMIT;
            SELECT v_order_id AS new_order_id;
        END IF;
    ELSE
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cart is empty or does not exist.';
    END IF;
END$$
DELIMITER ;
```
