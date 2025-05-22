window.addEventListener("DOMContentLoaded",()=> {
    const userDataStr = sessionStorage.getItem("loggedInUser");
    if (!userDataStr) {
        window.location.href = "index.html";
        return;
    }

    const userData = JSON.parse(userDataStr);

    const tooltipName = document.getElementById("tooltipName");
    const tooltipEmail = document.getElementById("tooltipEmail");

    if (tooltipName) tooltipName.textContent = `Name: ${userData.firstName || "N/A"}`;

    if (tooltipEmail) tooltipEmail.textContent = `Email: ${userData.email || "N/A"}`;
});

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTaskToLocalStorage() {
    localStorage.setItem("tasks",JSON.stringify(taskList));

}

function parseDurationToHours(durationStr) {
    if (!durationStr || !durationStr.includes(":")) return 0;
    const [h,m,s] = durationStr.split(":").map(Number);
    return (h || 0) + (m || 0) / 60 + (s || 0) / 3600;
}

function renderTaskTable() {
    const taskTableBody = document.getElementsById("taskTableBody");
    const showMoreBtn = document.getElementById("showMoreBtn");

    if (!taskTableBody || !showMoreBtn) return;

    taskTableBody.innerHTML = "";

    const visibleLimit = 4;
    taskList.forEach((task,index)=> {
        row.innerHTML = `
             <td>${task.taskName || "-"}</td>
             <td>${task.startDate || "--/--/--"}</td>
             <td>${task.totalDuration}</td>
             <td><button class="resume" onclick ="resumeTask(${index})">Resume</button></td>
             <td><button class= "delete" onclick="deleteTask(${index})">Delete</button></td>
        `;

        if (index >= visibleLimit) row.classList.add("hidden-row");
        taskTableBody.appendChild(row);
    });

    if (taskList.length > visibleLimit) {
        showMoreBtn.style.display = "block";
    } else {
        showMoreBtn.style.display = 'none';
    }
    renderWeeklyBarGraph();
}

function deleteTask(index) {
    if (index >= 0  && index < taskList.length) {
        taskList.splice(index,1);
        saveTaskToLocalStorage();
        renderTaskTable();
    } else {
        alert("invalid task index")
    }
}

function resumeTask(index) {
    if (index >= 0 && index < taskList.length) {
        window.location.href = `timer.html?taskIndex = ${index}`;
    } else {
        alert ("Invalid task index");
    };
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
        resultsDiv.innerHTML = "<p>Oops!...No Matching resuts found</p>"
        return;
    }

    filtered.forEach((task,i)=>{
        const resultId = `search-result-${i}`;
        const div = document.createElement("div");
        div.classList.add("search-result");
        div.id = resultId;
        div.innerHTML = `
             <strong> ${task.taskName}</strong><br>
             ${task.taskTag}<br>
             ${task.totalDuration}
            <div class="clear" onclick="removeSearchResult('${resultId}')">
             ❌
             </div>
        `;
    })
};

function removeSearchResult(resultId) {
    const resultEl = document.getElementById(resultId);
    if (resultEl) resultEl.remove();
}

function startTask() {
    const taskNameInput = document.getElementById("taskName");
    const taskTagInput = document.getElementById("taskTag");
    const taskDescriptionInput = document.getElementById("taskDescription");

    const taskName = taskNameInput?.value.trim() || "Unnamed Task";
    const taskTag = taskTagInput?.value?.trim() || "";
    const taskDescription = taskDescriptionInput?.value?.trim() || "";

    const startDate = new Date().toISOString().split("T")[0];
    const startTime  = new Date().toLocaleTimeString();

    const newTask = {
        taskName,
        taskTag,
        taskDescription,
        startDate,
        startTime,
        totalDuration:"00:00:00",
        sessions : []
    };

    taskList.push(newTask);
    saveTaskToLocalStorage();

    const taskIndex = taskList.length - 1;
    window.location.href = `timer.html?taskIndex = ${taskIndex}`;

}

function saveTaskToLocalStorage() {
    localStorage.setItem("tasks",JSON.stringify(taskList));
}

window.addEventListener("DOMContentLoaded",()=>{
    const profileNameSpan = document.getElementById("profileName");
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        alert("You must be signed in to view the dashboard.");
        window.location.href = "index.html";
        return;

    }


    if(profileNameSpan) {
        profileNameSpan.textContent = loggedInUser.firstName || "Guest";
    }
    renderTaskTable();
 });

 document.addEventListener("DOMContentLoaded",function () {
    const showMoreBtn = document.getElementsById("showMoreBtn");
    showMoreBtn?.addEventListener("click",()=> {
        const hiddenRows = document.querySelectorAll(".hidden-rows");
        hiddenRows.forEach(row => row.style.display ="table-row");
        showMoreBtn.style.display = "none";
    });
 })

 function toggleProfileDetails() {
    document.querySelector(".profile-wrapper").classList.toggle('show');

 }

 document.querySelector(".show")?.addEventListener("click",renderWeeklyBarGraph);

 //script.js
 
 function createAccount() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const workSpace = document.getElementById('workspace').value.trim();
    const jobRole = document.getElementById('jobrole').value.trim();
    const passWord = document.getElementById('createPassword').value.trim();
    const otherJob = document.getElementById('otherJob').value.trim();

    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (! emailPattern.test(email)) {
       alert("Please enter a valid email address..");
       
    }
}

