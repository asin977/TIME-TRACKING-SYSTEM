let taskTimers = {};
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
taskList.forEach(task => addToTable(task));
Chart.register();

document.querySelector(".track").addEventListener("click", startTask);
document.querySelector(".delete-records").addEventListener("click", resetTask);
document.getElementById("showDailyStatus").addEventListener("click", dailyChartStatus);
document.getElementById("weeklyCharts").addEventListener("click", weeklyChartStatus);

function startTask() {
    const taskName = document.getElementById("taskName").value.trim();
    const description = document.getElementById("description").value.trim();
    const taskTag = document.getElementById("taskTag").value.trim();

    if (!taskName) {
        alert("Please enter the task before you START");
        return;
    }

    const taskId = generateTaskId();
    const startTime = new Date().toISOString();

    sessionStorage.setItem("currentTaskId", taskId);
    sessionStorage.setItem("currentTaskName", taskName);
    sessionStorage.setItem("currentTaskDescription", description);
    sessionStorage.setItem("currentTaskTag", taskTag);
   
    window.location.href = "timer.html";

    document.getElementById("taskName").value = "";
    document.getElementById("description").value = "";
    document.getElementById("taskTag").value = "";
}

function stopTask(taskId) {
  
    const taskName = sessionStorage.getItem("currentTaskName");
    const description = sessionStorage.getItem("currentTaskDescription");
    const taskTag = sessionStorage.getItem("currentTaskTag");
   

    const duration = ((new Date(endTime) - new Date(startTime)) / 60000).toFixed(2);
    const taskDate = new Date().toISOString().split("T")[0];
    


document.getElementById("endTimeDisplay").textContent = `End Time: ${new Date(endTime).toLocaleString()}`;


    const taskObj = {
        taskName,
        taskDate,
        duration,
        description,
        taskTag,
        startTime,
        endTime
    };

    taskList.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    document.querySelector("#tasktable tbody").innerHTML = "";
    taskList.forEach(addToTable);

    sessionStorage.removeItem("startTime");
    sessionStorage.removeItem("currentTaskId");
    sessionStorage.removeItem("currentTaskName");
    sessionStorage.removeItem("currentTaskDescription");
    sessionStorage.removeItem("currentTaskTag");
}

function generateTaskId() {
    return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function resetTask() {
    if (confirm("Are you sure? Do you want to reset all the tasks?")) {
        localStorage.removeItem("tasks");
        taskList = [];
        document.querySelector("#tasktable tbody").innerHTML = "";
        dailyChartStatus();
        weeklyChartStatus();
    }
}

function addToTable(task) {
    const tbody = document.querySelector("#tasktable tbody");
    const row = document.createElement("tr");
    const taskIndex = taskList.indexOf(task);

    const totalSeconds = Math.floor(parseFloat(task.duration) * 60);
    if (isNaN(totalSeconds)) return;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const durationFormatted = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    row.innerHTML = `
        <td title="${task.description || ''}">${task.taskName}</td>
        <td>${task.taskDate}</td>
        <td>${durationFormatted}</td>
        <td>
            <button class="details-btn" onclick="viewDetails(${taskIndex})">🕒 Resume</button>
        </td>
    `;
    tbody.appendChild(row);
}

function viewDetails(index) {
    const task = taskList[index];
    sessionStorage.setItem("selectedTask", JSON.stringify(task));
    window.location.href = "details.html";
}

function dailyChartStatus() {
    const today = new Date().toISOString().split("T")[0];
    const dailyTasks = taskList.filter(task => task.taskDate === today);

    const taskDurations = {};
    dailyTasks.forEach(task => {
        taskDurations[task.taskName] = (taskDurations[task.taskName] || 0) + parseFloat(task.duration);
    });

    const ctx = document.getElementById("dailyChart").getContext("2d");
    if (window.dailyChart instanceof Chart) window.dailyChart.destroy();

    window.dailyChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(taskDurations),
            datasets: [{
                data: Object.values(taskDurations),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: "Today's Task Summary (Pie Chart - 24hr View)" },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            const hours = (value / 60).toFixed(2);
                            const percentage = ((value / 1440) * 100).toFixed(1);
                            return `${context.label}: ${hours} hrs (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function weeklyChartStatus() {
    const recentTasks = taskList.filter(task => {
        const date = new Date(task.taskDate);
        const now = new Date();
        return (now - date) / (1000 * 3600 * 24) <= 7;
    });

    const taskDurations = {};
    recentTasks.forEach(task => {
        taskDurations[task.taskName] = (taskDurations[task.taskName] || 0) + parseFloat(task.duration);
    });

    const totalMinutes = Object.values(taskDurations).reduce((a, b) => a + b, 0);
    const ctx = document.getElementById("weeklyChart").getContext("2d");
    if (window.weeklyChart instanceof Chart) window.weeklyChart.destroy();

    window.weeklyChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(taskDurations),
            datasets: [{
                data: Object.values(taskDurations),
                backgroundColor: ['darkred','darkblue','rebeccapurple','lavender','goldenrod','#556B2F','orange']
            }]
        },
        options: {
            plugins: {
                title: { display: true, text: "Weekly Task Summary (Pie Chart)" },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            const hours = (value / 60).toFixed(2);
                            const percentage = ((value / totalMinutes) * 100).toFixed(1);
                            return `${context.label}: ${hours} hrs (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function searchTasks() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = "";

    if (!query) {
        resultsDiv.innerHTML = "<p>Please enter a tag or task name to search.</p>";
        return;
    }

    const matches = taskList.filter(task =>
        task.taskName.toLowerCase().includes(query) ||
        (task.taskTag && task.taskTag.toLowerCase().includes(query))
    );

    if (matches.length === 0) {
        resultsDiv.innerHTML = `<p>No tasks found with name: <strong>${query}</strong></p>`;
        return;
    }

    const ul = document.createElement("ul");
    ul.classList.add('detail-cont');
    matches.forEach(task => {
        const li = document.createElement("li");
        li.classList.add('details');
        li.innerHTML = `
            <strong>${task.taskName}</strong><br/>
            📅 ${task.taskDate}<br/>
            ⏱️ ${task.duration} min<br/>
            📝 ${task.description || 'No description'}<br/>
            🏷️ ${task.taskTag || 'No tag'}
        `;

        const deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = `<svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
            <g style="fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2">
              <path d="m31 16v-4h10v4"/>
              <path d="m51 25v31c0 2.2091-1.7909 4-4 4h-22c-2.2091 0-4-1.7909-4-4v-31"/>
              <path d="m17 16h38v4h-38z"/>
              <path d="m41 28.25v26.75"/>
              <path d="m31 28.25v26.75"/>
            </g>
        </svg>`;
        deleteBtn.classList.add('delete-task-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task));
        li.appendChild(deleteBtn);
        ul.appendChild(li);
    });

    resultsDiv.appendChild(ul);
}

function deleteTask(taskToDelete) {
    taskList = taskList.filter(task => task !== taskToDelete);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    document.querySelector("#tasktable tbody").innerHTML = "";
    taskList.forEach(t => addToTable(t));
}
