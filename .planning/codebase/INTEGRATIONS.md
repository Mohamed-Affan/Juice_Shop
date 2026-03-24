# External Integrations

**Analysis Date:** 2026-03-24

## APIs & External Services

**Data & Backend:**
- Supabase - Primary backend-as-a-service providing database, authentication, and real-time updates.
  - SDK/Client: `@supabase/supabase-js` v2.99.3
  - Auth: `SUPABASE_KEY` and `SUPABASE_URL` environment variables.
  - Features used: PostgreSQL, Auth (users table), Realtime (order updates).

## Data Storage

**Databases:**
- PostgreSQL on Supabase - Primary transactional data store.
  - Connection: Managed via Supabase client library.
  - Client: `@supabase/supabase-js`.
  - Schema: Defined in `supabase/schema.sql`.
  - Key Tables: `users`, `menu`, `orders`, `order_items`.

**File Storage:**
- Supabase Storage - Used for menu item images.
  - SDK/Client: `@supabase/supabase-js`.
  - Usage: Storing and retrieving product photos for the POS and Admin panels.

## Authentication & Identity

**Auth Provider:**
- Custom JWT with Supabase - Backend handles login logic using `bcryptjs` for password verification against the `users` table in Supabase.
  - Implementation: JWT signed by backend using `jsonwebtoken` and `JWT_SECRET`.
  - Token handling: Issued to frontend upon successful login; expected in `Authorization` headers for protected API routes.
  - Role-Based Access Control (RBAC): Roles (`admin`, `pos`, `kitchen`) stored in the `users` table and encoded in JWT.

## Monitoring & Observability

**Logs:**
- Console Logging - Standard `console.log` and `console.error` in Node.js backend.
- Database Logs - Managed within the Supabase dashboard.

## CI/CD & Deployment

**Hosting (Potentially):**
- Frontend: Suitable for Vercel, Netlify, or similar static hosting.
- Backend: Suitable for Render, Railway, or VPS.

## Environment Configuration

**Backend (`backend/.env`):**
- `SUPABASE_URL` - URL of the Supabase project.
- `SUPABASE_KEY` - Public/Service key for Supabase access.
- `JWT_SECRET` - Secret key for signing JSON Web Tokens.
- `PORT` - Port the Express server listens on.

**Frontend:**
- Configuration via `frontend/js/config.js` (presumably contains API base URLs or Supabase public settings).

## Webhooks & Callbacks

**Incoming:**
- None detected from external third-party services (e.g., Stripe).

**Real-time:**
- Supabase Realtime subscriptions - Used by the Kitchen Display System to receive instant order notifications.

---

*Integration audit: 2026-03-24*
*Update when adding/removing external services*
