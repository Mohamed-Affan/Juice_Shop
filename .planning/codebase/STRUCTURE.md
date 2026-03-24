# Codebase Structure

**Analysis Date:** 2026-03-24

## Directory Layout

```
Juice_Shop/
├── backend/            # Express.js API server
│   ├── src/           # API source code
│   │   ├── controllers/# Business logic handlers
│   │   ├── middleware/# Request filtering (auth, validation)
│   │   ├── routes/    # API endpoint definitions
│   │   └── services/  # External service integrations (Supabase)
│   └── .env           # Backend environment variables
├── frontend/           # Static web interface
│   ├── assets/        # Images, icons, and sounds
│   ├── css/           # CSS stylesheets
│   ├── js/            # Client-side JavaScript
│   └── pages/         # HTML views (Admin, POS, Kitchen)
├── supabase/           # Database configuration
│   └── schema.sql     # PostgreSQL table and policy definitions
├── utils/              # Shared utility functions (potential Next.js relics)
├── .planning/          # GSD project memory and planning docs
└── prd.md              # Project requirements document
```

## Directory Purposes

**backend/src/controllers/:**
- Purpose: Orchestrate request handling and formulate responses for specific resource domains.
- Contains: `auth.controller.js`, `order.controller.js`, `menu.controller.js`.
- Key files: `auth.controller.js` for login logic.

**backend/src/routes/:**
- Purpose: Map HTTP endpoints to controller functions.
- Contains: `auth.routes.js`, `order.routes.js`, `menu.routes.js`.
- Key files: `auth.routes.js` for authentication endpoints.

**backend/src/middleware/:**
- Purpose: Reusable functions for request pre-processing and security.
- Contains: `auth.js` (JWT), `rateLimiter.js`, `validator.js`.

**frontend/pages/:**
- Purpose: User-facing HTML views for different shop roles.
- Contains: `login.html`, `pos.html`, `kitchen.html`, `admin.html`.

**frontend/js/:**
- Purpose: Client-side logic for API communication and UI interactivity.
- Contains: `auth.js`, `pos.js`, `kitchen.js`, `admin.js`, `api.js`.

**supabase/:**
- Purpose: Database schema and security policies.
- Contains: `schema.sql` (idempotent SQL setup).

## Key File Locations

**Entry Points:**
- `backend/src/app.js`: Backend server entry point.
- `frontend/pages/login.html`: Primary user entry point.

**Configuration:**
- `backend/.env`: Private credentials and server settings.
- `frontend/js/config.js`: Frontend API and service constants.
- `.env.local`: Root environment variables (Next.js/Supabase).

**Core Logic:**
- `backend/src/controllers/`: Backend business logic.
- `frontend/js/`: Frontend application logic.

**Documentation:**
- `prd.md`: Comprehensive product requirements.
- `README.md`: Project overview (currently empty).

## Naming Conventions

**Files:**
- `kebab-case.js`: JavaScript modules and scripts.
- `kebab-case.html`: HTML page files.
- `UPPERCASE.md`: Project-level documentation (e.g., README.md).

**Directories:**
- `kebab-case`: All directories.
- Plural names for collections: `controllers/`, `routes/`, `pages/`, `assets/`.

## Where to Add New Code

**New API Endpoint:**
- Definition: `backend/src/routes/[resource].routes.js`
- Handler: `backend/src/controllers/[resource].controller.js`
- Middleware: `backend/src/middleware/` if custom logic is needed.

**New UI Page:**
- HTML View: `frontend/pages/[page].html`
- Client Logic: `frontend/js/[page].js`
- Styling: `frontend/css/style.css`

**New Database Change:**
- Schema: Update `supabase/schema.sql`.

**Shared Utility:**
- Frontend: `frontend/js/utils.js`.
- Backend: `backend/src/utils/` (if created) or existing service files.

## Special Directories

**.planning/:**
- Purpose: Project memory, state tracking, and roadmap for GSD workflows.
- Committed: Yes (standard GSD practice).

---

*Structure analysis: 2026-03-24*
*Update when directory structure changes*
