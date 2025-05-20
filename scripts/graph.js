let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

function parseDurationToHours(durationStr) {
  if (!durationStr || !durationStr.includes(":")) return 0;
  const [h, m, s] = durationStr.split(":").map(Number);
  return (h || 0) + (m || 0) / 60 + (s || 0) / 3600;
}

function renderWeeklyBarGraph() {
  const weekData = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  taskList.forEach(task => {
    if (!task.startDate || !task.totalDuration) return;
    const dayIndex = new Date(task.startDate).getDay();
    const hours = parseDurationToHours(task.totalDuration);
    if (!isNaN(hours)) {
      weekData[dayMap[dayIndex]] += hours;
    }
  });

  const durations = Object.values(weekData);
  const maxDuration = Math.max(...durations, 1);

  const yAxisLabels = document.getElementById("yAxisLabels");
  const barsContainer = document.getElementById("barsContainer");
  const xAxisLabels = document.getElementById("xAxisLabels");

  if (!yAxisLabels || !barsContainer || !xAxisLabels) return;

  yAxisLabels.innerHTML = "";
  barsContainer.innerHTML = "";
  xAxisLabels.innerHTML = "";

  const yFragment = document.createDocumentFragment();
  for (let i = 5; i >= 0; i--) {
    const label = document.createElement("div");
    label.textContent = `${((maxDuration / 5) * i).toFixed(1)}h`;
    yFragment.appendChild(label);
  }
  yAxisLabels.appendChild(yFragment);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const barsFragment = document.createDocumentFragment();
  const xLabelsFragment = document.createDocumentFragment();

  days.forEach(day => {
    const barHeightPercent = (weekData[day] / maxDuration) * 100;

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${barHeightPercent}%`;
    bar.textContent = weekData[day].toFixed(1) || "0";
    barsFragment.appendChild(bar);

    const label = document.createElement("div");
    label.textContent = day;
    xLabelsFragment.appendChild(label);
  });

  barsContainer.appendChild(barsFragment);
  xAxisLabels.appendChild(xLabelsFragment);
}

function renderTaskTable() {
  const taskTableBody = document.getElementById("taskTableBody");
  if (!taskTableBody) return;

  taskTableBody.innerHTML = "";
  const fragment = document.createDocumentFragment();

  taskList.forEach((task, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.taskName || "-"}</td>
      <td>${task.startDate || "--/--/----"}</td>
      <td>${task.totalDuration || "00:00:00"}</td>
      <td><button class="resume" onclick="resumeTask(${index})">🕒 Resume</button></td>
      <td><button class="delete" onclick="deleteTask(${index})">Delete</button></td>
    `;
    fragment.appendChild(row);
  });

  taskTableBody.appendChild(fragment);
  renderWeeklyBarGraph();
}

function resumeTask(index) {
  if (index >= 0 && index < taskList.length) {
    window.location.href = `timer.html?taskIndex=${index}`;
  } else {
    alert("Invalid task index");
  }
}

function deleteTask(index) {
  if (index >= 0 && index < taskList.length) {
    taskList.splice(index, 1);
    saveTaskToLocalStorage();
    renderTaskTable();
  } else {
    alert("Invalid task index");
  }
}

function saveTaskToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

window.addEventListener("DOMContentLoaded", () => {
  const profileNameSpan = document.getElementById("profileName");
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    alert("You must be signed in to view the dashboard.");
    window.location.href = "index.html";
    return;
  }

  if (profileNameSpan) {
    profileNameSpan.textContent = loggedInUser.firstName || "Guest";
  }

  renderTaskTable();
});

document.querySelector(".show")?.addEventListener("click", renderWeeklyBarGraph);



