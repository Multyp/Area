'use client';

import Layout from '@/layout';
import { Typography, Box, useTheme, Container, Stack } from '@mui/material';
import Page from '@/components/Page';

export default function PrivacyPage() {
  const theme = useTheme();

  return (
    <Layout variant="landing">
      <Page title="Privacy Policy">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '50vh',
            backgroundColor: theme.palette.secondary.dark,
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
              PRIVACY POLICY
            </Typography>
            <Typography variant="h5" color="white">
              We value your privacy and are committed to protecting your personal information.
            </Typography>
          </Container>
        </Box>

        <Container
          maxWidth="md"
          sx={{
            mt: { xs: '5rem', md: '8rem' },
            mb: { xs: '5rem', md: '8rem' },
          }}
        >
          <Stack spacing={4}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Data Collection
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              Our site may request external OAuth permissions for various services. The data collected through these OAuth requests will be
              used strictly for providing the requested services and will be retained as long as your account exists.
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Use of Personal Data
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              We use your personal data to enhance user experience, improve our services, and communicate important information regarding
              your account and our site.
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Data Security
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              We implement appropriate technical and organizational measures to protect your personal data from unauthorized access, loss,
              or theft.
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              User Rights
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              You have the right to access, rectify, or delete your personal data. If you wish to exercise these rights, please contact us.
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Changes to This Privacy Policy
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              We may update this Privacy Policy from time to time. We encourage you to review this page periodically for the latest
              information on our privacy practices.
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Contact Us
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              If you have any questions or concerns regarding this Privacy Policy, please contact us at [your contact email].
            </Typography>
          </Stack>
        </Container>

        <Box sx={{ backgroundColor: '#191919', minHeight: '30vh', padding: '2rem' }}>
          <Container
            maxWidth="md"
            sx={{
              mt: { xs: '0rem', md: '5rem' },
            }}
          >
            <Stack spacing={4} sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <Typography
                variant="h3"
                color="white"
                sx={{
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                Thank you for trusting us with your information.
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Page>
    </Layout>
  );
}
