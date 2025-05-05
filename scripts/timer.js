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
}

function stopTimer() {
  const endTime = new Date();
  const endTimeStr = endTime.toLocaleTimeString();
  const endDateStr = endTime.toLocaleDateString();

  const startTimeStr = startTime.toLocaleTimeString();
  const startDateStr = startTime.toLocaleDateString();

  endTimeEl.textContent = endTimeStr;
  recordEndTimeEl.textContent = endTimeStr;
  recordEndDateEl.textContent = endDateStr;

  const diff = Math.floor((endTime - startTime) / 1000);
  const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
  const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
  const secs = String(diff % 60).padStart(2, "0");
  const duration = `${hrs}:${mins}:${secs}`;

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

  renderAllTaskSessions();
}

function resetTimer() {
  elapsedTimeEl.textContent = "00:00:00";
  startTimeEl.textContent = "--:--:--";
  endTimeEl.textContent = "--:--:--";
  recordStartTimeEl.textContent = "--:--:--";
  recordEndTimeEl.textContent = "--:--:--";
  recordEndDateEl.textContent = "--/--/----";
  taskDurationEl.textContent = "00:00:00";

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
