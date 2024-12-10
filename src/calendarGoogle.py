"""
calendarGoogle.py

This module provides routes for interacting with the Google Calendar API.
Users can create, read, update, and delete calendar events, assuming they
have already authenticated via Google OAuth 2.0.

Attributes:
    calendarGoogle (Blueprint): A Flask blueprint for
    Google Calendar operations.
"""

import os
from flask import Blueprint, request, session, jsonify, abort
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import google.auth.transport.requests
from datetime import datetime, timedelta, timezone

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
            "https://www.googleapis.com/auth/calendar.events",
        ],
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
        # now = datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
        now = datetime.now(timezone.utc).isoformat()
        events_result = service.events().list(
            calendarId='primary', timeMin=now,
            maxResults=50, singleEvents=True,
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

        # Validate the input data
        start = event_data.get('start')
        end = event_data.get('end')
        time_zone = event_data.get('timeZone', 'UTC')

        if not start or not end:
            return jsonify({"error": "Start and End time are required"}), 400

        # Ensure proper formatting of dateTime
        try:
            datetime.fromisoformat(start.replace('Z', '+00:00'))
            datetime.fromisoformat(end.replace('Z', '+00:00'))
        except ValueError:
            return jsonify(
                {"error": "Invalid ISO format for start or end"}
                ), 400

        # Construct the event payload
        event = {
            'summary': event_data.get('summary', 'No Title'),
            'location': event_data.get('location', ''),
            'description': event_data.get('description', ''),
            'start': {
                'dateTime': start,
                'timeZone': time_zone,
            },
            'end': {
                'dateTime': end,
                'timeZone': time_zone,
            }
        }

        # Get Google Calendar service and insert the event
        service = get_calendar_service()
        created_event = service.events().insert(
            calendarId='primary', body=event).execute()

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
        event = service.events().get(
            calendarId='primary', eventId=event_id).execute()

        event['summary'] = event_data.get('summary', event['summary'])
        event['location'] = event_data.get(
            'location', event.get('location', ''))
        event['description'] = event_data.get(
            'description', event.get('description', ''))
        event['start'] = {
            'dateTime': event_data.get('start', event['start']['dateTime']),
            'timeZone': event_data.get('timeZone', event['start']['timeZone']),
        }
        event['end'] = {
            'dateTime': event_data.get('end', event['end']['dateTime']),
            'timeZone': event_data.get('timeZone', event['end']['timeZone']),
        }

        updated_event = service.events().update(
            calendarId='primary', eventId=event_id, body=event).execute()

        return jsonify(updated_event), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
        service.events().delete(
            calendarId='primary', eventId=event_id).execute()

        return jsonify({"message": "Event deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@calendarGoogle.route('/api/calendar/events/today', methods=['GET'])
def get_todays_events():
    """
    Fetch Google Calendar events for the current day in the user's time zone.
    """
    try:
        service = get_calendar_service()
        now = datetime.now().astimezone().replace(hour=0, minute=0,
                                                  second=0, microsecond=0)
        end_of_day = now + timedelta(hours=23, minutes=59, seconds=59)

        # Convert to ISO format
        time_min = now.isoformat()
        time_max = end_of_day.isoformat()

        events_result = service.events().list(
            calendarId='primary',
            timeMin=time_min,
            timeMax=time_max,
            singleEvents=True,
            orderBy='startTime',
        ).execute()

        events = events_result.get('items', [])
        return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
