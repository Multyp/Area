// Global imports
import { Typography, Skeleton } from '@mui/material';

// Scoped imports
import { useService } from '@/contexts/app/ServiceContext';
import MainCard from '@/components/MainCard';

const ServiceHeader = () => {
  const { dataService, isLoadingService, errorService } = useService();

  if (isLoadingService) return <Skeleton variant="rectangular" width="100%" height={100} animation="wave" />;
  if (errorService) return <div>Error: {errorService.message}</div>;

  return (
    <MainCard sx={{ textAlign: 'center', backgroundColor: 'background.default' }}>
      <Typography variant="h4">{dataService?.name}</Typography>
      <Typography variant="subtitle1">{dataService?.description}</Typography>
    </MainCard>
  );
};

export default ServiceHeader;
