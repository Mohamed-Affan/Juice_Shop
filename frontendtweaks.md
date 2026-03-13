-------------------------------------------------------
PRD ADDITION – Kitchen Order Visual Alerts & Sound
-------------------------------------------------------

Feature Name:
Kitchen Order Alert & Time-Based Color System

Overview

The kitchen display page must visually indicate how long an order has been waiting using a color-coded timer system. The goal is to help kitchen staff quickly identify delayed orders.

Additionally, the kitchen should receive a sound notification whenever a new order arrives.

This feature is purely a frontend enhancement and will work on top of the existing order system.

-------------------------------------------------------

1. Color Coding System for Order Timer

Every order displayed in the kitchen interface must include a timer showing how long it has been since the order was placed.

The order card background color will change depending on the time elapsed.

Color Stages:

0–7 Minutes
Color: GREEN
Meaning: Order is fresh and within acceptable preparation time.

7–15 Minutes
Color: YELLOW
Meaning: Order is taking longer than usual and should be prioritized.

15+ Minutes
Color: RED
Meaning: Order is delayed and requires immediate attention.

Color Transition Behavior:

When the timer starts:
Order card background = Green

At 7 minutes:
Order card background changes to Yellow

After 15 minutes:
Order card background gradually transitions to Red

This color change must happen automatically without refreshing the page.

-------------------------------------------------------

2. Kitchen Order Timer

Each order displayed in the kitchen interface must show a live timer.

Example display:

Table 4
2 Mango Juice
1 Orange Juice

Timer: 02:35

The timer must start when the order is received by the kitchen.

The timer should update every second.

-------------------------------------------------------

3. Kitchen Notification Sound

When a new order is received by the kitchen interface, a sound notification must play to alert kitchen staff.

Behavior:

When a new order appears in the kitchen dashboard:
• Play notification sound
• Highlight the order card briefly

Example:

New order arrives → Sound plays → Order card appears at top.

Sound Requirements:

Short alert sound
Not too loud
Should not repeat continuously

Example audio trigger:

playSound("order-alert.mp3")

-------------------------------------------------------

4. Kitchen UI Order Card Example

Each order should appear as a card on the kitchen screen.

Example:

----------------------------------

Table: 5

Items:
2 Mango Juice
1 Apple Juice

Timer: 05:30

Status: Preparing

----------------------------------

Card colors change automatically depending on time elapsed.

-------------------------------------------------------

5. Frontend Requirements

Kitchen page must include:

• Timer update system
• Color changing order cards
• Audio notification system
• Automatic order updates (via polling or WebSocket)

Suggested update frequency:
Fetch new orders every 3–5 seconds.

-------------------------------------------------------

6. Suggested Frontend Structure

frontend
    kitchen.html
    css
        kitchen.css
    js
        kitchen.js
    sounds
        order-alert.mp3

-------------------------------------------------------

7. Implementation Logic

When order is received:
1. Add order card to kitchen display
2. Start timer
3. Set background color = green
4. Play notification sound

Timer Logic:

if time < 7 minutes
    color = green

if 7 minutes <= time < 15 minutes
    color = yellow

if time >= 15 minutes
    color = red

-------------------------------------------------------

8. Goal

Improve kitchen efficiency by allowing staff to:

• Quickly identify delayed orders
• Immediately notice new incoming orders
• Prioritize preparation using visual cues