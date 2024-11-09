'use client';

// Global imports
import { Grid } from '@mui/material';

// Scoped imports
import useToken from '@/hooks/useToken';
import Layout from '@/layout';
import MyAppletsAdd from '@/components/app/my_applets/Add';
import MyAppletsSearch from '@/components/app/my_applets/Search';
import MyAppletsMosaic from '@/components/app/my_applets/Mosaic';
import { MyAppletProvider } from '@/contexts/app/MyAppletContext';
const MyAppletsPage = () => {
  const token = useToken();
  return (
    <Layout>
      <MyAppletProvider token={token}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <MyAppletsSearch />
          </Grid>
          <Grid item xs={2}>
            <MyAppletsAdd />
          </Grid>
          <Grid item xs={12}>
            <MyAppletsMosaic />
          </Grid>
        </Grid>
      </MyAppletProvider>
    </Layout>
  );
};

export default MyAppletsPage;
