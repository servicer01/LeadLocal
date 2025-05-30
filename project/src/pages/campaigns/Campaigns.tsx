import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  Mail,
  Plus,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Edit,
  Users,
  Calendar,
  BarChart2,
} from 'lucide-react';
import { Campaign } from '../../types';
import { useNotification } from '../../context/NotificationContext';

const Campaigns = () => {
  const theme = useTheme();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading campaigns
    const loadCampaigns = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from API
        const mockCampaigns: Campaign[] = [
          {
            id: '1',
            name: 'Q1 Technology Outreach',
            description: 'Targeted campaign for technology sector leads',
            startDate: '2023-01-01T00:00:00Z',
            endDate: '2023-03-31T00:00:00Z',
            status: 'completed',
            templateId: '1',
            leads: ['1', '3', '4'],
            metrics: {
              sent: 150,
              delivered: 148,
              opened: 98,
              clicked: 45,
              replied: 22,
              converted: 12,
              unsubscribed: 3,
              bounced: 2,
            },
            tags: ['tech', 'q1-2023'],
            created_at: '2022-12-15T00:00:00Z',
            updated_at: '2023-04-05T00:00:00Z',
            createdBy: 'user1',
            isAutomated: true,
            abTestingEnabled: true,
          },
          {
            id: '2',
            name: 'Healthcare Solutions',
            description: 'Outreach for healthcare industry leads',
            startDate: '2023-04-01T00:00:00Z',
            endDate: '2023-06-30T00:00:00Z',
            status: 'active',
            templateId: '2',
            leads: ['4'],
            metrics: {
              sent: 85,
              delivered: 82,
              opened: 55,
              clicked: 28,
              replied: 15,
              converted: 6,
              unsubscribed: 1,
              bounced: 3,
            },
            tags: ['healthcare', 'q2-2023'],
            created_at: '2023-03-15T00:00:00Z',
            updated_at: '2023-06-15T00:00:00Z',
            createdBy: 'user1',
            isAutomated: true,
            abTestingEnabled: false,
          },
        ];

        setCampaigns(mockCampaigns);
      } catch (error) {
        console.error('Error loading campaigns:', error);
        addNotification({
          type: 'error',
          message: 'Failed to load campaigns',
        });
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [addNotification]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, campaignId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedCampaign(campaignId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedCampaign(null);
  };

  const handlePauseCampaign = () => {
    // Implement pause functionality
    addNotification({
      type: 'success',
      message: 'Campaign paused successfully',
    });
    handleMenuClose();
  };

  const handleDeleteCampaign = () => {
    // Implement delete functionality
    addNotification({
      type: 'success',
      message: 'Campaign deleted successfully',
    });
    handleMenuClose();
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return theme.palette.success;
      case 'scheduled':
        return theme.palette.warning;
      case 'completed':
        return theme.palette.primary;
      case 'paused':
        return theme.palette.error;
      default:
        return theme.palette.secondary;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Campaigns
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your outreach campaigns and track their performance
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          component={RouterLink}
          to="/campaigns/new"
        >
          New Campaign
        </Button>
      </Box>

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" height={32} width="60%" />
                    <Skeleton variant="text" height={24} width="80%" />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Skeleton variant="rectangular" width={80} height={24} />
                      <Skeleton variant="rectangular" width={80} height={24} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : campaigns.map((campaign) => (
              <Grid item xs={12} md={6} key={campaign.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {campaign.name}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(campaign.status).main}15`,
                            color: getStatusColor(campaign.status).main,
                            fontWeight: 500,
                          }}
                        />

                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, campaign.id)}
                        >
                          <MoreVertical size={16} />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {campaign.description}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Users size={16} />
                          <Typography variant="body2">
                            {campaign.leads.length} Leads
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Calendar size={16} />
                          <Typography variant="body2">
                            {new Date(campaign.startDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Mail size={16} />
                          <Typography variant="body2">
                            {campaign.metrics.sent} Sent
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BarChart2 size={16} />
                          <Typography variant="body2">
                            {((campaign.metrics.converted / campaign.metrics.sent) * 100).toFixed(1)}% Conv.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          component={RouterLink}
          to={`/campaigns/${selectedCampaign}`}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <Edit size={18} />
          </ListItemIcon>
          Edit
        </MenuItem>

        <MenuItem onClick={handlePauseCampaign}>
          <ListItemIcon>
            {campaigns.find((c) => c.id === selectedCampaign)?.status === 'active' ? (
              <Pause size={18} />
            ) : (
              <Play size={18} />
            )}
          </ListItemIcon>
          {campaigns.find((c) => c.id === selectedCampaign)?.status === 'active'
            ? 'Pause'
            : 'Resume'}
        </MenuItem>

        <MenuItem onClick={handleDeleteCampaign} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <Trash2 size={18} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Campaigns;