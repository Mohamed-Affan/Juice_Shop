come-bro-chill-bro/
│
├── frontend/
│   ├── pages/
│   │   ├── login.html
│   │   ├── admin.html
│   │   ├── pos.html
│   │   ├── kitchen.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── pos.js
│   │   ├── kitchen.js
│   │   ├── api.js          ← backend calls
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── sounds/
│   │       └── alert.mp3
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── menu.routes.js
│   │   │   ├── order.routes.js
│   │   │   └── report.routes.js
│   │   │
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validator.js
│   │   │
│   │   ├── services/
│   │   │   └── supabase.js
│   │   │
│   │   └── app.js
│   │
│   ├── .env
│   ├── package.json
│
├── supabase/
│   └── schema.sql
│
├── README.md