import { IconMap } from '@/components/Icon';
import { useMyApplet } from '@/contexts/app/MyAppletContext';
import { Box, StepLabel, Stack, Step, Typography, Button, TextField } from '@mui/material';

const MyAppletsAddFormResume = () => {
  const {
    actionService,
    actionTrigger,
    reactionService,
    reactionTrigger,
    handleStep,
    actionConnected,
    reactionConnected,
    handleRemoveAction,
    handleRemoveReaction,
    name,
    handleSetName,
    handleCreateApplet,
  } = useMyApplet();

  const IconAction = IconMap[actionService || ''];
  const IconReaction = IconMap[reactionService || ''];

  return (
    <Box sx={{ width: '100%', my: 3 }}>
      <Stack direction="column" alignItems="center" spacing={2} justifyContent="center">
        <Typography variant="h2" color="primary.main" fontWeight={600}>
          IF
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: '8px',
            padding: '8px',
            width: '80%',
            justifyContent: 'center',
          }}
        >
          {IconAction && <IconAction sx={{ fontSize: 48 }} />}
          <Typography variant="h2">{actionTrigger || 'Action'}</Typography>
          {!actionConnected && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleStep(1);
              }}
            >
              ADD
            </Button>
          )}
          {actionConnected && (
            <Button variant="contained" onClick={handleRemoveAction}>
              Delete
            </Button>
          )}
        </Stack>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h2" color="primary.main" fontWeight={600}>
            THEN
          </Typography>
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: '8px',
            padding: '8px',
            width: '80%',
            justifyContent: 'center',
          }}
        >
          {IconReaction && <IconReaction sx={{ fontSize: 48 }} />}
          <Typography variant="h2">{reactionTrigger || 'Reaction'}</Typography>
          {!reactionConnected && (
            <Button variant="contained" color="primary" onClick={() => handleStep(3)}>
              ADD
            </Button>
          )}
          {reactionConnected && (
            <Button variant="contained" onClick={handleRemoveReaction}>
              Delete
            </Button>
          )}
        </Stack>
        {actionService && actionTrigger && reactionService && reactionTrigger && (
          <>
            <TextField label="Name" value={name} onChange={handleSetName} />
            <Button variant="contained" color="primary" sx={{ width: '60%', height: '50px' }} onClick={handleCreateApplet}>
              Save
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default MyAppletsAddFormResume;
