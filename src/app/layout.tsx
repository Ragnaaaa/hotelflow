import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HôtelFlow',
  description: 'Gestion hôtelière tout-en-un',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}