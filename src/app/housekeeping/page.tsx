'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';

export default function HousekeepingPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('housekeeping').select('*, rooms(number, type, floor)').order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">🧹 Ménage</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-500">Chargement...</div>
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">Aucune tâche de ménage</div>
          ) : items.map((h) => (
            <div key={h.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">Chambre {h.rooms?.number}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${hkBadge(h.status)}`}>{hkLabel(h.status)}</span>
              </div>
              <div className="text-sm text-gray-500 mb-2">{h.rooms?.type} · Étage {h.rooms?.floor}</div>
              {h.assigned_to && <div className="text-sm">Assigné à : {h.assigned_to}</div>}
              {h.notes && <div className="text-sm text-gray-600 mt-2">{h.notes}</div>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function hkBadge(s: string) {
  return { dirty: 'bg-red-100 text-red-700', in_progress: 'bg-yellow-100 text-yellow-700', clean: 'bg-green-100 text-green-700', inspected: 'bg-blue-100 text-blue-700' }[s] || 'bg-gray-100';
}
function hkLabel(s: string) {
  return { dirty: 'Sale', in_progress: 'En cours', clean: 'Propre', inspected: 'Inspecté' }[s] || s;
}