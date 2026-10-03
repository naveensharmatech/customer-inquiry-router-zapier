# Troubleshooting

Start with the failed Zapier run and identify the exact step. A completed trigger does not prove classification, CRM sync, or email delivery succeeded.

## Common errors and fixes

| Symptom | Check | Action |
| --- | --- | --- |
| Gmail trigger does not fire | Connected mailbox, folder/search filter, trigger test, Zap status | Reauthorize the approved mailbox and test a new synthetic message that matches the filter |
| Claude returns 401/403 | Credential source, key rotation/revocation, API account access | Update the Zapier-managed secret/connection; never paste a key into logs or code |
| Claude returns 429 or 5xx | Provider status, rate limits, request volume, retry policy | Use bounded retry/backoff, monitor queue delay, and escalate repeated failures; do not retry indefinitely |
| Classification response cannot be parsed | API response shape, model identifier, output format, prompt | Validate the response and constrain output to the supported labels; route invalid output to human review |
| No Path matches | Classifier output spelling/case and exact path conditions | Normalize output and add a monitored fallback path for unknown values |
| HubSpot contact missing or duplicated | Action path, authorization, property names, email mapping, duplicate behavior | Test create/update behavior in a test portal and use real property names; the repository's `customfield_*` values are placeholders |
| Email acknowledgment is missing | Send action status, recipient mapping, sender authorization, delivery/bounce/spam | Inspect the Gmail step and destination mailbox; count a message only after verifying delivery evidence |
| Zap is slow | Per-step timestamps, task queue, message size, API latency, retries | Measure the slow step, trim unnecessary payload, reduce redundant API calls, and compare with provider status |
| Costs or task usage rise unexpectedly | Per-email action count, retries, token usage, Zapier task consumption | Review volume and failed-run retries; set budget/usage alerts and recalculate the per-inquiry cost |

## Performance optimization

- Pass only the fields required for classification; exclude attachments and unrelated message history.
- Prefer one constrained classification request to multiple calls unless additional outputs have a validated business need.
- Avoid storing full message bodies in logs or CRM fields without an approved purpose and retention policy.
- Measure trigger-to-classification, classification-to-action, and total acknowledgment time separately.
- Handle transient failures with bounded retries and idempotent CRM behavior to prevent duplicate actions.

## Scaling guidelines

There is no verified capacity benchmark in the repository. Before increasing volume, calculate provider/task limits and expected cost using real peak traffic. Load-test with representative synthetic messages, check burst/queue behavior and retry amplification, verify duplicate protection, and plan human coverage for the fallback queue. Upgrade limits or redesign the workflow only after reviewing observed metrics.

## Support resources

- [Zapier Help Center](https://help.zapier.com/)
- [Anthropic API documentation](https://docs.anthropic.com/)
- [Anthropic status](https://status.anthropic.com/)
- [HubSpot developer documentation](https://developers.hubspot.com/)
- Repository [FAQ](../FAQ.md), [setup guide](SETUP.md), and [deployment guide](../DEPLOYMENT.md)

When requesting help, share a redacted error message, failing step, timestamp, and a synthetic reproduction. Never send API keys, customer message contents, or unredacted execution logs.
