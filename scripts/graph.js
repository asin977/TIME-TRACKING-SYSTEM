function parseDurationToHours(durationStr) {
  const [h, m, s] = durationStr.split(":").map(Number);
  return h + m / 60 + s / 3600;
}

function renderWeeklyBarGraph() {
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];

  
  const weekData = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
  };

  taskList.forEach(task => {
      const day = new Date(task.startDate).getDay(); // 0=Sun, 1=Mon, ...
      const hours = parseDurationToHours(task.totalDuration);
      const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      weekData[dayMap[day]] += hours;
  });

  const maxDuration = Math.max(...Object.values(weekData));

  const yAxisLabels = document.getElementById("yAxisLabels");
  const barsContainer = document.getElementById("barsContainer");
  const xAxisLabels = document.getElementById("xAxisLabels");

  yAxisLabels.innerHTML = "";
  barsContainer.innerHTML = "";
  xAxisLabels.innerHTML = "";


  for (let i = 5; i >= 0; i--) {
      const label = document.createElement("div");
      label.textContent = ((maxDuration / 5) * i).toFixed(1) + "h";
      yAxisLabels.appendChild(label);
  }

  
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  days.forEach(day => {
      const barHeightPercent = maxDuration === 0 ? 0 : (weekData[day] / maxDuration) * 100;

      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${barHeightPercent}%`;
      bar.textContent = weekData[day].toFixed(1);

      barsContainer.appendChild(bar);

      const label = document.createElement("div");
      label.textContent = day;
      xAxisLabels.appendChild(label);
  });
}

document.querySelector(".show").addEventListener("click", renderWeeklyBarGraph);
