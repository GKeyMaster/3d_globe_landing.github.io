# Data Generation

This folder contains the data processing pipeline for the tour stops.

## Files

- `Cities, Venues.xlsx` - Source Excel file with venue data (place this file here)
- `stops.override.json` - Manual overrides for venue coordinates and additional data
- `sample-data.csv` - Sample data for testing (can be converted to Excel)

## Usage

1. Place the Excel file `Cities, Venues.xlsx` in this directory
2. The Excel file should have a sheet named "US & CAN" with columns:
   - Column A: City
   - Column B: Venue  
   - Column C: Capacity (format: "13,500 - 16,500" or single number)
3. Run the data generation script:
   ```bash
   npm run data:v1
   ```
4. This will generate `public/data/stops.v1.json` with the first 2 venues

## Override System

The `stops.override.json` file allows you to manually specify:
- Latitude/longitude coordinates
- Additional bullet points (pricing, revenue, notes)
- Any other custom data

Override keys are in the format: `"City+Venue"`

Example:
```json
{
  "Chicago+United Center": {
    "lat": 41.8806908,
    "lng": -87.6741759,
    "bullets": [
      "Ticket Price: $85-$250",
      "Gross Revenue: $2.1M",
      "Net/Guarantee: $1.8M",
      "Notes: Premium venue in downtown Chicago"
    ]
  }
}
```

## Output Format

The generated `stops.v1.json` contains an array of Stop objects:

```typescript
interface Stop {
  id: string           // Generated from city+venue
  order: number        // 1-based order
  city: string         // City name
  countryCode: string  // "US" or "CA"
  venue: string        // Venue name
  capacityMin: number | null
  capacityMax: number | null
  lat: number | null   // From overrides
  lng: number | null   // From overrides
  bullets: string[]    // Additional info bullets
}
```