// Function to start a task
function startTask() {
    const taskName = document.getElementById("taskName").value.trim();
    const taskTag = document.getElementById("taskTag").value.trim();
    const description = document.getElementById("description").value.trim();
  
    if (taskName === "") {
      alert("Task name is required!");
      return;
    }
  
    const task = {
      name: taskName,
      tag: taskTag,
      description: description,
      startDate: new Date().toLocaleString(),
      duration: "00:00:00"
    };
  
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  
    renderTasks();
    clearInputFields();
  }
  
  // Render tasks in the table
  function renderTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const tbody = document.getElementById("taskTableBody");
    tbody.innerHTML = "";
  
    tasks.forEach((task, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${task.name}</td>
        <td>${task.startDate}</td>
        <td>${task.duration}</td>
        <td>
          <button onclick="resumeTask(${index})">Resume</button>
          <button onclick="editTask(${index})">Edit</button>
          <button onclick="deleteTask(${index})">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }
  
  // Edit a task
  function editTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const task = tasks[index];
  
    const row = document.getElementById("taskTableBody").rows[index];
    row.innerHTML = `
      <td><input type="text" id="editName${index}" value="${task.name}"></td>
      <td><input type="text" id="editStartDate${index}" value="${task.startDate}"></td>
      <td><input type="text" id="editDuration${index}" value="${task.duration}"></td>
      <td>
        <button onclick="saveEdit(${index})">Save</button>
        <button onclick="renderTasks()">Cancel</button>
      </td>
    `;
  }
  
  // Save edited task
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
  
  // Delete a task
  function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
  
  // Reset all tasks
  function resetTask() {
    if (confirm("Are you sure you want to delete all records?")) {
      localStorage.removeItem("tasks");
      renderTasks();
    }
  }
  
  // Resume (dummy function - to be implemented if needed)
  function resumeTask(index) {
    alert(`Resuming task: ${index}`);
  }
  
  // Clear input fields
  function clearInputFields() {
    document.getElementById("taskName").value = "";
    document.getElementById("taskTag").value = "";
    document.getElementById("description").value = "";
  }
  
  // Search functionality
  function searchTasks() {
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "";
  
    const filteredTasks = tasks.filter(
      (task) =>
        task.name.toLowerCase().includes(searchInput) ||
        task.tag.toLowerCase().includes(searchInput)
    );
  
    if (filteredTasks.length === 0) {
      searchResults.textContent = "No matching tasks found.";
      return;
    }
  
    filteredTasks.forEach((task) => {
      const div = document.createElement("div");
      div.textContent = `Task: ${task.name} | Tag: ${task.tag} | Desc: ${task.description}`;
      searchResults.appendChild(div);
    });
  }
  
  // Toggle profile details
  function toggleProfileDetails() {
    const tooltip = document.getElementById("profileTooltip");
    tooltip.style.display = tooltip.style.display === "block" ? "none" : "block";
  }
  
  // Show/hide arrow
  document.getElementById("showMoreBtn").addEventListener("click", () => {
    const table = document.getElementById("tasktable");
    table.scrollIntoView({ behavior: "smooth" });
  });
  
  // Initialize
  document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
  });
  