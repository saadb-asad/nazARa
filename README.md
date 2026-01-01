# NazARa - AR Dining Experience 🍽️✨

**NazARa** is a next-generation restaurant management platform that brings menus to life using Augmented Reality (AR).

![NazARa Banner](https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop)

## 🚀 Features

*   **Admin Dashboard**: Manage restaurants, menus, and users with a sleek dark-themed interface.
*   **AR Menu Items**: Upload `.glb` 3D models of food items so customers can visualize them in 3D/AR.
*   **QR Code Generation**: Automatically generate QR codes for each menu item for easy scanning.
*   **Analytics**: Track scan counts and user engagement in real-time.
*   **Dark Mode**: A beautiful, immersive "Deep Slate" & "Purple" dark theme (NazARa 2.0).
*   **Role-Based Access**: Super Admin and Restaurant Manager roles secured by Supabase.

## 🛠️ Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Styling**: Tailwind CSS v4 + Shadcn/UI
*   **Database & Auth**: Supabase
*   **AR/3D**: Google `<model-viewer>`
*   **Icons**: Lucide React
*   **Deployment**: Vercel

## 📦 Getting Started

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/saadb-asad/nazARa.git
    cd nazARa
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file with your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🎨 Theme (NazARa 2.0)

*   **Primary Color**: Purple (`#6C5DD3`)
*   **Background**: Deep Slate (`#1A1A23`)
*   **Font**: Outfit / Inter

## 📝 License

This project is proprietary and developed for the NazARa platform.
