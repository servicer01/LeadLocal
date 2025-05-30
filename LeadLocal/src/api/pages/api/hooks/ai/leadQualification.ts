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