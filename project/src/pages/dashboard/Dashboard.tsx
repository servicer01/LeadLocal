import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Link,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Avatar,
  AvatarGroup,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  BarChart3,
  Users,
  Mail,
  Zap,
  FileText,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  RefreshCcw,
  MoreVertical,
  Inbox,
  Send,
  BadgeCheck,
  BarChart2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Lead, Campaign } from '../../types';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

// Mock data
const mockLeads: Lead[] = [
  {
    id: '1',
    companyName: 'TechNova Solutions',
    industry: 'Technology',
    size: 'medium',
    location: 'San Francisco, CA',
    website: 'technova.com',
    contacts: [
      {
        id: '1',
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex@technova.com',
        position: 'CTO',
        isPrimary: true,
        created_at: '2023-01-15T00:00:00Z',
      },
    ],
    tags: ['hot lead', 'enterprise'],
    status: 'qualified',
    score: 85,
    created_at: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    companyName: 'Green Earth Sustainability',
    industry: 'Environmental',
    size: 'small',
    location: 'Portland, OR',
    website: 'greenearth.org',
    contacts: [
      {
        id: '2',
        firstName: 'Jamie',
        lastName: 'Lewis',
        email: 'jamie@greenearth.org',
        position: 'Founder',
        isPrimary: true,
        created_at: '2023-02-20T00:00:00Z',
      },
    ],
    tags: ['interested', 'startup'],
    status: 'contacted',
    score: 65,
    created_at: '2023-02-20T00:00:00Z',
  },
  {
    id: '3',
    companyName: 'Global Finance Partners',
    industry: 'Finance',
    size: 'large',
    location: 'New York, NY',
    website: 'gfp.com',
    contacts: [
      {
        id: '3',
        firstName: 'Taylor',
        lastName: 'Rodriguez',
        email: 'taylor@gfp.com',
        position: 'VP Sales',
        isPrimary: true,
        created_at: '2023-03-10T00:00:00Z',
      },
    ],
    tags: ['high-value', 'finance'],
    status: 'engaged',
    score: 75,
    created_at: '2023-03-10T00:00:00Z',
  },
  {
    id: '4',
    companyName: 'Bright Health Medical',
    industry: 'Healthcare',
    size: 'enterprise',
    location: 'Boston, MA',
    website: 'brighthealth.com',
    contacts: [
      {
        id: '4',
        firstName: 'Jordan',
        lastName: 'Kim',
        email: 'jordan@brighthealth.com',
        position: 'Operations Director',
        isPrimary: true,
        created_at: '2023-04-05T00:00:00Z',
      },
    ],
    tags: ['healthcare', 'enterprise'],
    status: 'new',
    score: 55,
    created_at: '2023-04-05T00:00:00Z',
  },
];

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
  {
    id: '3',
    name: 'Financial Services Follow-up',
    description: 'Follow-up campaign for financial leads',
    startDate: '2023-05-15T00:00:00Z',
    status: 'scheduled',
    templateId: '3',
    leads: ['3'],
    metrics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      converted: 0,
      unsubscribed: 0,
      bounced: 0,
    },
    tags: ['finance', 'follow-up'],
    created_at: '2023-05-01T00:00:00Z',
    updated_at: '2023-05-10T00:00:00Z',
    createdBy: 'user2',
    isAutomated: false,
    abTestingEnabled: true,
  },
];

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setLoading(true);
      // In a real app, we would fetch data from API
      setTimeout(() => {
        setLeads(mockLeads);
        setCampaigns(mockCampaigns);
        setLoading(false);
        
        // Show welcome notification
        if (user) {
          addNotification({
            type: 'info',
            message: `Welcome back, ${user.firstName || user.email.split('@')[0]}!`,
          });
        }
      }, 1000);
    };
    
    loadData();
  }, [user, addNotification]);

  // Chart options for Lead Conversion
  const leadConversionOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
    },
    colors: [theme.palette.primary.main],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  // Campaign performance chart options
  const campaignPerformanceOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4,
      },
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Tech Outreach', 'Healthcare', 'Finance'],
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      title: {
        text: 'Percentage',
        style: {
          color: theme.palette.text.secondary,
        },
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + '%';
        },
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: theme.palette.text.primary,
      },
    },
  };
  
  // Stats for summary cards
  const stats = [
    {
      title: 'Total Leads',
      value: loading ? '-' : '485',
      change: '+12%',
      positive: true,
      icon: <Users size={24} />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Active Campaigns',
      value: loading ? '-' : '9',
      change: '+3',
      positive: true,
      icon: <Mail size={24} />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Conversion Rate',
      value: loading ? '-' : '8.2%',
      change: '+1.1%',
      positive: true,
      icon: <Zap size={24} />,
      color: theme.palette.success.main,
    },
    {
      title: 'Templates',
      value: loading ? '-' : '24',
      change: '+2',
      positive: true,
      icon: <FileText size={24} />,
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'User'}! Here's what's happening with your leads.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCcw size={18} />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            component={RouterLink}
            to="/campaigns/new"
            startIcon={<Mail size={18} />}
          >
            New Campaign
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}15`,
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  
                  <Typography
                    variant="body2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: stat.positive ? 'success.main' : 'error.main',
                      fontWeight: 500,
                    }}
                  >
                    {stat.change} <ArrowUpRight size={16} style={{ marginLeft: 4 }} />
                  </Typography>
                </Box>
                
                <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                  {loading ? <Skeleton width={60} /> : stat.value}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Lead Conversion Trends
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly progress
                  </Typography>
                </Box>
                
                <Box>
                  <Button
                    variant="text"
                    endIcon={<ArrowRight size={16} />}
                    component={RouterLink}
                    to="/analytics"
                  >
                    View Details
                  </Button>
                </Box>
              </Box>
              
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <Chart
                  options={leadConversionOptions}
                  series={[
                    {
                      name: 'Conversion Rate',
                      data: [4.5, 5.2, 5.8, 6.3, 7.1, 7.8, 8.2],
                    },
                  ]}
                  type="area"
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Campaign Performance
                </Typography>
                
                <IconButton size="small">
                  <MoreVertical size={16} />
                </IconButton>
              </Box>
              
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <Chart
                  options={campaignPerformanceOptions}
                  series={[
                    {
                      name: 'Open Rate',
                      data: [65, 67, 61],
                    },
                    {
                      name: 'Click Rate',
                      data: [30, 34, 28],
                    },
                    {
                      name: 'Response Rate',
                      data: [15, 18, 12],
                    },
                  ]}
                  type="bar"
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Leads
                </Typography>
                
                <Button
                  variant="text"
                  endIcon={<ArrowRight size={16} />}
                  component={RouterLink}
                  to="/leads"
                >
                  View All
                </Button>
              </Box>
              
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Skeleton variant="text" height={30} />
                    <Skeleton variant="text" height={20} width="60%" />
                  </Box>
                ))
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Company</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                bgcolor: `${theme.palette.primary.main}20`,
                                color: theme.palette.primary.main,
                                width: 36,
                                height: 36,
                                mr: 2,
                              }}
                            >
                              {lead.companyName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {lead.companyName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {lead.industry}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                            size="small"
                            sx={{
                              backgroundColor: 
                                lead.status === 'new' ? `${theme.palette.info.main}15` :
                                lead.status === 'contacted' ? `${theme.palette.warning.main}15` :
                                lead.status === 'qualified' ? `${theme.palette.success.main}15` :
                                lead.status === 'converted' ? `${theme.palette.primary.main}15` :
                                `${theme.palette.secondary.main}15`,
                              color:
                                lead.status === 'new' ? theme.palette.info.main :
                                lead.status === 'contacted' ? theme.palette.warning.main :
                                lead.status === 'qualified' ? theme.palette.success.main :
                                lead.status === 'converted' ? theme.palette.primary.main :
                                theme.palette.secondary.main,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{
                              color:
                                (lead.score || 0) >= 80 ? theme.palette.success.main :
                                (lead.score || 0) >= 60 ? theme.palette.warning.main :
                                theme.palette.error.main,
                            }}
                          >
                            {lead.score || 0}%
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="text"
                            size="small"
                            component={RouterLink}
                            to={`/leads/${lead.id}`}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Active Campaigns
                </Typography>
                
                <Button
                  variant="text"
                  endIcon={<ArrowRight size={16} />}
                  component={RouterLink}
                  to="/campaigns"
                >
                  View All
                </Button>
              </Box>
              
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <Box key={i} sx={{ mb: 3, p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                    <Skeleton variant="text" height={30} />
                    <Skeleton variant="text" height={20} width="80%" />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Skeleton variant="text" width={100} />
                      <Skeleton variant="text" width={80} />
                    </Box>
                  </Box>
                ))
              ) : (
                campaigns.map((campaign) => (
                  <Box
                    key={campaign.id}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.01)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {campaign.name}
                      </Typography>
                      
                      <Chip
                        size="small"
                        label={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        sx={{
                          backgroundColor:
                            campaign.status === 'active' ? `${theme.palette.success.main}15` :
                            campaign.status === 'scheduled' ? `${theme.palette.warning.main}15` :
                            campaign.status === 'completed' ? `${theme.palette.primary.main}15` :
                            campaign.status === 'paused' ? `${theme.palette.error.main}15` :
                            `${theme.palette.secondary.main}15`,
                          color:
                            campaign.status === 'active' ? theme.palette.success.main :
                            campaign.status === 'scheduled' ? theme.palette.warning.main :
                            campaign.status === 'completed' ? theme.palette.primary.main :
                            campaign.status === 'paused' ? theme.palette.error.main :
                            theme.palette.secondary.main,
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {campaign.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarClock size={16} style={{ marginRight: 6, color: theme.palette.text.secondary }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(campaign.startDate).toLocaleDateString()}
                          {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Inbox size={16} style={{ marginRight: 4, color: theme.palette.primary.main }} />
                          <Typography variant="caption" fontWeight={500}>
                            {campaign.metrics.sent}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Send size={16} style={{ marginRight: 4, color: theme.palette.info.main }} />
                          <Typography variant="caption" fontWeight={500}>
                            {campaign.metrics.opened}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BadgeCheck size={16} style={{ marginRight: 4, color: theme.palette.success.main }} />
                          <Typography variant="caption" fontWeight={500}>
                            {campaign.metrics.converted}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;