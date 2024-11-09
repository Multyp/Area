'use client';

// Global imports
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Button, Typography, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Cookies from 'js-cookie';

import { Form, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import FormInputText from '@/components/form/FormInput';

// Scoped imports
import { dispatch } from '@/store';
import { openSnackbar } from '@/store/reducers/snackbar';

import axios from 'axios';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});

interface IFormInput {
  email: string;
  password: string;
  confirmPassword: string;
}

const defaultValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

const AuthRegister = () => {
  const router = useRouter();
  const { handleSubmit, control } = useForm<IFormInput>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  async function onSubmit(data: IFormInput) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`, data);
    Cookies.set('token', response.data.token, { path: '/' });
    if (response.status === 201) {
      router.push('/explore');
    }
    dispatch(
      openSnackbar({
        open: true,
        message: response.data.message,
        variant: 'alert',
        alert: {
          color: response.status === 201 ? 'success' : 'error',
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
          <FormInputText
            name="confirmPassword"
            type={confirmPasswordVisible ? 'text' : 'password'}
            control={control}
            label="Confirm Password"
            endAdornment={
              <IconButton
                edge="end"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                aria-label={confirmPasswordVisible ? 'Hide confirm password' : 'Show confirm password'}
              >
                {confirmPasswordVisible ? <VisibilityOff /> : <Visibility />}
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
            Register
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default AuthRegister;
