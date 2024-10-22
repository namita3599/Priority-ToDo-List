// Function to add a task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const taskValue = taskInput.value;
    const priorityValue = prioritySelect.value;

    if (taskValue === '') {
        alert('Please enter a task.');
        return;
    }

    const task = {
        text: taskValue,
        priority: priorityValue,
        completed: false 
    };

    // Get existing tasks from local storage or create a new array
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task); // Add the new task to the array

    // Save the updated tasks array to local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Clear the input field
    taskInput.value = '';

    // Render the tasks
    renderTasks();
}

// Function to render tasks from local storage
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear existing tasks

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-priority', task.priority);

        // Apply class based on priority for color-coding
        if (task.priority == '1') {
            listItem.classList.add('priority-high');
        } else if (task.priority == '2') {
            listItem.classList.add('priority-medium');
        } else if (task.priority == '3') {
            listItem.classList.add('priority-low');
        }

        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        if (task.completed) {
            taskText.classList.add('completed');
        }
        listItem.appendChild(taskText); // Append task text to list item

        // Create a small icon/button for changing priority
        const priorityButton = document.createElement('button');
        priorityButton.innerHTML = '⚙️';
        priorityButton.classList.add('priority-btn'); 

        // Pencil icon for editing only if the task is not completed
        if (!task.completed) {
            const editButton = document.createElement('button');
            editButton.innerHTML = '✏️'; 
            editButton.classList.add('edit-btn'); 

            editButton.onclick = function() {
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = task.text;
                listItem.replaceChild(editInput, taskText); // Replace task text with input

                // Save the new task text on blur or pressing Enter
                editInput.addEventListener('blur', function() {
                    task.text = editInput.value; // Update task text
                    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated task
                    renderTasks(); // Re-render tasks
                });

                editInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        editInput.blur(); // Trigger blur to save changes
                    }
                });

                editInput.focus();
            };

            listItem.appendChild(editButton);
        }

        // Create a dropdown for changing priority, hidden initially
        const prioritySelect = document.createElement('select');
        prioritySelect.innerHTML = `
            <option value="1" ${task.priority == 1 ? 'selected' : ''}>High</option>
            <option value="2" ${task.priority == 2 ? 'selected' : ''}>Medium</option>
            <option value="3" ${task.priority == 3 ? 'selected' : ''}>Low</option>
        `;
        prioritySelect.style.display = 'none'; // Hide dropdown by default

        // Only allow priority change for undone tasks
        if (!task.completed) {
            priorityButton.onclick = function() {
                prioritySelect.style.display = prioritySelect.style.display === 'none' ? 'block' : 'none'; // Toggle dropdown visibility
            };

            prioritySelect.onchange = function() {
                task.priority = prioritySelect.value; // Update priority
                localStorage.setItem('tasks', JSON.stringify(tasks)); // Save updated task to local storage
                renderTasks(); // Re-render tasks to reflect new order
            };
        } else {
            priorityButton.disabled = true; // Disable for completed tasks
        }

        listItem.appendChild(priorityButton); 
        listItem.appendChild(prioritySelect);

        // Done and Delete buttons
        const doneButton = document.createElement('button');
        doneButton.textContent = task.completed ? 'Undo' : 'Done'; // Toggle button text
        doneButton.classList.add('done');

        // Change opacity based on completion
        if (task.completed) {
            doneButton.classList.add('completed');
        }

        doneButton.onclick = function() {
            task.completed = !task.completed; // Toggle completed status
            localStorage.setItem('tasks', JSON.stringify(tasks)); // Update local storage

            // Show animated message if task is marked as done
            if (task.completed) {
                showMessage(); // Show the animated message
            }

            renderTasks(); // Re-render tasks
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');

        // Add completed class to the delete button if the task is completed
        if (task.completed) {
            deleteButton.classList.add('completed');
        }

        deleteButton.onclick = function() {
            tasks.splice(index, 1); // Remove task from array
            localStorage.setItem('tasks', JSON.stringify(tasks)); // Update local storage
            renderTasks(); // Re-render tasks
        };

        listItem.appendChild(doneButton);
        listItem.appendChild(deleteButton); 
        taskList.appendChild(listItem);
    });

    // Sort tasks by priority
    sortTasks();
}

// Function to show the animated message
function showMessage() {
    const messageElement = document.getElementById('message');
    messageElement.classList.add('show');

    // Remove the class after the animation ends to hide it
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 2000); // Adjust duration as needed
}

// Function to sort tasks by priority
function sortTasks() {
    const taskList = document.getElementById('taskList');
    const items = Array.from(taskList.children);

    items.sort((a, b) => {
        return a.getAttribute('data-priority') - b.getAttribute('data-priority');
    });

    // Clear the list and append sorted items
    taskList.innerHTML = '';
    items.forEach(item => taskList.appendChild(item));
}

// Render tasks on initial load
document.addEventListener('DOMContentLoaded', renderTasks);
