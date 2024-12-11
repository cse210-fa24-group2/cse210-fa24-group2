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

calendarGoogle = Blueprint('calendarGoogle', __name__)


def get_user_timezone(service):
    """
    Fetch the user's primary calendar timezone.

    Args:
        service: Google Calendar API service instance.

    Returns:
        str: The user's timezone as a string.
    """
    try:
        settings = service.settings().get(setting="timezone").execute()
        return settings.get("value", "UTC")
    except Exception:
        return "UTC"


# Function to build Google Calendar service using user credentials
def get_calendar_service():
    """
    Create and return a Google Calendar API service instance.

    Returns:
        Resource: Google Calendar API service.
    """
    if 'access_token' not in session or 'refresh_token' not in session:
        abort(401)

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

    if credentials.expired:
        credentials.refresh(google.auth.transport.requests.Request())
        # Update session tokens
        session['access_token'] = credentials.token
        session['refresh_token'] = credentials.refresh_token

    service = build('calendar', 'v3', credentials=credentials)
    return service


@calendarGoogle.route('/api/calendar/events', methods=['GET'])
def get_events():
    """
    Fetch Google Calendar events.

    Returns:
        Response: JSON response with event details.
    """
    try:
        service = get_calendar_service()
        user_timezone = get_user_timezone(service)
        now = datetime.now(timezone.utc).isoformat()
        events_result = service.events().list(
            calendarId='primary', timeMin=now,
            maxResults=10, singleEvents=True,
            orderBy='startTime', timeZone=user_timezone).execute()
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

        service = get_calendar_service()
        user_timezone = get_user_timezone(service)

        start = event_data.get('start')
        end = event_data.get('end')

        if not start or not end:
            return jsonify({"error": "Start and End time are required"}), 400

        event = {
            'summary': event_data.get('summary', 'No Title'),
            'location': event_data.get('location', ''),
            'description': event_data.get('description', ''),
            'start': {
                'dateTime': start,
                'timeZone': event_data.get('timeZone', user_timezone),
            },
            'end': {
                'dateTime': end,
                'timeZone': event_data.get('timeZone', user_timezone),
            }
        }

        created_event = service.events().insert(
            calendarId='primary', body=event).execute()

        return jsonify(created_event), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@calendarGoogle.route('/api/calendar/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    """
    Update an existing Google Calendar event.

    Args:
        event_id (str): The ID of the event to update.

    Returns:
        Response: JSON response with updated event details.
    """
    try:
        event_data = request.json
        service = get_calendar_service()
        event = service.events().get(calendarId='primary',
                                     eventId=event_id).execute()
        user_timezone = get_user_timezone(service)

        start_datetime = event_data['start'].replace('Z', '')
        end_datetime = event_data['end'].replace('Z', '')

        event['summary'] = event_data.get('summary', event['summary'])
        event['location'] = event_data.get('location',
                                           event.get('location', ''))
        event['description'] = event_data.get('description',
                                              event.get('description', ''))
        event['start'] = {
            'dateTime': start_datetime,
            'timeZone': event_data.get(
                'timeZone', event['start'].get('timeZone', user_timezone)),
        }
        event['end'] = {
            'dateTime': end_datetime,
            'timeZone': event_data.get(
                'timeZone', event['end'].get('timeZone', user_timezone)),
        }

        updated_event = service.events().update(calendarId='primary',
                                                eventId=event_id,
                                                body=event).execute()
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

    Returns:
        Response: JSON response with event details.
    """
    try:
        service = get_calendar_service()
        user_timezone = get_user_timezone(service)
        now = datetime.now().astimezone().replace(hour=0, minute=0,
                                                  second=0, microsecond=0)
        end_of_day = now + timedelta(hours=23, minutes=59, seconds=59)

        time_min = now.isoformat()
        time_max = end_of_day.isoformat()

        events_result = service.events().list(
            calendarId='primary',
            timeMin=time_min,
            timeMax=time_max,
            singleEvents=True,
            orderBy='startTime',
            timeZone=user_timezone
        ).execute()

        events = events_result.get('items', [])
        return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
