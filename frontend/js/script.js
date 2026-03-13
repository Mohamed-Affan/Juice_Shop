/**
 * script.js
 * Frontend logic for Juice Shop – wired to real backend APIs.
 */

const API_BASE = '';  // Same origin when served by Flask

// ── Auth Guard ───────────────────────────────────────────────────────────────
async function checkAuth() {
    try {
        const res = await fetch(API_BASE + '/api/auth/check', { credentials: 'same-origin' });
        if (!res.ok) {
            window.location.href = '/login';
            return null;
        }
        return await res.json();
    } catch (e) {
        window.location.href = '/login';
        return null;
    }
}

async function doLogout() {
    try {
        await fetch(API_BASE + '/api/logout', {
            method: 'POST',
            credentials: 'same-origin'
        });
    } catch (_) { }
    window.location.href = '/login';
}


// ── Initialization ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    const authData = await checkAuth();
    if (!authData) return; // redirected

    // Set username in avatar tooltip if exists
    const avatarEl = document.querySelector('.user-profile .avatar');
    if (avatarEl) {
        avatarEl.title = `${authData.username} (${authData.role})`;
    }

    // Init based on current page
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


// ══════════════════════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════

let menuItems = [];

async function initAdminDashboard() {
    await loadMenuItems();
    await loadRecentOrders();
    await loadTodayStats();
}

/** Fetch menu items from API */
async function loadMenuItems() {
    try {
        const res = await fetch(API_BASE + '/api/menu', { credentials: 'same-origin' });
        menuItems = await res.json();
        renderMenuTable();
    } catch (e) {
        console.error('Failed to load menu:', e);
        menuItems = [];
        renderMenuTable();
    }
}

