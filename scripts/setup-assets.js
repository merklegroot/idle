#!/usr/bin/env node

/**
 * Asset Setup Script
 * Extracts and organizes the Cute Fantasy RPG assets
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Configuration
const ASSET_DIR = path.join(__dirname, '..', 'public', 'assets', 'cute-fantasy-rpg');
const DOWNLOADS_DIR = path.join(__dirname, '..', 'downloads');
const ZIP_FILE = path.join(DOWNLOADS_DIR, 'Cute_Fantasy_Free.zip');

async function checkZipFile() {
  log('🔍 Checking for zip file...', 'blue');
  
  // Create downloads directory if it doesn't exist
  if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
    log(`📁 Created downloads directory: ${DOWNLOADS_DIR}`, 'blue');
  }
  
  if (!fs.existsSync(ZIP_FILE)) {
    log('❌ Cute_Fantasy_Free.zip not found', 'red');
    log(`Please download the assets and place them at: ${ZIP_FILE}`, 'yellow');
    log('See ASSET_INSTRUCTIONS.md for download instructions', 'yellow');
    return false;
  }
  
  // Verify it's actually a zip file
  try {
    const fileType = execSync(`file "${ZIP_FILE}"`, { encoding: 'utf8' });
    if (fileType.includes('HTML')) {
      log('❌ Downloaded file is HTML, not a zip file', 'red');
      log('Please make sure you downloaded the actual zip file from itch.io', 'red');
      return false;
    }
  } catch (error) {
    log('⚠️  Could not verify file type, proceeding anyway...', 'yellow');
  }
  
  log('✅ Found Cute_Fantasy_Free.zip', 'green');
  return true;
}

async function extractAssets() {
  log('📦 Extracting assets...', 'blue');
  
  try {
    // Create a temporary extraction directory in downloads
    const tempDir = path.join(DOWNLOADS_DIR, 'temp-extract');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Extract the zip file
    const extractCommand = process.platform === 'win32' 
      ? `powershell -command "Expand-Archive -Path '${ZIP_FILE}' -DestinationPath '${tempDir}' -Force"`
      : `unzip -q "${ZIP_FILE}" -d "${tempDir}"`;
    
    execSync(extractCommand);
    
    // Find the actual asset files (they might be in a subdirectory)
    const tempContents = fs.readdirSync(tempDir);
    let assetSource = null;
    
    // Look for the extracted assets
    for (const item of tempContents) {
      const itemPath = path.join(tempDir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        // Check if this looks like the asset directory
        const contents = fs.readdirSync(itemPath);
        if (contents.some(file => 
          file.includes('Cute_Fantasy') || 
          file.includes('Fantasy') ||
          file.endsWith('.png') ||
          file.endsWith('.jpg') ||
          file.endsWith('.ase') ||
          file === 'Animals' ||
          file === 'Enemies' ||
          file === 'Player' ||
          file === 'Tiles'
        )) {
          assetSource = itemPath;
          break;
        }
      }
    }
    
    if (!assetSource) {
      // If no directory found, use the temp directory itself
      assetSource = tempDir;
    }
    
    log('📋 Organizing assets...', 'blue');
    
    // Copy assets to the main directory, excluding the zip file
    const copyCommand = process.platform === 'win32' 
      ? `xcopy "${assetSource}\\*" "${ASSET_DIR}\\" /E /I /Y /EXCLUDE:exclude.txt`
      : `cp -r "${assetSource}"/* "${ASSET_DIR}/"`;
    
    if (process.platform === 'win32') {
      // Create exclude file for Windows
      const excludeFile = path.join(ASSET_DIR, 'exclude.txt');
      fs.writeFileSync(excludeFile, 'Cute_Fantasy_Free.zip\n');
      execSync(copyCommand);
      fs.unlinkSync(excludeFile);
    } else {
      execSync(copyCommand);
    }
    
    // Clean up temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    log('✅ Assets extracted and organized', 'green');
    return true;
    
  } catch (error) {
    log('❌ Extraction failed:', 'red');
    log(error.message, 'red');
    return false;
  }
}

async function verifyInstallation() {
  log('🔍 Verifying installation...', 'blue');
  
  if (!fs.existsSync(ASSET_DIR)) {
    log('❌ Asset directory not found', 'red');
    return false;
  }
  
  const contents = fs.readdirSync(ASSET_DIR);
  const hasAssets = contents.some(file => {
    const filePath = path.join(ASSET_DIR, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Check if it's an asset directory (like Animals, Enemies, etc.)
      return ['Animals', 'Enemies', 'Player', 'Tiles', 'Outdoor decoration'].includes(file);
    }
    return file.endsWith('.png') || 
           file.endsWith('.jpg') || 
           file.endsWith('.jpeg') ||
           file.endsWith('.gif') ||
           file.endsWith('.ase') ||
           file.endsWith('.aseprite');
  });
  
  if (hasAssets) {
    log('✅ Assets verified successfully', 'green');
    return true;
  } else {
    log('❌ No asset files found in directory', 'red');
    return false;
  }
}

async function main() {
  log('🎨 Cute Fantasy RPG Asset Setup', 'blue');
  log('================================', 'blue');
  log('');
  
  try {
    const zipExists = await checkZipFile();
    if (!zipExists) {
      process.exit(1);
    }
    
    const extractSuccess = await extractAssets();
    if (!extractSuccess) {
      process.exit(1);
    }
    
    const verifySuccess = await verifyInstallation();
    if (!verifySuccess) {
      process.exit(1);
    }
    
    log('');
    log('🎉 Setup Complete!', 'green');
    log('==================', 'green');
    log('');
    log('The Cute Fantasy RPG assets have been set up successfully!', 'green');
    log(`Location: ${ASSET_DIR}`, 'blue');
    log('');
    log('Next steps:', 'blue');
    log('1. Start your development server: npm run dev', 'blue');
    log('2. Visit /icons to see the asset showcase', 'blue');
    log('3. The assets are now available for use in your game', 'blue');
    log('');
    log('ℹ️  Note: Assets are excluded from git via .gitignore', 'yellow');
    log('   Other developers can run this script to set up the same assets', 'yellow');
    
  } catch (error) {
    log('❌ Setup failed:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
