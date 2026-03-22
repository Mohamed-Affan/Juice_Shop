📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)
🧃 Project Name
COME BRO CHILL BRO – Smart Juice Shop System

🎯 Objective
Build a real-world production-ready web application for a juice shop that enables:

Order management

Kitchen tracking

Admin analytics

Secure authentication

Scalable cloud database (Supabase)

👥 User Roles
1. Admin
Full access to system

Manage menu items

View analytics & profit

Access all pages

2. Waiter (POS User)
Create orders

Assign table numbers

Print bills

3. Kitchen Staff
View incoming orders

Track preparation time

Update order status

🧩 Core Features
🔐 1. Authentication System
Login page with username/password

Role-based access:

Admin → full access

Staff → limited access

Admin can change password

JWT-based authentication

🧑‍💼 2. Admin Dashboard
Features:
View all orders

View total revenue & profit

Add/Edit/Delete menu items:

Name

Price

Image

View order history

Monitor shop performance

🧾 3. Point of Sale (POS)
Features:
Select items from menu

Add quantity

Assign table number

Place order

Generate & print bill

Send order to kitchen in real-time

🍳 4. Kitchen Display System (KDS)
Features:
Show live incoming orders

Display:

Table number

Items

Timer

Color Coding System:
🟢 Green → < 5 minutes

🟡 Yellow → > 5 minutes

🔴 Red → > 10 minutes

Actions:
Mark order as completed

🗄️ 5. Database (Supabase)
Tables:
users

menu_items

orders

order_items

Capabilities:
Real-time updates

Cloud storage

Scalable

🔒 Security Requirements
1. Rate Limiting
Apply on all API endpoints

Limit by IP + user

Return proper 429 response

2. Input Validation
Validate all inputs:

Type checking

Length limits

Required fields

Reject invalid or unexpected fields

3. API Security
No hardcoded keys

Use .env for secrets

Never expose secret keys to frontend

Rotate keys if leaked

4. Authentication Security
Use JWT tokens

Secure routes with middleware

Role-based authorization

🏗️ System Architecture
Frontend:
HTML / CSS / JS

Pages:

login.html

admin.html

pos.html

kitchen.html

Backend:
Node.js + Express

Structure:

backend/
 ├── src/
 │   ├── controllers/
 │   ├── routes/
 │   ├── middleware/
 │   └── services/
Database:
Supabase (PostgreSQL)

📁 Project Structure
Juice_Shop/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── services/
│   ├── .env
│   ├── package.json
│
├── frontend/
│   ├── pages/
│   │   ├── login.html
│   │   ├── admin.html
│   │   ├── pos.html
│   │   ├── kitchen.html
│   ├── js/
│   ├── css/
│
├── supabase/
│   └── schema.sql