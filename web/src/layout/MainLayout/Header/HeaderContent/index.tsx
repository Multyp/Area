'use client';

// Global imports
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// Local imports
import Profile from './Profile';
import MobileSection from './MobileSection';
import Settings from './Settings';

const HeaderContent = () => {
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  return (
    <>
      <Box sx={{ height: 40, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
        <Settings />
        {!downLG && <Profile />}
        {downLG && <MobileSection />}
      </Box>
    </>
  );
};

export default HeaderContent;
