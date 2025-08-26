import React from "react";

export type MarketListing = {
  source: string;
  import type { MarketListing } from '../../src/types/MarketListing';
  if (!listings?.length) return null;
  const top = listings.slice(0, 6);
  return (
    <section className="similar-listings">
      <h3>Anchored to {listings.length} verified listings</h3>
      {typeof confidence === "number" && (
        <div className="confidence-bar" title={`Confidence: ${Math.round(confidence * 100)}%`}>
          <div style={{ width: `${Math.round(confidence * 100)}%`, background: '#4caf50', height: 8, borderRadius: 4 }} />
        </div>
      )}
      <div className="listings-grid">
        {top.map((l, i) => (
          <a key={l.listing_url + i} href={l.listing_url} target="_blank" rel="noopener noreferrer" className="listing-card">
            <img src={l.photo_url || "/placeholder_car.png"} alt="Listing" className="listing-photo" />
            <div className="listing-info">
              <div className="listing-title">{l.year} {l.make} {l.model} {l.trim}</div>
              <div className="listing-price">${l.price.toLocaleString()} <span className="listing-mileage">{l.mileage ? `${l.mileage.toLocaleString()} mi` : null}</span></div>
              <div className="listing-dealer">{l.dealer_name} {l.zip && <span>({l.zip})</span>}</div>
              <div className="listing-source">
                <img src={`https://www.google.com/s2/favicons?domain=${l.source}`} alt={l.source} style={{ width: 16, height: 16, verticalAlign: 'middle' }} />
                <span style={{ marginLeft: 4 }}>{l.source}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <style jsx>{`
        .similar-listings { margin: 2em 0; }
        .confidence-bar { margin: 0.5em 0 1em 0; background: #eee; border-radius: 4px; height: 8px; width: 100%; }
        .listings-grid { display: flex; flex-wrap: wrap; gap: 1em; }
        .listing-card { display: flex; flex-direction: column; width: 220px; border: 1px solid #eee; border-radius: 8px; text-decoration: none; color: inherit; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.04); transition: box-shadow 0.2s; }
        .listing-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.10); }
        .listing-photo { width: 100%; height: 120px; object-fit: cover; border-top-left-radius: 8px; border-top-right-radius: 8px; background: #f8f8f8; }
        .listing-info { padding: 0.5em 1em 1em 1em; }
        .listing-title { font-weight: 600; margin-bottom: 0.25em; }
        .listing-price { font-size: 1.1em; color: #2e7d32; margin-bottom: 0.25em; }
        .listing-mileage { color: #888; font-size: 0.95em; margin-left: 0.5em; }
        .listing-dealer { color: #555; font-size: 0.97em; margin-bottom: 0.25em; }
        .listing-source { font-size: 0.95em; color: #888; display: flex; align-items: center; }
      `}</style>
    </section>
  );
}
