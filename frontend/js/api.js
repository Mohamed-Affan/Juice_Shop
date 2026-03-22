// API helper functions with JWT Injection
const api = {
    getHeaders: () => {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = token;
        }
        return headers;
    },

    handleResponse: async (res) => {
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message || "Server not reachable");
        }
        return res.json();
    },

    get: async (endpoint) => {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                headers: api.getHeaders()
            });
            return await api.handleResponse(res);
        } catch (error) {
            console.error('API GET Error:', error);
            throw error;
        }
    },

    post: async (endpoint, data) => {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: api.getHeaders(),
                body: JSON.stringify(data)
            });
            return await api.handleResponse(res);
        } catch (error) {
            console.error('API POST Error:', error);
            throw error;
        }
    },
    
    put: async (endpoint, data) => {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: api.getHeaders(),
                body: JSON.stringify(data)
            });
            return await api.handleResponse(res);
        } catch (error) {
            console.error('API PUT Error:', error);
            throw error;
        }
    },

    delete: async (endpoint) => {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: api.getHeaders()
            });
            return await api.handleResponse(res);
        } catch (error) {
            console.error('API DELETE Error:', error);
            throw error;
        }
    }
};