function renderMenuTable() {
    const tbody = document.getElementById('menu-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (menuItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color: var(--gray-500);">No menu items found.</td></tr>`;
        return;
    }

    menuItems.forEach(item => {
        const imageHtml = item.image_url
            ? `<img src="${item.image_url}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">`
            : `<div style="width: 40px; height: 40px; border-radius: 8px; background: var(--gray-200); display: flex; align-items: center; justify-content: center;"><i class="ph ph-image"></i></div>`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${imageHtml}
                    <strong>${item.name}</strong>
                </div>
            </td>
            <td>₹${item.price}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editMenuItem(${item.id})" title="Edit"><i class="ph ph-pencil-simple"></i></button>
                <button class="btn-danger" onclick="deleteMenuItem(${item.id})" title="Delete"><i class="ph ph-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/** Fetch recent orders from API */
async function loadRecentOrders() {
    const tbody = document.getElementById('recent-orders-body');
    if (!tbody) return;

    try {
        const res = await fetch(API_BASE + '/api/orders', { credentials: 'same-origin' });
        const orders = await res.json();
        tbody.innerHTML = '';

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--gray-500);">No orders today.</td></tr>`;
            return;
        }

        orders.slice(0, 10).forEach(order => {
            const statusClass = order.status.toLowerCase();
            const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${order.id}</td>
                <td>Table ${order.table_number}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td><strong>₹${order.total_amount}</strong></td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--gray-500);">Could not load orders.</td></tr>`;
    }
}

/** Fetch today's earnings & order count from API */
async function loadTodayStats() {
    const totalEarningsEl = document.getElementById('total-earnings');
    const totalOrdersEl = document.getElementById('total-orders');
    if (!totalEarningsEl || !totalOrdersEl) return;

    try {
        const res = await fetch(API_BASE + '/api/reports/today', { credentials: 'same-origin' });
        const data = await res.json();
        totalEarningsEl.textContent = `₹${data.total_revenue}`;
        totalOrdersEl.textContent = data.total_orders.toString();
    } catch (e) {
        totalEarningsEl.textContent = '₹0';
        totalOrdersEl.textContent = '0';
    }
}


// ── Menu Modal Logic (Admin) ─────────────────────────────────────────────────

function openMenuModal(item = null) {
    const modal = document.getElementById('menu-modal');
    const form = document.getElementById('menu-form');
    const title = document.getElementById('modal-title');
    const idInput = document.getElementById('item-id');
    const nameInput = document.getElementById('item-name');
    const priceInput = document.getElementById('item-price');
    const imageInput = document.getElementById('item-image');

    if (item) {
        title.textContent = 'Edit Menu Item';
        idInput.value = item.id;
        nameInput.value = item.name;
        priceInput.value = item.price;
        if (imageInput) imageInput.value = '';
    } else {
        title.textContent = 'Add Menu Item';
        form.reset();
        idInput.value = '';
        if (imageInput) imageInput.value = '';
    }

    modal.classList.add('active');
}

async function changePassword(role) {
    const inputId = `pass-${role}`;
    const newPassword = document.getElementById(inputId).value;

    if (!newPassword || newPassword.trim() === '') {
        alert('Please enter a valid password.');
        return;
    }

    try {
        const res = await fetch(API_BASE + `/api/users/${role}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ new_password: newPassword }),
            credentials: 'same-origin'
        });

        const data = await res.json();
        if (res.ok) {
            alert(`Success! Password for '${role}' changed to: ${newPassword}`);
            document.getElementById(inputId).value = '';
        } else {
            alert(data.error || 'Failed to update password');
        }
    } catch (e) {
        alert('Network error communicating with server.');
    }
}

function closeMenuModal() {
    const modal = document.getElementById('menu-modal');
    modal.classList.remove('active');
}

async function handleMenuSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const price = document.getElementById('item-price').value;
    const imageFile = document.getElementById('item-image').files[0];

    // Use FormData to allow file uploads
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        if (id) {
            // Update existing
            await fetch(API_BASE + `/api/menu/${id}`, {
                method: 'PUT',
                body: formData,
                credentials: 'same-origin'
            });
        } else {
            // Add new
            await fetch(API_BASE + '/api/menu', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });
        }
        closeMenuModal();
        await loadMenuItems();
    } catch (e) {
        alert('Failed to save menu item.');
    }
}

function editMenuItem(id) {
    const item = menuItems.find(i => i.id == id);
    if (item) {
        openMenuModal(item);
    }
}

async function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await fetch(API_BASE + `/api/menu/${id}`, {
                method: 'DELETE',
                credentials: 'same-origin'
            });
            await loadMenuItems();
        } catch (e) {
            alert('Failed to delete menu item.');
        }
    }
}


// ══════════════════════════════════════════════════════════════════════════════
//  COUNTER
// ══════════════════════════════════════════════════════════════════════════════

let cart = []; // Array of { item: Object, quantity: Number }

async function initCounter() {
    await loadCounterMenu();
    updateCartUI();
}

async function loadCounterMenu() {
    try {
        const res = await fetch(API_BASE + '/api/menu', { credentials: 'same-origin' });
        menuItems = await res.json();
        renderCounterMenu();
    } catch (e) {
        console.error('Failed to load menu for counter:', e);
    }
}

function renderCounterMenu() {
    const grid = document.getElementById('counter-menu-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const getIcon = (name) => {
        name = name.toLowerCase();
        if (name.includes('orange')) return 'ph-orange-slice';
        if (name.includes('apple')) return 'ph-apple-logo';
        if (name.includes('mango')) return 'ph-drop';
        if (name.includes('lime')) return 'ph-leaf';
        if (name.includes('watermelon')) return 'ph-thermometer-cold';
        return 'ph-brandy';
    };

    menuItems.forEach(item => {
        const imageElement = item.image_url
            ? `<div class="menu-item-icon" style="background: transparent;"><img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"></div>`
            : `<div class="menu-item-icon"><i class="ph-fill ${getIcon(item.name)}"></i></div>`;

        const card = document.createElement('div');
        card.className = 'menu-item-card';
        card.innerHTML = `
            ${imageElement}
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
        cart.push({ item: { ...item }, quantity: 1 });
    }

    updateCartUI();
}

function updateCartQuantity(itemId, delta) {
    const index = cart.findIndex(c => c.item.id === itemId);
    if (index !== -1) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
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

async function submitOrder() {
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

    const payload = {
        table_number: parseInt(tableNum),
        items: cart.map(c => ({ menu_id: c.item.id, quantity: c.quantity }))
    };

    try {
        const res = await fetch(API_BASE + '/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'same-origin'
        });

        const data = await res.json();

        if (res.ok) {
            // Show success toast
            const toast = document.getElementById('toast');
            if (toast) {
                toast.classList.remove('hidden');
                setTimeout(() => toast.classList.add('hidden'), 3000);
            }
            // Reset
            cart = [];
            tableInput.value = '';
            updateCartUI();
        } else {
            alert(data.error || 'Failed to place order.');
        }
    } catch (e) {
        alert('Network error. Is the server running?');
    }
}


// ══════════════════════════════════════════════════════════════════════════════
//  KITCHEN
// ══════════════════════════════════════════════════════════════════════════════

let kitchenOrders = [];
let kitchenTimerInterval = null;
let knownOrderIds = new Set(); // Track known orders for sound alerts
let newlyArrivedOrderIds = new Set(); // Track new orders to highlight

async function initKitchen() {
    await loadKitchenOrders(true); // Initial load, don't trigger sound

    // Refresh orders every 5 seconds
    setInterval(() => loadKitchenOrders(false), 5000);

    // Update timers every second
    if (kitchenTimerInterval) clearInterval(kitchenTimerInterval);
    kitchenTimerInterval = setInterval(updateKitchenTimers, 1000);
}

async function loadKitchenOrders(isInitialLoad = false) {
    try {
        // Fetch pending & preparing orders
        const res = await fetch(API_BASE + '/api/orders', { credentials: 'same-origin' });
        const allOrders = await res.json();

        // Only show pending and preparing
        kitchenOrders = allOrders.filter(o => o.status === 'pending' || o.status === 'preparing');

        // Check for new orders
        let hasNewOrders = false;
        if (!isInitialLoad) {
            kitchenOrders.forEach(o => {
                if (!knownOrderIds.has(o.id)) {
                    hasNewOrders = true;
                    newlyArrivedOrderIds.add(o.id);
                }
            });
        }

        // Update known IDs
        knownOrderIds.clear();
        kitchenOrders.forEach(o => knownOrderIds.add(o.id));

        if (hasNewOrders) {
            const alertSound = document.getElementById('order-alert-sound');
            if (alertSound) {
                alertSound.currentTime = 0;
                alertSound.play().catch(e => console.log('Audio play failed (maybe no interaction yet):', e));
            }
        }



        const now = new Date();
        // Only show pending and preparing, and precalculate elapsed time for sorting
        kitchenOrders = allOrders
            .filter(o => o.status === 'pending' || o.status === 'preparing')
            .map(o => {
                const orderTime = new Date(o.order_time);
                o.diffSeconds = Math.max(0, Math.floor((now - orderTime) / 1000));
                return o;
            });

        // Sort by longest wait time first (descending diffSeconds)
        kitchenOrders.sort((a, b) => b.diffSeconds - a.diffSeconds);


        renderKitchenGrid();
    } catch (e) {
        console.error('Failed to load kitchen orders:', e);
    }
}

function renderKitchenGrid() {
    const grid = document.getElementById('kitchen-grid');
    const noOrdersMsg = document.getElementById('no-orders-msg');
    if (!grid) return;

    grid.innerHTML = '';

    if (kitchenOrders.length === 0) {
        grid.classList.add('hidden');
        if (noOrdersMsg) noOrdersMsg.classList.remove('hidden');
        return;
    } else {
        grid.classList.remove('hidden');
        if (noOrdersMsg) noOrdersMsg.classList.add('hidden');
    }

    kitchenOrders.forEach(order => {
        const ticket = document.createElement('div');

        let highlightClass = '';
        if (newlyArrivedOrderIds.has(order.id)) {
            highlightClass = 'new-order-highlight';
            newlyArrivedOrderIds.delete(order.id); // Remove after highlighting once
        }

        ticket.className = `order-ticket ${order.status} ${highlightClass}`;
        ticket.id = `ticket-${order.id}`;

        // Parse items from items_summary string (e.g. "Mango Shake x2, Fresh Lime x1")
        let itemsHtml = '';
        if (order.items_summary) {
            order.items_summary.split(', ').forEach(itemStr => {
                const parts = itemStr.split(' x');
                const name = parts.slice(0, -1).join(' x');
                const qty = parts[parts.length - 1];
                itemsHtml += `
                    <div class="ticket-item">
                        <span class="ticket-item-qty">${qty}</span>
                        <span class="ticket-item-name">${name}</span>
                    </div>
                `;
            });
        }

        ticket.innerHTML = `
            <div class="order-ticket-header">
                <div class="ticket-table-no">Table ${order.table_number}</div>
                <div class="ticket-timer" id="timer-${order.id}">
                    <i class="ph ph-clock"></i>
                    <span class="timer-text">00:00</span>
                </div>
            </div>
            <div class="ticket-items-list">
                ${itemsHtml}
            </div>
            <button class="btn btn-primary w-100" onclick="completeOrder(${order.id})">
                <i class="ph ph-check-circle"></i> Mark Completed
            </button>
        `;
        grid.appendChild(ticket);
    });

    updateKitchenTimers();
}

function updateKitchenTimers() {
    const now = new Date();

    kitchenOrders.forEach(order => {
        const timerEl = document.getElementById(`timer-${order.id}`);
        if (!timerEl) return;

        // Parse order_time from DB
        const orderTime = new Date(order.order_time);
        const diffSeconds = Math.max(0, Math.floor((now - orderTime) / 1000));
        const mins = Math.floor(diffSeconds / 60).toString().padStart(2, '0');
        const secs = (diffSeconds % 60).toString().padStart(2, '0');

        const textSpan = timerEl.querySelector('.timer-text');
        if (textSpan) {
            textSpan.textContent = `${mins}:${secs}`;
        }


        // Color coding logic based on elapsed time
        const ticketEl = document.getElementById(`ticket-${order.id}`);
        if (ticketEl) {
            // Remove previous timer classes
            ticketEl.classList.remove('timer-green', 'timer-yellow', 'timer-red');

            const diffMinutes = diffSeconds / 60;
            if (diffMinutes >= 15) {
                ticketEl.classList.add('timer-red');
            } else if (diffMinutes >= 7) {
                ticketEl.classList.add('timer-yellow');
            } else {
                ticketEl.classList.add('timer-green');
            }
        }
    });
}

async function completeOrder(orderId) {
    try {
        const res = await fetch(API_BASE + `/api/orders/${orderId}/complete`, {
            method: 'PUT',
            credentials: 'same-origin'
        });

        if (res.ok) {
            const toast = document.getElementById('toast');
            if (toast) {
                toast.classList.remove('hidden');
                setTimeout(() => toast.classList.add('hidden'), 3000);
            }
            await loadKitchenOrders();
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to complete order.');
        }
    } catch (e) {
        alert('Network error.');
    }
}
