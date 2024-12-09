/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { loadTodoList, addTask, loadTasks, deleteTask } from '../static/js/todoList.js';

describe('TodoList Functionality', () => {
    beforeEach(() => {
        // Reset the DOM and mock fetch before each test
        document.body.innerHTML = `<div id="todo-container"></div>`;
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('loads the To-Do List HTML into the container', async () => {
        const mockHtml = `
            <div class="to-do-column">
                <h3>Today</h3>
                <div class="todo-content">
                    <ul id="todo-today" class="todo-list"></ul>
                </div>
            </div>
            <div class="to-do-column">
                <h3>This Week</h3>
                <div class="todo-content">
                    <ul id="todo-week" class="todo-list"></ul>
                </div>
            </div>
            <div class="to-do-column">
                <h3>This Month</h3>
                <div class="todo-content">
                    <ul id="todo-month" class="todo-list"></ul>
                </div>
            </div>
            <div class="to-do-column">
                <h3>Next Month</h3>
                <div class="todo-content">
                    <ul id="todo-next-month" class="todo-list"></ul>
                </div>
            </div>
        `;

        const mockTasks = {
            todos: [
                { id: 1, category: 'Today', task: 'Task 1' },
                { id: 2, category: 'This Week', task: 'Task 2' },
                { id: 3, category: 'This Month', task: 'Task 3' },
                { id: 4, category: 'Next Month', task: 'Task 4' },
            ],
        };

        // Mock fetch for '/todoList.html'
        fetch
            .mockResolvedValueOnce({
                ok: true,
                text: async () => mockHtml,
            })
            // Mock fetch for '/api/todos'
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockTasks,
            });

        await loadTodoList();

        const container = document.querySelector('#todo-container');
        expect(container.innerHTML).toContain('<div class="to-do-column">');
        expect(fetch).toHaveBeenCalledWith('/todoList.html');
        expect(fetch).toHaveBeenCalledWith('/api/todos');

        // Check if tasks are loaded correctly
        expect(document.getElementById('todo-today').children.length).toBe(1);
        expect(document.getElementById('todo-week').children.length).toBe(1);
        expect(document.getElementById('todo-month').children.length).toBe(1);
        expect(document.getElementById('todo-next-month').children.length).toBe(1);
    });

    test('loads tasks and populates the respective lists', async () => {
        const mockTasks = {
            todos: [
                { id: 1, category: 'Today', task: 'Task 1' },
                { id: 2, category: 'This Week', task: 'Task 2' },
                { id: 3, category: 'This Month', task: 'Task 3' },
                { id: 4, category: 'Next Month', task: 'Task 4' },
            ],
        };

        // Mock fetch for '/api/todos'
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTasks,
        });

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

        await loadTasks();

        expect(document.getElementById('todo-today').children.length).toBe(1);
        expect(document.getElementById('todo-week').children.length).toBe(1);
        expect(document.getElementById('todo-month').children.length).toBe(1);
        expect(document.getElementById('todo-next-month').children.length).toBe(1);
    });

    test('adds a task to the specified list', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 3, category: 'Today', task: 'New Task' }),
        });

        document.body.innerHTML = `
            <div class="to-do-column">
                <ul id="todo-today" class="todo-list"></ul>
                <input type="text" id="input-today" />
            </div>
        `;

        const input = document.getElementById('input-today');
        input.value = 'New Task';

        await addTask('todo-today', 'input-today');

        const todayList = document.getElementById('todo-today');
        expect(todayList.children.length).toBe(1);
        expect(todayList.children[0].textContent).toContain('New Task');
        expect(input.value).toBe('');

        expect(fetch).toHaveBeenCalledWith('/api/todos', expect.any(Object));
    });

    test('handles invalid inputs when adding a task', async () => {
        document.body.innerHTML = `
            <div class="to-do-column">
                <ul id="todo-today" class="todo-list"></ul>
                <input type="text" id="input-today" />
            </div>
        `;

        const input = document.getElementById('input-today');
        input.value = '';

        await addTask('todo-today', 'input-today');

        const todayList = document.getElementById('todo-today');
        expect(todayList.children.length).toBe(0);
        expect(fetch).not.toHaveBeenCalled();
    });

    test('deletes a task from the list', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
        });

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
        await Promise.resolve();

        expect(taskList.children.length).toBe(0);
        expect(document.querySelector('.todo-item')).toBeNull();
        expect(fetch).toHaveBeenCalledWith('/api/todos/1', { method: 'DELETE' });
    });

    test('handles Enter key functionality for adding tasks', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 3, category: 'Today', task: 'Task via Enter' }),
        });

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

        await addTask('todo-today', 'input-today');

        const todayList = document.getElementById('todo-today');
        expect(todayList.children.length).toBe(1);
        expect(todayList.children[0].textContent).toContain('Task via Enter');
    });
});
