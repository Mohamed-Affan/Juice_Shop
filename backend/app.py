import os
import sqlite3
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory, session, redirect
from flask_cors import CORS
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash

# ── App Setup ──────────────────────────────────────────────────────────────────
app = Flask(__name__)
app.secret_key = 'juice-shop-secret-key-2026'
CORS(app, supports_credentials=True)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, '..', 'database', 'juice_shop.db')
SCHEMA_PATH = os.path.join(BASE_DIR, '..', 'database', 'db.sql')
FRONTEND_DIR = os.path.join(BASE_DIR, '..', 'frontend')


# ── Database Helpers ───────────────────────────────────────────────────────────
def get_db():
    """Return a database connection with row-factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """Create tables and seed data if the database doesn't exist yet."""
    db_exists = os.path.exists(DB_PATH)
    conn = get_db()

    # Always run schema (uses IF NOT EXISTS so safe to re-run)
    with open(SCHEMA_PATH, 'r') as f:
        conn.executescript(f.read())
    conn.commit()

    # Seed default users if not present
    existing = conn.execute('SELECT COUNT(*) as c FROM users').fetchone()['c']
    if existing == 0:
        default_users = [
            ('admin', generate_password_hash('admin123'), 'admin'),
            ('counter', generate_password_hash('counter123'), 'counter'),
            ('kitchen', generate_password_hash('kitchen123'), 'kitchen'),
        ]
        conn.executemany(
            'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
            default_users
        )
        conn.commit()
        print("✅ Default users created (admin, counter, kitchen)")

    if not db_exists:
        print("✅ Database initialized with schema + seed data")
    conn.close()


# ── Auth Helpers ───────────────────────────────────────────────────────────────
def login_required(f):
    """Decorator: reject with 401 if user is not logged in."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated


def admin_required(f):
    """Decorator: reject with 403 if user is not an admin."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        if session.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated


# ── Auth API ───────────────────────────────────────────────────────────────────
@app.route('/api/login', methods=['POST'])
def login():
    """Authenticate user. Body: {username, password}"""
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password are required'}), 400

    conn = get_db()
    user = conn.execute(
        'SELECT * FROM users WHERE username = ?', (data['username'],)
    ).fetchone()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401

    session['user_id'] = user['id']
    session['username'] = user['username']
    session['role'] = user['role']

    return jsonify({
        'message': 'Login successful',
        'role': user['role'],
        'username': user['username']
    })


@app.route('/api/auth/check', methods=['GET'])
def auth_check():
    """Check if user is authenticated."""
    if 'user_id' in session:
        return jsonify({
            'authenticated': True,
            'role': session['role'],
            'username': session['username']
        })
    return jsonify({'authenticated': False}), 401


@app.route('/api/logout', methods=['POST'])
def logout():
    """Clear session."""
    session.clear()
    return jsonify({'message': 'Logged out successfully'})


# ── Serve Frontend ─────────────────────────────────────────────────────────────
@app.route('/')
def serve_index():
    return send_from_directory(FRONTEND_DIR, 'index.html')


@app.route('/login')
def serve_login():
    return send_from_directory(FRONTEND_DIR, 'login.html')


@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(FRONTEND_DIR, filename)


# ── Menu API ───────────────────────────────────────────────────────────────────
@app.route('/api/menu', methods=['GET'])
def get_menu():
    """List all menu items. Optional query: ?category=Fresh+Juices"""
    conn = get_db()
    category = request.args.get('category')
    if category:
        rows = conn.execute(
            'SELECT * FROM menu WHERE category = ?', (category,)
        ).fetchall()
    else:
        rows = conn.execute('SELECT * FROM menu').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/menu', methods=['POST'])
@admin_required
def add_menu_item():
    """Add a new menu item. Body: {name, price, category?}"""
    data = request.get_json()
    if not data or not data.get('name') or data.get('price') is None:
        return jsonify({'error': 'name and price are required'}), 400

    conn = get_db()
    cur = conn.execute(
        'INSERT INTO menu (name, price, category) VALUES (?, ?, ?)',
        (data['name'], float(data['price']), data.get('category', 'Fresh Juices'))
    )
    conn.commit()
    item_id = cur.lastrowid
    conn.close()
    return jsonify({'id': item_id, 'message': 'Menu item added'}), 201


