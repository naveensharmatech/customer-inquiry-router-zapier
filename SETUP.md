# Setup Instructions

## 📋 Prerequisites

Before you start, you'll need:

- ✅ **Zapier Account** (free tier works)
- ✅ **Claude API Key** (free trial available)
- ✅ **HubSpot Account** (free CRM)
- ✅ **Gmail Account** (for email trigger)
- ✅ **5 minutes** to set up

---

## Step 1: Get Claude API Key

### 1.1 Create Anthropic Account
- Go to: https://console.anthropic.com
- Click: "Sign up"
- Enter email & password
- Verify email

### 1.2 Generate API Key
- Go to: "API Keys" section
- Click: "Create Key"
- Copy the key (starts with `sk-`)
- **Keep this secret!** Don't share

### 1.3 Save for Later
- Paste key somewhere safe
- You'll need it in Step 3

---

## Step 2: Set Up Zapier Workflow

### 2.1 Create Zapier Account
- Go to: https://zapier.com
- Click: "Sign up"
- Use your email
- Verify account

### 2.2 Create New Zap
- Click: "Create Zap"
- Name it: "AI Customer Inquiry Router"

---

## Step 3: Add Gmail Trigger

### 3.1 Connect Gmail
- In Zapier, click: "Add Trigger"
- Search: "Gmail"
- Select: "New Email"
- Click: "Connect Gmail account"
- Authorize Zapier to access Gmail

### 3.2 Configure Trigger
- **From:** (leave blank to catch all emails)
- **Search:** (optional filter)
- Click: "Continue"

---

## Step 4: Add Claude AI Step

### 4.1 Add Action
- Click: "Add Action"
- Search: "Code by Zapier"
- Select: "Run JavaScript"

### 4.2 Paste Claude Code
Copy this code into the JavaScript box:

```javascript
// Extract email content
const email = {
  subject: inputData.subject,
  body: inputData.body,
  from: inputData.from
};

// Call Claude API
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.CLAUDE_API_KEY,
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    system: 'Analyze this customer email and score priority: HIGH (urgent/upset), MEDIUM (normal), or LOW (info request). Return only the priority level.',
    messages: [{
      role: 'user',
      content: `Email Subject: ${email.subject}\n\nEmail Body: ${email.body}`
    }]
  })
});

const data = await response.json();
const priority = data.content[0].text.toUpperCase();

return { 
  priority: priority,
  subject: email.subject,
  from: email.from
};
```

### 4.3 Add Environment Variable
- Click: "Environment"
- Add Variable: `CLAUDE_API_KEY`
- Paste your API key from Step 1
- Click: "Continue"

---

## Step 5: Add Routing Paths

### 5.1 Add Path Condition
- Click: "Add Path"
- Set condition: `priority` exactly matches `HIGH`
- This is **Path A** (High priority)

### 5.2 Add Path B
- Click: "Add Path"
- Set condition: `priority` exactly matches `MEDIUM`
- This is **Path B** (Medium priority)

### 5.3 Add Path C
- Click: "Add Path"
- Set condition: `priority` exactly matches `LOW`
- This is **Path C** (Low priority)

---

## Step 6: Add HubSpot Integration

### 6.1 Connect HubSpot (Only for Path B)
- In Path B, click: "Add Action"
- Search: "HubSpot"
- Select: "Create Contact"
- Click: "Connect HubSpot"
- Authorize access

### 6.2 Map Fields
- **Email:** map to `from`
- **First Name:** extract from email or use "Customer"
- **Priority:** map to `priority`
- Click: "Continue"

---

## Step 7: Add Email Responses

### 7.1 Path A Response (High Priority)
- Add Action: "Gmail"
- Select: "Send Email"
- **To:** map to `from`
- **Subject:** "Urgent: Your inquiry - Immediate support"
- **Body:**
- Hi [Customer Name],

Thank you for reaching out! We've marked your inquiry as HIGH PRIORITY.

Our team will respond within 30 minutes.

Best regards,
Support Team

### 7.2 Path B Response (Medium Priority)
- Add Action: "Gmail"
- Select: "Send Email"
- **To:** map to `from`
- **Subject:** "Re: Your inquiry"
- **Body:**
- Hi [Customer Name],

Thank you for contacting us. Your inquiry has been received and assigned to our support team.

We'll respond within 2 hours.

Best regards,
Support Team

### 7.3 Path C Response (Low Priority)
- Add Action: "Gmail"
- Select: "Send Email"
- **To:** map to `from`
- **Subject:** "FAQ: Common questions"
- **Body:**
- 
Hi [Customer Name],

Thank you for your message. Please check our FAQ for quick answers:
[Link to FAQ]

If you need more help, we're here for you.

Best regards,
Support Team Common questions"
- **Body:**
- 
---

## Step 8: Test the Workflow

### 8.1 Send Test Email
- Send yourself an email with subject like:
  - "URGENT: I need help immediately!" (tests HIGH)
  - "Can you help with this?" (tests MEDIUM)
  - "General question" (tests LOW)

### 8.2 Monitor Execution
- In Zapier, click: "Test"
- Check logs for success
- Verify:
  - Email received
  - Claude analyzed
  - Route decided
  - Response sent
  - HubSpot contact created (for medium/high)

### 8.3 Troubleshoot
- **Claude API error?** Check API key
- **Email not received?** Check Gmail filter
- **HubSpot contact not created?** Check authorization

---

## Step 9: Turn On the Workflow

### 9.1 Activate Zap
- Click the toggle: **ON**
- Confirmation: "Your Zap is active"

### 9.2 Monitor
- Check workflow runs in Zapier dashboard
- Monitor email responses
- Track HubSpot contacts created

---

## 🎉 You're Done!

Your AI-powered email router is now live and processing customer inquiries automatically.

**Verify it works:**
- ✅ Emails being analyzed
- ✅ Priority scored
- ✅ Responses sent
- ✅ HubSpot updated

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Claude API returns error | Check API key is valid in Zapier |
| Emails not routing | Verify path conditions are exact match |
| HubSpot not creating | Check HubSpot authorization |
| Response emails late | Check Zapier task limits |

---

## Next Steps

1. Monitor the workflow for 24 hours
2. Adjust priority scoring if needed
3. Update response templates based on feedback
4. Scale to handle more emails

---

## Support

For issues:
- Check Zapier logs
- Verify API keys
- Test with simple email first
- Contact Claude support if needed
