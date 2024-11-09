'use client';

// Global imports
import { Suspense } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles'; // Optionally use the theme here

// Scoped imports
import Layout from '@/layout';
import { ExploreProvider } from '@/contexts/app/ExploreContext';
import ExploreSearch from '@/components/app/explore/search';
import ExploreTabs from '@/components/app/explore/tabs';
import ExploreForm from '@/components/app/explore/Form';

export default function ExplorePage() {
  const theme = useTheme(); // Optionally use theme for page-wide theming

  return (
    <Layout>
      <Suspense fallback={<Skeleton variant="rectangular" width="100%" height="100%" sx={{ bgcolor: theme.palette.background.default }} />}>
        <ExploreProvider>
          <ExploreSearch />
          <ExploreTabs />
          <ExploreForm />
        </ExploreProvider>
      </Suspense>
    </Layout>
  );
}
