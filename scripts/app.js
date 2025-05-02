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

    
}