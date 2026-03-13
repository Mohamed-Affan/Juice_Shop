# Juice Shop Order & Kitchen Management System
Product Requirements Document (PRD)

---------------------------------------

1. Project Overview

This project is a web-based Juice Shop Management System designed to help a small juice shop manage orders, kitchen workflow, and daily revenue.

The system allows:
- Counter staff to take orders with table numbers
- Kitchen staff to see incoming orders
- Admin to manage menu items and track earnings

The system will run on a local network inside the shop.

Main interfaces:
1. Admin Dashboard
2. Counter Order Page
3. Kitchen Display Page

---------------------------------------

2. User Roles

Admin
The shop owner or manager.

Responsibilities:
- Add new menu items
- Edit or delete menu items
- View today's orders
- View total earnings for the day
- View order history

Counter Staff
The person taking orders at the counter.

Responsibilities:
- Select menu items
- Enter table number
- Send orders to the kitchen
- Generate a bill

Kitchen Staff
Kitchen workers preparing orders.

Responsibilities:
- View incoming orders
- See table number
- See ordered items
- Track time since the order was placed
- Mark orders as completed

---------------------------------------

3. System Pages

Admin Page
Route:
/admin

Features:
- Add menu items
- Edit menu items
- Delete menu items
- View today's orders
- View today's earnings

Example menu:

Mango Juice - 100
Orange Juice - 80
Apple Juice - 90


Counter Page
Route:
/counter

Features:
- Display menu items
- Select quantity for items
- Enter table number
- Send order to kitchen

Example order:

Table: 5

2 Mango Juice
1 Orange Juice


Kitchen Page
Route:
/kitchen

Features:
- Display incoming orders
- Show table number
- Show ordered items
- Show timer since order was placed
- Mark order as completed

Example display:

Table 5

2 Mango Juice
1 Orange Juice

Timer: 02:10


---------------------------------------

4. System Workflow

Customer places order at counter

↓

Counter selects menu items and enters table number

↓

Order is sent to kitchen

↓

Kitchen screen shows the order

↓

Kitchen prepares the order

↓

Kitchen marks order as completed

↓

Counter generates bill

↓

Customer pays

↓

Admin dashboard records orders and revenue

---------------------------------------

5. Database Design

Table: Menu

id
name
price


Table: Orders

id
table_number
order_time
status

status values:
pending
preparing
completed


Table: Order_Items

id
order_id
menu_id
quantity

---------------------------------------

6. Backend API Requirements

GET /api/menu
Returns all menu items

POST /api/menu
Adds new menu item

POST /api/orders
Creates new order

GET /api/orders
Returns active orders for kitchen

PUT /api/orders/{id}/complete
Marks order as completed

GET /api/reports/today
Returns today's earnings and orders

---------------------------------------

7. Technology Stack

Backend:
Python
Flask

Frontend:
HTML
CSS
JavaScript

Database:
SQLite

Version Control:
Git
GitHub

---------------------------------------

8. Project Folder Structure

Juice_Shop

backend
    app.py
    database.py
    routes.py

frontend
    admin.html
    counter.html
    kitchen.html

    css
        style.css

    js
        script.js

database
    db.sql

README.md

---------------------------------------

9. Development Goal

Build a simple but scalable restaurant order management system that:

- Allows counter staff to send orders to kitchen
- Shows kitchen staff live incoming orders
- Tracks table numbers
- Tracks daily revenue
- Allows admin to manage menu items

---------------------------------------