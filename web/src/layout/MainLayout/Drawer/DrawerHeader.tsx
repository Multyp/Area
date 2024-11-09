'use client';

// Global imports
import { useMediaQuery, Box, useTheme } from '@mui/material';

// Scoped imports
import Logo from '@/components/Logo';
import useConfig from '@/hooks/useConfig';
import { MenuOrientation } from '@/types/config';

interface DrawerHeaderProps {
  open: boolean;
}

const DrawerHeader = ({ open }: DrawerHeaderProps) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  return (
    <Box
      sx={{
        minHeight: isHorizontal ? 'unset' : '60px',
        width: isHorizontal ? { xs: '100%', lg: '424px' } : 'inherit',
        paddingTop: isHorizontal ? { xs: '10px', lg: '0' } : '8px',
        paddingBottom: isHorizontal ? { xs: '18px', lg: '0' } : '8px',
        paddingLeft: isHorizontal ? { xs: '24px', lg: '0' } : open ? '24px' : 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center',
      }}
    >
      <Logo isIcon={!open} isWhite={open} sx={{ width: open ? 'auto' : 35, height: 35 }} />
    </Box>
  );
};

export default DrawerHeader;
