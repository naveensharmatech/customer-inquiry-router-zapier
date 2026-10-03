# Workflow Diagram

```text
┌────────────────┐
│ Customer email │
└───────┬────────┘
        ▼
┌────────────────┐
│ Gmail trigger  │  sender · subject · body · timestamp
└───────┬────────┘
        ▼
┌────────────────────────┐
│ Zapier + Claude        │  classify priority
└───────────┬────────────┘
            ▼
      ┌─────┼─────┐
      ▼     ▼     ▼
    HIGH  MEDIUM  LOW
      │     │     │
 urgent   queue/  FAQ or
 owner   optional info reply
 reply    HubSpot
      └─────┼─────┘
            ▼
      Zapier run history
```

HubSpot actions are optional/configuration-dependent. See [Architecture](../docs/ARCHITECTURE.md) for system boundaries and privacy controls.
