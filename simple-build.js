#!/usr/bin/env node

// Simple build script that doesn't import Vite modules directly
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

console.log('Simple build process starting...')
console.log('Working directory:', process.cwd())
console.log('Node version:', process.version)

// List available commands
try {
  console.log('\nChecking available build tools...')
  
  const commands = [
    'node node_modules/vite/bin/vite.js build',
    'node fallback-build.js',
    'npx --yes vite@latest build',
    'npm run build:vite'
  ]
  
  for (const cmd of commands) {
    try {
      console.log(`\nTrying: ${cmd}`)
      execSync(cmd, { 
        stdio: 'inherit',
        timeout: 300000, // 5 minutes
        env: {
          ...process.env,
          NODE_ENV: 'production',
          FORCE_COLOR: '0'
        }
      })
      console.log('✅ Build successful!')
      process.exit(0)
    } catch (error) {
      console.log(`❌ Command failed: ${error.message}`)
      continue
    }
  }
  
  throw new Error('All build commands failed')
  
} catch (error) {
  console.error('❌ Build process failed:', error.message)
  process.exit(1)
}