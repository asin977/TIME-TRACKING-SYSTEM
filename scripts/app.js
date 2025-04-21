let taskTimers = {};
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
taskList.forEach(task => addToTable(task));
Chart.register();

function generateTaskId() {
    return `task-${new Date()}-${Math.floor(Math.random()*1000)}`;
}

function startTask() {
    let startTime = new Date();
    const taskName = document.getElementById('taskName').value.trim();
    const description = document.getElementById('description').value.trim();
    
    if(!taskName) {
        alert('Please enter the task before you START');
        return;
    }
    const taskId = generateTaskId();
    const interval = setInterval(()=>{
        const now = new Date();
        const passedTime = Math.floor((now-startTime) /1000);
        const minutes = Math.floor(passedTime /60);
        const seconds = passedTime % 60;

        const timeString = `${minutes < 10 ? "0":""}${minutes}:${seconds < 10 ? "0":""}${seconds}`;
         
        document.title = `${timeString}-Tracking-${taskName}`;
    },1000);

    taskTimers[taskId] = {taskName,description,startTime,interval};

    const taskBtn = document.createElement('button');
    taskBtn.textContent = `STOP ${taskName}`;
    taskBtn.classList.add('stop');
    taskBtn.onclick= ()=> stopTask(taskId);

    document.getElementById('activeTasks').appendChild(taskBtn);

    document.getElementById("taskName").value = "";
    document.getElementById('description').value = "";

}




