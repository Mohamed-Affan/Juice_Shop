document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        // If already logged in, redirect based on role
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            redirectBasedOnRole(user.role);
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            if (!username || !password) {
                showToast('Please enter username and password', 'error');
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Logging in...';

                const response = await api.post('/auth/login', { username, password });

                if (response.token && response.user) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    showToast('Login successful!');
                    
                    setTimeout(() => {
                        redirectBasedOnRole(response.user.role);
                    }, 500);
                } else {
                    showToast('Invalid response from server', 'error');
                }

            } catch (error) {
                showToast(error.message || 'Login failed', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login to System';
            }
        });
    }
});

function redirectBasedOnRole(role) {
    if (role === 'admin') {
        window.location.href = '/frontend/pages/admin.html';
    } else if (role === 'pos') {
        window.location.href = '/frontend/pages/pos.html';
    } else if (role === 'kitchen') {
        window.location.href = '/frontend/pages/kitchen.html';
    } else {
        showToast('Unknown user role', 'error');
    }
}

// Function to protect pages that require login
function enforceLogin(allowedRoles = []) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/frontend/pages/login.html';
        return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        if(user.role !== 'admin') { // admin has access to everything by PRD definition
             showToast('Access Denied', 'error');
             setTimeout(() => {
                 redirectBasedOnRole(user.role);
             }, 1000);
             return null;
        }
    }

    // Setup logout button if it exists
    setupLogout();
    
    // Setup change password feature
    setupChangePassword();
    
    return user;
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/frontend/pages/login.html';
        });
    }
}

function setupChangePassword() {
    const navActions = document.querySelector('.nav-actions');
    if (navActions && !document.getElementById('change-pwd-btn')) {
        const btn = document.createElement('button');
        btn.id = 'change-pwd-btn';
        btn.className = 'btn btn-primary btn-sm';
        btn.innerHTML = 'Change Password';
        btn.style.marginRight = '10px';
        btn.style.fontSize = '0.9rem';
        btn.style.padding = '8px 15px';
        btn.onclick = openChangePasswordModal;
        navActions.prepend(btn);
    }
    
    // Inject Modal if not exists
    if (!document.getElementById('change-password-modal')) {
        const modalHtml = `
            <div id="change-password-modal" class="modal">
                <div class="modal-content" style="max-width: 440px;">
                    <div class="modal-header">
                        <h2 style="margin: 0; background: none; -webkit-text-fill-color: initial; color: var(--text-main);">Change Password</h2>
                        <button class="close-btn" onclick="closeChangePasswordModal()">&times;</button>
                    </div>
                    <form id="change-password-form">
                        <div class="form-group">
                            <label>Current Password</label>
                            <input type="password" id="current-password" class="form-control" placeholder="Enter current password" required>
                        </div>
                        <div class="form-group">
                            <label>New Password</label>
                            <input type="password" id="new-password" class="form-control" placeholder="Enter new password" required>
                        </div>
                        <div class="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" id="confirm-password" class="form-control" placeholder="Repeat new password" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%; margin-top:10px; padding: 14px;">Update Password</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('change-password-form').addEventListener('submit', handleChangePasswordSubmit);
    }
}

function openChangePasswordModal() {
    document.getElementById('change-password-form').reset();
    document.getElementById('change-password-modal').classList.add('active');
}

function closeChangePasswordModal() {
    document.getElementById('change-password-modal').classList.remove('active');
}

async function handleChangePasswordSubmit(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Updating...';

        await api.put('/auth/change-password', { currentPassword, newPassword });
        
        showToast('Password updated successfully!');
        closeChangePasswordModal();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Update Password';
    }
}
