import { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { DownOutlined } from '@ant-design/icons';

const MenuOrientation = () => {
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <>
      <Accordion expanded={open} onChange={handleToggle}>
        <AccordionSummary expandIcon={<DownOutlined />} sx={{ p: 0 }}>
          <Typography variant="h6">Menu Orientation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default MenuOrientation;
