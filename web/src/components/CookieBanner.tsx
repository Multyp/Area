import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setFadeOut(true);
    setTimeout(() => {
      localStorage.setItem('cookiesAccepted', 'true');
      setShowBanner(false);
    }, 500);
  };

  if (!showBanner && !fadeOut) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        backgroundColor: '#595959',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        maxWidth: '300px',
        transition: 'opacity 0.5s ease, visibility 0.5s ease',
        opacity: fadeOut ? 0 : 1,
        visibility: fadeOut ? 'hidden' : 'visible',
      }}
    >
      <Typography variant="body2" sx={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
        This website uses cookies to ensure you get the best experience on our website.
      </Typography>
      <Button
        variant="contained"
        onClick={handleAccept}
        sx={{
          backgroundColor: '#e74c3c',
          color: 'white',
          '&:hover': {
            backgroundColor: '#c0392b',
          },
          borderRadius: '20px',
          textTransform: 'none',
          padding: '0.5rem 1.5rem',
          fontSize: '0.8rem',
        }}
      >
        Dismiss
      </Button>
    </Box>
  );
};

export default CookieBanner;
