# HôtelFlow

Application web tout-en-un pour la gestion d'hôtels indépendants (10 à 60 chambres). Français, responsive (desktop, tablette, téléphone).

## Stack

- Frontend : Next.js 16 + Tailwind CSS 4
- Backend : Supabase (PostgreSQL + Auth + Storage)
- Hébergement : Vercel
- IA : templates pré-générés (pas d'API payante)

## Installation

```bash
cd /Users/brice/OpenBot/Shared/hotelflow
npm install
cp .env.example .env.local
# Renseigner NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Commandes

```bash
npm run dev     # serveur de dev (http://localhost:3000)
npm run build   # build production
npm run start   # serveur production
npm run lint    # lint
```

## Variables d'environnement

| Variable | Requise | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | oui | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | oui | Clé anon publique Supabase |

Aucun secret dans le code ni dans les rapports. Les services externes indisponibles s'affichent comme « Démonstration » ou « Non connecté ».

## Données de démonstration

La base Supabase contient des données fictives (20 chambres, 8 clients, réservations, tâches, ménage, maintenance, emails, appels, avis). Une réservation de démonstration a été sauvegardée (statut `confirmed`, source `direct`).

## Socle démarrable

- Build production : `npm run build` → OK (13 routes statiques).
- App démarre avec `npm run dev`.

## Contrats API

Voir `API_CONTRACTS.md` (à la racine du projet) pour les contrats consommés par Pixel (interface) et Iris (automatisations).