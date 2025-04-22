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

function stopTask(taskId) {
    const task = taskTimers[taskId];
    if (!task) return;

    clearInterval(task.interval);
    document.title = "TIME TRACKER DASHBOARED";

    const endTime = new Date();
    
}


function addToTable(task) {
      const tbody = document.querySelector('#taskable tbody');
      const row = document.createElement('tr');

      row.innerHTML = `
             <td title = ${task.description || ""}>${task.taskName}</td>
             <td>${task.taskDate}</td>
             <td>${task.duration}min</td>
             <td><button class="table-delete-btn">🗑️</button></td>

      `;
      row.querySelector(".table-delete-btn").addEventListener('click',()=>{
        row.remove();
      });
      tbody.appendChild(row);
}

function searchTasks() {
    const query = document.getElementById("searchInput").value.trim().tolowerCase();
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = "";

    if(!query)  {
        resultsDiv.innerHTML = "<p>Please enter a tag or task name to search</p>";
        return;
    }
    const matches = taskList.filter(task=> task.taskName.tolowerCase().includes(query));

    if(matches.length ===0) {
        resultsDiv.innerHTML = `<p>No tasks found with name:<strong>${query}</strong></p>`;
        return;
    }
    const ul = document.createElement('ul');
    matches.forEach(task=> {
        const li = document.createElement('li');
        li.classList.add('details')
        li.innerHTML = `
            <strong>${task.taskName}</strong><br>
             📅 ${task.taskDate}<br>
             ⏱️ ${task.duration} min <br>
             📝 ${task.description || 'No description'}<br>
             🏷️ ${task.taskTag || 'No Tag'}

        `
    })
    
}