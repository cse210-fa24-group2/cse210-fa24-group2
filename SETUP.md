# Updated Project Setup Instructions

In this step of our project, we extended the functionality to include integration with the Google Calendar API. This involved several significant updates to the existing project:

- **Added `calendarGoogle.py`**: A new module that handles interaction with Google Calendar API endpoints, allowing users to fetch, create, update, and delete calendar events.
- **Utilized the calendar branch**: Modified the branch to align with the new features, including adjustments for API communication and updating the directory structure for better organization.
- **API Endpoints**: Detailed API routes were implemented in `calendarGoogle.py` to manage calendar events.
- **Front-End Integration**: The HTML and JavaScript were updated to add features like event creation, deletion, and editing, ensuring seamless interaction with the backend.
- **Improved Directory Structure**: Refactored the project structure for consistency and maintainability.

This setup allows authenticated users to interact with their Google Calendar directly within the application, providing a dynamic and interactive experience.

## Steps

### 1. Set Up a Virtual Environment
Navigate to the project directory and create a virtual environment. Activate the virtual environment.

### 2. Install Dependencies
With the virtual environment activated, install the required packages:

```bash
pip install -r requirements.txt
```

### 3. Create the .env File
The `.env` file stores your environment variables and secrets. It should be placed in the root directory of the project.

### Steps:
- Create a new file named `.env` in the root directory:

  ```bash
  touch .env
  ```

- Open the `.env` file in a text editor and add the following variables:

  ```env
  FLASK_SECRET_KEY='your_flask_secret_key'
  GOOGLE_CLIENT_ID='your_google_client_id'
  GOOGLE_CLIENT_SECRET='your_google_client_secret'
  REDIRECT_URI='http....'
  ```

### 4. Create the `client_secret.json` File
Place the downloaded `client_secret.json` file in the `src/` directory of the project. This file is obtained from the Google Cloud Console and contains credentials for OAuth 2.0.

### 5. Run the Application
With all configurations in place, you can now run the Flask application.

```bash
python src/app.py
```

### 6. Interact with the API Endpoints

#### API Endpoints in `calendarGoogle.py`

- **Fetch Events**
  - **Endpoint**: `/api/calendar/events`
  - **Method**: GET
  - **Description**: Fetches the list of calendar events starting from the current date.
  - **Response**: Returns a JSON object containing event details.

- **Create Event**
  - **Endpoint**: `/api/calendar/events`
  - **Method**: POST
  - **Payload Example**:
    ```json
    {
      "summary": "Meeting",
      "start": "2024-11-30T10:00:00Z",
      "end": "2024-11-30T11:00:00Z",
      "location": "San Diego",
      "description": "Discuss project updates",
      "timeZone": "UTC"
    }
    ```
  - **Description**: Creates a new event in the user's Google Calendar.

- **Update Event**
  - **Endpoint**: `/api/calendar/events/<event_id>`
  - **Method**: PUT
  - **Payload Example**:
    ```json
    {
      "summary": "Updated Meeting",
      "start": "2024-11-30T12:00:00Z",
      "end": "2024-11-30T13:00:00Z",
      "location": "Updated Location",
      "description": "Updated details",
      "timeZone": "UTC"
    }
    ```
  - **Description**: Updates the details of an existing event.

- **Delete Event**
  - **Endpoint**: `/api/calendar/events/<event_id>`
  - **Method**: DELETE
  - **Description**: Deletes an event from the user's Google Calendar.

## Updated Directory Structure

```scss
cse210-fa24-group2/
├── static/
│   ├── css/
│   │   ├── calendar.css
│   ├── js/
│       ├── app.js
│       ├── dateUtils.js
│       ├── Calendar.js
├── src/
│   ├── app.py
│   ├── calendarGoogle.py
│   ├── client_secret.json
├── calendar.html
```

By following these steps and updates, you can successfully set up the project and interact with Google Calendar using the integrated API.