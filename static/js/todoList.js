/*
* This file is for defining script functions of the to-do list component.
* Styling is based off of design spec. 
* Functions include:
*       - Adding tasks to list
*       - Removing tasks from list
*       - Moving tasks around in list (for better prioritization)
*       - Striking tasks from list
*/

let draggedItem = null;

/*
* Function: addTask
* Adds a task to a specific todo list (either the today, tomorrow, this month, or next month
* to-do list).
*
* @param listId - the list it is adding to
* @param inputId - the text it is going to add
*
* @return - null. Calls saveTasks function to save any added tasks.
*/
async function addTask(listId, inputId) {
    const taskInput = document.getElementById(inputId);
    const taskText = taskInput.value.trim();

    if (taskText === '') return;

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
        const li = createTodoElement(data.id, taskText);
        taskList.appendChild(li);
        taskInput.value = '';
    } catch (error) {
        console.error('Error adding task:', error);
    }
}
/*
* Function: loadTasks
* Loads tasks from the database while the page is loading.
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
            list.innerHTML = ''; // Clear list before loading

            todos
                .filter((todo) => todo.category === category)
                .forEach((todo) => {
                    const li = createTodoElement(todo.id, todo.task);
                    list.appendChild(li);
                });
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

/* Drag-and-drop functions */
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

async function deleteTask(id, taskElement) {
    try {
        await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        taskElement.remove();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

function handleDragStart(e) {
    draggedItem = e.target;
    draggedItem.style.opacity = '0.5';
}

function handleDragOver(e) {
    e.preventDefault(); // Allow dropping
    const targetList = e.currentTarget;
    targetList.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const targetList = e.currentTarget;
    const targetListId = targetList.id;

    if (draggedItem && targetList) {
        const taskId = draggedItem.getAttribute('data-id');
        const categoryMap = {
            'todo-today': 'Today',
            'todo-week': 'This Week',
            'todo-month': 'This Month',
            'todo-next-month': 'Next Month',
        };

        const newCategory = categoryMap[targetListId];

        if (newCategory) {
            updateTaskCategory(taskId, newCategory);
            targetList.appendChild(draggedItem);
        }
    }

    targetList.classList.remove('drag-over');
    draggedItem.style.opacity = '1';
    draggedItem = null;
}

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

function handleDragEnd() {
    if (draggedItem) {
        draggedItem.style.opacity = '1'; // Reset opacity
        draggedItem = null;
    }
}

// Ensure that all necessary handlers are attached to the todo list container
document.querySelectorAll(".todo-list").forEach((list) => {
    // Allow dragging over even if the list is empty
    list.addEventListener("dragover", (e) => {
        e.preventDefault(); // Allow the drop
        list.classList.add("drag-over"); // Add visual feedback for drop target
    });

    list.addEventListener("dragleave", (e) => {
        list.classList.remove("drag-over"); // Remove visual feedback
    });

    list.addEventListener("drop", (e) => {
        e.preventDefault();
        const targetListId = e.currentTarget.id; // Get the ID of the target list
        handleDrop(e, targetListId);
        list.classList.remove("drag-over"); // Remove visual feedback
    });
});

// Cleanup hover states when dragging ends
function cleanupHoverStates() {
    document.querySelectorAll(".todo-list").forEach((list) => {
        list.classList.remove("drag-over");
    });
}


document.querySelectorAll('.todo-input').forEach((input) => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const listId = input.closest('.to-do-column').querySelector('.todo-list').id;
            addTask(listId, input.id);
        }
    });
});

// Load tasks when the page loads
window.addEventListener('load', loadTasks);

module.exports = {
    addTask,
    loadTasks,
    deleteTask,
};