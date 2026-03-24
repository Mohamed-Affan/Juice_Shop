# Project Research: Features

## Domain Features: Menu & Image Management

### Table Stakes (Must Have)
- **Direct Image Upload**: Replacement for manual "Image URL" text inputs.
- **Dynamic Preview**: Immediate visual feedback of the selected file before saving.
- **Supabase Persistence**: Automatic saving of the uploaded image's public URL to the `menu` table.
- **Validation**: Strict enforcement of JPG, PNG, and WebP formats.

### Differentiators (Better UX)
- **Automatic Optimization**: Use Supabase Storage's built-in image transformation features to resize and compress images on-the-fly.
- **Revocable Object URLs**: Manage temporary browser memory by revoking local object URLs after a successful upload or preview change.
- **Unified Auth**: Reuse the existing Admin JWT to authorize uploads to the storage bucket.

### Anti-Features (What NOT to Build)
- **Manual Thumbnail Generation**: Let Supabase handle resizing via query parameters (e.g., `?width=100&height=100`).
- **External Image Hosting (e.g., Imgur)**: Centralize all assets in Supabase for better governance and security.
- **Complex UI Modals**: Maintain the current single-modal "Add Menu Item" structure for consistency.

## Complexity & Dependencies

| Feature | Complexity | Dependencies |
|---------|------------|--------------|
| Direct Upload | Medium | Supabase SDK, Auth, Storage Bucket |
| Dynamic Preview | Low | Browser File API |
| Storage Persistence | Low | Express API, Supabase Storage |
| Optimization | Low | Supabase Storage Config |
