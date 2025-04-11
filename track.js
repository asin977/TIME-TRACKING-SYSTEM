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


