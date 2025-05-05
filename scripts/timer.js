const urlParams = new URLSearchParams(window.location.search);
const taskIndex = urlParams.get("taskIndex");

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskData = tasks[taskIndex];

const elapsedTimeEl = document.getElementById("elapsedTime");
const startTimeEl = document.getElementById("startTime");
const endTimeEl = document.getElementById("endTime");
const recordStartTimeEl = document.getElementById("recordStartTime");
const recordEndTimeEl = document.getElementById("recordEndTime");
const recordEndDateEl = document.getElementById("recordEndDate");
const taskDurationEl = document.getElementById("taskDuration");
const allTasksListEl = document.getElementById("allTasksList");

let startTime;
let timerInterval;

document.addEventListener("DOMContentLoaded", () => {
  if (!taskData) {
    alert("Task not found.");
    window.location.href = "track.html";
    return;
  }

  document.getElementById("taskName").textContent = taskData.taskName || "";
  document.getElementById("taskTag").textContent = taskData.taskTag || "";
  document.getElementById("taskDescription").textContent = taskData.description || "";
  document.getElementById("recordStartDate").textContent = taskData.startDate || "--/--/----";

  resetTimer();
  renderAllTaskSessions();
});

function stopWatch(date) {
  const hrs = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  const secs = String(date.getSeconds()).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

function timeFormatting(sec) {
  const hours = String(Math.floor(sec / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const seconds = String(sec % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function startTimer() {
  startTime = new Date();
  const startTimeStr = startTime.toLocaleTimeString();
  const startDateStr = startTime.toLocaleDateString();

  startTimeEl.textContent = startTimeStr;
  recordStartTimeEl.textContent = startTimeStr;
  document.getElementById("recordStartDate").textContent = startDateStr;

  taskData.startDate = startDateStr;
  tasks[taskIndex] = taskData;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("start").disabled = true;
  document.getElementById("stop").disabled = false;
  document.getElementById("reset").disabled = false;

  timerInterval = setInterval(() => {
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);
    elapsedTimeEl.textContent = timeFormatting(diff);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);

  const endTime = new Date();
  const endTimeStr = endTime.toLocaleTimeString();
  const endDateStr = endTime.toLocaleDateString();

  const startTimeStr = startTime.toLocaleTimeString();
  const startDateStr = startTime.toLocaleDateString();

  endTimeEl.textContent = endTimeStr;
  recordEndTimeEl.textContent = endTimeStr;
  recordEndDateEl.textContent = endDateStr;

  const diff = Math.floor((endTime - startTime) / 1000);
  const duration = timeFormatting(diff);

  elapsedTimeEl.textContent = duration;
  taskDurationEl.textContent = duration;

  if (!taskData.sessions) taskData.sessions = [];

  taskData.sessions.push({
    startDate: startDateStr,
    startTime: startTimeStr,
    endDate: endDateStr,
    endTime: endTimeStr,
    duration: duration,
  });

  taskData.startDate = startDateStr;
  taskData.totalDuration = duration;
  tasks[taskIndex] = taskData;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  records.forEach((record,index)=>{
    let totalSeconds = 0;
    let sessionHtml = '';

    record.sessions.forEach((session,idx)=>{
        const [h,m,s] = session.elapsed.split(':').map(Number);
        totalSeconds += h*3600 + m * 60 + s;

        sessionHtml += `
                <div class="session">
                <strong class="one">Session ${idx + 1}</strong><br>
                Start:${session.start} (${session.startDate});<br>
                End:${session.end} (${session.endDate})<br>
                Duration:${session.elapsed}<br><br>
                </div>
            `;
    });
    const totalDuration = timeFormatting(totalSeconds);

    recordsList.innerHTML += `
        <div class="record">
             <div class="head"><strong class="strong">TIMER ${index+1}</strong></div>
             ${sessionHtml}
             <div><strong>Total Duration:${totalDuration}</strong></div>
             <button class="clear" onclick="deleteRecord(${index})">Delete</button>
             <button class="resume" onclick="resumeTimer(${index})">Resume</button>
        </div>
    `;
});lk
  renderAllTaskSessions();
}

function resetTimer() {
  clearInterval(timerInterval);
  elapsedTimeEl.textContent = "00:00:00";
  startTimeEl.textContent = "--:--:--";
  endTimeEl.textContent = "--:--:--";

  document.getElementById("start").disabled = false;
  document.getElementById("stop").disabled = true;
  document.getElementById("reset").disabled = true;
}

function renderAllTaskSessions() {
  allTasksListEl.innerHTML = "";

  if (!taskData.sessions || taskData.sessions.length === 0) {
    allTasksListEl.innerHTML = "<p>No sessions recorded yet.</p>";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th>Start Date</th>
        <th>Start Time</th>
        <th>End Date</th>
        <th>End Time</th>
        <th>Duration</th>
      </tr>
    </thead>
    <tbody>
      ${taskData.sessions.map((session, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${session.startDate}</td>
          <td>${session.startTime}</td>
          <td>${session.endDate}</td>
          <td>${session.endTime}</td>
          <td>${session.duration}</td>
        </tr>
      `).join("")}
    </tbody>
  `;

  allTasksListEl.appendChild(table);
}

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("stop").addEventListener("click", stopTimer);
document.getElementById("reset").addEventListener("click", resetTimer);

document.getElementById("goDashboard").addEventListener("click", () => {
  window.location.href = "track.html";
});

document.getElementById("deleteTask").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    window.location.href = "track.html";
  }
});

document.getElementById("clearAll").addEventListener("click", () => {
  if (confirm("Clear all sessions for this task?")) {
    taskData.sessions = [];
    taskData.totalDuration = "00:00:00";
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderAllTaskSessions();
    resetTimer();
  }
});
