'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Tableau de bord' },
  { href: '/reservations', label: 'Réservations' },
  { href: '/arrivals', label: 'Arrivées / Départs' },
  { href: '/tasks', label: 'Tâches' },
  { href: '/housekeeping', label: 'Ménage' },
  { href: '/maintenance', label: 'Maintenance' },
  { href: '/emails', label: 'Emails' },
  { href: '/calls', label: 'Appels' },
  { href: '/reviews', label: 'Avis' },
  { href: '/integrations', label: 'Intégrations' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-900 text-white w-64 min-h-screen p-4 hidden md:block">
      <div className="text-lg font-semibold tracking-tight mb-6 px-2 text-white">
        HôtelFlow
        <span className="block text-xs font-normal text-slate-400 mt-1">Gestion hôtelière</span>
      </div>
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}