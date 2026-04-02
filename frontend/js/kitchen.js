// KDS Logic
let orders = [];
let pollingInterval;
let timersInterval;
const alertSound = document.getElementById('alert-sound');

document.addEventListener('DOMContentLoaded', () => {
    const user = enforceLogin(['kitchen', 'admin']);
    if(!user) return;
    
    document.getElementById('user-display').textContent = `Kitchen Staff: ${user.username}`;
    
    // Initial fetch
    fetchOrders();

    // Poll for new orders every 5 seconds
    pollingInterval = setInterval(fetchOrders, 5000);
    
    // Update timers every second
    timersInterval = setInterval(updateTimersUI, 1000);
});

async function fetchOrders() {
    try {
        const newOrders = await api.get('/orders/active');

        // Check if new orders arrived (play sound)
        if (orders.length > 0 && newOrders.length > orders.length) {
            playAlertSound();
        }

        orders = newOrders || [];
        renderOrders();
    } catch (error) {
        console.error("Failed to fetch orders:", error);
    }
}

function renderOrders() {
    const grid = document.getElementById('order-grid');
    if (!orders || orders.length === 0) {
        grid.innerHTML = '<div class="text-center text-muted" style="grid-column: 1 / -1; margin-top: 50px; font-size: 1.2rem;">No pending orders. Kitchen is clear!</div>';
        return;
    }

    grid.innerHTML = '';
    
    // Sort orders by oldest first
    orders.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));

    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'order-card';
        card.id = `order-${order.id}`;
        
        const itemsList = (order.items || []).map(item => `
            <li>
                <span>${item.name}</span>
                <strong>x${item.quantity}</strong>
            </li>
        `).join('');

        card.innerHTML = `
            <div class="order-header">
                <div class="order-table">Table ${order.table_number}</div>
                <div class="order-type">${order.type || order.order_type || 'dine-in'}</div>
            </div>
            <div class="order-timer" id="timer-${order.id}">00:00</div>
            <ul class="order-items">
                ${itemsList}
            </ul>
            <div class="order-footer">
                <button class="btn-complete" onclick="completeOrder('${order.id}')">Mark Completed ✔</button>
            </div>
        `;
        
        grid.appendChild(card);
    });

    // Update timers immediately after render to set colors
    updateTimersUI();
}

function updateTimersUI() {
    const now = new Date();
    
    orders.forEach(order => {
        const orderTime = new Date(order.created_at);
        const diffMs = now - orderTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        
        const timerElement = document.getElementById(`timer-${order.id}`);
        const cardElement = document.getElementById(`order-${order.id}`);
        
        if (timerElement && cardElement) {
            timerElement.textContent = `${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`;
            
            // Remove existing color classes
            cardElement.classList.remove('status-yellow', 'status-red');
            
            // Apply new color class based on PRD logic
            if (diffMins >= 10) {
                cardElement.classList.add('status-red');
            } else if (diffMins >= 5) {
                cardElement.classList.add('status-yellow');
            }
        }
    });
}

async function completeOrder(orderId) {
    try {
        // Optimistic UI Update
        const card = document.getElementById(`order-${orderId}`);
        if(card) {
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';
        }

        await api.put(`/orders/${orderId}/complete`);

        setTimeout(() => {
            orders = orders.filter(o => o.id !== orderId);
            renderOrders();
            showToast('Order marked as completed!');
        }, 300);
    } catch (error) {
        // Revert optimistic UI
        const card = document.getElementById(`order-${orderId}`);
        if(card) {
            card.style.transform = '';
            card.style.opacity = '';
        }
        showToast('Failed to complete order: ' + error.message, 'error');
    }
}

function playAlertSound() {
    if(alertSound) {
        alertSound.play().catch(e => console.log('Audio play blocked by browser:', e));
    }
}
