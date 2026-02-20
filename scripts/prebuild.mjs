#!/usr/bin/env node

import { spawn } from 'child_process'

/**
 * Prebuild script for Cloudflare Pages deployment
 * Conditionally runs data generation scripts before build
 */

console.log('[Prebuild] Starting data generation...')

// Check if data generation should be skipped
if (process.env.SKIP_DATA_GEN === '1') {
  console.log('[Prebuild] SKIP_DATA_GEN=1 detected. Skipping data generation.')
  console.log('[Prebuild] Ensure public/data/** artifacts are committed to repo.')
  process.exit(0)
}

/**
 * Runs an npm script and returns a promise
 */
function runNpmScript(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`[Prebuild] Running: npm run ${scriptName}`)
    
    const child = spawn('npm', ['run', scriptName], {
      stdio: 'inherit', // Stream logs to parent process
      shell: true
    })
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`[Prebuild] ✅ ${scriptName} completed successfully`)
        resolve()
      } else {
        console.error(`[Prebuild] ❌ ${scriptName} failed with exit code ${code}`)
        reject(new Error(`Script ${scriptName} failed with exit code ${code}`))
      }
    })
    
    child.on('error', (error) => {
      console.error(`[Prebuild] ❌ Failed to start ${scriptName}:`, error.message)
      reject(error)
    })
  })
}

/**
 * Main prebuild sequence
 */
async function main() {
  try {
    // Step 1: Generate stops data
    await runNpmScript('data:v1')
    
    // Step 2: Fetch building data
    await runNpmScript('data:buildings:v1')
    
    console.log('[Prebuild] 🎉 All data generation completed successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('[Prebuild] 💥 Data generation failed:', error.message)
    console.error('')
    console.error('Troubleshooting:')
    console.error('- Ensure data/Cities, Venues.xlsx is committed to the repo')
    console.error('- Or set SKIP_DATA_GEN=1 and commit public/data/** artifacts')
    console.error('- Check network connectivity for building data fetch')
    process.exit(1)
  }
}

// Run the prebuild process
main()