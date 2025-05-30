import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search,
  Bell,
  HelpCircle,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

// Helper function to get page title based on current path
const getPageTitle = (pathname: string): string => {
  const path = pathname.split('/')[1];
  
  switch (path) {
    case 'dashboard':
      return 'Dashboard';
    case 'leads':
      return 'Lead Management';
    case 'templates':
      return 'Template Library';
    case 'campaigns':
      return 'Campaigns';
    case 'analytics':
      return 'Analytics & Reporting';
    case 'settings':
      return 'Settings';
    default:
      return 'GeoQualified Pro';
  }
};

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, signOut } = useAuth();
  const { notifications } = useNotification();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };
  
  const handleSignOut = async () => {
    handleClose();
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const pageTitle = getPageTitle(location.pathname);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          onClick={toggleSidebar}
          sx={{
            mr: 2,
            display: { xs: 'flex', md: sidebarOpen ? 'none' : 'flex' },
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600 }}
        >
          {pageTitle}
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {!isMobile && (
          <TextField
            placeholder="Search..."
            size="small"
            sx={{
              width: 250,
              mr: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'background.default',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <HelpCircle size={22} />
          </IconButton>
          
          <IconButton 
            color="inherit" 
            sx={{ ml: 1 }}
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={unreadNotifications} color="error">
              <Bell size={22} />
            </Badge>
          </IconButton>
          
          <IconButton
            onClick={handleProfileClick}
            sx={{ ml: 1 }}
          >
            <Avatar
              src={user?.avatar}
              alt={user?.email || 'User'}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Box>
      </Toolbar>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 220,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user?.firstName || user?.email?.split('@')[0]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <User size={18} />
          </ListItemIcon>
          My Profile
        </MenuItem>
        
        <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Settings size={18} />
          </ListItemIcon>
          Settings
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleSignOut} sx={{ py: 1.5, color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <LogOut size={18} />
          </ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 320,
            maxHeight: 400,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
          {notifications.length > 0 && (
            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
              Mark all as read
            </Typography>
          )}
        </Box>
        
        <Divider />
        
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No notifications yet</Typography>
          </Box>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleNotificationClose}
              sx={{
                py: 1.5,
                px: 2,
                borderLeft: notification.read ? 'none' : `4px solid ${theme.palette.primary.main}`,
                bgcolor: notification.read ? 'transparent' : 'rgba(37, 99, 235, 0.05)',
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.created_at).toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
        
        {notifications.length > 5 && (
          <>
            <Divider />
            <Box sx={{ p: 1.5, textAlign: 'center' }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', fontWeight: 500 }}
              >
                View all notifications
              </Typography>
            </Box>
          </>
        )}
      </Menu>
    </AppBar>
  );
};

export default Header;