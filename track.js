let startTime = null;
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];

function startTask() {
    startTime = new Date();
    
}


function endTask() {

    if (!startTime) {
        alert("Please enter START before stopping")
    }
    endTime = new Date();

    const taskName = document.getElementById('taskName').value.trim();
    const description = document.getElementById('description');
    const taskDate = document.getElementById('taskDate').value;

}


function resetTask() {
    if (confirm("Are you sure.Do you want to reset all the tasks?"));
    localStorage.removeItem("tasks");
    taskList = [];
    document.getElementById('taskName').value = "";
    document.getElementById('description').value = "";
    document.getElementById('taskDate').value = "";
    startTime = null;
}

