'use client';

// Global imports
import { Grid, Skeleton } from '@mui/material';

// Scoped imports
import { useExplore } from '@/contexts/app/ExploreContext';
import ExploreCard from '@/components/ExploreCard';
import { formatName } from '@/utils/formatName';

const ExploreTabsServices = () => {
  const { dataExplore, isLoadingExplore } = useExplore();
  console.log(dataExplore);

  return (
    <Grid container spacing={2}>
      {isLoadingExplore &&
        Array.from({ length: 12 }).map((_, index) => (
          <Grid item lg={4} md={4} sm={6} xs={12} key={index}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid>
        ))}
      {!isLoadingExplore &&
        dataExplore &&
        dataExplore.map((item: any, index: number) => {
          if (item.type === 'service') {
            return (
              <Grid item lg={4} md={4} sm={6} xs={12} key={index}>
                <ExploreCard
                  id={item.id}
                  url={`/services/${item.name}`}
                  title={formatName(item.name)}
                  description={item.description}
                  image={`/assets/images/applets/${item.name}.png`}
                />
              </Grid>
            );
          }
        })}
    </Grid>
  );
};

export default ExploreTabsServices;
