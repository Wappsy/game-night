import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Game Night',
  description: 'A multiplayer trivia game',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
