/**
 * Test Runner
 * Automated test suite for email classification accuracy
 */

const classifier = require('../code/email-classifier');
const testCases = require('./test-cases.json');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

/**
 * Run test suite
 */
function runTests() {
  console.log(`\n${colors.blue}Running Email Classification Tests${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);
  
  let passed = 0;
  let failed = 0;
  const results = [];
  
  testCases.test_cases.forEach((testCase, index) => {
    const result = runSingleTest(testCase);
    
    if (result.passed) {
      passed++;
      console.log(`${colors.green}✓${colors.reset} Test ${testCase.id}: ${testCase.name}`);
    } else {
      failed++;
      console.log(`${colors.red}✗${colors.reset} Test ${testCase.id}: ${testCase.name}`);
      console.log(`  ${colors.red}Expected: ${JSON.stringify(result.expected)}${colors.reset}`);
      console.log(`  ${colors.red}Got: ${JSON.stringify(result.actual)}${colors.reset}`);
    }
    
    results.push({
      test_id: testCase.id,
      passed: result.passed,
      name: testCase.name
    });
  });
  
  // Print summary
  console.log(`\n${colors.blue}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.blue}Test Results${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);
  
  const total = passed + failed;
  const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  
  if (passed === total) {
    console.log(`${colors.green}✓ All tests passed: ${passed}/${total} (${percentage}%)${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Tests failed: ${failed}/${total}${colors.reset}`);
    console.log(`${colors.green}✓ Tests passed: ${passed}/${total} (${percentage}%)${colors.reset}\n`);
  }
  
  // Print accuracy targets
  console.log(`${colors.yellow}Target Accuracy Metrics:${colors.reset}`);
  console.log(`  Sentiment Analysis: ${testCases.accuracy_targets.sentiment_analysis}%`);
  console.log(`  Intent Classification: ${testCases.accuracy_targets.intent_classification}%`);
  console.log(`  Priority Scoring: ${testCases.accuracy_targets.priority_scoring}%`);
  console.log(`  Routing Accuracy: ${testCases.accuracy_targets.routing_accuracy}%\n`);
  
  return {
    passed,
    failed,
    total,
    percentage,
    results
  };
}

/**
 * Run single test case
 * @param {object} testCase - Test case configuration
 * @returns {object} Test result with passed flag and actual/expected values
 */
function runSingleTest(testCase) {
  try {
    const result = classifier.classifyEmail(testCase.body, testCase.subject);
    
    // Compare results
    const sentimentMatch = result.sentiment === testCase.expected.sentiment;
    const intentMatch = result.intent === testCase.expected.intent;
    const priorityMatch = result.priority === testCase.expected.priority;
    const departmentMatch = result.recommended_department.department === testCase.expected.department;
    
    const passed = sentimentMatch && intentMatch && priorityMatch && departmentMatch;
    
    return {
      passed,
      expected: {
        sentiment: testCase.expected.sentiment,
        intent: testCase.expected.intent,
        priority: testCase.expected.priority,
        department: testCase.expected.department
      },
      actual: {
        sentiment: result.sentiment,
        intent: result.intent,
        priority: result.priority,
        department: result.recommended_department.department
      }
    };
  } catch (error) {
    console.error(`Error running test: ${error.message}`);
    return {
      passed: false,
      error: error.message
    };
  }
}

/**
 * Benchmark email classification performance
 */
function benchmarkPerformance() {
  console.log(`\n${colors.blue}Performance Benchmark${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}\n`);
  
  const times = [];
  const iterations = 100;
  
  for (let i = 0; i < iterations; i++) {
    const testCase = testCases.test_cases[i % testCases.test_cases.length];
    
    const startTime = process.hrtime.bigint();
    classifier.classifyEmail(testCase.body, testCase.subject);
    const endTime = process.hrtime.bigint();
    
    const timeMs = Number(endTime - startTime) / 1000000;
    times.push(timeMs);
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const maxTime = Math.max(...times);
  const minTime = Math.min(...times);
  
  console.log(`Average processing time: ${avgTime.toFixed(2)}ms`);
  console.log(`Min processing time: ${minTime.toFixed(2)}ms`);
  console.log(`Max processing time: ${maxTime.toFixed(2)}ms`);
  console.log(`Iterations: ${iterations}\n`);
  
  if (avgTime <= testCases.performance_targets.avg_processing_time_ms) {
    console.log(`${colors.green}✓ Performance target met (${avgTime.toFixed(2)}ms <= ${testCases.performance_targets.avg_processing_time_ms}ms)${colors.reset}\n`);
  } else {
    console.log(`${colors.red}✗ Performance target not met (${avgTime.toFixed(2)}ms > ${testCases.performance_targets.avg_processing_time_ms}ms)${colors.reset}\n`);
  }
}

// Run tests if executed directly
if (require.main === module) {
  const results = runTests();
  benchmarkPerformance();
  
  process.exit(results.failed > 0 ? 1 : 0);
}

module.exports = {
  runTests,
  runSingleTest,
  benchmarkPerformance
};
