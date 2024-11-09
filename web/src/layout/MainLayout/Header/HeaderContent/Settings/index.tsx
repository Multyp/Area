// Global imports
import { useState, useContext } from 'react';
import { IconButton, Box, useTheme, Drawer, Stack, Typography, Paper, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { CloseCircleOutlined, SettingOutlined } from '@ant-design/icons';

// Scoped imports
import { ThemeMode } from '@/types/config';

// Local imports
import { ConfigContext } from '@/contexts/ConfigContext'; // Import the ConfigContext

const Settings = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { mode, onChangeMode } = useContext(ConfigContext); // Access the config context
  const [selectedTheme, setSelectedTheme] = useState(mode || 'light'); // Default to light theme if not set

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'grey.100';

  const handleThemeChange = (newTheme: ThemeMode) => {
    setSelectedTheme(newTheme);
    onChangeMode(newTheme);
  };

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
          aria-label="open settings menu"
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="secondary"
        >
          <SettingOutlined />
        </IconButton>
      </Box>
      <Drawer open={open} anchor="right" sx={{ width: 370 }} onClose={handleToggle}>
        <Paper sx={{ width: 370 }} elevation={0} variant="elevation">
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              backgroundColor: theme.palette.primary.main,
              color: 'white',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
              <Typography variant="h6">Settings</Typography>
              <IconButton onClick={handleToggle} sx={{ color: 'white' }}>
                <CloseCircleOutlined />
              </IconButton>
            </Stack>
          </Box>
          <Stack direction="column" spacing={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" color="textPrimary">
              Theme Mode
            </Typography>
            <Stack direction="row" spacing={2}>
              <Card
                sx={{
                  maxWidth: 150,
                  border: selectedTheme === 'light' ? '2px solid' : 'none',
                  borderColor: theme.palette.primary.main,
                }}
                onClick={() => handleThemeChange(ThemeMode.LIGHT)}
              >
                <CardActionArea>
                  <CardMedia component="img" height="150" image="/assets/images/settings/default.svg" alt="Light Theme" />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      Light
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>

              <Card
                sx={{
                  maxWidth: 150,
                  border: selectedTheme === 'dark' ? '2px solid' : 'none',
                  borderColor: theme.palette.primary.main,
                }}
                onClick={() => handleThemeChange(ThemeMode.DARK)}
              >
                <CardActionArea>
                  <CardMedia component="img" height="150" image="/assets/images/settings/dark.svg" alt="Dark Theme" />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      Dark
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Stack>
          </Stack>
        </Paper>
      </Drawer>
    </>
  );
};

export default Settings;
