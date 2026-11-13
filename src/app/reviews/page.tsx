'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('reviews').select('*, guests(first_name, last_name)').order('created_at', { ascending: false })
      .then(({ data }) => { setReviews(data || []); setLoading(false); });
  }, []);

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">⭐ Avis clients</h1>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucun avis</div>
          ) : reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{r.guests?.first_name} {r.guests?.last_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(r.status)}`}>{statusLabel(r.status)}</span>
                </div>
              </div>
              {r.comment && <div className="text-sm text-gray-600 mb-2">{r.comment}</div>}
              <div className="text-xs text-gray-400">
                Source : {r.source} · {new Date(r.created_at).toLocaleDateString('fr-FR')}
              </div>
              {r.response && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                  <strong>Réponse :</strong> {r.response}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function statusBadge(s: string) {
  return { pending: 'bg-yellow-100 text-yellow-700', published: 'bg-green-100 text-green-700', hidden: 'bg-gray-100 text-gray-700' }[s] || 'bg-gray-100';
}
function statusLabel(s: string) {
  return { pending: 'En attente', published: 'Publié', hidden: 'Masqué' }[s] || s;
}