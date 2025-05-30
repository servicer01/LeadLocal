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