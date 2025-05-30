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