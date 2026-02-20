#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const sourceDir = path.join(process.cwd(), 'node_modules', 'cesium', 'Build', 'Cesium')
const destDir = path.join(process.cwd(), 'dist', 'cesium')

const folders = ['Workers', 'Assets', 'Widgets', 'ThirdParty']

console.log('Copying Cesium assets...')

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source not found: ${src}`)
    return
  }
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true })
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

try {
  for (const folder of folders) {
    const src = path.join(sourceDir, folder)
    const dest = path.join(destDir, folder)
    console.log(`Copying ${folder}...`)
    copyRecursive(src, dest)
  }
  console.log('✅ Cesium assets copied successfully!')
} catch (error) {
  console.error('❌ Failed to copy Cesium assets:', error.message)
  process.exit(1)
}