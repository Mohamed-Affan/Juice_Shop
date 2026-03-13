/**
 * script.js
 * Contains frontend logic, using mock data for now since APIs are not ready.
 */

// --- Global Mock Data ---
let menuItems = [
    { id: 1, name: 'Mango Juice', price: 100 },
    { id: 2, name: 'Orange Juice', price: 80 },
    { id: 3, name: 'Apple Juice', price: 90 }
];

let orders = [
    { id: 'ORD001', table: 5, status: 'completed', total: 280 },
    { id: 'ORD002', table: 2, status: 'preparing', total: 180 },
    { id: 'ORD003', table: 4, status: 'pending', total: 90 }
];


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on based on URL or elements present
    if (document.getElementById('menu-table-body')) {
        initAdminDashboard();
    }
    
    if (document.getElementById('counter-menu-grid')) {
        initCounter();
    }
    
    if (document.getElementById('kitchen-grid')) {
        initKitchen();
    }
});

// --- Admin Dashboard Logic ---

function initAdminDashboard() {
    renderMenuTable();
    renderRecentOrders();
    updateStatsGrid();
}

/**
 * Renders the menu table dynamically
 */
function renderMenuTable() {
    const tbody = document.getElementById('menu-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (menuItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--gray-500);">No menu items found.</td></tr>`;
        return;
    }

    menuItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>₹${item.price}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editMenuItem(${item.id})" title="Edit"><i class="ph ph-pencil-simple"></i></button>
                <button class="btn-danger" onclick="deleteMenuItem(${item.id})" title="Delete"><i class="ph ph-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Renders the recent orders summary on admin page
 */
function renderRecentOrders() {
    const tbody = document.getElementById('recent-orders-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const recent = orders.slice(0, 5); // Just show top 5 for summary
    
    if (recent.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--gray-500);">No orders today.</td></tr>`;
        return;
    }

    recent.forEach(order => {
        const statusClass = order.status.toLowerCase();
        // Capitalize first letter of status
        const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>Table ${order.table}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td><strong>₹${order.total}</strong></td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Updates the totals cards
 */
function updateStatsGrid() {
    const totalEarningsEl = document.getElementById('total-earnings');
    const totalOrdersEl = document.getElementById('total-orders');
    
    if (totalEarningsEl && totalOrdersEl) {
        // Calculate earnings (only completed orders in a real system, but let's just sum all for demo or only completed)
        const completedOnly = orders.filter(o => o.status === 'completed');
        const earnings = completedOnly.reduce((sum, order) => sum + order.total, 0);
        
        totalEarningsEl.textContent = `₹${earnings}`;
        totalOrdersEl.textContent = orders.length.toString();
    }
}

// --- Menu Modal Logic ---

function openMenuModal(item = null) {
    const modal = document.getElementById('menu-modal');
    const form = document.getElementById('menu-form');
    const title = document.getElementById('modal-title');
    const idInput = document.getElementById('item-id');
    const nameInput = document.getElementById('item-name');
    const priceInput = document.getElementById('item-price');

    if (item) {
        title.textContent = 'Edit Menu Item';
        idInput.value = item.id;
        nameInput.value = item.name;
        priceInput.value = item.price;
    } else {
        title.textContent = 'Add Menu Item';
        form.reset();
        idInput.value = '';
    }

    modal.classList.add('active');
}

function closeMenuModal() {
    const modal = document.getElementById('menu-modal');
    modal.classList.remove('active');
}

function handleMenuSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const price = parseInt(document.getElementById('item-price').value);

    if (id) {
        // Edit existing
        const index = menuItems.findIndex(i => i.id == id);
        if (index !== -1) {
            menuItems[index] = { id: parseInt(id), name, price };
        }
    } else {
        // Add new
        const newId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
        menuItems.push({ id: newId, name, price });
    }

    closeMenuModal();
    renderMenuTable();
}

function editMenuItem(id) {
    const item = menuItems.find(i => i.id == id);
    if (item) {
        openMenuModal(item);
    }
}

function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        menuItems = menuItems.filter(i => i.id != id);
        renderMenuTable();
    }
}

// --- Counter Logic ---

let cart = []; // Array of { item: Object, quantity: Number }

function initCounter() {
    renderCounterMenu();
    updateCartUI();
}

/**
 * Render the menu grid on the Counter page
 */
function renderCounterMenu() {
    const grid = document.getElementById('counter-menu-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Choose an icon based on name (mocking different icons for juices)
    const getIcon = (name) => {
        name = name.toLowerCase();
        if (name.includes('orange')) return 'ph-orange-slice';
        if (name.includes('apple')) return 'ph-apple-logo';
        return 'ph-brandy'; // default glass
    };

    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-item-card';
        card.innerHTML = `
            <div class="menu-item-icon">
                <i class="ph-fill ${getIcon(item.name)}"></i>
            </div>
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">₹${item.price}</div>
            <button class="btn btn-secondary w-100" onclick="addToCart(${item.id})">
                <i class="ph ph-plus"></i> Add
            </button>
        `;
        grid.appendChild(card);
    });
}

