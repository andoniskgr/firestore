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
    const defect = e.target.defect.value.toUpperCase();
    const mel_desc = e.target.mel_description.value;
    const mel = e.target.mel.value;
    const type = e.target.registration.getAttribute('data-type');
    console.log(type);
    
    const final = e.target.so_prepared_test;
    let res = '';

    res = `A/C DETAILS:
${registration} (Aircraft Type: A321-231, MSN: 02610 ENG TYPE: V2500), FLT No ${flight} (${from}-${to}), ETA:${date} ${eta} UTC.
  \nDEFECT DETAILS:\n`

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

function validate_fields(e) {
  if (e.target.elements[7].value == "") {
    alert('Select A/C');
    e.target.elements[7].focus();
    return false;
  } if (e.target.elements[0].checked == true && e.target.elements[8].value == "") {
    alert('Defect required!');
    e.target.elements[8].focus();
    return false;
  } if (e.target.elements[1].checked == true && e.target.elements[9].value == "") {
    alert('MEL Reference required!');
    e.target.elements[9].focus();
    return false;
  } if (e.target.elements[1].checked == true && e.target.elements[10].value == "") {
    alert('MEL Description required!');
    e.target.elements[10].focus();
    return false;
  } 
  else {
    console.log('all ok');
    return true;
  }

}

