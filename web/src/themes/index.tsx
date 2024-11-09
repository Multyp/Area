'use client';

import { useMemo, ReactNode } from 'react';
import { createTheme, ThemeOptions, Theme, TypographyVariantsOptions } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeMode } from '@/types/config';
import CustomPalette from './palette';
import Typography from './typography';
import CustomShadows from './shadows';
import { CustomShadowProps } from '@/types/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

export default function ThemeCustom({ children }: { children: ReactNode }) {
  const mode = ThemeMode.LIGHT;
  const fontFamily = `'Poppins', sans-serif`;
  const presetColor = 'default';

  const theme: Theme = useMemo<Theme>(() => CustomPalette(mode, presetColor), [mode, presetColor]);

  const themeCustomShadows: CustomShadowProps = useMemo<CustomShadowProps>(() => CustomShadows(theme), [theme]);
  const themeTypography: TypographyVariantsOptions = useMemo<TypographyVariantsOptions>(
    () => Typography(mode, fontFamily, theme),
    [theme, mode, fontFamily]
  );

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: theme.palette,
      typography: themeTypography,
      components: {
        MuiButton: {
          styleOverrides: {
            containedPrimary: {
              background: 'linear-gradient(45deg, #000 30%, #000 90%)',
              color: '#fff',
            },
          },
        },
        MuiLink: {
          styleOverrides: {
            root: {
              fontFamily: fontFamily,
            },
          },
        },
        // You can add more component overrides here
      },
      customShadows: themeCustomShadows,
    }),
    [theme, themeTypography, fontFamily, themeCustomShadows]
  );

  const themes = useMemo(() => {
    return createTheme(themeOptions);
  }, [themeOptions]);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={themes}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}
