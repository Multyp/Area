// Global imports
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Scoped imports
import { RectangularCard } from '@/components/SquareCard';
import { IconMap } from '@/components/Icon';

interface MyAppletsAddFormTriggerProps {
  service: string;
  data: any;
  isLoading: boolean;
  error: any;
  setTrigger: (trigger: string | null) => void;
  setService: (service: string | null) => void;
}

const MyAppletsAddFormTrigger = ({ service, data, isLoading, error, setTrigger, setService }: MyAppletsAddFormTriggerProps) => {
  const IconComponent = IconMap[service || ''];

  if (error) return <>{error.message}</>;

  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
        Choose a trigger
      </Typography>
      <Grid container spacing={2}>
        {isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <RectangularCard>
                <Typography>Chargement...</Typography>
              </RectangularCard>
            </Grid>
          ))}
        {data && data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, height: '200px', width: '100%' }}>
            <Typography variant="h2" fontWeight={600}>
              NO TRIGGERS
            </Typography>
          </Box>
        ) : (
          data &&
          data.map((trigger: { name: string; description: string }) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={trigger.name}>
                <RectangularCard
                  onClick={() => {
                    setTrigger(trigger.name);
                  }}
                >
                  {IconComponent && <IconComponent sx={{ width: 64, height: 64, mb: 2 }} />}
                  <Typography>{trigger.name}</Typography>
                  <Typography>{trigger.description}</Typography>
                </RectangularCard>
              </Grid>
            );
          })
        )}
      </Grid>
      <Button
        onClick={() => setService(null)}
        startIcon={<ArrowBackIcon />}
        sx={{
          color: 'text.secondary',
        }}
      >
        Back
      </Button>
    </Box>
  );
};

export default MyAppletsAddFormTrigger;
