function createAccount() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim(); 
    const workSpace = document.getElementById('workspace').value.trim();
    const jobRole = document.getElementById('jobrole').value;
    const passWord = document.getElementById('createpassword').value.trim();
    const otherJob = document.getElementById('otherjob').value.trim();

    if (!firstName || !email || !jobRole || !passWord) {
        alert("Please fill all the required fields.");
        return;
    }

    const userName = firstName.toLowerCase();
    const existingUser = localStorage.getItem(userName);
     
    if(existingUser) {
        alert(`You have already created an account.Please Sign In.Your username is ${userName} and password is ${passWord} use it for future reference.`);
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
    }
    localStorage.setItem(userName,JSON.stringify(user));
    alert("You have successfully created your Account.Please Sign In..");
}

const createaccount = document.getElementById('account');
createaccount.addEventListener('click',createAccount);

function signIn() {
    const loginFirstName = document.getElementById('loginFirstName').value.trim()
    const loginPassword = document.getElementById('loginPassword').value;

     const storedUser = JSON.parse(localStorage.getItem(loginFirstName));

     if(storedUser && storedUser.passWord === loginPassword) {
        alert(`Welcome,${storedUser.firstName}...`)
     }else  {
        alert('Invalid UserName or Password..');
     }

}
const signin = document.getElementById('signIn');
signin.addEventListener('click',signIn);

