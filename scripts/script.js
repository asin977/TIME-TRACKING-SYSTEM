function createAccount() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim(); 
    const workSpace = document.getElementById('workspace').value.trim();
    const jobRole = document.getElementById('jobRole').value;
    const passWord = document.getElementById('createpassword').value.trim();
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
   
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(passWord)) {
        alert(
            "Password must be at least 8 characters and must include:\n" +
            "• One uppercase letter\n" +
            "• One lowercase letter\n" +
            "• One number\n" +
            "• One special character"
        );
        return;
    }

    if (!firstName || !email || !jobRole || !passWord) {
        alert("Please fill all the required fields.");
        return;
    }

    const userName = firstName.toLowerCase();
    const existingUser = localStorage.getItem(userName);

    if (existingUser) {
        alert(`You have already created an account.\nPlease Sign In.\nYour username is: ${userName}\nYour password is: ${passWord}`);
        return;
    }
    const finalJob = jobRole === "other" ? otherJob : jobRole;
    const user = {
        firstName,
        lastName,
        email,
        workSpace,
        jobRole: finalJob,
        passWord
    };

    localStorage.setItem(userName, JSON.stringify(user));
    alert(`Account created successfully!\nUsername: ${firstName}\nPassword: ${passWord}\nRemember these details to Sign-In.`);

}

document.getElementById('account').addEventListener('click', createAccount);

function signIn() {
    const loginFirstName = document.getElementById('loginFirstName').value.trim();
    const loginPassword = document.getElementById('loginPassword').value;

    const storedUser = JSON.parse(localStorage.getItem(loginFirstName.toLowerCase()));

    if (storedUser && storedUser.passWord === loginPassword) {
        alert(`Welcome, ${storedUser.firstName}!\nWorkspace: ${storedUser.workSpace || "N/A"}\nRole: ${storedUser.jobRole || "N/A"}`);

        
        sessionStorage.setItem("loggedInUser", JSON.stringify(storedUser));

        window.location.href = "track.html";
    } else {
        alert("Invalid username or password.");
    }
}

function toggleOtherJob() {
    const jobSelect = document.getElementById("jobRole");
    const otherInput = document.getElementById("otherJob");
    if (jobSelect.value === "Other") {
      otherInput.classList.remove("hidden");
    } else {
      otherInput.classList.add("hidden");
    }
  }
document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordField = document.getElementById("createpassword");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
  });

document.getElementById("toggleLoginPassword").addEventListener("click", function () {
    const passwordField = document.getElementById("loginPassword");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
});

document.getElementById('signIn').addEventListener('click', signIn);


