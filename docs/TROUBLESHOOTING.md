# Troubleshooting Guide

## 🔴 Common Issues & Fixes

### Issue 1: Claude API Returns 401 Error

**Error Message:**

"error": "Authentication failed",
"message": "Invalid API key"


**Causes:**
- API key is incorrect
- API key expired
- API key has extra spaces
- API key was regenerated

**Solutions:**

1. **Check API Key Format**
   - Should start with `sk-`
   - Should be 40+ characters long
   - No extra spaces before/after

2. **Regenerate Key**
   - Go to console.anthropic.com
   - Delete old key
   - Create new key
   - Copy entire key
   - Paste into Zapier environment variable

3. **Verify in Zapier**
   - Go to workflow
   - Click "Claude AI Analysis" step
   - Check Environment variable
   - Make sure key is there
   - No extra spaces

4. **Test Again**
   - Send test email
   - Check execution logs
   - Should succeed now

---

### Issue 2: HubSpot Not Creating Contacts

**Symptoms:**
- Email routed correctly
- Response sent
- But no contact in HubSpot

**Causes:**
- HubSpot authorization expired
- Field mapping incorrect
- Contact already exists (duplicate)
- HubSpot API key invalid

**Solutions:**

1. **Re-authorize HubSpot**
   - In Zapier workflow
   - Go to HubSpot step
   - Click "Reconnect"
   - Sign in again
   - Approve permissions

2. **Check Field Mapping**
   - Email field → sender email
   - Name field → extracted name
   - All required fields filled

3. **Check for Duplicates**
   - In HubSpot, search for contact
   - If exists, email already in system
   - Zapier skips duplicate creation (normal)

4. **Verify API Key**
   - Go to HubSpot Settings
   - Check API key exists
   - Regenerate if needed

---

### Issue 3: Emails Not Being Captured

**Symptoms:**
- Sent email to Gmail
- But Zapier doesn't pick it up
- No execution in logs

**Causes:**
- Gmail not connected
- Email folder wrong
- Email filter blocking it
- Gmail label filter incorrect

**Solutions:**

1. **Test Gmail Connection**
   - In Zapier trigger
   - Click "Test trigger"
   - Should show recent emails
   - If empty, connection broken

2. **Reconnect Gmail**
   - Click "Disconnect"
   - Click "Connect Gmail"
   - Authorize again
   - Try test

3. **Check Folder Settings**
   - Should be: "Inbox"
   - Not "All Mail" (too broad)
   - Not "Spam" (wrong folder)

4. **Check Email Search Filter**
   - If you set a filter (optional)
   - Verify your email matches it
   - Example: filter "customer" but subject is "Account Help" → won't match

5. **Send to Correct Email**
   - Make sure sending to Gmail address
   - Not a forwarded address
   - Not a distribution list

---

### Issue 4: Claude Not Analyzing Emails

**Symptoms:**
- Email received by Zapier
- But Claude step shows error
- Priority not assigned

**Causes:**
- Claude API key invalid (see Issue 1)
- Email content too long
- Claude API rate limited
- Email contains unsupported characters

**Solutions:**

1. **Check API Key** (see Issue 1)
   - Follow full process above

2. **Check Email Length**
   - Claude has 100K token limit
   - Your emails should be <50KB
   - Very long emails might fail

3. **Wait for Rate Limit Reset**
   - Free tier has limits
   - Wait 1 minute
   - Try again

4. **Check Email Format**
   - Should be plain text
   - Not HTML with special encoding
   - Test with simple text email

---

### Issue 5: Wrong Priority Assigned

**Symptoms:**
- Email routed to wrong path
- HIGH priority marked as LOW
- Response template incorrect

**Causes:**
- Claude scoring needs tuning
- Keywords not detected
- Prompt needs adjustment

**Solutions:**

1. **Check Execution Log**
   - See what Claude returned
   - Read exact priority score
   - Understand reasoning

2. **Adjust Claude Prompt**
   - Go to "Code by Zapier" step
   - Edit the system prompt
   - Add more keyword examples
   - Make scoring rules clearer

3. **Examples to Add**

HIGH priority if:

Contains: URGENT, ASAP, CRITICAL, HELP
Contains: Account locked, can't access
Angry tone or multiple !!!

MEDIUM priority if:

Normal support request
Standard question
Neutral tone

LOW priority if:

General information request
"Just curious" type inquiry
No time pressure

4. **Test Again**
   - Send emails that were misprioritized
   - Check if scoring improved
   - Adjust prompt again if needed

---

### Issue 6: Responses Not Sending

**Symptoms:**
- Email routed correctly
- But recipient doesn't get response
- No "Send Email" in logs

**Causes:**
- Response email step not configured
- Recipient field not mapped
- Gmail sending not authorized
- Email template empty

