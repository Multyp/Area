import { DefaultConfigProps, MenuOrientation, ThemeDirection, ThemeMode } from '@/types/config';

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';

export const APP_DEFAULT_PATH = '/explore';
export const HORIZONTAL_MAX_ITEM = 6;
export const DRAWER_WIDTH = 260;

const config: DefaultConfigProps = {
  fontFamily: `'Poppins', sans-serif`,
  i18n: 'en',
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  container: true,
  mode: ThemeMode.LIGHT,
  presetColor: 'default',
  themeDirection: ThemeDirection.LTR,
};

export default config;
