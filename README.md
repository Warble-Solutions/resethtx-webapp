# Reset HTX - Full Stack Web Application

A premium, high-performance web platform for **Reset HTX**, featuring a cinematic public frontend and a robust admin operation dashboard. Built with **Next.js 16**, **Supabase**, and formatted with a sleek "Dark Mode First" aesthetic using **Tailwind CSS v4**.

> ✅ **Status:** Production Ready. Active Development.

---

## 🌐 Public Frontend
The public face of the application, designed to immerse users in the "Reset" vibe immediately.

### ⚡ Performance & UX
-   **Instant Navigation:** Implemented `Promise.all` parallel data fetching and custom `loading.tsx` skeletons for zero-latency transitions.
-   **Smart Layouts:** Menu cards intelligently adapt their layout, expanding text areas when images are unavailable.
-   **Glassmorphism:** Extensive use of backdrop blurs, gradients, and subtle animations (`framer-motion`, `animejs`) creates a premium feel.

### 📅 Interactive Features
-   **Events Calendar:** A fully interactive calendar view for upcoming events, with list and grid alternatives.
-   **Standardized Time:** Consistent 12-hour time formatting (e.g., "9:00 PM - 2:00 AM") across all components.
-   **Digital Menu:** Real-time menu with category filtering and spotlight search.

---

## ⚙️ Admin Dashboard
A powerful command center for managing restaurant operations in real-time.

### 🚀 Optimized Operations
-   **High-Speed Data:** The **Reservations** and **Dashboard** pages use optimized parallel fetching to load complex relational data (Bookings + Tables + Events) instantly.
-   **Secure Auth:** Powered by Supabase Auth with strict middleware protection for all `/admin` routes.

### 🛠️ Management Modules
-   **Reservations & Floor Plan:** Interactive table management with live status indicators (Available/Occupied/Reserved).
-   **Event Scheduling:** Create and edit events with automatic conflict detection and recurring event support.
-   **Menu Control:** Real-time price updates, "Sold Out" toggles, and image management.
-   **Staff & Inbox:** Manage employee access roles and view customer inquiries in a centralized inbox.

---

## 🛠️ Tech Stack

### Core
-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
-   **Language:** TypeScript
-   **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)

### Styling & UI
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Icons:** Lucide React
-   **Fonts:** Google Fonts (Inter, Cinzel, Manrope)
-   **Animations:** `framer-motion`, `animejs`

### Utilities & Tools
-   **Image Processing:** `react-easy-crop` (Client-side cropping)
-   **Payments:** Stripe Integration
-   **Performance:** `nextjs-toploader` for navigation progress
-   **Linting:** ESLint

---

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/marz-20/resethtx-webapp.git
    cd resethtx-webapp
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file with your Supabase credentials:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📄 License
Private Repository. All Rights Reserved.
