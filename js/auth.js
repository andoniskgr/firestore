var auth= firebase.auth();

window.addEventListener('DOMContentLoaded', function(){
  console.log('DOM loaded');
  

  const register_form=this.document.querySelector('#register_form');
  register_form.addEventListener('submit', function(e){
    e.preventDefault();
    signup();    
  });

  const login_form=this.document.querySelector('#login_form');
  login_form.addEventListener('submit', function(e){
    e.preventDefault();
    login();    
  });

  const logout_btn=this.document.querySelector('#logout_link').addEventListener('click', logout);

})

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('logged in as:',user.email);
    const navbar_login=document.querySelector('#login_link').classList.add('d-none');
    const navbar_register=document.querySelector('#register_link').classList.add('d-none');
    const navbar_logout=document.querySelector('#logout_link').classList.remove('d-none');
  } else {
    const navbar_login=document.querySelector('#login_link').classList.remove('d-none');
    const navbar_register=document.querySelector('#register_link').classList.remove('d-none');
    const navbar_logout=document.querySelector('#logout_link').classList.add('d-none');
    console.log('not login');
  }
});

function signup(){
  const usr=document.querySelector('#register_email').value.toLowerCase();
  const pwd=document.querySelector('#register_password').value;
  console.log(usr,pwd);
  auth.createUserWithEmailAndPassword(usr,pwd)
  .then((userCredential) => {
    console.log('Signup successfully as:',userCredential);
    $('.modal').modal('hide');
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("error code:",errorCode);
    console.log("error message:",errorMessage);
  });
}

function login(){
  console.log('login function');
  const usr=document.querySelector('#login_email').value.toLowerCase();
  const pwd=document.querySelector('#login_password').value;
  console.log(usr,pwd);
  auth.signInWithEmailAndPassword(usr,pwd)
.then((userCredential) => {
  console.log('Login successfully as:',userCredential);
  $('.modal').modal('hide');
})
.catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  console.log("error code:",errorCode);
  console.log("error message:",errorMessage);
});
}

function logout(){
  auth.signOut();
}