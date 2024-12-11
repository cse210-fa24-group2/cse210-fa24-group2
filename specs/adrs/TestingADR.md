# Testing for the Dashboard

## Status
Accepted

## Context
The dashboard project integrates both frontend and backend functionalities, requiring robust testing strategies to ensure system reliability and user satisfaction. We chose Jest for frontend unit tests, given its widespread usage and compatibility with modern JavaScript applications. For backend testing, we use Python's `unittest` framework, which is well-suited for Flask applications. End-to-end (E2E) testing was initially considered; however, due to time constraints, the team decided to rely on manual testing for the current project phase.

The frontend tests focus on critical UI components and user interactions, while backend tests cover API endpoints and database interactions.

## Decision Drivers
1. **Frontend Testing**:
   - **Tools**: Jest with `jsdom` for simulating DOM environments.
   - **Focus**: Ensuring UI components and user interactions work as expected.
   - **Examples**:
     - `Calendar.test.js`: Tests calendar-related operations such as adding, deleting, updating events, and rendering the calendar.
     - `todoList.test.js`: Verifies to-do list functionalities, including task creation, deletion, and dynamic updates to the UI.

2. **Backend Testing**:
   - **Tools**: Python's `unittest` framework with `mock` for simulating dependencies.
   - **Focus**: Verifying Flask API endpoints, database interactions, and application logic.
   - **Examples**:
     - `test_app.py`: Tests core Flask routes, including login/logout, dashboard access, and session management.
     - `test_calendar.py`: Tests calendar-related API endpoints, such as event creation, deletion, and retrieval from Google Calendar.
     - `test_career_tracker.py`: Covers internship-related functionalities, including fetching, adding, updating, and deleting internship entries.
     - `test_todo.py`: Validates to-do list endpoints, including task retrieval, creation, and modification.

3. **End-to-End Testing (E2E)**:
   - **Decision**: Manual testing will be used for the current phase instead of automated tools like Cypress, due to time constraints.
   - **Focus**: Verifying that the overall workflow of the dashboard is functional, covering user login, navigation, and major feature interactions.

## Decision Outcome
1. **Frontend Unit Tests**:
   - Focus on modular components, ensuring isolated and reliable functionalities.
   - Example: `Calendar.test.js` validates CRUD operations and UI updates for calendar events.
   - Example: `todoList.test.js` ensures task management functions correctly in the UI.

2. **Backend Unit Tests**:
   - Ensure robust API functionality, including user authentication, data processing, and interaction with external services like Google Calendar.
   - Example: `test_calendar.py` verifies integration with Google Calendar APIs.
   - Example: `test_todo.py` confirms correct behavior for task management endpoints.

3. **Manual E2E Testing**:
   - Relies on structured test cases to simulate user interactions across the entire application.
   - Focuses on validating the integration of frontend and backend systems in realistic scenarios.

## Consequences
### Positive
- **Focused Coverage**: Unit tests ensure individual components and APIs function as intended.
- **Reduced Complexity**: Manual testing simplifies the immediate workload, allowing the team to meet deadlines.
- **Scalability**: The testing framework can easily accommodate future enhancements, such as adding automated E2E tests.

### Negative
- **Lack of Automated E2E Testing**: May result in missing bugs in complex workflows.
- **Reliance on Manual Effort**: Manual testing requires more time and may be prone to human error.

## Related Decisions
- Future plans include integrating automated E2E testing tools like Cypress to enhance testing coverage and reliability.

## Implementation Plan
1. **Frontend Tests**:
   - Continue building unit tests for critical UI components using Jest.
   - Ensure tests cover edge cases and simulate realistic user interactions.

2. **Backend Tests**:
   - Expand test coverage for Flask APIs, ensuring comprehensive validation of endpoints.
   - Mock external services (e.g., Google Calendar) to simulate real-world scenarios.

3. **Manual E2E Testing**:
   - Create structured test cases that document workflows for key features.
   - Assign team members to validate functionality across different environments.
