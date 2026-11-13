'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '📊 Tableau de bord', icon: '📊' },
  { href: '/reservations', label: '📅 Réservations', icon: '📅' },
  { href: '/arrivals', label: '🚪 Arrivées/Départs', icon: '🚪' },
  { href: '/tasks', label: '✅ Tâches', icon: '✅' },
  { href: '/housekeeping', label: '🧹 Ménage', icon: '🧹' },
  { href: '/maintenance', label: '🔧 Maintenance', icon: '🔧' },
  { href: '/emails', label: '📧 Emails', icon: '📧' },
  { href: '/calls', label: '📞 Appels', icon: '📞' },
  { href: '/reviews', label: '⭐ Avis', icon: '⭐' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-900 text-white w-64 min-h-screen p-4 hidden md:block">
      <div className="text-xl font-bold mb-6 px-2">🏨 HôtelFlow</div>
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-slate-700 text-white'
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