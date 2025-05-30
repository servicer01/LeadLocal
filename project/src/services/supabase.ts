import { createClient } from '@supabase/supabase-js';
import { Lead, Template, Campaign } from '../types';

// Initialize Supabase client (using placeholder values)
// In a real app, these would be environment variables
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication services
export const authService = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
  },
  getCurrentUser: async () => {
    return await supabase.auth.getUser();
  },
  getSession: async () => {
    return await supabase.auth.getSession();
  },
};

// Leads services
export const leadService = {
  getLeads: async (): Promise<Lead[]> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  getLeadById: async (id: string): Promise<Lead | null> => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  createLead: async (lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> => {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  updateLead: async (id: string, updates: Partial<Lead>): Promise<Lead> => {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  deleteLead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  
  importLeads: async (leads: Omit<Lead, 'id' | 'created_at'>[]): Promise<void> => {
    const { error } = await supabase
      .from('leads')
      .insert(leads);
    
    if (error) throw error;
  }
};

// Templates services
export const templateService = {
  getTemplates: async (): Promise<Template[]> => {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  getTemplateById: async (id: string): Promise<Template | null> => {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  createTemplate: async (template: Omit<Template, 'id' | 'created_at'>): Promise<Template> => {
    const { data, error } = await supabase
      .from('templates')
      .insert(template)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  updateTemplate: async (id: string, updates: Partial<Template>): Promise<Template> => {
    const { data, error } = await supabase
      .from('templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  deleteTemplate: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Campaigns services
export const campaignService = {
  getCampaigns: async (): Promise<Campaign[]> => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  getCampaignById: async (id: string): Promise<Campaign | null> => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  createCampaign: async (campaign: Omit<Campaign, 'id' | 'created_at'>): Promise<Campaign> => {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  updateCampaign: async (id: string, updates: Partial<Campaign>): Promise<Campaign> => {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  deleteCampaign: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};