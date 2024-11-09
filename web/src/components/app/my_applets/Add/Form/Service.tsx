// Global imports
import { Box, Button, Grid, Skeleton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Scoped imports
import { useMyApplet } from '@/contexts/app/MyAppletContext';
import { SquareCard } from '@/components/SquareCard';
import { IconMap } from '@/components/Icon';

interface MyAppletsAddFormServiceProps {
  setService: (service: string) => void;
}

const MyAppletsAddFormService = ({ setService }: MyAppletsAddFormServiceProps) => {
  const { dataServices, isLoadingServices, errorServices, handleStep, activeStep, handleClose } = useMyApplet();

  if (errorServices) return <>{errorServices.message}</>;

  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
        Choose a service
      </Typography>
      <Grid container spacing={2}>
        {isLoadingServices
          ? Array.from({ length: 4 }, (_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rectangular" width="100%" height={118} />
              </Grid>
            ))
          : dataServices?.map((service: { name: string; description: string }) => {
              const IconComponent = IconMap[service.name];
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={service.name}>
                  <SquareCard
                    onClick={() => {
                      setService(service.name);
                    }}
                  >
                    {IconComponent && <IconComponent sx={{ width: 64, height: 64, mb: 2 }} />}
                    <Typography>{service.name}</Typography>
                  </SquareCard>
                </Grid>
              );
            })}
      </Grid>
      <Button
        onClick={activeStep === 1 ? () => handleStep(0) : handleClose}
        startIcon={<ArrowBackIcon />}
        sx={{
          color: 'text.secondary',
        }}
      >
        {activeStep === 1 ? 'Back' : 'Cancel'}
      </Button>
    </Box>
  );
};

export default MyAppletsAddFormService;
