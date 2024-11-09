'use client';

// Global imports
import { useState } from 'react';
import { Drawer, CardContent, Button, Typography, Select, MenuItem, Stack, InputLabel, Grid, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Scoped imports
import { useExplore } from '@/contexts/app/ExploreContext';
import useToken from '@/hooks/useToken';

const ExploreForm = () => {
  const { open, handleToggle, dataExplore, handleCreateApplet } = useExplore();
  const token = useToken();

  const [appletName, setAppletName] = useState('');
  const [selectedService1, setSelectedService1] = useState('');
  const [selectedAction1, setSelectedAction1] = useState('');
  const [selectedService2, setSelectedService2] = useState('');
  const [selectedAction2, setSelectedAction2] = useState('');
  const [isParams, setIsParams] = useState(false);
  const [fields, setField] = useState<Map<string, string>>(new Map());

  const handleSetField = (key: string, value: string) => {
    setField((prevFields) => {
      const updatedFields = new Map(prevFields);

      updatedFields.set(key, value);

      return updatedFields;
    });
  };

  const handleSelectService1 = (e: any) => setSelectedService1(e.target.value);
  const handleSelectAction1 = (e: any) => setSelectedAction1(e.target.value);
  const handleSelectService2 = (e: any) => setSelectedService2(e.target.value);
  const handleSelectAction2 = (e: any) => {
    setIsParams(true);
    setSelectedAction2(e.target.value);
  };

  const formatName = (input: string): string => {
    return input
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleToggle}
      sx={{
        '& .MuiDrawer-paper': {
          width: '40%',
          maxWidth: '90%',
          boxSizing: 'border-box',
        },
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">Create Applet</Typography>
              <IconButton onClick={handleToggle}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1.25}>
              <TextField
                label="Name"
                variant="outlined"
                type="text"
                onChange={(e) => setAppletName(e.target.value)}
                required
                error={false}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1.25}>
              <InputLabel>Action service</InputLabel>
              <Select value={selectedService1} onChange={handleSelectService1}>
                {dataExplore?.map((item: any, index: number) => {
                  if (item.type === 'service') {
                    return (
                      <MenuItem key={index} value={item.name}>
                        {formatName(item.name)}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1.25}>
              <InputLabel>If</InputLabel>
              <Select value={selectedAction1} onChange={handleSelectAction1}>
                {dataExplore
                  ?.find((item: any) => item.name === selectedService1)
                  ?.actions.map((action: any, index: number) => (
                    <MenuItem key={index} value={action.name}>
                      {formatName(action.name)}
                    </MenuItem>
                  ))}
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1.25}>
              <InputLabel>Reaction service</InputLabel>
              <Select value={selectedService2} onChange={handleSelectService2}>
                {dataExplore?.map((service: any, index: number) => {
                  if (service.type === 'service') {
                    return (
                      <MenuItem key={index} value={service.name}>
                        {formatName(service.name)}
                      </MenuItem>
                    );
                  }
                })}
              </Select>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1.25}>
              <InputLabel>Then</InputLabel>
              <Select value={selectedAction2} onChange={handleSelectAction2}>
                {dataExplore
                  ?.find((service: any) => service.name === selectedService2)
                  ?.reactions.map((reaction: any, index: number) => (
                    <MenuItem key={index} value={reaction.name}>
                      {formatName(reaction.name)}
                    </MenuItem>
                  ))}
              </Select>
            </Stack>
          </Grid>
          {isParams && (
            <Grid item xs={12}>
              <Stack spacing={1.25}>
                {dataExplore
                  ?.find((service: any) => service.name === selectedService2)
                  ?.reactions?.find((reaction: any) => reaction.name === selectedAction2)
                  ?.required_fields?.map((field: any, index: number) => {
                    return (
                      <TextField
                        key={index}
                        multiline={field == 'message' ? true : false}
                        label={formatName(field)}
                        variant="outlined"
                        type="text"
                        required
                        onChange={(e) => handleSetField(field, e.target.value)}
                        error={false}
                      />
                    );
                  })}
              </Stack>
            </Grid>
          )}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Button variant="outlined" color="secondary" onClick={handleToggle}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleCreateApplet({ token, appletName, selectedService1, selectedAction1, selectedService2, selectedAction2, fields })
                }
              >
                Create
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Drawer>
  );
};

export default ExploreForm;
