# Juice Shop Order & Billing System – PRD

## 1. Project Overview
We are building a web-based Juice Shop Management System to manage orders, kitchen workflow, and billing inside a juice shop or small restaurant.

The system will include:
- Admin dashboard
- Counter ordering page
- Kitchen display page
- Billing page with UPI payments

The goal is to:
- Speed up order processing
- Improve communication between counter and kitchen
- Track daily earnings
- Provide digital billing

---

# 2. User Roles

## 2.1 Admin
The shop owner or manager.

Responsibilities:
- Manage menu items
- View total orders
- View daily revenue
- View order history with timestamps

---

## 2.2 Counter Staff
Staff member taking orders.

Responsibilities:
- Select items from the menu
- Enter table number
- Send orders to kitchen
- Generate bill

---

## 2.3 Kitchen Staff
Kitchen workers preparing the orders.

Responsibilities:
- View incoming orders
- See table number
- See ordered items
- View timer since order was placed
- Mark orders as completed

---

# 3. System Pages

## 3.1 Admin Dashboard
Route:
`/admin`

Features:
- Add menu items
- Edit menu items
- Delete menu items
- View today's orders
- View total earnings today
- View order history

Menu item structure:

name  
price  
category (optional)

Example:

Mango Juice – ₹100  
Orange Juice – ₹80  
Apple Juice – ₹90  

---

## 3.2 Counter Page
Route:
`/counter`

Features:
- Display menu items
- Select items and quantity
- Enter table number
- Send order to kitchen
- Generate bill

Example order:

Table: 5

Items:
2 Mango Juice  
1 Orange Juice  

---

## 3.3 Kitchen Display Page
Route:
`/kitchen`

Features:
- Display incoming orders
- Show table number
- Show ordered items
- Display timer since order was placed
- Mark order completed

Example:

Table 5

2 Mango Juice  
1 Orange Juice  

Timer: 02:15

---

## 3.4 Billing Page
Route:
`/billing`

Features:
- Generate bill
- Show total price
- Accept payment methods:
  - Cash
  - UPI QR Code

UPI example:

upi://pay?pa=juiceshop@upi&pn=JuiceShop&am=150

Customers can pay using:
- Google Pay
- Paytm
- PhonePe

---

# 4. System Workflow

Customer places order → Counter

Counter sends order → Kitchen

Kitchen prepares order → Marks completed

Counter generates bill → Customer pays

Admin dashboard records orders and earnings

---

# 5. Database Design

## Table: Menu
id  
name  
price  

## Table: Orders
id  
table_number  
order_time  
status  
total_amount  

Status values:

pending  
preparing  
completed  
paid  

## Table: Order_Items
id  
order_id  
menu_id  
quantity  

---

# 6. Backend Requirements

Backend should provide REST APIs.

Get menu
GET /api/menu

Add menu item
POST /api/menu

Create order
POST /api/orders

Get active orders
GET /api/orders

Mark order completed
PUT /api/orders/{id}/complete

Get today's revenue
GET /api/reports/today

---

# 7. Frontend Requirements

Frontend pages:

admin.html  
counter.html  
kitchen.html  
billing.html  

Frontend communicates with backend using JavaScript fetch API.

---

# 8. Technology Stack

Backend  
Python  
Flask  

Frontend  
HTML  
CSS  
JavaScript  

Database  
SQLite  

Version Control  
Git  
GitHub  

---

# 9. Project Structure

Juice_Shop

backend  
app.py  

frontend  
admin.html  
counter.html  
kitchen.html  
billing.html  

database  
db.sql  

README.md

---

# 10. Development Goal

Build a simple but scalable restaurant management system that:

- Handles orders efficiently
- Improves kitchen workflow
- Tracks daily earnings
- Supports quick digital payments