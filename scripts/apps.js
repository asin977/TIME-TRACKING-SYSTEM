window.addEventListener("DOMContentLoaded",()=> {
  const userDataStr = sessionStorage.getItem('loogedInUser');
  if (!userDataStr) {
    window.location.href = "index.html";
    return;
  }
  const userData = JSON.parse(userDataStr);

  const tooltipName = document.getElementById('tooltipName');
  const tooltipEmail = document.getElementById('tooltipEmail');
  const tooltipWorkSpace = document.getElementById('tooltipworkSpace');

  if (tooltipName) tooltipName.textContent = `Name : ${userData.firstName || "N/A"}`;
  if (tooltipEmail) tooltipEmail.textContent = `Email:${userData.firstName || "N/A"}`;
  if (tooltipWorkSpace) tooltipWorkSpace.textContent = `WorkSpace:${userData.workSpace || "N/A"}`;

});

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTaskToLocalStorage() {
  localStorage.setItem("tasks",JSON.stringify(taskList));
}

function parseDurationToHours(durationStr) {
  if (!durationStr || !durationStr.includes(":")) return 0;
  const [h,m,s] = durationStr.split(":").map(Number);
  return (h || 0) + (m || 0)/ 60 + (s || 0)/3600;

}

function startTask() {
  const taskName = document.getElementById("taskName").value.trim();
  const taskTag = document.getElementById("taskTag").value.trim();

  if (!taskName || !taskTag) {
    alert("Please enter both the Task Name and Task Tag before tracking your time");
    return;
  }
  const description = document.getElementById("description").value.trim();
  const startTime = new Date();

  const task = {
    name : taskName,
    tag : taskTag,
    description:description,
    startTime:startTime.toISOString(),
    sessions:[];
  };

  sessionStorage.setItem("currentTask",JSON.stringify(task));
  window.location.href = "timer.html";

}

function renderWeeklyBarGraph() {
  const weekData = {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0};
  const dayMap = ["sun","Mon","Tue","Wed","Thur","Fri","Sat"];

  taskList.forEach(task => {
    if(!task.startDate || !task.totalDuration) return;
    const hours = parseDurationToHours(task.totalDuration);
    if (!isNaN(hours)) {
      const dayIndex = new Date(task.startDate).getDay();
      weekData[dayMap[dayIndex]] += hours;
    }
  });

  const durations = Object.values(weekData);
  const maxDuration = Math.max(...durations,1);

  const yAxisLabels = document.getElementById("yAxisLabels");
  const barsContainer = document.getElementById("barContainer");
  const xAxisLabels = document.getElementById("xAxisLabels");

  if (!yAxisLabels || !barsContainer || !xAxisLabels) return;

  yAxisLabels.innerHTML = "";
  barsContainer.innerHTML = "";
  xAxisLabels.innerHTML = "";

  for (let i = 5; i >= 0;i--) {
    const label = document.createElement("div");
    const value = ((maxDuration / 5) * 1).toFixed(1);
    label.textContent = `${value}h`;
    yAxisLabels.appendChild(label);
  }

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  days.forEach(day => {
    const barHeightPercent = (weekData[day]/ maxDuration)*100;

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${barHeightPercent}%`;
    bar.textContent = weekData[day] ? weekData[day].toFixed(1) : "0.0";
    barsContainer.appendChild(bar);

    const label = document.createElement("div");
    label.textContent = day;
    xAxisLabels.appendChild(label);
  });

  const totalHours = durations.reduce((a,b)=> a+b,0).toFixed(1);
  const totalBadge = document.getElementById("totalHoursBadge");
  if(totalBadge) totalBadge.textContent = `Total:${totalHours}h this week`;

}

function renderTaskTable() {
  const taskTableBody = document.getElementById("taskTableBody");
  const showMoreBtn = document.getElementById("showMorebtn");
   
  if(!taskTableBody || !showMoreBtn) return;

  taskTableBody.innerHTML = "";

  const visibleLimit = 4;
  taskList.forEach((task,index)=> {
    const row = document.createElement("tr");
    row.id = `taskRow-${index}`;
    row.innerHTML = `
         <td class="taskNameCell" id ="taskNameCell-${index}">${task.taskName || "-"}</td>
         <td>${task.startDate || "--/--/----"}</td>
         <td>${task.totalDuration || "00:00:00"}</td>
         <td>
           <div class="more" id="actionBtns-${index}">
              <button class="resume" onclick="resumeTask(${index})">Resume</button>
              <button class="edit" onclick="editTask(${index})">Edit</button>
              <button class="delete" onclick="deleteTask(${index})">Delete</button>
           </div>
         </td>
      `;

      if (index >= visibleLimit) row.classList.add("hidden-row");
      taskTableBody.appendChild(row);
  });

  if (taskList.length > visibleLimit) {
    showMoreBtn.style.display = "block";
    showMoreBtn.textContent = "Show More";
  } else {
    showMoreBtn.style.display = "none";
  }
   
}

function toggleEditButtons(index) {
  const btnContainer = document.getElementById(`actionBtns-${index}`);
  const nameCell = document.getElementById(`taskNameCell-${index}`);
  if (!btnContainer || !nameCell) return;

  const isEditing = btnContainer.querySelector(".save");
  if (isEditing) {
     nameCell.textContent = taskList[index].taskName || +"-";
     btnContainer.innerHTML = `
           <button class="resume" onclick="resumeTask(${index})">Resume</button>
           <button class="edit" onclick="toggleEditButton(${index})">Edit</button>
           <button class="delete" onclick="deleteTask(${index})"></button>
     `;
  } else {
    nameCell.innerHTML = `<input type = "text" id="editTaskName-${index}" value="${taskList[index].taskName || ""}"/>`;
    btnContainer.innerHTML = `
        <button class="save" onclick="saveTask(${index})"></button>
        <button class="cancel" onclick="toggleEditButton(${index})">Cancel</button>
    `;
  }
}

function saveTask(index) {
  const editedNameInput = document.getElementById(`editTaskName-${index}`);
  if (!editedNameInput) return;

  const newName = editedNameInput.value.trim();

  if (newName) {
    taskList[index].taskName = newName;
  }
  renderTaskTable();
}

