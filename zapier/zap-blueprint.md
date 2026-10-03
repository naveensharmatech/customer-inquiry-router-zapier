# Zap Blueprint: Customer Inquiry Router

## Visual Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    ZAPIER WORKFLOW                              │
└─────────────────────────────────────────────────────────────────┘

                            ┌──────────────┐
                            │   Gmail      │
                            │  New Email   │
                            └──────┬───────┘
                                   │
                    Email Input: subject, body, from
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │  Code by Zapier       │
                       │  (Step 2)             │
                       │                       │
                       │ Call Claude API       │
                       │ Analyze Email         │
                       │ Return Priority       │
                       └───────────┬───────────┘
                                   │
                   Output: priority (HIGH/MEDIUM/LOW)
                                   │
                    ┌──────────────┴──────────────┐
                    │   Path Routing              │
                    │   (Step 3)                  │
                    │                             │
                    └─┬─────────────┬─────────────┤
                      │             │             │
                ┌─────▼──┐   ┌──────▼──┐   ┌─────▼──┐
                │ Path A  │   │ Path B  │   │ Path C  │
                │ HIGH    │   │ MEDIUM  │   │ LOW     │
                └─────┬──┘   └──────┬──┘   └─────┬──┘
                      │             │             │
        ┌─────────────┘             │             └─────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
   ┌─────────┐              ┌─────────────┐            ┌─────────────┐
   │ Gmail   │              │ HubSpot     │            │ Gmail Send  │
   │ Send    │              │ Create      │            │ FAQ         │
   │ Urgent  │              │ Contact     │            │ Response    │
   │Response │              │             │            │             │
   └─────────┘              │ + Gmail     │            └─────────────┘
                            │ Send Normal │
                            │ Response    │
                            └─────────────┘

LEGEND:
□ = Zapier App/Action
→ = Data Flow
▼ = Decision Point
```

---

## Detailed Step Breakdown

### TRIGGER (Step 1): Gmail - New Email

**Event:** When a new email arrives in Gmail

**Captured Data:**
- `id` - Message ID
- `from` - Sender email address
- `to` - Recipient email address
- `subject` - Email subject line
- `body` - Email body content
- `bodyPlain` - Plain text version
- `bodyHtml` - HTML version
- `timestamp` - When email was received
- `isUnread` - Read/unread status

**Pass to:** Step 2 (Claude API)

---

### STEP 2: Code by Zapier - Run JavaScript

**Purpose:** Call Claude API to classify email priority

**Configuration:**
- **App:** Code by Zapier
- **Action:** Run JavaScript
- **Environment Variables:** CLAUDE_API_KEY

**JavaScript Code:**
```javascript
const email = {
  subject: inputData.subject,
  body: inputData.body || inputData.bodyPlain,
  from: inputData.from
};

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.CLAUDE_API_KEY,
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    system: 'Analyze email and return priority: HIGH, MEDIUM, or LOW',
    messages: [{
      role: 'user',
      content: `Email Subject: ${email.subject}\n\nEmail Body: ${email.body}`
    }]
  })
});

const data = await response.json();
const priority = data.content[0].text.trim().toUpperCase();

return {
  priority: priority,
  subject: email.subject,
  from: email.from
};
```

**Output Data:**
- `priority` - HIGH, MEDIUM, or LOW
- `subject` - Original email subject
- `from` - Sender email

**Pass to:** Step 3 (Path Routing)

---

### STEP 3: Paths - Route Based on Priority

**Purpose:** Execute different actions based on priority classification

#### **PATH A: High Priority**
**Condition:** `priority exactly matches HIGH`

**Actions:**
1. **Gmail - Send Email**
   - **To:** `from` (sender's email)
   - **Subject:** "Urgent: Your inquiry - Immediate support"
   - **Body:** Urgent response template
   - **Purpose:** Notify customer of urgent handling

---

#### **PATH B: Medium Priority**
**Condition:** `priority exactly matches MEDIUM`

**Actions:**
1. **HubSpot - Create Contact**
   - **Email:** `from`
   - **First Name:** Customer (or extracted from email)
   - **Custom Field - Priority:** `priority` (MEDIUM)
   - **Purpose:** Add to CRM for follow-up

2. **Gmail - Send Email**
   - **To:** `from`
   - **Subject:** "Re: Your inquiry"
   - **Body:** Standard response template
   - **Purpose:** Acknowledge inquiry receipt

---

#### **PATH C: Low Priority**
**Condition:** `priority exactly matches LOW`

**Actions:**
1. **Gmail - Send Email**
   - **To:** `from`
   - **Subject:** "FAQ: Common questions"
   - **Body:** FAQ/informational response
   - **Purpose:** Provide self-service solution

---

## Email Classification Logic

### Classification Criteria

```
CLAUDE API ANALYSIS
├── Email Sentiment
│   ├── NEGATIVE → higher priority
│   ├── NEUTRAL → medium priority
│   └── POSITIVE → lower priority
│
├── Urgency Indicators
│   ├── URGENT, ASAP, EMERGENCY → HIGH
│   ├── Help, Support, Question → MEDIUM
│   └── General inquiry, FAQ → LOW
│
├── Problem Severity
│   ├── Account/Billing issues → HIGH
│   ├── Feature questions → MEDIUM
│   └── Information requests → LOW
│
└── Customer Satisfaction
    ├── Upset/Angry → HIGH
    ├── Neutral tone → MEDIUM
    └── Happy/Satisfied → LOW
