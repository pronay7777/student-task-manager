// Get HTML elements

const taskNameInput = document.getElementById("taskName");
const subjectInput = document.getElementById("subject");
const deadlineInput = document.getElementById("deadline");
const priorityInput = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalTasksElement = document.getElementById("totalTasks");
const completedTasksElement = document.getElementById("completedTasks");
const pendingTasksElement = document.getElementById("pendingTasks");
const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
addTaskBtn.addEventListener("click", addTask);
cancelEditBtn.addEventListener("click", cancelEdit);

// Store tasks temporarily

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let editingTaskId = null;


// Run addTask function when button is clicked

addTaskBtn.addEventListener("click", addTask);


// Function to add a new task

function addTask() {

    const taskName = taskNameInput.value.trim();
    const subject = subjectInput.value.trim();
    const deadline = deadlineInput.value;
    const priority = priorityInput.value;

    if (taskName === "" || subject === "" || deadline === "") {
        alert("Please fill in all fields.");
        return;
    }

    const selectedDate = new Date(deadline + "T00:00:00");

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert("Deadline cannot be in the past.");
        return;
    }


    // UPDATE EXISTING TASK

    if (editingTaskId !== null) {

        const task = tasks.find(function(task) {
            return task.id === editingTaskId;
        });

        if (task) {
            task.taskName = taskName;
            task.subject = subject;
            task.deadline = deadline;
            task.priority = priority;
        }

        editingTaskId = null;

        addTaskBtn.textContent = "Add Task";

        cancelEditBtn.style.display = "none";
    }


    // CREATE NEW TASK

    else {

        const newTask = {
            id: Date.now(),
            taskName: taskName,
            subject: subject,
            deadline: deadline,
            priority: priority,
            completed: false
        };

        tasks.push(newTask);
    }


    saveTasks();

    displayTasks();

    clearInputs();
}


// Function to display tasks

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(function(task) {
            return task.completed === false;
        });
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(function(task) {
            return task.completed === true;
        });
    }

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <p class="empty-message">
                No tasks available in this section.
            </p>
    `   ;

        updateStatistics();

        return;
    }

    filteredTasks.forEach(function(task) {

        const taskDiv = document.createElement("div");

        taskDiv.classList.add("task-item");
        taskDiv.classList.add(task.priority.toLowerCase() + "-priority");

        if (task.completed === true) {
            taskDiv.classList.add("completed");
        }

        taskDiv.innerHTML = `

            <h3>${task.taskName}</h3>

            <p>Subject: ${task.subject}</p>

            <p>Deadline: ${task.deadline}</p>

            <p>Priority: ${task.priority}</p>

            <div class="task-buttons">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed ? "Pending" : "Complete"}
                </button>


                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>


                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskDiv);
    });

    updateStatistics();
}

function filterTasks(filter) {

    currentFilter = filter;

    allBtn.classList.remove("active-filter");
    pendingBtn.classList.remove("active-filter");
    completedBtn.classList.remove("active-filter");

    if (filter === "all") {
        allBtn.classList.add("active-filter");
    } else if (filter === "pending") {
        pendingBtn.classList.add("active-filter");
    } else if (filter === "completed") {
        completedBtn.classList.add("active-filter");
    }

    displayTasks();
}

function updateStatistics() {

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function(task) {
        return task.completed === true;
    }).length;

    const pendingTasks = tasks.filter(function(task) {
        return task.completed === false;
    }).length;


    totalTasksElement.textContent = totalTasks;

    completedTasksElement.textContent = completedTasks;

    pendingTasksElement.textContent = pendingTasks;
}

function toggleTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (task) {
        task.completed = !task.completed;
    }

    saveTasks();

    displayTasks();
}

function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();

    displayTasks();
}

function editTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    taskNameInput.value = task.taskName;
    subjectInput.value = task.subject;
    deadlineInput.value = task.deadline;
    priorityInput.value = task.priority;

    editingTaskId = id;
    addTaskBtn.textContent = "Update Task";
    cancelEditBtn.style.display = "block";
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function cancelEdit() {

    editingTaskId = null;

    clearInputs();

    addTaskBtn.textContent = "Add Task";

    cancelEditBtn.style.display = "none";
}


// Function to clear inputs

function clearInputs() {

    taskNameInput.value = "";

    subjectInput.value = "";

    deadlineInput.value = "";

    priorityInput.value = "Low";
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

displayTasks();