@app.route('/api/menu/<int:item_id>', methods=['PUT'])
@admin_required
def update_menu_item(item_id):
    """Update a menu item. Body: {name?, price?, category?}"""
    data = request.get_json()
    conn = get_db()
    item = conn.execute('SELECT * FROM menu WHERE id = ?', (item_id,)).fetchone()
    if not item:
        conn.close()
        return jsonify({'error': 'Item not found'}), 404

    conn.execute(
        'UPDATE menu SET name = ?, price = ?, category = ? WHERE id = ?',
        (
            data.get('name', item['name']),
            float(data.get('price', item['price'])),
            data.get('category', item['category']),
            item_id
        )
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Menu item updated'})


@app.route('/api/menu/<int:item_id>', methods=['DELETE'])
@admin_required
def delete_menu_item(item_id):
    """Delete a menu item by ID."""
    conn = get_db()
    result = conn.execute('DELETE FROM menu WHERE id = ?', (item_id,))
    conn.commit()
    if result.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Item not found'}), 404
    conn.close()
    return jsonify({'message': 'Menu item deleted'})


# ── Orders API ─────────────────────────────────────────────────────────────────
@app.route('/api/orders', methods=['POST'])
@login_required
def create_order():
    """
    Create a new order.
    Body: {
        table_number: int,
        items: [{menu_id: int, quantity: int}, ...],
        payment_method?: "cash" | "upi",
        order_type?: "dine-in" | "takeout"
    }
    """
    data = request.get_json()
    if not data or not data.get('items'):
        return jsonify({'error': 'items are required'}), 400

    conn = get_db()

    # Calculate total from actual menu prices
    total = 0.0
    validated_items = []
    for item in data['items']:
        menu_row = conn.execute(
            'SELECT * FROM menu WHERE id = ?', (item['menu_id'],)
        ).fetchone()
        if not menu_row:
            conn.close()
            return jsonify({'error': f'Menu item {item["menu_id"]} not found'}), 404
        qty = int(item.get('quantity', 1))
        total += menu_row['price'] * qty
        validated_items.append({'menu_id': menu_row['id'], 'quantity': qty})

    # Apply 5% tax
    tax = round(total * 0.05, 2)
    grand_total = round(total + tax, 2)

    cur = conn.execute(
        '''INSERT INTO orders (table_number, total_amount, payment_method, order_type)
           VALUES (?, ?, ?, ?)''',
        (
            data.get('table_number', 0),
            grand_total,
            data.get('payment_method', 'cash'),
            data.get('order_type', 'dine-in')
        )
    )
    order_id = cur.lastrowid

    for vi in validated_items:
        conn.execute(
            'INSERT INTO order_items (order_id, menu_id, quantity) VALUES (?, ?, ?)',
            (order_id, vi['menu_id'], vi['quantity'])
        )

    conn.commit()
    conn.close()
    return jsonify({
        'id': order_id,
        'total_amount': grand_total,
        'subtotal': total,
        'tax': tax,
        'message': 'Order placed successfully'
    }), 201


@app.route('/api/orders', methods=['GET'])
@login_required
def get_orders():
    """
    List orders. Optional query: ?status=pending|preparing|completed|paid
    Default: returns all non-paid orders (active orders).
    """
    conn = get_db()
    status = request.args.get('status')
    if status:
        rows = conn.execute(
            '''SELECT o.*, GROUP_CONCAT(m.name || ' x' || oi.quantity, ', ') as items_summary
               FROM orders o
               LEFT JOIN order_items oi ON o.id = oi.order_id
               LEFT JOIN menu m ON oi.menu_id = m.id
               WHERE o.status = ?
               GROUP BY o.id
               ORDER BY o.order_time DESC''',
            (status,)
        ).fetchall()
    else:
        rows = conn.execute(
            '''SELECT o.*, GROUP_CONCAT(m.name || ' x' || oi.quantity, ', ') as items_summary
               FROM orders o
               LEFT JOIN order_items oi ON o.id = oi.order_id
               LEFT JOIN menu m ON oi.menu_id = m.id
               WHERE o.status != 'paid'
               GROUP BY o.id
               ORDER BY o.order_time DESC'''
        ).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/orders/<int:order_id>', methods=['GET'])
@login_required
def get_order(order_id):
    """Get a single order with its item details."""
    conn = get_db()
    order = conn.execute('SELECT * FROM orders WHERE id = ?', (order_id,)).fetchone()
    if not order:
        conn.close()
        return jsonify({'error': 'Order not found'}), 404

    items = conn.execute(
        '''SELECT oi.quantity, m.id as menu_id, m.name, m.price
           FROM order_items oi
           JOIN menu m ON oi.menu_id = m.id
           WHERE oi.order_id = ?''',
        (order_id,)
    ).fetchall()
    conn.close()

    result = dict(order)
    result['items'] = [dict(i) for i in items]
    return jsonify(result)


@app.route('/api/orders/<int:order_id>/complete', methods=['PUT'])
@login_required
def complete_order(order_id):
    """Mark an order as completed (kitchen finished)."""
    conn = get_db()
    result = conn.execute(
        "UPDATE orders SET status = 'completed' WHERE id = ? AND status IN ('pending', 'preparing')",
        (order_id,)
    )
    conn.commit()
    if result.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Order not found or already completed/paid'}), 404
    conn.close()
    return jsonify({'message': 'Order marked as completed'})


@app.route('/api/orders/<int:order_id>/paid', methods=['PUT'])
@login_required
def mark_paid(order_id):
    """Mark an order as paid."""
    conn = get_db()
    result = conn.execute(
        "UPDATE orders SET status = 'paid' WHERE id = ? AND status = 'completed'",
        (order_id,)
    )
    conn.commit()
    if result.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Order not found or not yet completed'}), 404
    conn.close()
    return jsonify({'message': 'Order marked as paid'})


# ── Reports API ────────────────────────────────────────────────────────────────
@app.route('/api/reports/today', methods=['GET'])
@login_required
def today_report():
    """Get today's sales summary."""
    conn = get_db()
    today = date.today().isoformat()

    stats = conn.execute(
        '''SELECT
               COUNT(*) as total_orders,
               COALESCE(SUM(total_amount), 0) as total_revenue
           FROM orders
           WHERE date(order_time) = ?''',
        (today,)
    ).fetchone()

    status_counts = conn.execute(
        '''SELECT status, COUNT(*) as count
           FROM orders
           WHERE date(order_time) = ?
           GROUP BY status''',
        (today,)
    ).fetchall()

    conn.close()
    return jsonify({
        'date': today,
        'total_orders': stats['total_orders'],
        'total_revenue': round(stats['total_revenue'], 2),
        'by_status': {r['status']: r['count'] for r in status_counts}
    })


# ── Run ────────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    init_db()
    print(f"🍹 Juice Shop backend running at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)