// API helper functions
const api = {
    get: async (endpoint) => {
        const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`);
        return res.json();
    },
    post: async (endpoint, data) => {
        const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    }
};
