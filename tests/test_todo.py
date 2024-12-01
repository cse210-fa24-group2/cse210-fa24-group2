"""
test_todo.py

Unit tests for the to-do list functionality in the Flask application.
"""

import unittest
import sys
import os


sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../src"))
    )

from src.app import app, db, Todo, User  # noqa: E402


class TestTodoList(unittest.TestCase):
    """
    Unit tests for to-do list-related endpoints.
    """

    def setUp(self):
        """
        Set up the test client and in-memory database.
        """
        app.config["TESTING"] = True
        # In-memory database for testing
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.client = app.test_client()

        # Initialize the database
        with app.app_context():
            db.create_all()
            user = User(google_id="test_google_id", name="Test User")
            db.session.add(user)
            db.session.commit()

    def tearDown(self):
        """
        Tear down the in-memory database after each test.
        """
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def login(self):
        """
        Mock login for testing purposes.
        """
        with self.client.session_transaction() as sess:
            sess["id_google"] = "test_google_id"

    def test_get_todos(self):
        """
        Test fetching all to-dos for the logged-in user.
        """
        self.login()
        response = self.client.get("/api/todos")
        self.assertEqual(response.status_code, 200)
        self.assertIn("todos", response.json)

    def test_add_todo(self):
        """
        Test adding a new to-do for the logged-in user.
        """
        self.login()
        todo_data = {"category": "Today", "task": "Test Task"}
        response = self.client.post("/api/todos", json=todo_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn("id", response.json)

    def test_delete_todo(self):
        """
        Test deleting a to-do by ID.
        """
        self.login()
        with app.app_context():
            user = User.query.filter_by(google_id="test_google_id").first()
            todo = Todo(
                user_id=user.id,
                category="Today",
                task_text="Test Task")
            db.session.add(todo)
            db.session.commit()

            response = self.client.delete(f"/api/todos/{todo.id}")
            self.assertEqual(response.status_code, 200)
            self.assertIn("message", response.json)

    def test_update_todo_category(self):
        """
        Test updating the category of a to-do.
        """
        self.login()
        with app.app_context():
            user = User.query.filter_by(google_id="test_google_id").first()
            todo = Todo(user_id=user.id, category="Today",
                        task_text="Test Task")
            db.session.add(todo)
            db.session.commit()

            update_data = {"category": "This Week"}
            response = self.client.patch(f"/api/todos/{todo.id}/category",
                                         json=update_data)
            self.assertEqual(response.status_code, 200)
            self.assertIn("message", response.json)


if __name__ == "__main__":
    unittest.main()
