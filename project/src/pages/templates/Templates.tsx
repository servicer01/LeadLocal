import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Divider,
  Skeleton,
} from '@mui/material';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Copy,
  Trash2,
  Edit3,
} from 'lucide-react';
import { Template } from '../../types';
import { useNotification } from '../../context/NotificationContext';

const Templates = () => {
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // Simulate loading templates
    const loadTemplates = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const mockTemplates: Template[] = [
            {
              id: '1',
              name: 'Tech Startup Introduction',
              description: 'Initial outreach template for technology startups',
              industry: 'Technology',
              type: 'email',
              content: 'Hi {{firstName}},\n\nI noticed {{companyName}} is making waves in {{industry}}...',
              variables: [
                { name: 'firstName', description: 'Contact\'s first name', required: true },
                { name: 'companyName', description: 'Company name', required: true },
                { name: 'industry', description: 'Company industry', required: true },
              ],
              tags: ['tech', 'startup', 'introduction'],
              isActive: true,
              author: 'John Doe',
              created_at: '2023-01-15T00:00:00Z',
              updated_at: '2023-01-15T00:00:00Z',
              version: 1,
            },
            {
              id: '2',
              name: 'Healthcare Follow-up',
              description: 'Follow-up template for healthcare providers',
              industry: 'Healthcare',
              type: 'email',
              content: 'Hello {{firstName}},\n\nThank you for your interest in our healthcare solutions...',
              variables: [
                { name: 'firstName', description: 'Contact\'s first name', required: true },
                { name: 'previousMeeting', description: 'Date of last meeting', required: false },
              ],
              tags: ['healthcare', 'follow-up'],
              isActive: true,
              author: 'Jane Smith',
              created_at: '2023-02-20T00:00:00Z',
              updated_at: '2023-02-20T00:00:00Z',
              version: 1,
            },
            {
              id: '3',
              name: 'Financial Services Pitch',
              description: 'Sales pitch for financial service providers',
              industry: 'Finance',
              type: 'email',
              content: 'Dear {{firstName}},\n\nI wanted to discuss how {{companyName}} can optimize...',
              variables: [
                { name: 'firstName', description: 'Contact\'s first name', required: true },
                { name: 'companyName', description: 'Company name', required: true },
              ],
              tags: ['finance', 'sales', 'pitch'],
              isActive: true,
              author: 'Mike Johnson',
              created_at: '2023-03-10T00:00:00Z',
              updated_at: '2023-03-10T00:00:00Z',
              version: 1,
            },
          ];
          setTemplates(mockTemplates);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading templates:', error);
        addNotification({
          type: 'error',
          message: 'Failed to load templates',
        });
      }
    };

    loadTemplates();
  }, [addNotification]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, templateId: string) => {
    event.stopPropagation();
    setSelectedTemplate(templateId);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTemplate(null);
  };

  const handleDuplicate = () => {
    addNotification({
      type: 'success',
      message: 'Template duplicated successfully',
    });
    handleMenuClose();
  };

  const handleDelete = () => {
    addNotification({
      type: 'success',
      message: 'Template deleted successfully',
    });
    handleMenuClose();
  };

  const getTemplateTypeIcon = (type: Template['type']) => {
    switch (type) {
      case 'email':
        return <Mail size={20} />;
      case 'linkedin':
        return <MessageSquare size={20} />;
      case 'call-script':
        return <Phone size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Templates
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and customize your outreach templates
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          component={RouterLink}
          to="/templates/new"
        >
          New Template
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Filter size={18} />}
                onClick={handleFilterClick}
                sx={{ mr: 1 }}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Skeleton variant="rectangular" width={60} height={24} />
                      <Skeleton variant="rectangular" width={60} height={24} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : templates.map((template) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
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
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'primary.light',
                            color: 'white',
                            mr: 2,
                          }}
                        >
                          {getTemplateTypeIcon(template.type)}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {template.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {template.industry}
                          </Typography>
                        </Box>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, template.id)}
                      >
                        <MoreVertical size={18} />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {template.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {template.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: 'primary.light',
                            color: 'white',
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Last updated:{' '}
                        {new Date(template.updated_at).toLocaleDateString()}
                      </Typography>
                      <Button
                        variant="text"
                        size="small"
                        component={RouterLink}
                        to={`/templates/edit/${template.id}`}
                      >
                        Edit
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={handleFilterClose}>All Templates</MenuItem>
        <MenuItem onClick={handleFilterClose}>Email Templates</MenuItem>
        <MenuItem onClick={handleFilterClose}>LinkedIn Templates</MenuItem>
        <MenuItem onClick={handleFilterClose}>Call Scripts</MenuItem>
        <Divider />
        <MenuItem onClick={handleFilterClose}>Active</MenuItem>
        <MenuItem onClick={handleFilterClose}>Archived</MenuItem>
      </Menu>

      {/* Template Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          component={RouterLink}
          to={`/templates/edit/${selectedTemplate}`}
          onClick={handleMenuClose}
        >
          <Edit3 size={18} style={{ marginRight: 8 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <Copy size={18} style={{ marginRight: 8 }} />
          Duplicate
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Trash2 size={18} style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Templates;