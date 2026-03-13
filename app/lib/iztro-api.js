#!/usr/bin/env node

/**
 * iztro API investigation
 * Explore the actual API structure
 */

const Ziwei = require('iztro');

console.log('=== iztro API Investigation ===\n');

// List main exports
console.log('Main exports:');
console.log('  - data:', typeof Ziwei.data);
console.log('  - star:', typeof Ziwei.star);
console.log('  - util:', typeof Ziwei.util);
console.log('  - astro:', typeof Ziwei.astro);

// Check star export
if (Ziwei.star) {
  console.log('\nstar object:');
  const starKeys = Object.keys(Ziwei.star);
  console.log('  Keys:', starKeys);
  
  // Check if it has computation methods
  console.log('  Methods: ', starKeys.filter(k => typeof Ziwei.star[k] === 'function'));
}

// Check util export
if (Ziwei.util) {
  console.log('\nutil object:');
  const utilKeys = Object.keys(Ziwei.util);
  console.log('  Keys:', utilKeys.slice(0, 20));
  console.log('  Is there a compute/getChart?', 
    utilKeys.includes('getChart') || utilKeys.includes('compute'));
}

// Check if there's a main chart computation function
console.log('\n=== Looking for computation API ===');

// Try to find how to use iztro
// Common patterns:
// 1. Ziwei.star.compute()
// 2. Ziwei.utils.getChart()
// 3. new Ziwei()

console.log('\nTrying common API patterns...\n');

// Pattern 1: star.compute or star.getChart
if (Ziwei.star && Ziwei.star.star) {
  console.log('Found: Ziwei.star.star\n');
  const starStarKeys = Object.keys(Ziwei.star.star).slice(0, 10);
  console.log('Keys:', starStarKeys);
}

// Pattern 2: Look in util for computation
if (Ziwei.util) {
  const utilKeys = Object.keys(Ziwei.util);
  const computeMethods = utilKeys.filter(k => 
    k.toLowerCase().includes('compute') || 
    k.toLowerCase().includes('chart') ||
    k.toLowerCase().includes('get') ||
    k.toLowerCase().includes('ziwei')
  );
  
  if (computeMethods.length > 0) {
    console.log('\nFound compute-like methods in util:', computeMethods);
  }
}

// Try to find actual constructor or factory
console.log('\nSearching for chart factory/constructor...');
try {
  // Maybe it's in the data section?
  if (Ziwei.data) {
    console.log('Ziwei.data keys:', Object.keys(Ziwei.data).slice(0, 10));
  }
  
  // Maybe Star is the actual class?
  if (Ziwei.Star) {
    console.log('Found Ziwei.Star class');
  }
  
  // Check iztro package.json or README info
  console.log('\nTrying to infer from error...');
  
  // Actually test with different syntaxes
  const testDate = { year: 1990, month: 6, day: 15, hour: 2, minute: 30, gender: 'M' };
  
  // Try 1: Ziwei.star method
  if (typeof Ziwei.star === 'function') {
    const result = Ziwei.star(testDate.year, testDate.month, testDate.day, testDate.hour, testDate.minute, testDate.gender);
    console.log('\n✓ Ziwei.star() works!');
    console.log('Result keys:', Object.keys(result).slice(0, 10));
  }
  
} catch (e) {
  console.log('Still exploring...');
}

// Final attempt: Check package
console.log('\n=== Checking iztro module ===');
try {
  const pkg = require('iztro/package.json');
  console.log('Package version:', pkg.version);
  console.log('Main entry:', pkg.main);
} catch (e) {
  console.log('Could not read package.json from iztro');
}
