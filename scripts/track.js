// scripts/track.js

function startTask() {
    const taskName = document.getElementById("taskName").value.trim();
    const taskTag = document.getElementById("taskTag").value.trim();
    const description = document.getElementById("description").value.trim();
  
    if (!taskName) {
      alert("Please enter a task name.");
      return;
    }
  
    const now = Date.now();
    sessionStorage.setItem("currentTaskName", taskName);
    sessionStorage.setItem("currentTaskTag", taskTag);
    sessionStorage.setItem("currentTaskDescription", description);
    sessionStorage.setItem("startTime", now.toString());
    sessionStorage.setItem("accumulatedDuration", "0");
  
    window.location.href = "timer.html";
  }
  
  function resetTask() {
    if (confirm("Are you sure you want to delete all tasks?")) {
      localStorage.removeItem("tasks");
      loadTasks();
    }
  }
  
  function loadTasks() {
    const taskTableBody = document.getElementById("taskTableBody");
    taskTableBody.innerHTML = "";
  
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  
    tasks.forEach((task, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${task.name}</td>
        <td>${task.startDate}</td>
        <td>${task.duration}</td>
        <td>
          <button onclick="resumeTask(${index})">Resume</button>
          <button onclick="deleteTask(${index})">Delete</button>
        </td>
      `;
      taskTableBody.appendChild(tr);
    });
  }
  
  function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }
  
  function resumeTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const task = tasks[index];
  
    sessionStorage.setItem("currentTaskName", task.name);
    sessionStorage.setItem("currentTaskTag", task.tag || "");
    sessionStorage.setItem("currentTaskDescription", task.description || "");
    sessionStorage.setItem("resumeStartTime", Date.now().toString());
    sessionStorage.setItem("accumulatedDuration", task.durationSeconds || "0");
  
    window.location.href = "timer.html";
  }
  
  document.addEventListener("DOMContentLoaded", loadTasks);
  