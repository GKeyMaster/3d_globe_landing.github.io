#!/usr/bin/env node

import { promises as fs, existsSync } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import * as osmtogeojson from 'osmtogeojson'
import type { Stop } from '../src/lib/data/types'

/**
 * Fetches building footprints around each venue using Overpass API
 * and saves them as GeoJSON files for runtime use
 */

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'
const RADIUS_METERS = 1200 // Search radius around each venue
const OUTPUT_DIR = 'public/data/buildings'
const DELAY_MS = 1000 // Polite delay between requests

interface OverpassResponse {
  version: number
  generator: string
  elements: any[]
}

/**
 * Constructs Overpass QL query for buildings around a coordinate
 */
function buildOverpassQuery(lat: number, lng: number, radius: number): string {
  return `
[out:json][timeout:25];
(
  way["building"](around:${radius},${lat},${lng});
  relation["building"](around:${radius},${lat},${lng});
);
out geom;
  `.trim()
}

/**
 * Fetches building data from Overpass API
 */
async function fetchBuildingsFromOverpass(lat: number, lng: number): Promise<any> {
  const query = buildOverpassQuery(lat, lng, RADIUS_METERS)
  
  console.log(`[Buildings] Querying Overpass API around ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
  
  try {
    const response = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'World Tour 2026 Landing Page (Educational/Non-commercial)'
      },
      body: `data=${encodeURIComponent(query)}`
    })

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status} ${response.statusText}`)
    }

    const overpassData: OverpassResponse = await response.json() as OverpassResponse
    console.log(`[Buildings] Found ${overpassData.elements.length} building elements`)
    
    // Convert Overpass JSON to GeoJSON
    const geojson = (osmtogeojson as any).default ? (osmtogeojson as any).default(overpassData) : (osmtogeojson as any)(overpassData)
    
    // Filter to only include polygons (buildings should be polygons)
    const buildingFeatures = geojson.features.filter(feature => 
      feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'
    )
    
    console.log(`[Buildings] Converted to ${buildingFeatures.length} building polygons`)
    
    return {
      type: 'FeatureCollection',
      features: buildingFeatures
    }
    
  } catch (error) {
    console.error('[Buildings] Error fetching from Overpass:', error)
    throw error
  }
}

/**
 * Saves GeoJSON data to file
 */
async function saveGeoJSON(stopId: string, geojson: any): Promise<void> {
  const filename = join(OUTPUT_DIR, `${stopId}.geojson`)
  
  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  
  // Save with pretty formatting for debugging
  await fs.writeFile(
    filename, 
    JSON.stringify(geojson, null, 2),
    'utf8'
  )
  
  console.log(`[Buildings] Saved ${geojson.features.length} buildings to ${filename}`)
}

/**
 * Checks if buildings file already exists (for caching)
 */
function buildingsFileExists(stopId: string): boolean {
  const filename = join(OUTPUT_DIR, `${stopId}.geojson`)
  return existsSync(filename)
}

/**
 * Polite delay between requests
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Main function to fetch buildings for all stops
 */
async function main() {
  console.log('[Buildings] Starting building data fetch...')
  
  // Load stops data
  const stopsPath = 'public/data/stops.v1.json'
  if (!existsSync(stopsPath)) {
    console.error('[Buildings] Error: stops.v1.json not found. Run "npm run data:v1" first.')
    process.exit(1)
  }
  
  const stopsData = JSON.parse(await fs.readFile(stopsPath, 'utf8'))
  const stops: Stop[] = stopsData
  
  console.log(`[Buildings] Processing ${stops.length} stops...`)
  
  let processed = 0
  let skipped = 0
  let errors = 0
  
  for (const stop of stops) {
    try {
      // Check if we already have buildings for this stop
      if (buildingsFileExists(stop.id)) {
        console.log(`[Buildings] Skipping ${stop.city} (${stop.id}) - file exists`)
        skipped++
        continue
      }
      
      // Validate coordinates
      if (!stop.lat || !stop.lng) {
        console.warn(`[Buildings] Skipping ${stop.city} (${stop.id}) - missing coordinates`)
        skipped++
        continue
      }
      
      console.log(`[Buildings] Fetching buildings for ${stop.city} - ${stop.venue}`)
      
      // Fetch buildings from Overpass API
      const geojson = await fetchBuildingsFromOverpass(stop.lat, stop.lng)
      
      // Save to file
      await saveGeoJSON(stop.id, geojson)
      
      processed++
      
      // Polite delay between requests (except for the last one)
      if (processed < stops.length - skipped) {
        console.log(`[Buildings] Waiting ${DELAY_MS}ms before next request...`)
        await delay(DELAY_MS)
      }
      
    } catch (error) {
      console.error(`[Buildings] Error processing ${stop.city}:`, error)
      errors++
    }
  }
  
  console.log(`[Buildings] Complete! Processed: ${processed}, Skipped: ${skipped}, Errors: ${errors}`)
  
  if (errors > 0) {
    console.log('[Buildings] Some errors occurred. You can re-run this script to retry failed stops.')
    process.exit(1)
  }
}

// Run the script
main().catch(error => {
  console.error('[Buildings] Fatal error:', error)
  process.exit(1)
})