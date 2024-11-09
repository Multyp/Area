'use client';

// Global imports
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Button, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Cookies from 'js-cookie';

import { useForm } from 'react-hook-form';

import FormInputText from '@/components/form/FormInput';

// Scoped imports
import { dispatch } from '@/store';
import { openSnackbar } from '@/store/reducers/snackbar';

import axios from 'axios';

interface IFormInput {
  email: string;
  password: string;
}

const defaultValues = {
  email: '',
  password: '',
};

const AuthLogin = () => {
  const router = useRouter();
  const { handleSubmit, control } = useForm<IFormInput>({
    defaultValues: defaultValues,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function onSubmit(data: IFormInput) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, data);
    Cookies.set('token', response.data.token, { path: '/' });
    if (response.status === 200) {
      router.push('/explore');
    }
    dispatch(
      openSnackbar({
        open: true,
        message: response.data.message,
        variant: 'alert',
        alert: {
          color: response.status === 200 ? 'success' : 'error',
        },
        close: true,
      })
    );
  }
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormInputText name="email" control={control} label="Email" type="email" />
        </Grid>
        <Grid item xs={12}>
          <FormInputText
            name="password"
            type={passwordVisible ? 'text' : 'password'}
            control={control}
            label="Password"
            endAdornment={
              <IconButton
                edge="end"
                onClick={() => setPasswordVisible(!passwordVisible)}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              >
                {passwordVisible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            disableElevation
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AuthLogin;
