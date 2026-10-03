# Architecture

## System components

| Component | Responsibility | Important boundary |
| --- | --- | --- |
| Gmail trigger | Detects a new matching message and exposes sender, subject, body, and timestamp to the Zap | Trigger filters and mailbox permissions are configured in the connected Gmail account |
| Zapier workflow | Orchestrates steps, passes fields, evaluates Paths, retries supported tasks, and records run history | A Zapier configuration must be created and authorized in the operator's account |
| Claude API | Interprets the inquiry and returns a priority label: `HIGH`, `MEDIUM`, or `LOW` | The sample classifier asks for a priority label; local tests do not call Claude |
| Zapier Paths | Selects a branch based on the classifier output | Keep path rules exhaustive and ensure an unexpected classifier output is visible and handled |
| Gmail send action | Sends the branch-specific acknowledgment or informational response | Review templates and sender/recipient mapping before activation |
| HubSpot action | Optionally creates or updates a contact and inquiry properties | `config/hubspot-fields.json` is an example; replace placeholder property names with real portal properties |
| Local JavaScript classifier | Provides a deterministic keyword-based fallback/reference implementation | `npm test` validates this local code, not live third-party integrations |

## Data flow

```text
New message
    │ Gmail: sender, subject, body, timestamp
    ▼
Zapier trigger and field mapping
    ▼
Claude classification (priority only in the basic example)
    ▼
Zapier Paths
    ├── HIGH   → urgent acknowledgment / escalation action
    ├── MEDIUM → standard acknowledgment / configured CRM action
    └── LOW    → informational or FAQ response
    ▼
Run history and connected-system records
```

The repository's `zapier/zap-blueprint.md` and `config/` files describe a configurable design, not a portable live Zap. The blueprint currently illustrates a HubSpot action on a selected path; decide explicitly whether all inquiries or only qualified inquiries should be entered into your CRM. Do not interpret the example as proof that every path currently creates a HubSpot record.

## Integrations and interfaces

- **Gmail:** trigger and reply actions are authorized through Zapier's app connection.
- **Claude:** the example calls the Anthropic Messages API (`https://api.anthropic.com/v1/messages`) with a model and prompt configured in the sample code/config. Confirm the currently supported model identifier and API requirements before deployment.
- **HubSpot:** map sender email to the contact email property and only map additional fields that exist in the target portal. The `customfield_*` names in the sample are placeholders.
- **Zapier:** handles app connections, path conditions, execution history, and account/task limits.

## Security and privacy

- Use Zapier-managed app connections or secret fields for credentials. Never put actual API keys in repository files, source code, issue reports, or execution logs.
- Request only the Gmail and HubSpot scopes needed for the workflow; review connected users and revoke unused access.
- Minimize the email content sent to the model and CRM. Avoid sending attachments or sensitive personal data unless approved, necessary, and covered by applicable policies.
- Treat email text as untrusted input. The classifier should return constrained labels; do not allow email content to select tools or alter workflow instructions.
- Disable response-body logging for sensitive messages and establish retention/deletion rules for Zapier history, model-provider data, and CRM records.
- Use synthetic messages for development; redact personal data from screenshots and troubleshooting reports.
- Keep human escalation for urgent, ambiguous, safety-related, or low-confidence cases. Validate legal, privacy, and sector-specific obligations before use.

## Reliability and failure boundaries

Monitor each handoff separately: trigger capture, classifier result, path match, CRM write, and email delivery. Define a safe fallback route for API timeouts, rate limits, malformed model output, and failed actions. A successful Zap run is not by itself proof that a customer received or acted on an email.
