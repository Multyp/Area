'use client';

import AnimateButton from '@/components/@extended/AnimateButton';
import Layout from '@/layout';
import { Typography, Box, useTheme, Button, Container, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import Page from '@/components/Page';
import { useState } from 'react';

export default function ContactUsPage() {
  const theme = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // State for error handling
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const newErrors = {
      name: name.trim() === '',
      email: email.trim() === '',
      subject: subject.trim() === '',
      message: message.trim() === '',
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (!hasErrors) {
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <Layout variant="landing">
      <Page title="Contact Us">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100vh',
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
              GET IN TOUCH WITH US
            </Typography>
            <Typography variant="h4" color="white">
              We’d love to hear from you. Contact us for any questions or inquiries.
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
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" color="black" sx={{ fontWeight: 700 }}>
                Contact Information
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Email: support@area.com
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Phone: +1 234 567 890
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Address: 43 rue de Vercel, Paris, France
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h5" color="black" sx={{ fontWeight: 700 }}>
                Send Us a Message
              </Typography>
              <form onSubmit={handleSubmit}>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                    helperText={errors.name && 'Please enter your name'}
                  />
                  <TextField
                    fullWidth
                    label="Your Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    helperText={errors.email && 'Please enter your email'}
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    variant="outlined"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    error={errors.subject}
                    helperText={errors.subject && 'Please enter a subject'}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    error={errors.message}
                    helperText={errors.message && 'Please enter your message'}
                  />
                  <AnimateButton>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        borderRadius: '50px',
                        height: '3rem',
                        width: '15rem',
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      Send Message
                    </Button>
                  </AnimateButton>
                </Stack>
              </form>
            </Grid>
          </Grid>
        </Container>

        <Box sx={{ backgroundColor: '#191919', minHeight: '50vh', padding: '2rem' }}>
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
                We’re here to help
              </Typography>
              <Typography variant="body1" color="white" sx={{ textAlign: 'center' }}>
                Feel free to contact us via email or phone if you have any questions or issues.
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Page>
    </Layout>
  );
}
