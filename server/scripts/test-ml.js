// scripts/test-ml.js
import { MLCategoryService } from '../src/services/MLCategoryService.js';

async function testML() {
  console.log('🧪 Testing ML Integration...\n');
  
  const mlService = new MLCategoryService();
  
  // Wait a moment for initial health check
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Force refresh health check
  console.log('Checking ML model health...');
  const isHealthy = await mlService.refreshModelHealth();
  console.log('Model ready:', isHealthy);
  
  // Test cases
  const testCases = [
    'STARBUCKS COFFEE',
    'WALMART SUPERCENTER', 
    'SHELL GAS STATION',
    'AMAZON.COM',
    'MCDONALDS',
    'Target Store'
  ];
  
  console.log('\n=== Running Test Cases ===');
  
  for (const testCase of testCases) {
    console.log(`\nTesting: "${testCase}"`);
    try {
      const result = await mlService.predictCategory(testCase);
      console.log(`Result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
  
  console.log('\n=== Service Test ===');
  await mlService.testService();
  
  process.exit(0);
}

testML().catch(console.error);