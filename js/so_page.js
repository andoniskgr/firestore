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

function handleForm(e){
  e.preventDefault();
  const flight=e.target.flight.value;
  const from=e.target.from.value;
  const to=e.target.to.value;
  const eta=e.target.eta.value;
  const registration=e.target.registration.value;
  const mel_desc=e.target.mel_description.value;
  const mel=e.target.mel.value;
  const final=e.target.so_prepared_test;
  let res=`A/C DETAILS:
${registration} (Aircraft Type: A321-231, MSN: 02610 ENG TYPE: V2500), FLT No ${flight} (${from}-${to}), ETA:04/01/2025 ${eta} UTC.

DEFECT DETAILS:
A/c released iaw ${mel} ( ${mel_desc}). Please perform the necessary maintenance action iaw maintenance procedures section 28-40-00-040-005-A. before a/c departure.

NOTE:
By receiving the attached training material and along with the CRS, you confirm knowledge of the operator’s processes and procedures.

INFO:
Pls raise a new workorder in the Tech Log in order to record any maintenance action and close the workorder.
Upon completion, please leave the white original workorder page in the Tech log and fax the green workorder copy back to Athens MCC before a/c departure.

AIRCRAFT MANUALS
Access to manuals is made by AirnavX using the link : https://extranet.aegeanair.com Username and password are provided by MCC.
`;
  final.value+=res;
  
}