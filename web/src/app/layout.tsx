// Global imports
import { ReactNode } from 'react';
import type { Metadata } from 'next';

// Local imports
import ClientLayout from './client_layout';

export const metadata: Metadata = {
  title: 'AREA',
  description: 'Action REAction',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
