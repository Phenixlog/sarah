# Setup Guide - Activity Tracker

## 🚀 Démarrage rapide

### 1. Configuration Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre **Project URL** et **anon key**

### 2. Configuration de la base de données

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Copiez tout le contenu du fichier `supabase-schema.sql`
3. Exécutez le script SQL

Cela va créer :
- Les tables (profiles, todos, projects, etc.)
- Les politiques RLS (Row Level Security)
- Les triggers automatiques
- Le bucket de storage pour les documents

### 3. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
\`\`\`

### 4. Installation et lancement

\`\`\`bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Build production
npm run build
npm start
\`\`\`

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📝 Premier utilisateur

1. Allez sur `/signup`
2. Créez votre compte
3. Vous serez automatiquement connecté

## 🎯 Fonctionnalités principales

### To-Do
- ✅ Gestion de tâches avec priorités (P1, P2, P3)
- ✅ Vue par jour (Aujourd'hui, Demain, Backlog)
- ✅ Tâches en retard automatiquement affichées
- ✅ Report facile au lendemain
- ✅ Liaison avec les projets
- ✅ Tags et catégorisation
- ✅ Statuts : À faire, En cours, Terminé

### Projets
- ✅ Création et gestion de projets
- ✅ Statuts : On Track, At Risk, Bloqué, En Pause, Terminé
- ✅ Barre de progression (%)
- ✅ Jalons (milestones) avec dates
- ✅ Notes / Journal de bord
- ✅ Liaison avec les tâches
- ✅ Vue statistiques et vue d'ensemble

### Dashboard
- ✅ Vue d'ensemble de l'activité
- ✅ Statistiques du jour
- ✅ Projets actifs
- ✅ Accès rapide

## 🎨 Design System

L'application utilise un design noir et blanc moderne inspiré des applications fintech :

- **Palette** : Fond noir (#0A0A0A), surfaces grises, texte blanc
- **Typographie** : Geist Sans (moderne et lisible)
- **Composants** : Basés sur Radix UI pour l'accessibilité
- **Animations** : Micro-animations fluides

## 🔐 Sécurité

- ✅ Row Level Security (RLS) activé sur toutes les tables
- ✅ Authentification Supabase (email/password)
- ✅ Middleware de protection des routes
- ✅ Chaque utilisateur ne voit que ses données

## 📦 Stack Technique

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS, Design System custom
- **Backend** : Supabase (PostgreSQL, Auth, Storage)
- **UI Components** : Radix UI
- **Deployment** : Vercel (recommandé)

## 🚢 Déploiement sur Vercel

1. Push votre code sur GitHub
2. Connectez-vous sur [vercel.com](https://vercel.com)
3. Importez votre repository
4. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Déployez !

## 🔄 Fonctionnalités futures

Possibles améliorations :
- [ ] Upload réel de documents (Supabase Storage)
- [ ] Export PDF/Excel des rapports
- [ ] Invitations d'équipe
- [ ] Notifications
- [ ] Mode offline
- [ ] Application mobile (React Native)
- [ ] Intégrations (Slack, Email, etc.)

## 📞 Support

Pour toute question ou problème :
1. Vérifiez que la base de données est bien configurée
2. Vérifiez les variables d'environnement
3. Consultez les logs du serveur (`npm run dev`)
4. Vérifiez les politiques RLS dans Supabase

Bon travail ! 🚀
