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