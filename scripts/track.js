if (typeof taskList === "undefined") {
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
      const hours = parseDurationToHours(task.totalDuration);
      if (!isNaN(hours)) {
        const dayIndex = new Date(task.startDate).getDay();
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

    
    for (let i = 5; i >= 0; i--) {
      const label = document.createElement("div");
      const value = ((maxDuration / 5) * i).toFixed(1);
      label.textContent = `${value}h`;
      yAxisLabels.appendChild(label);
    }

    
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    days.forEach(day => {
      const barHeightPercent = (weekData[day] / maxDuration) * 100;

      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${barHeightPercent}%`;
      bar.textContent = weekData[day] ? weekData[day].toFixed(1) : "0.0";
      barsContainer.appendChild(bar);

      const label = document.createElement("div");
      label.textContent = day;
      xAxisLabels.appendChild(label);
    });

    
    const totalHours = durations.reduce((a, b) => a + b, 0).toFixed(1);
    const totalBadge = document.getElementById("totalHoursBadge");
    if (totalBadge) totalBadge.textContent = `Total: ${totalHours}h this week`;
  }

  function renderTaskTable() {
    const taskTableBody = document.getElementById("taskTableBody");
    if (!taskTableBody) return;

    taskTableBody.innerHTML = "";

    taskList.forEach((task, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${task.taskName || "-"}</td>
        <td>${task.startDate || "--/--/----"}</td>
        <td>${task.totalDuration || "00:00:00"}</td>
        <td><button class="resume" onclick="resumeTask(${index})">🕒 Resume</button></td>
        <td><button class="delete" onclick="deleteTask(${index})">🗑️</button></td>
      `;
      taskTableBody.appendChild(row);
    });

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
  function searchTasks() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = "";
  
    const filtered = taskList.filter(task =>
      task.taskName.toLowerCase().includes(query) ||
      task.taskTag.toLowerCase().includes(query)
    );
  
    if (filtered.length === 0) {
      resultsDiv.innerHTML = "<p>Oops!..No matching tasks found.</p>";
      return;
    }
  
    filtered.forEach((task, i) => {
      const resultId = `search-result-${i}`;
      const div = document.createElement("div");
      div.classList.add("search-result");
      div.id = resultId;
      div.innerHTML = `
        <strong>📑 ${task.taskName}</strong><br>
        📌 ${task.taskTag}<br>
        🕒 ${task.totalDuration}
        <div class="clear" onclick="removeSearchResult('${resultId}')">
                    <svg height="30" preserveAspectRatio="none" viewBox="0 0 64 64" width="30" xmlns="http://www.w3.org/2000/svg"><path d="m12.458008 20.291992h39.083984v39.583008h-39.083984z" fill="#fff"/><path d="m55.7714844 14.652832h-2.8564453v-3.277832c0-1.0454102-.8476563-1.8930664-1.8935547-1.8930664h-9.0634766v-5.3569336c0-1.1044922-.8955078-2-2-2h-15.9160156c-1.1044922 0-2 .8955078-2 2v5.3569336h-9.0629883c-1.0454102 0-1.8930664.8476563-1.8930664 1.8930664v3.277832h-2.8574219c-1.1816406 0-2.1391602.9575195-2.1391602 2.1391602v7.1245117c0 1.1816406.9575195 2.1391602 2.1391602 2.1391602h2.2294922v33.8193359c0 1.1044922.8955078 2 2 2h39.0839844c1.1044922 0 2-.8955078 2-2v-33.8193359h2.2294922c1.1816406 0 2.1396484-.9575195 2.1396484-2.1391602v-7.1245117c0-1.1816406-.9580078-2.1391602-2.1396484-2.1391602zm-29.7294922-8.527832h11.9160156v3.3569336h-11.9160156zm23.5 51.75h-35.0839844v-31.8193359h35.0839844z" fill="#182985"/><path d="m22.125 51.1513672c-1.0043945 0-1.8183594-.8144531-1.8183594-1.8183594v-17.3330078c0-1.0043945.8139648-1.8183594 1.8183594-1.8183594s1.8183594.8139649 1.8183594 1.8183594v17.3330078c0 1.0039063-.8139649 1.8183594-1.8183594 1.8183594z" fill="#e80000"/><path d="m41.875 51.1513672c-1.0039063 0-1.8183594-.8144531-1.8183594-1.8183594v-17.3330078c0-1.0043945.8144531-1.8183594 1.8183594-1.8183594s1.8183594.8139649 1.8183594 1.8183594v17.3330078c0 1.0039063-.8144531 1.8183594-1.8183594 1.8183594z" fill="#e80000"/><path d="m32 51.1513672c-1.0043945 0-1.8183594-.8144531-1.8183594-1.8183594v-17.3330078c0-1.0043945.8139648-1.8183594 1.8183594-1.8183594 1.0039063 0 1.8183594.8139648 1.8183594 1.8183594v17.3330078c0 1.0039063-.8144531 1.8183594-1.8183594 1.8183594z" fill="#e80000"/><g fill="#182985"><path d="m22.125 51.1513672c-1.0043945 0-1.8183594-.8144531-1.8183594-1.8183594v-17.3330078c0-1.0043945.8139648-1.8183594 1.8183594-1.8183594s1.8183594.8139649 1.8183594 1.8183594v17.3330078c0 1.0039063-.8139649 1.8183594-1.8183594 1.8183594z"/><path d="m41.875 51.1513672c-1.0039063 0-1.8183594-.8144531-1.8183594-1.8183594v-17.3330078c0-1.0043945.8144531-1.8183594 1.8183594-1.8183594s1.8183594.8139649 1.8183594 1.8183594v17.3330078c0 1.0039063-.8144531 1.8183594-1.8183594 1.8183594z"/><path d="m32 51.1513672c-1.0043945 0-1.8183594-.8144531-1.8183594-1.8183594v-17.3330078c0-1.0043945.8139648-1.8183594 1.8183594-1.8183594 1.0039063 0 1.8183594.8139648 1.8183594 1.8183594v17.3330078c0 1.0039063-.8144531 1.8183594-1.8183594 1.8183594z"/></g></svg>
  
        </div>
      `;
      resultsDiv.appendChild(div);
    });
  }
  function removeSearchResult(resultId) {
    const resultEl = document.getElementById(resultId);
    if (resultEl) resultEl.remove();
  }
  function startTask() {
    const taskNameInput = document.getElementById("taskName");
    const taskTagInput = document.getElementById("taskTag");
    const taskDescriptionInput = document.getElementById("taskDescription");
  
    const taskName = taskNameInput?.value.trim() || "Unnamed Task";
    const taskTag = taskTagInput?.value.trim() || "";
    const taskDescription = taskDescriptionInput?.value.trim() || "";
  
    const startDate = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
    const startTime = new Date().toLocaleTimeString();         // HH:MM:SS
  
    const newTask = {
      taskName,
      taskTag,
      taskDescription,
      startDate,
      startTime,
      totalDuration: "00:00:00",
      sessions: []
    };
  
    taskList.push(newTask);
    saveTaskToLocalStorage();
  
    
    const taskIndex = taskList.length - 1;
    window.location.href = `timer.html?taskIndex=${taskIndex}`;
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
}

