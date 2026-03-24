# Project Research: Architecture

## Modern KDS & Admin Patterns for 2025

### Overall Structure: Client-to-Storage
The system will adopt a **client-direct upload** pattern to minimize server-side overhead and leverage Supabase's built-in storage features. This is the recommended modern approach for 2025 applications using a BaaS (Backend-as-a-Service) model.

## Component Boundaries

### 1. The Frontend (Emitter)
- **Role**: Collect file data, perform client-side validation (size/type), and generate a preview.
- **Data Flow**:
  1. Browser `<input type="file">` emits a `File` object.
  2. `URL.createObjectURL(file)` displays it instantly.
  3. `supabase.storage.from('product-images').upload(...)` sends the file to the S3-compatible bucket.
  4. Returns the public storage path (e.g., `products/image-uuid.png`).

### 2. The Backend (Coordinator)
- **Role**: Validate business logic (roles/permissions) and coordinate database persistence.
- **Data Flow**:
  1. Receives the `public_url` from the frontend (POST/PUT `/api/menu`).
  2. Updates the `menu` table in PostgreSQL through Supabase.

### 3. Supabase Storage (Object Store)
- **Role**: Host the binary image data and serve it with appropriate cache headers.
- **Organization**:
  - Bucket: `product-images` (Public).
  - Folder Structure: `/products/` (Flat structure with UUID filenames).

## Suggested Build Order

1. **Storage Infrastructure**: Create the `product-images` bucket in the Supabase dashboard and set RLS policies (e.g., `authenticated admins can upload/update/delete`).
2. **Frontend UI Update**: Replace the existing Image URL input field in `admin.html` with a file picker and preview container.
3. **Storage Client logic**: Implement the upload function in `admin.js` using the Supabase SDK.
4. **Integration**: Connect the upload logic to the current `handleMenuSubmit` function.
5. **KDS & POS update**: Verify that the newly uploaded images load correctly across all role-specific interfaces.
