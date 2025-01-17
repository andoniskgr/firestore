

  // declare navbar components
  const loggedOutLinks = document.querySelectorAll(".logged-out");
  const loggedInLinks = document.querySelectorAll(".logged-in");
  const logout_btn = this.document.querySelector("#logout_link");

  logout_btn.addEventListener('click',logout);



// function that checks if user logged in or not
auth.onAuthStateChanged((user) => {
  // console.log("onAuthStateChanged");
  if (user) {
    setUpUi(user)
  } else {    
      window.location = "../index.html";
      setUpUi();
    }
});


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
