# Architecture

**Analysis Date:** 2026-03-24

## Pattern Overview

**Overall:** Client-Server Architecture with a RESTful API Backend and Static Frontend.

**Key Characteristics:**
- **Decoupled Frontend/Backend:** Frontend is a set of static HTML/JS files served by the backend but logically distinct.
- **RESTful API:** Backend exposes endpoints for CRUD operations and authentication.
- **BaaS Integration:** Leverages Supabase for database, authentication, and real-time updates.
- **JWT-based Auth:** Stateless authentication between frontend and backend.

## Layers

**Frontend Layer:**
- **Purpose:** User interface and client-side interaction.
- **Contains:** HTML views, CSS styling, and JavaScript logic for API communication and DOM manipulation.
- **Location:** `frontend/`
- **Depends on:** Backend API for data and authentication.
- **Used by:** End-users (Admin, POS Staff, Kitchen Staff).

**API Layer (Backend):**
- **Purpose:** Entry point for frontend requests and request routing.
- **Contains:** Express app configuration, middleware (auth, validation, rate limiting), and route definitions.
- **Location:** `backend/src/routes/` and `backend/src/app.js`.
- **Depends on:** Controller layer for business logic.
- **Used by:** Frontend client-side scripts.

**Controller Layer (Backend):**
- **Purpose:** Orchestrate request handling and formulate responses.
- **Contains:** Logic to extract request data, call services, and handle success/error responses.
- **Location:** `backend/src/controllers/`
- **Depends on:** Service layer for database and external integrations.
- **Used by:** API routes.

**Service Layer (Backend):**
- **Purpose:** Interface with external services and database.
- **Contains:** Supabase client initialization and database query abstractions.
- **Location:** `backend/src/services/`
- **Depends on:** Supabase client SDK.
- **Used by:** Controllers.

## Data Flow

**Standard API Request (e.g., Placing an Order):**

1. **Frontend:** User clicks "Place Order" in `pos.html`.
2. **Frontend:** `pos.js` collects cart data and sends a POST request to `/api/orders`.
3. **Backend:** `app.js` receives the request and routes it through `authMiddleware` and `validatorMiddleware`.
4. **Backend:** `order.routes.js` matches the path and calls `orderController.createOrder`.
5. **Backend:** `orderController.js` calls `supabaseService` to insert data into the `orders` and `order_items` tables.
6. **Database:** Supabase inserts the records and triggers Realtime events.
7. **Backend:** Controller returns a 201 Created response to the frontend.
8. **Frontend:** `pos.js` clears the cart and shows a success message.

**Real-time Update (Kitchen Display):**

1. **Database:** New order inserted in `orders` table.
2. **Supabase Realtime:** Broadcasts the change to subscribed clients.
3. **Frontend:** `kitchen.js` (running on `kitchen.html`) receives the event and updates the UI instantly without a page refresh.

**State Management:**
- **Server State:** Managed by Supabase (PostgreSQL).
- **Client State:** Managed in-memory (JavaScript variables) and persisted via JWT (localStorage/sessionStorage) for session state.
- **Stateless Backend:** Express server does not maintain session state; individual requests are authenticated via JWT.

## Key Abstractions

**Middleware:**
- **Purpose:** Cross-cutting concerns like security and validation.
- **Examples:** `rateLimiter.js`, `auth.js` (JWT verification), `validator.js`.
- **Pattern:** Express Middleware.

**Controller:**
- **Purpose:** Logic for specific resource domains.
- **Examples:** `auth.controller.js`, `order.controller.js`.
- **Pattern:** Controller Pattern.

**Service/Client:**
- **Purpose:** Abstraction over external APIs.
- **Examples:** `supabase.js` (client initialization).
- **Pattern:** Singleton/Service Pattern.

## Entry Points

**Backend Entry:**
- **Location:** `backend/src/app.js`
- **Triggers:** Node process start (`npm start`).
- **Responsibilities:** Initialize Express, register middleware, connect routes, start HTTP server.

**Frontend Entry:**
- **Location:** `frontend/pages/login.html`
- **Triggers:** Browser URL access.
- **Responsibilities:** User authentication and redirection to role-specific dashboards.

## Error Handling

**Strategy:** Centralized error handling via global Express middleware.

**Patterns:**
- Try/catch blocks in controllers catch errors and pass them to `next(err)`.
- Global error handler in `app.js` logs the error and returns a generic 500 response to avoid leaking internals.
- Validation errors return a 400 Bad Request with specific field errors.

## Cross-Cutting Concerns

**Authentication:** 
- JWT-based authentication enforced via `backend/src/middleware/auth.js`.

**Authorization:**
- Role-based checks (`admin`, `pos`, `kitchen`) performed at the route level in the backend.

**Validation:**
- Input validation using `express-validator` at the route definition level.

**Security:**
- Global rate limiting using `express-rate-limit` to prevent brute-force and DoS attacks.

---

*Architecture analysis: 2026-03-24*
*Update when major patterns change*
