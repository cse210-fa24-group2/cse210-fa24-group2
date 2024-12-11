"""
test_calendar.py

Unit tests for calendar-related functionality in the Flask application.
"""

import unittest
import os
import sys
from unittest.mock import patch, MagicMock

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../src"))
    )

from src.app import app  # noqa: E402


class TestCalendar(unittest.TestCase):
    def setUp(self):
        """
        Set up the Flask test client and mock session data.
        This ensures tests run in a controlled environment
        with predefined session variables.
        """
        self.app = app
        self.app.testing = True
        self.client = self.app.test_client()

        # Mock session data to simulate an authenticated user
        with self.client.session_transaction() as session:
            session['id_google'] = 'test_google_id'
            session['access_token'] = 'mock_access_token'
            session['refresh_token'] = 'mock_refresh_token'

    @patch('calendarGoogle.get_calendar_service')
    def test_calendar_blueprint(self, mock_get_service):
        """
        Test if the calendar blueprint is registered and accessible.
        Simulates fetching events from the Google Calendar API.
        """
        # Mock the Google Calendar API service
        mock_service = MagicMock()
        mock_get_service.return_value = mock_service

        # Mock the events.list() response
        mock_events_list = mock_service.events.return_value.list
        mock_events_execute = mock_events_list.return_value.execute
        mock_events_execute.return_value = {'items': []}
        # Simulates an empty calendar

        # Perform the GET request to the events endpoint
        response = self.client.get('/api/calendar/events')
        self.assertEqual(response.status_code, 200)

    @patch('calendarGoogle.get_calendar_service')
    def test_calendar_event_creation(self, mock_get_service):
        """
        Test creating a new calendar event.
        Simulates inserting a new event into the Google Calendar API.
        """
        # Mock the Google Calendar API service
        mock_service = MagicMock()
        mock_get_service.return_value = mock_service

        # Mock the events.insert() response
        mock_events_insert = mock_service.events.return_value.insert
        mock_events_insert_execute = mock_events_insert.return_value.execute
        mock_events_insert_execute.return_value = {
            'id': 'mock_event_id',
            'summary': 'Test Event'
        }

        # Define the event data for the POST request
        event_data = {
            'summary': 'Test Event',
            'start': '2024-01-01T10:00:00Z',
            'end': '2024-01-01T11:00:00Z',
            'timeZone': 'UTC'
        }

        # Perform the POST request to create an event
        response = self.client.post('/api/calendar/events', json=event_data)
        self.assertEqual(response.status_code, 201)

    @patch('calendarGoogle.get_calendar_service')
    def test_calendar_event_deletion(self, mock_get_service):
        """
        Test deleting an existing calendar event.
        Simulates deleting an event using the Google Calendar API.
        """
        # Mock the Google Calendar API service
        mock_service = MagicMock()
        mock_get_service.return_value = mock_service

        # Mock the events.delete() response
        mock_events_delete = mock_service.events.return_value.delete
        mock_events_delete_execute = mock_events_delete.return_value.execute
        mock_events_delete_execute.return_value = {}

        # Simulate deleting an event
        event_id = 'mock_event_id'
        response = self.client.delete(f'/api/calendar/events/{event_id}')
        self.assertEqual(response.status_code, 200)

    @patch('calendarGoogle.get_calendar_service')
    def test_calendar_events_fetch(self, mock_get_service):
        """
        Test fetching events from the Google Calendar API.
        Simulates retrieving events using the Google Calendar API.
        """
        # Mock the Google Calendar API service
        mock_service = MagicMock()
        mock_get_service.return_value = mock_service

        # Mock the events.list() response
        mock_events_list = mock_service.events.return_value.list
        mock_events_list_execute = mock_events_list.return_value.execute
        mock_events_list_execute.return_value = {
            'items': [
                {
                    'id': 'mock_event_id',
                    'summary': 'Mock Event',
                    'start': {'dateTime': '2024-01-01T10:00:00Z'},
                    'end': {'dateTime': '2024-01-01T11:00:00Z'},
                }
            ]
        }

        # Perform the GET request to fetch events
        response = self.client.get('/api/calendar/events')
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
