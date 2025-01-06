auth.onAuthStateChanged((user) => {
  if (user == null) {
    window.close();
  }
});

window.addEventListener("DOMContentLoaded", function () {
  const logout_btn = this.document.querySelector("#logout_link");
  const type_selection_rb = this.document.querySelectorAll(
    '[name="service_order_type"]'
  );
  const so_form = this.document.querySelector("#service_order_form");
  const date_input_field=this.document.querySelector('[name="date"]');
  date_input_field.value=get_current_day();

  // get aircraft data from database and build aircraft selection field
  db.collection("aircrafts")
    .orderBy("REGISTRATION")
    .onSnapshot(function (snapshot) {
      let aircrafts = snapshot.docChanges();
      const registration_selection = document.querySelector("#registration");
      aircrafts.forEach((aircraft) => {
        let newOptionItem = document.createElement("option");
        newOptionItem.text = aircraft.doc.data().REGISTRATION;
        newOptionItem.value = aircraft.doc.data().REGISTRATION;
        newOptionItem.setAttribute('data-engine',aircraft.doc.data().ENGINE);
        newOptionItem.setAttribute('data-msn',aircraft.doc.data().MSN);
        newOptionItem.setAttribute('data-type',aircraft.doc.data().TYPE);
        registration_selection.appendChild(newOptionItem);
      });
    });

    // add event listeners
    type_selection_rb.forEach(function (rb) {
      rb.addEventListener("input", setupFormUi);
    });

    logout_btn.addEventListener("click", logout);
    so_form.addEventListener('submit', handleForm)
});
  
  
  
  

function logout() {
  let response = window.confirm("Are you sure you want to log out?");
  if (response) {
    auth.signOut();
  } else {
    return;
  }
}

function formatTime(event) {
  
  const input = event.target;
  let value = input.value.replace(/[^0-9]/g, ''); // Remove all non-numeric characters

  // Limit the input to at most 4 digits (HH:MM format)
  if (value.length > 4) {
    value = value.slice(0, 4);
  }

  // Insert the colon after the second digit
  if (value.length >= 3) {
    value = value.slice(0, 2) + ':' + value.slice(2);
  }

  // Update the input value with the formatted time
  input.value = value;
}

function setupFormUi(e) {
  if (e.target.value == "pirep") {
    document.querySelector("#pirep_defect").classList.remove("d-none");
    document.querySelector("#maintenance_action").classList.add("d-none");
  } else if (e.target.value == "maint") {
    document.querySelector("#pirep_defect").classList.add("d-none");
    document.querySelector("#maintenance_action").classList.remove("d-none");
  }
}

function handleForm(e) {
  e.preventDefault();
  if (validate_fields(e)==true) {
    const flight = e.target.flight.value.toUpperCase();
    const from = e.target.from.value.toUpperCase();
    const to = e.target.to.value.toUpperCase();
    const date = reformatDate(e.target.date.value);
    const eta = e.target.eta.value;
    const registration = e.target.registration.value.toUpperCase();
    const type = e.target.registration.options[e.target.registration.selectedIndex].dataset.type;
    const engine = e.target.registration.options[e.target.registration.selectedIndex].dataset.engine;
    const msn = e.target.registration.options[e.target.registration.selectedIndex].dataset.msn;
    const defect = e.target.defect.value.toUpperCase();
    const mel_desc = e.target.mel_description.value.toUpperCase();
    const mel = e.target.mel.value.toUpperCase();    
    const final = e.target.so_prepared_test;
    let res = '';

    res = `A/C DETAILS:
${registration} (Aircraft Type: ${type}, MSN: ${msn} ENG TYPE: ${engine}), FLT No ${flight} (${from}-${to}), ETA:${date} ` 
if (document.querySelector('#landed').checked) {
  res+= `A/C already landed to destination airport.`
} else {
  res+=`${eta} UTC.`
}

  res+=`\n\nDEFECT DETAILS:\n`

    if (e.target.service_order_type.value == 'pirep') {
      res += `Pilot reported: ${defect}. Please attend the A/C and perform inspection IAW AMM.`
    } else if (e.target.service_order_type.value == 'maint') {
      res += `A/C released iaw ${mel} (${mel_desc}). Please perform the necessary maintenance action iaw attached maintenance procedure before A/C departure.`
    }

    res += `\n\nNOTE:
By receiving the attached training material and along with the CRS, you confirm knowledge of the operator’s processes and procedures.

INFO:
Pls raise a new workorder in the Tech Log in order to record any maintenance action and close the workorder.
Upon completion, please leave the white original workorder page in the Tech log and fax the green workorder copy back to Athens MCC before a/c departure.

AIRCRAFT MANUALS
Access to manuals is made by AirnavX using the link : https://extranet.aegeanair.com Username and password are provided by MCC.
`;

    final.value = res;
    navigator.clipboard.writeText(final.value);
  } 
}

function reformatDate(d){
  const [year,month,day]=d.split('-');
  return `${day}/${month}/${year}`;
  
}

function get_current_day(){
  const [year,month,day]=new Date().toISOString().split('T')[0].split('-');
  return `${day}/${month}/${year}`;
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