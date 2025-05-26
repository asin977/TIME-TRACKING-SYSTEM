window.addEventListener('DOMContentLoaded', () => {
  const userDataStr = sessionStorage.getItem('loggedInUser');
  if (!userDataStr) {
    
    window.location.href = "index.html";
    return;
  }
  const userData = JSON.parse(userDataStr);

  const tooltipName = document.getElementById('tooltipName');
  const tooltipEmail = document.getElementById('tooltipEmail');
  const tooltipWorkSpace = document.getElementById('tooltipworkSpace');

  if (tooltipName) tooltipName.textContent = `Name: ${userData.firstName || "N/A"}`;
  if (tooltipEmail) tooltipEmail.textContent = `Email: ${userData.email || "N/A"}`;
  if (tooltipWorkSpace) tooltipWorkSpace.textContent = `WorkSpace:${userData.workSpace || "N/A"}`;
});


let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTaskToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

function parseDurationToHours(durationStr) {
  if (!durationStr || !durationStr.includes(":")) return 0;
  const [h, m, s] = durationStr.split(":").map(Number);
  return (h || 0) + (m || 0) / 60 + (s || 0) / 3600;
}
function startTask() {
  const taskName = document.getElementById("taskName").value.trim();
  const taskTag = document.getElementById("taskTag").value.trim();

  if (!taskName || !taskTag) {
    alert("⚠️ Please enter both the Task Name and Task Tag before tracking your time.");
    return;
  }
  const description = document.getElementById("description").value.trim();
  const startTime = new Date();

  const task = {
    name: taskName,
    tag: taskTag,
    description: description,
    startTime: startTime.toISOString(),
    sessions: []
  };
  
  sessionStorage.setItem("currentTask", JSON.stringify(task));
  window.location.href = "timer.html";
}
 
function renderTaskTable() {
    const taskTableBody = document.getElementById("taskTableBody");
    const showMoreBtn = document.getElementById("showMoreBtn");
  
    if (!taskTableBody || !showMoreBtn) return;
  
    taskTableBody.innerHTML = "";
  
    const visibleLimit = 5;
    taskList.forEach((task, index) => {
      const row = document.createElement("tr");
      row.id = `taskRow-${index}`;
      row.innerHTML = `
        <td class="taskNameCell" id="taskNameCell-${index}">${task.taskName || "-"}</td>
        <td>${task.startDate || "--/--/----"}</td>
        <td>${task.totalDuration || "00:00:00"}</td>
        <td>
          <div class="more" id="actionBtns-${index}"> 
            <button class="resume" onclick="resumeTask(${index})">🕒 Resume</button>
            <button class="edit" onclick="toggleEditButtons(${index})">✏️ Edit</button>
            <button class="delete" onclick="deleteTask(${index})">🗑️ Delete</button>
          </div>
        </td>
      `;
      if (index >= visibleLimit) row.classList.add("hidden-row");
      taskTableBody.appendChild(row);
    });
  
    if (taskList.length > visibleLimit) {
      showMoreBtn.style.display = "block";
      showMoreBtn.textContent = "Show More";
    } else {
      showMoreBtn.style.display = "none";
    }
  }
  
  function toggleEditButtons(index) {
    const btnContainer = document.getElementById(`actionBtns-${index}`);
    const nameCell = document.getElementById(`taskNameCell-${index}`);
    if (!btnContainer || !nameCell) return;
  
    const isEditing = btnContainer.querySelector(".save");
    if (isEditing) {
      
      nameCell.textContent = taskList[index].taskName || "-";
      btnContainer.innerHTML = `
        <button class="resume" onclick="resumeTask(${index})">🕒 Resume</button>
        <button class="edit" onclick="toggleEditButtons(${index})">✏️ Edit</button>
        <button class="delete" onclick="deleteTask(${index})">🗑️ Delete</button>
      `;
    } else {
      
      nameCell.innerHTML = `<input type="text" id="editTaskName-${index}" value="${taskList[index].taskName || ""}" />`;
      btnContainer.innerHTML = `
        <button class="save" onclick="saveTask(${index})">💾 Save</button>
        <button class="cancel" onclick="toggleEditButtons(${index})">⛔ Cancel</button>
      `;
    }
  }
  
  function saveTask(index) {
    const editedNameInput = document.getElementById(`editTaskName-${index}`);
    if (!editedNameInput) return;
  
    const newName = editedNameInput.value.trim();
    if (newName) {
      taskList[index].taskName = newName;
    }
  
    renderTaskTable();
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    const showMoreBtn = document.getElementById("showMoreBtn");
  
    if (!showMoreBtn) return;
  
    let expanded = false;
  
    showMoreBtn.addEventListener("click", () => {
      const hiddenRows = document.querySelectorAll(".hidden-row");
      if (!expanded) {
        hiddenRows.forEach(row => row.style.display = "table-row");
        showMoreBtn.textContent = "Show Less";
      } else {
        hiddenRows.forEach(row => row.style.display = "none");
        showMoreBtn.textContent = "Show More";
      }
      expanded = !expanded;
    });
  });

  function toggleProfileDetails() {
    document.querySelector('.profile-wrapper').classList.toggle('show');
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
  
    function saveTask(index) {
    
      console.log("Saving task", index);
    
    
      toggleEditButtons(index);
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
         <button class="resume" onclick="resumeTask(${i})">▶️ Resume</button>
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

    if(!taskNameInput && !taskTagInput) {
      alert("Please fill all the required columns...");
    }

    const taskName = taskNameInput?.value.trim() || "Unnamed Task";
    const taskTag = taskTagInput?.value.trim() || "";
    const taskDescription = taskDescriptionInput?.value.trim() || "";
  
    const startDate = new Date().toISOString().split("T")[0]; 
    const startTime = new Date().toLocaleTimeString(); 
  
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

function saveEdit(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const editedName = document.getElementById(`editName${index}`).value.trim();
    const editedStartDate = document.getElementById(`editStartDate${index}`).value.trim();
    const editedDuration = document.getElementById(`editDuration${index}`).value.trim();
  
    if (editedName === "") {
      alert("Task name is required!");
      return;
    }
  
    tasks[index].name = editedName;
    tasks[index].startDate = editedStartDate;
    tasks[index].duration = editedDuration;
  
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
  
  function clearInputFields() {
    document.getElementById("taskName").value = "";
    document.getElementById("taskTag").value = "";
    document.getElementById("description").value = "";
  }

  document.querySelector(".show")?.addEventListener("click", renderWeeklyBarGraph);


  