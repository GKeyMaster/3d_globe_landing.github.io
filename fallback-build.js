#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Fallback build process starting...')

try {
  // Step 1: Build with simple config
  console.log('📦 Building with simplified Vite config...')
  execSync('node node_modules/vite/bin/vite.js build --config vite.config.simple.js', {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  })
  
  // Step 2: Copy Cesium assets manually
  console.log('📁 Copying Cesium assets...')
  execSync('node copy-cesium-assets.js', {
    stdio: 'inherit'
  })
  
  console.log('✅ Fallback build completed successfully!')
  
} catch (error) {
  console.error('❌ Fallback build failed:', error.message)
  process.exit(1)
}