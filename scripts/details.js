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
    } else {
        alert("No task data found!");
        window.location.href = "index.html";
    }
};