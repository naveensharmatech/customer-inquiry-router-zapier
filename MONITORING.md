# Monitoring & Logging Guide

This guide explains how to monitor the Customer Inquiry Router Zap and interpret logs.

## Overview

The Zap automatically logs all executions. This guide helps you understand the logs, set up alerts, and monitor performance.

## Accessing Zapier Logs

### View Recent Executions

1. Log into Zapier
2. Click "My Apps" → Select "AI Customer Inquiry Router" Zap
3. Scroll to "Runs" or "Activity" section
4. Each run shows:
   - Timestamp
   - Status (Success/Error)
   - Duration
   - Input data
   - Output data

### Filtering Executions

Filter by:
- **Date range:** Recent, Today, Last 7 days, Custom
- **Status:** Successful, Failed, Errored
- **Action:** By specific step (Trigger, Claude API, HubSpot, etc.)

## Understanding Log Entries

### Successful Execution

```
✅ SUCCESS - 2024-08-29 14:32:15
Input: New email from customer@example.com
  Subject: "Help with my order"
  Body: "I need assistance..."

Step 1 (Gmail Trigger): ✅ Success - Email captured
  - From: customer@example.com
  - Subject: Help with my order

Step 2 (Claude API): ✅ Success - Classification complete
  - Priority: MEDIUM
  - Confidence: 0.85
  - Intent: Support

Step 3 (Path Routing): ✅ Success - Path B (MEDIUM)
  - Matched: priority = MEDIUM

Step 4 (HubSpot): ✅ Success - Contact created/updated
  - Contact ID: 456789
  - Email: customer@example.com

Step 5 (Gmail Send): ✅ Success - Response sent
  - To: customer@example.com
  - Subject: Re: Help with my order

Duration: 3.2 seconds
Task count: 1
```

### Failed Execution

```
❌ ERROR - 2024-08-29 14:33:45
Input: New email from test@gmail.com

Step 1 (Gmail Trigger): ✅ Success
Step 2 (Claude API): ❌ ERROR
  Error Message: "Invalid API key"
  Error Code: 401
  Details: "CLAUDE_API_KEY not found in environment"
Step 3+ (Skipped): Path routing and actions not executed

Duration: 0.8 seconds
Task count: 1 (partial)

Action: Check Claude API key configuration
```

## Key Metrics to Monitor

### 1. Success Rate
- **Formula:** Successful tasks / Total tasks
- **Target:** >99%
- **Action:** Investigate if below 95%

### 2. Average Processing Time
- **Typical range:** 2-5 seconds per email
- **Breakdown:**
  - Gmail trigger: <100ms
  - Claude API: 1-3 seconds
  - Path routing: <100ms
  - HubSpot: 500-1000ms
  - Gmail send: 500-1000ms

### 3. Error Rate
- **Track:** Errors per 100 tasks
- **Target:** <1 error per 100 tasks
- **Common errors:**
  - API authentication issues
  - Rate limiting
  - Network timeouts
  - Invalid data

### 4. Classification Distribution
- **HIGH:** ~20% of emails
- **MEDIUM:** ~60% of emails
- **LOW:** ~20% of emails
- **Alert if:** Distribution drastically different

### 5. HubSpot Integration Success
- **Track:** Contacts created successfully
- **Failures:** Duplicate prevention, API errors
- **Monitor:** Contact field accuracy

## Setting Up Alerts

### Zapier Built-in Alerts

1. **Task Errors:**
   - Zapier emails on failure
   - Immediate notification
   - Check email registered with account

2. **Catch-All Email:**
   - Add filter to your email
   - Important: Don't ignore Zapier notifications

### Custom Monitoring (Optional)

Create additional monitoring by:
1. **Export logs:** Download execution history
2. **Parse data:** Extract error patterns
3. **Alert on patterns:** Multiple errors of same type
4. **Track trends:** Performance degradation over time

## Common Issues & Patterns

### Pattern 1: API Key Expiration
**Symptom:** All Claude API calls start failing
**Detection:** Error 401 in Claude API step
**Solution:** Regenerate API key, update in Zapier

### Pattern 2: Rate Limiting
**Symptom:** Intermittent failures, usually during high volume
**Detection:** 429 errors in Claude API logs
**Solution:** Implement backoff, check API plan limits

### Pattern 3: HubSpot Duplicate Contacts
**Symptom:** Multiple contacts created for same email
**Detection:** Check HubSpot duplicate handling
**Solution:** Verify deduplication logic is working

### Pattern 4: Malformed Emails
**Symptom:** Specific emails fail parsing
**Detection:** Step 1 errors for specific senders
**Solution:** Review email format, update parser

### Pattern 5: Low Classification Accuracy
**Symptom:** Emails getting wrong priority
**Detection:** Manual review of classifications
**Solution:** Retrain keywords, adjust thresholds

## Daily Checklist

**Morning Review:**
- [ ] Check for overnight errors
- [ ] Review error patterns
- [ ] Verify all systems responding
- [ ] Check task count vs. expected

**Weekly Review:**
- [ ] Review success rate trend
- [ ] Analyze classification accuracy
- [ ] Check processing time average
- [ ] Review HubSpot contact quality

**Monthly Review:**
- [ ] Generate performance report
- [ ] Review all error types
- [ ] Assess capacity needs
- [ ] Plan any updates/changes

## Performance Optimization

### If Processing is Slow
1. Check Claude API response time
2. Verify HubSpot API latency
3. Review email body size (very large emails slow parsing)
4. Check Zapier task queue
5. Consider scaling Zapier plan

### If Error Rate is High
1. Check all API credentials
2. Review recent code changes
3. Monitor API rate limits
4. Check email volume spike
5. Review email filter rules

### If Classification is Inaccurate
1. Review sample email classifications
2. Update keywords.json if needed
3. Adjust priority thresholds
4. Add new sentiment analysis patterns
5. Test with diverse email samples

## Exporting & Analyzing Logs

### Export Log Data

1. In Zapier, click "Export"
2. Select date range
3. Download CSV/JSON
4. Import into analysis tool

### Analysis Options

- **Spreadsheet:** Google Sheets, Excel
- **Database:** Store in database for long-term tracking
- **BI Tool:** Looker, Tableau, Power BI for dashboards
- **Custom script:** Process logs programmatically

## Integration with External Monitoring

### Option 1: Zapier Webhooks
Forward execution logs to external service:
- Send to webhook on every task
- Custom logging system
- Centralized monitoring

### Option 2: Email Alerts
Configure Zapier to email on:
- Task failures
- High error rates
- Performance degradation

### Option 3: HubSpot Activity
HubSpot logs contact creation:
- Verify contact fields
- Check creation timestamps
- Monitor for duplicates
- Track data quality

## Troubleshooting Monitoring Issues

**Q: Logs show wrong information?**
A: Zapier may cache logs. Refresh page, wait a moment for updates.

**Q: Can't see all details in logs?**
A: Click on specific execution to see full details including raw input/output.

**Q: Need historical data?**
A: Export logs regularly or query Zapier API for programmatic access.

**Q: Alerts not arriving?**
A: Check:
- Email address in Zapier settings
- Email spam folder
- Zapier notification preferences
- Email forwarding rules

## Resources

- [Zapier Task History Documentation](https://zapier.com/help/manage-your-zaps/your-tasks)
- [Understanding Task Limits](https://zapier.com/help/billing/usage/what-are-my-monthly-task-limits)
- [API Error Codes Reference](https://docs.anthropic.com/en/docs/build-with-claude/libraries)
- [HubSpot API Response Codes](https://developers.hubspot.com/docs/api/overview)

