import unittest
import os
import sys
from datetime import datetime
from unittest.mock import patch, MagicMock

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
        This ensures tests run in a controlled environment
        with predefined session variables and mock data.
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
        self.mock_internship.to_dict.return_value = {
            "internshipId": "1",
            "companyName": "Test Company",
            "positionTitle": "Software Engineer Intern",
            "applicationStatus": "Applied",
            "dateApplied": None,
            "followUpDate": None,
            "applicationLink": None,
            "startDate": None,
            "contactPerson": None,
            "contactEmail": None,
            "referral": None,
            "offerReceived": None,
            "offerDeadline": None,
            "notes": None,
            "location": None,
            "salary": None,
            "internshipDuration": None,
        }

    def tearDown(self):
        """
        Stop all active patches to clean up after tests.
        """
        patch.stopall()

    def login(self):
        """
        Mock login for testing purposes by simulating session data.
        """
        with self.client.session_transaction() as sess:
            sess["user_id"] = 1
            sess["id_google"] = "mock_google_id"

    @patch("src.app.render_template")
    @patch("src.app.db.session.query")
    def test_internship_tracker(self, mock_query, mock_render_template):
        """
        Test the internship tracker endpoint with mocked template rendering.

        This test validates that the correct internship data is passed to the
        "InternshipTracker.html" template for rendering.
        """
        self.login()

        # Mock the user's internships
        mock_query.return_value.filter_by.return_value.all.return_value = [
            self.mock_internship
        ]

        mock_render_template.return_value = (
            "Rendered HTML with internship data"
        )

        response = self.client.get("/internshipTracker")
        self.assertEqual(response.status_code, 200)

        # Verify render_template was called with the correct data
        mock_render_template.assert_called_with(
            "InternshipTracker.html",
            internship_data=[self.mock_internship.to_dict()]
        )

    @patch("src.app.db.session.query")
    def test_send_internship_data(self, mock_query):
        """
        Test the internship data fetching endpoint.

        This test validates that the /internshipData endpoint correctly
        retrieves and returns internship data in JSON format.
        """
        self.login()

        # Mock the user's internships
        mock_query.return_value.filter_by.return_value.all.return_value = [
            self.mock_internship
        ]

        response = self.client.get("/internshipData")
        self.assertEqual(response.status_code, 200)

        # Verify the JSON response contains the expected data
        self.assertEqual(response.json, [self.mock_internship.to_dict()])

    @patch("src.app.db.session.add")
    @patch("src.app.db.session.commit")
    def test_add_internship(self, mock_commit, mock_add):
        """
        Test adding a new internship entry.

        This test ensures that a new internship can be added to the database
        and validates the response from the /api/internships endpoint.
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
        self.assertIn("Internship added successfully",
                      response.get_data(as_text=True))

    @patch("src.app.db.session.query")
    @patch("src.app.db.session.commit")
    def test_update_internship(self, mock_commit, mock_query):
        """
        Test updating an internship.

        This test ensures that an existing internship's details can be updated
        via the /api/internships/<id> endpoint and validates the response.
        """
        self.login()

        mock_query.return_value.filter_by.return_value.first.return_value = (
            self.mock_internship)

        updated_data = {"application_status": "Interview Scheduled"}
        response = self.client.put("/api/internships/1", json=updated_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("Internship updated successfully",
                      response.get_data(as_text=True))

    @patch("src.app.db.session.query")
    @patch("src.app.db.session.commit")
    def test_delete_internship(self, mock_commit, mock_query):
        """
        Test deleting an internship.

        This test ensures that an internship can be deleted via the
        /api/internships/<id> endpoint and validates the response.
        """
        self.login()

        mock_query.return_value.filter_by.return_value.first.return_value = (
            self.mock_internship)

        response = self.client.delete("/api/internships/1")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Internship deleted successfully",
                      response.get_data(as_text=True))

    @patch("src.app.db.session.query")
    def test_get_todays_internships(self, mock_query):
        """
        Test fetching internships with today's follow-up date.

        This test validates that the /api/internships/today endpoint
        retrieves internships with a follow-up date matching today's date.
        """
        self.login()

        today = datetime.now().date()
        self.mock_internship.follow_up_date = str(today)
        mock_filter_by = mock_query.return_value.filter_by.return_value
        mock_filter = mock_filter_by.filter.return_value
        mock_filter.all.return_value = [self.mock_internship]

        response = self.client.get("/api/internships/today")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Test Company", response.json[0]["companyName"])


if __name__ == "__main__":
    unittest.main()
