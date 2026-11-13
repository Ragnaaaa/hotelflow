# HôtelFlow — Contrats API (pour Pixel et Iris)

Base : Supabase (PostgreSQL). Client navigateur via `@supabase/ssr` (`src/lib/supabase/client.ts`). Toutes les tables sont en RLS ; accès anon en lecture/écriture selon policies.

## Tables et colonnes clés

### rooms
`id (uuid PK)`, `number (text)`, `type (text: standard|superior|suite)`, `floor (int)`, `status (text: available|occupied|dirty|maintenance)`, `price_per_night (numeric)`, `created_at`.

### guests
`id (uuid PK)`, `first_name`, `last_name`, `email`, `phone`, `nationality`, `notes`, `created_at`.

### reservations
`id (uuid PK)`, `guest_id (FK guests)`, `room_id (FK rooms)`, `check_in (date)`, `check_out (date)`, `status (text: confirmed|checked_in|checked_out|cancelled)`, `source (text: direct|booking|expedia|...)`, `adults (int)`, `children (int)`, `total_price (numeric)`, `notes`, `created_at`.

### tasks
`id`, `title`, `description`, `category (text)`, `priority (text: low|medium|high)`, `status (text: pending|in_progress|done)`, `assigned_to`, `due_date (date)`, `completed_at`, `created_at`.

### housekeeping
`id`, `room_id (FK rooms)`, `status (text: dirty|cleaning|clean)`, `assigned_to`, `notes`, `started_at`, `completed_at`, `created_at`.

### maintenance
`id`, `room_id (FK rooms)`, `title`, `description`, `priority`, `status (text: open|in_progress|resolved)`, `assigned_to`, `resolved_at`, `created_at`.

### emails
`id`, `from_address`, `to_address`, `subject`, `body`, `category (text)`, `status (text: unread|read|replied)`, `reservation_id (FK reservations, nullable)`, `created_at`.

### phone_calls
`id`, `caller_name`, `caller_phone`, `subject`, `notes`, `status (text: missed|answered)`, `duration_seconds`, `created_at`.

### reviews
`id`, `guest_id (FK guests, nullable)`, `reservation_id (FK reservations, nullable)`, `rating (int)`, `comment`, `source (text)`, `status (text: pending|responded)`, `response`, `created_at`.

## Requêtes types (pour Pixel)

- Dashboard stats : counts par table avec filtres `status`.
- Réservations récentes : `reservations.select('*, guests(first_name,last_name), rooms(number)')` order by `created_at desc` limit 5.
- Liste réservations : order by `check_in asc`.

## Pour Iris (automatisations)

- Statut service externe indisponible → afficher « Démonstration » ou « Non connecté ».
- Pas d'API payante : templates pré-générés uniquement.