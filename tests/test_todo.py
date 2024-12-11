"""
test_todo.py

Unit tests for the to-do list functionality in the Flask application.

This file contains unit tests for the to-do list endpoints, validating the
ability to fetch, add, update, and delete tasks. Mocking is used to simulate
database operations and ensure tests are isolated from external dependencies.
"""

import unittest
from unittest.mock import patch, MagicMock
import os
import sys

sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../src"))
)

from src.app import app  # noqa: E402


class TestTodoList(unittest.TestCase):
    """
    Unit tests for to-do list-related endpoints.
    """

    def setUp(self):
        """
        Set up the Flask test client with a mocked database session.
        """
        app.config["TESTING"] = True
        self.client = app.test_client()

        # Mock the database session and models
        self.mock_db_session = patch("src.app.db.session").start()
        self.mock_todo = MagicMock(id=1, category="Today",
                                   task_text="Test Task")
        self.mock_user = MagicMock(id=1, google_id="test_google_id")

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
            sess["id_google"] = "test_google_id"

    @patch("src.app.User.query")
    def test_get_todos(self, mock_user_query):
        """
        Test fetching all to-dos for the logged-in user.
        """
        self.login()

        # Mock the user's todos
        mock_user_query.filter_by.return_value.first.return_value.todos = [
            self.mock_todo
        ]

        response = self.client.get("/api/todos")
        self.assertEqual(response.status_code, 200)
        self.assertIn("todos", response.json)

    def test_add_todo(self):
        """
        Test adding a new to-do for the logged-in user.
        """
        self.login()

        # Mock adding a new to-do
        self.mock_db_session.add.return_value = self.mock_todo
        self.mock_todo.id = 1

        todo_data = {"category": "Today", "task": "Test Task"}
        response = self.client.post("/api/todos", json=todo_data)

        self.assertEqual(response.status_code, 200)
        self.assertIn("id", response.json)

    @patch("src.app.Todo.query")
    def test_delete_todo(self, mock_todo_query):
        """
        Test deleting a to-do by ID.
        """
        self.login()

        mock_todo_query.get.return_value = self.mock_todo

        response = self.client.delete(f"/api/todos/{self.mock_todo.id}")
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json)

    @patch("src.app.Todo.query")
    def test_update_todo_category(self, mock_todo_query):
        """
        Test updating the category of a to-do.
        """
        self.login()

        mock_todo_query.get.return_value = self.mock_todo

        update_data = {"category": "This Week"}
        response = self.client.patch(
            f"/api/todos/{self.mock_todo.id}/category", json=update_data
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json)


if __name__ == "__main__":
    unittest.main()
