/**
 * Email Classifier Engine
 * Analyzes customer emails for sentiment, intent, and priority
 */

const keywords = require('../config/keywords.json');
const departmentMapping = require('../config/department-mapping.json');

/**
 * Analyze email and determine routing
 * @param {string} emailBody - The email content to analyze
 * @param {string} emailSubject - The email subject
 * @returns {object} Classification result with sentiment, intent, priority, and routing
 */
function classifyEmail(emailBody, emailSubject) {
  const text = `${emailSubject} ${emailBody}`.toLowerCase();
  
  // Analyze sentiment
  const sentiment = analyzeSentiment(text);
  
  // Classify intent
  const intent = classifyIntent(text);
  
  // Calculate priority
  const priority = calculatePriority(text, sentiment, intent);
  
  // Determine department
  const department = getDepartmentRecommendation(intent, priority);
  
  // Calculate confidence score
  const confidence = calculateConfidence(sentiment, intent, priority);
  
  return {
    sentiment: sentiment,
    intent: intent,
    priority: priority,
    summary: generateSummary(emailSubject, sentiment, intent, priority),
    recommended_department: department,
    confidence: confidence
  };
}

/**
 * Analyze email sentiment
 * @param {string} text - Email text to analyze
 * @returns {string} Sentiment value: positive, neutral, or negative
 */
function analyzeSentiment(text) {
  let positiveScore = 0;
  let negativeScore = 0;
  
  // Check positive keywords
  keywords.sentiment.positive.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      positiveScore += 2;
    }
  });
  
  // Check negative keywords
  keywords.sentiment.negative.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      negativeScore += 2;
    }
  });
  
  // Check urgency indicators for negative sentiment
  keywords.urgency.forEach(urgency => {
    if (text.includes(urgency.toLowerCase())) {
      negativeScore += 1;
    }
  });
  
  // Determine sentiment
  if (positiveScore > negativeScore) {
    return 'positive';
  } else if (negativeScore > positiveScore) {
    return 'negative';
  }
  return 'neutral';
}

/**
 * Classify email intent
 * @param {string} text - Email text to analyze
 * @returns {string} Intent: sales, support, billing, feedback, or other
 */
function classifyIntent(text) {
  const intents = ['sales', 'support', 'billing', 'feedback'];
  const scores = {};
  
  // Score each intent
  intents.forEach(intent => {
    scores[intent] = 0;
    keywords.intent[intent].forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) {
        scores[intent] += 1;
      }
    });
  });
  
  // Find highest scoring intent
  let maxScore = 0;
  let bestIntent = 'other';
  
  Object.keys(scores).forEach(intent => {
    if (scores[intent] > maxScore) {
      maxScore = scores[intent];
      bestIntent = intent;
    }
  });
  
  return maxScore > 0 ? bestIntent : 'other';
}

/**
 * Calculate priority level
 * @param {string} text - Email text
 * @param {string} sentiment - Email sentiment
 * @param {string} intent - Email intent
 * @returns {string} Priority: high, medium, or low
 */
function calculatePriority(text, sentiment, intent) {
  let score = 0;
  
  // High score for urgent keywords
  keywords.urgency.forEach(urgency => {
    if (text.includes(urgency.toLowerCase())) {
      score += 10;
    }
  });
  
  // Negative sentiment increases priority
  if (sentiment === 'negative') {
    score += 5;
  }
  
  // Support intent is higher priority
  if (intent === 'support') {
    score += 3;
  }
  
  // Billing is medium-high priority
  if (intent === 'billing') {
    score += 2;
  }
  
  // Determine priority level
  if (score >= 10) {
    return 'high';
  } else if (score >= 5) {
    return 'medium';
  }
  return 'low';
}

/**
 * Get recommended department for routing
 * @param {string} intent - Email intent
 * @param {string} priority - Email priority
 * @returns {object} Department recommendation with email and SLA
 */
function getDepartmentRecommendation(intent, priority) {
  // Map intent to department
  let department = 'general';
  
  if (intent === 'sales') {
    department = 'sales';
  } else if (intent === 'support') {
    department = 'support';
  } else if (intent === 'billing') {
    department = 'billing';
  }
  
  // Get department config
  const deptConfig = departmentMapping[department];
  
  if (!deptConfig) {
    return {
      department: 'general',
      email: 'info@company.com',
      sla_hours: 24
    };
  }
  
  // Get SLA based on priority
  const sla = deptConfig.sla[priority] || 24;
  
  return {
    department: department,
    email: deptConfig.email,
    sla_hours: sla,
    priority_boost: deptConfig.priority_boost
  };
}

/**
 * Calculate confidence score for classification
 * @param {string} sentiment - Sentiment analysis result
 * @param {string} intent - Intent classification result
 * @param {string} priority - Priority calculation result
 * @returns {number} Confidence score 0-1
 */
function calculateConfidence(sentiment, intent, priority) {
  // Base confidence
  let confidence = 0.9;
  
  // Reduce confidence if sentiment is neutral (less clear)
  if (sentiment === 'neutral') {
    confidence -= 0.05;
  }
  
  // Reduce confidence if intent is 'other' (unclear)
  if (intent === 'other') {
    confidence -= 0.1;
  }
  
  // Increase confidence if high priority is detected
  if (priority === 'high') {
    confidence += 0.05;
  }
  
  return Math.min(0.95, confidence);
}

/**
 * Generate summary of email classification
 * @param {string} subject - Email subject
 * @param {string} sentiment - Email sentiment
 * @param {string} intent - Email intent
 * @param {string} priority - Email priority
 * @returns {string} Summary description
 */
function generateSummary(subject, sentiment, intent, priority) {
  return `${priority.charAt(0).toUpperCase() + priority.slice(1)}-priority ${intent} email with ${sentiment} sentiment: "${subject}"`;
}

module.exports = {
  classifyEmail,
  analyzeSentiment,
  classifyIntent,
  calculatePriority,
  getDepartmentRecommendation,
  calculateConfidence
};
