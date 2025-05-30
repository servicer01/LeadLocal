// User related types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
  created_at: string;
}

// Lead related types
export interface Lead {
  id: string;
  companyName: string;
  industry: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  location: string;
  website: string;
  revenue?: string;
  employeeCount?: number;
  contacts: Contact[];
  tags: string[];
  status: 'new' | 'contacted' | 'engaged' | 'qualified' | 'converted' | 'archived';
  score?: number;
  notes?: string;
  assignedTo?: string;
  created_at: string;
  updated_at?: string;
  lastContact?: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  linkedIn?: string;
  isPrimary: boolean;
  created_at: string;
}

// Template related types
export interface Template {
  id: string;
  name: string;
  description: string;
  industry: string;
  type: 'email' | 'linkedin' | 'sms' | 'call-script';
  content: string;
  variables: TemplateVariable[];
  tags: string[];
  isActive: boolean;
  author: string;
  created_at: string;
  updated_at: string;
  version: number;
  abTestVariants?: TemplateVariant[];
}

export interface TemplateVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required: boolean;
}

export interface TemplateVariant {
  id: string;
  name: string;
  content: string;
  performanceMetrics?: {
    opens?: number;
    clicks?: number;
    replies?: number;
    conversions?: number;
  };
}

// Campaign related types
export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  templateId: string;
  leads: string[]; // IDs of the leads in the campaign
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    replied: number;
    converted: number;
    unsubscribed: number;
    bounced: number;
  };
  tags: string[];
  created_at: string;
  updated_at: string;
  createdBy: string;
  isAutomated: boolean;
  schedule?: CampaignSchedule;
  abTestingEnabled: boolean;
}

export interface CampaignSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  days?: number[]; // 0-6 for days of week
  times?: string[]; // Times in 24h format
  maxPerDay?: number;
}

// Analytics related types
export interface AnalyticsData {
  campaignPerformance: {
    campaigns: string[];
    metrics: {
      sent: number[];
      opened: number[];
      clicked: number[];
      converted: number[];
    };
  };
  leadAcquisition: {
    periods: string[];
    counts: number[];
  };
  conversionRates: {
    stages: string[];
    rates: number[];
  };
  engagementByIndustry: {
    industries: string[];
    engagement: number[];
  };
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
}