const urlParams = new URLSearchParams(window.location.search);
const taskIndex = urlParams.get("taskIndex");
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskData = tasks[taskIndex];

const elapsedTimeEl = document.getElementById("elapsedTime");
const startTimeEl = document.getElementById("startTime");
const endTimeEl = document.getElementById("endTime");
const recordsList = document.getElementById("recordsList");

let startTime;
let timerInterval;

document.addEventListener("DOMContentLoaded",()=>{
    if(!taskData) {
      alert("Task not found.");
      window.location.href = "track.html";
      return;
    }
    document.getElementById("taskName").textContent = taskData.taskName || "";
    document.getElementById("taskTag").textContent = taskData.taskTag || "";
    document.getElementById("taskDescription").textContent = taskData.description || "";

    if(!taskData.sessions)taskData.sessions = [];
    if(!taskData.totalDuration)taskData.totalDuration = "00:00:00";

    renderAllTaskSessions();
    resetTimer();

});

function timeFormatting(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2,"0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2,"0");
  const s = String(sec % 60).padStart(2,"0");
  return `${h}:${m}:${s}`;
}

function startTimer() {
  startTime = new Date();
  const startTimeStr = startTime.toLocaleTimeString();
  startTimeEl.textContent = startTimeStr;

  document.getElementById("start").disabled = true;
  document.getElementById("stop").disabled = false;
  document.getElementById("reset").disabled = false;

  timerInterval = setInterval(()=>{
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);
    elapsedTimeEl.textContent = timeFormatting(diff);
  },1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  const endTime = new Date();
  const durationSec = Math.floor((endTime - startTime) / 1000);
  const durationStr = timeFormatting(durationSec);
  const session = {
    startDate:taskData.startDate || new Date().toLocaleDateString(),
    startTime: startTime.toLocaleTimeString(),
    endTime:endTime.toLocaleTimeString(),
    duration:durationStr
  };
  taskData.sessions.push(session);

  let totalSeconds = 0;
  taskData.sessions.forEach(session => {
    const [h,m,s] = session.duration.split(":").map(Number);
    totalSeconds += h * 3600 + m * 60 + s;
  });

  taskData.totalDuration = timeFormatting(totalSeconds);

  endTimeEl.textContent = session.endTime;
  elapsedTimeEl.textContent = durationStr;
  
  renderAllTaskSessions();
  
}

function resetTimer() {
  clearInterval(timerInterval);
  startTimeEl.textContent = "--:--:--";
  endTimeEl.textContent = "--:--:--";
  elapsedTimeEl.textContent = "00:00:00";

  document.getElementById("start").disabled = false;
  document.getElementById("stop").disabled = true;
  document.getElementById("reset").disabled = true;

}

function  renderAllTaskSessions() {
  recordsList.innerHTML = "";

  if(taskData.sessions.length === 0) {
    recordsList.innerHTML = `<p>No sessions recorded yet.</p>`
    return;
  }

  taskData.sessions.forEach((s,i) => {
    const sessionDiv = document.createElement("div");
    sessionDiv.className = "record";
    sessionDiv.innerHTML = `
        <div class="head"><strong>TIMER ${i + 1}</strong></div>
            <div class="session">
            <strong class="one">Session ${i+1}</strong><br>
            Start:${s.startTime} (${s.startDate}) <br>
            End:${s.endTime} (${s.endDate}) ,br>
            Duration:${s.duration} <br><br>
      `;
       recordsList.appendChild(sessionDiv);
      });

      const totalDiv = document.createElement("div");
      totalDiv.innerHTML = `<strong>Total Duration:${taskData.totalDuration}</strong>`;
      recordsList.appendChild(totalDiv);
}

function clearSessions() {
  if(confirm("Clear all sessions for this task?")) {
       taskData.sessions = [];
       taskData.totalDuration = "00:00:00";
       tasks[taskIndex] = taskData;
       localStorage.setItem("tasks",JSON.stringify(tasks));
       resetTimer();
       renderAllTaskSessions();
  }
}

document.getElementById("start").addEventListener("click",startTimer);
document.getElementById("stop").addEventListener("click",stopTimer);
document.getElementById("reset").addEventListener("click",resetTimer);

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
const taskTableBody = document.getElementById("taskTableBody");

function saveTaskTable() {
  localStorage.setItem("tasks",JSON.stringify(taskList));

}

function renderTaskTable() {
  taskTableBody.innerHTML = "";
  taskList.forEach((task,index)=>{
     const row = document.createElement("tr");
     row.innerHTML = `
            <td>${task.taskName}</td>
            <td>${task.startDate || "--:--:----"}</td>
            <td>${task.totalDuration}</td>
            <td><button class="resume" onclick="resumeTask(${index})">Resume</button></td>
     `;
  })
  taskTableBody.appendChild(row);
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
        startDate:new Date().toLocaleDateString();
        sessions:[],
        totalDuration:"00:00:00"
      };
      taskList.push(taskData);
      saveTaskToLocalStorage();
      window.location.href = `timer.html?taskIndex=${taskList.length - 1}`;
  } else {
     alert("Please fill in all fields")
  }
}

function resumeTask(index) {
      window.location.href = `timer.html?taskIndex = ${index}`;
}

function resetTask() {
   if(confirm("Are you sure you want to delete all the tasks?")) {
    localStorage.removeItem("tasks");
    taskList = [];
    renderTaskTable()
   }
}

function searchTasks() {
     const query = document.getElementById("searchInput").value.trim().toLowerCase();
     const resultsDiv = document.getElementById("searchResults");
     resultsDiv.innerHTML = "";
     const filtered = taskList.filter(task=> 
        task.taskName.toLowerCase().includes(query) || 
        task.taskTag.toLowerCase().includes(query)
     );

     filtered.forEach(task => {
        const div = document.createElement("div");
        div.classList.add("search-result");
        div.innerHTML = `<strong>`

     })

}