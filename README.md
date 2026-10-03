# AI-Powered Customer Inquiry Router

An automation reference project for triaging incoming customer email with Gmail, Zapier, Claude, and HubSpot. The workflow classifies inquiries by priority, routes them to an appropriate response path, and can record selected inquiries in a CRM.

> **Reported project outcomes:** approximately **98% less manual triage time**, a decrease in response time from **24 hours to about 5 minutes**, and **100% lead capture**. These are reported case-study figures, not results produced by the local test suite or independently audited production telemetry. See [Performance and ROI](docs/PERFORMANCE.md) for definitions and validation guidance.

## At a glance

| | |
| --- | --- |
| **Built by** | Naveen Sharma — AI Automation Engineer |
| **Workflow** | Gmail → Zapier → Claude → priority paths → email and optional HubSpot actions |
| **Implementation method** | Discover → Configure → Validate → Deploy |
| **Local checks** | 10 deterministic test cases for the keyword classifier |
| **Status** | Reusable reference implementation; configure and validate integrations in your own accounts |

## Business problem and reported impact

Manual triage can delay replies, make priority handling inconsistent, and leave inquiries out of a CRM. This project demonstrates a configurable workflow for classifying, routing, acknowledging, and tracking customer inquiries.

| Measure | Baseline | Reported outcome |
| --- | --- | --- |
| Manual triage effort | 2–3 hours per day | Approximately 98% lower |
| Initial response | About 24 hours | About 5 minutes |
| Lead capture | 60% | 100% |

These figures are context for the project story, not a service-level guarantee. Actual performance depends on account configuration, email volume, provider latency, operating hours, CRM mapping, and human follow-up. The ROI guide explains how to recalculate using your own data.

## Architecture

```text
Customer email
     │
     ▼
Gmail trigger ──► Zapier workflow ──► Claude priority classification
                                          │
                                  HIGH / MEDIUM / LOW
                                    ┌─────┼─────┐
                                    ▼     ▼     ▼
                                  urgent  normal  FAQ
                                  reply   reply   reply
                                          │
                               configured HubSpot action
                                    (selected path)
```

Gmail supplies the message fields, Claude returns a priority label, and Zapier Paths choose the follow-up. The repository includes a HubSpot mapping example; connect and test the action in the paths required by your business. See [Architecture](docs/ARCHITECTURE.md), the [workflow walkthrough](docs/WORKFLOW.md), or the [diagram description](assets/workflow-diagram.md).

## Implementation methodology

1. **Discover** — map inquiry sources, urgency criteria, ownership, response commitments, and CRM requirements.
2. **Configure** — connect Gmail in Zapier, secure the Anthropic credential, define the classifier and paths, and map HubSpot properties.
3. **Validate** — test all priorities, missing/duplicate data, service failures, and email delivery in a non-production setup.
4. **Deploy** — enable the Zap after approval, monitor task history and CRM records, and keep a rollback path.

## Technology and skills

| Technology | Use | Skill tags |
| --- | --- | --- |
| Zapier | Trigger, branching, integration orchestration | `workflow-automation` `no-code` |
| Claude API | Natural-language priority classification | `generative-ai` `prompt-design` `API-integration` |
| Gmail | Incoming inquiry trigger and response delivery | `email-automation` |
| HubSpot | Optional contact and inquiry tracking | `CRM` `RevOps` |
| JavaScript / Node.js | Reference classifier, utilities, and local checks | `JavaScript` `testing` |

## Success story and ROI

The case study describes a reported change from manual triage and delayed replies to an automated acknowledgment-and-routing workflow. A practical value estimate is:

```text
monthly gross labor value = verified hours saved × fully loaded hourly labor cost
monthly net value = monthly gross labor value − actual monthly platform/API costs
```

For illustration only, 50 verified hours saved at $30/hour is $1,500 gross labor value per month before platform and API fees. Use your own Zapier plan, model usage, and measured labor data; this example is not a guaranteed saving. See [Performance and ROI](docs/PERFORMANCE.md) and the [case study](assets/case-study.md).

## Get started

- [Setup and configuration](docs/SETUP.md)
- [Architecture and data flow](docs/ARCHITECTURE.md)
- [Workflow walkthrough](docs/WORKFLOW.md)
- [Performance and ROI methodology](docs/PERFORMANCE.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Production deployment checklist](DEPLOYMENT.md)
- [Zapier blueprint](zapier/zap-blueprint.md)

Run the local keyword-classifier tests with Node.js:

```bash
npm test
```

This command tests the repository's local classifier against the test fixture; it does **not** call Claude, Zapier, Gmail, or HubSpot. Priority-specific test commands are available as `npm run test:high`, `npm run test:medium`, and `npm run test:low`.

## Repository map

```text
.
├── assets/       # Case study, performance summary, workflow diagram description
├── code/         # Local keyword and Claude classifier examples
├── config/       # Example classifier and CRM field configuration
├── docs/         # Architecture, setup, workflow, performance, troubleshooting
├── examples/     # Safe sample Zap setup, email payloads, test scenarios
├── images/       # Workflow and Zap configuration illustrations
├── tests/        # Local classifier tests and sample email fixtures
└── zapier/       # Zap blueprint and Code by Zapier example
```

## Production checklist

- [ ] Confirm business hours, urgency definitions, ownership, and response SLAs.
- [ ] Store credentials in Zapier-managed secrets/connections; never commit or paste live keys into code or test data.
- [ ] Review data minimization, access permissions, retention, and customer notice requirements.
- [ ] Map every priority path to an owner and an approved response template.
- [ ] Verify HubSpot properties, duplicate behavior, and the paths that should create/update contacts.
- [ ] Test normal, urgent, malformed, duplicate, API-error, and delivery-failure cases.
- [ ] Enable the Zap only after a reviewer approves end-to-end test results.
- [ ] Monitor run failures, response delivery, lead capture, latency, and recurring costs; document rollback ownership.

## About the author

**Naveen Sharma — AI Automation Engineer**

Zapier AI Builder credentials (**9 certifications total**, as stated by the author), with a focus on practical automation, SaaS workflows, CRM operations, and AI integrations.

- **Open to:** remote roles, SaaS automation positions, and freelance projects
- **Services:** Zapier automation consulting, workflow design, and AI integration
- **Email:** [contact.naveensharmatech@gmail.com](mailto:contact.naveensharmatech@gmail.com)
- **LinkedIn:** [linkedin.com/in/naveensharmatech](https://linkedin.com/in/naveensharmatech)
- **Portfolio:** [naveensharma.net](https://naveensharma.net)
- **GitHub:** [github.com/naveensharmatech](https://github.com/naveensharmatech)

## License

This project is licensed under the [MIT License](LICENSE).
