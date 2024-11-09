'use client';

// Global imports
import { ReactNode, Suspense } from 'react';

// Scoped imports
import Loader from '@/components/Loader';

// Local imports
import Header from './Header';
import Footer from './Footer';
import MainLayout from './MainLayout';

interface LayoutProps {
  children: ReactNode;
  variant?: 'main' | 'blank' | 'landing' | 'auth';
}

export default function Layout({ children, variant = 'main' }: LayoutProps) {
  if (variant === 'landing') {
    return (
      <Suspense fallback={<Loader />}>
        <Header />
        {children}
        <Footer isLanding={true} />
      </Suspense>
    );
  }

  if (variant === 'auth') {
    return (
      <div
        style={{
          backgroundImage: 'url(/assets/images/background.jpg)',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
