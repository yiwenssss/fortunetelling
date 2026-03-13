#!/usr/bin/env node

/**
 * Deep dive into iztro structure
 */

// Try different import approaches
console.log('=== Deep Dive: iztro Module Structure ===\n');

// Method 1: Default export
const iztroDefault = require('iztro');
console.log('1. Default export keys:', Object.keys(iztroDefault));

// Method 2: Check if there's a Star class
try {
  // Some packages export the class as default
  const Star = require('iztro');
  if (Star && typeof Star.star === 'object' && Star.data) {
    console.log('\n2. iztro is a namespace module');
    console.log('   Exports: data, star, util, astro');
  }
} catch (e) {
  console.log('   Error:', e.message);
}

// Method 3: Check for TypeScript definitions or JSDoc
console.log('\n3. Checking node_modules for implementation hints...');
const fs = require('fs');
const path = require('path');

try {
  const indexPath = path.join(__dirname, '../node_modules/iztro/lib/index.js');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    const lines = content.split('\n').slice(0, 50);
    console.log('\n   iztro/lib/index.js (first 50 lines):');
    lines.forEach((line, i) => {
      if (line.trim()) {
        console.log(`   ${i+1}: ${line.slice(0, 80)}`);
      }
    });
  }
} catch (e) {
  console.log('   Could not read index:', e.message);
}

// Method 4: Check for ESM export
console.log('\n4. Checking if iztro has ESM export...');
try {
  const ijson = require('iztro/package.json');
  console.log('   Name:', ijson.name);
  console.log('   Version:', ijson.version);
  console.log('   Main:', ijson.main);
  console.log('   Types:', ijson.types);
  console.log('   Exports:', ijson.exports ? 'yes' : 'no');
  
  if (ijson.exports) {
    console.log('   Export targets:', Object.keys(ijson.exports));
  }
} catch (e) {
  console.log('   Error:', e.message);
}

// Method 5: Look for actual class or function
console.log('\n5. Looking for main API entry point...');
console.log('   iztro properties:');
Object.keys(iztroDefault).forEach(key => {
  const val = iztroDefault[key];
  const type = typeof val;
  const isArray = Array.isArray(val);
  const isFunc = typeof val === 'function';
  
  console.log(`   - ${key}: ${type}${isArray ? ' (array)' : ''}${isFunc ? ' (function)' : ''}`);
  
  if (type === 'object' && !isArray && key !== 'data') {
    const subKeys = Object.keys(val).slice(0, 5);
    console.log(`     └─ ${subKeys.join(', ')} ...`);
  }
});

// Method 6: Try to use the Star class if it exists as CommonJS
console.log('\n6. Attempting to use iztro.star methods...');
try {
  // Maybe Star is accessed differently
  if (iztroDefault.star && iztroDefault.data && iztroDefault.data.PALACES) {
    console.log('   ✓ Found palace definitions');
    console.log('     PALACES:', Object.keys(iztroDefault.data.PALACES).slice(0, 5));
  }
  
  // Try to find actual Ziwei method
  const keys = Object.keys(iztroDefault);
  console.log('\n   Main keys available:', keys);
  
  // Maybe there's an astro property with getChart?
  if (iztroDefault.astro) {
    console.log('   Astro module:', typeof iztroDefault.astro);
    const astroKeys = Object.keys(iztroDefault.astro);
    console.log('   Astro keys:', astroKeys.slice(0, 10));
  }
  
} catch (e) {
  console.log('   Error:', e.message);
}

console.log('\n=== Next Steps ===');
console.log('The iztro package provides utilities for Ziwei computation.');
console.log('Looking for the main computation interface...');
