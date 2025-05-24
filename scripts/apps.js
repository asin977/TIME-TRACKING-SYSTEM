function createAccount() {
    const firstName = document.getElementById("firstname").value.trim();
    const lastName = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();
    const workSpace = document.getElementById('workspace').value.trim();
    const jobRole = document.getElementById('jobRole').value.trim();
    const passWord = document.getElementById("createpassword").value.trim();
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address");
        return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(passWord)) {
        alert(
            "password must be atleast 8 characters and must include:\n"+
            "One uppercase letter\n"+
            "One lowercase letter\n"+
            "One number\n"+
            "One special charecter"
        )
        return;
    
        if (!firstName || !email || !jobRole || !passWord) {
            alert ("Please fill all the required fields.")
            return;
        }
        const userName = firstName.toLowerCase();
        const existingUser = localStorage.getItem(userName);

        if (existingUser) {
            alert (`You have already created an account.\nPlease Sign In.\nYour username is: ${userName}\nYour password is: ${passWord}`);
            return;
        }
        const finalJob = jobRole === "other" ? otherJob : jobRole;
        const user = {
            firstName,
            lastName,
            email,
            workSpace,
            jobRole : finalJob,
            passWord
        };
        localStorage.setItem(userName,JSON.stringify(user));
        alert (`Account created successfully!\nUsername:${firstName}\nPassword:${passWord}\nRemember these details to sign-In.`);
    }
    document.getElementById('account').addEventListener('click',createAccount);

    function signIn() {
        const loginFirstName = document.getElementById('loginFirstName').value.trim();
        const loginPassword = document.getElementById('loginPassword').value;

        const storedUser = JSON.parse(localStorage.getItem(loginFirstName.toLowerCase()));

        if (storedUser && storedUser.passWord === loginPassword) {
            alert(`Welcome,${storedUser.firstName}!\nWorkspace:${storedUser.workSpace || "N/A"}`);

            sessionStorage.setItem("loggedInUser",JSON.stringify(storedUser));

            window,location.href = "track.html";

        }else {
            alert("Invalid username or password.")
        }
    }

}

function toggleOtherJob() {
    const jobSelect = document.getElementById("jobRole");
    const otherInput = document.getElementById('otherJob');
    if(jobSelect.value === "other") {
        otherInput.classList.remove("hidden");

    }else {
        otherInput.classList.add("hidden");
    }
}
document.getElementById("toggleLoginpassword").addEventListener("click",function () {
    const passwordField = document.getElementById("loginPassword");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type",type);

});

document.getElementById("signIn").addEventListener("click",signIn);




let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

function parseDurationToHours(durationStr) {
    if (!durationStr || !durationStr.includes(":")) return 0;
    const [h,m,s] = durationStr.split(":").map(Number);
    return (h || 0) + (m || 0) / 60 + (s || 0) / 3600;
}

function renderWeeklyBarGraph() {
    const weekData = {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0}
    const dayMap = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    taskList.forEach(task => {
        if (!task.startDate || !task.totalDuration) return;
        const dayIndex = new Date(task.startDate).getDate();
        const hours = parseDurationToHours(task.totalDuration);
        if (!isNaN(hours)) {
            weekData[dayMap[dayIndex]] += hours;
        }
    });

    const durations = Object.values(weekData);
    const maxDuration = Math.max(...durations,1);

    const yAxisLabels = document.getElementById("yAxisLabels");
    const barsContainer = document.getElementById("barsContainer");
    const xAxisLabels = document.getElementById("xAxisLabels");

    if (!yAxisLabels || !barsContainer || !xAxisLabels) return;

    yAxisLabels.innerHTML = "";
    barsContainer.innerHTML = "";
    xAxisLabels.innerHTML = "";

    const yFragment = document.createDocumentFragment();
    for (let i = 5; i >= 0;i--) {
        const label = document.createElement("div");
        label.textContent = `${((maxDuration/5)*i).toFixed(1)}h`;
        yFragment.appendChild(label);

    }
    yAxisLabels.appendChild(yFragment);

    const height = Math.min(400,maxDuration*50);
    barsContainer.style.height = `${height}px`;

    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const barsFragment = document.createDocumentFragment();
    const xLabelsFragment = document.createDocumentFragment();

    days.forEach(day => {
        const barHeightPercent  = (weekData[day]/maxDuration)*100;

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${barHeightPercent}%`;
        bar.textContent = weekData[day].toFixed(1) || "0";
        barsFragment.appendChild(label);
    });

    barsContainer.appendChild(label);
    xAxisLabels.appendChild(label);
}

function renderTaskTable() {
    const taskTableBody = document.getElementById("taskTableBody");
    if (!taskTableBody) return;

    taskTableBody.innerHTML = "";
    const fragment = document.createDocumentFragment();

    taskList.forEach((task,index)=> {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
        `
    })
}