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

-- Products Table: Stores details about each product.
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    category_id INT NOT NULL,
    image_url VARCHAR(255),
    brand VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Inventory Table: Manages stock levels for each product.
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Cart Table: A persistent cart for each user.
CREATE TABLE IF NOT EXISTS cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Cart Items Table: Links products to a user's cart.
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

-- Orders Table: Stores information about customer orders.
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Order Items Table: Links products to specific orders.
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase >= 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Audit Logs Table: Tracks important changes in the database.
CREATE TABLE IF NOT EXISTS audit_logs (
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


-- ==============================
--          TRIGGERS
-- ==============================

DELIMITER $$

-- Prevents inserting an order item if stock is insufficient.
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

-- Decreases stock quantity after an order item is inserted.
CREATE TRIGGER after_insert_order_item_decrease_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE inventory SET stock_quantity = stock_quantity - NEW.quantity, last_updated = CURRENT_TIMESTAMP WHERE product_id = NEW.product_id;
END$$

-- Increases stock quantity if an order is cancelled.
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

-- Updates the total order amount after inserting a new order item.
CREATE TRIGGER after_insert_order_item_update_order_total
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE orders
    SET total_amount = (SELECT SUM(quantity * price_at_purchase) FROM order_items WHERE order_id = NEW.order_id)
    WHERE order_id = NEW.order_id;
END$$

-- Updates the total order amount after deleting an order item.
CREATE TRIGGER after_delete_order_item_update_order_total
AFTER DELETE ON order_items
FOR EACH ROW
BEGIN
    UPDATE orders
    SET total_amount = COALESCE((SELECT SUM(quantity * price_at_purchase) FROM order_items WHERE order_id = OLD.order_id), 0.00)
    WHERE order_id = OLD.order_id;
END$$

-- Prevents updating a product price to a negative value.
CREATE TRIGGER before_update_product_price_check_zero
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.price < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product price cannot be negative.';
    END IF;
END$$

-- Prevents deleting a user if they have existing orders.
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

-- Logs changes to product prices.
CREATE TRIGGER log_product_price_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF OLD.price <> NEW.price THEN
        INSERT INTO audit_logs (action_type, table_name, record_id, old_value, new_value)
        VALUES ('UPDATE_PRODUCT_PRICE', 'products', NEW.product_id, OLD.price, NEW.price);
    END IF;
END$$

DELIMITER ;

-- ==============================
--      STORED PROCEDURES
-- ==============================

DELIMITER $$

-- Retrieves full details for a specific product.
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

-- Retrieves a list of users with pending or processing orders.
CREATE PROCEDURE GetUsersWithPendingOrders()
BEGIN
    SELECT DISTINCT u.user_id, u.username, u.email, u.first_name, u.last_name, u.phone_number
    FROM users u
    JOIN orders o ON u.user_id = o.user_id
    WHERE o.status IN ('pending', 'processing');
END$$

-- Creates a new order from a user's cart and clears the cart.
CREATE PROCEDURE CreateOrderFromCart(IN p_user_id INT, IN p_shipping_address TEXT)
BEGIN
    DECLARE v_cart_id INT;
    DECLARE v_order_id INT;

    SELECT cart_id INTO v_cart_id FROM cart WHERE user_id = p_user_id;

    IF v_cart_id IS NOT NULL AND (SELECT COUNT(*) FROM cart_items WHERE cart_id = v_cart_id) > 0 THEN
        INSERT INTO orders (user_id, shipping_address, total_amount, status)
        VALUES (p_user_id, p_shipping_address, 0.00, 'pending');
        SET v_order_id = LAST_INSERT_ID();

        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        SELECT v_order_id, ci.product_id, ci.quantity, p.price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.product_id
        WHERE ci.cart_id = v_cart_id;

        DELETE FROM cart_items WHERE cart_id = v_cart_id;

        SELECT v_order_id AS new_order_id;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cart is empty or does not exist.';
    END IF;
END$$

DELIMITER ;

-- ==============================
--          MOCK DATA
-- ==============================

-- Insert Users (Admin, Staff, Customer)
INSERT INTO users (username, email, password_hash, first_name, last_name, address, phone_number, role) VALUES
('admin_user', 'admin@technest.com', '$2b$10$examplehash.admin', 'Admin', 'User', '1 Admin Way', '111-222-3333', 'admin'),
('staff_user', 'staff@technest.com', '$2b$10$examplehash.staff', 'Staff', 'Person', '2 Staff St', '444-555-6666', 'staff'),
('johndoe', 'john.doe@email.com', '$2b$10$examplehash.customer', 'John', 'Doe', '123 Maple Street', '123-456-7890', 'customer'),
('janesmith', 'jane.smith@email.com', '$2b$10$examplehash.customer2', 'Jane', 'Smith', '456 Oak Avenue', '987-654-3210', 'customer');

-- Insert Categories
INSERT INTO categories (name, description) VALUES
('Smartphones', 'The latest and greatest smartphones from top brands.'),
('Laptops', 'Powerful laptops for work, gaming, and everyday use.'),
('Audio', 'Headphones, earbuds, and speakers for immersive sound.'),
('Gaming Peripherals', 'Mice, keyboards, and headsets for the ultimate gaming experience.'),
('Accessories', 'Chargers, cases, and other essential tech accessories.');

-- Insert Products
INSERT INTO products (name, description, price, category_id, image_url, brand) VALUES
('TechPhone 12', 'A flagship smartphone with a stunning display and pro-grade camera.', 999.99, 1, '/images/techphone12.jpg', 'TechBrand'),
('ProBook X', 'An ultrathin laptop with exceptional performance and all-day battery life.', 1299.99, 2, '/images/probookx.jpg', 'TechBrand'),
('SoundWave Buds', 'True wireless earbuds with active noise cancellation and rich audio.', 149.99, 3, '/images/soundwavebuds.jpg', 'AudioPhile'),
('GamerKey Pro', 'A mechanical gaming keyboard with customizable RGB lighting.', 119.99, 4, '/images/gamerkeypro.jpg', 'GamerGear'),
('PowerUp Charger', 'A fast-charging wall adapter for all your devices.', 29.99, 5, '/images/powerupcharger.jpg', 'TechBrand'),
('Stealth Mouse', 'A high-precision wireless gaming mouse with an ergonomic design.', 89.99, 4, '/images/stealthmouse.jpg', 'GamerGear');

-- Populate Inventory
INSERT INTO inventory (product_id, stock_quantity) VALUES
(1, 100),
(2, 50),
(3, 200),
(4, 75),
(5, 500),
(6, 120);

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
INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES
(3, 89.99, 'delivered', '123 Maple Street');
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
(1, 6, 1, 89.99); -- An order for a Stealth Mouse
