# cse210-fa24-group2
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/5c719265d1dd4a93bfd5c0b9dddfc667)](https://app.codacy.com?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

[View our live site here.](https://cse210-fa24-group2.onrender.com/) Please note that because we are using a free version of Render to host, the site may take a few minutes to load if it has not been accessed for at least 15 minutes.

# What does FireStack Do

# Setup

# CI / CD Pipeline for FireStack

This repository includes a comprehensive CI/CD pipeline designed to ensure the continuous integration and deployment of FireStack. The pipeline automates setup, code quality checks, testing, static analysis, and deployment workflows, enabling a robust development lifecycle.

## CI / CD Pipeline

### Trigger Events
The pipeline triggers on the following events:
- **Push**: Executes on any push to the `main` branch.
- **Pull Request**: Executes for pull requests targeting the `main` branch.

### Jobs

#### 1. **Setup**
Sets up the environment to prepare for subsequent jobs. This includes:
- Checking out the code from the repository.
- Setting up Python 3.8.
- Installing Python dependencies and additional tools like `black`, `flake8`, `pylint`, `coverage`, `jest`, `jsdoc`, `cypress`, and `eslint`.
- Configuring environment variables using repository secrets.

#### 2. **JSDocs**
Generates and pushes JavaScript documentation to the `docs` branch.
- Generates JSDocs using `jsdoc.json`.
- Commits and pushes changes to the `docs` branch if updates are detected.

#### 3. **Linting and Code Quality**
Performs code linting and quality checks for Python and JavaScript:
- Python:
  - Checks formatting with `black`.
  - Runs `flake8` and `pylint` for linting.
- JavaScript:
  - Lints code using `eslint`.
- Codacy:
  - Analyzes Python and JavaScript code for quality using the Codacy CLI.

#### 4. **Static Analysis**
Conducts a static code analysis using ESLint and plugins:
- Installs additional plugins (`eslint-plugin-security` and `eslint-plugin-jsdoc`).
- Performs static analysis on all JavaScript, TypeScript, and JSX/TSX files.
- Uploads static analysis reports as artifacts.

#### 5. **Testing**
Runs automated tests to ensure the integrity of the application:
- Python:
  - Executes unit tests with `unittest` and generates coverage reports using `coverage`.
- JavaScript:
  - Runs unit tests using `jest` with coverage enabled.
- End-to-End Tests:
  - Executes end-to-end tests using `cypress`.
- Uploads coverage reports as artifacts.
- Optionally uploads coverage data to Codacy for detailed reporting.

#### 6. **Deployment**
Handles deployment to Render:
- Deploys changes to the live environment using Render's API.
- Ensures this job only runs after successful completion of the `linting_and_code_quality` and `testing` jobs.
- Executes only on the `main` branch.

#### 7. **Optimization**
Minimizes CSS and JavaScript files for improved performance:
- Minifies files in the `static/css` and `static/js` directories using `clean-css-cli` and `terser`.
- Uploads the optimized files as artifacts.

## Repository Secrets
The pipeline requires the following secrets for secure operations:
- `FLASK_SECRET_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `REDIRECT_URI`
- `GITHUB_TOKEN`
- `CODACY_PROJECT_TOKEN`
- `RENDER_API_KEY`

Ensure these secrets are configured in the repository settings before running the pipeline.

## Notes
- **[skip ci]**: Commits with this tag in the message will skip pipeline execution.
- The pipeline ensures modular and reusable workflows, optimizing development efficiency.

For any questions or issues, please contact the repository maintainers.

