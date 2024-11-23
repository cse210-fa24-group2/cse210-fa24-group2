# from flask import Blueprint, render_template
# import datetime
# import os.path
# import pathlib

# from google.auth.transport.requests import Request
# from google.oauth2.credentials import Credentials
# from google_auth_oauthlib.flow import InstalledAppFlow
# from googleapiclient.discovery import build
# from googleapiclient.errors import HttpError

# calendarGoogle = Blueprint("calendarGoogle", __name__, static_folder="static")

# SCOPES = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"]

# CLIENT_SECRETS_FILE = os.path.join(
#     pathlib.Path(__file__).parent, "client_secret.json"
# )

# def main():
#     creds = None

#     if os.path.exists("token.json"):
#         creds = Credentials.from_authorized_user_file("token.json", SCOPES)

#     if not creds or not creds.valid:
#         if creds and creds.expired and creds.refresh_token:
#             creds.refresh(Request())
#         else:
#             flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
#             creds = flow.run_local_server(port=8080)

#         with open("token.json", "w") as token:
#             token.write(creds.to_json())

    
#     try:
#         # THIS CODE IS FOR GETTING THE EVENTS

#         # service = build("calendar", "v3", credentials=creds)

#         # now = datetime.datetime.utcnow().isoformat() + "Z"
#         # print("Getting the upcoming 10 events")
#         # events_result = service.events().list(calendarId="primary", timeMin=now, maxResults=10, singleEvents=True, orderBy="startTime").execute()
#         # events = events_result.get("items", [])

#         # if not events:
#         #     print("No upcoming events found.")
#         #     return

#         # for event in events:
#         #     start = event["start"].get("dateTime", event["start"].get("date"))
#         #     print(start, event["summary"])

#         # THIS CODE IS FOR CREATING AN EVENT

#         service = build("calendar", "v3", credentials=creds)
#         event = {
#             'summary': 'Google I/O 2015',
#             'location': '800 Howard St., San Francisco, CA 94103',
#             'description': 'A chance to hear more about Google\'s developer products.',
#             'start': {
#                 'dateTime': '2015-05-16T09:00:00-07:00',
#                 'timeZone': 'America/Los_Angeles',
#             },
#             'end': {
#                 'dateTime': '2015-05-16T17:00:00-07:00',
#                 'timeZone': 'America/Los_Angeles',
#             },
#             'recurrence': [
#                 'RRULE:FREQ=DAILY;COUNT=2'
#             ],
#             'attendees': [
#                 {'email': 'lpage@example.com'},
#                 {'email': 'sbrin@example.com'},
#             ],
#             'reminders': {
#                 'useDefault': False,
#                 'overrides': [
#                 {'method': 'email', 'minutes': 24 * 60},
#                 {'method': 'popup', 'minutes': 10},
#                 ],
#             },
#         }

#         event = service.events().insert(calendarId="primary", body=event).execute()
#         print (f"Event created: {event.get('htmlLink')}")

#         eventID = event['id']

#         # THIS CODE IS FOR UPDATING AN EVENT
#         event = service.events().get(calendarId='primary', eventId=eventID).execute()

#         event['summary'] = 'Appointment at Somewhere'

#         updated_event = service.events().update(calendarId='primary', eventId=eventID, body=event).execute()

#         # Print the updated date.
#         print(updated_event['updated'])



#         # THIS CODE IS FOR DELETING AN EVENT
#         service.events().delete(calendarId='primary', eventId=eventID).execute()

#     except HttpError as error:
#         print("An error occured: ", error)

# if __name__ == "__main__":
#     main()


# # @calendarGoogle.route("/home")
# # def home():
# #     return render_template("index.html")




##################################### THE CODE BEGINS FROM THIS POINT ONWARDS

"""
calendarGoogle.py

This module provides routes for interacting with the Google Calendar API.
Users can create, read, update, and delete calendar events, assuming they
have already authenticated via Google OAuth 2.0.

Attributes:
    calendarGoogle (Blueprint): A Flask blueprint for Google Calendar operations.
"""