**Solutions:**

1. **Check Email Step Exists**
   - In each path (A, B, C)
   - Should have "Send Email" action
   - Should be after routing

2. **Verify Recipient Mapping**
   - "Send to" field should map to sender email
   - Should show: `{{ data.from }}`
   - Not hardcoded email

3. **Check Subject & Body**
   - Subject shouldn't be empty
   - Body shouldn't be empty
   - Use template variables: `{{ data.from }}`

4. **Re-authorize Gmail Sending**
   - In "Send Email" step
   - Click "Reconnect"
   - Sign in again
   - Authorize

5. **Test Send**
   - Try sending test email
   - Check recipient inbox
   - Should arrive within 5 minutes

---

### Issue 7: Workflow Turned Off Accidentally

**Symptoms:**
- No emails being processed
- No Zapier executions
- "Your Zap is off" message

**Solutions:**

1. **Turn Workflow Back On**
   - Go to Zapier dashboard
   - Find your Zap
   - Click toggle to turn ON
   - Should see "Your Zap is on"

2. **Prevent Auto-Off**
   - Zapier auto-disables on errors
   - Fix the error (see above issues)
   - Manually turn back on
   - Monitor logs for new errors

---

### Issue 8: High Processing Time

**Symptoms:**
- Emails taking >60 seconds to process
- Responses delayed

**Causes:**
- Claude API slow
- Zapier task queue busy
- Network latency
- Email too long

**Solutions:**

1. **Check Claude Status**
   - Visit https://status.anthropic.com
   - See if API is experiencing issues
   - Usually resolves in 5-10 min

2. **Optimize Email Size**
   - Shorter emails = faster processing
   - Remove attachments
   - Use plain text only

3. **Batch Process Later**
   - If very high volume
   - Zapier can queue tasks
   - They'll process eventually
   - No emails lost

4. **Upgrade Zapier Plan**
   - Free tier has slower processing
   - Paid plans have priority queue
   - If critical, consider upgrading

---

### Issue 9: HubSpot Contact Has Wrong Data

**Symptoms:**
- Contact created in HubSpot
- But data is incorrect
- Name wrong, email wrong, or missing fields

**Causes:**
- Field extraction failed
- Mapping points to wrong field
- Data not parsed correctly

**Solutions:**

1. **Check Extraction**
   - Look at Claude output
   - See what was extracted
   - Verify it's correct

2. **Adjust Field Mapping**
   - Check what's mapped to what
   - "First Name" might need special parsing
   - Example: extract first word from sender email

3. **Add Data Parsing**
   - In "Code by Zapier" step
   - Extract name from email
   - Parse sender address
   - Return structured data

4. **Test with Sample**
   - Send carefully formatted test email
   - Check HubSpot result
   - Adjust if needed

---

### Issue 10: Rate Limit Exceeded

**Symptoms:**

"error": "rate_limit_exceeded"
"retry_after": 60


**Causes:**
- Too many requests to Claude API
- Sending 100+ emails at once
- Free tier limit hit

**Solutions:**

1. **Wait for Reset**
   - Wait 60 seconds
   - Try again
   - Should work

2. **Spread Out Emails**
   - Don't send mass emails at once
   - Spread over time
   - Allows rate limit to reset

3. **Upgrade Claude Tier**
   - Free tier has lower limits
   - Paid tier has higher limits
   - Contact Anthropic for more

---

## 📊 Debugging Workflow

### Step 1: Check Zapier Logs
1. Open your Zap
2. Click "View History"
3. Find failed execution
4. Click to expand
5. Read error message

### Step 2: Identify Which Step Failed
- Step 1: Gmail trigger
- Step 2: Claude analysis
- Step 3: Path routing
- Step 4: HubSpot creation
- Step 5: Email sending

### Step 3: Apply Fix from Above

### Step 4: Test Again
1. Send test email
2. Monitor execution
3. Should succeed now

---

## 🚨 Emergency Reset

If everything is broken, start fresh:

### Option 1: Restart Workflow
1. Turn OFF the Zap
2. Wait 30 seconds
3. Turn back ON
4. Test with new email

### Option 2: Reconnect All Services
1. Disconnect Claude API
2. Disconnect HubSpot
3. Disconnect Gmail
4. Reconnect in reverse order
5. Test

### Option 3: Contact Support
- Claude: support.anthropic.com
- HubSpot: support.hubspot.com
- Zapier: zapier.com/help

---

## ✅ Health Check

Run this regularly to ensure everything works:

- [ ] Send test email to Gmail
- [ ] Verify Zapier picks it up
- [ ] Check Claude analyzes it
- [ ] Verify correct priority assigned
- [ ] Confirm response received
- [ ] Check HubSpot contact created
- [ ] Validate all data correct

If any step fails, use troubleshooting above.
