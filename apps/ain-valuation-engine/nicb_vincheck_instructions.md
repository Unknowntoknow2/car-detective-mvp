# nicb_vincheck_instructions.md

# NICB VINCheck Integration (Free Stolen/Salvage Status)

## What is NICB VINCheck?
- NICB VINCheck (https://www.nicb.org/vincheck) is a free, public service that allows users to check if a vehicle has been reported as stolen or as a salvage vehicle by participating insurance companies.
- There is **no public API** for automated, high-volume queries. Use is limited to manual or semi-automated lookups.

## How to Integrate in AIN (Manual/Semi-Automated)
1. **User-Facing Link:**
   - After VIN decode, display a button or link: "Check Stolen/Salvage Status (NICB VINCheck)".
   - Link to: `https://www.nicb.org/vincheck?vin={VIN}`
2. **Instructions for Users:**
   - Instruct users to enter their VIN on the NICB site and review the results.
   - Optionally, provide a field for users to self-report the result ("No record found", "Reported stolen", "Reported salvage").
3. **Data Handling:**
   - Store user-reported status as `user_reported_nicb_status` with a confidence flag (e.g., "user-reported").
   - Do not scrape or automate queries to NICB, as this violates their terms of service.

## Example UI Flow
- After VIN decode, show:
  - [ ] Title Status: [dropdown: Clean, Salvage, Rebuilt, Flood, Other, Unknown]
  - [ ] Number of Owners: [input]
  - [ ] Title Brands: [multi-select: Salvage, Rebuilt, Flood, Lemon, etc.]
  - [ ] NICB VINCheck: [button/link to NICB VINCheck]
  - [ ] NICB Result: [user input: No record, Stolen, Salvage, etc.]

## For Production
- Plan to integrate a paid NMVTIS provider for automated, certified title/brand/ownership data.
- Continue to offer NICB VINCheck as a free, consumer-facing transparency tool.

---

**This approach is 100% compliant, user-friendly, and leverages all free resources available for title/brand/stolen status.**
