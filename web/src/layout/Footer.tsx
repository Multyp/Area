import { Link, Stack, Typography } from '@mui/material';

const Footer = ({ isLanding }: { isLanding: boolean }) => {
  const currentYear = new Date().getFullYear();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ p: '32px 16px 0px', mt: 'auto', bgcolor: isLanding ? 'black' : '', color: isLanding ? 'white' : '' }}
    >
      <Typography variant="caption">&copy; {currentYear} Les Rooters. All rights reserved.</Typography>
      <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
        <Link href="/legal/privacy" variant="caption" color={!isLanding ? 'textPrimary' : 'rgb(255, 255, 255)'}>
          Privacy Policy
        </Link>
        <Link href="/legal/terms_of_service" variant="caption" color={!isLanding ? 'textPrimary' : 'rgb(255, 255, 255)'}>
          Terms of Service
        </Link>
        <Link href="/about/contact" variant="caption" color={!isLanding ? 'textPrimary' : 'rgb(255, 255, 255)'}>
          Contact Us
        </Link>
      </Stack>
    </Stack>
  );
};

export default Footer;
