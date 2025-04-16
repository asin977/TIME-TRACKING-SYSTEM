function createAccount() {
    const firstName = document.getElementById('firstName').value.trim();
    
    const lastName = document.getElementById('lastName').value.trim();
    const mailId = document.getElementById('email').value.trim();
    const workSpace = document.getElementById('workspace').value.trim();
    const jobRole = document.getElementById('jobRole').value;
    
    const passWord = document.getElementById('createPassword').value.trim();
    const otherJob = document.getElementById('otherJob').value.trim();

    if(!firstName || !mailId || !passWord || !jobRole) {
         alert("Please fill all the required fields.");
         return;
    }

    const userName = firstName.toLowerCase();
    const existingUser = localStorage.getItem(userName);

    if(existingUser) {
        alert("You have already created an account.Please Sign-In.");
        return;
    }

    const finalJob = jobRole === "other" ? otherJob : jobRole;

    const user = {
        firstName,
        lastName,
        mailId,
        workSpace,
        jobRole:finalJob,
        passWord
    };
    localStorage.setItem(userName,JSON.stringify(user));
    alert("Account Created Successfully!.");
}
function signIn() {
   const loginFirstName = document.getElementById('loginFirstName').value.trim().toLowerCase();
   const loginPassword = document.getElementById('loginPassword').value;

   const storedUser = JSON.parse(localStorage.getItem(loginFirstName));

   if (storedUser &&  storedUser.passWord === loginPassword) {
      alert(`Welcome   ,${storedUser.firstName}...!\nWorkspace: ${storedUser.workSpace|| "N/A"}\nRole: ${storedUser.jobRole || "N/A"}`);
   }else {
    alert("Invalid username or password.");
   }
}

const createAccounts = document.getElementById('account');
createAccounts.addEventListener('click',createAccount);
const signIns = document.getElementById('signIn');
signIns.addEventListener('click',signIn);

function toggleOtherJob() {
    const jobSelect = document.getElementById('jobRole');
    const otherInput = document.getElementById('otherJob');
    if(jobSelect.value==='Other') {
        otherInput.classList.remove("hidden");
    } else {
        otherInput.classList.add('hidden');
    }
}
// Toggle password visibility


function dailyChartStatus() {
    const today = new Date().toISOString.split('T')[0];
    const dailyTasks = taskList.filter(task=>task.taskDate === today);

    const taskDurations = {};
    dailyTasks.forEach(task=>{
        if(!taskDurations[task.taskName]) {
            taskDurations[task.taskName] = 0;
        }
        taskDurations[task.taskName] += parseFloat(task.duration);
        
    });  
    const ctx = document.getElementById('daliyChart').getContext('2d');

    if(window.daliyChart instanceof Chart) {
        window.daliyChart.destroy();
    }
    const dataValues = Object.values(taskDurations);
    const dataLabels = Object.keys(taskDurations);
    const total = dataValues.reduce((acc,value)=> acc + value,0 );

    window.daliyChart = new Chart(ctx, {
        type:'pie',
        data : {
            labels:dataLabels,
            datasets : [{
                label : "Today's Time Spent on Tasks",
                data : dataValues,
                backgroundColor : [
                    'red','blue','pink','orange','brown',
                    'yellow','green','purple'
                ]
            }]
        },
        options:{
            repsonsive : true,
            plugins:{
                title:{
                    display:true,
                    text:"Today's Task Summary (Pie Chart)"
                },
                tooltip: {
                    callbacks :{
                        label : function (context) {
                           const value = context.raw;
                           const hours = (value/60).toFixed(2);
                           const percentage = ((value/total)*100).toFixed(1);
                           return `${context.label}: ${hours} hrs (${percentage}%)`;
                        }
                    }
                },
                datalabels:{
                    formatter : (value,context) => {
                        const hours = (value/60).toFixed(2);
                        const percentage = ((value/total)*100).toFixed(1);
                        return `${hours} hrs\n(${percentage}%)`;
                    },
                    color:'#040466',
                    font:{
                        weight:'bold',
                        size:14
                    }
                }
            }
        },
        plugins:[chartDataLabels]
    })

}

// This defines the label callback function, which controls the text shown in the tooltip for each data slice.

// context contains information about the specific slice you're hovering over (e.g., value, label, index).

// In Chart.js, when you're customizing tooltips using a callback function, Chart.js gives you a context object that contains all kinds of useful information about the chart element being hovered over — like its label, index, dataset, value, etc.

// ➡️ context.raw specifically gives you the raw value of the data point — in your case, the duration of the task in minutes, just as you passed it into the chart's data array.