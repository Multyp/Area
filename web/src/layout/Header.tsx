import { cloneElement, useState } from 'react';
import NextLink from 'next/link';
import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import {
  useMediaQuery,
  Box,
  Button,
  Container,
  Drawer,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import { MenuOutlined, LineOutlined } from '@ant-design/icons';
import { APP_DEFAULT_PATH } from '@/config';
import AnimateButton from '@/components/@extended/AnimateButton';
import Logo from '@/components/Logo';
import { ThemeMode } from '@/types/config';

const Header = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerToggle, setDrawerToggle] = useState<boolean>(false);

  /** Method called on multiple components with different event types */
  const drawerToggler = (open: boolean) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerToggle(open);
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'black',
        color: 'white',
        boxShadow: 'none',
      }}
    >
      <Container disableGutters={matchDownMd}>
        <Toolbar sx={{ px: { xs: 1.5, md: 0, lg: 0 }, py: 2 }}>
          {/* Logo on the left */}
          <Box sx={{ flexGrow: 1 }}>
            <Logo to="/" />
          </Box>

          {/* Buttons on the right */}
          <Stack
            direction="row"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
            }}
            spacing={2}
          >
            {/* Explore and Login links */}
            <NextLink href={APP_DEFAULT_PATH} passHref legacyBehavior>
              <Link
                className="header-link"
                color="inherit"
                underline="none"
                sx={{
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                EXPLORE
              </Link>
            </NextLink>

            <NextLink href="/faq" passHref legacyBehavior>
              <Link
                className="header-link"
                color="inherit"
                underline="none"
                sx={{
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                FAQ
              </Link>
            </NextLink>

            <NextLink href="/login" passHref legacyBehavior>
              <Link
                className="header-link"
                color="inherit"
                underline="none"
                sx={{
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                LOGIN
              </Link>
            </NextLink>

            {/* Get Started button */}
            <AnimateButton>
              <Button
                component={Link}
                href="/register"
                disableElevation
                color="inherit"
                variant="contained"
                sx={{
                  backgroundColor: 'white',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                  borderRadius: '50px',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  GET STARTED
                </Typography>
              </Button>
            </AnimateButton>
          </Stack>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={drawerToggler(true)}
              sx={{
                '&:hover': {
                  bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.lighter' : 'secondary.dark',
                },
              }}
            >
              <MenuOutlined />
            </IconButton>
            <Drawer
              anchor="top"
              open={drawerToggle}
              onClose={drawerToggler(false)}
              sx={{ '& .MuiDrawer-paper': { backgroundImage: 'none', bgcolor: 'black', color: 'white' } }}
            >
              <Box
                sx={{
                  width: 'auto',
                  '& .MuiListItemIcon-root': {
                    fontSize: '1rem',
                    minWidth: 28,
                  },
                }}
                role="presentation"
                onClick={drawerToggler(false)}
                onKeyDown={drawerToggler(false)}
              >
                <List>
                  <Link style={{ textDecoration: 'none' }} href="/faq">
                    <ListItemButton component="span">
                      <ListItemIcon>
                        <LineOutlined />
                      </ListItemIcon>
                      <ListItemText primary="FAQ" primaryTypographyProps={{ variant: 'h6', color: 'white' }} />
                    </ListItemButton>
                  </Link>
                  <Link style={{ textDecoration: 'none' }} href="/explore">
                    <ListItemButton component="span">
                      <ListItemIcon>
                        <LineOutlined />
                      </ListItemIcon>
                      <ListItemText primary="Explore" primaryTypographyProps={{ variant: 'h6', color: 'white' }} />
                    </ListItemButton>
                  </Link>
                  <Link style={{ textDecoration: 'none' }} href="/login">
                    <ListItemButton component="span">
                      <ListItemIcon>
                        <LineOutlined />
                      </ListItemIcon>
                      <ListItemText primary="Login" primaryTypographyProps={{ variant: 'h6', color: 'white' }} />
                    </ListItemButton>
                  </Link>
                  <Link style={{ textDecoration: 'none' }} href="/register">
                    <ListItemButton component="span">
                      <ListItemIcon>
                        <LineOutlined />
                      </ListItemIcon>
                      <ListItemText primary="Get Started" primaryTypographyProps={{ variant: 'h6', color: 'white' }} />
                    </ListItemButton>
                  </Link>
                </List>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
