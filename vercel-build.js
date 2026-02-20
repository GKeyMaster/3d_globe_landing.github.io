#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('Starting Vercel build process...')

try {
  // Check if vite is installed
  const viteBin = path.join(process.cwd(), 'node_modules', '.bin', 'vite')
  const viteJs = path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js')
  
  console.log('Checking Vite installation...')
  console.log('Current directory:', process.cwd())
  console.log('Node version:', process.version)
  
  let buildCommand
  
  if (fs.existsSync(viteJs)) {
    console.log('Using vite.js directly')
    buildCommand = `node "${viteJs}" build`
  } else if (fs.existsSync(viteBin)) {
    console.log('Using vite binary')
    // Try to fix permissions
    try {
      fs.chmodSync(viteBin, 0o755)
    } catch (e) {
      console.log('Could not change permissions:', e.message)
    }
    buildCommand = `"${viteBin}" build`
  } else {
    console.log('Using npx fallback')
    buildCommand = 'npx vite build'
  }
  
  console.log('Executing build command:', buildCommand)
  
  execSync(buildCommand, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  })
  
  console.log('Build completed successfully!')
  
} catch (error) {
  console.error('Build failed:', error.message)
  console.error('Error details:', error)
  process.exit(1)
}