'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';

export default function EmailsPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('emails').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setEmails(data || []); setLoading(false); });
  }, []);

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">📧 Emails</h1>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : emails.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucun email</div>
          ) : emails.map((e) => (
            <div key={e.id} className={`bg-white rounded-xl shadow-sm p-4 ${e.status === 'unread' ? 'border-l-4 border-blue-500' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{e.subject}</span>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${catBadge(e.category)}`}>{catLabel(e.category)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(e.status)}`}>{statusLabel(e.status)}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-2">De : {e.from_address}</div>
              {e.body && <div className="text-sm text-gray-600">{e.body}</div>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function catBadge(c: string) {
  return { reservation: 'bg-green-100 text-green-700', reclamation: 'bg-red-100 text-red-700', info: 'bg-blue-100 text-blue-700' }[c] || 'bg-gray-100';
}
function catLabel(c: string) {
  return { reservation: 'Réservation', reclamation: 'Réclamation', info: 'Info' }[c] || c;
}
function statusBadge(s: string) {
  return { unread: 'bg-yellow-100 text-yellow-700', read: 'bg-gray-100 text-gray-700', replied: 'bg-green-100 text-green-700' }[s] || 'bg-gray-100';
}
function statusLabel(s: string) {
  return { unread: 'Non lu', read: 'Lu', replied: 'Répondu' }[s] || s;
}