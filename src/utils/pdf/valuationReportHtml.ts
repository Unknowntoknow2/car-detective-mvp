
import { ReportData } from './types';
import { AuctionResult } from '@/types/auction';

export function generateValuationReportHtml(reportData: ReportData): string {
  const { 
    make, 
    model, 
    year, 
    mileage, 
    condition, 
    estimatedValue, 
    confidenceScore,
    adjustments = [],
    generatedAt,
    vin
  } = reportData;

  // Helper function to format auction data
  const formatAuctionData = (auctionResults: AuctionResult[] = []) => {
    if (!auctionResults.length) return '<p>No auction data available</p>';
    
    return auctionResults.map(result => `
      <div class="auction-result">
        <p><strong>Price:</strong> ${result.price}</p>
        <p><strong>Date:</strong> ${result.sold_date}</p>
        <p><strong>Mileage:</strong> ${result.mileage || 'N/A'}</p>
        <p><strong>Source:</strong> ${result.auction_source}</p>
        ${result.photos && result.photos.length > 0 ? `
          <div class="photos">
            ${result.photos.slice(0, 3).map(photo => `<img src="${photo}" alt="Auction photo" style="width: 100px; height: 75px; object-fit: cover; margin: 5px;" />`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vehicle Valuation Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .vehicle-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .value-section {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 30px;
        }
        .adjustments {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .adjustment-item {
          display: flex;
          justify-content: between;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .auction-result {
          border: 1px solid #e2e8f0;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 8px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          color: #64748b;
          font-size: 0.9em;
        }
        h1, h2, h3 {
          color: #1e293b;
        }
        .confidence-score {
          background: #10b981;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Vehicle Valuation Report</h1>
        <p>Professional vehicle assessment and market analysis</p>
      </div>

      <div class="vehicle-info">
        <div>
          <h3>Vehicle Details</h3>
          <p><strong>Make:</strong> ${make}</p>
          <p><strong>Model:</strong> ${model}</p>
          <p><strong>Year:</strong> ${year}</p>
          <p><strong>Mileage:</strong> ${mileage?.toLocaleString() || 'N/A'} miles</p>
          <p><strong>Condition:</strong> ${condition || 'Not specified'}</p>
          ${vin ? `<p><strong>VIN:</strong> ${vin}</p>` : ''}
        </div>
        <div>
          <h3>Report Details</h3>
          <p><strong>Generated:</strong> ${formatDate(generatedAt)}</p>
          <p><strong>Confidence Score:</strong> 
            <span class="confidence-score">${Math.round(confidenceScore)}%</span>
          </p>
        </div>
      </div>

      <div class="value-section">
        <h2>Estimated Market Value</h2>
        <div style="font-size: 3em; font-weight: bold; margin: 20px 0;">
          ${formatCurrency(estimatedValue)}
        </div>
        <p>Based on current market conditions and vehicle specifics</p>
      </div>

      ${adjustments.length > 0 ? `
        <div class="adjustments">
          <h3>Value Adjustments</h3>
          ${adjustments.map(adj => `
            <div class="adjustment-item">
              <span>${adj.factor}</span>
              <span style="font-weight: bold; color: ${adj.impact >= 0 ? '#10b981' : '#ef4444'}">
                ${adj.impact >= 0 ? '+' : ''}${formatCurrency(adj.impact)}
              </span>
            </div>
            <div style="font-size: 0.9em; color: #64748b; margin-top: 4px;">
              ${adj.description}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="footer">
        <p>This report is generated based on market data and vehicle condition assessment.</p>
        <p>Report generated on ${formatDate(generatedAt)}</p>
      </div>
    </body>
    </html>
  `;
}
