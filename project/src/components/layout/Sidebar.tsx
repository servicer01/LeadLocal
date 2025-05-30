import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Typography,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, signOut } = useAuth();
  const [expanded, setExpanded] = useState(open && !isMobile);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { 
      title: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard size={24} />,
    },
    { 
      title: 'Leads', 
      path: '/leads', 
      icon: <Users size={24} />,
    },
    { 
      title: 'Templates', 
      path: '/templates', 
      icon: <FileText size={24} />,
    },
    { 
      title: 'Campaigns', 
      path: '/campaigns', 
      icon: <Mail size={24} />,
    },
    { 
      title: 'Analytics', 
      path: '/analytics', 
      icon: <BarChart2 size={24} />,
    },
    { 
      title: 'Settings', 
      path: '/settings', 
      icon: <Settings size={24} />,
    },
  ];

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: expanded ? 'space-between' : 'center',
            p: 2,
          }}
        >
          {expanded && (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              GeoQualified
              <Box component="span" sx={{ color: 'text.primary', ml: 0.5 }}>
                Pro
              </Box>
            </Typography>
          )}
          
          {!isMobile && (
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                borderRadius: '50%',
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': {
                  bgcolor: 'background.paper',
                },
              }}
            >
              {expanded ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          )}
        </Box>

        <Divider />

        <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip
                  title={!expanded ? item.title : ''}
                  placement="right"
                  arrow
                >
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      minHeight: 48,
                      justifyContent: expanded ? 'initial' : 'center',
                      bgcolor: isActive ? 'primary.light' : 'transparent',
                      color: isActive ? 'white' : 'text.primary',
                      '&:hover': {
                        bgcolor: isActive ? 'primary.main' : 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: expanded ? 36 : 0,
                        mr: expanded ? 2 : 0,
                        justifyContent: 'center',
                        color: isActive ? 'white' : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {expanded && <ListItemText primary={item.title} />}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        <Divider />

        {user && (
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: expanded ? 'space-between' : 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={user.avatar}
                alt={user.email}
                sx={{ width: 40, height: 40 }}
              />
              
              {expanded && (
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user.firstName || user.email.split('@')[0]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.role}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Tooltip title="Sign Out" placement="top">
              <IconButton
                onClick={handleSignOut}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main' },
                }}
              >
                <LogOut size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          anchor="left"
          open={open}
          onClose={onClose}
          variant="temporary"
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              borderRight: '0',
              boxShadow: 3,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: expanded ? 280 : 80,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: expanded ? 280 : 80,
              boxSizing: 'border-box',
              borderRight: '0',
              boxShadow: 3,
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;