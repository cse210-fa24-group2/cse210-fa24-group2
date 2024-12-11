"""
test_internship_api.py

Unit tests for the internship-related functionality in the Flask application.

This file contains unit tests for the internship endpoints, validating the
ability to fetch, add, update, and delete internships. Mocking is used to simulate
database operations and ensure tests are isolated from external dependencies.
"""

import unittest
from unittest.mock import patch, MagicMock
import os
import sys
from datetime import datetime

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../src"))
)

from src.app import app  # noqa: E402


class TestInternshipAPI(unittest.TestCase):
    """
    Unit tests for internship-related endpoints.
    """

    def setUp(self):
        """
        Set up the Flask test client with a mocked database session.
        """
        app.config["TESTING"] = True
        self.client = app.test_client()

        # Mock the database session and models
        self.mock_db_session = patch("src.app.db.session").start()
        self.mock_internship = MagicMock(
            internship_id=1,
            company_name="Test Company",
            position_title="Software Engineer Intern",
        )

    def tearDown(self):
        """
        Stop all active patches.
        """
        patch.stopall()

    def login(self):
        """
        Mock login for testing purposes.
        """
        with self.client.session_transaction() as sess:
            sess["user_id"] = 1

    @patch("src.app.db.session.query")
    def test_internship_tracker(self, mock_query):
        """
        Test the internship tracker endpoint.
        """
        self.login()

        # Mock the user's internships
        mock_query.return_value.filter_by.return_value.all.return_value = [
            self.mock_internship
        ]

        response = self.client.get("/internshipTracker")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Test Company", response.get_data(as_text=True))

    @patch("src.app.db.session.query")
    def test_send_internship_data(self, mock_query):
        """
        Test the internship data fetching endpoint.
        """
        self.login()

        # Mock the user's internships
        mock_query.return_value.filter_by.return_value.all.return_value = [
            self.mock_internship
        ]

        response = self.client.get("/internshipData")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Test Company", response.json[0]["company_name"])

    @patch("src.app.db.session.add")
    @patch("src.app.db.session.commit")
    def test_add_internship(self, mock_commit, mock_add):
        """
        Test adding a new internship entry.
        """
        self.login()

        # Mock adding a new internship
        self.mock_db_session.add.return_value = self.mock_internship
        self.mock_internship.internship_id = 1

        internship_data = {
            "company_name": "New Company",
            "position_title": "Intern",
            "application_status": "Applied",
            "date_applied": str(datetime.now().date()),
        }
        response = self.client.post("/api/internships", json=internship_data)

        self.assertEqual(response.status_code, 201)
        self.assertIn("Internship added successfully", response.get_data(as_text=True))

    @patch("src.app.db.session.query")
    @patch("src.app.db.session.commit")
    def test_update_internship(self, mock_commit, mock_query):
        """
        Test updating an internship.
        """
        self.login()

        mock_query.return_value.get.return_value = self.mock_internship

        updated_data = {"application_status": "Interview Scheduled"}
        response = self.client.put("/api/internships/1", json=updated_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Internship updated successfully", response.get_data(as_text=True))

    @patch("src.app.db.session.query")
    @patch("src.app.db.session.commit")
    def test_delete_internship(self, mock_commit, mock_query):
        """
        Test deleting an internship.
        """
        self.login()

        mock_query.return_value.filter_by.return_value.first.return_value = self.mock_internship

        response = self.client.delete("/api/internships/1")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Internship deleted successfully", response.get_data(as_text=True))

    @patch("src.app.db.session.query")
    def test_get_todays_internships(self, mock_query):
        """
        Test fetching internships with today's follow-up date.
        """
        self.login()

        today = datetime.now().date()
        self.mock_internship.follow_up_date = str(today)
        mock_query.return_value.filter_by.return_value.filter.return_value.all.return_value = [
            self.mock_internship
        ]

        response = self.client.get("/api/internships/today")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Test Company", response.json[0]["company_name"])


if __name__ == "__main__":
    unittest.main()