/**
 * Utility functions for email processing
 */

/**
 * Extract email address from a string
 * @param {string} text - Text containing email
 * @returns {string} - Email address or empty string
 */
function extractEmail(text) {
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
}

/**
 * Extract name from email address
 * @param {string} email - Email address
 * @returns {string} - Formatted name
 */
function extractNameFromEmail(email) {
  const namePart = email.split('@')[0];
  return namePart
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Clean email body (remove signatures, quoted text)
 * @param {string} body - Email body
 * @returns {string} - Cleaned body
 */
function cleanEmailBody(body) {
  // Remove common signature patterns
  const cleaned = body
    .split(/--+\s*(forwarded|original)/i)[0]  // Remove forwarded sections
    .split(/On.*?wrote:/i)[0]                   // Remove quoted reply headers
    .split(/Sent from/i)[0]                     // Remove signature
    .trim();
  
  return cleaned;
}

/**
 * Get email excerpt (first N characters)
 * @param {string} text - Full text
 * @param {number} length - Max length
 * @returns {string} - Excerpt
 */
function getExcerpt(text, length = 200) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Check if email is likely auto-reply
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {boolean} - True if likely auto-reply
 */
function isAutoReply(subject, body) {
  const autoReplyIndicators = [
    'auto-reply',
    'automatic reply',
    'out of office',
    'out of the office',
    'i am out',
    'away from desk',
    'will return',
    'autoreply',
    'vacation',
    'automatic',
    'ooo'
  ];

  const combined = (subject + ' ' + body).toLowerCase();
  return autoReplyIndicators.some(indicator => combined.includes(indicator));
}

/**
 * Check if email is from a spam/system address
 * @param {string} email - Sender email
 * @returns {boolean} - True if likely spam/system
 */
function isSystemEmail(email) {
  const systemPatterns = [
    /noreply/i,
    /no-reply/i,
    /postmaster/i,
    /mailer-daemon/i,
    /bounce/i,
    /no-sender/i,
    /automated/i,
    /robot/i,
    /bot/i,
    /zapiermail.com/i
  ];

  return systemPatterns.some(pattern => pattern.test(email));
}

/**
 * Count words in text
 * @param {string} text - Text to count
 * @returns {number} - Word count
 */
function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * Check if email is likely spam
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {boolean} - True if likely spam
 */
function isLikelySpam(subject, body) {
  const spamKeywords = [
    'unsubscribe',
    'marketing',
    'promotional',
    'limited time',
    'click here',
    'act now',
    'buy now',
    'special offer',
    'for sale'
  ];

  const combined = (subject + ' ' + body).toLowerCase();
  const spamCount = spamKeywords.filter(keyword => combined.includes(keyword)).length;

  // If multiple spam keywords found, likely spam
  return spamCount >= 2;
}

/**
 * Truncate text to max length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Max length
 * @returns {string} - Truncated text
 */
function truncateText(text, maxLength = 500) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Format response with name
 * @param {string} name - Customer name
 * @param {string} template - Response template
 * @returns {string} - Formatted response
 */
function formatResponse(name, template) {
  if (!name) name = 'there';
  
  return template
    .replace(/\[NAME\]/g, name)
    .replace(/\[DATE\]/g, new Date().toLocaleDateString())
    .replace(/\[TIME\]/g, new Date().toLocaleTimeString());
}

/**
 * Parse priority with confidence
 * @param {object} classificationResult - Result from classifier
 * @returns {object} - Parsed result
 */
function parsePriority(classificationResult) {
  return {
    priority: classificationResult.priority || 'MEDIUM',
    confidence: classificationResult.confidence || 0.5,
    sentiment: classificationResult.sentiment || 'NEUTRAL',
    intent: classificationResult.intent || 'other',
    isHighConfidence: (classificationResult.confidence || 0) > 0.8
  };
}

/**
 * Generate activity log entry
 * @param {string} priority - Email priority
 * @param {string} email - Customer email
 * @param {string} subject - Email subject
 * @returns {object} - Log entry
 */
function createLogEntry(priority, email, subject) {
  return {
    timestamp: new Date().toISOString(),
    priority: priority,
    email: email,
    subject: subject,
    status: 'processed'
  };
}

module.exports = {
  extractEmail,
  extractNameFromEmail,
  isValidEmail,
  cleanEmailBody,
  getExcerpt,
  isAutoReply,
  isSystemEmail,
  countWords,
  isLikelySpam,
  truncateText,
  formatResponse,
  parsePriority,
  createLogEntry
};
