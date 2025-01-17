    const toggleSwitch = document.getElementById('toggleSwitch');
    const formTitle = document.getElementById('form-title');
    const nameField = document.getElementById('name');
    const mainPage= 'html/main_data.html';

    // toggle switch function
    toggleSwitch.addEventListener('change', () => {
        if (toggleSwitch.checked) {
            formTitle.textContent = 'Signup';
            nameField.parentElement.style.display = 'block';
            nameField.required = true;
            toggleSwitch.nextElementSibling.textContent = 'Switch to Login';
            form.reset();
        } else {
            formTitle.textContent = 'Login';
            nameField.parentElement.style.display = 'none';
            nameField.required = false;
            toggleSwitch.nextElementSibling.textContent = 'Switch to Signup';
            form.reset();
        }
    });



    // Initialize with Login view
    nameField.parentElement.style.display = 'none';
    nameField.required = false;



    // function that checks if user logged in or not
auth.onAuthStateChanged((user) => {
  console.log("onAuthStateChanged");
  if (user) {
      console.log('you are logged in');
      window.location=mainPage;
  
  } else {
    console.log('you are NOT logged in');
  }
});


const form = document.querySelector("#authForm");
  // add event listeners
  form.addEventListener("submit", handle_form);


// function handle form
function handle_form(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.toLowerCase();
    const password = form.password.value;
    // if login selected
    if (!toggleSwitch.checked) {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("Login ok!");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("error code:", errorCode);
          console.log("error message:", errorMessage);
        });
    } else {
      const name=form.name.value;
      //  if signup selected
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("Signup ok!");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("error code:", errorCode);
          console.log("error message:", errorMessage);
        });
    }
  }