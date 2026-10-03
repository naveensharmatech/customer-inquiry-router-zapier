# Setup and Configuration

## Prerequisites

- A Zapier account with the task volume and features required by your workflow.
- A Gmail account/mailbox for the trigger and approved response sender.
- An Anthropic account with API access and billing configured if using Claude.
- A HubSpot account only if CRM capture is part of the design.
- Node.js 14 or later to run the local examples and tests.
- Access to the business-approved response templates, priority policy, and data-handling requirements.

## Configure local examples

1. Clone this repository and install dependencies with `npm install`.
2. Review `config/claude-config.json`, `config/email-config.json`, and `config/hubspot-fields.json`. They are examples; adjust prompt, priorities, and CRM properties to your use case.
3. Run `npm test` to check the local keyword classifier. These tests do not contact external services.
4. Keep real credentials out of the repository. `.env.example` contains placeholders only; do not replace them with live secrets or commit a populated `.env` file.

## Build the Zap

1. Create a new Zap and add **Gmail — New Email** as the trigger. Limit the mailbox/folder/search filter to messages intended for this workflow.
2. Test the trigger with a synthetic email. Confirm that sender, subject, and plain-text body fields are available and correctly mapped.
3. Add **Code by Zapier — Run JavaScript** (or an approved Anthropic integration) to classify the message. Use a Zapier-managed secret field/connection for the Anthropic API key; do not hardcode it in the script. Follow Anthropic's current API documentation for request headers, model ID, limits, and error handling.
4. Return a normalized priority value (`HIGH`, `MEDIUM`, or `LOW`) and validate that output before routing. Configure an explicit fallback/escalation path if classification fails or returns an unexpected value.
5. Add Zapier Paths with exact priority conditions. Attach the reviewed response template and responsible team/action to each path.
6. If using HubSpot, connect it using the least-privilege authorization available. Map to actual portal property names. Test both new and already-existing contacts and choose create/update behavior deliberately.
7. Review outgoing email addressing, sender identity, language, and claims. Use a test mailbox until the owner approves production templates.

## Validate before launch

- Run `npm test` for the deterministic local classifier fixture.
- Test each priority branch in Zapier with synthetic inputs and inspect task history.
- Include blank/long body, unknown output, API timeout/rate limit, duplicate contact, revoked connection, and failed email-send cases.
- Verify HubSpot data and email delivery in the destination systems, not only the Zapier step preview.
- Confirm no secrets or customer data appear in code, logs, screenshots, or the repository.

## Production deployment

1. Complete the [production checklist](../DEPLOYMENT.md) and obtain workflow/data-owner approval.
2. Activate the Zap during a staffed period with a small test audience or approved low-volume rollout.
3. Monitor run history, failures, path distribution, reply latency, CRM records, and usage/costs.
4. Document the on-call owner, alert path, rollback procedure, and how to pause the Zap.
5. Re-test after changing a prompt, path, integration connection, model, or response template.

## Credential setup

Store credentials only in Zapier's managed connections or secret storage. For local development, use an untracked environment file only when needed; never commit it. Rotate exposed keys immediately and remove them from source/history where applicable. Avoid copying secrets into execution logs or support requests.
