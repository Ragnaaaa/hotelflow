'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';

export default function ArrivalsPage() {
  const [arrivals, setArrivals] = useState<any[]>([]);
  const [departures, setDepartures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];
    Promise.all([
      supabase.from('reservations').select('*, guests(first_name, last_name, phone), rooms(number, type)').eq('check_in', today),
      supabase.from('reservations').select('*, guests(first_name, last_name, phone), rooms(number, type)').eq('check_out', today),
    ]).then(([a, d]) => {
      setArrivals(a.data || []);
      setDepartures(d.data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">🚪 Arrivées & Départs</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-green-700">Arrivées aujourd'hui ({arrivals.length})</h2>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Chargement...</div>
              ) : arrivals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucune arrivée</div>
              ) : arrivals.map((r) => (
                <div key={r.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
                  <div className="font-medium">{r.guests?.first_name} {r.guests?.last_name}</div>
                  <div className="text-sm text-gray-500">Chambre {r.rooms?.number} ({r.rooms?.type})</div>
                  <div className="text-sm text-gray-500">{r.guests?.phone}</div>
                  <div className="text-xs text-gray-400 mt-1">{r.adults} adulte(s) · {r.source}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3 text-orange-700">Départs aujourd'hui ({departures.length})</h2>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Chargement...</div>
              ) : departures.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucun départ</div>
              ) : departures.map((r) => (
                <div key={r.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
                  <div className="font-medium">{r.guests?.first_name} {r.guests?.last_name}</div>
                  <div className="text-sm text-gray-500">Chambre {r.rooms?.number} ({r.rooms?.type})</div>
                  <div className="text-sm text-gray-500">{r.guests?.phone}</div>
                  <div className="text-xs text-gray-400 mt-1">{r.adults} adulte(s) · {r.source}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}