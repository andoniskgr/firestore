// check if user is logged in
auth.onAuthStateChanged((user) => {
  if (user == null) {
    window.close(); //  if not logged in close window
  }
});

// *****************************************************************
// Wait for aircrafts to be updated
window.addEventListener('aircraftsUpdated', function() {
  // console.log(window.getAircrafts()); // This will give you the latest aircrafts
  aircrafts.forEach((aircraft) => {
      // check if the aircraft is active
      if (!aircraft.doc.data().ACTIVE) {
        return;
      }
      const registration_selection = document.querySelector("#registration");
      let newOptionItem = document.createElement("option");
      newOptionItem.text = aircraft.doc.data().REGISTRATION;
      newOptionItem.value = aircraft.doc.data().REGISTRATION;
      newOptionItem.setAttribute("data-engine", aircraft.doc.data().ENGINE);
      newOptionItem.setAttribute("data-msn", aircraft.doc.data().MSN);
      newOptionItem.setAttribute("data-type", aircraft.doc.data().TYPE);
      registration_selection.appendChild(newOptionItem);
    });
});

// Call fetchAircrafts when the page loads or based on some event
window.fetchAircrafts();
// *****************************************************************


// declare variables and constants
const logout_btn = this.document.querySelector("#logout_link");
const managerial_form = this.document.querySelector("#service_order_form");

      
// add event listeners
logout_btn.addEventListener("click", logout);
managerial_form.addEventListener('submit', handleForm)
  


// function that handle form submit action
function handleForm(e) {
  e.preventDefault();
  if (validate_fields(e)==true) {
    const event = e.target.event.value;
    const occured_time = e.target.occured_time.value;
    const occured_date = e.target.occured_date.value;
    const registration = e.target.registration.value.toUpperCase();
    const station = e.target.station.value.toUpperCase();
    const consequence = e.target.consequence.value.toUpperCase();
    const details = e.target.details.value.toUpperCase();
    const action = e.target.action.value.toUpperCase();
    const update_time = e.target.update_time.value;
    const update_date = e.target.update_date.value;

    const final = e.target.managerial_prepared_text;
    let res = '';

    res = `Dear all,\n
Event    :${event}
Time     :${occured_time} UTC,${occured_date}
Reg       :${registration}
Stn       :${station}
Cons     :${consequence}
Details  :${details}
Action   :${action}
Update  :${update_time} UTC, ${update_date}\n
Best Regards
`;

    final.value = res;
    navigator.clipboard.writeText(final.value);
  } 
}

function validate_fields(e) {
  if (e.target.elements[2].value == "") {
    alert('Select A/C');
    e.target.elements[2].focus();
    return false;
  } if (e.target.elements[0].checked == true && e.target.elements[9].value == "") {
    alert('Defect required!');
    e.target.elements[9].focus();
    return false;
  } if (e.target.elements[1].checked == true && e.target.elements[10].value == "") {
    alert('MEL Reference required!');
    e.target.elements[10].focus();
    return false;
  } if (e.target.elements[1].checked == true && e.target.elements[11].value == "") {
    alert('MEL Description required!');
    e.target.elements[11].focus();
    return false;
  } 
  else {
    console.log('all ok');
    return true;
  }

}

function set_eta_type(e){
  console.log(e.target.checked);
  if (e.target.checked) {
    document.querySelector('[name="eta"]').value="";
    document.querySelector('[name="eta"]').disabled=true;
  } else {
    document.querySelector('[name="eta"]').disabled=false;
  } 
}

//   function return current day
function get_current_day() {
  const [year, month, day] = new Date().toISOString().split("T")[0].split("-");
  return `${day}/${month}/${year}`;
}

//  logout function
function logout() {
  let response = window.confirm("Are you sure you want to log out?");
  if (response) {
    auth.signOut();
  } else {
    return;
  }
}


// function format the time when input  
function formatTime(event) {
  const input = event.target;
  let value = input.value.replace(/[^0-9]/g, ""); // Remove all non-numeric characters
  // Limit the input to at most 4 digits (HH:MM format)
  if (value.length > 4) {
    value = value.slice(0, 4);
  }
  // Insert the colon after the second digit
  if (value.length >= 3) {
    value = value.slice(0, 2) + ":" + value.slice(2);
  }
  // Update the input value with the formatted time
  input.value = value;
}

// function format the date when input 
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

