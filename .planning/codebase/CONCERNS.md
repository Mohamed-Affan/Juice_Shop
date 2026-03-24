# Codebase Concerns

**Analysis Date:** 2026-03-24

## Tech Debt

**Global Variable Usage in Frontend:**
- Issue: Many frontend scripts (e.g., `frontend/js/auth.js`, `frontend/js/pos.js`) use global variables instead of scoped modules.
- Why: Simple prototype-to-production path with vanilla JavaScript.
- Impact: Potential namespace collisions and difficulty in tracking state changes across pages.
- Fix approach: Refactor to ES modules or use a simple state management pattern with encapsulated objects.

**Next.js/React Relics:**
- Issue: Stray files like `page.tsx` and `utils/supabase/server.ts` exist in the root but are not used by the core Express/HTML application.
- Why: Likely a partial migration or prototype of a different architecture.
- Impact: Confusion for developers and potential security risks if legacy code contains sensitive config.
- Fix approach: Remove unused `.tsx` and `.ts` files after verifying they are strictly separate from the running app.

## Known Bugs

**No known blocking bugs detected in mapping.** (Assume manual testing has passed based on context).

## Security Considerations

**JWT Secret Handling:**
- Risk: If `JWT_SECRET` is leaked or weak, attackers can forge user tokens and bypass role checks.
- Current mitigation: Stored in `backend/.env` (gitignored).
- Recommendations: Ensure a strong random string is used and rotate periodically.

**Frontend API Key Exposure:**
- Risk: While backend handles primary logic, any Supabase public keys in `frontend/js/config.js` could be abused if RLS is not properly configured.
- Current mitigation: RLS enabled in `supabase/schema.sql`.
- Recommendations: Audit all RLS policies to ensure no unauthorized database modifications can occur.

**Input Sanitization:**
- Risk: Potential for XSS in frontend when rendering menu names or order details.
- Current mitigation: Basic `express-validator` in backend.
- Recommendations: Ensure frontend uses `textContent` instead of `innerHTML` when rendering user-supplied data from the database.

## Performance Bottlenecks

**Supabase Realtime Overhead:**
- Problem: High frequency of updates in a busy shop could lead to UI stutter on low-end kitchen tablets.
- Cause: Subscribing to all changes in `orders` table.
- Improvement path: Filter subscriptions to only 'pending' or 'preparing' statuses if performance issues arise.

## Fragile Areas

**Authentication Redirects:**
- Files: `frontend/js/auth.js`, `backend/src/middleware/auth.js`.
- Why fragile: Hardcoded login/redirect URLs (`/pages/login.html`) make it brittle to directory structure changes.
- Safe modification: Centralize navigation paths in a config file or use relative paths consistently.

## Scaling Limits

**Supabase Free Tier:**
- Limit: 5GB bandwidth, 500MB DB.
- Symptoms at limit: 429 errors or failed writes.
- Scaling path: Upgrade to Supabase Pro plan if order volume exceeds tier limits.

## Test Coverage Gaps

**Total Lack of Automated Tests:**
- What's not tested: Everything (auth logic, order creation, role enforcement).
- Risk: Regressions are only caught by manual shop-floor usage or manual developer testing.
- Priority: High.
- Difficulty to test: Requires setting up a testing framework (Jest) and mocking Supabase.

---

*Concerns audit: 2026-03-24*
*Update as issues are fixed or new ones discovered*
