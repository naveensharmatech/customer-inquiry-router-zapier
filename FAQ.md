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
**A:** No. This repository contains reference files, not a portable Zap export or verified live deployment. Configure your own workflow using [docs/SETUP.md](docs/SETUP.md).

---

## Setup & Configuration

### Q: I'm getting "API key not found" error
**A:** Check:
1. The Anthropic credential is configured in Zapier's approved secret storage or connection
2. The key is valid and not expired
3. The key has correct permissions in Anthropic console
See [docs/SETUP.md](docs/SETUP.md) and [docs/API-SETUP.md](docs/API-SETUP.md).

### Q: How do I connect HubSpot?
**A:** Follow Step 6 in SETUP.md:
1. Click "Add Action" in Path B
2. Search for "HubSpot"
3. Select "Create Contact"
4. Click "Connect HubSpot" and authorize
5. Map fields (Email, First Name, Priority)

### Q: Where do I set environment variables?
**A:** Use Zapier-managed secret storage or an approved app connection. The available mechanism depends on your account and action; never hardcode a key in a script or expose it in run logs.

### Q: Can I use a different email provider instead of Gmail?
**A:** Not currently, but you can set up the Zap with:
- **Outlook:** May work similarly, requires testing
- **Custom email webhook:** More complex setup needed
Check [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for architecture details.

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
See [docs/SETUP.md](docs/SETUP.md) for setup and customization guidance.

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
**A:** This depends on which path(s) you configure. The example blueprint shows a CRM action on a selected path; it does not guarantee every priority is captured.

### Q: What if a contact already exists?
**A:** Configure and test create/update behavior in your HubSpot portal. The example mapping describes deduplication intent, not an automatically active integration.

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
1. The HubSpot connection is authorized
2. Your HubSpot account has "Create contacts" permission
3. Required fields (email) are being populated
4. HubSpot hasn't hit API rate limits
See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for more details.

---

## Email Responses

### Q: How quickly do response emails send?
**A:** Timing depends on trigger polling, provider latency, task queues, and delivery. This repository has no verified live latency benchmark; measure it in the target accounts. See [docs/PERFORMANCE.md](docs/PERFORMANCE.md).

### Q: Can I customize the response email templates?
**A:** Yes! Edit the Gmail "Send Email" action in each path:
1. Path A: Urgent response template
2. Path B: Normal response template
3. Path C: FAQ response template
See [docs/SETUP.md](docs/SETUP.md) for configuration guidance.

### Q: Why isn't the response email being sent?
**A:** Check:
1. Gmail is authenticated in Zapier
2. "From" email address is correct
3. "To" field is properly mapped to customer email
4. Email template doesn't have errors
See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for debugging.

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
See [docs/SETUP.md](docs/SETUP.md) for test and rollout guidance.

### Q: I'm seeing errors in Zapier logs
**A:** Check:
1. [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for common errors
2. Specific error message and code
3. Which step is failing
4. Whether it's repeating or one-off
5. Recent changes to the Zap

### Q: Can I see the raw email and API response?
**A:** Zapier run history may expose step inputs and outputs to authorized account users. Treat this as customer data, restrict access, and apply your retention policy:
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
**A:** There is no verified capacity benchmark in this repository. Check current Zapier task allowance, provider limits, actions per email, and observed peak queue time before deployment.

### Q: How do I check if the Zap is working?
**A:** Check:
1. Zapier Zap status (should show "On")
2. Recent executions in task history
3. Emails in your inbox (for responses)
4. HubSpot contacts (for creations)
See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for troubleshooting guidance.

### Q: The Zap is processing emails slowly
**A:** Typical causes:
1. Claude API latency (check their status)
2. HubSpot API slow (check their status)
3. High email volume (Zapier queuing)
4. Large email bodies (more to process)
See [MONITORING.md](MONITORING.md) for monitoring guidance.

### Q: How do I export logs for analysis?
**A:** In Zapier:
1. Click "Export" on task history
2. Select date range
3. Download CSV or JSON
4. Import into spreadsheet or database
See [MONITORING.md](MONITORING.md) for analysis options.

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
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for architecture.

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
**A:** Security depends on provider configuration, account controls, logging, and retention choices. Use least-privilege connections, minimize message data, restrict run-history access, and review provider privacy/retention terms. This repository cannot guarantee that data is temporary or that a deployment is secure by default.

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
2. **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Common problems and fixes
3. **[docs/SETUP.md](docs/SETUP.md)** - Step-by-step guide
4. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Technical details
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
**A:** Email: [contact.naveensharmatech@gmail.com](mailto:contact.naveensharmatech@gmail.com)
Or open a discussion in GitHub (Discussions tab).

---

## More Questions?

If your question isn't answered here:
1. Check [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Search GitHub issues
3. Review [docs/SETUP.md](docs/SETUP.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
4. Open a new GitHub issue

We're here to help!
