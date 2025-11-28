# Activity Tracker

Un outil moderne de gestion d'activité professionnelle pour chefs de projet.

## 🚀 Features

### To-Do Management
- Vue journalière optimisée
- Gestion des priorités (P1, P2, P3)
- Report automatique des tâches
- Tags et catégorisation
- Lien avec les projets

### Project Management
- Dashboard visuel des projets
- Gestion de documents
- Timeline et milestones
- Notes et journal de bord
- Suivi de progression

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Custom Design System
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel

## 📦 Setup

### 1. Clone the repository

\`\`\`bash
git clone <your-repo>
cd activity-tracker
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Setup Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a \`.env.local\` file:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

4. Run the SQL schema in your Supabase SQL editor:

Copy the contents of \`supabase-schema.sql\` and execute it in your Supabase dashboard under SQL Editor.

### 4. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design System

### Colors

- Background: `#0A0A0A` (presque noir)
- Surface: `#141414`, `#1A1A1A`
- Text: `#FFFFFF`, `#A0A0A0`
- Accent: White with opacity
- Success: `#10B981`
- Warning: `#F59E0B`
- Danger: `#EF4444`

### Typography

- Font: Geist Sans
- Modern, clean, fintech-inspired

## 📝 License

Private - Internal use only
