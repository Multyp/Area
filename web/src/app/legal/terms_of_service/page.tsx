'use client';

import Layout from '@/layout';
import { Typography, Box, useTheme, Container, Stack } from '@mui/material';
import Page from '@/components/Page';

export default function TermsOfServicePage() {
  const theme = useTheme();

  return (
    <Layout variant="landing">
      <Page title="Terms of Services">
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
              TERMS OF SERVICE
            </Typography>
            <Typography variant="h5" color="white">
              Please read these terms and conditions carefully before using our services.
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
              1. Agreement to Terms
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              By accessing or using our services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not
              agree with any part of these terms, you may not access our services.
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              2. Changes to Terms
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              We reserve the right to modify these terms at any time. You are responsible for reviewing these terms periodically. Continued
              use of the service after any modifications constitutes acceptance of the updated terms.
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              3. Use of Service
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              Our services are intended for lawful use only. You agree not to use the service for any illegal or unauthorized purposes,
              including but not limited to violating intellectual property rights or distributing harmful software.
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              4. Account Registration
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              You may be required to register for an account to access certain features of our services. You agree to provide accurate and
              up-to-date information and to keep your account information secure. You are responsible for all activities that occur under
              your account.
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              5. Termination
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              We reserve the right to suspend or terminate your access to our services at any time, with or without notice, for conduct that
              violates these terms or is harmful to our business.
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              6. Limitation of Liability
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              To the maximum extent permitted by law, we are not liable for any damages arising from your use of our services, including
              indirect, incidental, or consequential damages.
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              7. Governing Law
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              These terms are governed by the laws of [Your Country/Region]. Any disputes arising from these terms will be resolved in the
              courts of [Your Jurisdiction].
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              8. Contact Us
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'left' }}>
              If you have any questions about these Terms of Service, please contact us at support@area.com.
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
                Thank you for using our services
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Page>
    </Layout>
  );
}
