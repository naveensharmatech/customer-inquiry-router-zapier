/**
 * Zapier Step 2: Code by Zapier - Run JavaScript
 * 
 * This is the actual JavaScript code used in the Zapier workflow
 * to classify customer emails using Claude API.
 * 
 * USAGE:
 * Copy this code into your Zapier "Code by Zapier" step
 * Ensure CLAUDE_API_KEY environment variable is set in Zapier
 */

// Extract email data from Zapier input
const email = {
  subject: inputData.subject,
  body: inputData.body || inputData.bodyPlain,
  from: inputData.from
};

// Validate input
if (!email.subject || !email.body || !email.from) {
  throw new Error('Missing required fields: subject, body, from');
}

// Call Claude API to classify email priority
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.CLAUDE_API_KEY,
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    system: `Analyze this customer email and score priority: 
HIGH (urgent/upset), 
MEDIUM (normal), 
or LOW (info request). 
Return only the priority level.`,
    messages: [{
      role: 'user',
      content: `Email Subject: ${email.subject}\n\nEmail Body: ${email.body}`
    }]
  })
});

// Handle API response
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(`Claude API error: ${response.status} - ${JSON.stringify(errorData)}`);
}

// Parse response and extract priority
const data = await response.json();
const priority = data.content[0].text.trim().toUpperCase();

// Validate priority value
const validPriorities = ['HIGH', 'MEDIUM', 'LOW'];
if (!validPriorities.includes(priority)) {
  throw new Error(`Invalid priority returned: ${priority}`);
}

// Return output for Zapier (passed to Paths)
return {
  priority: priority,
  subject: email.subject,
  from: email.from,
  // Optional: add timestamp for logging
  processedAt: new Date().toISOString()
};

/**
 * CONFIGURATION REQUIRED IN ZAPIER:
 * 
 * 1. Environment Variables:
 *    - CLAUDE_API_KEY = sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * 
 * 2. Input Mapping:
 *    - subject: {{step_1.subject}}
 *    - body: {{step_1.body}}
 *    - bodyPlain: {{step_1.bodyPlain}}
 *    - from: {{step_1.from}}
 * 
 * 3. Output Fields (mapped to Path routing):
 *    - priority (STRING): HIGH, MEDIUM, or LOW
 *    - subject (STRING): Original email subject
 *    - from (STRING): Sender email address
 *    - processedAt (STRING): ISO timestamp
 * 
 * 4. Error Handling:
 *    - If API call fails, the Zap will error
 *    - Check Zapier logs for detailed error message
 *    - Verify API key is valid
 * 
 * TROUBLESHOOTING:
 * 
 * Error: "CLAUDE_API_KEY not found"
 * → Add environment variable in Code step
 * 
 * Error: "Invalid API key"
 * → Check key in Anthropic console
 * → Ensure key is not expired
 * 
 * Error: "Rate limit exceeded"
 * → Wait a moment, request will retry
 * → Check your API usage in Anthropic console
 * 
 * Error: "Invalid priority returned"
 * → Claude returned something other than HIGH/MEDIUM/LOW
 * → Update Claude system prompt if needed
 */
