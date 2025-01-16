


function set_up_variables() {
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    const form = document.querySelector("#authForm");
    // add event listeners
    form.addEventListener("submit", handle_form);
  }
  if (window.location.pathname != "/") {
    // declare navbar components
    console.log("declare navbar components");
    const loggedOutLinks = document.querySelectorAll(".logged-out");
    const loggedInLinks = document.querySelectorAll(".logged-in");
    const logout_btn = this.document.querySelector("#logout_link");
    console.log('const ok');
    
  }
}



// function that checks if user logged in or not
auth.onAuthStateChanged((user) => {
  console.log("onAuthStateChanged");
  if (user) {
    window.user = user;
    if (window.location.pathname==='/' || window.location.pathname==='/index.html') {
      window.location = "index_old.html";
    }
    console.log('2');
    set_up_variables();
    // console.log(loggedInLinks);

    // setUpUi(user)
    // flash_message();
    // manual_calling_db();
  } else {
    if (!window.location.pathname==='/') {
      window.location = "index.html";
      // setUpUi();
    }
  }
});


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



// function control UI components
function setUpUi(user=null) {
  // console.log('setUpUi');
  if (user) {
    loggedInLinks.forEach(function (link) {
      link.classList.remove("d-none");
      if (
        user.email != "andoniskgr@yahoo.gr" &&
        link.id == "aircraft_admin_link"
      ) {
        link.classList.add("d-none");
      }
    });
    loggedOutLinks.forEach(function (link) {
      link.classList.add("d-none");
    });
    // document.querySelector(".accordion").classList.remove("d-none");
  } else {
    loggedInLinks.forEach(function (link) {
      link.classList.add("d-none");
    });
    loggedOutLinks.forEach(function (link) {
      link.classList.remove("d-none");
    });
    // document.querySelector(".accordion").classList.add("d-none");
  }
}

// function for controlling log out
function logout() {
  let response = window.confirm("Are you sure you want to log out?");
  if (response) {
    document.querySelector("#myTable").innerHTML = "";
    auth.signOut();
  } else {
    return;
  }
}
