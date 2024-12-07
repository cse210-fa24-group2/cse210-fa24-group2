/**
 * @jest-environment jsdom
 */

const { loadTodoList, addTask, loadTasks, deleteTask } = require('../static/js/todoList');
require('@testing-library/jest-dom');
const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

describe('TodoList Functionality', () => {
    beforeEach(() => {
        // Reset the DOM and fetch mocks before each test
        document.body.innerHTML = `
            <div id="todo-container"></div>
        `;
        fetchMock.resetMocks();
    });

    test('loads the To-Do List HTML into the container', async () => {
        // Mock the HTML content for the to-do list
        const mockHtml = `
            <div class="to-do-column">
                <h3>Today</h3>
                <div class="todo-content">
                    <ul id="todo-today" class="todo-list"></ul>
                </div>
            </div>
        `;
        fetchMock.mockResponseOnce(mockHtml);

        // Call the function to load the to-do list
        await loadTodoList();

        // Verify the HTML content is loaded correctly
        const container = document.querySelector('#todo-container');
        expect(container.innerHTML).toContain('<div class="to-do-column">');
        expect(fetchMock).toHaveBeenCalledWith('/todoList.html');
    });

    test('loads tasks and populates the respective lists', async () => {
        // Mock the API response with sample tasks
        fetchMock.mockResponseOnce(JSON.stringify({
            todos: [
                { id: 1, category: 'Today', task: 'Task 1' },
                { id: 2, category: 'This Week', task: 'Task 2' },
                { id: 3, category: 'This Month', task: 'Task 3' },
                { id: 4, category: 'Next Month', task: 'Task 4' },
            ],
        }));

        // Setup the DOM with placeholders for task lists
        document.body.innerHTML = `
            <div id="todo-container">
                <div class="to-do-column">
                    <ul id="todo-today" class="todo-list"></ul>
                </div>
                <div class="to-do-column">
                    <ul id="todo-week" class="todo-list"></ul>
                </div>
                <div class="to-do-column">
                    <ul id="todo-month" class="todo-list"></ul>
                </div>
                <div class="to-do-column">
                    <ul id="todo-next-month" class="todo-list"></ul>
                </div>
            </div>
        `;

        // Call the function to load tasks
        await loadTasks();

        // Verify tasks are loaded into the correct lists
        expect(document.getElementById('todo-today').children.length).toBe(1);
        expect(document.getElementById('todo-week').children.length).toBe(1);
        expect(document.getElementById('todo-month').children.length).toBe(1);
        expect(document.getElementById('todo-next-month').children.length).toBe(1);
    });

    test('adds a task to the specified list', async () => {
        // Mock the API response for adding a task
        fetchMock.mockResponseOnce(JSON.stringify({ id: 3, category: 'Today', task: 'New Task' }));

        // Setup the DOM with a task input and list
        document.body.innerHTML = `
            <div class="to-do-column">
                <ul id="todo-today" class="todo-list"></ul>
                <input type="text" id="input-today" />
            </div>
        `;

        const input = document.getElementById('input-today');
        input.value = 'New Task';

        // Call the function to add a task
        await addTask('todo-today', 'input-today');

        // Verify the task is added to the list
        const todayList = document.getElementById('todo-today');
        expect(todayList.children.length).toBe(1);
        expect(todayList.children[0].textContent).toContain('New Task');
        expect(input.value).toBe(''); // Ensure the input is cleared
    });

    test('handles invalid inputs when adding a task', async () => {
        // Setup the DOM with a task input and list
        document.body.innerHTML = `
            <div class="to-do-column">
                <ul id="todo-today" class="todo-list"></ul>
                <input type="text" id="input-today" />
            </div>
        `;

        const input = document.getElementById('input-today');
        input.value = ''; // Set empty input

        // Call the function to add a task
        await addTask('todo-today', 'input-today');

        // Verify no task is added
        const todayList = document.getElementById('todo-today');
        expect(todayList.children.length).toBe(0);
    });

    test('deletes a task from the list', async () => {
        // Mock the API response for deleting a task
        fetchMock.mockResponseOnce('', { status: 200 });

        // Setup the DOM with a task and delete button
        document.body.innerHTML = `
            <ul id="todo-today" class="todo-list">
                <li class="todo-item" data-id="1">
                    Task 1
                    <button class="remove-btn">×</button>
                </li>
            </ul>
        `;

        const deleteButton = document.querySelector('.remove-btn');
        const taskElement = document.querySelector('.todo-item');
        const taskList = document.getElementById('todo-today');

        // Simulate clicking the delete button
        deleteButton.addEventListener('click', async () => {
            await deleteTask(1, taskElement);
        });
        deleteButton.click();

        // Wait for async behavior
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Verify the task is removed from the list
        expect(taskList.children.length).toBe(0);
        expect(document.querySelector('.todo-item')).toBeNull();
    });

    test('handles Enter key functionality for adding tasks', async () => {
        // Mock the API response for adding a task
        fetchMock.mockResponseOnce(JSON.stringify({ id: 3, category: 'Today', task: 'Task via Enter' }));

        // Setup the DOM with a task input and list
        document.body.innerHTML = `
            <div class="to-do-column">
                <ul id="todo-today" class="todo-list"></ul>
                <input type="text" class="todo-input" id="input-today" />
            </div>
        `;

        const input = document.getElementById('input-today');
        input.value = 'Task via Enter';

        // Simulate pressing the Enter key
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        input.dispatchEvent(event);

        // Call the function to add a task
        await addTask('todo-today', 'input-today');

        // Verify the task is added to the list
        const todayList = document.getElementById('todo-today');
        expect(todayList.children.length).toBe(1);
        expect(todayList.children[0].textContent).toContain('Task via Enter');
    });
});
