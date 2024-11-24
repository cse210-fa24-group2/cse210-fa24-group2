"""
app.py

This module implements the Flask application with Google OAuth 2.0
authentication.

The application allows users to log in using their Google account and access
a protected dashboard. It demonstrates handling OAuth 2.0 flow,
session management, and securing routes with a custom decorator.

Attributes:
    app (Flask): The Flask application instance.
"""

import functools
import os
import pathlib

import cachecontrol
from dotenv import load_dotenv
from flask import Flask, abort, redirect, request, session
from flask import url_for, render_template
import google.auth.transport.requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import requests
from calendarGoogle import calendarGoogle


# Load environment variables from .env file
basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
load_dotenv(os.path.join(basedir, ".env"))

# Set environment variable to allow insecure transport for testing purposes
# IMPORTANT: Remove this or set to '0' in production to enforce HTTPS
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

app = Flask(
    __name__,
    static_folder=os.path.join(basedir, "static"),
    template_folder=basedir
)
app.register_blueprint(calendarGoogle, url_prefix="")
app.secret_key = os.environ.get("FLASK_SECRET_KEY")

# Google OAuth 2.0 Client ID and Client Secret
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")

# Redirect URI
REDIRECT_URI = os.environ.get("REDIRECT_URI", "http://127.0.0.1:5000/callback")

# Path to the client secrets JSON file downloaded from Google Cloud Console
CLIENT_SECRETS_FILE = os.path.join(
    pathlib.Path(__file__).parent, "/etc/secrets/client_secret.json"
    )

# OAuth 2.0 scopes (including Calendar API scopes)
SCOPES = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
]


def login_required(function):
    """
    Decorator that requires the user to be logged in to access the route.

    Args:
        function (Callable): The view function to decorate.

    Returns:
        Callable: The wrapped function that checks for user authentication.
    """

    @functools.wraps(function)
    def wrapper(*args, **kwargs):
        if "id_google" not in session:
            return abort(401)  # Unauthorized
        return function(*args, **kwargs)

    return wrapper


@app.route("/login")
def login():
    """
    Initiate Google OAuth 2.0 login process.

    Redirects the user to Google's OAuth 2.0 server for authentication.

    Returns:
        Response: A redirect response to the Google OAuth
        2.0 authorization URL.
    """
    # Create the flow instance
    flow = Flow.from_client_secrets_file(
        client_secrets_file=CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )
    # Generate the authorization URL and state token
    authorization_url, state = flow.authorization_url(access_type='offline')
    # Store the state in the session to verify the callback
    session["state"] = state
    return redirect(authorization_url)


@app.route("/callback")
def callback():
    """
    Handle the callback from Google's OAuth 2.0 server.

    Processes the authorization response, fetches the token, and retrieves
    user information. Stores user information in the session.

    Returns:
        Response: A redirect response to the dashboard.
    """
    # Verify the state parameter to prevent CSRF
    if session["state"] != request.args.get("state"):
        abort(500)  # State does not match!

    # Create the flow instance and set the state
    flow = Flow.from_client_secrets_file(
        client_secrets_file=CLIENT_SECRETS_FILE,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI,
    )
    flow.fetch_token(authorization_response=request.url)

    # Obtain credentials and create a session
    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(
        session=cached_session
        )

    # Verify the OAuth2 token
    try:
        id_info = id_token.verify_oauth2_token(
            id_token=credentials.id_token,
            request=token_request,
            audience=GOOGLE_CLIENT_ID,
        )
    except ValueError:
        # Invalid token
        abort(401)

    # Store user information and credentials in the session
    session["id_google"] = id_info.get("sub")
    session["name"] = id_info.get("name")
    session["access_token"] = credentials.token
    session["refresh_token"] = credentials.refresh_token

    return redirect(url_for('dashboard', _external=True))


@app.route("/logout")
def logout():
    """
    Log the user out and clear the session.

    Returns:
        Response: A redirect response to the home page.
    """
    session.clear()
    return redirect(url_for('home', _external=True))


@app.route("/")
def home():
    """
    Home page, prompting the user to log in.

    Returns:
        str: HTML content with a login prompt.
    """
    return (
        "Please Login to access the dashboard "
        "<a href='/login'><button>Login</button></a>"
    )


@app.route("/dashboard")
@login_required
def dashboard():
    """
    Dashboard page, accessible only to logged-in users.

    Returns:
        Response: Renders the index.html template.
    """
    return render_template("calendar.html")


if __name__ == "__main__":
    app.run(debug=True)
