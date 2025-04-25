let taskTimers = {};
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];

taskList.forEach(task=>addToTable(task));
Chart.register();

function generateTaskId() {
    return `task-${Date.now()}`

    document.getElementById('')
}

window.onload = function () {
    const taskData = JSON.parse(sessionStorage.getItem("selectedTask"));

    if (!taskData) {
        alert("No task data found!");
        window.location.href = "track.html";
        return;
    }

    // Destructure task data
    const { taskName, taskTag, description, startTime, endTime, duration } = taskData;

    // Format dates
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Display data
    document.getElementById("taskName").textContent = taskName || 'N/A';
    document.getElementById("taskTag").textContent = taskTag || 'No tag';
    document.getElementById("taskDescription").textContent = description || 'No description';
    document.getElementById("startDate").textContent = startDate.toLocaleDateString();
    document.getElementById("startTime").textContent = startDate.toLocaleTimeString();
    document.getElementById("endDate").textContent = endDate.toLocaleDateString();
    document.getElementById("endTime").textContent = endDate.toLocaleTimeString();
    document.getElementById("taskDuration").textContent = duration || '0';

    // Resume button click handler
    document.getElementById("resumeTaskBtn").onclick = function () {
        const resumedTask = {
            taskName,
            description,
            taskTag,
            startTime: new Date().toISOString(),
            isResumed: true
        };
        sessionStorage.setItem("resumedTask", JSON.stringify(resumedTask));
        window.location.href = "track.html";
    };
};

// <button id={"resumeTaskBtn">Resume</button>
// <script src="details.js" defer></script>

window.onload = function() {
    const {taskName , taskTag,description,startTime,endTime,endDate,duration} = tasksData;

    const startDate = new Date()

}