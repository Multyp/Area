// Global import
import { useMediaQuery, useTheme } from '@mui/material';

// Scoped imports
import { useSelector } from '@/store';
import SimpleBar from '@/components/SimpleBar';

// Local import
import Navigation from './Navigation';

const DrawerContent = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  return (
    <SimpleBar
      sx={{
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Navigation />
      {drawerOpen && !matchDownMD}
    </SimpleBar>
  );
};

export default DrawerContent;
