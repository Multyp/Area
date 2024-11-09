'use client';

// Global imports
import { useState, ReactNode, SyntheticEvent } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

// Scoped imports
import { useExplore } from '@/contexts/app/ExploreContext';

// Local imports
import ExploreTabsAll from './All';
import ExploreTabsServices from './Services';
import ExploreTabsApplets from './Applets';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ExploreTabs = () => {
  const { search } = useExplore();
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  const tabs = [
    {
      label: 'All',
      value: <ExploreTabsAll />,
    },
    {
      label: 'Services',
      value: <ExploreTabsServices />,
    },
    {
      label: 'Applets',
      value: <ExploreTabsApplets />,
    },
  ];

  if (search !== '') {
    return <></>;
  }

  return (
    <>
      <Tabs value={value} onChange={handleChange} scrollButtons="auto" centered>
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {tab.value}
        </CustomTabPanel>
      ))}
    </>
  );
};

export default ExploreTabs;
