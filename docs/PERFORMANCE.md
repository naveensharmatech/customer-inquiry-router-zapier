# Performance and ROI

## Reported case-study figures

| Metric | Before | Reported after | Interpretation |
| --- | --- | --- | --- |
| Manual triage effort | 2–3 hours/day | Approximately 98% less | Reported time reduction; measure hands-on triage time over comparable periods |
| Initial response time | About 24 hours | About 5 minutes | Reported elapsed time to acknowledgment, not resolution time |
| Lead capture | 60% | 100% | Reported capture result; verify against mailbox volume and CRM records |

These are project-reported figures supplied for the showcase. The repository does not include timestamped production exports, a controlled before/after study, or independent audit data. The local test suite is a deterministic fixture for the keyword classifier and cannot substantiate the figures above. Do not present them as a guarantee or independently verified benchmark.

## Measurement plan

Capture a baseline and a post-launch window with comparable weekday/volume mix:

- **Triage-time reduction:** `(baseline manual minutes − post-launch manual minutes) / baseline manual minutes × 100`.
- **Initial response time:** median and 90th percentile of received-to-first-acknowledgment elapsed time. Report business-hours and calendar-time definitions.
- **Capture rate:** unique eligible inquiries with a corresponding CRM record / unique eligible inquiries received. Define exclusions and deduplication in advance.
- **Reliability:** successful executions / eligible executions, with failures and retries counted consistently.
- **Classification quality:** human-reviewed correct priority assignments / reviewed classifications; publish sample size and review method.

Use mailbox receipt timestamps, Zapier run history, email sent timestamps, and HubSpot records as evidence. Reconcile duplicates and failed/filtered messages; avoid treating triggered messages alone as successfully captured leads.

## Monthly ROI model

```text
gross monthly labor value = verified hours saved × loaded hourly labor cost
net monthly value = gross monthly labor value − actual monthly Zapier/model/other costs
ROI (%) = net monthly value / actual monthly costs × 100
```

Illustration (not a reported financial result): if 50 hours are verified as saved and loaded labor costs $30/hour, gross labor value is $1,500 per month. Subtract the real plan and API costs for the deployed volume to estimate net value. Exclude speculative pipeline or conversion revenue unless it is supported by attribution data.

## Capacity and scaling

There is no measured throughput/capacity benchmark in this repository. Estimate capacity from the connected Zapier plan/task allowance, provider rate limits, average input/output tokens, action count per message, and peak arrival bursts. Pilot at expected peak volume, monitor queue delay and API errors, and increase plan capacity or redesign batching/queues only after testing retries, ordering, and duplicate protection.

## Reporting template

For each reporting period, record eligible messages, successfully classified messages, CRM capture rate, priority mix, median/P90 acknowledgment time, manual minutes spent, failure/retry counts, provider/task costs, and the measurement window. Include definitions and data source alongside every figure.
