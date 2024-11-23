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
function addTask(listId, inputId) {
    const taskList = document.getElementById(listId);
    const taskInput = document.getElementById(inputId);
    const taskText = taskInput.value.trim();

    if (taskText === '') return;

    const li = document.createElement('li');
    li.className = 'todo-item';
    li.setAttribute('draggable', 'true');
    li.innerHTML = `
    <span>${taskText}</span>
    <button class="remove-btn">×</button>
    `;

    li.querySelector('.remove-btn').addEventListener('click', () => {
    taskList.removeChild(li);
    saveTasks();
    });

    li.querySelector('span').addEventListener('click', () => {
    li.classList.toggle('completed');
    saveTasks();
    });

    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', (e) => handleDrop(e, listId));
    li.addEventListener('dragenter', handleDragEnter);
    li.addEventListener('dragleave', handleDragLeave);

    taskList.appendChild(li);
    taskInput.value = '';
    saveTasks(); 
}

/*
* Function: saveTasks
* Saves tasks to local storage. 
*/
function saveTasks() {
    const columns = document.querySelectorAll('.todo-list');
    columns.forEach((column) => {
    const tasks = Array.from(column.children).map((li) => ({
        text: li.querySelector('span').textContent,
        completed: li.classList.contains('completed'),
    }));
    localStorage.setItem(column.id, JSON.stringify(tasks));
    });
}

/*
* Function: loadTasks
* Loads tasks from local storage while the page is loading.
*/
function loadTasks() {
    const columns = document.querySelectorAll('.todo-list');
    columns.forEach((column) => {
    const tasks = JSON.parse(localStorage.getItem(column.id)) || [];
    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.setAttribute('draggable', 'true');
        li.innerHTML = `
        <span>${task.text}</span>
        <button class="remove-btn">×</button>
        `;
        if (task.completed) {
        li.classList.add('completed');
        }

        li.querySelector('.remove-btn').addEventListener('click', () => {
        column.removeChild(li);
        saveTasks();
        });

        li.querySelector('span').addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTasks();
        });

        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', (e) => handleDrop(e, column.id));
        li.addEventListener('dragenter', handleDragEnter);
        li.addEventListener('dragleave', handleDragLeave);

        column.appendChild(li);
    });
    });
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