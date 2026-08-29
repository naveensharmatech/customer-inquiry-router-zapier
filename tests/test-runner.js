/**
 * Test Runner - Run test cases against classifiers
 * Usage: node test-runner.js [priority] [classifier]
 * 
 * Examples:
 *   node test-runner.js              # Run all tests with keyword classifier
 *   node test-runner.js high         # Run HIGH priority tests only
 *   node test-runner.js medium       # Run MEDIUM priority tests only
 *   node test-runner.js low          # Run LOW priority tests only
 *   node test-runner.js all claude   # Run all tests with Claude classifier
 */

const fs = require('fs');
const path = require('path');

// Load test cases
const testCasesPath = path.join(__dirname, 'test-cases.json');
const testCasesData = JSON.parse(fs.readFileSync(testCasesPath, 'utf8'));
const testCases = testCasesData.testCases;

// Load classifiers
const emailClassifier = require('../code/email-classifier');
const utils = require('../code/utils');

/**
 * Run a single test case
 * @param {object} testCase - Test case to run
 * @returns {object} - Test result with passed/failed status
 */
function runTestCase(testCase) {
  try {
    const result = emailClassifier.classify({
      subject: testCase.subject,
      body: testCase.body,
      from: 'test@example.com'
    });

    const passed = result.priority === testCase.expectedPriority;
    
    return {
      id: testCase.id,
      name: testCase.name,
      passed: passed,
      expectedPriority: testCase.expectedPriority,
      actualPriority: result.priority,
      confidence: result.confidence,
      sentiment: result.sentiment,
      intent: result.intent,
      reason: testCase.description
    };
  } catch (error) {
    return {
      id: testCase.id,
      name: testCase.name,
      passed: false,
      error: error.message,
      reason: testCase.description
    };
  }
}

/**
 * Filter test cases by priority
 * @param {array} cases - All test cases
 * @param {string} priority - Filter priority (HIGH, MEDIUM, LOW, or 'all')
 * @returns {array} - Filtered test cases
 */
function filterByPriority(cases, priority) {
  if (priority === 'all' || !priority) return cases;
  
  return cases.filter(testCase => 
    testCase.expectedPriority === priority.toUpperCase()
  );
}

/**
 * Generate test report
 * @param {array} results - Test results
 * @returns {string} - Formatted report
 */
function generateReport(results) {
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(2);

  let report = '\n' + '='.repeat(70) + '\n';
  report += 'TEST RESULTS REPORT\n';
  report += '='.repeat(70) + '\n\n';

  results.forEach((result, index) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    report += `${index + 1}. ${status} - ${result.name}\n`;
    report += `   Expected: ${result.expectedPriority}\n`;
    report += `   Actual: ${result.actualPriority || 'ERROR'}\n`;
    
    if (result.error) {
      report += `   Error: ${result.error}\n`;
    } else {
      report += `   Confidence: ${(result.confidence * 100).toFixed(0)}%\n`;
      report += `   Sentiment: ${result.sentiment}\n`;
      report += `   Intent: ${result.intent}\n`;
    }
    report += '\n';
  });

  report += '='.repeat(70) + '\n';
  report += `SUMMARY: ${passed}/${total} tests passed (${passRate}%)\n`;
  report += '='.repeat(70) + '\n';

  return report;
}

/**
 * Main test execution
 */
function main() {
  const args = process.argv.slice(2);
  const priorityFilter = args[0] || 'all';
  const classifier = args[1] || 'keyword';

  console.log('\n🧪 Running tests...\n');
  console.log(`Priority filter: ${priorityFilter.toUpperCase()}`);
  console.log(`Classifier: ${classifier}\n`);

  // Filter test cases
  const filteredTests = filterByPriority(testCases, priorityFilter);
  
  if (filteredTests.length === 0) {
    console.error(`❌ No test cases found for priority: ${priorityFilter}`);
    process.exit(1);
  }

  console.log(`Found ${filteredTests.length} test case(s) to run...\n`);

  // Run tests
  const results = filteredTests.map(testCase => {
    process.stdout.write(`Running test ${testCase.id}...`);
    const result = runTestCase(testCase);
    console.log(result.passed ? ' ✓' : ' ✗');
    return result;
  });

  // Generate and display report
  const report = generateReport(results);
  console.log(report);

  // Save report to file
  const reportPath = path.join(__dirname, 'test-report.txt');
  fs.writeFileSync(reportPath, report);
  console.log(`Report saved to: ${reportPath}\n`);

  // Exit with appropriate code
  const passedAll = results.every(r => r.passed);
  process.exit(passedAll ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  runTestCase,
  filterByPriority,
  generateReport
};
