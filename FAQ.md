# Frequently Asked Questions (FAQ)

## General Questions

### Q: What is the Customer Inquiry Router Zap?
**A:** It's an automated workflow that uses Zapier, Claude AI, and HubSpot to classify incoming customer emails and route them based on priority (HIGH/MEDIUM/LOW), with automatic response emails and contact creation.

### Q: How much does this Zap cost?
**A:** It depends on your plans:
- **Zapier:** Free tier includes limited tasks, paid plans available
- **Claude API:** Pay-as-you-go based on API calls (~$0.01-0.05 per email)
- **HubSpot:** Free tier available, paid plans for more features
- **Gmail:** Free with any Google account

### Q: Can I modify this Zap?
**A:** Yes! The setup guide (SETUP.md) includes detailed instructions for customization. You can modify:
- Email classification rules
- Response templates
- HubSpot field mappings
- Priority thresholds

### Q: Is this a template I can import?
**A:** No, this is a completed working Zap configured for production. You'll set up your own using the step-by-step guide in SETUP.md.

---

## Setup & Configuration

### Q: I'm getting "API key not found" error
**A:** Check:
1. You've added the CLAUDE_API_KEY to Zapier environment variables
2. The key is valid and not expired
3. The key has correct permissions in Anthropic console
See API-SETUP.md for detailed setup.

### Q: How do I connect HubSpot?
**A:** Follow Step 6 in SETUP.md:
1. Click "Add Action" in Path B
2. Search for "HubSpot"
3. Select "Create Contact"
4. Click "Connect HubSpot" and authorize
5. Map fields (Email, First Name, Priority)

### Q: Where do I set environment variables?
**A:** In Zapier:
1. Go to your Zap
2. Click the "Code by Zapier" step
3. Look for "Environment" section
4. Add variables there (CLAUDE_API_KEY, etc.)

### Q: Can I use a different email provider instead of Gmail?
**A:** Not currently, but you can set up the Zap with:
- **Outlook:** May work similarly, requires testing
- **Custom email webhook:** More complex setup needed
Check HOW-IT-WORKS.md for architecture details.

---

## Email Classification

### Q: How does the Zap decide if an email is HIGH priority?
**A:** The Zap analyzes:
- Email sentiment (upset customers → HIGH)
- Keywords indicating urgency (URGENT, ASAP, HELP, etc.)
- Intent classification (support vs. sales vs. billing)
- Overall urgency score
See config/keywords.json for the full rule set.

### Q: What emails get classified as MEDIUM?
**A:** Typically normal customer service inquiries that are important but not urgent.
Examples:
- "Can you help me with my account?"
- "I have a question about your service"
- "How do I...?"

### Q: What emails get classified as LOW?
**A:** Informational or FAQ-type requests.
Examples:
- "What are your business hours?"
- "Do you ship internationally?"
- "General inquiry"

### Q: Can I change the classification rules?
**A:** Yes! Edit config/keywords.json to:
- Add/remove keywords
- Adjust priority thresholds
- Add sentiment patterns
See SETUP.md Step 4.2 for details.

### Q: Why was an email misclassified?
**A:** Reasons include:
- Email body is very short or unclear
- Keywords don't match patterns
- Sarcasm or context not captured
- Custom language/slang not in keywords
Review the email and add better keywords if recurring.

---

## HubSpot Integration

### Q: When are contacts created in HubSpot?
**A:** Only for MEDIUM and HIGH priority emails (Paths B and A).
LOW priority emails (Path C) do NOT create contacts.

### Q: What if a contact already exists?
**A:** HubSpot automatically:
- Updates existing contact if email matches
- Adds activity/note about the inquiry
- Doesn't create duplicate

### Q: Which fields are mapped to HubSpot?
**A:** See config/hubspot-fields.json for the full mapping.
Default fields:
- Email (required)
- First Name (from email or "Customer")
- Priority (HIGH/MEDIUM/LOW)
- Inquiry Date (today)
- Source (Zapier)

### Q: Can I add more fields to HubSpot mapping?
**A:** Yes! Edit config/hubspot-fields.json and the HubSpot step in your Zap:
1. Add field to config file
2. Edit the HubSpot "Create Contact" action
3. Add mapping for new field
4. Test with sample email

### Q: I'm getting "Contact creation failed" errors
**A:** Check:
1. HubSpot API key is valid
2. Your HubSpot account has "Create contacts" permission
3. Required fields (email) are being populated
4. HubSpot hasn't hit API rate limits
See TROUBLESHOOTING.md for more details.

---

## Email Responses

### Q: How quickly do response emails send?
**A:** Typically within 2-5 seconds of receiving the email.
See MONITORING.md for performance metrics.

### Q: Can I customize the response email templates?
**A:** Yes! Edit the Gmail "Send Email" action in each path:
1. Path A: Urgent response template
2. Path B: Normal response template
3. Path C: FAQ response template
See SETUP.md Step 7 for templates.

### Q: Why isn't the response email being sent?
**A:** Check:
1. Gmail is authenticated in Zapier
2. "From" email address is correct
3. "To" field is properly mapped to customer email
4. Email template doesn't have errors
See TROUBLESHOOTING.md for debugging.

