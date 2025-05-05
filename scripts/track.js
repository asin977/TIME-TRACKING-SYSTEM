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
      <td><button class="resume" onclick="resumeTask(${index})">🕒Resume</button></td>
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
      stataskrtDate: new Date().toLocaleString(),
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
    div.innerHTML = `<strong>📑${task.taskName}</strong> <br> 📌${task.taskTag} <br> 🕒${task.totalDuration} <button class="clear">🗑️ DELETE</button>`;
    resultsDiv.appendChild(div);
    
  });
}

document.addEventListener("DOMContentLoaded", renderTaskTable);

function dailyChartStatus() {
  // Dummy chart for example
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
        label: "Total Duration (in hours)",
        data: taskList.map(task => parseDuration(task.totalDuration)),
        backgroundColor: ["#4BC0C0","#FF6384","#36A2EB"]
      }]
    }
  });
}

function parseDuration(durationStr) {
  const [hh, mm, ss] = durationStr.split(":").map(Number);
  return hh * 60 + mm + ss / 60;
}

