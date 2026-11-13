'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';

type Room = { id: string; number: string; type: string; price_per_night: number };
type Reservation = {
  id: string;
  check_in: string;
  check_out: string;
  status: string;
  source: string;
  adults: number;
  children: number | null;
  total_price: number;
  guests?: { first_name: string; last_name: string; email: string; phone: string } | null;
  rooms?: { number: string; type: string } | null;
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    room_id: '',
    check_in: '',
    check_out: '',
    adults: 1,
    children: 0,
    source: 'direct',
  });

  async function load() {
    const supabase = createClient();
    const [{ data: res }, { data: rm }] = await Promise.all([
      supabase.from('reservations').select('*, guests(first_name, last_name, email, phone), rooms(number, type)').order('check_in', { ascending: true }),
      supabase.from('rooms').select('id, number, type, price_per_night').order('number', { ascending: true }),
    ]);
    setReservations((res as Reservation[]) || []);
    setRooms((rm as Room[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { data: guest, error: gErr } = await supabase.from('guests').insert({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
    }).select().single();
    if (gErr || !guest) { setError(gErr?.message || 'Erreur client'); setSaving(false); return; }
    const room = rooms.find(r => r.id === form.room_id);
    const nights = Math.max(1, (new Date(form.check_out).getTime() - new Date(form.check_in).getTime()) / 86400000);
    const total = room ? room.price_per_night * nights : 0;
    const { error: rErr } = await supabase.from('reservations').insert({
      guest_id: guest.id,
      room_id: form.room_id,
      check_in: form.check_in,
      check_out: form.check_out,
      status: 'confirmed',
      source: form.source,
      adults: form.adults,
      children: form.children,
      total_price: total,
    });
    if (rErr) { setError(rErr.message); setSaving(false); return; }
    setShowForm(false);
    setForm({ first_name: '', last_name: '', email: '', phone: '', room_id: '', check_in: '', check_out: '', adults: 1, children: 0, source: 'direct' });
    await load();
    setSaving(false);
  }

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">📅 Réservations</h1>
          <button onClick={() => setShowForm(v => !v)} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
            {showForm ? 'Annuler' : '+ Nouvelle réservation'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={submit} className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Prénom" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input required placeholder="Nom" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Téléphone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="border rounded-lg px-3 py-2" />
            <select required value={form.room_id} onChange={e => setForm({ ...form, room_id: e.target.value })} className="border rounded-lg px-3 py-2">
              <option value="">Chambre</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.number} ({r.type}) — {r.price_per_night}€/nuit</option>)}
            </select>
            <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="border rounded-lg px-3 py-2">
              <option value="direct">Direct</option>
              <option value="booking">Booking.com</option>
              <option value="airbnb">Airbnb</option>
            </select>
            <input required type="date" value={form.check_in} onChange={e => setForm({ ...form, check_in: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input required type="date" value={form.check_out} onChange={e => setForm({ ...form, check_out: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" min={1} value={form.adults} onChange={e => setForm({ ...form, adults: +e.target.value })} className="border rounded-lg px-3 py-2" placeholder="Adultes" />
            <input type="number" min={0} value={form.children} onChange={e => setForm({ ...form, children: +e.target.value })} className="border rounded-lg px-3 py-2" placeholder="Enfants" />
            {error && <div className="md:col-span-2 text-red-600 text-sm">{error}</div>}
            <button type="submit" disabled={saving} className="md:col-span-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50">
              {saving ? 'Enregistrement...' : 'Enregistrer la réservation'}
            </button>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Chambre</th>
                  <th className="px-4 py-3">Arrivée</th>
                  <th className="px-4 py-3">Départ</th>
                  <th className="px-4 py-3">Pers.</th>
                  <th className="px-4 py-3">Prix</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Source</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-500">Chargement...</td></tr>
                ) : reservations.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-500">Aucune réservation</td></tr>
                ) : reservations.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">{r.guests?.first_name} {r.guests?.last_name}</td>
                    <td className="px-4 py-3">{r.rooms?.number} ({r.rooms?.type})</td>
                    <td className="px-4 py-3">{new Date(r.check_in).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3">{new Date(r.check_out).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3">{r.adults + (r.children || 0)}</td>
                    <td className="px-4 py-3">{r.total_price}€</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${statusColor(r.status)}`}>{statusLabel(r.status)}</span>
                    </td>
                    <td className="px-4 py-3 capitalize">{r.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function statusColor(s: string) {
  return { confirmed: 'bg-blue-100 text-blue-700', checked_in: 'bg-green-100 text-green-700', checked_out: 'bg-gray-100 text-gray-700', cancelled: 'bg-red-100 text-red-700' }[s] || 'bg-gray-100';
}
function statusLabel(s: string) {
  return { confirmed: 'Confirmée', checked_in: 'En séjour', checked_out: 'Parti', cancelled: 'Annulée' }[s] || s;
}