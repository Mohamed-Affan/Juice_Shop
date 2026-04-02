// Admin Logic
let menuItems = [];

document.addEventListener('DOMContentLoaded', () => {
    const user = enforceLogin(['admin']);
    if(!user) return;

    document.getElementById('user-display').textContent = `Admin: ${user.username}`;
    
    // Load initial data
    loadDashboardStats();
    loadMenuData();
    loadRecentOrders();

    // Setup Form
    document.getElementById('menu-form').addEventListener('submit', handleMenuSubmit);

    // Initialize Drop Zone
    initDropZone();
});

function switchTab(tabId) {
    // Update active button
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Update active section
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

async function loadDashboardStats() {
    try {
        const stats = await api.get('/reports/dashboard');

        document.getElementById('stat-revenue').textContent = `₹${(stats.revenue || 0).toLocaleString()}`;
        document.getElementById('stat-orders').textContent = stats.orders || 0;
    } catch (error) {
        showToast('Failed to load stats', 'error');
    }
}

async function loadMenuData() {
    try {
        menuItems = await api.get('/menu');

        renderMenuTable();
    } catch (error) {
        showToast('Failed to load menu', 'error');
    }
}

function renderMenuTable() {
    const tbody = document.getElementById('menu-table-body');
    tbody.innerHTML = '';

    if (!menuItems || menuItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-muted text-center">No menu items yet. Click "+ Add New Item" to get started.</td></tr>';
        return;
    }

    menuItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.image_url || 'https://via.placeholder.com/50?text=No+Img'}" class="img-preview" alt="${item.name}"></td>
            <td><strong>${item.name}</strong></td>
            <td>₹${item.price}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-primary" onclick='editMenuItem(${JSON.stringify(item).replace(/'/g, "&#39;")})' style="padding: 5px 10px; font-size: 0.9rem;">Edit</button>
                    <button class="btn btn-danger" onclick="deleteMenuItem('${item.id}')" style="padding: 5px 10px; font-size: 0.9rem;">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openMenuModal() {
    document.getElementById('menu-form').reset();
    document.getElementById('menu-id').value = '';
    document.getElementById('menu-image-url').value = '';
    
    // Reset drop zone & preview
    document.getElementById('drop-zone').classList.remove('hidden');
    document.getElementById('image-preview-container').classList.add('hidden');
    document.getElementById('menu-image-preview').src = '';
    
    document.getElementById('modal-title').textContent = 'Add Menu Item';
    document.getElementById('menu-modal').classList.add('active');
}

function closeMenuModal() {
    document.getElementById('menu-modal').classList.remove('active');
}

function editMenuItem(item) {
    document.getElementById('menu-id').value = item.id;
    document.getElementById('menu-name').value = item.name;
    document.getElementById('menu-price').value = item.price;
    document.getElementById('menu-image-url').value = item.image_url || '';
    
    // Show preview for existing image
    if (item.image_url) {
        const preview = document.getElementById('menu-image-preview');
        const previewContainer = document.getElementById('image-preview-container');
        const dropZone = document.getElementById('drop-zone');
        
        preview.src = item.image_url;
        previewContainer.classList.remove('hidden');
        document.getElementById('image-filename').textContent = 'Current Image';
        dropZone.classList.add('hidden');
    } else {
        document.getElementById('drop-zone').classList.remove('hidden');
        document.getElementById('image-preview-container').classList.add('hidden');
    }
    
    document.getElementById('modal-title').textContent = 'Edit Menu Item';
    document.getElementById('menu-modal').classList.add('active');
}

async function handleMenuSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('menu-id').value;
    const name = document.getElementById('menu-name').value;
    const price = parseFloat(document.getElementById('menu-price').value);
    
    const fileInput = document.getElementById('menu-image-file');
    let image_url = document.getElementById('menu-image-url').value;

    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        // 1. Upload file if a new one was selected
        if (fileInput.files.length > 0) {
            submitBtn.textContent = 'Uploading...';
            const formData = new FormData();
            formData.append('image', fileInput.files[0]);
            
            const uploadRes = await api.upload('/menu/upload', formData);
            image_url = uploadRes.url;
        }

        if (!image_url) {
            throw new Error('Please upload an image or provide a URL');
        }

        const payload = { name, price, image_url };

        if (id) {
            await api.put(`/menu/${id}`, payload);
            showToast('Menu item updated!');
        } else {
            await api.post('/menu', payload);
            showToast('Menu item added!');
        }

        closeMenuModal();
        await loadMenuData(); // Refresh from server
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Item';
    }
}

// Drop Zone Helpers
function initDropZone() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('menu-image-file');

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            updateThumbnail(fileInput.files[0]);
        }
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drop-zone--over');
    });

    ['dragleave', 'dragend'].forEach(type => {
        dropZone.addEventListener(type, () => dropZone.classList.remove('drop-zone--over'));
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateThumbnail(e.dataTransfer.files[0]);
        }
        dropZone.classList.remove('drop-zone--over');
    });
}

function updateThumbnail(file) {
    const preview = document.getElementById('menu-image-preview');
    const previewContainer = document.getElementById('image-preview-container');
    const filenameLabel = document.getElementById('image-filename');
    const dropZone = document.getElementById('drop-zone');

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
            preview.src = reader.result;
            previewContainer.classList.remove('hidden');
            filenameLabel.textContent = file.name;
            dropZone.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
}

async function deleteMenuItem(id) {
    if(!confirm('Are you sure you want to delete this menu item?')) return;

    try {
        await api.delete(`/menu/${id}`);
        showToast('Menu item deleted!');
        await loadMenuData(); // Refresh from server
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function loadRecentOrders() {
    try {
        const orders = await api.get('/orders/recent?limit=10');

        const tbody = document.getElementById('orders-table-body');
        tbody.innerHTML = '';

        if (!orders || orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-muted text-center">No completed orders yet.</td></tr>';
            return;
        }

        orders.forEach(order => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${String(order.id).slice(0, 8)}</strong></td>
                <td>Table ${order.table_number}</td>
                <td style="text-transform: capitalize;">${order.order_type || 'dine-in'}</td>
                <td style="color: var(--accent-primary); font-weight: bold;">₹${order.total_amount}</td>
                <td><span class="status-badge ${order.status}">${order.status.toUpperCase()}</span></td>
                <td class="text-muted">${new Date(order.created_at).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch(error) {
        showToast('Failed to load recent orders', 'error');
    }
}
