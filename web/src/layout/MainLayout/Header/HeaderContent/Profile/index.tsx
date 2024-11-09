'use client';

// Global imports
import { useState, useRef, ReactNode, SyntheticEvent } from 'react';
import {
  Box,
  Grow,
  ButtonBase,
  Paper,
  Popper,
  useTheme,
  ClickAwayListener,
  CardContent,
  Tab,
  Tabs,
  Avatar,
  Typography,
  Stack,
  useMediaQuery,
  Grid,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';

// Scoped imports
import MainCard from '@/components/MainCard';
import Transitions from '@/components/@extended/Transitions';
import useUser from '@/hooks/useUser';

// Local imports
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';
import { useRouter } from 'next/navigation';

interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

const Profile = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const anchorRef = useRef<any>(null);

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    if (anchorRef.current && anchorRef.current.contains(document.activeElement)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const router = useRouter();

  const user: any = useUser();

  const handleLogout = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
  };

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <ButtonBase onClick={handleToggle} ref={anchorRef}>
          {user ? (
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                p: 0.25,
                px: 0.75,
              }}
            >
              <Avatar alt="User" src={user?.avatar} sx={{ width: 32, height: 32 }} />
              <Typography variant="h5" sx={{ mt: 1 }}>
                {user?.name} {user?.surname}
              </Typography>
            </Stack>
          ) : (
            <Button variant="contained" color="primary" onClick={() => router.push('/login')}>
              <Typography variant="h5">Login</Typography>
            </Button>
          )}
        </ButtonBase>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-end"
          role={undefined}
          transition
          disablePortal
          popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 9] } }] }}
        >
          {({ TransitionProps }) => (
            <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: '100%',
                  minWidth: 285,
                  maxWidth: 420,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 285,
                  },
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          {user && (
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar alt="User" src={user?.avatar} />
                              <Stack>
                                <Typography variant="h6">
                                  {user?.name} {user?.surname}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {user?.email}
                                </Typography>
                              </Stack>
                            </Stack>
                          )}
                        </Grid>
                        <Grid item>
                          <Tooltip title="logout">
                            <IconButton onClick={handleLogout}>
                              <LogoutOutlined />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {open && (
                      <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize',
                              }}
                              icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Profile"
                              {...a11yProps(0)}
                            />
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize',
                              }}
                              icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Settings"
                              {...a11yProps(1)}
                            />
                          </Tabs>
                        </Box>
                        <TabPanel value={value} index={0} dir={theme.direction}>
                          <ProfileTab />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                          <SettingTab />
                        </TabPanel>
                      </>
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            </Transitions>
          )}
        </Popper>
      </Box>
    </>
  );
};

export default Profile;
