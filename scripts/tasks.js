window.addEventListener("DOMContentLoaded",() => {
    const profileNameSpan = document.getElementById("profileName");
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  
    if (loggedInUser && loggedInUser.firstName) {
        profileNameSpan.textContent = loggedInUser.firstName;
    } else {
        profileNameSpan.textContent = "Guest";
    }
  });
  
  

document.addEventListener("DOMContentLoaded", () => {
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


  const scrollArrow = document.getElementById("scrollArrow");
  const taskTableBody = document.getElementById("taskTableBody");

  if (scrollArrow && taskTableBody) {
    scrollArrow.addEventListener("click", () => {
      const rows = taskTableBody.getElementsByTagName("tr");
      if (rows.length > 5) {
        rows[5].scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
});

  let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
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
        <td>${task.startDate || "--/--/----"}</td>
        <td>${task.totalDuration}</td>
        <td><button class="resume" onclick="resumeTask(${index})">🕒 Resume</button></td>
        <td><button class="delete" onclick="deleteTask(${index})">Delete</button></td>
      `;
      taskTableBody.appendChild(row);
    });
  }
  function renderBarChart() {
    const barChart = document.getElementById("barChart");
    const xLabels = document.getElementById("xLabels");
    const yLabels = document.getElementById("yLabels");
    barChart.querySelectorAll(".bar").forEach(e => e.remove());
    yLabels.innerHTML = "";
    xLabels.innerHTML = "";
  
    const durations = taskList.map(task => parseDurationToHours(task.totalDuration));
    const maxDuration = Math.max(...durations);
  
    for (let i = 5; i >= 0; i--) {
      const span = document.createElement("span");
      span.textContent = ((maxDuration / 5) * i).toFixed(1) + "h";
      yLabels.appendChild(span);
    }
  
    taskList.forEach(task => {
      const barHeightPercent = (parseDurationToHours(task.totalDuration) / maxDuration) * 100;
  
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.style.height = `${barHeightPercent}%`;
      bar.textContent = parseDurationToHours(task.totalDuration).toFixed(1);
  
      barChart.appendChild(bar);
  
      const label = document.createElement("div");
      label.textContent = task.taskName;
      xLabels.appendChild(label);
    });
  }
  
  function renderTaskGraph() {
    const graphContainer = document.getElementById("taskDurationGraph");
    graphContainer.innerHTML = "";
  
    const totalSeconds = taskList.reduce((sum, task) => sum + parseDuration(task.totalDuration), 0);
  
    if (totalSeconds === 0) {
      graphContainer.innerHTML = "<p>No task durations to display.</p>";
      return;
    }
    taskList.forEach(task => {
      const taskSeconds = parseDuration(task.totalDuration);
      const widthPercent = (taskSeconds / totalSeconds) * 100;
  
      const label = document.createElement("div");
      label.textContent = `${task.taskName} (${task.totalDuration})`;
  
      const bar = document.createElement("div");
      bar.className = "task-bar";
      bar.style.width = `${widthPercent}%`;
      bar.style.backgroundColor = getRandomColor();
      bar.textContent = task.totalDuration;
  
      graphContainer.appendChild(label);
      graphContainer.appendChild(bar);
    });
  }
  
  function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 60%)`;
  }
  
  function startTask() {
    const taskName = document.getElementById("taskName").value.trim();
    const taskTag = document.getElementById("taskTag").value.trim();
    const description = document.getElementById("description").value.trim();
  
    if(!taskName && !taskTag) {
      alert("Please fill all the required fields before tracking the time..");
      return;
    }

    if (taskName && taskTag && description) {
      const taskData = {
        taskName,
        taskTag,
        description,
        startDate: new Date().toLocaleDateString(),
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
      🕒 ${task.totalDuration}<br>
      <a href="timer.html">▶️ Resume</a> |
      <a href="track.html">📋 Dashboard</a>
      <div class="clear" onclick="removeSearchResult('${resultId}')">
    <svg height="30" preserveAspectRatio="none" viewBox="0 0 64 64" width="30" xmlns="http://www.w3.org/2000/svg">
      <path d="m12.458008 20.291992h39.083984v39.583008h-39.083984z" fill="#fff"/>
      <path d="m55.7714844 14.652832h-2.8564453v-3.277832c0-1.0454102-.8476563-1.8930664-1.8935547-1.8930664h-9.0634766v-5.3569336c0-1.1044922-.8955078-2-2-2h-15.9160156c-1.1044922 0-2 .8955078-2 2v5.3569336h-9.0629883c-1.0454102 0-1.8930664.8476563-1.8930664 1.8930664v3.277832h-2.8574219c-1.1816406 0-2.1391602.9575195-2.1391602 2.1391602v7.1245117c0 1.1816406.9575195 2.1391602 2.1391602 2.1391602h2.2294922v33.8193359c0 1.1044922.8955078 2 2 2h39.0839844c1.1044922 0 2-.8955078 2-2v-33.8193359h2.2294922c1.1816406 0 2.1396484-.9575195 2.1396484-2.1391602v-7.1245117c0-1.1816406-.9580078-2.1391602-2.1396484-2.1391602zm-29.7294922-8.527832h11.9160156v3.3569336h-11.9160156zm23.5 51.75h-35.0839844v-31.8193359h35.0839844z" fill="#182985"/>
      <path d="m22.125 51.1513672c-1.0043945 0-1.8183594-.8144531-1.8183594-1.8183594v-17.3330078c0-1.0043945.8139648-1.8183594 1.8183594-1.8183594s1.8183594.8139649 1.8183594 1.8183594v17.3330078c0 1.0039063-.8139649 1.8183594-1.8183594 1.8183594z" fill="#e80000"/>
      <path d="m41.875 51.1513672c-1.0039063 0-1.8183594-.8144531-1.8183594-1.8183594v-17.3330078c0-1.0043945.8144531-1.8183594 1.8183594-1.8183594s1.8183594.8139649 1.8183594 1.8183594v17.3330078c0 1.0039063-.8144531 1.8183594-1.8183594 1.8183594z" fill="#e80000"/>
      <path d="m32 51.1513672c-1.0043945 0-1.8183594-.8144531-1.8183594-1.8183594v-17.3330078c0-1.0043945.8139648-1.8183594 1.8183594-1.8183594 1.0039063 0 1.8183594.8139648 1.8183594 1.8183594v17.3330078c0 1.0039063-.8144531 1.8183594-1.8183594 1.8183594z" fill="#e80000"/>
    </svg>
  </div>
`;

      
      resultsDiv.appendChild(div);
    });
  }
 
  function removeSearchResult(resultId) {
    const resultEl = document.getElementById(resultId);
    if (resultEl) {
      resultEl.remove();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderTaskTable();
  });
  
  

  
  
  

  