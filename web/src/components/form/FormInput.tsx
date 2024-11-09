import { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import { Stack, FormControl, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';

interface FormInputProps {
  name: string;
  control: any;
  label: string;
  type?: string;
  endAdornment?: ReactNode;
}

const FormInputText = ({ name, control, label, type = 'text', endAdornment }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
        <Stack spacing={1}>
          <FormControl fullWidth>
            <InputLabel htmlFor={name}>{label}</InputLabel>
            <OutlinedInput
              id={name}
              type={type}
              error={!!error}
              value={value}
              name={name}
              onBlur={(e) => onChange(e.target.value)}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Enter your ${label}`}
              fullWidth
              label={label}
              endAdornment={endAdornment}
            />
          </FormControl>
          {error && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {error.message}
            </FormHelperText>
          )}
        </Stack>
      )}
    />
  );
};

export default FormInputText;
