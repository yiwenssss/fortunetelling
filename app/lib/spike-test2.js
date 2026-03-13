#!/usr/bin/env node

/**
 * iztro Spike - Test with astrolabeBySolarDate
 */

const iztro = require('iztro');

console.log('=== IZTRO SPIKE: OQ-1 ===\n');

try {
  console.log('Test 1: astrolabeBySolarDate()\n');
  
  // Try with explicit JSDate
  const astrolabe = iztro.astro.astrolabeBySolarDate(
    new Date(1990, 5, 15, 2, 30) // JS months are 0-indexed
  );
  
  console.log('✓ Chart created');
  console.log('  Keys:', Object.keys(astrolabe).slice(0, 20));
  
  if (astrolabe.palaces) {
    console.log('\n✓ PALACES FOUND:', astrolabe.palaces.length);
    astrolabe.palaces.slice(0, 3).forEach((p, i) => {
      console.log(`  [${i}] ${p.name}`);
    });
  }
  
  console.log('\n✓ SPIKE PASSED - iztro works!');
  
} catch (e1) {
  console.log('✗ astrolabeBySolarDate failed:', e1.message);
  
  console.log('\nTest 2: Trying rearrangeAstrolable\n');
  
  try {
    // Maybe need to use rearrange?
    // First check what astrolabe needs
    console.log('Available astro methods:');
    Object.keys(iztro.astro)
      .filter(k => typeof iztro.astro[k] === 'function')
      .slice(0, 10)
      .forEach(k => console.log('  -', k));
      
  } catch (e2) {
    console.log('Error:', e2.message);
  }
}
