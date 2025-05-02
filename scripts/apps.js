window.addEventListener("DOMContentLoaded",()=>{
    const taskName = sessionStorage.getItem("currentTaskNmae") ||
    "Unnamed Task";
    const taskTag = sessionStorage.getItem("currentTaskTag") || 
    "No Tag";
    document.getElementById("taskName").textContent = taskName;
    document.getElementById("taskTag").textContent = taskTag;
    let startTime;
    let intervalId;

    function updateElapsedTime() {
        const now = new Date();
        const diff = new Date(now - startTime);
        const h = String(diff.getUTCHours()).padStart(2,'0');
        const  m = String(diff.getUTCMinutes()).padStart(2,'0');
        const s = String(diff.getUTCSeconds()).padStart(2,'0');
        document.getElementById("elpasedTime").textContent = `${h}:${m}:${s}`;

    }
    document.getElementsById("start").addEventListener("click",()=>{
        const now = new Date();
        startTime = now;

        const startDateStr = now.toISOString().split("T")(0);
        const endDateStr = now.toTimeString().split("T")(0);
        document.getElementById("recordStartDate").textContent = 
        startDateStr;
        document.getElementById("recordStartTime").textContent = startTimeStr;
        document.getElementById("startTime").textContent = startTimeStr;
        intervalId = setInterval(updateElapsedTime,1000);
        document.getElementById("stop").disabled = false;
        document.getElementById("reset").disabled = false;
        document.getElementById("start").disabled = true;
    
    })
    document.getElementById("stop").addEventListener("click",()=>{
        clearInterval(intervalId);
        const endTime = new Date();
        const endTimeStr = endTime.toTimeString().split(" ")[0];
        documdnt.getElementById('endTime').textContent = endTimeStr;
        document.getElementById("recordEndTime").textContent = 
        endTimeStr;
        const diff = new Date(endTime - startTime);
        const h = String(diff.getUTCHours()).padStart(2,'0');
        const m = String(diff.getUTCMinutes()).padStart(2,'0');
        const s = String(diff.getUTCSeconds()).padStart(2,'0');
        const durationStr = `${h}:${m}:${s}`;
        document.getElementById("taskDurations").textContent = 
        durationStr;

        const record = {
            name : taskName,
            tag:taskTag,
            startDate : document.getElementById("recordStartDate").textContent,
            startTime : document.getElementById("recordStartTime").textContent,
            endTime : endTimeStr,
            duration:durationStr,
        };
        const task = JSON.parse(localStorage.getItem("allTasks")) || [];
        task.push(record);
        localStorage.setItem("allTasks",JSON.stringify(tasks));
        
        renderAllTasks();
        document.getElementById("stop").disabled = true;
    });
  
    document.getElementById("reset").addEventListener("click",()=>{
      clearInterval(intervalId);
      document.getElementById('elapsedTime').textContent = "00:00:00";
      document.getElementById('startTime').textContent = "--:--:--";
      document.getElementById('endTime').textContent = '--:--:--';
      document.getElementById('taskDuration').textContent = "--:--:--";
      document.getElementById('recordStartDate').textContent = '--:--:--';
      document.getElementById('recordStartTime').textContent = '--:--:--';
      document.getElementById('recordEndTime').textContent = '--:--:--';
      document.getElementById('taskName').value = "";
      document.getElementById('description').value = "";
      document.getElementById("taskTag").value = "";
      document.getElementById("start").disabled = false;
      document.getElementById("stop").disabled = true;
      document.getElementById("reset").disabled = true;

      document.getElementById("clearAll").addEventListener("click",()=>{
        sessionStorage.removeItem("allTasks");
        localStorage.removeItem("allTasks");
        location.reload();
      })
});
});
function renderAllTasks() {
    const tasks = JSON.parse(localStorage.getItem("allTasks")) || [];
    const timer2Container = document.createElement("h2");


    tasks.forEach(task=> {
       const taskEl = document.createElement("div");
        taskEl.classList.add("task-entry");
        taskEl.innerHTML = `
              <p><strong>TASK ${index+1}</strong></p>
              <p><strong>Task Name:</strong>${task.taskName}</p>
              <p><strong>Tag:</strong>${task.taskTag}</p>
              <p><strong>Start Date:</strong>${task.startDate}</p>
              <p><strong>Start Time:<strong>${task.startTime}</p>
              <p><strong>End Time:</strong>${task.taskEndTime}</p>
              <p><strong>Duration:</strong>${task.duration}</p>
              <hr>
            `
            timer2Container.appendChild(taskEl);
            document.getElementById("timer2List").appendChild(timer2Container);
    });
       renderAllTasks();
        
    }








