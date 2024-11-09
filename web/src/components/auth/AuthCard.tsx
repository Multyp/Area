'use client';

// material-ui
import { Theme } from '@mui/material/styles';
import { Box } from '@mui/material';

// project import
import MainCard, { MainCardProps } from '@/components/MainCard';

const AuthCard = ({ children, ...other }: MainCardProps) => (
  <MainCard
    sx={{
      maxWidth: { xs: 400, lg: 475 },
      margin: { xs: 2.5, md: 3 },
      borderRadius: '16px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      backdropFilter: 'blur(10px)',
      '& > *': {
        flexGrow: 1,
        flexBasis: '50%',
      },
    }}
    content={false}
    {...other}
  >
    <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
  </MainCard>
);

export default AuthCard;
