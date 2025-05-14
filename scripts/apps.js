// track.js

window.addEventListener("DOMContentLoaded",()=> {
    const profileNameSpan = document.getElementById("profileName");
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (loggedInUser && loggedInUser.firstName) {
        profileNameSpan.textContent = loggedInUser.firstName;
    }else {
        profileNameSpan.textContent = "Guest";
    }
});

window.addEventListener("DOMContentLoaded",()=> {
    const profileNameSpan = document.getElementById("profileName");
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if(!loggedInUser) {
        alert("You must be signed in to view the dashboard.");
        window.location.href = "index.html";
        return;
    }
    profileNameSpan.textContent = loggedInUser.firstName;
});

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
const taskTableBody = document.getElementById("taskTableBody");

function saveTaskToLocalStorage() {
    localStorage.setItem("tasks",JSON.stringify(taskList));
};

function renderTaskTable() {
    taskTableBody.innerHTML = "";
    taskList.forEach((task,index)=> {
        const row = document.createElement("tr");
        row.innerHTML = `
             <td>${task.taskName}</td>
             <td>${task.startDate || "--/--/----"}</td>
             <td>${task.totalDurtaion}</td>
             <td><button class="resume" onclick="resumeTask(${index})"><button>Resume</td>
        `;
        taskTableBody.appendChild(row);
    });
}

function startTask() {
    const taskName = document.getElementById("taskName").value.trim();
    const taskTag = document.getElementById("taskTag").value.trim();
    const description = document.getElementById('description').value.trim();

    if(taskName && taskTag && description) {
        const taskData = {
            taskName,
            taskTag,
            description,
            startDate : new Date().toLocaleDateString();
            sessions : [],
            totalDurtaion : "00:00:00"
        };
        taskList.push(taskData);
        saveTaskToLocalStorage();
        window.location.href = `timer.html?taskIndex = ${taskList.length - 1}`;
    }else {
        alert("Please fill in all fields");
    }
}

function resumeTask(index) {
     window.location.href = `timer.html?taskIndex = ${index}`;
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
    const resultsDiv = document.getElementById("searchResutls");
    resultsDiv.innerHTML = "";

    const filtered = taskList.filter(task => 
        task.taskName.toLowerCase().includes(query) || 
        task.taskTag.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        resultsDiv.innerHTML = "<p>Oops!...No matching tasks found.</p>"
        return;
    }
    
    filtered.forEach((task,i)=> {
        const resultId = `search-result-${i}`;
        const div = document.createElement("div");
        div.classList.add("search-result");
        div.id = resultId;
        div.innerHTML = `
             <strong>${task.taskName}</strong><br>
             ${task.taskTag}<br>
             ${task.totalDurtaion}
             <div class="clear" onclick="removeSearchResult(`${resultsId}`)">
        `;
        resultsDiv.appendChild(div);
    });
}

function removeSearchResult(resultId) {
    const resultEl = document.getElementById(resultId);
    if(resultEl) {
        resultEl.remove();
    };
};

//TIMER.JS