function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    const existing = cart.find(c => c.item.id === itemId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ item: {...item}, quantity: 1 });
    }
    
    updateCartUI();
}

function updateCartQuantity(itemId, delta) {
    const index = cart.findIndex(c => c.item.id === itemId);
    if (index !== -1) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1); // remove item
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!cartContainer || !totalEl) return;

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `<div class="empty-cart-msg">No items selected</div>`;
        totalEl.textContent = '₹0';
        return;
    }

    let total = 0;

    cart.forEach(c => {
        const itemTotal = c.item.price * c.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${c.item.name}</div>
                <div class="cart-item-price">₹${c.item.price} &times; ${c.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateCartQuantity(${c.item.id}, -1)">
                    <i class="ph ph-minus"></i>
                </button>
                <div class="item-qty">${c.quantity}</div>
                <button class="qty-btn" onclick="updateCartQuantity(${c.item.id}, 1)">
                    <i class="ph ph-plus"></i>
                </button>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    totalEl.textContent = `₹${total}`;
}

function submitOrder() {
    const tableInput = document.getElementById('table-num');
    const tableNum = tableInput.value;

    if (!tableNum) {
        alert("Please enter a table number.");
        return;
    }

    if (cart.length === 0) {
        alert("Cart is empty. Please add items.");
        return;
    }

    // In a real app, this would send an API request (POST /api/orders)
    // For now, we simulate success and show toast
    
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // Reset Counter UI
    cart = [];
    tableInput.value = '';
    updateCartUI();
}

// --- Kitchen Logic ---

// Mocking some incoming detailed orders for Kitchen
let kitchenOrders = [
    {
        id: 'ORD004',
        table: 3,
        status: 'preparing',
        placedAt: new Date(Date.now() - 300000), // 5 mins ago
        items: [
            { name: 'Mango Juice', quantity: 2 },
            { name: 'Apple Juice', quantity: 1 }
        ]
    },
    {
        id: 'ORD005',
        table: 7,
        status: 'pending',
        placedAt: new Date(Date.now() - 60000), // 1 min ago
        items: [
            { name: 'Orange Juice', quantity: 3 }
        ]
    }
];

let kitchenTimerInterval = null;

function initKitchen() {
    renderKitchenGrid();
    
    // Start interval to update timers every second
    if (kitchenTimerInterval) clearInterval(kitchenTimerInterval);
    kitchenTimerInterval = setInterval(updateKitchenTimers, 1000);
}

function renderKitchenGrid() {
    const grid = document.getElementById('kitchen-grid');
    const noOrdersMsg = document.getElementById('no-orders-msg');
    if (!grid) return;

    grid.innerHTML = '';
    
    // Filter out completed ones, only show pending/preparing
    const activeOrders = kitchenOrders.filter(o => o.status !== 'completed');

    if (activeOrders.length === 0) {
        grid.classList.add('hidden');
        if (noOrdersMsg) noOrdersMsg.classList.remove('hidden');
        return;
    } else {
        grid.classList.remove('hidden');
        if (noOrdersMsg) noOrdersMsg.classList.add('hidden');
    }

    activeOrders.forEach(order => {
        const ticket = document.createElement('div');
        ticket.className = `order-ticket ${order.status}`;
        
        // Items HTML
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <div class="ticket-item">
                    <span class="ticket-item-qty">${item.quantity}</span>
                    <span class="ticket-item-name">${item.name}</span>
                </div>
            `;
        });

        ticket.innerHTML = `
            <div class="order-ticket-header">
                <div class="ticket-table-no">Table ${order.table}</div>
                <div class="ticket-timer" id="timer-${order.id}">
                    <i class="ph ph-clock"></i>
                    <span class="timer-text">00:00</span>
                </div>
            </div>
            <div class="ticket-items-list">
                ${itemsHtml}
            </div>
            <button class="btn btn-primary w-100" onclick="completeOrder('${order.id}')">
                <i class="ph ph-check-circle"></i> Mark Completed
            </button>
        `;
        grid.appendChild(ticket);
    });

    updateKitchenTimers(); // immediately calculate times
}

function updateKitchenTimers() {
    const activeOrders = kitchenOrders.filter(o => o.status !== 'completed');
    const now = new Date();

    activeOrders.forEach(order => {
        const timerEl = document.getElementById(`timer-${order.id}`);
        if (!timerEl) return;

        const diffSeconds = Math.floor((now - order.placedAt) / 1000);
        const mins = Math.floor(diffSeconds / 60).toString().padStart(2, '0');
        const secs = (diffSeconds % 60).toString().padStart(2, '0');
        
        const textSpan = timerEl.querySelector('.timer-text');
        if (textSpan) {
            textSpan.textContent = `${mins}:${secs}`;
        }

        // Highlight if order is older than 10 mins (600s)
        if (diffSeconds > 600) {
            timerEl.classList.add('urgent');
        } else {
            timerEl.classList.remove('urgent');
        }
    });
}

function completeOrder(orderId) {
    const orderIndex = kitchenOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        kitchenOrders[orderIndex].status = 'completed';
        
        // Show success toast
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.remove('hidden');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
        
        // Re-render
        renderKitchenGrid();
    }
}
