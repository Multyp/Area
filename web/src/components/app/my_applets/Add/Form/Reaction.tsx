// Global imports
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';

// Scoped imports
import { useMyApplet } from '@/contexts/app/MyAppletContext';
import { RectangularCard } from '@/components/SquareCard';
import { IconMap } from '@/components/Icon';

import MyAppletsAddFormService from './Service';
import MyAppletsAddFormTrigger from './Trigger';

const MyAppletsAddFormReaction = () => {
  const {
    reactionService,
    setReactionService,
    dataReactionTriggers,
    isLoadingReactionTriggers,
    errorReactionTriggers,
    reactionTrigger,
    setReactionTrigger,
    setReactionConnected,
    handleStep,
    reactionFields,
    setReactionFields,
  } = useMyApplet();

  const reactionSelected =
    dataReactionTriggers && reactionTrigger && dataReactionTriggers.find((trigger) => trigger.name === reactionTrigger);

  if (!reactionService) return <MyAppletsAddFormService setService={setReactionService} />;
  if (!reactionTrigger)
    return (
      <MyAppletsAddFormTrigger
        service={reactionService}
        data={dataReactionTriggers}
        isLoading={isLoadingReactionTriggers}
        error={errorReactionTriggers}
        setTrigger={setReactionTrigger}
        setService={setReactionService}
      />
    );

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} sx={{ textAlign: 'center' }}>
        {reactionSelected && reactionSelected.name}
      </Typography>
      <Typography variant="h5" sx={{ textAlign: 'center' }}>
        {reactionSelected && reactionSelected.description}
      </Typography>
      {reactionSelected && (
        <Stack direction="column" spacing={2}>
          {Object.entries(reactionSelected.required_fields).map(([key, value]) => (
            <TextField
              key={key}
              fullWidth
              label={value}
              value={reactionFields[value]}
              onChange={(e) => {
                setReactionFields({ ...reactionFields, [value]: e.target.value });
              }}
            />
          ))}
        </Stack>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          onClick={() => {
            setReactionConnected(true);
            handleStep(4);
          }}
        >
          Connect
        </Button>
      </Box>
    </Box>
  );
};

export default MyAppletsAddFormReaction;
