window.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  const register_form = this.document.querySelector("#register_form");
  register_form.addEventListener("submit", function (e) {
    e.preventDefault();
    email=register_form.email.value.toLowerCase();
    password=register_form.password.value;
    signup(email,password);
  });

  const login_form = this.document.querySelector("#login_form");
  login_form.addEventListener("submit", function (e) {
    e.preventDefault();
    email=login_form.email.value.toLowerCase();
    password=login_form.password.value;
    login(email,password);
  });
});

auth.onAuthStateChanged((user) => {
  const navbar_login = document.querySelector("#login_link");
  const navbar_register = document.querySelector("#register_link");
  const navbar_logout = document.querySelector("#logout_link");
  if (user) {
    console.log("logged in as:", user.email);
    navbar_login.classList.add("d-none");
    navbar_register.classList.add("d-none");
    // navbar_logout.classList.remove("d-none");
    window.location.replace('main_page.html');
  } else {
    navbar_login.classList.remove("d-none");
    navbar_register.classList.remove("d-none");
    // navbar_logout.classList.add("d-none");
    console.log("not login");
  }
});

function signup(usr,pwd) {
  console.log("signup function");
  console.log(usr, pwd);
  auth
    .createUserWithEmailAndPassword(usr, pwd)
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

function login(usr,pwd) {
  console.log("login function");
  console.log(usr, pwd);
  auth
    .signInWithEmailAndPassword(usr, pwd)
    .then((userCredential) => {
      console.log("Login successfully as:", userCredential.email);
      $(".modal").modal("hide");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error code:", errorCode);
      console.log("error message:", errorMessage);
    });
}

function logout() {
  auth.signOut();
}
