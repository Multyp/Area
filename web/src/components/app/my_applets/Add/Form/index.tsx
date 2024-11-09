import { useMemo, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Step, StepLabel, Stepper, Button, Box, Typography, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { useMyApplet } from '@/contexts/app/MyAppletContext';
import MyAppletsAddFormAction from './Action';
import MyAppletsAddFormReaction from './Reaction';
import { IconMap } from '@/components/Icon';
import MyAppletsAddFormResume from './Resume';

const MyAppletsAddForm = () => {
  const { open, handleClose, activeStep, actionService, actionTrigger, reactionService, reactionTrigger } = useMyApplet();

  const IconAction = IconMap[actionService || ''];
  const IconReaction = IconMap[reactionService || ''];

  const ActiveStep = useMemo(() => {
    return (
      <Box sx={{ mt: 2, minHeight: '200px' }}>
        {(activeStep === 0 || activeStep === 2 || activeStep === 4) && <MyAppletsAddFormResume />}
        {activeStep === 1 && <MyAppletsAddFormAction />}
        {activeStep === 3 && <MyAppletsAddFormReaction />}
      </Box>
    );
  }, [activeStep]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogContent>
        {/* <Box sx={{ width: '100%', my: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
            <Typography variant="h2" color="primary.main" fontWeight={600}>
              IF
            </Typography>
            <Step sx={{ minWidth: '150px' }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: '8px',
                  padding: '8px 4px',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                {IconAction && <IconAction sx={{ fontSize: 48 }} />}
                <StepLabel>
                  <Typography variant="h2">{actionTrigger || 'Action'}</Typography>
                </StepLabel>
              </Stack>
            </Step>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h2" color="primary.main" fontWeight={600}>
                THEN
              </Typography>
            </Box>
            <Step sx={{ minWidth: '150px' }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: '8px',
                  padding: '8px 4px',
                  width: '100%',
                  justifyContent: 'center',
                }}
              >
                {IconReaction && <IconReaction sx={{ fontSize: 48 }} />}
                <StepLabel>
                  <Typography variant="h2">{reactionTrigger || 'Reaction'}</Typography>
                </StepLabel>
              </Stack>
            </Step>
          </Stack>
        </Box> */}

        {ActiveStep}
      </DialogContent>
    </Dialog>
  );
};

export default MyAppletsAddForm;
