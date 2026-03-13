-- Juice Shop Database Schema

CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT DEFAULT 'Fresh Juices'
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

-- Seed default menu items (matching frontend)
INSERT OR IGNORE INTO menu (id, name, price, category) VALUES
    (1, 'Watermelon', 60, 'Fresh Juices'),
    (2, 'Mango Shake', 80, 'Milkshakes'),
    (3, 'Fresh Lime', 40, 'Fresh Juices'),
    (4, 'Orange Juice', 70, 'Fresh Juices'),
    (5, 'Apple Juice', 90, 'Fresh Juices'),
    (6, 'Mixed Fruit', 85, 'Smoothies');
