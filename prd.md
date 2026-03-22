PRODUCT REQUIREMENTS DOCUMENT (PRD)

Project Name: COME BRO CHILL BRO – Shop Management System
Version: Production v1
Type: Real-world POS + Kitchen System

--------------------------------------------------

1. OVERVIEW

MY BRO SWEET  BRO is a production-grade web-based system designed for a real juice shop.

It provides:

- Point of Sale (POS) for order taking
- Kitchen Display System (KDS)
- Admin dashboard for control and analytics

The system is built to run reliably in a real shop environment using:

Frontend: HTML, CSS, JavaScript  
Backend: Node.js (Express)  
Database: Supabase (PostgreSQL + Auth + Storage + Realtime)

--------------------------------------------------

2. OBJECTIVES

- Fast and simple order taking
- Real-time kitchen updates
- Accurate billing and tracking
- Secure and stable system for daily shop use
- Minimal training required for staff

--------------------------------------------------

3. USER ROLES

Admin
- Full access to all pages
- Manage menu and users
- View revenue and reports
- Change passwords

POS (Waiter / Counter)
- Access only POS page
- Place orders
- Print bills

Kitchen
- Access only kitchen page
- View and complete orders

--------------------------------------------------

4. CORE FEATURES

--------------------------------------------------

4.1 ADMIN PANEL

- Add menu items (name, price, image)
- Edit menu items
- Delete menu items
- View total revenue
- View total orders
- View recent orders
- Change user passwords

--------------------------------------------------

4.2 POINT OF SALE (POS)

- Display menu with images
- Add items to cart
- Modify quantities
- Enter table number
- Select order type (Dine-in / Takeaway)
- Place order
- Print bill using browser

Workflow:
Select Items → Enter Table → Place Order → Print Bill

--------------------------------------------------

4.3 KITCHEN DISPLAY SYSTEM

- Show live incoming orders
- Display:
  - Table number
  - Items
  - Timer

Color Coding:

0–5 minutes → GREEN  
5–10 minutes → YELLOW  
10+ minutes → RED  

- Auto update in real-time
- Mark order as completed

--------------------------------------------------

4.4 AUTHENTICATION SYSTEM

- Login required for all users
- Role-based access control

Admin → all pages  
POS → POS only  
Kitchen → Kitchen only  

- Admin can change passwords

--------------------------------------------------

5. DATABASE DESIGN (SUPABASE)

users
- id
- username
- password_hash
- role
- created_at

menu
- id
- name
- price
- image_url
- created_at

orders
- id
- table_number
- status (pending / preparing / completed)
- total_amount
- created_at

order_items
- id
- order_id
- menu_id
- quantity

--------------------------------------------------

6. REAL-TIME SYSTEM

Using Supabase Realtime:

- New orders appear instantly in kitchen
- Completed orders update immediately
- Admin dashboard updates live

--------------------------------------------------

7. SECURITY REQUIREMENTS

--------------------------------------------------

7.1 RATE LIMITING

- IP: 100 requests per 5 minutes
- User: 60 actions per minute

If exceeded:
Return:
429 Too Many Requests

Message:
"Too many requests. Please try again later."

--------------------------------------------------

7.2 INPUT VALIDATION

All inputs must be:

- Type checked
- Length restricted
- Sanitized

Examples:

Menu:
- name: string (1–50 chars)
- price: number > 0

Orders:
- table_number: integer
- items: non-empty array

Reject:
- unexpected fields
- invalid data types

--------------------------------------------------

7.3 API KEY SECURITY

- No hardcoded keys in code
- Use environment variables

Example:

SUPABASE_URL=xxxx
SUPABASE_KEY=xxxx
JWT_SECRET=xxxx

- Never expose private keys in frontend

--------------------------------------------------

7.4 ROLE-BASED ACCESS CONTROL

Backend must enforce:

Admin → full access  
POS → limited access  
Kitchen → limited access  

Unauthorized access → redirect to login

--------------------------------------------------

7.5 DATABASE SECURITY (RLS)

Enable Row Level Security in Supabase:

- Menu write → admin only
- Orders create → POS/admin
- Orders read → kitchen/admin
- Orders update → kitchen/admin

--------------------------------------------------

7.6 FILE UPLOAD SECURITY

- Allow only jpg/png
- Max size: 2MB
- Reject invalid files

--------------------------------------------------

7.7 ERROR HANDLING

Do NOT expose:
- stack traces
- database errors

Show:
"Something went wrong. Please try again."

--------------------------------------------------

7.8 LOGGING

Track:
- failed logins
- suspicious activity
- high request frequency

--------------------------------------------------

8. BACKEND REQUIREMENTS

Technology: Node.js + Express

Responsibilities:

- API handling
- Authentication validation
- Rate limiting
- Input validation
- Role-based authorization

Example APIs:

POST /api/login  
GET /api/menu  
POST /api/menu  
POST /api/orders  
PUT /api/orders/:id/complete  
GET /api/reports  

--------------------------------------------------

9. FILE STRUCTURE

come-bro-chill-bro/

frontend/
  pages/
    login.html
    admin.html
    pos.html
    kitchen.html

  css/
    style.css

  js/
    config.js
    auth.js
    api.js
    admin.js
    pos.js
    kitchen.js

  assets/
    images/
    icons/
    sounds/
      alert.mp3

backend/
  src/
    routes/
    controllers/
    middleware/
      auth.js
      rateLimiter.js
      validator.js
    services/
      supabase.js
    app.js

  .env
  package.json

supabase/
  schema.sql

README.md

--------------------------------------------------

10. DEPLOYMENT

Frontend:
- Vercel or Netlify

Backend:
- Render or Railway

Database:
- Supabase

Architecture:

Frontend → Backend API → Supabase

--------------------------------------------------

11. REAL SHOP WORKFLOW

Waiter takes order  
→ POS sends to backend  
→ Stored in Supabase  
→ Kitchen sees instantly  
→ Order prepared  
→ Marked completed  
→ Admin tracks revenue  

--------------------------------------------------

END OF DOCUMENT