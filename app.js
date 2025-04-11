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