import os
from flask import Blueprint, request, session, jsonify, abort
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import google.auth.transport.requests
from datetime import datetime

# Create a Flask Blueprint
calendarGoogle = Blueprint('calendarGoogle', __name__)

# Function to build Google Calendar service using user credentials
def get_calendar_service():
    """
    Create and return a Google Calendar API service instance.

    Returns:
        Resource: Google Calendar API service.
    """
    if 'access_token' not in session or 'refresh_token' not in session:
        abort(401)  # Unauthorized if tokens are not present

    credentials = Credentials(
        token=session.get('access_token'),
        refresh_token=session.get('refresh_token'),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.environ.get("GOOGLE_CLIENT_ID"),
        client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
        scopes=[
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events"
        ]
    )

    # Refresh the token if expired
    if credentials.expired:
        credentials.refresh(google.auth.transport.requests.Request())
        # Update session tokens
        session['access_token'] = credentials.token
        session['refresh_token'] = credentials.refresh_token

    service = build('calendar', 'v3', credentials=credentials)
    return service

# API endpoint to get user's calendar events
@calendarGoogle.route('/api/calendar/events', methods=['GET'])
def get_events():
    """
    Fetch Google Calendar events.

    Returns:
        Response: JSON response with event details.
    """
    try:
        service = get_calendar_service()
        now = datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
        events_result = service.events().list(
            calendarId='primary', timeMin=now,
            maxResults=10, singleEvents=True,
            orderBy='startTime').execute()
        events = events_result.get('items', [])

        return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@calendarGoogle.route('/api/calendar/events', methods=['POST'])
def create_event():
    """
    Create a new Google Calendar event.

    Returns:
        Response: JSON response with created event details.
    """
    try:
        event_data = request.json

        # Ensure the incoming start and end are in correct ISO 8601 format
        if not event_data.get('start') or not event_data.get('end'):
            return jsonify({"error": "Start and End time are required"}), 400

        # Get the time zone from the request, or use a consistent default
        time_zone = event_data.get('timeZone', 'UTC')

        # Construct the event payload for Google Calendar API
        event = {
            'summary': event_data.get('summary', 'No Title'),
            'location': event_data.get('location', ''),
            'description': event_data.get('description', ''),
            'start': {
                'dateTime': event_data['start'],  # Ensure this is in correct ISO format
                'timeZone': time_zone,
            },
            'end': {
                'dateTime': event_data['end'],  # Ensure this is in correct ISO format
                'timeZone': time_zone,
            }
        }

        # Get Google Calendar service and insert the event
        service = get_calendar_service()
        created_event = service.events().insert(calendarId='primary', body=event).execute()

        return jsonify(created_event), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint to update an existing calendar event
@calendarGoogle.route('/api/calendar/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    """
    Update an existing Google Calendar event.

    Args:
        event_id (str): The ID of the event to be updated.

    Returns:
        Response: JSON response with updated event details.
    """
    try:
        event_data = request.json
        service = get_calendar_service()
        event = service.events().get(calendarId='primary', eventId=event_id).execute()

        event['summary'] = event_data.get('summary', event['summary'])
        event['location'] = event_data.get('location', event.get('location', ''))
        event['description'] = event_data.get('description', event.get('description', ''))
        event['start'] = {
            'dateTime': event_data.get('start', event['start']['dateTime']),
            'timeZone': event_data.get('timeZone', event['start']['timeZone']),
        }
        event['end'] = {
            'dateTime': event_data.get('end', event['end']['dateTime']),
            'timeZone': event_data.get('timeZone', event['end']['timeZone']),
        }

        updated_event = service.events().update(calendarId='primary', eventId=event_id, body=event).execute()

        return jsonify(updated_event), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint to delete an existing calendar event
@calendarGoogle.route('/api/calendar/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    """
    Delete an existing Google Calendar event.

    Args:
        event_id (str): The ID of the event to be deleted.

    Returns:
        Response: JSON response indicating the result of the delete operation.
    """
    try:
        service = get_calendar_service()
        service.events().delete(calendarId='primary', eventId=event_id).execute()

        return jsonify({"message": "Event deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
