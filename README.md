# GeoQualified
# GeoQualified: Complete Technical Implementation Plan
## Bolt Hackathon Winner Strategy
### Project Update###
Initial project build out completed 29 May 2025 @ 20:32:00
## Update##
Rename to GeoQualified 00:45:00 💯
### Project Overview
**Name:** GeoQualified 
**Tagline:** "Find Your Next Client Next Door"  
**Problem:** AI consultants spend 60% of time researching local prospects instead of solving problems  
**Solution:** Instant local lead generation with AI-powered qualification and export tools

---

## Week 1 (May 30 - June 5): Foundation & Core MVP

### Day 1: Project Setup & Basic UI
```typescript
// Start in Bolt.new with this prompt:
"Create a React TypeScript app called LeadLocal for local business lead generation. 
Include: location input (ZIP code + Find Me GPS button), business type selector dropdown, 
search radius slider (5-50 miles), and a clean professional design with Tailwind CSS."
```

**Core Components to Build:**
```typescript
// LocationInput.tsx
interface LocationInputProps {
  onLocationChange: (location: string) => void;
  onGPSLocation: (coords: {lat: number, lng: number}) => void;
}

// BusinessTypeSelector.tsx
const BUSINESS_TYPES = [
  { value: 'manufacturing', label: 'Manufacturing', naics: '31-33' },
  { value: 'professional', label: 'Professional Services', naics: '54' },
  { value: 'healthcare', label: 'Healthcare', naics: '62' },
  { value: 'retail', label: 'Retail Trade', naics: '44-45' },
  { value: 'construction', label: 'Construction', naics: '23' },
  { value: 'finance', label: 'Finance & Insurance', naics: '52' },
  { value: 'realestate', label: 'Real Estate', naics: '53' },
  { value: 'technology', label: 'Technology', naics: '51' }
];

// SearchRadius.tsx
// Slider component for 5, 10, 25, 50+ mile radius

// ResultsGrid.tsx
interface BusinessLead {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  industry: string;
  employeeCount?: string;
  revenue?: string;
  aiReadinessScore?: number;
}
```

