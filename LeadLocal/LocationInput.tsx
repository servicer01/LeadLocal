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