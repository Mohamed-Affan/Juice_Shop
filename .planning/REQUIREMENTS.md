# Requirements: Juice Shop (Image Upload Integration)

**Defined:** 2026-03-24
**Core Value:** Efficient, real-time order processing and menu management to streamline juice shop operations.

## v1 Requirements

### Infrastructure (INF)
- [ ] **INF-01**: Create a `product-images` storage bucket in Supabase.
- [ ] **INF-02**: Configure Row-Level Security (RLS) policies for the `product-images` bucket to allow authenticated Admins to upload, update, and delete files.
- [ ] **INF-03**: Set bucket-level file size (5MB) and MIME type (images only) restrictions.

### Product Management (PM)
- [ ] **PM-01**: Replace existing "Image URL" text input in `admin.html` with a browser-native `<input type="file">`.
- [ ] **PM-02**: Implement direct-to-storage upload logic in `admin.js` using the Supabase SDK.
- [ ] **PM-03**: Ensure unique filenames are generated (e.g., UUID or timestamp) to avoid overwriting existing assets.
- [ ] **PM-04**: Update the `menu` table in PostgreSQL with the public URL or path of the newly uploaded image.

### UI/UX (UI)
- [ ] **UI-01**: Display a live **Image Preview** in the "Add/Edit Menu Item" modal once a file is selected.
- [ ] **UI-02**: Provide clear error feedback if a chosen file exceeds the size limit or has an unsupported format.
- [ ] **UI-03**: Clean up temporary browser memory (ObjectURLs) when the modal is closed or the file is changed.

## v2 Requirements

### Advanced Features
- **PM-05**: Batch image uploads for migrating multiple products at once.
- **UI-04**: Provide basic client-side image cropping or aspect-ratio enforcement.
- **UI-05**: Support "Paste from Clipboard" for image inputs.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-Cloud Storage | Stick to Supabase to maintain architectural consistency. |
| Automatic Background Removal | High complexity, not requested for this phase. |
| Video Support | Domain focused on juice products, video is not a priority. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INF-01 | Phase 1 | Pending |
| INF-02 | Phase 1 | Pending |
| INF-03 | Phase 1 | Pending |
| PM-01 | Phase 2 | Pending |
| UI-01 | Phase 2 | Pending |
| UI-02 | Phase 2 | Pending |
| PM-02 | Phase 3 | Pending |
| PM-03 | Phase 3 | Pending |
| PM-04 | Phase 3 | Pending |
| UI-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-03-24 after initial definition*
