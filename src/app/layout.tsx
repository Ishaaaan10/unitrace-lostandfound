import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ItemsProvider } from '../context/ItemsContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: 'UniTrace | Central University Campus Lost & Found System',
  description:
    'Smart campus lost and found tracking and recovery network with cryptographic claim verification, AI matching, and security custody management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <AuthProvider>
          <ItemsProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ItemsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
