'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, DoorOpen, CheckSquare, Sparkles, Wrench, Mail, Phone, Star, Plug,
} from 'lucide-react';

const spaces = [
  { label: 'Réception', items: [
    { href: '/', label: "Aujourd'hui", Icon: LayoutDashboard },    { href: '/reservations', label: 'Réservations', Icon: CalendarDays },
    { href: '/arrivals', label: 'Arrivées / Départs', Icon: DoorOpen },
  ]},
  { label: 'Opérations', items: [
    { href: '/tasks', label: 'Tâches', Icon: CheckSquare },
    { href: '/housekeeping', label: 'Ménage', Icon: Sparkles },
    { href: '/maintenance', label: 'Maintenance', Icon: Wrench },
  ]},
  { label: 'Communication', items: [
    { href: '/emails', label: 'Emails', Icon: Mail },
    { href: '/calls', label: 'Appels', Icon: Phone },
    { href: '/reviews', label: 'Avis', Icon: Star },
  ]},
  { label: 'Système', items: [
    { href: '/integrations', label: 'Intégrations', Icon: Plug },
  ]},
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-900 text-white w-64 min-h-screen p-4 hidden md:block">
      <div className="text-lg font-semibold tracking-tight mb-6 px-2 text-white">
        HôtelFlow
        <span className="block text-xs font-normal text-slate-400 mt-1">Gestion hôtelière</span>
      </div>
      <div className="space-y-4">
        {spaces.map(space => (
          <div key={space.label}>
            <div className="text-xs uppercase tracking-wider text-slate-500 px-2 mb-1">{space.label}</div>
            <ul className="space-y-1">
              {space.items.map(item => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                      <item.Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}