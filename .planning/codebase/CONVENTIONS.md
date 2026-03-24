# Coding Conventions

**Analysis Date:** 2026-03-24

## Naming Patterns

**Files:**
- `kebab-case.js`: All JavaScript files (e.g., `auth.controller.js`, `order.routes.js`).
- `kebab-case.html`: All HTML pages.
- `kebab-case.css`: All stylesheets.

**Functions:**
- `camelCase` for all functions (e.g., `login`, `createOrder`, `updateStatus`).
- No special prefix for async functions.
- `handleEventName` for frontend event handlers (not strictly followed but recommended).

**Variables:**
- `camelCase` for variables and object properties.
- `UPPER_SNAKE_CASE` for environment variables (e.g., `SUPABASE_URL`, `JWT_SECRET`).
- Database columns (Supabase) use `snake_case` (e.g., `password_hash`, `created_at`).

## Code Style

**Formatting:**
- 2 or 4 space indentation (mixed in existing files; 4-space is more common in backend).
- Single quotes for strings in backend; mixed in frontend.
- Semicolons required.

**Linting:**
- No explicit linter (ESLint/Prettier) configuration found in root or backend.
- Manual consistency is required to match existing style.

## Import Organization

**Backend (Node.js/CommonJS):**
1. Built-in modules (`express`, `path`).
2. Third-party packages (`bcryptjs`, `jsonwebtoken`).
3. Local modules (`../controllers/auth.controller`).
4. Services/Middleware.

**Frontend (Native `<script>`):**
- Global scipts first (`config.js`, `utils.js`).
- Feature-specific scripts last (`auth.js`, `pos.js`).
- Scripts are loaded via `<script src="...">` tags in HTML.

## Error Handling

**Patterns:**
- **Backend:** `try/catch` blocks in controllers. Errors are passed to `next(err)` to be handled by global error middleware in `app.js`.
- **Frontend:** API calls use `fetch` with `try/catch`. Generic "Something went wrong" messages are displayed to users unless specific validation errors occur.

**Strategy:** Fail gracefully. Backend returns standardized JSON error responses: `{ message: "..." }`.

## Logging

**Backend:**
- `console.log` for server startup and basic info.
- `console.error` for exceptions and database errors.
- No structured logging library (like Winston/Pino) used yet.

## Comments

**When to Comment:**
- Feature headers: `// Routes`, `// Controllers`.
- Section markers in routes files.
- Explaining complex logic or database queries.
- // TODO: for pending tasks.

## Function Design

**Backend Controllers:**
- Standard signature: `const name = async (req, res) => { ... }`.
- Logic should be kept thin, delegating to services where appropriate.
- Guard clauses used for early returns (e.g., missing fields, auth failures).

## Module Design

**Backend:**
- Exporting objects from controllers and services using `module.exports = { ... }`.
- Single export for routes: `module.exports = router`.

**Frontend:**
- Clean global namespace by using scoped functions where possible (though many scripts currently use global variables).

---

*Convention analysis: 2026-03-24*
*Update when patterns change*
