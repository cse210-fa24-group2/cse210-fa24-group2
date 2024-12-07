"""
app.py

This module implements the Flask application with Google OAuth 2.0
authentication and PostgreSQL database integration using SQLAlchemy.

Attributes:
    app (Flask): The Flask application instance.
    db (SQLAlchemy): SQLAlchemy database instance.
"""

import functools
import os
import pathlib

import cachecontrol
from dotenv import load_dotenv
from flask import Flask, abort, redirect, request, session, url_for, render_template
from flask_sqlalchemy import SQLAlchemy
import google.auth.transport.requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import requests
from src.calendarGoogle import calendarGoogle
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict

# Load environment variables from .env file
basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
load_dotenv(os.path.join(basedir, ".env"))

# Set environment variable to allow insecure transport for testing purposes
# IMPORTANT: Remove this or set to '0' in production to enforce HTTPS
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

app = Flask(
    __name__,
    static_folder=os.path.join(basedir, "static"),
    template_folder=os.path.join(basedir, "templates")
)
app.register_blueprint(calendarGoogle, url_prefix="")
app.secret_key = os.environ.get("FLASK_SECRET_KEY")

# Configure PostgreSQL database
DATABASE_URL = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

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

class User(db.Model):
    """
    User model to store user information.
    """
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)

class Internship(db.Model):
    """
    Internship model to store internship application information.
    """
    __tablename__ = 'internship'

    internship_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    company_name = db.Column(db.String(255), nullable=False)
    position_title = db.Column(db.String(255), nullable=False)
    application_status = db.Column(db.String(50), nullable=False)
    date_applied = db.Column(db.Date)
    follow_up_date = db.Column(db.Date)
    application_link = db.Column(db.Text)
    start_date = db.Column(db.Date)
    contact_person = db.Column(db.String(255))
    contact_email = db.Column(db.String(255))
    referral = db.Column(db.Boolean)
    offer_received = db.Column(db.Boolean)
    offer_deadline = db.Column(db.Date)
    notes = db.Column(db.Text)
    location = db.Column(db.String(255))
    salary = db.Column(db.Numeric(10, 2))
    internship_duration = db.Column(db.String(50))
    skills_required = db.Column(MutableDict.as_mutable(JSONB))

    user = db.relationship('User', back_populates='internships')

    def __repr__(self):
        return f'<Internship {self.internship_id}: {self.company_name} - {self.position_title}>'

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

    # Add user to the database if not exists
    user = User.query.filter_by(google_id=id_info.get("sub")).first()
    if not user:
        user = User(google_id=id_info.get("sub"), name=id_info.get("name"))
        db.session.add(user)
        db.session.commit()

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
    Home page with options for login.

    Returns:
        str: HTML content with options.
    """
    return render_template("signIn.html")


@app.route("/dashboard")
@login_required
def dashboard():
    """
    Dashboard page, accessible only to logged-in users.

    Returns:
        Response: Renders the index.html template.
    """
    return render_template("index.html")

@app.route("/internshipTracker")
@login_required
def internshipTracker():
    """
    Internship Tracker, accessible only to logged-in users.

    Fetch internship data from the PostgreSQL database and pass it to the template.

    Returns:
        Response: Renders the InternshipTracker.html template with internship data.
    """
    # Fetch internship data from the PostgreSQL database
    user_id = session["id_google"]
    internships = Internship.query.filter_by(user_id=user_id).all()
    return render_template("InternshipTracker.html", internships=internships)

@app.errorhandler(404)
def page_not_found(error):
    """
    Custom handler for 404 errors.

    Returns:
        Response: Renders the error404.html template with a 404 status code.
    """
    return render_template("error404.html"), 404

if __name__ == "__main__":
    # Create tables in the database
    with app.app_context():
        db.create_all()
    app.run(debug=True)
