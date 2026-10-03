# Workflow Walkthrough

## Discover → Configure → Validate → Deploy

### 1. Discover

Document the source mailbox, inquiry types, definitions of urgent/normal/informational, business-hour coverage, team ownership, response-time commitments, CRM capture policy, and data-retention rules. Agree on when a human must review the message.

### 2. Configure

1. **Trigger:** Gmail detects a new message matching the chosen filter and provides sender, subject, body, and timestamp.
2. **Classify:** Claude analyzes the inquiry and returns one of the allowed priority labels. The basic sample focuses on priority; do not assume sentiment, intent, or confidence is reliably returned unless that is explicitly implemented and validated.
3. **Route:** Zapier Paths compare the normalized priority against the `HIGH`, `MEDIUM`, and `LOW` branches.
4. **Act:** Each path sends an approved acknowledgment and performs the explicitly configured CRM/escalation action.
5. **Record:** Zapier run history and the CRM provide separate operational evidence. Confirm both rather than inferring success from a single completed step.

See [`zapier/zap-blueprint.md`](../zapier/zap-blueprint.md) for the example step layout and [`config/`](../config/) for editable reference mappings.

### 3. Validate

Use synthetic examples first. Confirm that every input reaches exactly one intended branch; check reply recipient, message content, contact properties, duplicate handling, and the result of failed integrations. The local test fixture validates the JavaScript keyword classifier only; live workflow validation must be performed in a test Zap.

### 4. Deploy

After approval, enable the Zap, monitor its run history and connected systems, and keep a documented pause/rollback procedure. Revisit the prompt and routing rules using reviewed outcomes; do not tune from unreviewed model output alone.

## Example branch policy

| Priority | Example signals | Example handling |
| --- | --- | --- |
| `HIGH` | Time-critical outage, account access blocked, strong distress | Alert/escalate to a staffed owner and send a carefully worded acknowledgment |
| `MEDIUM` | Standard support or sales inquiry | Assign to the appropriate queue; use the approved response and optional CRM action |
| `LOW` | General product information or FAQ | Send a useful self-service response and retain a route to human support |

Priority is a routing aid, not a replacement for human judgment. Avoid promising that the underlying issue will be solved by the automated acknowledgment.
