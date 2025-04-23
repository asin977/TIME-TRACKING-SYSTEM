function createAccount() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
    const email     = document.getElementById('email').value.trim(); 
    const workSpace = document.getElementById('workspace').value.trim();
    const jobRole   = document.getElementById('jobrole').value;
    const passWord  = document.getElementById('createpassword').value.trim();
    const otherJob  = document.getElementById('otherjob').value.trim();

    // ——— Email must look like something@domain.tld
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // ——— Password must be at least 8 chars, include uppercase, lowercase, digit & special char
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(passWord)) {
        alert("Password must be at least 8 characters and include:\n" +
              "• one uppercase letter\n" +
              "• one lowercase letter\n" +
              "• one number\n" +
              "• one special character");
        return;
    }

    // ——— Required fields
    if (!firstName || !jobRole) {
        alert("Please fill all the required fields.");
        return;
    }

    const userName = firstName.toLowerCase();
    if (localStorage.getItem(userName)) {
        alert(`Account already exists. Please sign in.\nYour username: ${userName}`);
        return;
    }

    const finalJob = jobRole === "other" ? otherJob : jobRole;
    const user = { firstName, lastName, email, workSpace, jobRole: finalJob, passWord };

    localStorage.setItem(userName, JSON.stringify(user));
    alert("Account created successfully! Please sign in.");
}
