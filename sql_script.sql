CREATE DATABASE IF NOT EXISTS technest_db;

USE technest_db;

-- Users Table: Stores user information, including customers, staff, and admins.
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

-- Categories Table: Organizes products into categories.
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- Currencies Table: Stores supported currencies and their exchange rates.
CREATE TABLE IF NOT EXISTS currencies (
    currency_id INT AUTO_INCREMENT PRIMARY KEY,
    currency_code VARCHAR(3) NOT NULL UNIQUE,
    symbol VARCHAR(5) NOT NULL,
    exchange_rate_to_usd DECIMAL(10, 4) NOT NULL
);

-- Products Table: Stores details about each product.
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
    CONSTRAINT fk_products_categories FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT fk_products_currencies FOREIGN KEY (currency_id) REFERENCES currencies(currency_id)
);

-- Inventory Table: Manages stock levels for each product.
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_inventory_products FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Cart Table: A persistent cart for each user.
CREATE TABLE IF NOT EXISTS cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Cart Items Table: Links products to a user's cart.
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_products FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE(cart_id, product_id)
);

-- Orders Table: Stores information about customer orders.
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    currency_id INT,
    CONSTRAINT fk_orders_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_orders_currencies FOREIGN KEY (currency_id) REFERENCES currencies(currency_id)
);

-- Order Items Table: Links products to specific orders.
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase >= 0),
    CONSTRAINT fk_order_items_orders FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_products FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Transaction Logs Table: Tracks important changes in the database.
CREATE TABLE IF NOT EXISTS transaction_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transaction_logs_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);


-- ==============================
--          TRIGGERS
-- ==============================

-- Prevents inserting an order item if stock is insufficient.
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


-- Decreases stock quantity after an order item is inserted.
DELIMITER $$
CREATE TRIGGER after_insert_order_item_decrease_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE inventory SET stock_quantity = stock_quantity - NEW.quantity, last_updated = CURRENT_TIMESTAMP WHERE product_id = NEW.product_id;
END
$$ DELIMITER ;

-- Increases stock quantity if an order is cancelled.
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

-- Updates the total order amount after inserting a new order item.
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

-- Updates the total order amount after deleting an order item.
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

-- Prevents updating a product price to a negative value.
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

-- Prevents deleting a user if they have existing orders.
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

-- Logs changes to product prices.
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

-- Logs a new transaction every time an order is created
DELIMITER $$
CREATE TRIGGER after_insert_order_log_transaction
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    INSERT INTO transaction_logs (user_id, action_type, table_name, record_id, new_value)
    VALUES (NEW.user_id, 'ORDER_CREATED', 'orders', NEW.order_id, CONCAT('Total: ', NEW.total_amount));
END
$$ DELIMITER ;

-- Automatically creates an inventory record on product insert
DELIMITER $$
CREATE TRIGGER after_insert_product_create_inventory
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    INSERT INTO inventory (product_id, stock_quantity)
    VALUES (NEW.product_id, 1);
END
$$ DELIMITER ;

-- ==============================
--      STORED PROCEDURES
-- ==============================

-- Retrieves full details for a specific product.
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

-- Retrieves a list of users with pending or processing orders.
DELIMITER $$
CREATE PROCEDURE GetUsersWithPendingOrders()
BEGIN
    SELECT DISTINCT u.user_id, u.username, u.email, u.first_name, u.last_name, u.phone_number
    FROM users u
    JOIN orders o ON u.user_id = o.user_id
    WHERE o.status IN ('pending', 'processing');
END
$$ DELIMITER ;

-- Creates a new order from a user's cart and clears the cart.
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

-- Safely updates the stock quantity for a given product
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

-- ==============================
--          MOCK DATA
-- ==============================

-- Insert Currencies
INSERT INTO currencies (currency_code, symbol, exchange_rate_to_usd) VALUES
('PHP', '₱', 0.017),
('USD', '$', 1.00),
('KRW', '₩', 0.00072);

