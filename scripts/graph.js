Chart.register();

const taskList = JSON.parse(localStorage.getItem("tasks")) || [];

function parseDuration(durationStr) {
  const [hh, mm, ss] = durationStr.split(":").map(Number);
  return hh + mm / 60 + ss / 3600; 
}

function dailyChartStatus() {
  const ctx = document.getElementById("dailyChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: taskList.map(task => task.taskName),
      datasets: [{
        label: "Total Duration (hrs)",
        data: taskList.map(task => parseDuration(task.totalDuration)),
        backgroundColor:["darkred","darkblue","yellow","darkgray","goldenrod"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
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
        label: "Total Duration (hrs)",
        data: taskList.map(task => parseDuration(task.totalDuration)),
        backgroundColor: ["goldenrod","blue","green","violet","darkred"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

function monthlyChartStatus() {
  const ctx = document.getElementById("monthlyChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: taskList.map(task => task.taskName),
      datasets: [{
        label: "Total Duration (hrs)",
        data: taskList.map(task => parseDuration(task.totalDuration)),
        backgroundColor:["yellow","darkgreen","red","violet","magenta"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}
