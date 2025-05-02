window.addEventListener("DOMContentLoaded", () => {
    const taskName = sessionStorage.getItem("currentTaskName") || "Unnamed Task";
    const taskTag = sessionStorage.getItem("currentTaskTag") || "No Tag";
    const taskDescription = sessionStorage.getItem("currentTaskDescription") || "No Description";
  
    document.getElementById("taskName").textContent = taskName;
    document.getElementById("taskTag").textContent = taskTag;
    document.getElementById("taskDescription").textContent = taskDescription;
  
    let startTime;
    let intervalId;
  
    const currentTask = JSON.parse(localStorage.getItem("currentTask"));
    if (currentTask) {
      document.getElementById("recordStartDate").textContent = currentTask.startDate;
      document.getElementById("recordEndDate").textContent = currentTask.endDate;
      document.getElementById("recordStartTime").textContent = currentTask.startTime;
      document.getElementById("recordEndTime").textContent = currentTask.endTime;
      document.getElementById("taskDuration").textContent = currentTask.duration;
    }
  
    function updateElapsedTime() {
      const now = new Date();
      const diff = new Date(now - startTime);
      const h = String(diff.getUTCHours()).padStart(2, '0');
      const m = String(diff.getUTCMinutes()).padStart(2, '0');
      const s = String(diff.getUTCSeconds()).padStart(2, '0');
      document.getElementById("elapsedTime").textContent = `${h}:${m}:${s}`;
    }
  
    document.getElementById("start").addEventListener("click", () => {
      const now = new Date();
      startTime = now;
  
      const startDateStr = now.toISOString().split("T")[0];
      const startTimeStr = now.toTimeString().split(" ")[0];
  
      document.getElementById("recordStartDate").textContent = startDateStr;
      document.getElementById("recordStartTime").textContent = startTimeStr;
      document.getElementById("startTime").textContent = startTimeStr;
  
      intervalId = setInterval(updateElapsedTime, 1000);
      document.getElementById("stop").disabled = false;
      document.getElementById("reset").disabled = false;
      document.getElementById("start").disabled = true;
    });
  
    document.getElementById("stop").addEventListener("click", () => {
      clearInterval(intervalId);
      const endTime = new Date();
      const endTimeStr = endTime.toTimeString().split(" ")[0];
      const endDateStr = endTime.toISOString().split("T")[0];
  
      document.getElementById("endTime").textContent = endTimeStr;
      document.getElementById("recordEndTime").textContent = endTimeStr;
      document.getElementById("recordEndDate").textContent = endDateStr;
  
      const diff = new Date(endTime - startTime);
      const h = String(diff.getUTCHours()).padStart(2, '0');
      const m = String(diff.getUTCMinutes()).padStart(2, '0');
      const s = String(diff.getUTCSeconds()).padStart(2, '0');
      const durationStr = `${h}:${m}:${s}`;
      document.getElementById("taskDuration").textContent = durationStr;
  
      const record = {
        name: taskName,
        tag: taskTag,
        taskDescription: taskDescription,
        startDate: document.getElementById("recordStartDate").textContent,
        endDate: document.getElementById("recordEndDate").textContent,
        startTime: document.getElementById("recordStartTime").textContent,
        endTime: endTimeStr,
        duration: durationStr,
      };
  
      // Save current task for persistence
      localStorage.setItem("currentTask", JSON.stringify(record));
  
      // Save to allTasks list
      const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
      tasks.push(record);
      localStorage.setItem("allTasks", JSON.stringify(tasks));
  
      renderAllTasks();
  
      document.getElementById("stop").disabled = true;
    });
  
    document.getElementById("reset").addEventListener("click", () => {
      clearInterval(intervalId);
      document.getElementById("elapsedTime").textContent = "00:00:00";
      document.getElementById("startTime").textContent = "--:--:--";
      document.getElementById("endTime").textContent = "--:--:--";
      // Keep record section data persistent
  
      document.getElementById("start").disabled = false;
      document.getElementById("stop").disabled = true;
      document.getElementById("reset").disabled = true;
    });
  
    document.getElementById("clearAll").addEventListener("click", () => {
      sessionStorage.clear();
      localStorage.clear();
      location.reload();
    });
  
    document.getElementById("deleteTask").addEventListener("click", () => {
       
        localStorage.removeItem("currentTask");
        sessionStorage.removeItem("currentTaskName");
        sessionStorage.removeItem("currentTaskTag");
        sessionStorage.removeItem("currentTaskDescription");
      
        document.getElementById("taskName").textContent = "";
        document.getElementById("taskTag").textContent = "";
        document.getElementById("taskDescription").textContent = "";
        document.getElementById("recordStartDate").textContent = "";
        document.getElementById("recordEndDate").textContent = "";
        document.getElementById("recordStartTime").textContent = "";
        document.getElementById("recordEndTime").textContent = "";
        document.getElementById("taskDuration").textContent = "";
      
        alert("Task details deleted successfully!");
      });
      
  
    document.getElementById("goDashboard").addEventListener("click", () => {
      window.location.href = "track.html";
    });
  
    function renderAllTasks() {
      const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
      const container = document.getElementById("allTasksList");
      container.innerHTML = "";
  
      tasks.forEach((task, index) => {
        const div = document.createElement("div");
        div.classList.add("task-entry");
        div.innerHTML = `
          <p><strong>TASK ${index + 1}</strong></p>
          <p><strong>◘Task Name:</strong> ${task.name}</p>
          <p><strong>◘Task Tag:</strong> ${task.tag}</p>
          <p><strong>◘Description:</strong> ${task.taskDescription}</p>
          <p><strong>◘Start Date:</strong> ${task.startDate}</p>
          <p><strong>◘Start Time:</strong> ${task.startTime}</p>
          <p><strong>◘End Time:</strong> ${task.endTime}</p>
          <p><strong>◘Duration:</strong> ${task.duration}</p>
          <hr>
        `;
        container.appendChild(div);
      });
    }
  
    renderAllTasks();
  });
  