```

---

## Integration Connections

These are connection points in the reference design, not a claim that an external account is currently connected or active. Configure and verify each connection in your own Zapier account.

### 1. Gmail Integration
- **Connected as:** Gmail trigger (Step 1)
- **Permissions:** Read emails, Send emails
- **Account:** Your Gmail account
- **Status:** Requires configuration and account verification

### 2. Claude API Integration
- **Connected as:** External API (Step 2)
- **Endpoint:** https://api.anthropic.com/v1/messages
- **Authentication:** API Key
- **Headers:** x-api-key, content-type
- **Status:** Requires configuration and account verification

### 3. HubSpot Integration
- **Connected as:** CRM action (Step 3, Path B)
- **Action:** Create/Update contacts
- **Permissions:** Read/Write contacts
- **Fields Mapped:** Email, First Name, Priority
- **Status:** Requires configuration and account verification

---

## Data Flow Summary

```
Email Arrives
    ↓
Gmail Captures (id, from, subject, body, etc.)
    ↓
Code Step Calls Claude API
    ↓
Claude Returns Priority (HIGH/MEDIUM/LOW)
    ↓
Zap Routes to Correct Path
    ↓
Path A: Send urgent response email
Path B: Create HubSpot contact + Send normal response email
Path C: Send FAQ response email
    ↓
Customer Receives Response
Customer Added to CRM (if MEDIUM/HIGH)
```

---

## Performance Measurement

This repository does not include verified production telemetry for latency, accuracy, success rate, or capacity. Measure these values in the target account using the definitions in [`docs/PERFORMANCE.md`](../docs/PERFORMANCE.md).

| Measure | Evidence to collect |
|---|---|
| Execution time | Zapier step/run timestamps; report median and P90 |
| Success rate | Successful eligible executions / all eligible executions |
| Classification quality | Human-reviewed correct labels / reviewed messages, with sample size |
| Capacity | Plan/task limits, provider limits, peak volume, and queue delay |
| Delivery | Confirmed email action/delivery evidence, not only a completed Zap run |

---

## Error Handling & Fallbacks

```
If Claude API Fails
├── Network Error → Use bounded retry/backoff configured in the Zap
├── API Error (401/403) → Check API key
├── Rate Limit (429) → Queue and retry
└── Invalid Response → Route to human review or an explicitly approved fallback

If HubSpot Integration Fails
├── Authentication Error → Check API key
├── Field Mapping Error → Use defaults
└── Duplicate Detection → Update existing contact

If Gmail Send Fails
├── Invalid email → Skip send
├── Authentication Error → Reconnect account
└── Spam Filter → Check sent mail
```

---

## Monitoring & Logging

### Zapier Dashboard
- **Runs:** View all execution history
- **Errors:** Track failed executions
- **Logs:** See detailed step output
- **Metrics:** Success rate, execution time

### Things to Monitor
1. Email volume and classification distribution
2. Error rates and types
3. Claude API latency
4. HubSpot contact creation success
5. Response email delivery

---

## Configuration Files

This Zap uses configuration files for:
- `config/email-config.json` - Email classification settings
- `config/keywords.json` - Priority keywords
- `config/claude-config.json` - Claude API settings
- `config/hubspot-fields.json` - HubSpot field mappings

See main documentation for detailed configuration guide.

---

## Testing the Zap

### Manual Testing
1. Send test email to your Gmail account
2. Monitor Zapier runs in real-time
3. Check if email is classified correctly
4. Verify response email is received
5. Check HubSpot for contact creation

### Using Test Cases
Run provided test cases:
```bash
npm test              # Run all test cases
npm run test:high    # Test HIGH priority
npm run test:medium  # Test MEDIUM priority
npm run test:low     # Test LOW priority
```

---

## Customization Options

### Change Classification Logic
Edit the Claude system prompt in Step 2

### Add More Paths
Add additional conditions for different priorities or intents

### Custom Response Templates
Edit email body templates in each path

### Add Fields to HubSpot
Map additional fields in HubSpot contact creation

### Integrate Other Services
Add more actions to paths (e.g., Slack notifications)
