
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
const taskTableBody = document.getElementById("taskTableBody");

function saveTaskToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

function renderTaskTable() {
  taskTableBody.innerHTML = "";
  taskList.forEach((task, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.taskName}</td>
      <td>${task.startDate}</td>
      <td>${task.totalDuration}</td>
      <td><button class="resume" onclick="resumeTask(${index})">Resume</button></td>
    `;
    taskTableBody.appendChild(row);
  });
}

function startTask() {
  const taskName = document.getElementById("taskName").value.trim();
  const taskTag = document.getElementById("taskTag").value.trim();
  const description = document.getElementById("description").value.trim();

  if (taskName && taskTag && description) {
    const taskData = {
      taskName,
      taskTag,
      description,
      startDate: new Date().toLocaleString(),
      sessions: [],
      totalDuration: "00:00:00"
    };
    taskList.push(taskData);
    saveTaskToLocalStorage();
    window.location.href = `timer.html?taskIndex=${taskList.length - 1}`;
  } else {
    alert("Please fill in all fields.");
  }
}

function resumeTask(index) {
  window.location.href = `timer.html?taskIndex=${index}`;
}

function resetTask() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.removeItem("tasks");
    taskList = [];
    renderTaskTable();
  }
}

function searchTasks() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const resultsDiv = document.getElementById("searchResults");
  resultsDiv.innerHTML = "";
  const filtered = taskList.filter(task => task.taskName.toLowerCase().includes(query) || task.taskTag.toLowerCase().includes(query));
  filtered.forEach(task => {
    const div = document.createElement("div");
    div.classList.add("search-result");
    div.innerHTML = `<strong>${task.taskName}</strong> - ${task.taskTag} - ${task.totalDuration}`;
    resultsDiv.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", renderTaskTable);

function dailyChartStatus() {
 
  const ctx = document.getElementById("dailyChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: taskList.map(task => task.taskName),
      datasets: [{
        data: taskList.map(task => parseDuration(task.totalDuration)),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
      }]
    }
  });
}

function weeklyChartStatus() {
  const ctx = document.getElementById("weeklyChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: taskList.map(task => task.taskName),
      datasets: [{
        label: "Total Duration (in mins)",
        data: taskList.map(task => parseDuration(task.totalDuration)),
        backgroundColor: "#4BC0C0"
      }]
    }
  });
}

function parseDuration(durationStr) {
  const [hh, mm, ss] = durationStr.split(":".map(Number));
  return hh * 60 + mm + ss / 60;
}



const urlParams = new URLSearchParams(window.location.search);
const taskIndex = urlParams.get("taskIndex");
const elapsedTimeEl = document.getElementById("elapsedTime");
const startTimeEl = document.getElementById("startTime");
const endTimeEl = document.getElementById("endTime");
const taskData = JSON.parse(localStorage.getItem("tasks"))[taskIndex];

let startTime, timerInterval;

function updateElapsedTime() {
  const now = new Date();
  const diff = Math.floor((now - startTime) / 1000);
  const hrs = String(Math.floor(diff / 3600)).padStart(2, "0");
  const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
  const secs = String(diff % 60).padStart(2, "0");
  elapsedTimeEl.textContent = `${hrs}:${mins}:${secs}`;
}

function startTimer() {
  startTime = new Date();
  startTimeEl.textContent = startTime.toLocaleTimeString();
  timerInterval = setInterval(updateElapsedTime, 1000);
  document.getElementById("start").disabled = true;
  document.getElementById("stop").disabled = false;
  document.getElementById("reset").disabled = false;
}

function stopTimer() {
  clearInterval(timerInterval);
  const endTime = new Date();
  endTimeEl.textContent = endTime.toLocaleTimeString();
  const duration = elapsedTimeEl.textContent;

  taskData.sessions.push({
    start: startTime.toLocaleString(),
    end: endTime.toLocaleString(),
    duration
  });
  taskData.totalDuration = duration; 
  localStorage.setItem("tasks", JSON.stringify(JSON.parse(localStorage.getItem("tasks"))));
  alert("Session recorded! Returning to dashboard.");
  window.location.href = "track.html";
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

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("stop").addEventListener("click", stopTimer);
document.getElementById("reset").addEventListener("click", resetTimer);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("taskName").textContent = taskData.taskName;
  document.getElementById("taskTag").textContent = taskData.taskTag;
  document.getElementById("taskDescription").textContent = taskData.description;
  document.getElementById("recordStartDate").textContent = taskData.startDate;
});
