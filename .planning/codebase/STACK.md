# Technology Stack

**Analysis Date:** 2026-03-24

## Languages

**Primary:**
- JavaScript (Node.js) - Backend logic, Express server, and frontend client-side scripts.
- SQL - Supabase/PostgreSQL schema definitions and migrations.

**Secondary:**
- TypeScript - Found in root `page.tsx` and `utils/`, though the core application appears to be JavaScript-based.
- HTML/CSS - Frontend structure and styling.

## Runtime

**Environment:**
- Node.js (Version >= 18.x recommended)
- Browser - Standard modern browsers for frontend.

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present in root and `backend/`.

## Frameworks

**Core:**
- Express 4.18.2 - Backend web server and REST API.
- Vanilla JavaScript - Frontend client-side logic (no major SPA framework used for the main app).

**Testing:**
- None detected (no test scripts or frameworks in `package.json`).

**Build/Dev:**
- nodemon 3.0.1 - Development server auto-reload.

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.99.3 - Database interaction and real-time updates.
- `jsonwebtoken` 9.0.2 - Authentication via JWT.
- `bcryptjs` 2.4.3 - Password hashing.
- `express-rate-limit` 7.1.1 - Security and request throttling.
- `express-validator` 7.0.1 - Input validation and sanitization.

**Infrastructure:**
- `cors` 2.8.5 - Cross-Origin Resource Sharing.
- `dotenv` 16.3.1 - Environment variable management.

## Configuration

**Environment:**
- `.env` in `backend/` - Contains `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`, `PORT`.
- `.env.local` in root - Potential Next.js/Supabase configuration.

**Build:**
- No complex build pipeline; static files are served by Express.

## Platform Requirements

**Development:**
- Cross-platform (Windows/macOS/Linux).
- Required: Node.js, npm, Supabase account/instance.

**Production:**
- Backend: PaaS like Railway, Render, or Fly.io.
- Frontend: Static hosting (Vercel, Netlify) or served by the backend.
- Database: Supabase (managed PostgreSQL).

---

*Stack analysis: 2026-03-24*
*Update after major dependency changes*