-- Insert Users (Admin, Staff, Customer)
INSERT INTO users (username, email, password_hash, first_name, last_name, address, phone_number, role) VALUES
('admin_user', 'admin@technest.com', '$2b$10$yMfwO3gnXWIzGUdKSTCVb.dnAnu8OqmV.JlHQ1MmBvylGNb6XVkPi', 'Admin', 'User', '1 Admin Way', '111-222-3333', 'admin'),
('staff_user', 'staff@technest.com', '$2b$10$yMfwO3gnXWIzGUdKSTCVb.dnAnu8OqmV.JlHQ1MmBvylGNb6XVkPi', 'Staff', 'Person', '2 Staff St', '444-555-6666', 'staff'),
('johndoe', 'john.doe@email.com', '$2b$10$yMfwO3gnXWIzGUdKSTCVb.dnAnu8OqmV.JlHQ1MmBvylGNb6XVkPi', 'John', 'Doe', '123 Maple Street', '123-456-7890', 'customer'),
('janesmith', 'jane.smith@email.com', '$2b$10$yMfwO3gnXWIzGUdKSTCVb.dnAnu8OqmV.JlHQ1MmBvylGNb6XVkPi', 'Jane', 'Smith', '456 Oak Avenue', '987-654-3210', 'customer');

-- Insert Categories
INSERT INTO categories (name, description) VALUES
('Smartphones', 'The latest and greatest smartphones from top brands.'),
('Laptops', 'Powerful laptops for work, gaming, and everyday use.'),
('Audio', 'Headphones, earbuds, and speakers for immersive sound.'),
('Gaming Peripherals', 'Mice, keyboards, and headsets for the ultimate gaming experience.'),
('Accessories', 'Chargers, cases, and other essential tech accessories.');

-- Insert Products
INSERT INTO products (name, description, price, category_id, currency_id, image_url, brand) VALUES
('TechPhone 12', 'A flagship smartphone with a stunning display and pro-grade camera.', 999.99, 1, 2, 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'TechBrand'),
('ProBook X', 'An ultrathin laptop with exceptional performance and all-day battery life.', 1299.99, 2, 2, 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', 'TechBrand'),
('SoundWave Buds', 'True wireless earbuds with active noise cancellation and rich audio.', 149.99, 3, 2, 'https://images.pexels.com/photos/4050289/pexels-photo-4050289.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'AudioPhile'),
('GamerKey Pro', 'A mechanical gaming keyboard with customizable RGB lighting.', 119.99, 4, 2, 'https://images.pexels.com/photos/7238759/pexels-photo-7238759.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'GamerGear'),
('PowerUp Charger', 'A fast-charging wall adapter for all your devices.', 29.99, 5, 2, 'https://images.pexels.com/photos/4050303/pexels-photo-4050303.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'TechBrand'),
('Stealth Mouse', 'A high-precision wireless gaming mouse with an ergonomic design.', 89.99, 4, 2, 'https://images.pexels.com/photos/459762/pexels-photo-459762.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260', 'GamerGear');

-- Populate Inventory
INSERT INTO inventory (product_id, stock_quantity) VALUES (1, 100) ON DUPLICATE KEY UPDATE stock_quantity = 100;
INSERT INTO inventory (product_id, stock_quantity) VALUES (2, 50) ON DUPLICATE KEY UPDATE stock_quantity = 50;
INSERT INTO inventory (product_id, stock_quantity) VALUES (3, 200) ON DUPLICATE KEY UPDATE stock_quantity = 200;
INSERT INTO inventory (product_id, stock_quantity) VALUES (4, 75) ON DUPLICATE KEY UPDATE stock_quantity = 75;
INSERT INTO inventory (product_id, stock_quantity) VALUES (5, 500) ON DUPLICATE KEY UPDATE stock_quantity = 500;
INSERT INTO inventory (product_id, stock_quantity) VALUES (6, 120) ON DUPLICATE KEY UPDATE stock_quantity = 120;

-- Create Carts for Customers
INSERT INTO cart (user_id) VALUES (3), (4);

-- Add Items to John Doe's Cart
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 1), -- John wants a TechPhone 12
(1, 4, 1); -- and a GamerKey Pro

-- Add Items to Jane Smith's Cart
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(2, 3, 2); -- Jane wants two pairs of SoundWave Buds

-- Create a past order for John Doe
INSERT INTO orders (user_id, total_amount, status, shipping_address, currency_id) VALUES
(3, 89.99, 'delivered', '123 Maple Street', 2);
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
(1, 6, 1, 89.99); -- An order for a Stealth Mouse

