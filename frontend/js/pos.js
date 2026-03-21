// POS Logic
let menu = [];
let cart = {}; // Store items by productId: { product, quantity }

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Enforce Login and load user info
    const user = enforceLogin(['pos', 'admin']);
    if(!user) return; // Stop executing if not allowed

    document.getElementById('user-display').textContent = `Waiter: ${user.username}`;
    
    // 2. Fetch Menu
    await loadMenu();

    // 3. Setup event listeners
    document.getElementById('btn-place-order').addEventListener('click', placeOrder);
});

async function loadMenu() {
    try {
        const grid = document.getElementById('menu-grid');
        
        menu = await api.get('/menu');

        grid.innerHTML = '';
        if(!menu || menu.length === 0) {
            grid.innerHTML = '<div class="text-muted" style="grid-column: 1/-1;">No menu items available.</div>';
            return;
        }

        menu.forEach(item => {
            const div = document.createElement('div');
            div.className = 'menu-item';
            div.onclick = () => addToCart(item);
            div.innerHTML = `
                <img src="${item.image_url || 'https://via.placeholder.com/200?text=No+Image'}" alt="${item.name}" class="menu-img">
                <div class="menu-details">
                    <div class="menu-name">${item.name}</div>
                    <div class="menu-price">₹${item.price}</div>
                </div>
            `;
            grid.appendChild(div);
        });

    } catch (error) {
        showToast('Failed to load menu: ' + error.message, 'error');
        document.getElementById('menu-grid').innerHTML = '<div class="text-danger">Failed to load menu.</div>';
    }
}

function addToCart(product) {
    if (cart[product.id]) {
        cart[product.id].quantity += 1;
    } else {
        cart[product.id] = { product, quantity: 1 };
    }
    updateCartUI();
}

function adjustQty(productId, amount) {
    if (cart[productId]) {
        cart[productId].quantity += amount;
        if (cart[productId].quantity <= 0) {
            delete cart[productId];
        }
        updateCartUI();
    }
}

function updateCartUI() {
    const list = document.getElementById('cart-items');
    const emptyMsg = document.getElementById('empty-cart-msg');
    
    list.innerHTML = '';
    
    let total = 0;
    const itemIds = Object.keys(cart);

    if (itemIds.length === 0) {
        if(emptyMsg) list.appendChild(emptyMsg);
        else list.innerHTML = '<div class="text-center text-muted" id="empty-cart-msg">Cart is empty</div>';
    } else {
        itemIds.forEach(id => {
            const item = cart[id];
            const itemTotal = item.product.price * item.quantity;
            total += itemTotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.product.name}</span>
                    <span class="cart-item-price">₹${item.product.price} x ${item.quantity} = ₹${itemTotal}</span>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="adjustQty('${id}', -1)">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" onclick="adjustQty('${id}', 1)">+</button>
                </div>
            `;
            list.appendChild(div);
        });
    }

    document.getElementById('cart-total').textContent = `₹${total}`;
}

async function placeOrder() {
    const tableEl = document.getElementById('table-number');
    const typeEl = document.getElementById('order-type');
    const tableNumber = parseInt(tableEl.value);
    const orderType = typeEl.value;

    if (!tableNumber) {
        showToast('Please enter a valid table number', 'error');
        tableEl.focus();
        return;
    }

    const itemIds = Object.keys(cart);
    if (itemIds.length === 0) {
        showToast('Cart is empty', 'error');
        return;
    }

    const orderItems = itemIds.map(id => ({
        menu_id: id,
        quantity: cart[id].quantity
    }));

    try {
        const btn = document.getElementById('btn-place-order');
        btn.disabled = true;
        btn.textContent = 'Processing...';

        await api.post('/orders', {
            table_number: tableNumber,
            order_type: orderType,
            items: orderItems,
        });

        showToast('Order Placed Successfully!');
        
        // Print Bill
        printBill(tableNumber, orderType);

        // Reset POS
        cart = {};
        updateCartUI();
        tableEl.value = '';

    } catch (error) {
        showToast('Failed to place order: ' + error.message, 'error');
    } finally {
        const btn = document.getElementById('btn-place-order');
        btn.disabled = false;
        btn.textContent = 'Place Order & Print';
    }
}

function printBill(table, type) {
    document.getElementById('bill-table').textContent = table;
    document.getElementById('bill-type').textContent = type.toUpperCase();
    document.getElementById('bill-date').textContent = new Date().toLocaleString();
    
    const tbody = document.getElementById('bill-items');
    tbody.innerHTML = `
        <tr>
            <th style="border-bottom:1px solid #ccc">Item</th>
            <th style="border-bottom:1px solid #ccc; text-align:right">Qty</th>
            <th style="border-bottom:1px solid #ccc; text-align:right">Amt</th>
        </tr>
    `;
    
    let total = 0;
    Object.keys(cart).forEach(id => {
        const item = cart[id];
        const amt = item.product.price * item.quantity;
        total += amt;
        tbody.innerHTML += `
            <tr>
                <td>${item.product.name}</td>
                <td style="text-align:right">${item.quantity}</td>
                <td style="text-align:right">${amt}</td>
            </tr>
        `;
    });

    document.getElementById('bill-total').textContent = total;

    // Trigger browser print
    window.print();
}
