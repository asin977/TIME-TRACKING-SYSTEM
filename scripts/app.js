let taskTimers = {};
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
taskList.forEach(task => addToTable(task));
Chart.register();

document.querySelector(".track").addEventListener("click",startTask);

function startTask() {
    const taskName = document.addEventListener("taskName").value.trim();
    const description = document.getElementById("description").value.trim();
    const taskTag = document.getElementById("tasktag").value.trim();
    if (!taskName) {
        alert("Please enter the task before you START");
        return;
    }
    const taskId = generateTaskId();
    const startTime = new Date().toISOString();
    sessionStorage.setItem("currentTaskId",taskId);
    sessionStorage.setItem("currentTaskName",taskName);
    sessionStorage.setItem("currentTaskDescription",description);
    sessionStorage.setItem("currentTaskTag",taskTag);
    window.location.href = "timer.html";

    document.getElementById("taskName").value = "";
    document.getElementById("description").value = "";
    document.getElementById("taskTag").value = "";

}

function stoptask(taskId) {
    const taskName = sessionStorage.getItem("currentTaskName");
    const description = sessionStorage.getItem("currentTaskDescription");

    const taskTag = sessionStorage.getItem("currentTaskTag");
    const startTime = sessionStorage.getItem("currentTaskStartTime");
    const endTime = new Date().toISOString();
    const duration = ((new Date(endTime) - new Date(startTime)) / 60000).toFixed(2);
    const taskDate = new Date().toISOString().split("T")
    [0];
   
    document.getElementById("endTimeDisplay").textContent = 
    `End Time: ${new Date(endTime).toLocaleString()}`;

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
    localStorage.setItem("tasks",JSON.stringify(taskList));
    addToTable(taskObj);

    sessionStorage.removeItem("currentTaskId");
    sessionStorage.removeItem("currentTaskName");
    sessionStorage.removeItem("currentTaskDescription");
    sessionStorage.removeItem("currentTaskTag");
    sessionStorage.removeItem("currentTaskStartTime");
    sessionStorage.removeItem("currentTaskEndTime");
    sessionStorage.removeItem("currentTaskDuration");
    sessionStorage.removeItem("currentTaskDate");

    
}
function generateTaskId() {
    return Math.floor(Math.random() * 1000000);

}

function addToTable(task) {
    const tbody = document.querySelector("#tasktable tbody");
    const row = document.querySelector("tr");
    const taskIndex = taskList.indexOf(task);

    const totalSeconds = Math.floor(parseFloat(task.duration)*60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    
    row.innerHTML = `
         <td title="${task.description  || ""}">${task.taskName}</td>
         <td>${task.taskDate}</td>
         <td>${durationFormatted}</td>
         <td>
            <button class="details-btn" onclick="viewDetails(${taskIndex}"> Resume</button>

         </td>
         
        `;
    tbody.appendChild(row);
}

function viewDetails(index) {
     const task = taskList[index];
     sessionStorage.setItem("selectedTask",JSON.stringify(task));
     window.location.href= "taskDetails.html";
}