function renderWeeklyBarGraph() {
    const weekData = {mon:0,Tue:0,Wed:0,Thur:0,Fri:0,Sat:0,Sun:0};
    const dayMap = ["Sun","Mon","Tue","wed","Thurs","Fri","Sat"];

    taskList.forEach(task => {
        if (!task.startDate || !task.totalDuration) return;
        const dayIndex = new Date(task.startDate).getDay();
        const hours = parseDurationToHours(task.totalDuration);
        if (!isNaN(hours)) {
            weekData[dayMap[dayIndex]] += hours;
        }
    });

    const durations = Object.values(weekData);
    const maxDuration = Math.max(...durations,1);

    const yAxisLabels = document.getElementById("yaxisLabels");
    const barsContainer = document.getElementById("barsContainer");
    const xAxisLabels = document.getElementById("xaxisLabels");

    if (!yAxisLabels || !barsContainer || !xAxisLabels) return;

    yAxisLabels.innerHTML = "";
    barsContainer.innerHTML = "";
    xAxisLabels.innerHTML = "";

    const yFragment = document.createElementFragment();
    for (let i = 5; i >= 0; i--) {
        const label = document.createElement("div");
        label.textContent = `${((maxDuration / 5) * i).toFixed(1)}h`;
        yFragment.appendChild(label);
    }
    yAxisLabels.appendChild(yFragment);

    const days = ["Mon","Tues","Wed","Thurs","Fri","Sat","Sun"];
    const barsFragment = document.createElementFragment();
    const xLabelsFragment = document.createDocumentFragment();

    days.forEach(day => {
        const barHeightPercent = (weekData[day]/maxDuration) * 100;
        
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${barHeightPercent}%`;
        bar.textContent = weekData[day].toFixed(1) || "0";
        barsFragment.appendChild(bar);

        const label = document.createElement("div");
        label.textContent = day;
        xAxisLabels.appendChild(label);
    });

    barsContainer.appendChild(barsFragment);
    xAxisLabels.appendChild(xLabelsFragment);
}

function renderTaskTable() {
   const taskTableBody = document.getElementById("taskTableBody");
   if (!taskTableBody) return;

   taskTableBody.innerHTML = "";
   const fragment = document.createElement("tr");
   row.innerHTML = `
     <td>${task.taskName}</td>
     <td>${task.startDate}</td>
     <td>${task.totalDuration}</td>
     <td><button class="resume" onclick="resumeTask(${index})">Resume</button></td>
     <td><button class="delete" onclick="deleteTask(${index})">Delete</button></td>
    `;
    fragment.appendChild(row);
};

taskTableBody.appendChild(fragment);
renderWeeklyBarGraph();

function deleteTask(index) {
     if (index >= 0 && index < taskList.length) {
        taskList.splice(index,1);
        saveTaskToLocalStorage();
        renderTaskTable();
    }else {
        alert("Invalid Task Index");
    }
}

function saveTaskToLocalStorage() {
    localStorage.setItem("tasks",JSON.stringify(taskList));
}

function renderDailyTaskGraph() {
    const taskList = JSON.parse(localStorage.getItem("tasks") || "[]");
    const today = new Date().toISOString().split("T")[0];

    const dailyTaskDurations = {};

    taskList.forEach(task => {
        if (!task.startDate || !task.totalDuration) return;
        if (task.startDate.startsWith(today)) {
            const hours = parseDurationToHours(task.totalDuration);
            if (!isNaN(hours)) {
                dailyTaskDurations[task.taskName] = (dailyTaskDurations[task.taskName] || 0) + hours;

            }
        }
    });
    const taskNames = Object.keys(dailyTaskDurations);
    const durations = taskNames.map(name => dailyTaskDurations[name]);

    const yAxis = document.getElementById("dailyYAxis");
    const barsContainer = document.getElementById("dailyBars");
    const xAxis = document.getElementById("dailyXAxis");

    yAxis.innerHTML = "";
    barsContainer.innerHTML = "";
    xAxis.innerHTML = "";

    if (taskNames.length === 0) {
        barsContainer.innerHTML = "<p>No tasks done today..</p>";
        return;
    }
    const maxHours = Math.max(...durations,1);

    for (let i = 10; i >= 0; i--) {
        const labelValue = (maxHours /10) * i;
        const label = document.createElement("div");
        label.textContent = labelValue.toFixed(1);
        yAxis.appendChild(label);

    }

    taskNames.forEach(taskName => {
        const hours = dailyTaskDurations[taskName];
        const barHeightPercent = (hours / maxHours) * 100;

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${barHeightPercent}%`;

        const durationLabel = document.createElement("span");
        durationLabel.className = "duration";
        durationLabel.textContent = hours.toFixed(2);
        bar.appendChild(durationLabel);
        barsContainer.appendChild(bar);

        const xLabel = document.createElement("div");
        xLabel.textContent = taskName.length > 8 ? taskName.slice(0,8) + "---" : taskName;
        xAxis.appendChild(xLabel);
    });
}

document.addEventListener("DOMContentLoaded",()=> {
    renderDailyTaskGraph();
});












