window.addEventListener("DOMContentLoaded", function () {
  const logout_btn = this.document.querySelector("#logout_link");
  logout_btn.addEventListener("click", logout);
});

function logout() {
  auth.signOut();
}

auth.onAuthStateChanged((user) => {
    const navbar_login = document.querySelector("#login_link");
    const navbar_register = document.querySelector("#register_link");
    const navbar_logout = document.querySelector("#logout_link");
    if (user) {
      console.log("logged in as:", user.email);
      
    } else {
      console.log("not login");
      window.location.replace('index.html');
    }
  });