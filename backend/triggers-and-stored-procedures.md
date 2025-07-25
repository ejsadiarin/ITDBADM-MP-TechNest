# Triggers and Stored Procedures

This document provides a comprehensive overview of the database triggers and stored procedures used in the TechNest project.

## Triggers

Triggers are automated database operations that are executed in response to specific events on a particular table. They are crucial for maintaining data integrity, enforcing business rules, and creating audit trails.

### 1. `before_insert_order_item_check_stock`

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
END
$$ DELIMITER ;
```

### 2. `after_insert_order_item_decrease_stock`

- **Event:** `AFTER INSERT` on `order_items`
- **Purpose:** Automatically decreases the `stock_quantity` in the `inventory` table after a new `order_item` is successfully added. This keeps the inventory levels accurate in real-time.

```sql
DELIMITER $$
CREATE TRIGGER after_insert_order_item_decrease_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE inventory SET stock_quantity = stock_quantity - NEW.quantity, last_updated = CURRENT_TIMESTAMP WHERE product_id = NEW.product_id;
END
$$ DELIMITER ;
```

### 3. `after_update_order_status_increase_stock`

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
END
$$ DELIMITER ;
```

### 4. `after_insert_order_item_update_order_total`

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
END
$$ DELIMITER ;
```

### 5. `after_delete_order_item_update_order_total`

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
END
$$ DELIMITER ;
```

### 6. `before_update_product_price_check_zero`

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
END
$$ DELIMITER ;
```

### 7. `before_delete_user_check_orders`

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
END
$$ DELIMITER ;
```

### 8. `log_product_price_update`

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
END
$$ DELIMITER ;
```

### 9. `after_insert_order_log_transaction`

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
END
$$ DELIMITER ;
```

## Stored Procedures

Stored procedures are pre-compiled SQL statements that can be saved and reused. They are used to encapsulate complex logic, improve performance, and enhance security.

### 1. `GetProductDetails(IN product_id_param INT)`

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
END
$$ DELIMITER ;
```

### 2. `GetUsersWithPendingOrders()`

- **Purpose:** Returns a list of users who currently have orders with a `'pending'` or `'processing'` status. This is useful for administrative purposes, such as identifying orders that need to be fulfilled.

```sql
DELIMITER $$
CREATE PROCEDURE GetUsersWithPendingOrders()
BEGIN
    SELECT DISTINCT u.user_id, u.username, u.email, u.first_name, u.last_name, u.phone_number
    FROM users u
    JOIN orders o ON u.user_id = o.user_id
    WHERE o.status IN ('pending', 'processing');
END
$$ DELIMITER ;
```

### 3. `CreateOrderFromCart(IN p_user_id INT, IN p_shipping_address TEXT)`

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
    DECLARE v_total_amount DECIMAL(10, 2);
    DECLARE v_currency_id INT;

    -- Start the transaction
    START TRANSACTION;

    SELECT cart_id INTO v_cart_id FROM cart WHERE user_id = p_user_id;

    IF v_cart_id IS NOT NULL AND (SELECT COUNT(*) FROM cart_items WHERE cart_id = v_cart_id) > 0 THEN
        -- Assume a default currency or determine from user/product preferences
        SET v_currency_id = 1; -- Default to PHP, for example

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

        -- Check for errors (e.g., from triggers)
        IF @@error_count > 0 THEN
            ROLLBACK;
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error occurred during order creation. Transaction rolled back.';
        ELSE
            -- Clear the cart
            DELETE FROM cart_items WHERE cart_id = v_cart_id;

            -- Commit the transaction
            COMMIT;
            SELECT v_order_id AS new_order_id;
        END IF;
    ELSE
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cart is empty or does not exist.';
    END IF;
END
$$ DELIMITER ;
```

### 4. `UpdateStock(IN p_product_id INT, IN p_new_quantity INT)`

- **Purpose:** Safely updates the stock quantity for a given product.

```sql
DELIMITER $$
CREATE PROCEDURE UpdateStock(IN p_product_id INT, IN p_new_quantity INT)
BEGIN
    IF p_new_quantity < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock quantity cannot be negative.';
    ELSE
        UPDATE inventory SET stock_quantity = p_new_quantity WHERE product_id = p_product_id;
    END IF;
END
$$ DELIMITER ;
```

### 5. `LogTransaction(IN p_order_id INT, IN p_payment_method VARCHAR(50), IN p_status VARCHAR(50), IN p_amount DECIMAL(10,2))`

- **Purpose:** Logs payment activity for an order in the `transaction_logs` table.

```sql
DELIMITER $$
CREATE PROCEDURE LogTransaction(
    IN p_order_id INT,
    IN p_payment_method VARCHAR(50),
    IN p_status VARCHAR(50),
    IN p_amount DECIMAL(10,2)
)
BEGIN
    INSERT INTO transaction_logs (action_type, table_name, record_id, new_value)
    VALUES (
        'PAYMENT_ATTEMPT',
        'orders',
        p_order_id,
        CONCAT('Method: ', p_payment_method, ', Status: ', p_status, ', Amount: ', p_amount)
    );
END
$$ DELIMITER ;
```