#!/usr/bin/env node

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function buildApp() {
  try {
    console.log('Starting Vite build...')
    
    // Try different approaches to run vite
    const vitePaths = [
      resolve(__dirname, 'node_modules/.bin/vite'),
      resolve(__dirname, 'node_modules/vite/bin/vite.js'),
      'npx vite'
    ]
    
    let success = false
    
    for (const vitePath of vitePaths) {
      try {
        console.log(`Trying: ${vitePath}`)
        
        let command, args
        if (vitePath === 'npx vite') {
          command = 'npx'
          args = ['vite', 'build']
        } else if (fs.existsSync(vitePath)) {
          // Make executable if it exists
          try {
            fs.chmodSync(vitePath, '755')
          } catch (e) {
            console.log('Could not change permissions, continuing...')
          }
          command = 'node'
          args = [vitePath, 'build']
        } else {
          continue
        }
        
        const result = await new Promise((resolve, reject) => {
          const child = spawn(command, args, {
            stdio: 'inherit',
            cwd: __dirname
          })
          
          child.on('close', (code) => {
            if (code === 0) {
              resolve(true)
            } else {
              reject(new Error(`Process exited with code ${code}`))
            }
          })
          
          child.on('error', reject)
        })
        
        if (result) {
          success = true
          break
        }
      } catch (error) {
        console.log(`Failed with ${vitePath}:`, error.message)
        continue
      }
    }
    
    if (!success) {
      throw new Error('All build attempts failed')
    }
    
    console.log('Build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildApp()