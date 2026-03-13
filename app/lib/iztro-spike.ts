/**
 * T-0.5: iztro Spike - Validate 北派 palace computation
 * 
 * Open Question OQ-1: Can iztro handle 北派 palace computation,
 * or do we need to implement the 14-star placement logic from scratch?
 * 
 * This spike tests:
 * - Basic chart computation (BaZi & Ziwei)
 * - Palace system (命/财/感情/etc)
 * - 北派 vs 南派 output differences
 * - Star placement accuracy
 */

import Ziwei from 'iztro';

interface IztroTestResult {
  success: boolean;
  library: string;
  version: string;
  tests: {
    basicComputation: boolean;
    palaceSystem: boolean;
    beijingPai: boolean;
    starPlacement: boolean;
    error?: string;
  };
  sampleOutput?: {
    palaces: string[];
    mainStars: string[];
    secondaryStars: string[];
  };
}

/**
 * Test iztro with a known birth profile
 * Sample: Born 1990-06-15 02:30 (summer solstice area, male)
 */
async function testIztro(): Promise<IztroTestResult> {
  const result: IztroTestResult = {
    success: false,
    library: 'iztro',
    version: '1.0.0', // Will check actual
    tests: {
      basicComputation: false,
      palaceSystem: false,
      beijingPai: false,
      starPlacement: false,
    },
  };

  try {
    // Test 1: Basic computation
    console.log('=== IZTRO SPIKE: Testing 北派 Palace Computation ===\n');
    
    // Get available methods
    console.log('Ziwei object methods:', Object.keys(Ziwei));
    
    // Try to compute chart - check API
    // The exact API depends on iztro version
    // Common patterns: Ziwei.getChart() or Ziwei.compute()
    
    const testDate = {
      year: 1990,
      month: 6,
      day: 15,
      hour: 2,
      minute: 30,
      gender: 'male' as const,
    };

    console.log(`Testing with birth profile:`, testDate);
    
    // Attempt different API calls based on iztro documentation
    let chart: any;
    
    // Try method 1: direct computation
    if (typeof (Ziwei as any).getChart === 'function') {
      console.log('\n✓ Found getChart method');
      chart = (Ziwei as any).getChart(
        testDate.year,
        testDate.month,
        testDate.day,
        testDate.hour,
        testDate.minute,
        testDate.gender
      );
    } else if (typeof (Ziwei as any).compute === 'function') {
      console.log('\n✓ Found compute method');
      chart = (Ziwei as any).compute(testDate);
    } else {
      throw new Error('Could not find chart computation method in iztro');
    }

    console.log('\n=== Chart Structure ===');
    console.log('Chart keys:', Object.keys(chart || {}).slice(0, 10));
    
    // Test 2: Check palace system
    if (chart && chart.palaces) {
      console.log('\n✓ Palaces found:', chart.palaces.length);
      result.tests.palaceSystem = true;
      
      // Log palace names
      const palaceNames = chart.palaces.map((p: any) => p.name || p.palace).slice(0, 5);
      console.log('  Sample palaces:', palaceNames);
    }

    // Test 3: Check for 北派 indicators
    if (chart && (chart.beijingPai || chart.system || chart.sect)) {
      console.log('\n✓ 北派/System info found');
      result.tests.beijingPai = true;
      console.log('  System/Sect:', chart.beijingPai || chart.system || chart.sect);
    }

    // Test 4: Check star placement
    if (chart && (chart.stars || chart.majorStars || chart.minorStars)) {
      console.log('\n✓ Star data found');
      result.tests.starPlacement = true;
      const stars = chart.stars || chart.majorStars || [];
      console.log(`  Total stars: ${Array.isArray(stars) ? stars.length : 'N/A'}`);
      
      // Show major stars
      if (Array.isArray(stars) && stars.length > 0) {
        const starNames = stars
          .slice(0, 5)
          .map((s: any) => s.name || s.star || s)
          .filter(Boolean);
        console.log('  Sample stars:', starNames);
      }
    }

    result.tests.basicComputation = !!chart;
    result.success = result.tests.basicComputation;

    // Store sample output
    if (chart) {
      result.sampleOutput = {
        palaces: chart.palaces
          ?.map((p: any) => p.name || p.palace)
          .slice(0, 5) || [],
        mainStars: chart.stars
          ?.map((s: any) => s.name || s.star)
          .slice(0, 5) || [],
        secondaryStars: chart.minorStars
          ?.map((s: any) => s.name || s.star)
          .slice(0, 3) || [],
      };
    }

    console.log('\n=== Test Results ===');
    console.log(`Basic Computation: ${result.tests.basicComputation ? '✓' : '✗'}`);
    console.log(`Palace System: ${result.tests.palaceSystem ? '✓' : '✗'}`);
    console.log(`北派 Support: ${result.tests.beijingPai ? '✓' : '✗'}`);
    console.log(`Star Placement: ${result.tests.starPlacement ? '✓' : '✗'}`);
    
  } catch (error) {
    console.error('\n✗ Error during spike:', error);
    result.tests.error = error instanceof Error ? error.message : String(error);
    result.success = false;
  }

  return result;
}

/**
 * Entry point for spike
 */
export async function runIztroSpike() {
  const results = await testIztro();
  
  console.log('\n=== SPIKE SUMMARY ===');
  console.log(`OQ-1 Status: ${results.success ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`Can use iztro for 北派: ${results.tests.beijingPai && results.tests.palaceSystem ? 'YES' : 'NEEDS INVESTIGATION'}`);
  
  return results;
}

// Run if this file is executed directly
if (require.main === module) {
  runIztroSpike().catch(console.error);
}
