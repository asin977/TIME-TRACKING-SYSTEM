let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
const taskTableBody = document.getElementById("taskTableBody");

function saveTaskToLocalStorage() {
    localStorage.setItem("tasks",JSON.stringify(taskList));
}

function renderTaskTable() {
    taskTableBody.innerHTML = "";
    taskList.forEach((task,index)=>{
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.taskName}</td>
            <td>${task.startDate}</td>
            <td>${task.totalDuration}</td>
            <td><button class="resume" onclick = "resumeTask(${index})">Resume</button></td>
            `;
            taskTableBody.appendChild(row);
            
    });
}

function startTask() {
    const taskName = document.getElementById("taskName").value.trim();
    const taskTag = document.getElementById("taskTag").value.trim();
    const description = document.getElementById("description").value.trim();

    if(taskName && taskTag && description) {
        const taskData = {
            taskName,
            taskTag,
            description,
            startDate:new Date().toLocaleString(),
            sessions:[],
            totalDuration : "00:00:00"
        };
        taskList.push(taskData);
        saveTaskToLocalStorage();
        window.location.href = `timer.html?taskIndex = ${taskList.length - 1}`;
    }else {
        alert("please fill in all fields.")
    }
}

function resumeTask(index) {
    window.location.href = `timer.html?taskIndex = ${index}`;
}

function resetTask() {
    if(confirm("Are you sure you want to delete all tasks?")) {
        localStorage.removeItem("tasks");
        taskList = [];
        renderTaskTable();
    }
}

function searchTasks() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = "";
    const filtered = taskList.filter((task)=>task.taskName.toLowerCase().includes(query) || task.taskTag.toLowerCase().includes(query));
    filtered.forEach((task)=>{
        const div = document.createElement("div");
        div.classList.add("searchResults");
        div.innerHTML = `
            <strong><h3>Task Name:</h3></strong><h3>${task.taskName}</h3>
            <strong><h3>Task Tag:</h3></strong><p>${task.taskTag}</p>
            <p><strong><h3>Task Description:</h3></strong>${task.description}</p>
            <strong><h3>Start Date:</h3></strong><p>${task.startDate}</p>
            `;
            resultsDiv.appendChild(div);
    })
}

document.addEventListener("DOMContentLoaded",renderTaskTable);

function dailyChartStatus() {
    
}