document.addEventListener("DOMContentLoaded",()=> {
    const urlParams = new URLSearchParams(window.location.search);
    const taskIndex = parseInt(urlParams.get("taskIndex"),10);
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length || !tasks[taskIndex]) {
        alert("Task not found");
        window.location.href = "track.html";
        return;
    }

    const taskData = tasks[taskIndex];
    const elapsedTimeEl = document.getElementById("elpasedTime");
    const startTimeEl = document.getElementById("startTime");
    const endTimeEl = document.getElementById("endTime");
    const recordsList = document.getElementById("recordsList");

    document.getElementById("taskName").textContent = taskData.taskName;
    document.getElementById("taskTag").textContent = taskData.taskTag || "";
    document.getElementById("taskDescription").textContent= taskData.description || '';

    if(!taskData.sessions) taskData.sessions = [];
    if(!taskData.totalDurtaion)taskData.totalDurtaion = "00:00:00";
    
    let startTime;
    let timerInterval;

    renderAllTaskSessions();
    resetTimer();

    function timeFormatting(sec) {
        const h = String(Math.floor(sec / 3600)).padStart(2,"0");
        const m = String(Math.floor(sec % 3600)/60).padStart(2,"0");
        const s = String(sec % 60).padStart(2,"0");
        return `${h}:${m}:${s}`;
    };

    function startTimer() {
        startTime = new Date();
        const startTimeStr = startTime.toLocaleTimeString();.
        startTimeEl.textContent = startTimeStr;
    
        document.getElementById("start").disabled = true;
        document.getElementById("stop").disabled = false;
        document.getElementById("reset").disabled = false;
    
        timerInterval = setInterval(()=> {
            const now = new Date();
            const diff = Math.floor((now - startTime)/1000);
            elapsedTimeEl.textContent = timeFormatting(diff)
        },1000);
    };
    
    function stopTimer() {
        clearInterval(timerInterval);
    
        const endTime = new Date();
        const diff = Math.floor((now-startTime)/1000);
        elapsedTimeEl.textContent = timeFormatting(diff)
        
        const session = {
            startDate:taskData.startDate || new Date().toLocaleTimeString(),
            startTime:startTime.toLocaleTimeString(),
            endDate : endTime.toLocaleDatesString(),
            endTime:endTime.toLocaleTimeString(),
            duration:durationStr
        };
        taskData.sessions.push(session);
        let totalSeconds = 0;
        taskData.sessions.forEach(sess => {
            const [h,m,s] = sess.duration.split(":").map(Number);
            totalSeconds += h * 3600 + m * 60 + s;
        });

        taskData.totalDurtaion = timeFormatting(totalSeconds);
        endTimeEl.textContent = session.endTime;
        elapsedTimeEl.textContent = durationStr;

        tasks[taskIndex] = taskData;
        localStorage.setItem("tasks",JSON.stringify(tasks));

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
             <p><strong>Task Name:</strong><span id ="taskName">${taskData.taskName}</span></p>
             <p><strong>Task Tag:<span id ="taskTag">${taskData.taskTag}</span></strong></p>
             <p><strong>Task Description:<span id="taskdescription">${taskData.description}</span></strong></p>
             <hr>
             <p><strong>Task Description:</strong><span>${taskData.description}</span></p>
             <hr>
        `;

        if(taskData.sessions.length === 0) {
            recordsList.innerHTML += `<p>No sessions recorded yet..</p>`
            return;
        }

        taskData.sessions.forEach((s,i)=> {
            const sessionDiv = document.createElement("div");
            sessionDiv.className = "record";
            sessionDiv.innerHTML = `
                  <div class = "head"<strong class="strong">TIMER  ${i + 1}</strong></div>
            <div class="session">
                 <strong class="one">Session ${i + 1}</strong><br>
                 Start:${s.startTime} (${s.startDate})<br>
                 End:${s.endTime} (${s.endDate})<br>
                 Duration:${s.duration}<br><br>
            </div>     
        `;
        recordsList.appendChild(sessionDiv);
        });
        const totalDiv = document.createElement("div");
        totalDiv.innerHTML = `<strong>Toatal Duration:${taskData.totalDurtaion}</strong>`;
        recordsList.appendChild(totalDiv);

        const clearBtn = document.createElement("button");
        clearBtn.textContent = 'clear Sessions';
        clearBtn.className = "clear";
        clearBtn.addEventListener("click",clearSessions);
        recordsList.appendChild(clearBtn);
    };
   
    function clearSessions() {
        if(confirm("Clear all sessions for this task?")) {
            taskData.sessions = [];
            taskData.totalDurtaion = "00:00:00";
            tasks[taskIndex] = taskData;
            localStorage.setItem("tasks",JSON.stringify(tasks));
            resetTimer();
            renderAllTaskSessions();

        }
    }
    document.getElementById("start").addEventListener("click",startTimer);
    document.getElementById("stop").addEventListener("click",stopTimer);
    document.getElementById("reset").addEventListener("click",resetTimer);
});


