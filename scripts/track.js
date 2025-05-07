window.addEventListener("DOMContentLoaded", () => {
  const profileNameSpan = document.getElementById("profileName");
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  if (loggedInUser && loggedInUser.firstName) {
      profileNameSpan.textContent = loggedInUser.firstName;
  } else {
      profileNameSpan.textContent = "Guest";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const profileNameSpan = document.getElementById("profileName");
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
      alert("You must be signed in to view the dashboard.");
      window.location.href = "index.html";
      return;
  }

  profileNameSpan.textContent = loggedInUser.firstName;
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
    resultsDiv.innerHTML = "<p>No matching tasks found.</p>";
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
      <button class="clear" onclick="removeSearchResult('${resultId}')">DELETE</button>
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
