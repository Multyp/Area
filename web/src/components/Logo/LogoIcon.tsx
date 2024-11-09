// material-ui
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { useContext } from 'react';

// Local imports
import { ConfigContext } from '@/contexts/ConfigContext';

const LogoIcon = () => {
  const theme = useTheme();
  const { mode } = useContext(ConfigContext);

  const logoDark = '/assets/images/LogoIconLight.svg';
  const logo = '/assets/images/LogoIcon.svg';

  const isDarkMode = mode === 'dark' || theme.palette.mode === 'dark';

  return <Image src={isDarkMode ? logoDark : logo} alt="AREA" width={35} height={35} />;
};

export default LogoIcon;
