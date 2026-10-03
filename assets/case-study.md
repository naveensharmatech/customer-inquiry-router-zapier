# Case Study: Customer Inquiry Router

## Challenge

Manual email triage can consume staff time, delay first responses, and leave inquiries unrecorded in a CRM. The project brief describes a baseline of 2–3 hours/day spent triaging, roughly 24-hour initial replies, and a 60% lead-capture rate.

## Approach

The reference workflow connects a Gmail trigger to Zapier, uses Claude to classify inquiry priority, branches by priority, and sends an approved response. A HubSpot action can be configured for the paths and records that the business chooses to capture. The repository includes local JavaScript classifier examples, configuration templates, and synthetic tests.

## Reported outcomes

The project brief reports approximately 98% lower manual triage time, initial response time of about 5 minutes, and 100% lead capture. These are author-reported case-study figures; repository files do not include production event exports or an independent audit. They are not promised outcomes, and the local unit tests do not verify them.

## Value model

Calculate actual value from measured labor and operating cost:

```text
monthly gross labor value = verified hours saved × loaded hourly labor cost
monthly net value = monthly gross labor value − actual monthly platform and API costs
```

For example, 50 verified hours saved at $30/hour represents $1,500 gross labor value before costs. This is an illustration, not a measured result. Avoid assigning recovered pipeline revenue without attribution data.

## Evidence and next measurement

Validate a real deployment using comparable before/after windows and reconcile:

- received eligible emails against completed workflow runs;
- acknowledgments against actual sent/delivered message evidence;
- CRM records against unique eligible inquiries, including duplicates/exclusions;
- human-reviewed classification quality, with sample size and criteria;
- manual triage effort, run failures, latency, and actual service costs.

See [Performance and ROI](../docs/PERFORMANCE.md) for measurement definitions and [Architecture](../docs/ARCHITECTURE.md) for the system's integration boundaries.
