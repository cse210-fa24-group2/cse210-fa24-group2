# Use of Secrets for Environment Variables

## Status
Accepted

## Context
Environment variables often contain sensitive information (e.g., API keys, secrets). Proper handling and protection are essential.

## Decision
Environment variables are stored in GitHub Secrets to:
- Securely store and inject secrets into the workflow.
- Avoid hardcoding sensitive data into the repository.

## Consequences
- Ensures sensitive information is protected.
- Adds complexity to the setup and management of GitHub Secrets.
- Relies on GitHub’s secure storage and retrieval system.

