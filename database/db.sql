-- Juice Shop Database Schema

CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT DEFAULT 'Fresh Juices',
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_number INTEGER,
    order_time TEXT DEFAULT (datetime('now', 'localtime')),
    status TEXT DEFAULT 'pending',
    total_amount REAL NOT NULL,
    payment_method TEXT DEFAULT 'cash',
    order_type TEXT DEFAULT 'dine-in'
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    menu_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menu(id)
);

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'counter', 'kitchen'))
);

-- Seed default menu items (matching frontend)
INSERT OR IGNORE INTO menu (id, name, price, category, image_url) VALUES
    (1, 'Watermelon', 60, 'Fresh Juices', NULL),
    (2, 'Mango Shake', 80, 'Milkshakes', NULL),
    (3, 'Fresh Lime', 40, 'Fresh Juices', NULL),
    (4, 'Orange Juice', 70, 'Fresh Juices', NULL),
    (5, 'Apple Juice', 90, 'Fresh Juices', NULL),
    (6, 'Mixed Fruit', 85, 'Smoothies', NULL);

-- Seed default users (passwords will be hashed at runtime by init_db)
-- admin/admin123, counter/counter123, kitchen/kitchen123
