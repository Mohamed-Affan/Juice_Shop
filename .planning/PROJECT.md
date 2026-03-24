# Juice Shop

## What This Is

A comprehensive management system for a juice shop featuring an Admin dashboard, Point of Sale (POS) interface, and a Real-time Kitchen Display System. Built with a Node.js/Express backend and a Vanilla JavaScript frontend, it leverages Supabase for a robust database, authentication, and live updates.

## Core Value

Efficient, real-time order processing and menu management to streamline juice shop operations.

## Requirements

### Validated

- ✓ Multi-role Authentication (Admin, POS, Kitchen) — existing
- ✓ Product/Menu Database with categories — existing
- ✓ POS interface for selecting products and placing orders — existing
- ✓ Real-time Kitchen Display System (KDS) for tracking live orders — existing
- ✓ Security hardening with rate limiting and input validation — existing
- ✓ Stateless JWT-based session management — existing

### Active

- [ ] **Image File Upload**: Replace manual image URL inputs in the Admin panel with direct file uploads from the device.
- [ ] **Supabase Storage Integration**: Persist uploaded images to Supabase Storage.
- [ ] **Dynamic Image Preview**: Show a preview of the selected image before saving to the database.
- [ ] **Upload Validation**: Restrict file types (JPG/PNG) and size (5MB max) to ensure data integrity.

### Out of Scope

- [ ] **Alternative Cloud Storage**: Sticking to Supabase for consistency with the current stack.
- [ ] **Advanced Image Editing**: Cropping or filtering (keeping the UI simple as requested).
- [ ] **Native Mobile App**: Focused purely on the web-based management system.

## Context

The project is already in a "brownfield" state with a clear architecture:
- **Backend**: Node.js/Express serving a REST API.
- **Frontend**: Vanilla JS/HTML/CSS (served statically).
- **Data/Auth**: Supabase (PostgreSQL + Auth + Realtime).
- **Previous Milestone**: Completed integration with Supabase, replacing the original Flask/SQLite stack. The user now wants to polish the menu management experience by removing the friction of manual image URL entry.

## Constraints

- **Tech Stack**: Must use Vanilla JS and Supabase SDK (v2.99.3).
- **Storage**: Limited to Supabase Storage.
- **Security**: Must adhere to existing JWT authentication and rate-limiting patterns.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Client-Side Upload | Direct upload from browser to Supabase reduces backend load and simplifies logic. | — Pending |
| Simple File Picker | User requested a straightforward laptop/device upload experience. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-24 after initialization*
