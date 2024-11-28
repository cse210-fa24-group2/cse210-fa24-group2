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
let dragCounter = 0;

/*
* Function: addTask
* Adds a task to a specific todo list (either the today, tomorrow, this month or next month
* to do list). 
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
        'todo-next-month': 'Next Month'
    };

    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category: categoryMap[listId],
                task: taskText
            })
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
* Function: saveTasks
* Saves tasks to local storage. 
*/
// function saveTasks() {
//     const columns = document.querySelectorAll('.todo-list');
//     columns.forEach((column) => {
//     const tasks = Array.from(column.children).map((li) => ({
//         text: li.querySelector('span').textContent,
//         completed: li.classList.contains('completed'),
//     }));
//     localStorage.setItem(column.id, JSON.stringify(tasks));
//     });
// }

/*
* Function: loadTasks
* Loads tasks from local storage while the page is loading.
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
            'Next Month': 'todo-next-month'
        };

        todos.forEach(todo => {
            const listId = categoryMap[todo.category.trim()];
            if (listId) {
                const list = document.getElementById(listId);
                if (list) {
                    const li = createTodoElement(todo.id, todo.task);
                    list.appendChild(li);
                }
            } else {
                console.warn(`No matching list for category: ${todo.category}`);
            }
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}


//------------------------------------------------------------------------
/* Drag-and-drop functions
* Desired functionality is to:
*       - shade in cell when hovered over while dragging/dropping
*       - remove shade-in when dragging/dropping is done
*       - if cell1 is dragged over cell2, it replaces spot of cell2 and cell2 beyond shift downard by 1
*       - strikethrough a cell when tapped/clicked
*       - remove a cell when the 'x' is clicked
*       - save the inputted cells on reloads, etc. (save the data)
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
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('dragenter', handleDragEnter);
    li.addEventListener('dragleave', handleDragLeave);
    li.addEventListener('drop', (e) => handleDrop(e, li.closest('.todo-list').id));

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
    draggedItem.classList.add('dragging');
    dragCounter = 1; // Start tracking drag events
}

function handleDragOver(e) {
    e.preventDefault(); // Allow dropping
    const item = e.target;

    // Ensure the target is a valid item (only other list items)
    if (item && item.classList.contains('todo-item') && item !== draggedItem) {
    item.classList.add('drag-over');
    }
}

function handleDrop(e, targetListId) {
    e.preventDefault();
    const targetList = document.getElementById(targetListId);
    
    if (draggedItem && targetList) {
    // Insert the dragged item before the target item
    const targetItem = e.target;
    if (targetItem && targetItem.classList.contains('todo-item') && targetItem !== draggedItem) {
        targetList.insertBefore(draggedItem, targetItem);
    } else {
        targetList.appendChild(draggedItem); // If dropped at the end of the list
    }
    draggedItem.style.opacity = '1';
    draggedItem.classList.remove('dragging');
    draggedItem = null;
    dragCounter = 0; // Reset counter after drop
    cleanupHoverStates();
    saveTasks(); // Save tasks after moving them
    }
}

function handleDragEnter(e) {
    const item = e.target;
    if (item && item.classList.contains('todo-item') && item !== draggedItem) {
    item.classList.add('drag-over');
    }
    dragCounter++; // Increment on every dragenter
}

function handleDragLeave(e) {
    const item = e.target;
    if (item && item.classList.contains('todo-item') && item !== draggedItem) {
    item.classList.remove('drag-over');
    }
    dragCounter--; // Decrement on every dragleave
}

function handleDragEnd() {
    if (draggedItem) {
        draggedItem.style.opacity = '1'; // Reset opacity
        draggedItem.classList.remove('dragging'); // Remove class
        draggedItem = null; // Clear reference
    }
    cleanupHoverStates(); // Ensure no "hover" effects remain
}



// Cleanup hover states when dragging ends
function cleanupHoverStates() {
    const items = document.querySelectorAll('.todo-item');
    items.forEach((item) => {
        item.classList.remove('drag-over');
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

function toggleCompletion(taskElement) {
    taskElement.classList.toggle('completed');
}

// Event listener to trigger the toggle when clicking a task
const todoItems = document.querySelectorAll('.todo-item');

todoItems.forEach(item => {
    item.addEventListener('click', () => {
        toggleCompletion(item);
    });
});


// Load tasks when the page loads
window.addEventListener('load', loadTasks);