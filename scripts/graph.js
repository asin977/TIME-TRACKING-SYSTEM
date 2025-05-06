Chart.register();                          //./      
function dailyChartStatus() {
    const ctx = document.getElementById("dailyChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: taskList.map(task => task.taskName),
        datasets: [{
          label: "Total Duration (hrs)",
          data: taskList.map(task => parseDuration(task.totalDuration)),
          backgroundColor: ["darkred", "goldenrod", "orange", "pink", "lightgreen"]
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
          label: "Total Duration (hrs)",
          data: taskList.map(task => parseDuration(task.totalDuration)),
          backgroundColor: ["darkred", "goldenrod", "blue", "pink", "lightgreen"]
        }]
      }
    });
  }
  
  function monthlyChartStatus() {
    const ctx = document.getElementById("monthlyChart").getContext("2d");
    new Chart(ctx, {
      type:"bar",
      data: {
        labels:taskList.map(task => task.taskName),
        datasets: [{
          label: "Total Duration (hrs)",
          data:taskList.map(task => parseDuration(task.totalDuration)),
          backgroundColor: ["darkred", "goldenrod", "blue", "pink", "lightgreen"]
  
        }]
      }
    })
  }