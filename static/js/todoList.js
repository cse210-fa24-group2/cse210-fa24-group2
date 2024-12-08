/**
 * This file defines script functions for the to-do list component.
 * Includes adding, removing, and organizing tasks.
 */

let draggedItem = null;

/**
 * Ensure the To-Do List loads correctly into the container.
 * @async
 */
async function loadTodoList() {
    try {
        const response = await fetch('/todoList.html');
        if (!response.ok) {
            console.error('Failed to fetch To-Do List HTML:', response.statusText);
            return;
        }

        const todoHTML = await response.text();
        const container = document.querySelector('#todo-container');
        if (container) {
            container.innerHTML = todoHTML;
            await loadTasks();
            attachDragAndDropHandlers();

            // Attach "Enter" key handler to input fields
            document.querySelectorAll('.todo-input').forEach((input) => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const listId = input.closest('.to-do-column').querySelector('.todo-list').id;
                        addTask(listId, input.id);
                    }
                });
            });
        } else {
            console.error('To-Do List container not found.');
        }
    } catch (error) {
        console.error('Error loading To-Do List:', error);
    }
}

/**
 * Load tasks from the database and populate the respective lists.
 * @async
 */
async function loadTasks() {
    try {
        const response = await fetch('/api/todos');
        if (!response.ok) {
            console.error('Failed to fetch tasks:', response.statusText);
            return;
        }

        const data = await response.json();
        const todos = data.todos;

        // Define valid categories and their corresponding list IDs
        const categoryMap = {
            'Today': 'todo-today',
            'This Week': 'todo-week',
            'This Month': 'todo-month',
            'Next Month': 'todo-next-month',
        };

        Object.keys(categoryMap).forEach((category) => {
            const list = document.getElementById(categoryMap[category]);
            if (list) {
                list.innerHTML = ''; // Clear list before loading
                todos
                    .filter((todo) => todo.category === category)
                    .forEach((todo) => {
                        const li = createTodoElement(todo.id, todo.task);
                        list.appendChild(li);
                    });
            } else {
                console.error(`List container for category "${category}" not found.`);
            }
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

/**
 * Add a task to a specific todo list (Today, This Week, etc.).
 * @async
 * @param {string} listId - The list's ID to which the task will be added.
 * @param {string} inputId - The input field's ID for the task text.
 */
async function addTask(listId, inputId) {
    const taskInput = document.getElementById(inputId);
    const taskText = taskInput?.value.trim();

    if (!taskText) return;

    const categoryMap = {
        'todo-today': 'Today',
        'todo-week': 'This Week',
        'todo-month': 'This Month',
        'todo-next-month': 'Next Month',
    };

    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category: categoryMap[listId],
                task: taskText,
            }),
        });

        if (!response.ok) {
            console.error('Failed to add task:', response.statusText);
            return;
        }

        const data = await response.json();
        const taskList = document.getElementById(listId);
        if (taskList) {
            const li = createTodoElement(data.id, taskText);
            taskList.appendChild(li);
        }
        taskInput.value = '';
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

/**
 * Create a new task element for the to-do list.
 * @param {number} id - The task ID.
 * @param {string} taskText - The task text.
 * @returns {HTMLElement} - The created task element.
 */
function createTodoElement(id, taskText) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.setAttribute('data-id', id);
    li.setAttribute('draggable', 'true');
    li.innerHTML = `
        <span>${taskText}</span>
        <button class="remove-btn">×</button>
    `;

    li.querySelector('.remove-btn').addEventListener('click', () => {
        deleteTask(id, li);
    });

    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragend', handleDragEnd);

    return li;
}

/**
 * Delete a task from the to-do list.
 * @async
 * @param {number} id - The task ID.
 * @param {HTMLElement} taskElement - The task element to be removed.
 */
async function deleteTask(id, taskElement) {
    try {
        const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        taskElement.remove();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

/**
 * Handle the start of a drag-and-drop event.
 * @param {Event} e - The drag event.
 */
function handleDragStart(e) {
    draggedItem = e.target;
    draggedItem.style.opacity = '0.5';
}

/**
 * Handle the end of a drag-and-drop event.
 */
function handleDragEnd() {
    if (draggedItem) {
        draggedItem.style.opacity = '1';
        draggedItem = null;
    }
}

/**
 * Attach drag-and-drop handlers to all to-do list containers.
 */
function attachDragAndDropHandlers() {
    document.querySelectorAll('.todo-list').forEach((list) => {
        list.addEventListener('dragover', (e) => {
            e.preventDefault();
            list.classList.add('drag-over');
        });

        list.addEventListener('dragleave', () => {
            list.classList.remove('drag-over');
        });

        list.addEventListener('drop', (e) => {
            e.preventDefault();
            handleDrop(e, list.id);
            list.classList.remove('drag-over');
        });
    });
}

/**
 * Handle the drop event for drag-and-drop functionality.
 * @param {Event} e - The drop event.
 * @param {string} listId - The ID of the list where the task is dropped.
 */
function handleDrop(e, listId) {
    const targetList = document.getElementById(listId);
    if (draggedItem && targetList) {
        const taskId = draggedItem.getAttribute('data-id');
        const categoryMap = {
            'todo-today': 'Today',
            'todo-week': 'This Week',
            'todo-month': 'This Month',
            'todo-next-month': 'Next Month',
        };

        const newCategory = categoryMap[listId];

        if (newCategory) {
            updateTaskCategory(taskId, newCategory);
            targetList.appendChild(draggedItem);
        }
    }
}

/**
 * Update the category of a task when moved.
 * @async
 * @param {number} taskId - The task ID.
 * @param {string} newCategory - The new category for the task.
 */
async function updateTaskCategory(taskId, newCategory) {
    try {
        const response = await fetch(`/api/todos/${taskId}/category`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: newCategory }),
        });

        if (!response.ok) {
            console.error('Failed to update task category:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating task category:', error);
    }
}

// Automatically load the To-Do List when the page loads
window.addEventListener('load', loadTodoList);

module.exports = { loadTodoList, addTask, loadTasks, deleteTask };
