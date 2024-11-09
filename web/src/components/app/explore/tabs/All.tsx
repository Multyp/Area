'use client';

// Global imports
import { Box, Grid, Skeleton } from '@mui/material';

// Scoped imports
import { useExplore } from '@/contexts/app/ExploreContext';
import ExploreCard from '@/components/ExploreCard';
import { formatName } from '@/utils/formatName';

const ExploreTabsAll = () => {
  const { dataExplore, isLoadingExplore } = useExplore();

  return (
    <Grid container spacing={2}>
      {isLoadingExplore &&
        Array.from({ length: 12 }).map((_, index) => (
          <Grid item lg={4} md={4} sm={6} xs={12} key={index}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid>
        ))}
      {!isLoadingExplore && dataExplore && (
        <>
          {dataExplore.map((item: any, index: number) => (
            <Grid key={index} item lg={4} md={4} sm={6} xs={12} sx={{ boxShadow: 'none' }}>
              <ExploreCard
                id={item.id}
                url={item.type === 'applet' ? `/applets/${item.name}` : `/services/${item.name}`}
                title={formatName(item.name)}
                description={item.description}
                image={`/assets/images/applets/${item.name}.png`}
              />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
};

export default ExploreTabsAll;
