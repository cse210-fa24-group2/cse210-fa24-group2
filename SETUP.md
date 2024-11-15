# Project Setup Instructions

In this step of our project, we implemented Google OAuth 2.0 authentication to enable users to sign in using their Google accounts. This involved setting up a Flask application that interacts with Google's OAuth 2.0 API, handling the authentication flow, and securely managing user sessions. By integrating Google Sign-In, we provide a secure authentication process for users, which serves as an important component for our application's backend. This setup allows us to authenticate users and grant them access to protected resources within the application, paving the way for further development and feature integration.

## Steps
1. Set Up a Virtual Environment
2. Install Dependencies
3. Create the .env File
4. Create the `client_secret.json` File
5. Run the Application

## 1. Set Up a Virtual Environment
Navigate to the project directory and create a virtual environment. Activate the virtual environment.


## 2. Install Dependencies
With the virtual environment activated, install the required packages:

```bash
pip install -r requirements.txt
```

## 3. Create the .env File
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

## 4. Create the `client_secret.json` File
Place the downloaded `client_secret.json` file in the `src/` directory of the project.

## 5. Run the Application
With all configurations in place, you can now run the Flask application.

**Command:**

```bash
python src/app.py
```