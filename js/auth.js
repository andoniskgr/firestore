
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
      window.user=user;
      setUpUi(user);
      get_real_time_data(user);
    } else {
      window.user="";
      setUpUi();
      flash_message("You need to login for access!");
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
        if (user.email!="andoniskgr@yahoo.gr" && link.id=="aircraft_admin_link") {
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
      document.querySelector('#myTable').innerHTML='';
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

  


