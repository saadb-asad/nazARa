# NazARa - Redesign Implementation Plan

## Goal Description
Revamp the frontend to be modern, premium, and "Red-themed". Implement a "Tesla-style" dashboard and a "Physical Stand" style printable QR code.

## Visual Identity
*   **Primary Color**: **Red** (Modern/Netflix-red or Tesla-red hue).
*   **Font**: **Plus Jakarta Sans** or **Outfit** (Premium, geometric sans-serif).
*   **Logo**: "Naz**AR**a" - Highlighting "AR" in a distinct color (or keeping it Red while the rest is Dark, or vice versa).
*   **Style**: rounded corners (`rounded-xl` or `2xl`), soft shadows, white cards on light gray background.

## Database Updates
*   **Table**: `menu_items`
    *   Add `restaurant_name` (text) -> To group items by restaurant.

## Page Structure
1.  **Login Page**: Minimalist, Red branding.
2.  **Admin Dashboard**:
    *   **Layout**: Sidebar (Left), Header (Top), Content Area.
    *   **Features**:
        *   **Stats Cards**: (Mock data for now) Active items, Scans.
        *   **Grouping**: Tabs or Dropdown to switch between "Restaurants" (groups).
        *   **Add Item**: Enhanced modal.
        *   **QR Print**: A specialized view to print the "Stand" card (like the uploaded reference).
    *   **Analytics Engine**:
        *   **Tracking**: Auto-insert into `scans` table on `view/[id]` load.
        *   **Visualization**: Install `recharts` for a "Scans this Week" bar chart.
        *   **Stats**: Real `count(*)` queries for the dashboard cards.

## Verification Plan
*   **Automated**: None.
*   **Manual**:
    *   Verify Red theme and Font application.
    *   Test "Add Item" with a specific Restaurant Name.
    *   Test grouping filters.
    *   Check "Print QR" layout matches the physical stand reference.
