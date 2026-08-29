# Monitoring Guide

Production monitoring and maintenance procedures.

## Daily Monitoring

### Morning Check (9 AM)

```bash
npm test
```

Verify:
- Zero failed email routes
- No unprocessed emails
- Sentiment analysis accuracy >95%
- Response time <2 seconds

### Hourly Alerts

Check for:
- Routing failures (critical alert)
- Processing delays >5 seconds (warning)
- API connection errors (critical alert)

### Alert Thresholds

| Level    | Condition | Action |
|----------|-----------|--------|
| Critical | Routing accuracy <90% | Page on-call immediately |
| Critical | Processing time >10s | Check API limits |
| Warning  | Accuracy 90-95% | Monitor trend |
| Warning  | Processing time 5-10s | Investigate logs |
| Info     | Normal operation | Log metrics |

## Weekly Review

Every Monday:

1. Review accuracy metrics
2. Check routing distribution
3. Analyze failed emails
4. Update department mappings if needed

## Monthly Review

1. Analyze trends (volume, accuracy, speed)
2. Review cost and API usage
3. Plan for scaling if needed
4. Update performance targets

## Troubleshooting

### High Routing Failures

Check:
- Email format validity
- Keyword dictionary completeness
- Department email addresses
- API connectivity

### Slow Processing

Check:
- Zapier rate limits
- Email size limits
- API response times
- Network connectivity

### Accuracy Drop

1. Review recent emails
2. Check keyword updates
3. Verify intent classification
4. Update training data

## Logs

Logs stored in `logs/` directory:
- `routing.log` - Email routing decisions
- `errors.log` - Any errors encountered
- `performance.log` - Processing times

Clean logs weekly:
```bash
npm run cleanup-logs
```

## Dashboard

Monitor via Zapier dashboard:
- Emails processed (daily, weekly, monthly)
- Success rate percentage
- Average processing time
- Cost per email
