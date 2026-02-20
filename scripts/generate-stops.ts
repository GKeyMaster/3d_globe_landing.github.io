// Handle both CommonJS and ESM imports for xlsx
import XLSXModule from 'xlsx'
const XLSX = XLSXModule.default || XLSXModule
import { promises as fs, existsSync } from 'fs'
import { join } from 'path'

interface Stop {
  id: string
  order: number
  city: string
  countryCode: string
  venue: string
  capacityMin: number | null
  capacityMax: number | null
  lat: number | null
  lng: number | null
  bullets: string[]
}

interface Override {
  lat?: number
  lng?: number
  bullets?: string[]
  [key: string]: any
}

function parseCapacity(capacityStr: string): { min: number | null; max: number | null } {
  if (!capacityStr || capacityStr.trim() === '' || capacityStr.toLowerCase() === 'tbd') {
    return { min: null, max: null }
  }

  // Remove commas and clean the string
  const cleaned = capacityStr.replace(/,/g, '').trim()
  
  // Check for range format like "13500 - 16500" or "13500-16500"
  const rangeMatch = cleaned.match(/(\d+)\s*-\s*(\d+)/)
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1]),
      max: parseInt(rangeMatch[2])
    }
  }
  
  // Check for single number
  const singleMatch = cleaned.match(/(\d+)/)
  if (singleMatch) {
    const capacity = parseInt(singleMatch[1])
    return { min: capacity, max: capacity }
  }
  
  return { min: null, max: null }
}

function generateStopId(city: string, venue: string): string {
  const cleanCity = city.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  const cleanVenue = venue.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  return `${cleanCity}-${cleanVenue}`
}

function getCountryCode(city: string): string {
  // Simple mapping for common cities - can be expanded
  const cityToCountry: { [key: string]: string } = {
    'toronto': 'CA',
    'montreal': 'CA',
    'vancouver': 'CA',
    'calgary': 'CA',
    'ottawa': 'CA',
    'chicago': 'US',
    'new york': 'US',
    'los angeles': 'US',
    'miami': 'US',
    'boston': 'US',
    'atlanta': 'US',
    'dallas': 'US',
    'houston': 'US',
    'philadelphia': 'US',
    'phoenix': 'US',
    'san antonio': 'US',
    'san diego': 'US',
    'detroit': 'US',
    'san jose': 'US',
    'indianapolis': 'US',
    'jacksonville': 'US',
    'san francisco': 'US',
    'columbus': 'US',
    'charlotte': 'US',
    'fort worth': 'US',
    'denver': 'US',
    'el paso': 'US',
    'memphis': 'US',
    'seattle': 'US',
    'washington': 'US',
    'nashville': 'US',
    'baltimore': 'US',
    'oklahoma city': 'US',
    'louisville': 'US',
    'portland': 'US',
    'las vegas': 'US',
    'milwaukee': 'US',
    'albuquerque': 'US',
    'tucson': 'US',
    'fresno': 'US',
    'sacramento': 'US',
    'long beach': 'US',
    'kansas city': 'US',
    'mesa': 'US',
    'virginia beach': 'US',
    'colorado springs': 'US',
    'omaha': 'US',
    'raleigh': 'US',
    'oakland': 'US',
    'minneapolis': 'US',
    'tulsa': 'US',
    'cleveland': 'US',
    'wichita': 'US',
    'arlington': 'US'
  }
  
  return cityToCountry[city.toLowerCase()] || 'US'
}

async function generateStops() {
  try {
    console.log('🚀 Starting stops generation...')
    
    // Check if Excel file exists
    const excelPath = join(process.cwd(), 'data', 'Cities, Venues.xlsx')
    if (!existsSync(excelPath)) {
      console.error('❌ Excel file not found at:', excelPath)
      console.error('')
      console.error('Solutions:')
      console.error('1. Commit data/Cities, Venues.xlsx to your repository')
      console.error('2. Or use pre-generated data: set SKIP_DATA_GEN=1 and commit public/data/** artifacts')
      throw new Error('Missing required Excel file for data generation')
    }
    
    // Read Excel file
    console.log('📊 Reading Excel file...')
    const workbook = XLSX.readFile(excelPath)
    
    // Check if "US & CAN" sheet exists
    if (!workbook.SheetNames.includes('US & CAN')) {
      console.error('❌ Sheet "US & CAN" not found in Excel file')
      console.log('Available sheets:', workbook.SheetNames)
      process.exit(1)
    }
    
    const worksheet = workbook.Sheets['US & CAN']
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
    
    console.log(`📋 Found ${data.length} rows in Excel sheet`)
    
    // Skip header row and process data
    const dataRows = data.slice(1).filter(row => row && row.length > 0 && row[0])
    
    if (dataRows.length === 0) {
      console.error('❌ No data rows found in Excel sheet')
      process.exit(1)
    }
    
    console.log(`🔍 Processing ${Math.min(dataRows.length, 2)} stops for v1...`)
    
    // Load overrides
    let overrides: { [key: string]: Override } = {}
    const overridePath = join(process.cwd(), 'data', 'stops.override.json')
    if (existsSync(overridePath)) {
      console.log('📝 Loading overrides...')
      overrides = JSON.parse(await fs.readFile(overridePath, 'utf8'))
    }
    
    // Process only first 2 rows for v1
    const stops: Stop[] = []
    const rowsToProcess = dataRows.slice(0, 2)
    
    rowsToProcess.forEach((row, index) => {
      // Assuming Excel columns: City, Venue, Capacity, ... (adjust as needed)
      const city = (row[0] || '').toString().trim() || 'TBD'
      const venue = (row[1] || '').toString().trim() || 'TBD'
      const capacityStr = (row[2] || '').toString().trim()
      
      const capacity = parseCapacity(capacityStr)
      const overrideKey = `${city}+${venue}`
      const override = overrides[overrideKey] || {}
      
      const stop: Stop = {
        id: generateStopId(city, venue),
        order: index + 1,
        city,
        countryCode: getCountryCode(city),
        venue,
        capacityMin: capacity.min,
        capacityMax: capacity.max,
        lat: override.lat || null,
        lng: override.lng || null,
        bullets: override.bullets || [
          'Ticket Price: TBD',
          'Gross Revenue: TBD',
          'Net/Guarantee: TBD',
          'Notes: TBD'
        ]
      }
      
      stops.push(stop)
      console.log(`✅ Processed: ${city} - ${venue}`)
    })
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'public', 'data')
    if (!existsSync(outputDir)) {
      await fs.mkdir(outputDir, { recursive: true })
    }
    
    // Write output JSON
    const outputPath = join(outputDir, 'stops.v1.json')
    await fs.writeFile(outputPath, JSON.stringify(stops, null, 2))
    
    console.log(`🎉 Successfully generated ${stops.length} stops`)
    console.log(`📁 Output saved to: ${outputPath}`)
    
    // Log summary
    console.log('\n📊 Summary:')
    stops.forEach(stop => {
      console.log(`  ${stop.order}. ${stop.city}, ${stop.countryCode} - ${stop.venue}`)
      if (stop.capacityMin && stop.capacityMax) {
        console.log(`     Capacity: ${stop.capacityMin.toLocaleString()} - ${stop.capacityMax.toLocaleString()}`)
      }
      if (stop.lat && stop.lng) {
        console.log(`     Location: ${stop.lat}, ${stop.lng}`)
      }
    })
    
  } catch (error) {
    console.error('❌ Error generating stops:', error)
    process.exit(1)
  }
}

// Run the script
generateStops()