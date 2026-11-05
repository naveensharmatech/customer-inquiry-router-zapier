const { test } = require('node:test');
const assert = require('node:assert/strict');
const { classifyEmail, matchKeywords } = require('../code/email-classifier');
const { parsePriority, countWords } = require('../code/utils');

test('keywords do not match inside unrelated words', () => {
  assert.equal(matchKeywords('I know whatever you mean.', ['now', 'hate']), false);
  assert.equal(matchKeywords('This is urgent!', ['urgent']), true);
  assert.equal(matchKeywords('error: help! please', ['help!']), true);
});

test('routine sales and password help do not require combined urgency signals', () => {
  assert.equal(classifyEmail('Pricing', 'Please explain your plans.').priority, 'MEDIUM');
  assert.equal(classifyEmail('Password reset', 'I need help resetting my password.').priority, 'MEDIUM');
});

test('urgent billing preserves billing intent even when help is requested', () => {
  const result = classifyEmail('Urgent charge', 'Please help with an unexpected charge.');
  assert.equal(result.priority, 'HIGH');
  assert.equal(result.intent, 'billing');
});

test('resolved praise is low priority but an ongoing urgent problem stays high', () => {
  assert.equal(classifyEmail('Thank you', 'You helped solve my problem. Great work!').priority, 'LOW');
  assert.equal(classifyEmail('Thank you', 'I appreciate your help, but this error is urgent.').priority, 'HIGH');
});

test('zero confidence and whitespace-only word counts are preserved correctly', () => {
  assert.equal(parsePriority({ confidence: 0 }).confidence, 0);
  assert.equal(countWords('   \n  '), 0);
  assert.equal(countWords('one two'), 2);
});
