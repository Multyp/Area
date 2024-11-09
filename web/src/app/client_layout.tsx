'use client';

// Global imports
import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Scoped imports
import { store } from '@/store';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConfigProvider } from '@/contexts/ConfigContext';
import ThemeCustom from '@/themes';
import SnackbarExtended from '@/components/@extended/SnackBar';
import Notistack from '@/components/Notistack';
import ScrollTop from '@/components/ScrollTop';

export default function ClientLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <ConfigProvider>
          <ThemeCustom>
            <ScrollTop>
              <Notistack>
                <SnackbarExtended />
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
              </Notistack>
            </ScrollTop>
          </ThemeCustom>
        </ConfigProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
