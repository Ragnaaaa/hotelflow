-- HôtelFlow V2 seed (à exécuter après création des comptes auth via Supabase dashboard)
-- Établissements démo
insert into public.establishments (id, name) values
  ('11111111-1111-1111-1111-111111111111','Hôtel Azur (démo)'),
  ('22222222-2222-2222-2222-222222222222','Hôtel Cèdre (démo)')
on conflict (id) do nothing;

-- Profils démo (remplacer <uuid> par l'id auth.users créé)
-- insert into public.profiles (id, establishment_id, role, full_name, email) values
--   ('<uuid-admin>', '11111111-1111-1111-1111-111111111111', 'admin', 'Admin Azur', 'admin@azur.demo'),
--   ('<uuid-reception>', '11111111-1111-1111-1111-111111111111', 'reception', 'Réception Azur', 'reception@azur.demo'),
--   ('<uuid-menage>', '11111111-1111-1111-1111-111111111111', 'housekeeping', 'Ménage Azur', 'menage@azur.demo');

-- Chambres pour le second établissement (exemple)
insert into public.rooms (number, type, floor, status, price_per_night, establishment_id) values
  ('201','standard',2,'available',90,'22222222-2222-2222-2222-222222222222'),
  ('202','superior',2,'available',120,'22222222-2222-2222-2222-222222222222')
on conflict do nothing;