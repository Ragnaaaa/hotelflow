'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('reservations').select('*, guests(first_name, last_name, email, phone), rooms(number, type)').order('check_in', { ascending: true })
      .then(({ data }) => { setReservations(data || []); setLoading(false); });
  }, []);

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">📅 Réservations</h1>
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