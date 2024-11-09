import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MyAppletsForm from './Form';
import { useState } from 'react';
import MyAppletsAddForm from './Form';
import { useMyApplet } from '@/contexts/app/MyAppletContext';

const MyAppletsAdd = () => {
  const { handleOpen } = useMyApplet();

  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen} sx={{ width: '100%', height: '100%' }}>
        <Typography variant="h6">Create Applet</Typography>
      </Button>
      <MyAppletsAddForm />
    </>
  );
};

export default MyAppletsAdd;
