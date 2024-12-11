# cse210-fa24-group2
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/5c719265d1dd4a93bfd5c0b9dddfc667)](https://app.codacy.com?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

# Introduction

[View our live site here.](https://cse210-fa24-group2.onrender.com/) Please note that because we are using a free version of Render to host, the site may take a few minutes to load if it has not been accessed for at least 15 minutes.

![FireStack Dashboard View](static/assets/images/webpageView.png)
*This is a sample view of our dashboard.*

# Features

## To-do List
The first feature that appears on the dashboard is to the to-do list. This is a space to outline and organize tasks by urgency of completion. We offer 4 bins to separate tasks into:
1. Today's Tasks
2. This Week's Tasks
3. This Month's Tasks
4. Next Month's Tasks

- **To add tasks into each respective bin**, type a task into the space that says `Add a task...` and then either click the blue `+` button or press the `return` key on the keyboard.

- **To remove tasks**, press the red `x` button on the right side of the task. 

- **To move a task from one bin to another**, drag the task and drop it in the desired bin when a faint blue background appears on hover. Tasks added to another bin will always be appended. 

*If many tasks (7+) are added to a single bin, scroll within the bin to see all the tasks.* 


## Calendar
The calendar is a tracking tool that allows for clear visualization of deadlines, meetings, or any other entered events.

Events on this calendar are shared with a user's Google Calendar. Any event from Google Calendar will appear here, and any event added here will also appear on Google Calendar. 

- **To add an event**, fill out the key information (i.e. event title and date/time) located at the bottom of this feature and press the `+` button if this is a new event or `update` button if this is an existing task. 

- **To change the month view**, press either the `<` or `>` button to go back or forward one month, respectively. **To change the year view**, enter the desired year in the box on the top right corner that stores the current year. 

- **To edit an event**, press the `edit` button on the event. If it needs to be deleted, press the red `x` button. *This will remove the event both from this calendar view as well as the user's Google Calendar.* 


## Upcoming Deadlines
Anything with a deadline set as today will be displayed here. This section fetches today's events from the:
- calendar section
- career tracker section

 
## Career Tracker
This section serves to organize and track internship/job applications. 

- **To add a job to track**, click the `Add Job` button to fill out a form with relevant info on a job application (i.e. company name, position, date applied) and click `Save` to add the details to the tracker. 

- **To edit job app details**, click the **pencil** icon that appears on the right side of the job application in the tracker. 

- **To remove a job app from the tracker**, click the big red `x` button the appears besides the pencil icon for that job application - *user will be asked to confirm whether this job application's details are to be removed.* 

- **To search for a job app**, enter desired keyword (can be related to company name, position title, application status, date applied or application link) in the search bar that appears on the right upper corner of this feature. The search will reveal any relevant applications.

- **To change the number of entries viewed** on the page, the user can select a desired number from the drop down button in the upper left corner, next to where it says `entries per page`. *We currently offer users to view 5, 10, 15, 20, and 25 entries per page.* 

## Additional Functionality
- This application is compatible with large screens as well as smallers screens (such as those on mobile devices).

- To accomodate for different user tastes in site colors, we incorporated both a light mode and dark mode, which can be switched into by clicking the `Toggle Theme` button on the top right corner of the webpage.

- Additionally, the navigation bar allows users to jump to a particular section in the webpage.


# Usage


# Tech Stack
- **Languages**: Python, Javascript, CSS, HTML
- **Database**: PostgreSQL (via SQLAlchemy)
- **Backend Framework**: Flask

# Repo Organization
```scss
cse210-fa24-group2/
├── static/
│   ├── assets/       
│   │   ├── icons/    # logo and symbols for features
│   │   ├── images/   # miscellaneous images for readme, etc.
│   │   ├── navbar/   # used for navigation bar when screen shrinks
│   ├── css/
│   │   ├── 404.css                 # error message formatting
│   │   ├── InternshipTracker.css   # career tracking feature formatting
│   │   ├── calendar.css            # calendar feature formatting
│   │   ├── signIn.css              # login formatting
│   │   ├── styles.css              # overall dashboard formatting
│   │   ├── todo.css                # todo list formatting
│   │   ├── vars.css                # global vars for color formatting
│   ├── js/                         # javascripts for all the features functionalities and more
│       ├── Calendar.js
│       ├── InternshipTracker.js
│       ├── app.js
│       ├── dateUtils.js
│       ├── privacy.js              # script for theme toggle button        
│       ├── script.js               # script for logout and theme toggle buttons
│       ├── signIn.js
│       ├── todoList.js
│       ├── upcomingDeadlines.js
├── src/
│   ├── app.py
│   ├── calendarGoogle.py
│   ├── client_secret.json
```

# Setup & Installation

# API Endpoints

# CI / CD Pipeline for FireStack

This repository includes a comprehensive CI/CD pipeline designed to ensure the continuous integration and deployment of FireStack. The pipeline automates setup, code quality checks, testing, static analysis, and deployment workflows, enabling a robust development lifecycle.
[Code for CI/CD](https://github.com/cse210-fa24-group2/cse210-fa24-group2/blob/main/.github/workflows/ci-cd.yml)

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
- [JSDocs can be viewed here.](https://github.com/cse210-fa24-group2/cse210-fa24-group2/tree/docs/jsdocs)

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
  - Executes end-to-end tests using manual testing.
- Uploads coverage reports as artifacts.
- Uploads coverage data to Codacy for detailed reporting here: [![Codacy Badge](https://app.codacy.com/project/badge/Grade/5c719265d1dd4a93bfd5c0b9dddfc667)](https://app.codacy.com?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

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

# Contributing
