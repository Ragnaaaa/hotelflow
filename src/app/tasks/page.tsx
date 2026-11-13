'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('tasks').select('*').order('priority', { ascending: true }).order('due_date', { ascending: true })
      .then(({ data }) => { setTasks(data || []); setLoading(false); });
  }, []);

  const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...tasks].sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Tâches du jour</h1>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucune tâche</div>
          ) : sorted.map((t) => (
            <div key={t.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${priorityDot(t.priority)}`} />
              <div className="flex-1">
                <div className="font-medium">{t.title}</div>
                {t.description && <div className="text-sm text-gray-500">{t.description}</div>}
                <div className="text-xs text-gray-400 mt-1">
                  {t.category} · {t.assigned_to || 'Non assigné'} · {t.due_date ? new Date(t.due_date).toLocaleDateString('fr-FR') : ''}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${priorityBadge(t.priority)}`}>{priorityLabel(t.priority)}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${statusBadge(t.status)}`}>{statusLabel(t.status)}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function priorityDot(p: string) {
  return { urgent: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-blue-500', low: 'bg-green-500' }[p] || 'bg-gray-400';
}
function priorityBadge(p: string) {
  return { urgent: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-blue-100 text-blue-700', low: 'bg-green-100 text-green-700' }[p] || 'bg-gray-100';
}
function priorityLabel(p: string) {
  return { urgent: 'Urgent', high: 'Haute', medium: 'Moyenne', low: 'Basse' }[p] || p;
}
function statusBadge(s: string) {
  return { pending: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' }[s] || 'bg-gray-100';
}
function statusLabel(s: string) {
  return { pending: 'En attente', in_progress: 'En cours', completed: 'Terminé' }[s] || s;
}