# API Setup Guide

## 🔑 Claude API Setup

### Step 1: Create Anthropic Account
1. Go to: https://console.anthropic.com
2. Click: "Sign up"
3. Enter email address
4. Create password
5. Verify email (check inbox)

### Step 2: Generate API Key
1. Log in to console.anthropic.com
2. Click: "API Keys" in sidebar
3. Click: "Create Key"
4. Name it: "Zapier Router" (for reference)
5. Click: "Create"
6. **COPY the key immediately** (you won't see it again)

### Step 3: Secure Your Key

⚠️ IMPORTANT:

Never share this key publicly
Don't commit it to GitHub
Don't post in Slack or emails
Treat it like a password

### Step 4: Add to Zapier
1. Open your Zapier workflow
2. Go to the "Claude AI Analysis" step
3. Click: "Environment"
4. Add variable: `CLAUDE_API_KEY`
5. Paste your key
6. Click: "Save"

### Step 5: Test Connection
1. Send a test email
2. Check Zapier logs for success
3. If error appears:
   - Verify key is correct
   - Check no extra spaces
   - Generate new key if needed

---

## 🔗 HubSpot API Setup

### Step 1: Create HubSpot Account
1. Go to: https://hubspot.com
2. Click: "Get started free"
3. Enter email & password
4. Verify account

### Step 2: Access API
1. Log in to HubSpot
2. Click: Settings (gear icon)
3. Go to: "Account Setup" → "Integrations" → "API"
4. Click: "Create API key"
5. Name it: "Zapier Router"

### Step 3: Copy API Key
- Copy the key
- Store safely (like Claude key)

### Step 4: Connect to Zapier
1. In Zapier workflow, add HubSpot action
2. Click: "Connect HubSpot"
3. Sign in with your HubSpot account
4. Authorize Zapier to access HubSpot
5. Click: "Approve"

### Step 5: Configure Fields
In the HubSpot step, map these fields:

| HubSpot Field | Maps To |
|---------------|---------|
| Email | Email from Zapier |
| First Name | Name extraction |
| Priority | Priority from Claude |
| Inquiry Type | Topic classification |
| Created Date | Timestamp |

---

## 📧 Gmail API Setup

### Step 1: Connect Gmail to Zapier
1. In Zapier trigger, click: "Connect Gmail"
2. Sign in with your Gmail account
3. Authorize Zapier to read emails
4. Click: "Approve"

### Step 2: Configure Email Trigger
- **From:** (leave blank for all emails)
- **Folder:** Inbox
- **Search:** (optional - e.g., "customer inquiry")

### Step 3: Test Gmail Connection
1. Send yourself a test email
2. Check that Zapier picks it up
3. Verify content is extracted

### Step 4: Set Sending (Responses)
1. Add "Send Email" action in paths
2. Click: "Connect Gmail" (for sending)
3. Authorize again if needed
4. Map recipient field to email sender

---

## 🔐 API Key Management

### Security Best Practices

✅ DO:

Store keys in Zapier securely
Use environment variables
Rotate keys periodically
Keep keys in locked location

❌ DON'T:

Share keys via email/Slack
Commit to GitHub
Use placeholder keys in production
Write keys in comments

### If Key is Compromised

**For Claude API:**
1. Go to console.anthropic.com
2. Delete the exposed key
3. Create new key
4. Update Zapier environment variable

**For HubSpot API:**
1. Go to HubSpot Settings → API
2. Revoke the key
3. Create new key
4. Re-authorize Zapier

---

## 🧪 Testing All Connections

### Test Email
Send yourself an email with this content:

Subject: TEST: Customer Inquiry Router

Hi Support,

This is a test email for the AI-powered routing system.

Please confirm this was received and routed correctly.

Thanks,
Test User


### Verify in Zapier
1. Check "Execution History"
2. Look for your test email
3. Verify:
   - ✅ Email received
   - ✅ Claude analyzed it
   - ✅ Priority assigned
   - ✅ Routed correctly
   - ✅ Response sent
   - ✅ HubSpot contact created

### Check HubSpot
1. Go to HubSpot Contacts
2. Look for "Test User"
3. Verify contact details captured
4. Check priority tag applied

---

## ❌ Troubleshooting

| Issue | Solution |
|-------|----------|
| Claude API error 401 | Check API key is valid |
| HubSpot connection fails | Re-authorize in Zapier |
| Gmail not capturing emails | Check folder/search settings |
| No response sent | Verify email template filled in |
| Contact not created | Check HubSpot field mapping |

### Debug Mode
If something fails:
1. Go to Zapier execution logs
2. Click on the failed step
3. Read error message
4. Fix the issue
5. Re-test

---

## 📞 Support

Need help?
- **Claude API:** https://support.anthropic.com
- **HubSpot:** https://support.hubspot.com
- **Zapier:** https://zapier.com/help

---

## ✅ Checklist

- [ ] Claude API key created
- [ ] Claude key added to Zapier
- [ ] HubSpot account created
- [ ] HubSpot key created
- [ ] HubSpot connected to Zapier
- [ ] Gmail connected to Zapier
- [ ] Test email sent
- [ ] All services responding
- [ ] Workflow activated
