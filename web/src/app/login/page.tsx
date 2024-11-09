'use client';

// Global imports
import Grid from '@mui/material/Grid2';
import { Typography, Stack, Link } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Scoped imports
import Layout from '@/layout';
import AuthWrapper from '@/components/auth/AuthWrapper';
import AuthLogin from '@/components/auth/AuthLogin';
import AuthWithProvider from '@/components/auth/AuthWithProvider';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data.oauth_redirect_url) {
        router.push(event.data.oauth_redirect_url);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  return (
    <Layout variant="auth">
      <AuthWrapper>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">Login</Typography>
              <NextLink href="/register" passHref legacyBehavior>
                <Link variant="body1" color="primary">
                  Don&apos;t have an account?
                </Link>
              </NextLink>
            </Stack>
          </Grid>
          <Grid size={12}>
            <AuthLogin />
          </Grid>
          <Grid size={12}>
            <AuthWithProvider />
          </Grid>
        </Grid>
      </AuthWrapper>
    </Layout>
  );
}
