// Global imports
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { QuestionCircleOutlined } from '@ant-design/icons';

const SettingTab = () => {
  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton onClick={() => window.open('mailto:jean-jacques.delegue@epitech.eu', '_blank')}>
        <ListItemIcon>
          <QuestionCircleOutlined />
        </ListItemIcon>
        <ListItemText primary="Support" />
      </ListItemButton>
    </List>
  );
};

export default SettingTab;
