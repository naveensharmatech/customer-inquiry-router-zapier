# Contributing to Customer Inquiry Router Zap

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building a welcoming community for automation enthusiasts and developers.

## How to Contribute

### Reporting Issues

Found a bug? Have a suggestion? Please open an issue with:
- Clear description of the problem
- Steps to reproduce (if applicable)
- Your environment details
- Screenshots or logs if helpful

### Improving Documentation

Documentation improvements are always welcome:
- Clarifications to existing docs
- Additional examples
- Better explanations of complex concepts
- Fixes for typos or grammar

To contribute documentation:
1. Fork the repository
2. Create a branch for your changes
3. Make your edits
4. Submit a pull request

### Testing Improvements

Help expand our test coverage:
- New test cases for edge cases
- Additional sample emails for different scenarios
- Performance testing documentation
- Integration testing examples

### Code Contributions

For significant code changes:
1. Open an issue first to discuss your idea
2. Fork the repository
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Commit your changes: `git commit -am 'Add your feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Submit a pull request

### Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Install dependencies: `npm install`
4. Run tests: `npm test`

## Testing Your Changes

Before submitting a pull request:
- Run all tests: `npm test`
- Test with sample emails of different priorities
- Verify HubSpot integration if your changes affect it
- Check that response emails are generated correctly

## Commit Message Guidelines

Use clear, descriptive commit messages:
- `fix: Resolve email parsing issue`
- `feat: Add support for custom priority rules`
- `docs: Update troubleshooting guide`
- `test: Add test cases for edge cases`

## Pull Request Process

1. Update documentation if needed
2. Add test cases for new functionality
3. Ensure all tests pass
4. Provide clear description of changes
5. Link to related issues if applicable

## Questions?

Feel free to:
- Open a discussion issue
- Check existing issues for similar questions
- Review the troubleshooting guide in TROUBLESHOOTING.md

Thank you for contributing!
