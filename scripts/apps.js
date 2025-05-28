window.addEventListener('DOMContentLoaded',()=> {
   const userDataStr = sessionStorage.getItem("loggedInUser");
   if (!userDataStr) {
    window.location.href = "index.html";
    return;
   }
  const userData = JSON.parse(userDataStr);

  const tooltipName = document.getElementById("tooltipName");
  const tooltipEmail = document.getElementById('tooltipEmail');
  const tooltipWorkSpace = document.getElementById("tooltipWorkSpace");
  
  if (tooltipName) tooltipName.textContent = `Name:${userData.firstName || "N/A"}`;
  if (tooltipEmail) tooltipEmail.textContent = `Name:${userData.email || "N/A"}`;
  if (tooltipWorkSpace) tooltipWorkSpace.textContent = `WorkSpace:${userData.workSpace || "N/A"}`;

});

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTaskToLocalStorage() {
  localStorage.setItem("tasks",JSON.stringify(taskList)); 
}

function parseDurationToHours(durationStr) {
    if (!durationStr || !durationStr.includes(":")) return 0;
     cosnt [h,m,s] = durationStr.split(":").map(Number);
     return (h || 0) + (m || 0) /60 + (s || 0) / 3600;
}

function startTask() {
   const taskName = document.getElementById("taskName").value.trim();
   const taskTag = document.getElementById("taskTag").value.trim();

   if(!taskName || !taskTag) {
       alert("⚠️ Please enter both the Task Name and Task Tag before tracking your time.") 
        return;
      }
    const description = document.getElementById("description").value.trim();
    const startTime = new Date(); 

    const task = {
        name : taskName,
        tag:taskTag,
        description:description,
        startTime:startTime.toISOString();
        sessions:[];
    };

    sessionStorage.setItem("currentTask",JSON.stringify(task));
    window.location.href= "timer.html";
}

function renderTaskTable() {
  const taskTableBody = document.getElementById("taskTableBody");
  const showMoreBtn = document.getElementById("showMoreBtn");

}


