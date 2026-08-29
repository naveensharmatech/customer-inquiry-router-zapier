/**
 * Utility Functions
 * Helper functions for email processing and validation
 */

/**
 * Sanitize email text by removing special characters and extra whitespace
 * @param {string} email - Raw email text
 * @returns {string} Sanitized email text
 */
function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return '';
  }
  
  // Remove extra whitespace
  let sanitized = email.trim().replace(/\s+/g, ' ');
  
  // Remove HTML tags if present
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Remove special characters but keep punctuation
  sanitized = sanitized.replace(/[^\w\s\.\,\!\?\-]/g, '');
  
  return sanitized;
}

/**
 * Extract keywords from email text
 * @param {string} text - Email text
 * @returns {array} Array of extracted keywords
 */
function extractKeywords(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Convert to lowercase and split into words
  const words = text.toLowerCase().split(/\s+/);
  
  // Remove common stop words
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'are', 'am', 'was', 'were', 'be', 'been'];
  
  const keywords = words.filter(word => {
    return word.length > 3 && !stopWords.includes(word);
  });
  
  // Return unique keywords
  return [...new Set(keywords)];
}

/**
 * Calculate score for text matching
 * @param {string} text - Text to analyze
 * @param {array} keywords - Keywords to search for
 * @returns {number} Matching score
 */
function calculateScore(text, keywords) {
  if (!text || !keywords || keywords.length === 0) {
    return 0;
  }
  
  let score = 0;
  const lowerText = text.toLowerCase();
  
  keywords.forEach(keyword => {
    // Count occurrences of keyword
    const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
    score += matches;
  });
  
  return score;
}

/**
 * Validate email address format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format timestamp for logging
 * @param {date} date - Date object to format
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Parse email headers from raw email
 * @param {string} emailText - Raw email text including headers
 * @returns {object} Parsed headers (from, to, subject, date)
 */
function parseEmailHeaders(emailText) {
  if (!emailText || typeof emailText !== 'string') {
    return {};
  }
  
  const headers = {};
  const lines = emailText.split('\n');
  
  // Extract headers until blank line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim() === '') {
      break; // End of headers
    }
    
    // Parse header lines
    if (line.includes(':')) {
      const [key, value] = line.split(':', 2);
      const headerKey = key.trim().toLowerCase();
      headers[headerKey] = value.trim();
    }
  }
  
  return headers;
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis if needed
 */
function truncateText(text, maxLength = 100) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Convert priority level to numeric value for sorting
 * @param {string} priority - Priority level (high, medium, low)
 * @returns {number} Numeric priority value
 */
function priorityToNumber(priority) {
  const levels = {
    'high': 3,
    'medium': 2,
    'low': 1
  };
  return levels[priority] || 0;
}

/**
 * Calculate response time SLA in milliseconds
 * @param {string} priority - Priority level
 * @param {number} slaHours - SLA in hours
 * @returns {number} SLA in milliseconds
 */
function calculateSLAMilliseconds(slaHours) {
  if (!slaHours || typeof slaHours !== 'number') {
    return 24 * 60 * 60 * 1000; // Default 24 hours
  }
  
  return slaHours * 60 * 60 * 1000;
}

/**
 * Log message with timestamp
 * @param {string} level - Log level (info, warning, error)
 * @param {string} message - Log message
 */
function log(level, message) {
  const timestamp = formatTimestamp();
  const levelUpper = level.toUpperCase().padEnd(7);
  console.log(`[${timestamp}] ${levelUpper} ${message}`);
}

module.exports = {
  sanitizeEmail,
  extractKeywords,
  calculateScore,
  isValidEmail,
  formatTimestamp,
  parseEmailHeaders,
  truncateText,
  priorityToNumber,
  calculateSLAMilliseconds,
  log
};
