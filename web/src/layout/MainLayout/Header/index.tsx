'use client';

// Global imports
import { ReactNode, useMemo } from 'react';
import { AppBar, Toolbar, useMediaQuery, AppBarProps, useTheme, IconButton } from '@mui/material';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

// Scoped imports
import useConfig from '@/hooks/useConfig';
import { dispatch, useSelector } from '@/store';
import { openDrawer } from '@/store/reducers/menu';
import { MenuOrientation, ThemeMode } from '@/types/config';

// Local imports
import HeaderContent from './HeaderContent';
import AppBarStyled from './AppBarStyled';

const Header = () => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { menuOrientation } = useConfig();

  const { drawerOpen } = useSelector((state) => state.menu);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const headerContent = useMemo(() => <HeaderContent />, []);

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100';

  const mainHeader: ReactNode = (
    <Toolbar>
      {!isHorizontal ? (
        <IconButton
          aria-label="open drawer"
          onClick={() => dispatch(openDrawer(!drawerOpen))}
          edge="start"
          color="secondary"
          sx={{ color: 'text.primary', bgcolor: drawerOpen ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
        >
          {!drawerOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </IconButton>
      ) : null}
      {headerContent}
    </Toolbar>
  );

  const appBar: AppBarProps = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
      width: isHorizontal ? '100%' : drawerOpen ? 'calc(100% - 260px)' : { xs: '100%', lg: 'calc(100% - 60px)' },
    },
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

export default Header;
