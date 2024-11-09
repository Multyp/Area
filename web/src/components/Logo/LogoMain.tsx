import { useTheme } from '@mui/material/styles';
import Image from 'next/image';
import { useContext } from 'react';

// Local imports
import { ConfigContext } from '@/contexts/ConfigContext';

interface LogoMainProps {
  isWhite?: boolean;
}

const LogoMain = ({ isWhite }: LogoMainProps) => {
  const theme = useTheme();
  const { mode } = useContext(ConfigContext);

  const logoDark = '/assets/images/LogoMainDark.svg';
  const logoWhite = '/assets/images/LogoMainWhite.svg';

  const isDarkMode = mode === 'dark' || theme.palette.mode === 'dark';

  console.log(isDarkMode);

  return <Image src={isDarkMode ? logoWhite : logoDark} alt="AREA" width={100} height={35} />;
};

export default LogoMain;
