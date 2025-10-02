import type { Metadata } from 'next';
import Navigation from '../components/Navigation';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Idle Game',
  description: 'Idle Game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <div className="flex h-[calc(100vh-4rem)]">
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
