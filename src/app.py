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
import json
import cachecontrol
from dotenv import load_dotenv
from flask import Flask, abort, redirect, request, session, jsonify
from flask import url_for, render_template
from flask_sqlalchemy import SQLAlchemy
import google.auth.transport.requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import requests
from src.calendarGoogle import calendarGoogle

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
    pathlib.Path(__file__).parent, "client_secret.json"
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



    # Add user to the database if not exists
    user = User.query.filter_by(google_id=id_info.get("sub")).first()
    if not user:
        user = User(google_id=id_info.get("sub"), name=id_info.get("name"))
        db.session.add(user)
        db.session.commit()
    # Store user information and credentials in the session
    session["user_id"] = user.id
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
    Home page with options for login.

    Returns:
        str: HTML content with options.
    """
    if "id_google" not in session:
        return render_template("signIn.html")
    else:
        return render_template("index.html")
  

@app.route("/privacy")
def privacy_policy():
    """
    Page containing privacy policy.
    """
    return render_template("privacy.html")


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

    Returns:
        Response: Renders the InternshipTracker.html template with data from the internship table.
    """
    # Get the logged-in user's ID from the session
    google_id = session.get("id_google")
    user_id = session.get("user_id")
    # Fetch internship data for the logged-in user
    internships = db.session.query(Internship).filter_by(user_id=user_id).all() # This variable has the object with all internships for the user
    internship_data = [obj.to_dict() for obj in internships]
    # Render the template with the internship data
    return render_template("InternshipTracker.html",internship_data=internship_data)
@app.route('/internshipData') 
def send_data():
    # Get the logged-in user's ID from the session
    google_id = session.get("id_google")
    user_id = session.get("user_id")
    # Fetch internship data for the logged-in user
    internships = db.session.query(Internship).filter_by(user_id=user_id).all() # This variable has the object with all internships for the user
    internship_data = [obj.to_dict() for obj in internships]
    print({"data": internship_data})
    # Render the template with the internship data
    return internship_data
    # data = {'message': 'Hello from Flask!', 'status': 'success'}
    # return jsonify(data) 
# Define the Internship model (if not already defined in your models)
class Internship(db.Model):
    __tablename__ = "internship"

    internship_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
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
    skills_required = str(db.Column(db.JSON))

    # Establish the relationship with the User model
    user = db.relationship("User", backref="internships")
    def to_dict(self):
        return {
            "internshipId":str(self.internship_id),
            "companyName": str(self.company_name),
            "positionTitle": str(self.position_title),
            "applicationStatus": str(self.application_status),
            "dateApplied": str(self.date_applied),
            "followUpDate": str(self.follow_up_date),
            "applicationLink": str(self.application_link),
            "startDate": str(self.start_date),
            "contactPerson": str(self.contact_person),
            "contactEmail": str(self.contact_email),
            "referral": str(self.referral),
            "offerReceived": str(self.offer_received),
            "offerDeadline": str(self.offer_deadline),
            "notes": str(self.notes),
            "location": str(self.location),
            "salary": str(self.salary),
            "internshipDuration": str(self.internship_duration),
            "skillsRequired": '["str(self.skills_required)"]', 
        }

