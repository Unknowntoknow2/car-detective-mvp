
import { ReportData, AuctionResult } from './types';

export function getValuationReportHTML(data: ReportData): string {
  const { 
    make, 
    model, 
    year, 
    estimatedValue, 
    confidenceScore, 
    priceRange,
    auctionResults = [],
    isPremium = false,
    mileage,
    condition,
    zipCode
  } = data;

  const auctionHTML = auctionResults.length > 0 
    ? auctionResults
        .slice(0, 5) // Limit to 5 most recent
        .map((result) => {
          const price = parseInt(result.price || '0');
          const odometer = parseInt(result.odometer || '0');
          const photoUrl = result.photo_urls?.[0] || '';
          
          return `
            <div style="margin-top:12px;border:1px solid #e5e7eb;padding:12px;border-radius:8px;background:#f9fafb;">
              <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                <strong style="color:#1f2937;font-size:14px;">${result.auction_source}</strong>
                <span style="color:#6b7280;font-size:12px;">${new Date(result.sold_date).toLocaleDateString()}</span>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;">
                <div><span style="color:#6b7280;">Sold Price:</span> <strong style="color:#059669;">$${price.toLocaleString()}</strong></div>
                <div><span style="color:#6b7280;">Mileage:</span> ${odometer.toLocaleString()} mi</div>
                ${result.condition_grade ? `<div><span style="color:#6b7280;">Condition:</span> ${result.condition_grade}</div>` : ''}
                ${result.location ? `<div><span style="color:#6b7280;">Location:</span> ${result.location}</div>` : ''}
              </div>
              ${photoUrl ? `<img src="${photoUrl}" alt="Auction Photo" style="width:150px;height:auto;margin-top:8px;border-radius:4px;" />` : ''}
            </div>
          `;
        })
        .join('')
    : '<p style="color:#6b7280;font-style:italic;">No recent auction data available for this VIN.</p>';

  const priceRangeDisplay = priceRange 
    ? `$${priceRange[0].toLocaleString()} - $${priceRange[1].toLocaleString()}`
    : `$${Math.floor(estimatedValue * 0.9).toLocaleString()} - $${Math.ceil(estimatedValue * 1.1).toLocaleString()}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>CarDetective Valuation Report</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            background: white;
            color: #1f2937;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #1f2937;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header .subtitle {
            color: #6b7280;
            margin-top: 8px;
            font-size: 14px;
          }
          .section {
            margin-bottom: 32px;
            page-break-inside: avoid;
          }
          .section h2 {
            color: #1f2937;
            font-size: 20px;
            margin-bottom: 16px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
          }
          .vehicle-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .valuation-highlight {
            text-align: center;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 24px;
            border-radius: 12px;
            margin: 20px 0;
          }
          .valuation-highlight .price {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 8px;
          }
          .confidence-score {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin-top: 12px;
          }
          .premium-badge {
            background: linear-gradient(45deg, #fbbf24, #f59e0b);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            margin-left: 12px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .auction-section {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          @media print {
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CarDetective Valuation Report${isPremium ? '<span class="premium-badge">PREMIUM</span>' : ''}</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleDateString()}</div>
        </div>

        <div class="section">
          <h2>Vehicle Information</h2>
          <div class="vehicle-info">
            <div class="grid">
              <div><strong>Vehicle:</strong> ${year} ${make} ${model}</div>
              <div><strong>Mileage:</strong> ${mileage.toLocaleString()} miles</div>
              <div><strong>Condition:</strong> ${condition}</div>
              <div><strong>Location:</strong> ${zipCode}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="valuation-highlight">
            <div class="price">$${estimatedValue.toLocaleString()}</div>
            <div>Estimated Market Value</div>
            <div style="font-size: 14px; margin-top: 8px;">Range: ${priceRangeDisplay}</div>
            <div class="confidence-score">Confidence: ${confidenceScore}%</div>
          </div>
        </div>

        ${isPremium && auctionResults.length > 0 ? `
        <div class="section page-break">
          <h2>Real Auction Comparables</h2>
          <div class="auction-section">
            <p style="margin-bottom:16px;color:#4b5563;">Recent auction sales for similar vehicles help validate this valuation:</p>
            ${auctionHTML}
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>This report was generated by CarDetective's AI-powered valuation engine.</p>
          <p>Report ID: CD-${Date.now()}</p>
        </div>
      </body>
    </html>
  `;
}
