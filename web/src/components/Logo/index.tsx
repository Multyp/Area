import NextLink from 'next/link';

// material-ui
import { ButtonBase } from '@mui/material';
import { SxProps } from '@mui/system';

// project import
import LogoMain from './LogoMain';
import LogoIcon from './LogoIcon';
import { APP_DEFAULT_PATH } from '@/config';

interface Props {
  isIcon?: boolean;
  isWhite?: boolean;
  sx?: SxProps;
  to?: string;
}

const LogoSection = ({ isIcon, isWhite, sx, to }: Props) => (
  <NextLink href={!to ? APP_DEFAULT_PATH : to} passHref legacyBehavior>
    <ButtonBase disableRipple sx={sx}>
      {isIcon ? <LogoIcon /> : <LogoMain isWhite={isWhite} />}
    </ButtonBase>
  </NextLink>
);

export default LogoSection;
