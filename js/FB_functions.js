

// initialize();
function initialize(){
  
}

function showLoginForm(show=true) {
  const loginForm = document.querySelector('.signup-form');
  const signupForm = document.querySelector('.login-form');
  if (show == true) {
    signupForm.classList.add('d-none')
    signupForm.classList.remove('d-block')
    loginForm.classList.add('d-block')
    loginForm.classList.remove('d-none')
  } else {
    signupForm.classList.add('d-block')
    signupForm.classList.remove('d-none')
    loginForm.classList.add('d-none')
    loginForm.classList.remove('d-block')
  }

}



function logout(){
  auth.signOut();
}

function deleteUser(){

}