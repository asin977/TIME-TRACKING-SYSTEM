let taskTimers = {};
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
taskList.forEach(task => addToTable(task));
Chart.register();

