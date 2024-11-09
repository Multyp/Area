'use client';

// Global imports
import { ReactNode } from 'react';
import { Box, Grid } from '@mui/material';

// Scoped imports
import AuthBackground from './AuthBackground';
import AuthCard from './AuthCard';

interface Props {
  children: ReactNode;
}

const AuthWrapper = ({ children }: Props) => (
  <Grid
    container
    justifyContent="center"
    alignItems="center"
    sx={{
      minHeight: '100vh',
    }}
  >
    <Grid item xs={12}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: {
            xs: 'calc(100vh - 200px)',
            sm: 'calc(100vh - 150px)',
            md: 'calc(100vh - 120px)',
          },
        }}
      >
        <Grid item>
          <AuthCard>{children}</AuthCard>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

export default AuthWrapper;
