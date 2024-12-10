import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta
from src.app import app, db, Internship

class InternshipAPITestCase(unittest.TestCase):
    """Comprehensive unit tests for internship-related endpoints."""

    def setUp(self):
        """Set up the Flask test client and mock session data."""
        self.app = app
        self.app.testing = True
        self.client = self.app.test_client()

        # Mock session for an authenticated user
        with self.client.session_transaction() as session:
            session['user_id'] = 1

    def tearDown(self):
        """Clean up after each test."""
        pass  # Add any necessary cleanup logic here

    @patch('src.app.db.session.query')
    def test_get_todays_internships(self, mock_query):
        """Test fetching today's internships."""
        today = datetime.now().date()
        mock_internship = MagicMock()
        mock_internship.to_dict.return_value = {"companyName": "Test Co."}
        mock_query.return_value.filter_by.return_value.filter.return_value.all.return_value = [mock_internship]

        response = self.client.get('/api/internships/today')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Test Co.', response.get_data(as_text=True))

    @patch('src.app.db.session.query')
    def test_get_todays_internships_empty(self, mock_query):
        """Test fetching today's internships when no results."""
        mock_query.return_value.filter_by.return_value.filter.return_value.all.return_value = []

        response = self.client.get('/api/internships/today')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, [])

    @patch('src.app.db.session')
    def test_add_internship(self, mock_session):
        """Test adding a new internship."""
        new_internship = {
            "company_name": "New Co",
            "position_title": "Software Intern",
            "application_status": "Applied",
            "date_applied": str(datetime.now().date())
        }
        response = self.client.post('/api/internships', json=new_internship)
        self.assertEqual(response.status_code, 201)
        self.assertIn('Internship added successfully', response.get_data(as_text=True))

    @patch('src.app.db.session')
    def test_add_internship_invalid_data(self, mock_session):
        """Test adding a new internship with invalid data."""
        invalid_internship = {"company_name": ""}  # Missing required fields
        response = self.client.post('/api/internships', json=invalid_internship)
        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid data', response.get_data(as_text=True))

    @patch('src.app.db.session.query')
    @patch('src.app.db.session.commit')
    def test_update_internship(self, mock_commit, mock_query):
        """Test updating an internship."""
        mock_internship = MagicMock()
        mock_query.return_value.get.return_value = mock_internship

        update_data = {"application_status": "Interview Scheduled"}
        response = self.client.put('/api/internships/1', json=update_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('Internship updated successfully', response.get_data(as_text=True))
        mock_commit.assert_called_once()

    @patch('src.app.db.session.query')
    @patch('src.app.db.session.commit')
    def test_update_internship_not_found(self, mock_commit, mock_query):
        """Test updating a non-existent internship."""
        mock_query.return_value.get.return_value = None
        update_data = {"application_status": "Interview Scheduled"}

        response = self.client.put('/api/internships/999', json=update_data)
        self.assertEqual(response.status_code, 404)
        self.assertIn('Internship not found', response.get_data(as_text=True))

    # @patch('src.app.db.session.query')
    # @patch('src.app.db.session.commit')
    # def test_delete_internship(self, mock_commit, mock_query):
    #     """Test deleting an internship."""
    #     mock_internship = MagicMock()
    #     mock_query.return_value.filter_by.return_value.first.return_value = mock_internship

    #     response = self.client.delete('/api/internships/1')
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn('Internship deleted successfully', response.get_data(as_text=True))
    #     mock_commit.assert_called_once()

    # @patch('src.app.db.session.query')
    # def test_delete_internship_not_found(self, mock_query):
    #     """Test deleting a non-existent internship."""
    #     mock_query.return_value.filter_by.return_value.first.return_value = None

    #     response = self.client.delete('/api/internships/999')
    #     self.assertEqual(response.status_code, 404)
    #     self.assertIn('Internship not found', response.get_data(as_text=True))

    @patch('src.app.db.session.query')
    def test_internship_data_fetch(self, mock_query):
        """Test fetching all internship data."""
        mock_internship = MagicMock()
        mock_internship.to_dict.return_value = {"companyName": "Test Co."}
        mock_query.return_value.filter_by.return_value.all.return_value = [mock_internship]

        response = self.client.get('/internshipData')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Test Co.', response.get_data(as_text=True))

    @patch('src.app.db.session.query')
    def test_internship_tracker(self, mock_query):
        """Test the internship tracker route."""
        mock_internship = MagicMock()
        mock_internship.to_dict.return_value = {"companyName": "Test Co."}
        mock_query.return_value.filter_by.return_value.all.return_value = [mock_internship]

        response = self.client.get('/internshipTracker')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Test Co.', response.get_data(as_text=True))


if __name__ == '__main__':
    unittest.main()
