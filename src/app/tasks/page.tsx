'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';

const COLS = [
  { key: 'pending', label: 'À faire' },
  { key: 'in_progress', label: 'En cours' },
  { key: 'done', label: 'Terminé' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('tasks').select('*').order('due_date', { ascending: true })
      .then(({ data }) => { setTasks(data || []); setLoading(false); });
  }, []);

  async function move(id: string, status: string) {
    const supabase = createClient();
    await supabase.from('tasks').update({ status }).eq('id', id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Tâches</h1>
        {loading ? <p className="text-slate-400">Chargement...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLS.map(col => (
              <div key={col.key} className="bg-slate-100 rounded-xl p-3 min-h-[300px]">
                <h2 className="font-semibold mb-3">{col.label} ({tasks.filter(t => t.status === col.key).length})</h2>
                <div className="space-y-2">
                  {tasks.filter(t => t.status === col.key).map(t => (
                    <div key={t.id} className="bg-white rounded-lg shadow-sm p-3 text-sm">
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{t.priority} · {t.due_date}</div>
                      <div className="flex gap-1 mt-2">
                        {COLS.filter(c => c.key !== col.key).map(c => (
                          <button key={c.key} onClick={() => move(t.id, c.key)} className="text-xs px-2 py-1 rounded bg-slate-200 hover:bg-indigo-100">
                            → {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}