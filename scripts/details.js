document.addEventListener("DOMContentLoaded", () => {
    const taskNameEl = document.getElementById("taskName");
    const taskTagEl = document.getElementById("taskTag");
    const taskDescEl = document.getElementById("taskDescription");
  
    const urlParams = new URLSearchParams(window.location.search);
    const taskIndex = parseInt(urlParams.get("taskIndex"), 10);
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length || !tasks[taskIndex]) {
      alert("Task not found.");
      window.location.href = "track.html";
      return;
    }
  
    const taskData = tasks[taskIndex];
  
    if (taskNameEl) taskNameEl.textContent = taskData.taskName || "";
    if (taskTagEl) taskTagEl.textContent = taskData.taskTag || "";
    if (taskDescEl) taskDescEl.textContent = taskData.taskDescription || "";
  
    const elapsedTimeEl = document.getElementById("elapsedTime");
    const startTimeEl = document.getElementById("startTime");
    const endTimeEl = document.getElementById("endTime");
    const recordsList = document.getElementById("recordsList");
  
    if (!taskData.sessions) taskData.sessions = [];
    if (!taskData.totalDuration) taskData.totalDuration = "00:00:00";
  
    let startTime;
    let timerInterval;
  
    renderAllTaskSessions();
    resetTimer();
  
    function timeFormatting(sec) {
      const h = String(Math.floor(sec / 3600)).padStart(2, "0");
      const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
      const s = String(sec % 60).padStart(2, "0");
      return `${h}:${m}:${s}`;
    }
  
    function startTimer() {
      startTime = new Date();
      startTimeEl.textContent = startTime.toLocaleTimeString();
  
      document.getElementById("start").disabled = true;
      document.getElementById("stop").disabled = false;
      document.getElementById("reset").disabled = false;
  
      timerInterval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - startTime) / 1000);
        elapsedTimeEl.textContent = timeFormatting(diff);
      }, 1000);
    }
  
    function stopTimer() {
      clearInterval(timerInterval);
  
      const endTime = new Date();
      const durationSec = Math.floor((endTime - startTime) / 1000);
      const durationStr = timeFormatting(durationSec);
  
      const session = {
        startDate: taskData.startDate || new Date().toLocaleDateString(),
        startTime: startTime.toLocaleTimeString(),
        endDate: endTime.toLocaleDateString(),
        endTime: endTime.toLocaleTimeString(),
        duration: durationStr
      };
  
      taskData.sessions.push(session);
  
      let totalSeconds = 0;
      taskData.sessions.forEach(sess => {
        const [h, m, s] = sess.duration.split(":").map(Number);
        totalSeconds += h * 3600 + m * 60 + s;
      });
  
      taskData.totalDuration = timeFormatting(totalSeconds);
  
      endTimeEl.textContent = session.endTime;
      elapsedTimeEl.textContent = durationStr;
  
      tasks[taskIndex] = taskData;
      localStorage.setItem("tasks", JSON.stringify(tasks));
  
      renderAllTaskSessions();
    }
  
    function resetTimer() {
      clearInterval(timerInterval);
      elapsedTimeEl.textContent = "00:00:00";
      startTimeEl.textContent = "--:--:--";
      endTimeEl.textContent = "--:--:--";
  
      document.getElementById("start").disabled = false;
      document.getElementById("stop").disabled = true;
      document.getElementById("reset").disabled = true;
    }
  
    function renderAllTaskSessions() {
      recordsList.innerHTML = `
        <h2 class="details">Task Details</h2>
        <p><strong>Task Name:</strong> ${taskData.taskName || ""}</p>
        <p><strong>Task Tag:</strong> ${taskData.taskTag || ""}</p>
        <p><strong>Task Description:</strong> ${taskData.taskDescription || "No description provided."}</p>
        <hr>
      `;
  
      if (taskData.sessions.length === 0) {
        recordsList.innerHTML += `<p>No sessions recorded yet.</p>`;
        return;
      }
  
      taskData.sessions.forEach((s, i) => {
        const sessionDiv = document.createElement("div");
        sessionDiv.className = "record";
        sessionDiv.innerHTML = `
          <div class="head"><strong class="strong">TIMER ${i + 1}</strong></div>
          <div class="session">
            <strong class="one">Session ${i + 1}</strong><br>
            Start: ${s.startTime} (${s.startDate})<br>
            End: ${s.endTime} (${s.endDate})<br>
            Duration: ${s.duration}<br><br>
          </div>
        `;
        recordsList.appendChild(sessionDiv);
      });
  
      const totalDiv = document.createElement("div");
      totalDiv.innerHTML = `<strong>Total Duration: ${taskData.totalDuration}</strong>`;
      recordsList.appendChild(totalDiv);
  
      const clearBtn = document.createElement("button");
      clearBtn.textContent = "Clear Sessions";
      clearBtn.className = "clear";
      clearBtn.addEventListener("click", clearSessions);
      recordsList.appendChild(clearBtn);
  
      const completedBtn = document.createElement("button");
      completedBtn.textContent = "Mark as Completed";
      completedBtn.className = "completed";
      completedBtn.addEventListener("click", () => {
        if (confirm("Mark this task as completed?")) {
          taskData.completed = true;
          tasks[taskIndex] = taskData;
          localStorage.setItem("tasks", JSON.stringify(tasks));
  
          document.getElementById("start").disabled = true;
          document.getElementById("stop").disabled = true;
          document.getElementById("reset").disabled = true;
  
          alert("Task marked as completed. No further time tracking is allowed.");
          renderAllTaskSessions();
        }
      });
      recordsList.appendChild(completedBtn);
    }
  
    function clearSessions() {
      if (confirm("Clear all sessions for this task?")) {
        taskData.sessions = [];
        taskData.totalDuration = "00:00:00";
        tasks[taskIndex] = taskData;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        resetTimer();
        renderAllTaskSessions();
      }
    }
  
    document.getElementById("start").addEventListener("click", startTimer);
    document.getElementById("stop").addEventListener("click", stopTimer);
    document.getElementById("reset").addEventListener("click", resetTimer);
  });
  