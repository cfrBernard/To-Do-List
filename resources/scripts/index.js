document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskList = document.getElementById('taskList');
    tasks.forEach(taskObj => {
        addTaskElement(taskObj);
    });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value.trim();

    // Validate task input
    if (!task) {
        alert("Task cannot be empty!");
        return;
    }

    if (/[^a-zA-Z0-9\s]/.test(task)) {
        alert("Task cannot contain special characters!");
        return;
    }

    if (task.length > 100) {
        alert("Task cannot exceed 100 characters!");
        return;
    }

    const now = new Date();
    const options = {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    const dateString = now.toLocaleString('en-US', options);

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Check for duplicate task
    if (tasks.some(taskObj => taskObj.task === task && taskObj.date === dateString)) {
        alert("This task already exists!");
        return;
    }

    const taskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0;

    const taskObj = {
        id: taskId,
        task: task,
        date: dateString,
        completed: false
    };

    addTaskElement(taskObj);

    tasks.push(taskObj);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskInput.value = '';
}

function addTaskElement(taskObj) {
    const taskList = document.getElementById('taskList');
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-container');
    taskDiv.dataset.id = taskObj.id;
    if (taskObj.completed) {
        taskDiv.classList.add('completed');
    }

    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');

    const taskText = document.createElement('span');
    taskText.classList.add('task-text');
    taskText.textContent = taskObj.task;

    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');

    const taskDate = document.createElement('span');
    taskDate.classList.add('task-date');
    taskDate.textContent = ` (${taskObj.date})`;

    if (taskObj.completed) {
        const checkIcon = document.createElement('i');
        checkIcon.classList.add('fas', 'fa-check-circle');
        checkIcon.style.color = 'green';
        checkIcon.style.marginLeft = '5px';
        taskDate.appendChild(checkIcon);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('action-btn', 'delete-btn');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        removeTask(taskDiv, taskObj.id);
    });

    taskActions.appendChild(taskDate);
    taskActions.appendChild(deleteBtn);

    taskContent.appendChild(taskText);
    taskContent.appendChild(taskActions);

    taskDiv.appendChild(taskContent);

    taskDiv.addEventListener('click', () => markAsCompleted(taskDiv, taskObj.id));

    taskList.appendChild(taskDiv);
}

function markAsCompleted(taskDiv, taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(taskObj => taskObj.id === taskId);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));

        const taskDate = taskDiv.querySelector('.task-date');

        if (task.completed) {
            taskDiv.classList.add('completed');
            const checkIcon = document.createElement('i');
            checkIcon.classList.add('fas', 'fa-check-circle');
            checkIcon.style.color = 'green';
            checkIcon.style.marginLeft = '5px';
            taskDate.appendChild(checkIcon);
        } else {
            taskDiv.classList.remove('completed');
            const checkIcon = taskDate.querySelector('.fa-check-circle');
            if (checkIcon) {
                checkIcon.remove();
            }
        }
    }
}

function removeTask(taskDiv, taskId) {
    taskDiv.classList.add('fade-out');
    setTimeout(() => {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(taskObj => taskObj.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        taskDiv.remove();
    }, 500);
}

document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTask();
    }
});
