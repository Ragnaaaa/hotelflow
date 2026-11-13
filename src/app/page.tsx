'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';
import { CalendarDays, LogOut, BedDouble, ListChecks, Mail, Phone } from 'lucide-react';

export default function TodayPage() {
  const [data, setData] = useState<any>({ arrivals: [], departures: [], rooms: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];
    Promise.all([
      supabase.from('reservations').select('*, guests(first_name,last_name), rooms(number,type)').eq('check_in', today),
      supabase.from('reservations').select('*, guests(first_name,last_name), rooms(number,type)').eq('check_out', today),
      supabase.from('rooms').select('*'),
      supabase.from('tasks').select('*').order('due_date', { ascending: true }),
    ]).then(([a, d, r, t]) => {
      setData({ arrivals: a.data || [], departures: d.data || [], rooms: r.data || [], tasks: t.data || [] });
      setLoading(false);
    });
  }, []);

  const dirtyRooms = data.rooms.filter((r: any) => r.status === 'dirty' || r.status === 'cleaning');
  const priorityTasks = data.tasks.filter((t: any) => t.priority === 'high' && t.status !== 'done');

  const kpis = [
    { label: 'Arrivées', value: data.arrivals.length, Icon: CalendarDays },
    { label: 'Départs', value: data.departures.length, Icon: LogOut },
    { label: 'Chambres non prêtes', value: dirtyRooms.length, Icon: BedDouble },
    { label: 'Tâches prioritaires', value: priorityTasks.length, Icon: ListChecks },
  ];

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8 animate-fade-in">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Aujourd'hui</h1>
          <p className="text-sm text-slate-500">{today}</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-sm"><k.Icon className="w-4 h-4" />{k.label}</div>
              <div className="text-2xl font-bold mt-1">{loading ? '…' : k.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold mb-3">Arrivées à traiter</h2>
            {loading ? <p className="text-slate-400">Chargement...</p> : data.arrivals.length === 0 ? <p className="text-slate-400">Aucune arrivée aujourd'hui</p> : (
              <ul className="space-y-2">{data.arrivals.map((r: any) => (
                <li key={r.id} className="flex justify-between text-sm border-b pb-2 last:border-0">
                  <span>{r.guests?.first_name} {r.guests?.last_name} — Ch. {r.rooms?.number}</span>
                  <span className="text-slate-400">{r.status}</span>
                </li>
              ))}</ul>
            )}
          </section>
          <section className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold mb-3">Départs à traiter</h2>
            {loading ? <p className="text-slate-400">Chargement...</p> : data.departures.length === 0 ? <p className="text-slate-400">Aucun départ aujourd'hui</p> : (
              <ul className="space-y-2">{data.departures.map((r: any) => (
                <li key={r.id} className="flex justify-between text-sm border-b pb-2 last:border-0">
                  <span>{r.guests?.first_name} {r.guests?.last_name} — Ch. {r.rooms?.number}</span>
                  <span className="text-slate-400">{r.status}</span>
                </li>
              ))}</ul>
            )}
          </section>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-4 mt-6">
          <h2 className="font-semibold mb-3">Chambres non prêtes</h2>
          {loading ? <p className="text-slate-400">Chargement...</p> : dirtyRooms.length === 0 ? <p className="text-slate-400">Toutes les chambres sont prêtes</p> : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">{dirtyRooms.map((r: any) => (
              <div key={r.id} className="border rounded-lg p-3 text-sm">
                <div className="font-medium">Ch. {r.number}</div>
                <div className="text-slate-500">{r.type} — {r.status}</div>
              </div>
            ))}</div>
          )}
        </section>
      </main>
    </div>
  );
}