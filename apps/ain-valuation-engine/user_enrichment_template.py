# user_enrichment_template.py
"""
Template for collecting user-supplied enrichment data (title, ownership, service, auction, etc.)
Flag all user-supplied data as 'user-reported' for transparency and confidence scoring.
"""

def collect_user_enrichment():
    enrichment = {}
    enrichment['title_status'] = input("Title Status (Clean, Salvage, Rebuilt, Flood, Other, Unknown): ")
    enrichment['number_of_owners'] = input("Number of Owners: ")
    enrichment['title_brands'] = input("Title Brands (comma-separated, e.g., Salvage, Rebuilt, Flood): ")
    enrichment['service_history'] = input("Service History (brief description or 'None'): ")
    enrichment['auction_history'] = input("Auction History (brief description or 'None'): ")
    enrichment['user_reported'] = True
    print("\nUser-supplied enrichment data:")
    for k, v in enrichment.items():
        print(f"{k}: {v}")
    return enrichment

if __name__ == "__main__":
    collect_user_enrichment()
