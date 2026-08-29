/**
 * Claude AI Classifier - Uses Claude API for email classification
 * This is the production classifier used in the Zapier workflow
 * 
 * Classifies emails as HIGH, MEDIUM, or LOW priority using Claude AI
 */

require('dotenv').config();

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-5-sonnet-20241022';
const MAX_TOKENS = 500;

const systemPrompt = `You are an AI assistant that analyzes customer emails for priority classification. Analyze the provided email and determine its priority level based on urgency, sentiment, and intent.

Return ONLY one of these priority levels:
- HIGH: Urgent customer issues, upset/angry customers, critical problems
- MEDIUM: Normal customer inquiries requiring attention
- LOW: General informational requests, FAQ questions, feedback

Consider:
1. Email tone and sentiment
2. Keywords indicating urgency (urgent, asap, emergency, help, etc.)
3. Problem severity (broken features, account issues, billing problems)
4. Customer satisfaction level

Return only the priority level (HIGH, MEDIUM, or LOW), nothing else.`;

/**
 * Call Claude API for email classification
 * @param {object} emailData - Email data {subject, body, from}
 * @returns {Promise<object>} - Classification result
 */
async function classifyWithClaude(emailData) {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY not set in environment variables');
  }

  const { subject, body, from } = emailData;
  
  if (!subject || !body) {
    throw new Error('Missing required fields: subject and body');
  }

  const userMessage = `Email Subject: ${subject}

Email Body: ${body}

Classify this email's priority level.`;

  try {
    const response = await fetch(CLAUDE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Claude API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const priority = data.content[0].text.trim().toUpperCase();

    // Validate response
    if (!['HIGH', 'MEDIUM', 'LOW'].includes(priority)) {
      throw new Error(`Invalid priority returned: ${priority}`);
    }

    return {
      priority: priority,
      sentiment: 'UNKNOWN', // Could be enhanced with separate sentiment call
      intent: 'UNKNOWN',    // Could be enhanced with separate intent call
      confidence: 0.95,      // Claude is quite confident
      metadata: {
        classifier: 'claude-api',
        model: MODEL,
        tokensUsed: {
          input: data.usage?.input_tokens || 0,
          output: data.usage?.output_tokens || 0
        },
        timestamp: new Date().toISOString(),
        from: from
      }
    };
  } catch (error) {
    throw new Error(`Claude classification error: ${error.message}`);
  }
}

/**
 * Extended classification with sentiment and intent
 * Requires multiple API calls
 * @param {object} emailData - Email data
 * @returns {Promise<object>} - Full classification result
 */
async function classifyExtended(emailData) {
  const { subject, body } = emailData;

  const sentimentPrompt = `Analyze the sentiment of this email. Return only: POSITIVE, NEUTRAL, or NEGATIVE

Email Subject: ${subject}
Email Body: ${body}`;

  const intentPrompt = `What is the primary intent of this email? Return only one:
- sales
- support
- billing
- feedback
- other

Email Subject: ${subject}
Email Body: ${body}`;

  try {
    // Get priority
    const priorityResult = await classifyWithClaude(emailData);

    // Get sentiment
    const sentimentResponse = await fetch(CLAUDE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 50,
        messages: [{ role: 'user', content: sentimentPrompt }]
      })
    });

    const sentimentData = await sentimentResponse.json();
    const sentiment = sentimentData.content[0].text.trim().toUpperCase();

    // Get intent
    const intentResponse = await fetch(CLAUDE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'x-api-key': CLAUDE_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 50,
        messages: [{ role: 'user', content: intentPrompt }]
      })
    });

    const intentData = await intentResponse.json();
    const intent = intentData.content[0].text.trim().toLowerCase();

    return {
      priority: priorityResult.priority,
      sentiment: sentiment,
      intent: intent,
      confidence: 0.95,
      metadata: {
        classifier: 'claude-api-extended',
        model: MODEL,
        timestamp: new Date().toISOString(),
        calls: 3 // priority, sentiment, intent
      }
    };
  } catch (error) {
    throw new Error(`Extended classification error: ${error.message}`);
  }
}

/**
 * Wrapper for Zapier compatibility
 * Returns simple priority classification
 * @param {object} inputData - Zapier input data
 * @returns {Promise<object>} - Classification result
 */
async function classifyForZapier(inputData) {
  const emailData = {
    subject: inputData.subject,
    body: inputData.body,
    from: inputData.from
  };

  return classifyWithClaude(emailData);
}

module.exports = {
  classifyWithClaude,
  classifyExtended,
  classifyForZapier,
  CLAUDE_API_KEY,
  MODEL
};
