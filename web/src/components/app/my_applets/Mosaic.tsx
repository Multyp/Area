import { useMyApplet } from '@/contexts/app/MyAppletContext';
import { Grid, Card, CardContent, Typography, Skeleton } from '@mui/material';

const MyAppletsMosaic = () => {
  const { dataApplets, isLoadingApplets, errorApplets } = useMyApplet();

  if (errorApplets) return <>{errorApplets.message}</>;

  return (
    <Grid container spacing={2}>
      {isLoadingApplets
        ? Array.from({ length: 12 }).map((_, index) => (
            <Grid item xs={4} key={index}>
              <Skeleton variant="rectangular" height={118} />
            </Grid>
          ))
        : dataApplets?.map((applet, index) => (
            <Grid item xs={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{applet.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
    </Grid>
  );
};

export default MyAppletsMosaic;
