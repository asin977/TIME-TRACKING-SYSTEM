Chart.register();

const taskList = JSON.parse(localStorage.getItem("tasks")) || [];

function parseDuration(durationStr) {
  const [hh, mm, ss] = durationStr.split(":").map(Number);
  return hh + mm / 60 + ss / 3600;
}

function getWeekday(dateStr) {
  const [month, day, year] = dateStr.split("/");
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function getWeekOfMonth(dateStr) {
  const [month, day, year] = dateStr.split("/");
  const date = new Date(`${year}-${month}-${day}`);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return Math.ceil((date.getDate() + firstDay.getDay()) / 7); // returns 1,2,3,4,5
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
        backgroundColor: ["darkred", "darkblue", "yellow", "darkgray", "goldenrod"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Hours" }
        }
      }
    }
  });
}

function weeklyChartStatus() {
  const ctx = document.getElementById("weeklyChart").getContext("2d");
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const durationsByDay = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0
  };

  taskList.forEach(task => {
    if (task.startDate) {
      const day = getWeekday(task.startDate);
      if (weekdays.includes(day)) {
        durationsByDay[day] += parseDuration(task.totalDuration);
      }
    }
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: weekdays,
      datasets: [{
        label: "Total Duration (hrs)",
        data: weekdays.map(day => durationsByDay[day]),
        backgroundColor: ["#f39c12", "#2980b9", "#27ae60", "#8e44ad", "#c0392b"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Hours" }
        }
      }
    }
  });
}

function monthlyChartStatus() {
  const ctx = document.getElementById("monthlyChart").getContext("2d");

  const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
  const durationsByWeek = [0, 0, 0, 0, 0];

  taskList.forEach(task => {
    if (task.startDate) {
      const weekIndex = getWeekOfMonth(task.startDate) - 1; // 0-based index
      if (weekIndex >= 0 && weekIndex < 5) {
        durationsByWeek[weekIndex] += parseDuration(task.totalDuration);
      }
    }
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: weekLabels,
      datasets: [{
        label: "Total Duration (hrs)",
        data: durationsByWeek,
        backgroundColor: ["#ffcd56", "#36a2eb", "#4bc0c0", "#9966ff", "#ff6384"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Hours" }
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  dailyChartStatus();
  weeklyChartStatus();
  monthlyChartStatus();
});
