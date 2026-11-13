'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';

export default function CallsPage() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('phone_calls').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setCalls(data || []); setLoading(false); });
  }, []);

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Suivi téléphonique</h1>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : calls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucun appel</div>
          ) : calls.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{c.caller_name || 'Inconnu'}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(c.status)}`}>{statusLabel(c.status)}</span>
              </div>
              <div className="text-sm text-gray-500">{c.caller_phone}</div>
              {c.subject && <div className="text-sm text-gray-600 mt-1">{c.subject}</div>}
              {c.notes && <div className="text-sm text-gray-500 mt-1">{c.notes}</div>}
              <div className="text-xs text-gray-400 mt-2">
                {new Date(c.created_at).toLocaleString('fr-FR')} · {Math.floor(c.duration_seconds / 60)}min {c.duration_seconds % 60}s
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function statusBadge(s: string) {
  return { missed: 'bg-red-100 text-red-700', answered: 'bg-green-100 text-green-700', voicemail: 'bg-yellow-100 text-yellow-700' }[s] || 'bg-gray-100';
}
function statusLabel(s: string) {
  return { missed: 'Manqué', answered: 'Répondu', voicemail: 'Messagerie' }[s] || s;
}