# Roadmap: Juice Shop (Image Upload Integration)

## Overview

Modernizing the menu management experience by replacing manual image URL entry with a direct-to-Supabase file upload system. This journey takes us from infrastructure setup to a polished UI that provides instant feedback and secure persistence.

## Phases

- [ ] **Phase 1: Storage Infrastructure** - Bucket creation and security policy configuration.
- [ ] **Phase 2: UI Foundation** - Introducing the file picker and live image preview.
- [ ] **Phase 3: Integration & Persistence** - Connecting the SDK upload logic to the menu database.

## Phase Details

### Phase 1: Storage Infrastructure
**Goal**: Establish a secure storage container for menu assets.
**Depends on**: Nothing
**Requirements**: INF-01, INF-02, INF-03
**Success Criteria**:
  1. `product-images` bucket exists in Supabase.
  2. Authenticated admins can upload files via the SDK.
  3. Public access is enabled for viewing images but restricted for writing.
**Plans**: 1 plan

Plans:
- [ ] 01-01: Configure Supabase Storage buckets and RLS policies.

### Phase 2: UI Foundation
**Goal**: Update the Admin interface to support file selection and previews.
**Depends on**: Phase 1
**Requirements**: PM-01, UI-01, UI-02
**Success Criteria**:
  1. `admin.html` features a file input instead of a URL text field.
  2. Selected images appear instantly in a preview box.
  3. Errors are shown if the file is too large (>5MB) or the wrong type.
**Plans**: 1 plan

Plans:
- [ ] 02-01: Implement file input and dynamic preview in the Admin modal.

### Phase 3: Integration & Persistence
**Goal**: Wire the frontend to Supabase Storage and the menu database.
**Depends on**: Phase 2
**Requirements**: PM-02, PM-03, PM-04, UI-03
**Success Criteria**:
  1. Saving a menu item uploads the file to Supabase Storage with a unique name.
  2. The `menu` table is updated with the storage public URL.
  3. Temporary object URLs are cleaned up to prevent memory leaks.
**Plans**: 1 plan

Plans:
- [ ] 03-01: Complete the upload-to-database lifecycle in `admin.js`.

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Storage Infrastructure | 0/1 | Not started | - |
| 2. UI Foundation | 0/1 | Not started | - |
| 3. Integration & Persistence | 0/1 | Not started | - |

---
*Roadmap defined: 2026-03-24*
*Last updated: 2026-03-24 after initial definition*
