// Global imports
import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

// Scoped imports
import { useMyApplet } from '@/contexts/app/MyAppletContext';

// Local imports
import MyAppletsAddFormService from './Service';
import MyAppletsAddFormTrigger from './Trigger';

const MyAppletsAddFormAction = () => {
  const {
    actionService,
    setActionService,
    dataActionTriggers,
    isLoadingActionTriggers,
    errorActionTriggers,
    actionTrigger,
    setActionTrigger,
    setActionConnected,
    handleStep,
  } = useMyApplet();

  const actionSelected = dataActionTriggers && actionTrigger && dataActionTriggers.find((trigger) => trigger.name === actionTrigger);

  const [missingConnections, setMissingConnections] = useState<string[]>([]);
  const connectWithProvider = (provider: string) => {
    const width = 550;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/${provider}/authorize`,
      'OAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  useEffect(() => {
    if (actionService) {
      const handleMessage = (event: MessageEvent) => {
        console.log(event);
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.oauth_redirect_url) {
          console.log('oauth_redirect_url');
          setMissingConnections([]);
          setActionConnected(true);
          handleStep(2);
        }
      };

      window.addEventListener('message', handleMessage);
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [actionService]);

  if (!actionService) return <MyAppletsAddFormService setService={setActionService} />;
  if (!actionTrigger)
    return (
      <MyAppletsAddFormTrigger
        service={actionService}
        data={dataActionTriggers}
        isLoading={isLoadingActionTriggers}
        error={errorActionTriggers}
        setTrigger={setActionTrigger}
        setService={setActionService}
      />
    );

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ textAlign: 'center' }}>
        {actionSelected && actionSelected.name}
      </Typography>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        {actionSelected && actionSelected.description}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          onClick={() => {
            if (actionService) {
              connectWithProvider(actionService);
            }
          }}
        >
          Connect
        </Button>
      </Box>
    </Box>
  );
};

export default MyAppletsAddFormAction;
