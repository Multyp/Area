'use client';

// Global imports
import { ReactNode, useContext } from 'react';
import { Box, Toolbar, Container, useTheme } from '@mui/material';

// Local imports
import Header from './Header';
import Drawer from './Drawer';
import Footer from '../Footer';
import { ConfigContext } from '@/contexts/ConfigContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const theme = useTheme();
  const { mode } = useContext(ConfigContext);

  const isDarkMode = mode === 'dark' || theme.palette.mode === 'dark';

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header />
      <Drawer />
      <Box
        component="main"
        sx={{
          width: 'calc(100% - 260px)',
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: isDarkMode ? '#000000' : theme.palette.background.default,
        }}
      >
        <Toolbar sx={{ mt: 2 }} />
        <Container
          maxWidth={'xl'}
          sx={{
            position: 'relative',
            minHeight: 'calc(100vh - 110px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
          <Footer isLanding={false} />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
