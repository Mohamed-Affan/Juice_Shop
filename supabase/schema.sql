-- Schema for COME BRO CHILL BRO Juice Shop Management System
-- Updated to be idempotent (safe to run multiple times)

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'pos',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Table
CREATE TABLE IF NOT EXISTS menu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price > 0),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_number INTEGER NOT NULL,
    order_type TEXT NOT NULL DEFAULT 'dine-in',
    status TEXT NOT NULL DEFAULT 'pending',
    total_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_id UUID REFERENCES menu(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for Users table (DROP before CREATE to ensure updates)
DO $$ BEGIN
    DROP POLICY IF EXISTS "Enable initial seed" ON users;
    DROP POLICY IF EXISTS "Allow public read for users" ON users;
    CREATE POLICY "Enable initial seed" ON users FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public read for users" ON users FOR SELECT USING (true);
END $$;

-- Policies for Menu table
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow public read for menu" ON menu;
    DROP POLICY IF EXISTS "Admin full access for menu" ON menu;
    CREATE POLICY "Allow public read for menu" ON menu FOR SELECT USING (true);
    CREATE POLICY "Admin full access for menu" ON menu FOR ALL USING (true);
END $$;

-- Policies for Orders table
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow authenticated read for orders" ON orders;
    DROP POLICY IF EXISTS "Allow insert for orders" ON orders;
    DROP POLICY IF EXISTS "Allow update for kitchen" ON orders;
    CREATE POLICY "Allow authenticated read for orders" ON orders FOR SELECT USING (true);
    CREATE POLICY "Allow insert for orders" ON orders FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow update for kitchen" ON orders FOR UPDATE USING (true);
END $$;

-- Policies for Order Items table
DO $$ BEGIN
    DROP POLICY IF EXISTS "Allow read for order items" ON order_items;
    DROP POLICY IF EXISTS "Allow insert for order items" ON order_items;
    CREATE POLICY "Allow read for order items" ON order_items FOR SELECT USING (true);
    CREATE POLICY "Allow insert for order items" ON order_items FOR INSERT WITH CHECK (true);
END $$;
