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

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*/d)(?=.*[\W_]).{8,}
;}