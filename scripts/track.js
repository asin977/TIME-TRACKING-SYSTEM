
let taskTimers = {}; 
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];taskList.forEach(task => addToTable(task));
Chart.register();

function generateTaskId() {
    return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function startTask() {
    const taskName = document.getElementById("taskName").value.trim();
    const description = document.getElementById("description").value.trim();
  
    if (!taskName) {
      alert("Please enter the task before you START");
      return;
    }
  
    const taskId = generateTaskId();
    const startTime = new Date();
  
    const interval = setInterval(() => {
      const now = new Date();
      const passedTime = Math.floor((now - startTime) / 1000);
      const minutes = Math.floor(passedTime / 60);
      const seconds = passedTime % 60;
      const timeString = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      document.title = `🕛 ${timeString}-Tracking-${taskName}`;
    }, 1000);
  
    taskTimers[taskId] = { taskName, description, startTime, interval };
  
    const taskBtn = document.createElement("button");
    taskBtn.textContent = `STOP ${taskName}`;
    taskBtn.classList.add("stop")
    taskBtn.dataset.taskId = taskId;
    taskBtn.onclick = () => stopTask(taskId);
    document.getElementById("activeTasks").appendChild(taskBtn);
  
    document.getElementById("taskName").value = "";
    document.getElementById("description").value = "";
}

function stopTask(taskId) {
    const task = taskTimers[taskId];
    if (!task) return;
  
    clearInterval(task.interval);
    document.title = "TIME TRACKER DASHBOARD";
  
    const endTime = new Date();
    const duration = ((endTime - task.startTime) / 60000).toFixed(2);
    const taskDate = new Date().toISOString().split("T")[0];
  
    const taskObj = {
      taskName: task.taskName,
      taskDate,
      duration,
      description: task.description
    };

    taskList.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    addToTable(taskObj);
  
    delete taskTimers[taskId];
    document.querySelector(`button[data-task-id="${taskId}"]`).remove();
}

function addToTable(task) {
    const tbody = document.querySelector("#tasktable tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td title="${task.description || ''}">${task.taskName}</td>
      <td>${task.taskDate}</td>
      <td>${task.duration}</td>
    `;
    tbody.appendChild(row);
}

function resetTask() {
    if (confirm("Are you sure? Do you want to reset all the tasks?")) {
        localStorage.removeItem("tasks");
        taskList = [];
        document.querySelector("#tasktable tbody").innerHTML = "";
        document.getElementById("activeTasks").innerHTML = "";
        for (const id in taskTimers) clearInterval(taskTimers[id].interval);
        taskTimers = {};
        dailyChartStatus();
        
  }
}
function dailyChartStatus() {
    const today = new Date().toISOString().split("T")[0];
    const dailyTasks = taskList.filter(task => task.taskDate === today);

    const taskDurations = {};
    dailyTasks.forEach(task => {
    taskDurations[task.taskName] = (taskDurations[task.taskName] || 0) + parseFloat(task.duration);
    });

    const ctx = document.getElementById("dailyChart").getContext("2d");
    if (window.dailyChart instanceof Chart) window.dailyChart.destroy();

    window.dailyChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: Object.keys(taskDurations),
        datasets: [{
        data: Object.values(taskDurations),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
        }]
    },
    options: {
        plugins: {
        title: { display: true, text: "Today's Task Summary (Pie Chart - 24hr View)" },
        tooltip: {
            callbacks: {
            label: function (context) {
                const value = context.raw;
                const hours = (value / 60).toFixed(2);
                const percentage = ((value / 1440) * 100).toFixed(1);
                return `${context.label}: ${hours} hrs (${percentage}%)`;
            }
            }
        }
        }
}
});
}

function weeklyChartStatus() {
    const recentTasks = taskList.filter(task => {
        const date = new Date(task.taskDate);
        const now = new Date();
        return (now - date) / (1000 * 3600 * 24) <= 7;
        });
        
        const taskDurations = {};
        recentTasks.forEach(task => {
        taskDurations[task.taskName] = (taskDurations[task.taskName] || 0) + parseFloat(task.duration);
        });
        
        const totalMinutes = Object.values(taskDurations).reduce((a, b) => a + b, 0);
        const ctx = document.getElementById("weeklyChart").getContext("2d");
        if (window.weeklyChart instanceof Chart) window.weeklyChart.destroy();
        
        window.weeklyChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(taskDurations),
            datasets: [{
            data: Object.values(taskDurations),
            backgroundColor: ['#0D1B2A', '#1B263B', '#3A0CA3', '#6A040F', '#144552', '#1B4332']
            }]
        },
        options: {
            plugins: {
            title: { display: true, text: "Weekly Task Summary (Pie Chart)" },
            tooltip: {
                callbacks: {
                label: function (context) {
                    const value = context.raw;
                    const hours = (value / 60).toFixed(2);
                    const percentage = ((value / totalMinutes) * 100).toFixed(1);
                    return `${context.label}: ${hours} hrs (${percentage}%)`;
                }
        }
    }
    }
}
});
}

document.querySelector(".start").addEventListener("click", startTask);
document.querySelector(".reset").addEventListener("click", resetTask);
document.getElementById("showDailyStatus").addEventListener("click", dailyChartStatus);
document.getElementById("weeklyCharts").addEventListener("click", weeklyChartStatus);