### Q: Can I include customer's name in response?
**A:** Not automatically, but you can:
1. Extract name from email body using regex
2. Use in email template: "Hi [NAME]"
3. Or use generic: "Hi there" or "Hi customer"

---

## Testing & Troubleshooting

### Q: How do I test the Zap?
**A:** Options:
1. **Manual test:** Send yourself a test email
2. **Run script:** `npm test` (Node.js required)
3. **Zapier test:** Click "Test" in the Zap
See SETUP.md Step 8 for detailed testing.

### Q: I'm seeing errors in Zapier logs
**A:** Check:
1. TROUBLESHOOTING.md for common errors
2. Specific error message and code
3. Which step is failing
4. Whether it's repeating or one-off
5. Recent changes to the Zap

### Q: Can I see the raw email and API response?
**A:** Yes! In Zapier task history:
1. Click on a specific execution
2. Expand each step to see:
   - Input data (raw email)
   - API request sent
   - API response received
   - Processing result

### Q: How do I debug a misclassification?
**A:** In Zapier logs:
1. Find the email execution
2. Look at Claude API response
3. Check the priority score returned
4. Review email keywords
5. Add better patterns to keywords.json

### Q: What if I need to test locally?
**A:** Use Node.js:
```bash
npm install
npm test
npm run test:high  # Test HIGH priority classification
npm run test:medium  # Test MEDIUM priority
npm run test:low   # Test LOW priority
```

---

## Performance & Monitoring

### Q: How many emails can the Zap handle?
**A:** Depends on your Zapier plan:
- Free: ~5,000 tasks/month
- Paid: Up to 1M+ tasks/month
See your Zapier billing page for your limit.

### Q: How do I check if the Zap is working?
**A:** Check:
1. Zapier Zap status (should show "On")
2. Recent executions in task history
3. Emails in your inbox (for responses)
4. HubSpot contacts (for creations)
See MONITORING.md for detailed guidance.

### Q: The Zap is processing emails slowly
**A:** Typical causes:
1. Claude API latency (check their status)
2. HubSpot API slow (check their status)
3. High email volume (Zapier queuing)
4. Large email bodies (more to process)
Solutions in MONITORING.md.

### Q: How do I export logs for analysis?
**A:** In Zapier:
1. Click "Export" on task history
2. Select date range
3. Download CSV or JSON
4. Import into spreadsheet or database
See MONITORING.md for analysis options.

---

## Integration & APIs

### Q: Do I need to know programming?
**A:** No! The Zap is no-code. But:
- Basic setup requires following instructions
- Customization may need small code edits
- Testing requires running commands (optional)

### Q: Can I integrate with Slack instead of email?
**A:** You could set up a separate Zap that:
1. Watches for HIGH priority emails
2. Sends Slack message to team
3. Requires additional Zapier steps
This is beyond the current scope.

### Q: What APIs does this use?
**A:**
- **Claude API:** Email classification
- **Gmail API:** Email trigger and send (via Zapier)
- **HubSpot API:** Contact creation
- **Zapier:** Workflow orchestration
See HOW-IT-WORKS.md for architecture.

### Q: Can I run this without Zapier?
**A:** Yes, you could:
1. Build your own server using Node.js
2. Connect to Gmail via API
3. Call Claude API directly
4. Connect to HubSpot API
This requires development skills and is not included.

---

## Account & Permissions

### Q: Why do I need to authorize Zapier access to Gmail?
**A:** To allow Zapier to:
- Read incoming emails (trigger)
- Send response emails (action)
You control the permissions granted.

### Q: What permissions does Zapier need in HubSpot?
**A:** 
- Read contacts
- Create contacts
- Update contacts
Zapier asks for minimum required permissions.

### Q: Is my email data secure?
**A:** Yes:
- Zapier uses OAuth (secure authentication)
- Data is encrypted in transit
- Emails are temporary (not stored)
- API keys aren't shared in code
See your service privacy policies for details.

### Q: Can I use work/business email instead of personal?
**A:** Yes! Setup works with any email:
- Gmail (personal or business)
- Google Workspace (business)
- Gmail forwarding to other accounts
Just authenticate with the account you want.

---

## Getting Help

### Q: Where do I find answers to other questions?
**A:** Check these resources:
1. **This FAQ** - Most common questions
2. **TROUBLESHOOTING.md** - Common problems and fixes
3. **SETUP.md** - Step-by-step guide
4. **HOW-IT-WORKS.md** - Technical details
5. **GitHub Issues** - Search closed issues

### Q: How do I report a bug?
**A:** Open a GitHub issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Screenshots or email sample
- Zapier error message (if any)

### Q: How do I request a feature?
**A:** Open a GitHub issue marked as "Feature Request" with:
- What feature you want
- Why you need it
- How it would improve the Zap
- Example use case

### Q: Where do I send general feedback?
**A:** Email: contact@naveensharma.net or contact.naveensharma@gmail.com 
Or open a discussion in GitHub (Discussions tab).

---

## More Questions?

If your question isn't answered here:
1. Check TROUBLESHOOTING.md
2. Search GitHub issues
3. Review SETUP.md and HOW-IT-WORKS.md
4. Open a new GitHub issue

We're here to help!
