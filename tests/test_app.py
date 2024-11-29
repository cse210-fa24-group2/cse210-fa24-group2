"""Unit tests for the Flask application.

This module contains unit tests for the Flask application defined in `app.py`.
It tests the routes and functionality of the application,
including authentication, session management, and access control.
"""

import unittest
import os
from unittest.mock import patch, MagicMock
import sys


sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../src"))
    )

from src.app import app  # noqa: E402

# Set up environment variables needed for testing
os.environ['FLASK_SECRET_KEY'] = 'test_secret_key'
os.environ['GOOGLE_CLIENT_ID'] = 'test_google_client_id'
os.environ['GOOGLE_CLIENT_SECRET'] = 'test_google_client_secret'
os.environ['REDIRECT_URI'] = 'http://127.0.0.1:5000/callback'


class FlaskAppTestCase(unittest.TestCase):
    """Test case class for the Flask application."""

    def setUp(self):
        """Set up the test client for each test."""
        app.config['TESTING'] = True
        self.app = app.test_client()

    def test_home_page(self):
        """Test that the home page loads correctly."""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<returnCard>', response.data)
        self.assertIn(b'Welcome', response.data)

    def test_dashboard_requires_login(self):
        """Test that accessing the dashboard without login returns 401."""
        response = self.app.get('/dashboard')
        self.assertEqual(response.status_code, 401)

    @patch('src.app.Flow')
    def test_login_route(self, mock_flow_class):
        """Test the login route and ensure it redirects correctly."""
        # Mock the OAuth flow
        mock_flow_instance = MagicMock()
        mock_flow_class.from_client_secrets_file.return_value = (
            mock_flow_instance
        )
        mock_flow_instance.authorization_url.return_value = (
            'http://mocked_auth_url', 'mocked_state'
        )

        response = self.app.get('/login')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            response.headers['Location'], 'http://mocked_auth_url')

        with self.app.session_transaction() as sess:
            self.assertEqual(sess['state'], 'mocked_state')

    @patch('src.app.Flow')
    @patch('src.app.id_token')
    def test_callback_route(self, mock_id_token_module, mock_flow_class):
        """Test the callback route and simulate successful authentication."""
        # Mock the OAuth flow
        mock_flow_instance = MagicMock()
        mock_flow_class.from_client_secrets_file.return_value = (
            mock_flow_instance
        )
        mock_flow_instance.fetch_token.return_value = None

        # Mock the credentials object
        mock_credentials = MagicMock()
        mock_credentials.token = "mocked_access_token"
        mock_credentials.refresh_token = "mocked_refresh_token"
        mock_flow_instance.credentials = mock_credentials

        # Mock id_token.verify_oauth2_token
        mock_id_token_module.verify_oauth2_token.return_value = {
            'sub': 'mocked_sub_id',
            'name': 'Mocked User'
        }

        with self.app.session_transaction() as sess:
            sess['state'] = 'mocked_state'

        response = self.app.get(
            '/callback?state=mocked_state&code=mocked_code')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            response.headers['Location'], 'http://localhost/dashboard')

        # Check if session is updated correctly
        with self.app.session_transaction() as sess:
            self.assertEqual(sess['id_google'], 'mocked_sub_id')
            self.assertEqual(sess['name'], 'Mocked User')
            self.assertEqual(sess['access_token'], 'mocked_access_token')
            self.assertEqual(sess['refresh_token'], 'mocked_refresh_token')

    def test_logout_route(self):
        """Test that logging out clears the session and redirects to home."""
        with self.app.session_transaction() as sess:
            sess['id_google'] = 'mocked_sub_id'
            sess['name'] = 'Mocked User'

        response = self.app.get('/logout')
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers['Location'], 'http://localhost/')

        with self.app.session_transaction() as sess:
            self.assertNotIn('id_google', sess)
            self.assertNotIn('name', sess)

    def test_dashboard_route_logged_in(self):
        """Test accessing the dashboard when the user is logged in."""
        with self.app.session_transaction() as sess:
            sess['id_google'] = 'mocked_sub_id'
            sess['name'] = 'Mocked User'

        response = self.app.get('/dashboard')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'<hgroup>', response.data)
        self.assertIn(b'Your Command Center', response.data)


if __name__ == '__main__':
    unittest.main()
