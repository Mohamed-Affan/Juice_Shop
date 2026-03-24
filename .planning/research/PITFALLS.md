# Project Research: Pitfalls

## Common Mistakes In POS/KDS systems

### 1. RLS (Row Level Security) Misconfiguration
- **The Pitfall**: Buckets created in Supabase often start as "Private" or "Public but no write permissions", leading to "Access Denied" errors in the console.
- **The Prevention**: Explicitly create and test an RLS policy for the `storage.objects` table. Example: `auth.uid() is NOT NULL AND role = 'admin' CAN INSERT`.
- **Phase**: Infrastructure (Setup).

### 2. Exposing the Service Role Key
- **The Pitfall**: Attempting to bypass RLS by using the `service_role` key in the frontend code. This allows any user to perform any storage action if they find the key.
- **The Prevention**: ALWAYS use the `anon` key on the client-side. Rely on RLS policies to restrict "Insert" and "Update" actions to users with the 'admin' role.
- **Phase**: Implementation.

### 3. Memory Leaks from `createObjectURL()`
- **The Pitfall**: Calling `URL.createObjectURL(file)` multiple times as a user selects different images without calling `URL.revokeObjectURL()`. This can bloat browser memory over time.
- **The Prevention**: Keep a reference to the current preview URL and revoke it before creating a new one or after a successful upload.
- **Phase**: UI Development.

### 4. Overwriting Existing Files
- **The Pitfall**: Using the user's original filename (e.g., `juice.png`) for storage. Since two admins might upload `juice.png` for different items, filenames will conflict.
- **The Prevention**: Use a UUID or a timestamp-based filename (e.g., `${Date.now()}-${file.name.replace(/\s+/g, '-')}`).
- **Phase**: Logic Development.

### 5. Large Payload Failures
- **The Pitfall**: Attempting to upload very large images (e.g., 20MB) that exceed Supabase's default limits or the user's memory capacity.
- **The Prevention**: Implement both client-side and server-side (bucket-level) file size limits (e.g., 5MB max).
- **Phase**: Validation.
