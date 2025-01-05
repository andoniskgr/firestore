auth.onAuthStateChanged((user) => {
  if (user == null) {
    window.close();
  }
});

window.addEventListener("DOMContentLoaded", function () {
  const logout_btn = this.document.querySelector("#logout_link");

  logout_btn.addEventListener("click", logout);
});
  
  
  
  

function logout() {
  let response = window.confirm("Are you sure you want to log out?");
  if (response) {
    auth.signOut();
  } else {
    return;
  }
}



function reformatDate(d){
  const [year,month,day]=d.split('-');
  return `${day}/${month}/${year}`;
  
}

function get_current_day(){
  const [year,month,day]=new Date().toISOString().split('T')[0].split('-');
  return `${year}-${month}-${day}`;
}

function validateDate(input) {
  let value = input.value;

  // Allow only numbers and slashes
  value = value.replace(/[^0-9\/]/g, '');

  // Ensure the date format dd/mm/yyyy
  if (value.length > 2 && value[2] !== '/') {
      value = value.substring(0, 2) + '/' + value.substring(2);
  }

  if (value.length > 5 && value[5] !== '/') {
      value = value.substring(0, 5) + '/' + value.substring(5);
  }

  input.value = value;

  // Additional validation to ensure the correct number of digits for day, month, and year
  if (value.length === 10) {
      let parts = value.split('/');
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10);
      let year = parseInt(parts[2], 10);

      // Simple validation to check if day, month, and year are within valid ranges
      if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000 || year > 9999) {
          input.setCustomValidity("Invalid date format.");
      } else {
          input.setCustomValidity("");
      }
  }
}