@app.route("/api/internships", methods=["POST"])
@login_required
def add_internship():
    """
    API endpoint to add a new internship entry to the PostgreSQL table.

    Accepts JSON data from the client and writes it to the `internship` table.

    Returns:
        Response: JSON response indicating success or failure.
    """
    user_id = session.get("user_id")  # Get the logged-in user's ID from the session
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    data = request.json  # Get the JSON payload from the request
    processed_data = {
        key: (None if value == "" else value)
        for key, value in data.items()
    }
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    try:
        # Process skills_required from comma-separated string to JSON string
        skills_required = data.get("skills_required", "")
        if isinstance(skills_required, str):
            skills_list = [skill.strip() for skill in skills_required.split(",") if skill.strip()]
            skills_required = json.dumps(skills_list)  # Convert list to JSON string

        # Create a new internship entry
        new_internship = Internship(
            user_id=user_id,
            company_name=data.get("company_name"),
            position_title=data.get("position_title"),
            application_status=data.get("application_status", "Applied"),
            date_applied=processed_data.get("date_applied"),
            follow_up_date=processed_data.get("follow_up_date"),
            application_link=data.get("application_link"),
            start_date=processed_data.get("start_date"),
            contact_person=data.get("contact_person"),
            contact_email=data.get("contact_email"),
            referral=data.get("referral", False),
            offer_received=data.get("offer_received", False),
            offer_deadline=processed_data.get("offer_deadline"),
            notes=data.get("notes"),
            location=data.get("location"),
            salary=data.get("salary"),   
            internship_duration=data.get("internship_duration"),
            skills_required=skills_required,  # Store as JSON string
        )
        # Add to the database
        db.session.add(new_internship)
        db.session.commit()

        return jsonify({"message": "Internship added successfully", "internship_id": new_internship.internship_id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to add internship: {str(e)}"}), 500


@app.route('/api/internships/<int:internship_id>', methods=['PUT'])
def update_internship(internship_id):
    """
    Update an internship by its ID.
    """
    data = request.json  # Get the JSON data from the request
    internship = Internship.query.get(internship_id)  # Fetch the internship by ID

    if not internship:
        return jsonify({"error": "Internship not found"}), 404
        # Dynamically update the fields in the internship record
    for key, value in data.items():
        if hasattr(internship, key):
            if key in ['date_applied', 'follow_up_date', 'start_date', 'offer_deadline'] and not value:
                # Set nullable date fields to None if they are empty
                setattr(internship, key, None)
            elif key in ['referral', 'offer_received']:
                # Convert boolean-like values (if necessary)
                setattr(internship, key, bool(value))
            else:
                setattr(internship, key, value)


    try:
        db.session.commit()  # Save changes to the database
        return jsonify({"message": "Internship updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/internships/<int:internship_id>', methods=['DELETE'])
@login_required
def delete_internship(internship_id):
    """
    Delete an internship entry by its ID.

    Args:
        internship_id (int): The ID of the internship to delete.

    Returns:
        Response: JSON response indicating success or failure.
    """
    user_id = session.get("user_id")  # Get the logged-in user's ID from the session
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    # Fetch the internship entry for the given ID and user
    internship = Internship.query.filter_by(internship_id=internship_id, user_id=user_id).first()
    
    if not internship:
        return jsonify({"error": "Internship not found"}), 404

    try:
        # Delete the internship from the database
        db.session.delete(internship)
        db.session.commit()
        return jsonify({"message": "Internship deleted successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete internship: {str(e)}"}), 500


@app.route('/calendar.html')
def serve_calendar():
    """
    Serve the calendar.html template.
    """
    return render_template('calendar.html')


@app.route('/todoList.html')
def serve_todo_list():
    """
    Serve the To-Do List HTML file.
    """
    return render_template('todoList.html')
 

@app.errorhandler(404)
def page_not_found(error):
    """
    Custom handler for 404 errors.

    Returns:
        Response: Renders the error404.html template with a 404 status code.
    """
    return render_template("error404.html"), 404


class Todo(db.Model):
    """
    Todo model to store tasks for the to-do list.
    """
    __tablename__ = 'todo'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    task_text = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # today, week, etc.
    created_at = db.Column(db.DateTime, default=db.func.now())

    user = db.relationship('User', backref='todos')


@app.route("/api/todos", methods=["GET"])
@login_required
def get_todos():
    """
    Fetch all todos for the logged-in user.
    """
    user = User.query.filter_by(google_id=session["id_google"]).first()
    if not user:
        return {"error": "User not found"}, 404

    todos = Todo.query.filter_by(user_id=user.id).all()
    return {
        "todos": [
            {"id": todo.id, "category": todo.category, "task": todo.task_text}
            for todo in todos
        ]
    }


@app.route("/api/todos", methods=["POST"])
@login_required
def add_todo():
    """
    Add a new todo for the logged-in user.
    """
    data = request.json
    if not data or not data.get("category") or not data.get("task"):
        return {"error": "Invalid data"}, 400

    # Validate and normalize category
    valid_categories = ["Today", "This Week", "This Month", "Next Month"]
    category = data["category"].strip()
    if category not in valid_categories:
        return {"error": f"Invalid category: {category}"}, 400

    user = User.query.filter_by(google_id=session["id_google"]).first()
    if not user:
        return {"error": "User not found"}, 404

    new_todo = Todo(user_id=user.id, category=category, task_text=data["task"])
    try:
        db.session.add(new_todo)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to add todo: {str(e)}"}, 500

    return {
        "id": new_todo.id,
        "category": new_todo.category,
        "task": new_todo.task_text}


@app.route("/api/todos/<int:todo_id>", methods=["DELETE"])
@login_required
def delete_todo(todo_id):
    """
    Delete a todo by ID for the logged-in user.
    """
    user = User.query.filter_by(google_id=session["id_google"]).first()
    if not user:
        return {"error": "User not found"}, 404

    todo = Todo.query.filter_by(id=todo_id, user_id=user.id).first()
    if not todo:
        return {"error": "Todo not found"}, 404

    try:
        db.session.delete(todo)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to delete todo: {str(e)}"}, 500

    return {"message": "Todo deleted"}


@app.route("/api/todos/<int:todo_id>/category", methods=["PATCH"])
@login_required
def update_todo_category(todo_id):
    """
    Update the category of a todo by ID for the logged-in user.
    """
    user = User.query.filter_by(google_id=session["id_google"]).first()
    if not user:
        return {"error": "User not found"}, 404

    todo = Todo.query.filter_by(id=todo_id, user_id=user.id).first()
    if not todo:
        return {"error": "Todo not found"}, 404

    data = request.json
    new_category = data.get("category")
    if new_category not in ["Today", "This Week", "This Month", "Next Month"]:
        return {"error": f"Invalid category: {new_category}"}, 400

    try:
        todo.category = new_category
        db.session.commit()
        return {"message": "Category updated successfully"}
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to update category: {str(e)}"}, 500


if __name__ == "__main__":
    # Create tables in the database
    with app.app_context():
        db.create_all()
    app.run(debug=True)
