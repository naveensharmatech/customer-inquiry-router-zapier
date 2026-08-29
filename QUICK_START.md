# Quick Start Guide

Get up and running with Customer Inquiry Router in 5 minutes.

## Prerequisites
- Node.js 14.0.0 or higher
- Zapier account (free tier supported)
- Gmail account (for email trigger)
- HubSpot account (optional, for CRM integration)

## 1. Clone and Setup

```bash
git clone https://github.com/naveensharmatech/customer-inquiry-router-zapier.git
cd customer-inquiry-router-zapier
npm install
```

## 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with:
- Your Gmail setup information
- Zapier webhook URL
- Email addresses for routing
- API keys (HubSpot, Claude, etc.)

## 3. Test Your Setup

Run the automated test suite:

```bash
npm test
```

Expected output:
```
✓ High priority emails routed correctly
✓ Medium priority emails routed correctly
✓ Low priority emails routed correctly
✓ Sentiment analysis accurate
✓ Intent classification working

Test Results: 10/10 passed (100%)
```

## 4. Deploy to Zapier

1. Open your Zapier editor
2. Create a new Zap with Gmail trigger
3. Import configuration from `zapier/zap-export.json`
4. Test with sample emails
5. Turn on the Zap

## Next Steps

- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
- Check [FAQ.md](FAQ.md) for common questions
- Review [MONITORING.md](MONITORING.md) for ongoing maintenance

## Support

For issues or questions:
- Check [FAQ.md](FAQ.md)
- Review [CONTRIBUTING.md](CONTRIBUTING.md)
- Open an issue on GitHub
