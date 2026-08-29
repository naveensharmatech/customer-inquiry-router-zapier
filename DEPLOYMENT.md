# Deployment Guide

This guide explains how to deploy and update the Customer Inquiry Router Zap in production.

## Current Deployment Status

✅ **Status:** Live and operational in production
- **Zap ID:** 377871067
- **Zap Name:** AI Customer Inquiry Router
- **Environment:** Production
- **Launch Date:** Active since setup

## Deployment Architecture

```
Gmail → Zapier Trigger → Claude API Analysis → Path Routing → Actions
  ↓                              ↓                   ↓
New Email               Email Classification    HIGH/MEDIUM/LOW
                        Priority Scoring
                        Sentiment Analysis
                                                 ↓
                              ┌─────────────────┬──────────────┬─────────────┐
                              ↓                 ↓              ↓
                         Path A (HIGH)    Path B (MEDIUM)  Path C (LOW)
                         Urgent Email     Normal Email      Info Email
                              ↓                 ↓              ↓
                         Send Email +    Create HubSpot +  Send FAQ
                         Immediate       Send Email        Response
                         Response
```

## Pre-Deployment Checklist

Before deploying any changes:

- [ ] All tests pass locally (`npm test`)
- [ ] Environment variables are configured in Zapier
- [ ] API keys are valid and have correct permissions
- [ ] HubSpot field mappings match your portal
- [ ] Gmail account is authenticated
- [ ] Response email templates are reviewed

## Deployment Steps

### 1. Update Configuration

If making changes to email classification rules:
1. Update `/config/keywords.json`
2. Update `/config/email-config.json` if needed
3. Test locally with sample emails

### 2. Test with Sample Data

Before deploying to production:
1. Run test suite: `npm test`
2. Test each priority level:
   - `npm run test:high`
   - `npm run test:medium`
   - `npm run test:low`

### 3. Update Zapier (if making code changes)

If updating the JavaScript code in Step 3:
1. Log into Zapier account
2. Edit the Zap
3. Update the Code step with new logic
4. Save and test with one email first
5. Verify it processes correctly

### 4. Monitor Initial Execution

After deployment:
1. Send a test email from external account
2. Verify it's classified correctly
3. Check HubSpot for contact creation
4. Confirm response email is received
5. Monitor Zapier task history for errors

### 5. Rollback Procedures

If issues occur:
1. Go to Zapier Zap settings
2. Revert to previous code version
3. Check Zapier logs for error details
4. Review and fix the issue
5. Re-deploy after testing

## Production Monitoring

### Key Metrics to Monitor

- **Daily Email Volume:** Emails processed per day
- **Classification Accuracy:** Percentage correctly classified
- **Response Time:** Time from email to response
- **Error Rate:** Failed executions vs. successful
- **HubSpot Integration:** Contact creation success rate

### Automated Checks

Zapier automatically:
- Logs all task executions
- Records errors and failures
- Tracks performance metrics
- Emails alerts for critical failures

## Scaling Considerations

### Current Capacity

- **Tasks per month:** Zapier free tier limit
- **Concurrent executions:** Single execution per email
- **Email size limit:** 25MB (Zapier limit)
- **Response latency:** 2-5 seconds typical

### Scaling to Higher Volume

If volume exceeds current capacity:
1. Upgrade Zapier plan to increase task limits
2. Consider batch processing
3. Implement email queue if needed
4. Add caching layer for classification rules
5. Monitor HubSpot API rate limits

## Troubleshooting Deployment Issues

### Issue: Classification Not Working

**Symptoms:** All emails get same priority
1. Check Claude API key in Zapier environment
2. Verify keywords.json is properly formatted
3. Test API connection with sample request
4. Check Zapier logs for specific errors

### Issue: HubSpot Contacts Not Creating

**Symptoms:** Medium/High emails don't create contacts
1. Verify HubSpot API key is valid
2. Check field mappings in hubspot-fields.json
3. Confirm HubSpot portal ID matches
4. Verify user has "Create contacts" permission
5. Check for duplicate contact handling

### Issue: Response Emails Not Sending

**Symptoms:** Customers don't receive responses
1. Check Gmail is authenticated in Zapier
2. Verify "from" email address is correct
3. Check spam filters
4. Review email templates for issues
5. Check Zapier task logs for failure reasons

## Version Management

Document changes with semantic versioning:
- **Patch** (1.0.1): Bug fixes, minor updates
- **Minor** (1.1.0): New features, improvements
- **Major** (2.0.0): Breaking changes

See CHANGELOG.md for version history.

## Contact & Support

For deployment issues or questions:
- Check TROUBLESHOOTING.md for common problems
- Review Zapier logs for specific errors
- Verify all credentials and permissions
- Test with sample emails before production emails

## Additional Resources

- [Zapier Zap URL](https://zapier.com/editor/377870671/draft/377871067/setup)
- [Zapier Documentation](https://zapier.com/help)
- [Anthropic Claude API Docs](https://console.anthropic.com/docs)
- [HubSpot API Documentation](https://developers.hubspot.com/)
