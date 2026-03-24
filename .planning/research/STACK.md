# Project Research: Stack

## Core Technologies

### Frontend
- **Vanilla JavaScript (ES6+)**: Used for DOM manipulation, API communication, and UI logic. No heavy frameworks (React/Vue) are currently in use, maintaining a lightweight footprint.
- **Supabase SDK (`@supabase/supabase-js` v2.99.3)**: Primary interface for Database, Auth, and Storage.
- **Vanilla CSS**: Custom glassmorphism-inspired design system with CSS variables for modularity.

### Backend
- **Node.js**: Runtime for the server.
- **Express.js (v4.18.2)**: Web framework for RESTful API endpoints.
- **Supabase Node Client**: Used for administrative tasks and data persistence.
- **JWT (`jsonwebtoken`)**: Stateless authentication mechanism.

### Data & Storage
- **Supabase PostgreSQL**: Managed relational database for transactional data (menu, orders, users).
- **Supabase Storage**: Object storage for menu item images.
- **Supabase Realtime**: WebSocket-based updates for the Kitchen Display System (KDS).

## 2025 Best Practices

1. **Client-Direct Uploads**: For performance and reduced backend complexity, the browser should upload directly to Supabase Storage using the SDK, rather than proxying through the Node.js server.
2. **WebP Format**: Prefer WebP for images to provide superior compression and faster load times on the POS interface.
3. **Environment Parity**: Maintain consistent Supabase bucket configurations across development and production environments.

## Confidence Levels
- **Frontend Stack**: High (Proven stability in the current codebase)
- **Direct-to-Storage Pattern**: High (Industry standard for modern BaaS)
- **Node.js Scalability**: High (Well-suited for POS/KDS concurrent traffic)
