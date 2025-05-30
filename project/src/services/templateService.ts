import { Template } from '../types';

// Predefined templates
const predefinedTemplates: Template[] = [
  {
    id: 'problem-solution-appointment',
    name: 'Problem/Solution - Appointment Request',
    description: 'Template for getting a meeting with a decision-maker',
    industry: 'All',
    type: 'email',
    content: `Subject: Streamline Your {{business_industry}} Operations with AI-Powered Solutions

Hi {{decision_maker}},

I came across {{business_name}} while researching businesses in the {{city}} area, and I noticed you're in the {{business_industry}} sector. I understand that many {{business_industry}} companies are looking for ways to improve efficiency and reduce costs.

At [Your Company], we specialize in AI-powered solutions that can help you:

* Automate repetitive tasks
* Improve customer service
* Optimize your {{business_industry}} processes

I'd love to schedule a brief 15-minute call to discuss how our solutions can specifically benefit {{business_name}}. Are you available on [Date] or [Date]?

Best regards,

[Your Name]`,
    variables: [
      { name: 'business_industry', description: 'Industry of the business', required: true },
      { name: 'decision_maker', description: 'Name of the decision maker', required: true },
      { name: 'business_name', description: 'Name of the business', required: true },
      { name: 'city', description: 'City where the business is located', required: true }
    ],
    tags: ['appointment', 'problem-solution', 'general'],
    isActive: true,
    author: 'System',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'value-proposition-direct',
    name: 'Value Proposition - Direct Offer',
    description: 'Template for directly offering a service or product',
    industry: 'All',
    type: 'email',
    content: `Subject: Boost Your Local Presence with Targeted Marketing Campaigns

Hello {{decision_maker}},

I'm reaching out from [Your Company]. We help businesses like {{business_name}} in the {{city}} area achieve significant growth through targeted marketing campaigns.

We've identified that many companies in the {{business_industry}} sector are missing out on valuable local customers. Our services can help you:

* Reach your ideal audience with pinpoint accuracy
* Increase brand awareness in your target area
* Drive more traffic to your website and physical location

Would you be interested in learning more about how we can help {{business_name}} dominate the local market?

Sincerely,

[Your Name]`,
    variables: [
      { name: 'decision_maker', description: 'Name of the decision maker', required: true },
      { name: 'business_name', description: 'Name of the business', required: true },
      { name: 'city', description: 'City where the business is located', required: true },
      { name: 'business_industry', description: 'Industry of the business', required: true }
    ],
    tags: ['value-proposition', 'marketing', 'direct-offer'],
    isActive: true,
    author: 'System',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'direct-engaging-call',
    name: 'Direct & Engaging Call Script',
    description: 'Script for quickly qualifying a lead and booking a follow-up',
    industry: 'All',
    type: 'call-script',
    content: `[Your Name]: Hi, is this {{decision_maker}}?

[Prospect]: Yes, speaking.

[Your Name]: Hi {{decision_maker}}, my name is [Your Name] from [Your Company]. We specialize in [Your Service] for businesses in the {{business_industry}} sector in the {{city}} area.

I was doing some research on {{business_name}} and noticed [mention something specific, e.g., "you recently expanded your services" or "you have a strong online presence"].

We've helped similar companies like yours [mention a benefit, e.g., "increase leads by 30%" or "reduce operational costs"].

Would you have 10 minutes this week for a quick chat to see if we might be a good fit?`,
    variables: [
      { name: 'decision_maker', description: 'Name of the decision maker', required: true },
      { name: 'business_industry', description: 'Industry of the business', required: true },
      { name: 'city', description: 'City where the business is located', required: true },
      { name: 'business_name', description: 'Name of the business', required: true }
    ],
    tags: ['call-script', 'direct', 'qualifying'],
    isActive: true,
    author: 'System',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  },
  {
    id: 'problem-focused-call',
    name: 'Problem-Focused & Solution-Oriented Call Script',
    description: 'Script for establishing rapport and positioning as a solution provider',
    industry: 'All',
    type: 'call-script',
    content: `[Your Name]: Hi {{decision_maker}}, this is [Your Name] calling from [Your Company]. How are you doing today?

[Prospect]: I'm good, thanks.

[Your Name]: Great. I'm reaching out because we work with businesses in the {{business_industry}} sector, and we often see they struggle with [mention a common pain point, e.g., "managing inventory" or "attracting new customers"].

Have you experienced anything like that at {{business_name}}?

[Listen to their response]

[Your Name]: We've helped companies like yours overcome those challenges by [mention a specific solution and benefit, e.g., "implementing AI-powered automation that saves them time and money"].

Would you be open to a brief conversation to explore how we can do the same for {{business_name}}?`,
    variables: [
      { name: 'decision_maker', description: 'Name of the decision maker', required: true },
      { name: 'business_industry', description: 'Industry of the business', required: true },
      { name: 'business_name', description: 'Name of the business', required: true }
    ],
    tags: ['call-script', 'problem-focused', 'solution-oriented'],
    isActive: true,
    author: 'System',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1
  }
];

export const templateService = {
  // Get all predefined templates
  getPredefinedTemplates: (): Template[] => {
    return predefinedTemplates;
  },

  // Get a specific predefined template by ID
  getPredefinedTemplate: (id: string): Template | undefined => {
    return predefinedTemplates.find(template => template.id === id);
  },

  // Populate template variables with actual values
  populateTemplate: (template: Template, variables: Record<string, string>): string => {
    let populatedContent = template.content;
    
    // Replace all variables in the content
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      populatedContent = populatedContent.replace(regex, value);
    }
    
    return populatedContent;
  }
};