window.onload = function () {
   const taskData = JSON.parse(sessionStorage.getItem("selectedTask"));

   if(!taskData) {
       alert("No task data found!");
       window.location.href= 'track.html';
       return;
   }

   const {taskName,taskTag,description,startTime,endTime,duration} = taskData;

   const startDate = new Date(startTime);
   const endDate = new Date(endTime);

   document.getElementById('taskName').textContent =taskName || 'N/A';
   document.getElementById('taskTag').textContent = taskTag || 'No tag';
   document.getElementById('taskDescription').textContent = description || 'No Description';
   document.getElementById('startDate').textContent = startDate.toLocaleDateString();
   document.getElementById('endDate').textContent = endDate.toLocaleDateString();
   document.getElementById('startTime').textContent = startDate.toLocaleTimeString();
   document.getElementById('endTime').textContent = endDate.toLocaleTimeString();
   document.getElementById('taskDuration').textContent = duration || '0';


document.getElementById('resumeTaskBtn').onclick = function () 
   {
        const resumedTask = {
            taskName,
            description,
            taskTag,
            startTime,
            isResumed:true
        };
        sessionStorage.setItem('resumedTask',JSON.stringify(resumedTask));
        window.location.href= "track.html"

    };
};

