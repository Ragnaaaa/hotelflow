'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Navigation from '@/components/Navigation';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    arrivalsToday: 0,
    departuresToday: 0,
    pendingTasks: 0,
    unreadEmails: 0,
    openMaintenance: 0,
    dirtyRooms: 0,
  });
  const [today, setToday] = useState('');
  const [recentReservations, setRecentReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setToday(new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const [rooms, occupied, arrivals, departures, tasks, emails, maintenance, dirty, reservations] =
        await Promise.all([
          supabase.from('rooms').select('id', { count: 'exact', head: true }),
          supabase.from('rooms').select('id', { count: 'exact', head: true }).eq('status', 'occupied'),
          supabase.from('reservations').select('id', { count: 'exact', head: true }).eq('check_in', new Date().toISOString().split('T')[0]).eq('status', 'confirmed'),
          supabase.from('reservations').select('id', { count: 'exact', head: true }).eq('check_out', new Date().toISOString().split('T')[0]).eq('status', 'checked_in'),
          supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('emails').select('id', { count: 'exact', head: true }).eq('status', 'unread'),
          supabase.from('maintenance').select('id', { count: 'exact', head: true }).eq('status', 'open'),
          supabase.from('housekeeping').select('id', { count: 'exact', head: true }).eq('status', 'dirty'),
          supabase.from('reservations').select('*, guests(first_name, last_name), rooms(number)').order('created_at', { ascending: false }).limit(5),
        ]);

      setStats({
        totalRooms: rooms.count || 0,
        occupiedRooms: occupied.count || 0,
        arrivalsToday: arrivals.count || 0,
        departuresToday: departures.count || 0,
        pendingTasks: tasks.count || 0,
        unreadEmails: emails.count || 0,
        openMaintenance: maintenance.count || 0,
        dirtyRooms: dirty.count || 0,
      });
      setRecentReservations(reservations.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const occupancy = stats.totalRooms > 0 ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) : 0;

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <span className="text-sm text-gray-500">{today}</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Occupation" value={`${occupancy}%`} sub={`${stats.occupiedRooms}/${stats.totalRooms} chambres`} color="blue" />
              <StatCard label="Arrivées aujourd'hui" value={stats.arrivalsToday} sub="Check-ins prévus" color="green" />
              <StatCard label="Départs aujourd'hui" value={stats.departuresToday} sub="Check-outs prévus" color="orange" />
              <StatCard label="Tâches en attente" value={stats.pendingTasks} sub="À traiter" color="purple" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard label="Emails non lus" value={stats.unreadEmails} sub="À répondre" color="red" />
              <StatCard label="Maintenance ouverte" value={stats.openMaintenance} sub="À résoudre" color="yellow" />
              <StatCard label="Chambres sales" value={stats.dirtyRooms} sub="À nettoyer" color="gray" />
              <StatCard label="Réservations récentes" value={recentReservations.length} sub="Dernières 5" color="indigo" />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Réservations récentes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-2">Client</th>
                      <th className="pb-2">Chambre</th>
                      <th className="pb-2">Arrivée</th>
                      <th className="pb-2">Départ</th>
                      <th className="pb-2">Statut</th>
                      <th className="pb-2">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReservations.map((r) => (
                      <tr key={r.id} className="border-b last:border-0">
                        <td className="py-2">{r.guests?.first_name} {r.guests?.last_name}</td>
                        <td className="py-2">{r.rooms?.number}</td>
                        <td className="py-2">{new Date(r.check_in).toLocaleDateString('fr-FR')}</td>
                        <td className="py-2">{new Date(r.check_out).toLocaleDateString('fr-FR')}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${statusColor(r.status)}`}>
                            {statusLabel(r.status)}
                          </span>
                        </td>
                        <td className="py-2 capitalize">{r.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    gray: 'bg-gray-50 text-gray-700',
    indigo: 'bg-indigo-50 text-indigo-700',
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color] || 'bg-gray-50'}`}>
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs opacity-60 mt-1">{sub}</div>
    </div>
  );
}

function statusColor(status: string) {
  const colors: Record<string, string> = {
    confirmed: 'bg-blue-100 text-blue-700',
    checked_in: 'bg-green-100 text-green-700',
    checked_out: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    confirmed: 'Confirmée',
    checked_in: 'En séjour',
    checked_out: 'Parti',
    cancelled: 'Annulée',
  };
  return labels[status] || status;
}