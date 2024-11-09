'use client';

// material-ui
import { Box } from '@mui/material';
import Image from 'next/image';

const AuthBackground = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        zIndex: -1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& > span': {
          position: 'absolute',
        },
      }}
    >
      <Image
        src="/background.jpg"
        alt="authBackground"
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </Box>
  );
};

export default AuthBackground;
