// Global imports
import { useRouter } from 'next/navigation';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

// Scoped imports
import { logout } from '@/utils/logout';

const ProfileTab = () => {
  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton
        onClick={(e) => {
          e.preventDefault();
          router.push('/profile');
        }}
      >
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="View Profile" />
      </ListItemButton>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
};

export default ProfileTab;
