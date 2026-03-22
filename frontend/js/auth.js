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
