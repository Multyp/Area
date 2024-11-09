'use client';

// Global imports
import Grid from '@mui/material/Grid';
import { Typography, Box, useTheme, Button, Container, Stack } from '@mui/material';

// Scoped imports
import Layout from '@/layout';
import AnimateButton from '@/components/@extended/AnimateButton';
import CookieBanner from '@/components/CookieBanner';
import Page from '@/components/Page';
import getAPK from '@/utils/getapk';

export default function LandingPage() {
  const theme = useTheme();
  return (
    <Layout variant="landing">
      <Page title="landing page">
        <CookieBanner />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.palette.secondary.dark,
            backgroundImage: 'url(/assets/images/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Container
            maxWidth="md"
            sx={{
              textAlign: 'center',
              position: 'relative',
              top: '-5rem',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 1000,
              }}
              color="white"
            >
              AUTOMATISATION FOR EVERYONE
            </Typography>
            <Typography variant="h4" color="white">
              automate your daily tasks with ease
            </Typography>
            <AnimateButton>
              <Button
                variant="contained"
                href="/register"
                color="inherit"
                size="large"
                sx={{
                  borderRadius: '50px',
                  marginTop: '2rem',
                  height: '5rem',
                  width: '20rem',
                  backgroundColor: 'white',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  GET STARTED
                </Typography>
              </Button>
            </AnimateButton>
          </Container>
        </Box>
        <Container
          maxWidth="md"
          sx={{
            mt: { xs: '5rem', md: '15rem' },
            mb: { xs: '5rem', md: '15rem' },
          }}
        >
          <Grid container alignItems="center" justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="h1"
                color="black"
                sx={{
                  fontWeight: 1000,
                  textAlign: 'center',
                }}
              >
                WHY AREA ?
              </Typography>
            </Grid>
            <Grid item xs={14} md={14}>
              <Typography variant="body1" sx={{ textAlign: 'left' }}>
                AREA is designed to be user-friendly and accessible to everyone. It allows you to automate your daily tasks with ease. With
                AREA, you can create your own automation scripts without any programming knowledge. AREA is designed to be user-friendly and
                accessible to everyone. It allows you to automate your daily tasks with ease. With AREA, you can create your own automation
                scripts without any programming knowledge.
              </Typography>
            </Grid>
          </Grid>
        </Container>
        <Box sx={{ backgroundColor: '#191919', minHeight: '100vh', padding: '2rem' }}>
          <Container
            maxWidth="md"
            sx={{
              mt: { xs: '0rem', md: '18rem' },
            }}
          >
            <Stack spacing={4} sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <Typography
                variant="h1"
                color="white"
                sx={{
                  fontWeight: 1000,
                  textAlign: 'center',
                }}
              >
                NO CODE PLATFORM ON MOBILE
              </Typography>
              <Typography variant="body1" color="white" sx={{ textAlign: 'center' }}>
                Automate from anywhere with AREA mobile app. No code platform allows you to create automation scripts on the go.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="large"
                  sx={{
                    borderRadius: '50px',
                    marginTop: '2rem',
                    height: '5rem',
                    width: '20rem',
                    backgroundColor: 'white',
                    color: 'black',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                  }}
                  onClick={getAPK}
                >
                  <Typography variant="h3" sx={{ fontWeight: 600 }}>
                    GET THE APK
                  </Typography>
                </Button>
              </Box>
            </Stack>
          </Container>
        </Box>
      </Page>
    </Layout>
  );
}
