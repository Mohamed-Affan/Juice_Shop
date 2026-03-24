# Research Summary: Juice Shop

## Synthesis of Domain Exploration (2025)

The goal is to modernize the **Juice Shop** menu management system by replacing manual "Image URL" entry with a robust **direct-to-Supabase file upload** experience. The research confirms that a **Client-Direct Upload** pattern is the most maintainable and performant strategy for 2025 applications leveraging a BaaS architecture.

---

## Key Findings

### **Stack**
- **Existing**: Node.js/Express, Vanilla JS, Supabase (DB/Auth).
- **Expansion**: **Supabase Storage** for object management, employing the **Client-Direct** pattern.

### **Table Stakes**
- **Direct File Selection**: Browser-native `<input type="file">`.
- **Live Preview**: Instant visual state change using `URL.createObjectURL()`.
- **Validation**: 5MB size limit and JPG/PNG/WebP format enforcement.

### **Watch Out For**
- **RLS Access Errors**: Buckets must be configured with correct "authenticated admin" write permissions.
- **Filename Conflicts**: Always generate unique filenames (UUID-based) to prevent accidental overwrites.
- **Memory Management**: Proactively revoke temporary preview URLs.

---

## Implementation Rationale
Directly uploading from the browser to Supabase Storage:
1. **Reduces Backend Latency**: No need for the Node.js server to handle binary streams.
2. **Simplified Validation**: Leveraging Supabase's bucket-level size and type restrictions.
3. **Improved UX**: Users see immediate feedback and the upload status can be tracked via the SDK.

---
*Last updated: 2026-03-24 after Research Phase*
