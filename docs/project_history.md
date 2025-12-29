# NazARa - Project Development Log

This document records the step-by-step process taken to build **NazARa**, an AR Menu Platform.

## 1. Project Inception & Planning
*   **Initial Idea**: User proposed an AR application for Pakistani restaurants to view 3D food models.
*   **Market Research**: Analyzed WebAR vs Native Apps.
    *   *Decision*: **WebAR** was chosen for lower friction (no app download required) and higher reliability using `<model-viewer>`.
*   **Technology Stack Definition**:
    *   **Frontend**: Next.js 15 (App Router) + Tailwind CSS.
    *   **Backend**: Supabase (PostgreSQL + Auth + Storage).
    *   **AR Engine**: Google `<model-viewer>` (Web Component).
*   **Architecture Refinement**:
    *   Split into two sections: **Admin Dashboard** (Computer Program) and **User Web App** (Mobile AR).

## 2. Branding
*   **Brainstorming**: Proposed names like *NazarAR*, *Dawat 360*, *Khana Lens*.
*   **Selection**: User chose **"NazARa"** (Urdu for "Scenery/View") with stylized AR capitalization.

## 3. Project Initialization
*   **Location**: User requested project creation in `/run/media/saad/Saad/nazARa` (External Drive).
    *   *Issue*: Permission/Workspace access denied.
    *   *Resolution*: Created in `/home/saad/Documents/NazARa` with user approval to move it later.
*   **Bootstrapping**:
    *   Ran `create-next-app` (workaround: used lowercase `nazara` then renamed to `NazARa`).
    *   Installed dependencies: `lucide-react`, `supabase-js`, `shadcn-ui`.
    *   Initialized **Shadcn/UI** design system.

## 4. Phase 1: Admin Dashboard Implementation
*   **Database Setup**:
    *   Created `menu_items` table in Supabase (Name, Description, Price, Model URL).
    *   Created `models` storage bucket for `.glb` files.
*   **Authentication**:
    *   Configured Supabase Auth (Email/Password).
    *   Created `AdminLoginPage` (`/admin/login`).
*   **Menu Management ("Add Item")**:
    *   Built `AdminDashboardPage`.
    *   Implemented `AddItemSheet`: Secure 3D model upload to Supabase Storage + Database entry creation.
    *   Added Realtime updates using Supabase subscriptions.
*   **QR Code Generation**:
    *   Installed `react-qr-code`.
    *   Created `QRCodeDialog`: Generates a unique QR pointing to `/view/[id]` for each dish.
    *   Added feature to download QR as PNG.

## 5. Phase 2: User WebAR Implementation
*   **AR Viewer**:
    *   Installed `@google/model-viewer`.
    *   Created `ARViewer` component: Handles 3D rendering and "View in AR" triggers for iOS/Android.
*   **Product Page**:
    *   Built dynamic route `/view/[id]`.
    *   Server-side fetches dish details from Supabase.
    *   Displays 3D model with AR capability.
*   **Landing Page**:
    *   Updated `page.tsx` with a simple landing screen linking to Admin Login.

## 6. Final Handover
*   **Assets**: Created `walkthrough.md` guide.
*   **Instructions**: provided steps to create the initial Admin User via Supabase Dashboard.
