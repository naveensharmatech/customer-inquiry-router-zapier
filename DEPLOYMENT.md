# Deployment Guide

Complete guide for deploying to production.

## Pre-Launch Checklist

- [ ] All environment variables configured in `.env`
- [ ] Email addresses verified in config
- [ ] Test suite passing (100% success)
- [ ] Backup of current routing rules created
- [ ] Team notified of deployment
- [ ] Rollback plan documented

## Production Setup

### Step 1: Environment Configuration

```bash
NODE_ENV=production
DEBUG=false
```

### Step 2: Zapier Zap Configuration

1. Create production Zap (separate from dev)
2. Enable error notifications
3. Set up logging webhook
4. Configure rate limiting (1,500 emails/month)

### Step 3: Email Routing

Verify all department emails are configured:
- Urgent/Sales: your-sales@company.com
- Support: your-support@company.com
- General: your-info@company.com

### Step 4: Deployment

```bash
git checkout main
git pull origin main
npm install
npm test
# Deploy to Zapier
```

## Launch Day

1. **Morning (Before Launch)**
   - Final test run with live data
   - Verify all email addresses
   - Check monitoring dashboards

2. **Launch Time**
   - Enable Zapier Zap
   - Monitor for first 100 emails
   - Check error logs

3. **Post-Launch (First Hour)**
   - Monitor every email routing
   - Alert on any failures
   - Keep team on standby

4. **Stabilization (First Day)**
   - Monitor throughput
   - Check sentiment accuracy
   - Verify department routing

## Scaling Timeline

- **Week 1**: 100-500 emails/day
- **Week 2**: 500-1,000 emails/day
- **Week 3-4**: 1,000-1,500 emails/day

## Rollback Plan

If issues occur:

```bash
git revert <commit-hash>
git push origin main
# Disable Zapier Zap
# Restore from backup
```

## Success Metrics

Target performance:
- Email routing accuracy: >99%
- Processing time: <2 seconds per email
- System uptime: >99.9%
- Zero unrouted emails

Monitor these via [MONITORING.md](MONITORING.md)
