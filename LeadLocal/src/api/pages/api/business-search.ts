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