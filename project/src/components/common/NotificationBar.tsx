import { useState, useEffect } from 'react';
import { Box, Alert, IconButton, Slide } from '@mui/material';
import { X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const NotificationBar = () => {
  const { notifications, removeNotification } = useNotification();
  const [currentNotification, setCurrentNotification] = useState<typeof notifications[0] | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notifications.length > 0 && !currentNotification) {
      const unreadNotification = notifications.find(n => !n.read);
      if (unreadNotification) {
        setCurrentNotification(unreadNotification);
        setVisible(true);
        
        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
          setVisible(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [notifications, currentNotification]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (currentNotification) {
        removeNotification(currentNotification.id);
        setCurrentNotification(null);
      }
    }, 300); // Wait for the slide animation to complete
  };

  // Map notification type to Alert severity
  const getSeverity = (type: string) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  if (!currentNotification) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 2000,
        maxWidth: { xs: '90%', sm: 400 },
      }}
    >
      <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
        <Alert
          severity={getSeverity(currentNotification.type)}
          variant="filled"
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <X size={18} />
            </IconButton>
          }
          sx={{
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2,
            width: '100%',
          }}
        >
          {currentNotification.message}
        </Alert>
      </Slide>
    </Box>
  );
};

export default NotificationBar;