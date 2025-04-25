function createAccount() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
    const email     = document.getElementById('email').value.trim(); 
    const workSpace = document.getElementById('workspace').value.trim();
    const jobRole   = document.getElementById('jobrole').value;
    const passWord  = document.getElementById('createpassword').value.trim();
    const otherJob  = document.getElementById('otherjob').value.trim();

    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(passWord)) {
        alert("Password must be at least 8 characters and include:\n" +
              "• one uppercase letter\n" +
              "• one lowercase letter\n" +
              "• one number\n" +
              "• one special character");
        return;
    }

    // ——— Required fields
    if (!firstName || !jobRole) {
        alert("Please fill all the required fields.");
        return;
    }

    const userName = firstName.toLowerCase();
    if (localStorage.getItem(userName)) {
        alert(`Account already exists. Please sign in.\nYour username: ${userName}`);
        return;
    }

    const finalJob = jobRole === "other" ? otherJob : jobRole;
    const user = { firstName, lastName, email, workSpace, jobRole: finalJob, passWord };

    localStorage.setItem(userName, JSON.stringify(user));
    alert("Account created successfully! Please sign in.");
}
// detail.js
window.onload = function () {
    const taskData = JSON.parse(sessionStorage.getItem("selectedTask"));

    if (taskData) {
        const { taskName, taskTag, description, startTime, endTime, duration } = taskData;

        const startDate = new Date(startTime); 
        const endDate = new Date(endTime); 

        document.getElementById("taskName").textContent = taskName || 'N/A';
        document.getElementById("taskTag").textContent = taskTag || 'No tag';
        document.getElementById("taskDescription").textContent = description || 'No description';
        document.getElementById("startDate").textContent = startDate.toLocaleDateString();
        document.getElementById("startTime").textContent = startDate.toLocaleTimeString();
        document.getElementById("endDate").textContent = endDate.toLocaleDateString();
        document.getElementById("endTime").textContent = endDate.toLocaleTimeString();
        document.getElementById("taskDuration").textContent = duration || '0';

        

        document.getElementById("resumeTaskBtn").onclick = function () {
            
            const selectedTask = JSON.parse(sessionStorage.getItem("selectedTask"));
        
            if (!selectedTask) {
                alert("No task selected to resume.");
                return;
            }
        
            const resumedTask = {
                taskName: selectedTask.taskName || "Untitled Task",
                description: selectedTask.description || "",
                taskTag: selectedTask.taskTag || "",
                startTime: new Date().toISOString(),
                isResumed: true
            };
        
            sessionStorage.setItem("resumedTask", JSON.stringify(resumedTask));
            window.location.href = "track.html";
        };
        
        document.getElementById("resumeTaskBtn").onclick = function () {
            const resumedTask = {
                taskName,
                description,
                taskTag,
                startTime: new Date().toISOString(), // fresh start time
                isResumed: true
            };
            sessionStorage.setItem("resumedTask", JSON.stringify(resumedTask));
            window.location.href = "index.html";
        };
    } else {
        alert("No task data found!");
        window.location.href = "index.html";
    }
};

// track.js
window.onload = function () {
    const resumedTask = JSON.parse(sessionStorage.getItem("resumedTask"));

    if (resumedTask && resumedTask.isResumed) {
        const { taskName, description, taskTag, startTime } = resumedTask;
        const taskId = `resumed-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const interval = setInterval(() => {
            const now = new Date();
            const passedTime = Math.floor((now - new Date(startTime)) / 1000);
            const minutes = Math.floor(passedTime / 60);
            const seconds = passedTime % 60;
            const timeString = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
            document.title = `🕛 ${timeString}-Tracking-${taskName}`;
        }, 1000);

        taskTimers[taskId] = { taskName, description, taskTag, startTime, interval };

        const taskBtn = document.createElement("button");
        taskBtn.textContent = `STOP ${taskName}`;
        taskBtn.classList.add("stop");
        taskBtn.dataset.taskId = taskId;
        taskBtn.onclick = () => stopTask(taskId);
        document.getElementById("activeTasks").appendChild(taskBtn);

        sessionStorage.removeItem("resumedTask"); // clean up
    }
};
