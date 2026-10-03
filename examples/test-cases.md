# Test Scenarios

The repository includes 10 deterministic priority fixtures in [`../tests/test-cases.json`](../tests/test-cases.json). `npm test` runs those fixtures against the local keyword classifier; it does not exercise Claude, Zapier, Gmail, HubSpot, delivery, or production metrics. The additional scenarios below are recommended end-to-end checks in a test Zap.

| # | Scenario | Expected result |
| --- | --- | --- |
| 1 | Urgent unexpected billing charge and upset customer | `HIGH`; route to staffed escalation; verify billing details are not over-shared |
| 2 | Customer locked out before a time-critical meeting | `HIGH`; urgent response and owner notification |
| 3 | Polite request for a product improvement | `LOW`; feedback/information path |
| 4 | Prospect asks about pricing and plans | `MEDIUM`; sales queue and optional CRM record |
| 5 | Routine password-reset question | `MEDIUM`; standard support response |
| 6 | Angry customer reports an outage and repeated failed contact | `HIGH`; human escalation, not an automated promise of resolution |
| 7 | General question about service availability | `LOW`; useful information and human-support option |
| 8 | Customer asks to cancel after a billing problem | `HIGH`; route to a human owner and validate cancellation action separately |
| 9 | Product evaluation question about integrations and policy | `MEDIUM`; sales follow-up with accurate approved information |
| 10 | Positive feedback thanking the support team | `LOW`; feedback path |
| 11 | Missing subject or empty message body | Do not silently discard; route to review or apply an explicitly approved fallback |
| 12 | Classifier returns malformed/unknown priority or times out | No unmatched path; alert/queue for human review and preserve the original inquiry |
| 13 | Duplicate sender already exists in HubSpot | Verify documented create/update behavior and avoid unintended duplicate contacts |
| 14 | HubSpot authorization/property mapping fails | Record the failure, alert an owner, and ensure the inquiry still has a recoverable follow-up path |
| 15 | Gmail send action is rejected or recipient is invalid | Detect failure in run history; do not count the acknowledgment as delivered |
| 16 | Burst volume triggers provider/task limits | Verify retry/backoff, queue delay, duplicate protection, and cost/plan limits |

## Run local tests

```bash
npm test
npm run test:high
npm run test:medium
npm run test:low
```

For integration scenarios, use synthetic addresses and data in a test mailbox/CRM portal. Inspect Zapier run history and the destination system for each action.
