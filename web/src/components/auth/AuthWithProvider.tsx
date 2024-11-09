// Global imports
import { Button, Box } from '@mui/material';
import styled from '@emotion/styled';

// Scoped imports
import { GoogleIcon, DiscordIcon, MicrosoftIcon, GithubIcon, TwitchIcon } from '@/components/Icon';

const ButtonStyled = styled(Button)(({ theme }) => ({
  variant: 'outlined',
  width: '100%',
  px: 3,
  py: 1,
  '&:hover': {
    bgcolor: 'grey.200',
  },
}));

const AuthWithProvider = () => {
  const connectWithProvider = (provider: string) => {
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/${provider}/authorize`,
      'OAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <ButtonStyled startIcon={<GoogleIcon />} onClick={() => connectWithProvider('google')}>
        Google
      </ButtonStyled>
      <ButtonStyled startIcon={<DiscordIcon />} onClick={() => connectWithProvider('discord')}>
        Discord
      </ButtonStyled>
      <ButtonStyled startIcon={<GithubIcon />} onClick={() => connectWithProvider('github')}>
        Github
      </ButtonStyled>
      <ButtonStyled startIcon={<MicrosoftIcon />} onClick={() => connectWithProvider('microsoft')}>
        Microsoft
      </ButtonStyled>
      <ButtonStyled startIcon={<TwitchIcon />} onClick={() => connectWithProvider('twitch')}>
        Twitch
      </ButtonStyled>
    </Box>
  );
};

export default AuthWithProvider;
