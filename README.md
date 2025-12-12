# Reset HTX - Admin Management System

A robust, modern, and high-performance dashboard for managing restaurant/bar operations. This repository currently houses the **Admin Backend**, built with Next.js and Supabase, featuring a dark-mode glassmorphic design and real-time data management.

> 🚧 **Status:** Admin Backend Complete. Public Frontend is currently under development.

## 🚀 Key Features

### 🔐 Security & Auth
- **Secure Authentication:** Powered by Supabase Auth (Email/Password).
- **Middleware Protection:** Automatic redirection for unauthorized access.
- **Password Recovery:** Built-in "Forgot Password" flow.
- **Settings:** Admin profile management and password updates.

### 📅 Event Management
- **Scheduling:** Create, edit, and manage upcoming events.
- **Conflict Detection:** Smart warnings if you try to book two events at the same time.
- **Auto-Archiving:** Events automatically move to the "Past Events" archive when their date passes.
- **Image Optimization:** Automatic client-side compression (WebP) for faster uploads and reduced storage costs.

### 🍽️ Menu System
- **Categorized Management:** Organize items by Starters, Mains, Drinks, etc.
- **Duplicate Prevention:** Automatic scanning to prevent duplicate menu item names.
- **Search & Filter:** Real-time search for managing large menus.
- **Stock Control:** Toggle items as "Sold Out" instantly.

### 📍 Floor Plan (Tables)
- **Interactive Map:** Visual representation of restaurant tables.
- **Live Status:** Color-coded indicators for *Available*, *Reserved*, and *Occupied*.
- **Quick Actions:** One-click status updates directly from the card view.

### 👥 Staff & Operations
- **Staff Management:** Add employees with specific roles (Admin, Manager, Staff).
- **Promo Codes:** Generate and manage discount codes with active/inactive toggles.
- **Inbox:** Centralized hub for viewing customer messages/contact form submissions.

### 🎨 UI/UX
- **Dark Mode First:** Sleek, modern interface using Tailwind CSS.
- **Glassmorphism:** Premium aesthetic with blur effects and spotlight gradients.
- **Responsive:** Fully optimized for mobile admin management on the go.
- **Loading States:** Smooth skeletons and spinners for a polished feel.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion & CSS Transitions
- **Utilities:** `use-debounce` for search, Canvas API for image compression.