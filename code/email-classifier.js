/**
 * Email Classifier - Keyword-based email classification
 * Classifies emails as HIGH, MEDIUM, or LOW priority
 * 
 * This is a fallback classifier that doesn't require Claude API
 * Used when Claude API is unavailable
 */

const keywords = {
  urgent: ['urgent', 'asap', 'emergency', 'immediately', 'now', 'critical', 'help!', 'sos'],
  upset: ['upset', 'angry', 'frustrated', 'disappointed', 'furious', 'hate', 'terrible', 'worst'],
  problem: ['problem', 'issue', 'error', 'bug', 'broken', 'not working', 'failed'],
  billing: ['charge', 'invoice', 'refund', 'payment', 'subscription', 'billing'],
  support: ['help', 'assist', 'support', 'cannot access', 'account issue'],
  sales: ['buy', 'pricing', 'cost', 'plans', 'demo', 'trial'],
  feedback: ['feedback', 'suggestion', 'improve', 'idea', 'request']
};

/**
 * Classify email based on keywords and patterns
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {object} - Classification result with priority, confidence, intent, sentiment
 */
function classifyEmail(subject, body) {
  if (!subject || !body) {
    return {
      priority: 'MEDIUM',
      confidence: 0.5,
      intent: 'other',
      sentiment: 'NEUTRAL',
      reason: 'Insufficient data'
    };
  }

  const text = (subject + ' ' + body).toLowerCase();
  const signals = {
    urgent: matchKeywords(text, keywords.urgent),
    upset: matchKeywords(text, keywords.upset),
    problem: matchKeywords(text, keywords.problem),
    billing: matchKeywords(text, keywords.billing),
    support: matchKeywords(text, keywords.support),
    sales: matchKeywords(text, keywords.sales) || /\bevaluating your product\b/.test(text),
    feedback: matchKeywords(text, keywords.feedback),
    positive: analyzeSentiment(text) === 'POSITIVE'
  };
  // Resolve praise before historical problem/support words in thank-you messages.
  const resolvedPraise = signals.positive && !signals.urgent && !signals.upset
    && /\b(solved?|resolved|fixed|great service|great work)\b/.test(text);
  const actionableProblem = signals.problem && !resolvedPraise;
  let intent = 'other';
  if (resolvedPraise || (signals.feedback && !signals.urgent && !signals.upset && !actionableProblem)) intent = 'feedback';
  else if (signals.billing && (signals.urgent || actionableProblem || !signals.support)) intent = 'billing';
  else if (signals.support) intent = 'support';
  else if (signals.sales) intent = 'sales';
  else if (signals.feedback) intent = 'feedback';

  // Explicit routing rules: urgent/upset/actionable problems outrank routine requests.
  // These scores indicate rule strength, not calibrated probabilities.
  let maxPriority = 'LOW';
  let score = 0.3;
  if (signals.urgent || signals.upset || actionableProblem) {
    maxPriority = 'HIGH';
    score = 0.9;
  } else if (!resolvedPraise && ['billing', 'support', 'sales'].includes(intent)) {
    maxPriority = 'MEDIUM';
    score = 0.6;
  }
  const foundKeywords = Object.keys(signals).filter(key => signals[key]);
  const sentiment = analyzeSentiment(text);

  return {
    priority: maxPriority,
    confidence: Math.min(score, 1.0),
    intent: intent,
    sentiment: sentiment,
    foundKeywords: foundKeywords,
    score: score
  };
}

/**
 * Check if text contains any keywords from array
 * @param {string} text - Text to search
 * @param {array} keywordArray - Array of keywords to find
 * @returns {boolean} - True if any keyword found
 */
function matchKeywords(text, keywordArray) {
  return keywordArray.some(keyword => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(?:^|[^a-z0-9])' + escaped + '(?=$|[^a-z0-9])', 'i').test(text);
  });
}

/**
 * Extract sender name from email or subject
 * @param {string} from - Sender email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {object} - First and last name
 */
function extractName(from, subject, body) {
  // Try to extract from email local part
  const emailMatch = from.match(/^([a-z0-9._\-]+)@/i);
  if (emailMatch) {
    const namePart = emailMatch[1]
      .replace(/[._\-]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
    
    const nameParts = namePart.split(' ').filter(p => p.length > 0);
    return {
      firstName: nameParts[0] || 'Customer',
      lastName: nameParts.slice(1).join(' ') || ''
    };
  }

  return {
    firstName: 'Customer',
    lastName: ''
  };
}

/**
 * Analyze email sentiment
 * @param {string} text - Email text
 * @returns {string} - POSITIVE, NEUTRAL, or NEGATIVE
 */
function analyzeSentiment(text) {
  const positive = ['thank', 'appreciate', 'grateful', 'excellent', 'love', 'amazing', 'great', 'wonderful'];
  const negative = ['upset', 'angry', 'frustrated', 'disappointed', 'hate', 'terrible', 'worst', 'awful'];

  const lowerText = text.toLowerCase();
  const positiveCount = positive.filter(word => matchKeywords(lowerText, [word])).length;
  const negativeCount = negative.filter(word => matchKeywords(lowerText, [word])).length;

  if (negativeCount > positiveCount) return 'NEGATIVE';
  if (positiveCount > 0) return 'POSITIVE';
  return 'NEUTRAL';
}

/**
 * Main classification function
 * @param {object} emailData - Email data object
 * @returns {object} - Full classification result
 */
function classify(emailData) {
  const { subject, body, from } = emailData;
  
  if (!subject || !body || !from) {
    throw new Error('Missing required email data: subject, body, from');
  }

  const classification = classifyEmail(subject, body);
  const nameInfo = extractName(from, subject, body);

  return {
    priority: classification.priority,
    sentiment: classification.sentiment,
    intent: classification.intent,
    confidence: classification.confidence,
    foundKeywords: classification.foundKeywords,
    name: nameInfo,
    metadata: {
      classifier: 'keyword-based',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  };
}

module.exports = {
  classify,
  classifyEmail,
  analyzeSentiment,
  extractName,
  matchKeywords
};

