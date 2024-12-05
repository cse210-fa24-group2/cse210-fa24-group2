/**
 * @jest-environment jsdom
 */

require('@testing-library/jest-dom');
const { screen, fireEvent } = require('@testing-library/dom');
const { addTask, loadTasks, deleteTask } = require('../static/js/todoList');

// Mock Fetch API
global.fetch = jest.fn();

describe('todoList.js', () => {
    /**
     * Set up the DOM before each test.
     * This includes initializing the list containers and task input.
     */
    beforeEach(() => {
        // Set up our DOM for testing
        document.body.innerHTML = `
            <div id="todo-today" class="todo-list"></div>
            <div id="todo-week" class="todo-list"></div>
            <div id="todo-month" class="todo-list"></div>
            <div id="todo-next-month" class="todo-list"></div>
            <input id="task-input" class="todo-input" />
        `;
    });

    /**
     * Clear any mocks after each test to prevent interference between tests.
     */
    afterEach(() => {
        // Clear mocks between tests
        jest.clearAllMocks(); 
    });

    /**
     * Test: addTask adds a new task to the appropriate list.
     *
     * This test simulates adding a new task and checks if the task appears in the list.
     */
    test('addTask adds a new task to the list', async () => {
        // Mock successful POST response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: 1, category: 'Today', task: 'New Task' }),
        });

        const input = document.getElementById('task-input');
        input.value = 'New Task';
        await addTask('todo-today', 'task-input');

        // Check if the new task is in the DOM
        const task = screen.getByText('New Task');
        expect(task).toBeInTheDocument();
    });

    /**
     * Test: loadTasks populates the lists with tasks from the server.
     *
     * This test simulates fetching tasks from the server and checks if they appear in the correct lists.
     */
    test('loadTasks fetches and renders tasks into the appropriate lists', async () => {
        // Mock GET response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                todos: [
                    { id: 1, category: 'Today', task: 'Test Task 1' },
                    { id: 2, category: 'This Week', task: 'Test Task 2' },
                ],
            }),
        });

        await loadTasks();

        // Check if the tasks are in the DOM
        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    /**
     * Test: deleteTask removes the task from the DOM.
     *
     * This test simulates deleting a task and checks if the task is removed from the DOM.
     */
    test('deleteTask removes the task from the DOM', async () => {
        document.body.innerHTML = `
            <div id="todo-today" class="todo-list">
                <li data-id="1" class="todo-item">Test Task</li>
            </div>
        `;

        // Mock DELETE response
        fetch.mockResolvedValueOnce({ ok: true });

        const taskElement = screen.getByText('Test Task');
        await deleteTask(1, taskElement);

        // Check if the task is removed from the DOM
        expect(taskElement).not.toBeInTheDocument();
    });
});
