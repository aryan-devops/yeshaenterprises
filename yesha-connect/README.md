# 🏢 YESHA Connect — Yesha Enterprises Order Management Platform

> A real-time order tracking and communication platform built for **Yesha Enterprises** to manage fabrication orders, coordinate with manufacturers and technicians, and keep customers informed throughout the entire project lifecycle.

---

## ✨ Features

- **Multi-Role Dashboard** — Separate views and permissions for Admin, Manufacturer, Technician, and Customer roles
- **Real-Time Chat** — Live team messaging powered by Socket.io, scoped per order
- **Order Lifecycle Tracking** — Full status pipeline from Order Confirmed → Manufacturing → Dispatch → Installation Completed
- **Public Order Tracking** — Shareable customer-facing tracking pages with live status and document access
- **Document Management** — Attach blueprints, sign-offs, and completion photos to orders
- **Technician Verification** — Technicians claim installation orders via unique codes and upload completion photos
- **Supabase Backend** — Authentication, database, and file storage via Supabase

---

## 🧑‍💼 User Roles

| Role | Capabilities |
|---|---|
| **Super Admin** | Create orders, manage all users, update any status, assign technicians |
| **Manufacturer** | Access assigned orders, update manufacturing status, chat with team |
| **Technician** | Claim installation orders via code, mark jobs complete with photo upload |
| **Customer** | Track order status in real-time via unique public link |

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **Real-Time**: Socket.io
- **UI**: Tailwind CSS v4, shadcn/ui components, Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

---

## 🚀 Running Locally

You need **two terminals** — one for Next.js and one for the Socket.io server.

### 1. Install dependencies
```bash
cd yesha-connect
npm install
```

### 2. Set up environment variables
Create a `.env.local` file in the `yesha-connect/` directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### 3. Start the Socket.io server
```bash
node server.js
```
> Runs on `http://localhost:4000`

### 4. Start the Next.js dev server
```bash
npm run dev
```
> Runs on `http://localhost:3000`

---

## ☁️ Deployment

### Next.js → Vercel
1. Import `aryan-devops/yeshaenterprises` in Vercel
2. Set **Root Directory** to `yesha-connect`
3. Add all environment variables including `NEXT_PUBLIC_SOCKET_URL` pointing to your Railway socket server

### Socket.io Server → Railway
1. Import `aryan-devops/yeshaenterprises` in Railway
2. Set **Root Directory** to `yesha-connect`
3. Set **Start Command** to `node server.js`

---

## 📁 Project Structure

```
yesha-connect/
├── src/
│   ├── app/
│   │   ├── dashboard/          # Main dashboard (Admin, Manufacturer, Technician views)
│   │   ├── login/              # Authentication
│   │   ├── p/[token]/          # Public customer tracking pages
│   │   └── layout.tsx
│   ├── components/ui/          # Reusable UI components
│   ├── lib/supabase/           # Supabase client setup
│   └── middleware.ts           # Route protection
├── supabase/migrations/        # Database schema & RLS policies
├── server.js                   # Socket.io real-time server
└── public/
    └── yesha-logo.png          # Yesha Enterprises logo
```

---

## 📄 License

Private — Yesha Enterprises. All rights reserved.
