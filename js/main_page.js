auth.onAuthStateChanged((user) => {
  if(user==null){
    window.location.replace('index.html');
  }
  });

window.addEventListener("DOMContentLoaded", function () {
  const logout_btn = this.document.querySelector("#logout_link");
  logout_btn.addEventListener("click", logout);
  
  
  
});

function logout() {
  let response=window.confirm("Are you sure you want to log out?");
  if (response) {
    auth.signOut();
    window.location.replace('index.html');
  } else {
    return;
  }
}

