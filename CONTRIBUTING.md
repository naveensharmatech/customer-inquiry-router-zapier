# Contributing Guide

Guidelines for contributing to Customer Inquiry Router.

## Development Setup

1. Fork the repository
2. Clone your fork
3. Create a feature branch

```bash
git clone https://github.com/your-username/customer-inquiry-router-zapier.git
cd customer-inquiry-router-zapier
git checkout -b feature/your-feature-name
```

4. Install dependencies

```bash
npm install
```

## Development Workflow

### Code Style

- Use ESLint: `npm run lint`
- Format with Prettier: `npm run format`
- Use 2-space indentation
- Add comments for complex logic

### Testing

Before submitting:

```bash
npm test
```

All tests must pass (100% success rate required).

### Making Changes

1. Make your changes in a feature branch
2. Commit with clear messages
3. Push to your fork
4. Create a Pull Request

## Commit Message Format

```
[Type]: Brief description (50 chars max)

Longer explanation of why this change is needed (optional).
- Point 1
- Point 2

Closes #issue-number
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat: Add support for priority escalation

- Escalate high-priority emails after 2 hours
- Send notification to manager
- Add escalation config option

Closes #42
```

## PR Process

1. Ensure all tests pass
2. Add tests for new features
3. Update documentation
4. Keep commits clean and logical
5. Respond to review feedback

## Code Standards

### JavaScript Best Practices

- Use `const` by default, `let` if reassignment needed
- Avoid `var`
- Use async/await over callbacks
- Return early for error handling
- Add JSDoc comments for functions

Example:

```javascript
/**
 * Analyzes email sentiment
 * @param {string} emailBody - Email content
 * @returns {object} Sentiment analysis result
 */
async function analyzeSentiment(emailBody) {
  if (!emailBody) {
    throw new Error('Email body required');
  }
  // Implementation
  return result;
}
```

### Testing Standards

- Test all public functions
- Aim for >90% code coverage
- Test edge cases and errors
- Use descriptive test names

## Questions?

- Check [FAQ.md](FAQ.md)
- Review existing issues
- Open a discussion
- Contact maintainers

## Contributor Agreement

By submitting a PR, you agree your contribution will be licensed under the same license as this project.

Thank you for contributing!
