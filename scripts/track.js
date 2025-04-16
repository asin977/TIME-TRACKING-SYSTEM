    let startTime = null;
    let timerInterval;
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

    taskList.forEach(task=> addToTable(task));
    Chart.register();

    function startTask() {
        const taskName = document.getElementById('taskName').value.trim();
        const taskDate = document.getElementById('taskDate').value;

        if(!taskName || !taskDate) {
            alert("Please enter the task and date before you START");
            return;
        }
        startTime = new Date();
        timerInterval = setInterval(()=>{
                const now = new Date();
                const passedTime = Math.floor((now - startTime)/1000);
                const minutes = Math.floor(passedTime / 60);
                const seconds = passedTime % 60;

                const timeString = `${minutes}:${seconds < 10 ? '0' : ""}${seconds}`;

                document.title = `🕛 ${timeString} - Tracking..`;

        },1000);
    }

    function endTask() {
        if (!startTime) {
            alert("You must click START before stopping.");
            return;
        }

        clearInterval(timerInterval);
        document.title = "TIME TRACKER DASHBOARD";
        

        const endTime = new Date();
        const duration = ((endTime - startTime) / 60000).toFixed(2);

        const taskName = document.getElementById('taskName').value.trim();
        const taskDate = document.getElementById('taskDate').value;

        if (!taskName || !taskDate) {
            alert("Please fill out the Task and Date.");
            return;
        }

        const task = {
            taskName,
            taskDate,
            duration
        };

        taskList.push(task);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        addToTable(task);
        resetForm();
    }

    function addToTable(task) {
        const tbody = document.querySelector("#tasktable tbody");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.taskName}</td>
            <td>${task.taskDate}</td>
            <td>${task.duration}</td>
        `;
        tbody.appendChild(row);
    }

    function resetForm() {
        document.getElementById('taskName').value ="";
        document.getElementById('taskDate').value = "";
        document.getElementById('description').value = "";
        startTime = null;
    }

    function resetTask() {
        if (confirm("Are you sure? Do you want to reset all the tasks?")) {
        localStorage.removeItem("tasks");
        taskList = [];
        document.querySelector('#tasktable tbody').innerHTML = "";
        resetForm();
        dailyChartStatus()
            }
    }

    function dailyChartStatus() {
        const today = new Date().toISOString().split('T')[0];
        const dailyTasks = taskList.filter(task=>task.taskDate === today);

        const taskDurations= {};
        dailyTasks.forEach(task=> {
            if(!taskDurations[task.taskName]) {
                taskDurations[task.taskName] = 0;
            }
            taskDurations[task.taskName] += parseFloat(task.duration);
        });

        const ctx = document.getElementById('dailyChart').getContext('2d');

        if(window.dailyChart instanceof Chart) {
            window.dailyChart.destroy();
        }

        const dataValues = Object.values(taskDurations);
        const dataLabels = Object.keys(taskDurations);
        const totalMinutesInDay = 1440;

        window.dailyChart = new Chart(ctx, {
            type:'pie',
            data : {
                labels : dataLabels,
                datasets: [{
                    label:"Today's Time Spent on Tasks",
                    data:dataValues,
                    backgroundColor:[
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#66ff66', '#cc66ff'
                    ]
                }]
            },
            options: {
                responsive : true,
                plugins:{
                    title:{
                        display:true,
                        text:"Today's Task Summary (Pie Chart - 24hr View)"
                    },
                    tooltip: {
                        enabled : true,
                        callbacks : {
                            label : function (context) {
                                const value = context.raw;
                                const hours = (value / 60).toFixed(2);
                                const percentage = ((value/totalMinutesInDay)*100).toFixed(1);
                                return `${context.label}: ${hours} hrs (${percentage}%)`;
                            }
                        }
                    },
                    datalabels : {
                       display:false
                    }
                }
            },
            plugins: []
        });

    }

    function weeklyChartStatus() {
            const recentTasks = taskList.filter(task => {
            const date = new Date(task.taskDate);
            const now = new Date();
            const diffDays = (now - date) / (1000 * 3600 * 24);
            return diffDays <= 7;
        });

        const taskDurations = {};
        recentTasks.forEach(task => {
            if (!taskDurations[task.taskName]) {
                taskDurations[task.taskName] = 0;
            }
            taskDurations[task.taskName] += parseFloat(task.duration);  
        });

        const labels = Object.keys(taskDurations);
        const dataValues = Object.values(taskDurations);
        const totalMinutes = dataValues.reduce((acc,value)=> acc + value, 0);
       
        const ctx = document.getElementById('weeklyChart').getContext('2d');

        if (window.weeklyChart instanceof Chart) {
            window.weeklyChart.destroy();
        }
        
        window.weeklyChart = new Chart(ctx, {
            type :'pie',
            data :{
                labels : labels,
                datasets : [{
                    label : "Time Spent on Tasks (Last 7 days)",
                    data:dataValues,
                    backgroundColor:[
                        
                            "#0D1B2A",
                            "#1B263B", 
                            "#3A0CA3", 
                            "#6A040F", 
                            "#370617", 
                            "#2C003E", 
                            "#144552", 
                            "#1B4332",
                            "#500073",
                            "#AE445A",
                            "#CD1818" 
                        ]
                }]
            },
            options : {
                responsive : true,
                plugins : {
                    title:{
                        display:true,
                        text:"Weekly Task Summary (Pie Chart)"
                    },
                    tooltip : {
                        callbacks : {
                            label : function (context) {
                                const value = context.raw;
                                const hours = (value / 60).toFixed(2);
                                const percentage = ((value / totalMinutes)*100).toFixed(1);
                                return `${context.label}: ${hours} hrs (${percentage}%)`;
                            }
                        }
                    },
                    datalabels : {
                        display : false
                        
                    }
                }
            },
            plugins : []
        });
       
    }

    document.querySelector('.start').addEventListener('click', startTask);
    document.querySelector('.stop').addEventListener('click', endTask);
    document.querySelector('.reset').addEventListener('click',resetTask);
    document.getElementById('showDailyStatus').addEventListener('click', dailyChartStatus);
    document.getElementById('weeklyCharts').addEventListener('click',weeklyChartStatus);
        

