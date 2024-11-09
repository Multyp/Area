// material-ui
import { Theme, TypographyVariantsOptions } from '@mui/material/styles';

// types
import { FontFamily, ThemeMode } from '@/types/config';

const Typography = (mode: ThemeMode, fontFamily: FontFamily, theme: Theme): TypographyVariantsOptions => ({
  htmlFontSize: 16,
  fontFamily,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  h1: {
    fontFamily: fontFamily,
    fontWeight: 600,
    fontSize: '2.968rem', // Augmenté de 25%
    lineHeight: 1.21,
  },
  h2: {
    fontFamily: fontFamily,
    fontWeight: 550,
    fontSize: '2.344rem', // Augmenté de 25%
    lineHeight: 1.27,
    color: '#334760',
  },
  h3: {
    fontFamily: fontFamily,
    fontWeight: 500,
    fontSize: '1.875rem', // Augmenté de 25%
    lineHeight: 1.33,
  },
  h4: {
    fontFamily: fontFamily,
    fontWeight: 450,
    fontSize: '1.563rem', // Augmenté de 25%
    lineHeight: 1.4,
    color: '#253B56',
  },
  h5: {
    fontWeight: 400,
    fontSize: '1.25rem', // Augmenté de 25%
    lineHeight: 1.5,
  },
  h6: {
    fontFamily: fontFamily,
    fontWeight: 350,
    fontSize: '1.094rem', // Augmenté de 25%
    lineHeight: 1.57,
  },
  caption: {
    fontFamily: fontFamily,
    fontWeight: 400,
    fontSize: '0.938rem', // Augmenté de 25%
    lineHeight: 1.66,
  },
  body1: {
    fontFamily: fontFamily,
    fontSize: '1.094rem', // Augmenté de 25%
    lineHeight: 1.57,
  },
  body2: {
    fontFamily: fontFamily,
    fontSize: '0.938rem', // Augmenté de 25%
    lineHeight: 1.66,
  },
  subtitle1: {
    fontFamily: fontFamily,
    fontSize: '1.094rem', // Augmenté de 25%
    fontWeight: 600,
    lineHeight: 1.57,
    color: '#758AA8',
  },
  subtitle2: {
    fontFamily: fontFamily,
    fontSize: '0.938rem', // Augmenté de 25%
    fontWeight: 500,
    lineHeight: 1.66,
  },
  overline: {
    lineHeight: 1.66,
  },
});

export default Typography;
