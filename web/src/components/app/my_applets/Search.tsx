import { Autocomplete, TextField, Box } from '@mui/material';

const MyAppletsSearch = () => {
  return <Autocomplete options={[]} renderInput={(params) => <TextField {...params} label="Filter" />} />;
};

export default MyAppletsSearch;
