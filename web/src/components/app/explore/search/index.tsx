// Global imports
import { useMemo, SyntheticEvent } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useExplore } from '@/contexts/app/ExploreContext';

const ExploreSearch = () => {
  const { search, setSearch, dataExplore } = useExplore();

  const options = useMemo(() => {
    const services = dataExplore?.services || [];
    const applets = dataExplore?.customApplets || [];
    return [...services, ...applets].map((item: any) => ({ label: item.name, value: item.id }));
  }, [dataExplore]);

  const handleChange = (_event: SyntheticEvent, newValue: { label: string; value: string } | null) => {
    setSearch(newValue ? newValue.label : '');
  };

  return (
    <>
      <Autocomplete
        id="search"
        options={options}
        value={search ? { label: search, value: '' } : null}
        onChange={handleChange}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => <li {...props}>{option.label}</li>}
        renderInput={(params) => <TextField {...params} variant="outlined" fullWidth placeholder="Search Services or Applets" />}
      />
    </>
  );
};

export default ExploreSearch;
