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
    });
}

document.addEventListener("DOMContentLoaded",renderTaskTable);

function dailyChartStatus() {
    const ctx = document.getElementById("dailyChart").getContext("2d");
    new Chart(ctx, {
        type:"pie",
        data: {
            labels : taskList.map((task)=>task.taskName),
            datasets: [{
                label: "Task Duration",
                data:taskList.map((task)=>{
                    const totalDuration = task.sessions.reduce((acc,session));
                    const [hours,minutes,seconds] = session.duration.split(":");
                    return acc + parseInt(hours) * 3600 + parseInt(minutes)*60 + parseInt(seconds);
                
                })
            }]
        },
        options: {
            responsive : true,
            plugins: {
                legend : {
                    position:"top"
                }
            }
        }
    })
}

function weeklyChartStatus() {
    const ctx = document.getElementById("weeklyChart").getContext("2d");
    new Chart(ctx, {
        type:"bar",
        data: {
            labels: taskList.map((task)=>task.taskName),
            datasets : [{
                labels: "Total Duration (in hours)",
                data : taskList.map((task)=>{
                    const totalDuration = task.sessions.reduce((acc,session)=> {
                        const [hours,minutes,seconds] = session.duration.split(":");
                        return acc + parseInt(hours) * 3600 + parseInt(minutes) * 60  + parseInt(seconds);
                    })
                })
            }]
        }
    })
}

function parseDuration(durationStr) {
    const [hh,mm,ss] = durationStr.split(":").map(Number);
    return hh * 60 + mm + ss / 60;
}

const urlParams = new URLSearchParams(window.location.search);

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskIndex = urlParams.get("taskIndex");
const taskData = tasks[taskIndex];

const elapsedTimeEl = document.getElementById("elapsedTime");
const startTimeEl = document.getElementById("startTime");
const endTimeEl = document.getElementById("endTime");
const recordStartDate = document.getElementById("recordStartDate");
const recordEndDate = document.getElementById("recordEndDate");
const recordStartTime = document.getElementById("recordStartTime");
const recordEndTime = document.getElementById("recordEndTime");
const taskDuration = document.getElementById("taskDuration");

let startTime;

document.addEventListener("DOMContentLoaded",()=>{
    if(!taskData) {
        alert("Task not found.");
        window.location.href = "track.html";
        return;
    }
    document.getElementById("taskName").textContent = taskData.taskName || "";
    document.getElementById("taskTag").textContent = taskData.taskTag || "";
    document.getElementById("taskDescription").textContent = taskData.description || "";
    document.getElementById(recordStartDate).textContent = 
    taskData.startDate || "--/--/----";
    resetTimer();
})