'use client';

// Global imports
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AppletField, AppletInfo } from '@/types/applet';
import { Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Box } from '@mui/material';

// Scoped imports
import { getMissingConnections } from '@/utils/getMissingConnections';
import Layout from '@/layout';
import { getAppletInfos } from '@/utils/getAppletFields';
import LogoEnabled from '@/components/Logo/LogoEnabled';
import { disableApplet } from '@/utils/disableApplet';

export default function AppletsIdPage({ params }: { params: { id: string } }) {
  const [open, setOpen] = useState(false);
  const [appletInfo, setAppletInfo] = useState<AppletInfo | undefined>(undefined);
  const [formValues, setFormValues] = useState<Map<string, string>>(new Map());
  const [missingConnections, setMissingConnections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const setFormValue = (key: string, value: string) => {
    setFormValues((prevFormValues) => {
      const newFormValues = new Map(prevFormValues);
      newFormValues.set(key, value);
      return newFormValues;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const result: string[] | undefined = await getMissingConnections(params.id);

      if (result) {
        setMissingConnections(result);
      } else {
        router.push('/login');
      }

      const info = await getAppletInfos(params.id);
      setAppletInfo(info);

      if (info) {
        for (let requiredField of info.fields) {
          setFormValue(requiredField.name, '');
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [params.id, router]);

  useEffect(() => {
    if (missingConnections.length > 0) {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.oauth_redirect_url) {
          getMissingConnections(params.id).then((result) => {
            setMissingConnections(result || []);
          });
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [missingConnections.length, params.id]);

  const handleClickDisable = async () => {
    if (appletInfo) {
      setAppletInfo({ ...appletInfo, isEnabled: false });
      await disableApplet(params.id);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getTokenFromCookies = () => {
    const tokenMatch = document.cookie.match('(^|;)\\s*token\\s*=\\s*([^;]+)');
    return tokenMatch ? tokenMatch.pop() : '';
  };

  const handleFormSubmit = async () => {
    const token = getTokenFromCookies();

    if (!token) {
      console.error('No token found in cookies');
      return;
    }

    await Promise.all(
      Array.from(formValues).map(async ([key, value]) => {
        if (!value || value == '') {
          console.error(`Value for ${key} is empty`);
          return;
        }
      })
    );

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/applets/${params.id}/enable`, {
        token: token,
        ...Object.fromEntries(formValues),
      });

      if (appletInfo) {
        setAppletInfo({ ...appletInfo, isEnabled: true });
      }
    } catch (error) {
      console.error('Error during the API call', error);
    } finally {
      handleClose();
    }
  };

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

  if (isLoading) {
    return (
      <Layout>
        <Typography variant="body1" component="p">
          Loading...
        </Typography>
      </Layout>
    );
  }

  if (missingConnections.length > 0) {
    return (
      <Layout>
        <Typography gutterBottom variant="h3" component="div">
          {appletInfo?.title}
        </Typography>
        <Typography variant="body2" component="p">
          Please connect to the following services to enable this applet:
        </Typography>
        {missingConnections.map((service) => (
          <Button key={service} variant="contained" onClick={() => connectWithProvider(service)}>
            {service}
          </Button>
        ))}
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography gutterBottom variant="h3" component="div">
        {appletInfo?.title}
      </Typography>
      <Typography gutterBottom variant="body2" component="div">
        {appletInfo?.description}
      </Typography>
      {appletInfo?.isEnabled ? (
        <>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <Typography gutterBottom variant="h3" component="div" display="flex" alignItems="center">
              This applet is enabled
            </Typography>
            <LogoEnabled />
          </Box>
          <Button variant="contained" onClick={handleClickDisable} sx={{ mt: 2 }}>
            Disable
          </Button>
        </>
      ) : (
        <Button variant="contained" disabled={appletInfo?.isEnabled} onClick={handleClickOpen} sx={{ marginBottom: 2 }}>
          Enable
        </Button>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enable Applet</DialogTitle>
        {appletInfo && appletInfo.fields.length > 0 && (
          <DialogContent>
            <DialogContentText>Please enter the following fields:</DialogContentText>
            {appletInfo.fields.map((field: AppletField, index: number) => (
              <TextField
                key={index}
                autoFocus
                margin="dense"
                label={field.title}
                type="text"
                fullWidth
                variant="outlined"
                value={formValues.get(field.name)}
                onChange={(e) => setFormValue(field.name, e.target.value)}
              />
            ))}
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleFormSubmit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
