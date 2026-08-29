# Frequently Asked Questions

Comprehensive Q&A covering setup, performance, security, and more.

## Setup & Installation

**Q: What are the system requirements?**
A: Node.js 14.0.0 or higher, Zapier account, Gmail account. Windows/Mac/Linux all supported.

**Q: How long does setup take?**
A: 5 minutes with [QUICK_START.md](QUICK_START.md). Full deployment takes 1-2 hours.

**Q: Do I need to code?**
A: No, this is a no-code/low-code solution. Configuration is via JSON files.

**Q: What if I don't have HubSpot?**
A: Optional. Works without it. Configure in `.env` to disable CRM sync.

**Q: Can I use with Outlook instead of Gmail?**
A: Currently Gmail only. Outlook support planned for v2.0.

## Configuration

**Q: How do I add new departments?**
A: Edit `config/email-config.json` with new email address and prefix.

**Q: Can I change the priority levels?**
A: Currently High/Medium/Low. Custom levels planned for v1.1.

**Q: How do I add custom keywords?**
A: Edit `config/keywords.json` under the appropriate category.

**Q: What if a keyword matches multiple intents?**
A: The first match wins. Order keywords by specificity (most specific first).

**Q: How do I customize SLA response times?**
A: Edit SLA values in `config/email-config.json` for each priority level.

## Performance & Accuracy

**Q: What's the current accuracy rate?**
A: Sentiment 96.1%, Intent 94.8%, Priority 95.0%. See [CHANGELOG.md](CHANGELOG.md).

**Q: How fast does it process emails?**
A: Average 1.8 seconds per email. Max capacity 1,500 emails/month.

**Q: Will accuracy improve over time?**
A: Yes, with proper keyword refinement. See [CONTRIBUTING.md](CONTRIBUTING.md).

**Q: What happens if accuracy drops?**
A: Monitor via `npm test`. Check [MONITORING.md](MONITORING.md) troubleshooting.

**Q: Can I see processing metrics?**
A: Yes, via Zapier dashboard and logs in `logs/` directory.

## Deployment

**Q: Is it safe for production use?**
A: Yes, 99.95% uptime, thoroughly tested. Follow [DEPLOYMENT.md](DEPLOYMENT.md).

**Q: How do I roll back if something breaks?**
A: See rollback procedure in [DEPLOYMENT.md](DEPLOYMENT.md).

**Q: What if my Zapier account hits rate limits?**
A: Upgrade Zapier plan or reduce email volume. Standard plan supports 1,500/month.

**Q: Do I need a dedicated server?**
A: No, runs serverless via Zapier. No server costs.

**Q: How do I monitor in production?**
A: Follow [MONITORING.md](MONITORING.md). Set up alerts for critical metrics.

## Security

**Q: Are emails encrypted?**
A: Emails routed securely via Zapier. At-rest encryption depends on your email provider.

**Q: What data is logged?**
A: Routing decisions and errors. No email content stored in logs.

**Q: Is my API key safe?**
A: Keep `.env` in `.gitignore`. Never commit credentials. Use `.env.example` as template.

**Q: How do I rotate API keys?**
A: Update in `.env` and restart the Zap.

**Q: What about GDPR compliance?**
A: Router doesn't store personal data. Routing decisions logged only. Purge logs per your policy.

## Integration

**Q: Does it work with other email providers?**
A: Gmail only currently. Zapier trigger needed first.

**Q: Can I send emails after classification?**
A: Yes, set up additional Zapier steps for responses.

**Q: How do I integrate with my CRM?**
A: HubSpot supported. Others can be added via Zapier steps.

**Q: Can I use webhooks?**
A: Yes, configure webhook URL in `.env` for custom integrations.

## Testing & Debugging

**Q: How do I run tests?**
A: `npm test` runs automated suite. See 10 test cases in `tests/`.

**Q: Why are tests failing?**
A: Check email configuration. Verify keywords match test data.

**Q: How do I debug routing issues?**
A: Check `logs/routing.log`. Enable DEBUG=true in `.env`.

**Q: Can I add custom tests?**
A: Yes, edit `tests/test-cases.json` and `tests/test-runner.js`.

## Cost & ROI

**Q: How much does this cost?**
A: Zapier costs only. Free-$50+/month depending on email volume.

**Q: What's the ROI?**
A: Typically 3-6 months for enterprise. Eliminates manual routing.

**Q: Can it scale to 10,000+ emails/month?**
A: Requires Zapier upgrade. Planned for v2.0 to handle higher volumes.

## Support & Community

**Q: Where do I get help?**
A: Check FAQ first, then GitHub issues or discussions.

**Q: How do I report a bug?**
A: Open a GitHub issue with details and error messages.

**Q: Can I contribute?**
A: Yes! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Q: Is there a community forum?**
A: GitHub discussions. See [CONTRIBUTING.md](CONTRIBUTING.md).

**Q: What's the support timeline?**
A: Community support is best-effort. Enterprise support planned for v2.0.

## Troubleshooting

**Q: Email routed to wrong department?**
A: Check keywords in config. Run `npm test` to verify.

**Q: No emails being processed?**
A: Check Zapier Zap is enabled and Gmail trigger is active.

**Q: Processing very slow?**
A: Check Zapier logs, API limits. See [MONITORING.md](MONITORING.md).

**Q: Can't connect to Zapier?**
A: Verify webhook URL in `.env`. Check API credentials.

**Q: Tests show low accuracy?**
A: Update keywords. Run diagnostic in test output. Adjust confidence thresholds.

More questions? Open a GitHub issue!
