'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';

export default function MaintenancePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('maintenance').select('*, rooms(number, type)').order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">🔧 Maintenance</h1>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucun signalement</div>
          ) : items.map((m) => (
            <div key={m.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">{m.title}</span>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${priorityBadge(m.priority)}`}>{priorityLabel(m.priority)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(m.status)}`}>{statusLabel(m.status)}</span>
                </div>
              </div>
              {m.rooms && <div className="text-sm text-gray-500 mb-1">Chambre {m.rooms.number} ({m.rooms.type})</div>}
              {m.description && <div className="text-sm text-gray-600">{m.description}</div>}
              {m.assigned_to && <div className="text-xs text-gray-400 mt-2">Assigné à : {m.assigned_to}</div>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function priorityBadge(p: string) {
  return { urgent: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-blue-100 text-blue-700', low: 'bg-green-100 text-green-700' }[p] || 'bg-gray-100';
}
function priorityLabel(p: string) {
  return { urgent: 'Urgent', high: 'Haute', medium: 'Moyenne', low: 'Basse' }[p] || p;
}
function statusBadge(s: string) {
  return { open: 'bg-red-100 text-red-700', in_progress: 'bg-yellow-100 text-yellow-700', resolved: 'bg-green-100 text-green-700' }[s] || 'bg-gray-100';
}
function statusLabel(s: string) {
  return { open: 'Ouvert', in_progress: 'En cours', resolved: 'Résolu' }[s] || s;
}