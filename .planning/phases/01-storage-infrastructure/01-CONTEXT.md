# Phase 1: Storage Infrastructure - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Establishing a secure and public-facing storage container for product images in Supabase. This phase delivers the foundational infrastructure required for the subsequent UI and SDK integration phases.

- **Deliverable**: A configured `product-images` bucket in Supabase Storage with production-ready RLS policies.
</domain>

<decisions>
## Implementation Decisions

### Storage Configuration
- **Bucket Name**: `product-images`
- **Access Level**: Public (Images must be viewable by customers on POS/KDS without sign-in).
- **Write Policy**: Restricted to "Authenticated" users with the `admin` role (mapped from the `users` table).

### the agent's Discretion
- **Folder Structure**: Initially flat under `/`.
- **Transformation Settings**: Enable "Image Optimization" if supported by the Supabase instance to allow for query-based resizing.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Architecture & Pitfalls
- `.planning/research/ARCHITECTURE.md` — Defines the client-to-storage pattern.
- `.planning/research/PITFALLS.md` — Lists critical RLS and performance mistakes to avoid.
- `.planning/REQUIREMENTS.md` — Contains the INF-01, INF-02, INF-03 specs.

</canonical_refs>

<specifics>
## Specific Ideas
- The bucket size limit should be set to 5242880 bytes (5MB) as agreed during initialization.
</specifics>

<deferred>
## Deferred Ideas
- **UI Implementation**: Handled in Phase 2.
- **SDK Integration logic**: Handled in Phase 3.
</deferred>

---
*Phase: 01-storage-infrastructure*
*Context gathered: 2026-03-24 via synthesis*
