let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

const taskNameInput= document.getElementById('taskName');
const taskTagInput = document.getElementById('taskTag');
const descriptionInput = document.getElementById('description');
const trackButton = document.querySelector(".track");
const taskTableBody =document.querySelector('#tasktable tbody');

function saveTaskToLocalStorage() {
    localStorage.setItem('tasks',JSON.stringify(taskList));
}

function renderTaskTable() {
    taskTableBody.innerHTML = '';
    taskList.foreach((task,index)=>{
        const row = document.createElement("tr");
        row.innerHTML = `
               <td>${task.taskName}</td>
               <td>${task.taskTag}</td>
               <td>${task.duration}</td>
               <td>
                   <button class="resume" onclick="resumeTask(${index})">Resume</button>
               </td>
        `;
        taskTableBody.appendChild(row);
    });
};

trackButton.addEventListener('click',function () {
     const taskName = taskNameInput.value.trim();
     const taskTag = taskTagInput.value.trim();
     const description = descriptionInput.value.trim();

     if(taskName && taskTag && description) {
        const taskData = {
            taskName,
            taskTag,
            description,
            startDate:new Date().toLocaleString(),
            sessions : [],
            totalDuration:"00:00:00"
        };
        taskList.push(taskData);
        saveTaskToLocalStorage();
        window.location.href = `timer.html?taskIndex = ${taskList.length - 1}`;
     }else {
        alert("Please fill in all the fields");
     }
});

function resumeTask(index) {
    window.location.href = `timer.html?taskIndex=${index}`;
}
document.addEventListener("DOMContentLoaded",renderTaskTable);