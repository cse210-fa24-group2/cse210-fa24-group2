# Usage of Ubuntu Latest for Runners

## Status
Accepted

## Context
The pipeline needs a stable and modern environment for running workflows. Linux-based runners provide a cost-effective and widely compatible solution.

## Decision
The `ubuntu-latest` runner was chosen for the following reasons:
- It provides pre-installed tools and libraries, reducing setup time.
- Maintains compatibility with Python, JavaScript, and other required tools.
- Supported and updated frequently by GitHub, ensuring reliability and security.

## Consequences
- Standardized execution environment across all jobs.
- Simplified maintenance due to GitHub-managed updates.
- May require adjustments if project dependencies demand specific OS features.

