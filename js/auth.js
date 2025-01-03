
window.addEventListener("DOMContentLoaded", function () {
  // console.log("Auth DOM load start");

  // declare navbar components
  const loggedOutLinks = document.querySelectorAll(".logged-out");
  const loggedInLinks = document.querySelectorAll(".logged-in");
  const logout_btn = this.document.querySelector("#logout_link");

  // declare page components
  const register_form = this.document.querySelector("#register_form");
  const login_form = this.document.querySelector("#login_form");

  // function that checks if user logged in or not
  auth.onAuthStateChanged((user) => {
    if (user) {
      setUpUi(user);
      console.log("logged in as:", user.email);      
      get_real_time_data();
    } else {
      setUpUi();
      console.log("not login");
      flash_message("You need to login for access!")
    }
  });

  // add event listeners
  logout_btn.addEventListener("click", logout);
  register_form.addEventListener("submit", signup);
  login_form.addEventListener("submit", login);

  // function control UI components
  function setUpUi(user) {
    // console.log('setUpUi');
    if (user) {
      loggedInLinks.forEach(function (link) {
        link.classList.remove("d-none");
      });
      loggedOutLinks.forEach(function (link) {
        link.classList.add("d-none");
      });
      if (document.querySelector('table')==null) {
        create_table();
      }
    } else {
      document.querySelector('table').remove();
      loggedInLinks.forEach(function (link) {
        link.classList.add("d-none");
      });
      loggedOutLinks.forEach(function (link) {
        link.classList.remove("d-none");
      });
    }
  }

  // function for controlling log out
  function logout() {
    let response = window.confirm("Are you sure you want to log out?");
    if (response) {
      auth.signOut();
    } else {
      return;
    }
  }

  // function controlling signup
  function signup(e) {
    e.preventDefault();
    console.log("signup function");
    const email = register_form.email.value.toLowerCase();
    const password = register_form.password.value;
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Signup successfully as:", userCredential.email);
        $(".modal").modal("hide");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error code:", errorCode);
        console.log("error message:", errorMessage);
      });
  }

  // function controlling login
  function login(e) {
    console.log("login function");
    e.preventDefault();
    const email = login_form.email.value.toLowerCase();
    const password = login_form.password.value;
    console.log(email, password);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        $(".modal").modal("hide");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error code:", errorCode);
        console.log("error message:", errorMessage);
      });
  }

  function create_table(){
    const table_render=document.querySelector('#main-section');
    table_render.innerHTML=`<table class="table table-bordered">
              <thead>
                  <tr>
                      <th scope="col">Time</th>
                      <th scope="col">Position</th>
                      <th scope="col">Registration</th>
                      <th class="col-4" scope="col">Defect</th>
                      <th class="col-4" scope="col">Notes</th>
                      <th scope="col">S/L</th>
                      <th scope="col">OK</th>
                      <th class="col-1" scope="col">Action</th>
                  </tr>
              </thead>
              <tbody id="table_data">
  
              </tbody>
          </table>`
  };
  
  // console.log("Auth DOM load end");
});



