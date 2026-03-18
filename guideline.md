AI DEVELOPMENT GUIDELINES
Project: COME BRO CHILL BRO – Shop Management System

--------------------------------------------------

1. PURPOSE

This document defines strict guidelines for AI systems generating or modifying code for this project.

The goal is to ensure:

- Clean architecture
- Production-level quality
- Security best practices
- Maintainable code
- Real shop usability

--------------------------------------------------

2. GENERAL RULES

- DO NOT rewrite the entire project unless explicitly asked
- Follow modular architecture
- Keep frontend and backend clearly separated
- Do NOT hardcode sensitive values
- Always prioritize readability and simplicity
- Avoid unnecessary complexity

--------------------------------------------------

3. ARCHITECTURE RULES

Follow this structure strictly:

Frontend → Backend API → Supabase

- Frontend must NOT directly access database (except safe public reads if allowed)
- Backend handles:
  - authentication validation
  - role authorization
  - rate limiting
  - input validation

--------------------------------------------------

4. FRONTEND RULES

- Use plain HTML, CSS, JavaScript (no heavy frameworks unless asked)
- Keep UI consistent with existing design (card-based, sidebar layout)
- Separate logic into files:

auth.js → login logic  
api.js → backend calls  
admin.js → admin features  
pos.js → POS logic  
kitchen.js → kitchen logic  

- Do NOT mix all logic in one file
- Use reusable functions

--------------------------------------------------

5. BACKEND RULES (CRITICAL)

Technology: Node.js + Express

Must include:

- Middleware-based structure
- Separate:
  - routes
  - controllers
  - services
  - middleware

--------------------------------------------------

5.1 REQUIRED MIDDLEWARE

- Authentication middleware
- Role-based access middleware
- Rate limiter middleware
- Input validation middleware

--------------------------------------------------

5.2 API DESIGN RULES

- Use REST API principles
- Use proper HTTP methods:

GET → fetch data  
POST → create  
PUT → update  
DELETE → remove  

- Always return JSON responses

--------------------------------------------------

6. DATABASE RULES (SUPABASE)

- Use structured tables:

users  
menu  
orders  
order_items  

- Do NOT create unnecessary tables
- Use proper relationships (foreign keys)

--------------------------------------------------

7. REAL-TIME RULES

- Kitchen must use real-time updates
- DO NOT use polling (no setInterval for fetching)
- Use Supabase realtime subscriptions

--------------------------------------------------

8. SECURITY RULES (MANDATORY)

--------------------------------------------------

8.1 RATE LIMITING

- Apply to all API endpoints
- Implement both:
  - IP-based
  - user-based

Return:
429 Too Many Requests

--------------------------------------------------

8.2 INPUT VALIDATION

- Validate ALL inputs
- Reject:
  - wrong types
  - extra fields
  - empty values
- Enforce limits:
  - name length
  - price > 0
  - valid table numbers

--------------------------------------------------

8.3 SANITIZATION

- Prevent XSS
- Trim all strings
- Escape unsafe inputs

--------------------------------------------------

8.4 API KEY HANDLING

- NEVER hardcode keys
- Use environment variables:

.env file

- Do NOT expose private keys in frontend

--------------------------------------------------

8.5 AUTHORIZATION

- Enforce role checks on backend:

Admin → full access  
POS → limited  
Kitchen → limited  

--------------------------------------------------

8.6 DATABASE SECURITY

- Use Supabase RLS policies
- Restrict access based on roles

--------------------------------------------------

8.7 FILE UPLOAD SECURITY

- Allow only:
  jpg, png

- Limit file size to 2MB

--------------------------------------------------

9. ERROR HANDLING RULES

- NEVER expose internal errors
- Return safe messages:

"Something went wrong"

- Log real errors internally

--------------------------------------------------

10. CODING STYLE

- Use clear variable names
- Use consistent formatting
- Avoid deeply nested code
- Use async/await properly
- Add comments only where needed

--------------------------------------------------

11. PERFORMANCE RULES

- Avoid unnecessary API calls
- Cache where possible
- Use efficient queries
- Do NOT block UI

--------------------------------------------------

12. DEPLOYMENT RULES

- Ensure project runs in production mode
- Remove debug logs
- Ensure environment variables are used
- Optimize assets

--------------------------------------------------

13. DO NOT DO THESE

- ❌ Do not hardcode credentials
- ❌ Do not bypass backend security
- ❌ Do not mix frontend + backend logic
- ❌ Do not create duplicate APIs
- ❌ Do not expose database directly

--------------------------------------------------

14. EXPECTED OUTPUT FROM AI

Whenever generating code, AI must:

- Follow file structure
- Place code in correct files
- Maintain modularity
- Ensure security rules are followed
- Ensure production readiness

--------------------------------------------------

15. FINAL GOAL

The generated system must be:

- Stable for real shop usage
- Secure against misuse
- Easy for staff to use
- Scalable for future expansion

--------------------------------------------------

END OF DOCUMENT