### Day 2: Data Integration Architecture
```typescript
// api/businessSearch.ts
class BusinessSearchAPI {
  async searchByLocation(params: {
    zipCode?: string;
    coordinates?: {lat: number, lng: number};
    radius: number;
    businessTypes: string[];
    limit?: number;
  }) {
    // Combine multiple free APIs
    const results = await Promise.all([
      this.searchGooglePlaces(params),
      this.searchCensusData(params),
      this.searchYelpFusion(params)
    ]);
    
    return this.mergeAndDeduplicate(results);
  }

  private async searchGooglePlaces(params) {
    // Google Places API integration
    const query = this.buildPlacesQuery(params);
    const response = await fetch(`/api/google-places?${query}`);
    return response.json();
  }

  private async searchCensusData(params) {
    // US Census Bureau Business Patterns API
    const response = await fetch(
      `https://api.census.gov/data/2021/cbp?get=NAICS2017_LABEL,EMP,ESTAB&for=zip%20code:${params.zipCode}&NAICS2017=${params.naicsCode}`
    );
    return response.json();
  }

  private async searchYelpFusion(params) {
    // Yelp Fusion API for additional business data
    const response = await fetch('/api/yelp-search', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    return response.json();
  }
}
```

### Day 3: Backend API Setup
```typescript
// pages/api/business-search.ts (Next.js API route)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { zipCode, radius, businessTypes, coordinates } = req.body;
    
    const searchAPI = new BusinessSearchAPI();
    const results = await searchAPI.searchByLocation({
      zipCode,
      coordinates,
      radius,
      businessTypes,
      limit: 50
    });

    // Add AI scoring
    const scoredResults = await addAIReadinessScores(results);
    
    res.status(200).json({
      success: true,
      data: scoredResults,
      count: scoredResults.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// AI Readiness Scoring Function
async function addAIReadinessScores(businesses: BusinessLead[]) {
  return businesses.map(business => ({
    ...business,
    aiReadinessScore: calculateAIReadiness(business),
    aiOpportunities: identifyAIOpportunities(business)
  }));
}

function calculateAIReadiness(business: BusinessLead): number {
  let score = 0;
  
  // Website quality (0-30 points)
  if (business.website) score += 20;
  if (business.website?.includes('shopify') || business.website?.includes('wordpress')) score += 10;
  
  // Employee count (0-25 points)
  const empCount = parseInt(business.employeeCount || '0');
  if (empCount > 10) score += 15;
  if (empCount > 50) score += 10;
  
  // Industry AI readiness (0-25 points)
  const aiReadyIndustries = ['manufacturing', 'professional', 'healthcare', 'retail'];
  if (aiReadyIndustries.includes(business.industry)) score += 25;
  
  // Online presence (0-20 points)
  if (business.socialMedia?.length > 0) score += 10;
  if (business.reviews && business.reviews > 20) score += 10;
  
  return Math.min(score, 100);
}
```

### Day 4-5: Core Search Functionality
```typescript
// hooks/useBusinessSearch.ts
export function useBusinessSearch() {
  const [results, setResults] = useState<BusinessLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/business-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}

// Main Search Component
export default function SearchPage() {
  const { results, loading, error, search } = useBusinessSearch();
  const [searchParams, setSearchParams] = useState({
    zipCode: '',
    radius: 25,
    businessTypes: [],
    coordinates: null
  });

  const handleSearch = () => {
    if (!searchParams.zipCode && !searchParams.coordinates) {
      alert('Please enter a ZIP code or use Find Me');
      return;
    }
    search(searchParams);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">LeadLocal</h1>
        <p className="text-xl text-gray-600">Find Your Next Client Next Door</p>
        <div className="mt-4 text-sm text-blue-600 bg-blue-50 p-2 rounded">
          Built with Bolt.new 🚀
        </div>
      </header>

      <SearchForm 
        params={searchParams}
        onChange={setSearchParams}
        onSearch={handleSearch}
        loading={loading}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <ResultsSection 
          results={results}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
```

---

## Week 2 (June 6-12): Enhanced Features & AI Integration

### Day 6-7: AI-Powered Lead Qualification
```typescript
// ai/leadQualification.ts
interface AIInsights {
  readinessScore: number;
  opportunities: string[];
  talkingPoints: string[];
  competitorAnalysis: string[];
  recommendedSolutions: string[];
}

export async function generateAIInsights(business: BusinessLead): Promise<AIInsights> {
  const prompt = `
    Analyze this business for AI solution opportunities:
    Name: ${business.name}
    Industry: ${business.industry}
    Size: ${business.employeeCount} employees
    Website: ${business.website}
    
    Provide:
    1. AI readiness score (0-100)
    2. Top 3 AI opportunities for this business
    3. Conversation starters for cold outreach
    4. Likely competitors already using AI
    5. Recommended AI solutions to pitch
  `;

  // Use OpenAI API or similar
  const response = await fetch('/api/ai-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, business })
  });

  return response.json();
}

// Enhanced business card component
function BusinessCard({ business }: { business: BusinessLead }) {
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const loadAIInsights = async () => {
    const insights = await generateAIInsights(business);
    setAiInsights(insights);
    setShowDetails(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{business.name}</h3>
          <p className="text-gray-600">{business.industry}</p>
          <p className="text-sm text-gray-500">{business.address}</p>
        </div>
        <div className="text-right">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            AI Score: {business.aiReadinessScore}/100
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Employees:</span>
          <span className="ml-2 font-medium">{business.employeeCount || 'Unknown'}</span>
        </div>
        <div>
          <span className="text-gray-500">Phone:</span>
          <span className="ml-2 font-medium">{business.phone || 'N/A'}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {business.website && (
          <a href={business.website} target="_blank" 
             className="text-blue-600 hover:text-blue-800 text-sm">
            Visit Website
          </a>
        )}
        <button 
          onClick={loadAIInsights}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          🤖 AI Analysis
        </button>
      </div>

      {showDetails && aiInsights && (
        <AIInsightsPanel insights={aiInsights} business={business} />
      )}
    </div>
  );
}
```

### Day 8-9: Export & Integration Features
```typescript
// export/exportManager.ts
export class ExportManager {
  static async exportToCSV(businesses: BusinessLead[]): Promise<string> {
    const headers = [
      'Business Name', 'Industry', 'Address', 'Phone', 'Website',
      'Employee Count', 'AI Readiness Score', 'Top AI Opportunity',
      'Recommended Approach', 'Contact Strategy'
    ];

    const rows = businesses.map(business => [
      business.name,
      business.industry,
      business.address,
      business.phone || '',
      business.website || '',
      business.employeeCount || '',
      business.aiReadinessScore || '',
      business.aiOpportunities?.[0] || '',
      business.recommendedSolutions?.[0] || '',
      business.talkingPoints?.[0] || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  }

  static async exportToPDF(businesses: BusinessLead[]): Promise<Blob> {
    // Use jsPDF or similar library
    const pdf = new jsPDF();
    
    pdf.setFontSize(20);
    pdf.text('LeadLocal - Prospect Report', 20, 30);
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
    pdf.text(`Total Prospects: ${businesses.length}`, 20, 55);

    let yPosition = 70;
    
    businesses.forEach((business, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 30;
      }

      pdf.setFontSize(14);
      pdf.text(`${index + 1}. ${business.name}`, 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.text(`Industry: ${business.industry}`, 25, yPosition);
      yPosition += 7;
      pdf.text(`AI Score: ${business.aiReadinessScore}/100`, 25, yPosition);
      yPosition += 7;
      pdf.text(`Address: ${business.address}`, 25, yPosition);
      yPosition += 7;
      
      if (business.aiOpportunities?.[0]) {
        pdf.text(`Opportunity: ${business.aiOpportunities[0]}`, 25, yPosition);
        yPosition += 7;
      }
      
      yPosition += 5; // Space between entries
    });

    return pdf.output('blob');
  }

  static async exportToHubSpot(businesses: BusinessLead[]): Promise<void> {
    // Format for HubSpot CRM import
    const hubspotFormat = businesses.map(business => ({
      'Company name': business.name,
      'Company domain name': business.website?.replace('https://', '').replace('http://', ''),
      'Phone number': business.phone,
      'Address': business.address,
      'Industry': business.industry,
      'Number of employees': business.employeeCount,
      'AI Readiness Score': business.aiReadinessScore,
      'Lead Source': 'LeadLocal',
      'Notes': business.aiOpportunities?.join('; ') || ''
    }));

    const csvContent = this.convertToCSV(hubspotFormat);
    this.downloadFile(csvContent, 'leadlocal-hubspot-import.csv', 'text/csv');
  }
}

// Export component
function ExportPanel({ businesses }: { businesses: BusinessLead[] }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf' | 'hubspot' | 'salesforce') => {
    setExporting(true);
    
    try {
      switch (format) {
        case 'csv':
          const csv = await ExportManager.exportToCSV(businesses);
          downloadFile(csv, 'leadlocal-prospects.csv', 'text/csv');
          break;
        case 'pdf':
          const pdf = await ExportManager.exportToPDF(businesses);
          downloadFile(pdf, 'leadlocal-report.pdf', 'application/pdf');
          break;
        case 'hubspot':
          await ExportManager.exportToHubSpot(businesses);
          break;
      }
    } catch (error) {
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Export {businesses.length} Prospects</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button 
          onClick={() => handleExport('csv')}
          disabled={exporting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          📊 CSV Export
        </button>
        <button 
          onClick={() => handleExport('pdf')}
          disabled={exporting}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          📄 PDF Report
        </button>
        <button 
          onClick={() => handleExport('hubspot')}
          disabled={exporting}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          🧡 HubSpot
        </button>
        <button 
          onClick={() => handleExport('salesforce')}
          disabled={exporting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:blue-orange-700 disabled:opacity-50"
        >
          ☁️ Salesforce
        </button>
      </div>
    </div>
  );
}
```

### Day 10-12: Advanced Features
```typescript
// Cold outreach email generator
function EmailGenerator({ business }: { business: BusinessLead }) {
  const [emailTemplate, setEmailTemplate] = useState('');
  const [customizing, setCustomizing] = useState(false);

  const generateEmail = async () => {
    setCustomizing(true);
    
    const prompt = `
      Generate a personalized cold email for AI solutions outreach:
      
      Business: ${business.name}
      Industry: ${business.industry}
      Size: ${business.employeeCount} employees
      AI Readiness: ${business.aiReadinessScore}/100
      
      Requirements:
      - Professional but friendly tone
      - Mention specific AI opportunity for their industry
      - Include a soft CTA for a brief call
      - Keep under 150 words
      - Reference local connection (same area)
    `;

    const response = await fetch('/api/generate-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const { email } = await response.json();
    setEmailTemplate(email);
    setCustomizing(false);
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-blue-900">Cold Outreach Email</h4>
        <button 
          onClick={generateEmail}
          disabled={customizing}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          {customizing ? 'Generating...' : '🤖 Generate Email'}
        </button>
      </div>
      
      {emailTemplate && (
        <textarea 
          value={emailTemplate}
          onChange={(e) => setEmailTemplate(e.target.value)}
          className="w-full h-32 p-3 border rounded-lg text-sm"
          placeholder="Email template will appear here..."
        />
      )}
      
      {emailTemplate && (
        <div className="mt-3 flex gap-2">
          <button 
            onClick={() => navigator.clipboard.writeText(emailTemplate)}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            📋 Copy Email
          </button>
          <button 
            onClick={() => window.open(`mailto:?subject=AI Solutions for ${business.name}&body=${encodeURIComponent(emailTemplate)}`)}
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
          >
            📧 Open in Email
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Week 3 (June 13-19): Polish & Advanced Features

### Day 13-14: UI/UX Polish
```typescript
// Advanced search filters
function AdvancedFilters({ filters, onChange }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Size
          </label>
          <select 
            value={filters.employeeRange}
            onChange={(e) => onChange({...filters, employeeRange: e.target.value})}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Any Size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="200+">200+ employees</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Readiness Score
          </label>
          <div className="flex items-center space-x-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={filters.minAiScore}
              onChange={(e) => onChange({...filters, minAiScore: e.target.value})}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12">{filters.minAiScore}+</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Has Website
          </label>
          <input 
            type="checkbox"
            checked={filters.hasWebsite}
            onChange={(e) => onChange({...filters, hasWebsite: e.target.checked})}
            className="rounded"
          />
        </div>
      </div>
    </div>
  );
}

// Interactive map component
function BusinessMap({ businesses, onBusinessSelect }) {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && businesses.length > 0) {
      loadGoogleMapsAPI().then(() => {
        initializeMap();
      });
    }
  }, [businesses]);

  const initializeMap = () => {
    const center = calculateCenter(businesses);
    const mapInstance = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: center,
      styles: [] // Custom styling
    });

    const newMarkers = businesses.map(business => {
      const marker = new google.maps.Marker({
        position: { lat: business.lat, lng: business.lng },
        map: mapInstance,
        title: business.name,
        icon: {
          url: getMarkerIcon(business.aiReadinessScore),
          scaledSize: new google.maps.Size(30, 30)
        }
      });

      marker.addListener('click', () => {
        onBusinessSelect(business);
      });

      return marker;
    });

    setMarkers(newMarkers);
    setMap(mapInstance);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Prospect Locations</h3>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>High AI Readiness (80+)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium (50-79)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Low (0-49)</span>
          </div>
        </div>
      </div>
      <div id="map" className="h-96"></div>
    </div>
  );
}
```

### Day 15-16: Performance Optimization
```typescript
// Implement search result caching
class SearchCache {
  private cache = new Map<string, { data: BusinessLead[], timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  getCacheKey(params: SearchParams): string {
    return JSON.stringify(params);
  }

  get(params: SearchParams): BusinessLead[] | null {
    const key = this.getCacheKey(params);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(params: SearchParams, data: BusinessLead[]): void {
    const key = this.getCacheKey(params);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

// Implement infinite scroll for large result sets
function useInfiniteScroll(businesses: BusinessLead[], pageSize = 20) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(() => {
    if (isLoading || visibleCount >= businesses.length) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + pageSize, businesses.length));
      setIsLoading(false);
    }, 500);
  }, [isLoading, visibleCount, businesses.length, pageSize]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  return {
    visibleBusinesses: businesses.slice(0, visibleCount),
    isLoading,
    hasMore: visibleCount < businesses.length
  };
}
```

### Day 17-19: Analytics & User Experience
```typescript
// Usage analytics
class AnalyticsManager {
  static trackSearch(params: SearchParams, resultCount: number) {
    // Track search patterns for optimization
    this.sendEvent('search_performed', {
      location: params.zipCode ? 'zip' : 'gps',
      radius: params.radius,
      industries: params.businessTypes,
      result_count: resultCount,
      timestamp: new Date().toISOString()
    });
  }

  static trackExport(format: string, count: number) {
    this.sendEvent('export_performed', {
      format,
      prospect_count: count,
      timestamp: new Date().toISOString()
    });
  }

  static trackAIAnalysis(businessId: string) {
    this.sendEvent('ai_analysis_generated', {
      business_id: businessId,
      timestamp: new Date().toISOString()
    });
  }

  private static sendEvent(eventName: string, data: any) {
    // Send to analytics service (GA4, Mixpanel, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, data);
    }
  }
}

// User onboarding flow
function OnboardingFlow() {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to LeadLocal!",
      content: "Find qualified local prospects for your AI solutions business in seconds.",
      action: "Get Started"
    },
    {
      title: "Enter Your Location",
      content: "Start by entering your ZIP code or using 'Find Me' to detect your location.",
      action: "Next"
    },
    {
      title: "Select Industries",
      content: "Choose the types of businesses you want to target with your AI solutions.",
      action: "Next"
    },
    {
      title: "AI-Powered Insights",
      content: "Each prospect gets an AI readiness score and personalized opportunity analysis.",
      action: "Start Searching"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{steps[step].title}</h2>
          <p className="text-gray-600 mb-6">{steps[step].content}</p>
          
          <div className="flex justify-center mb-6">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`w-3 h-3 rounded-
