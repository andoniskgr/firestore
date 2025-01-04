auth.onAuthStateChanged((user) => {
  if (user == null) {
    window.close();
  }
});

window.addEventListener("DOMContentLoaded", function () {
 
    db.collection('aircrafts').orderBy("REGISTRATION").onSnapshot(function(snapshot){
      let aircrafts=snapshot.docChanges();
      const registration_selection=document.querySelector('#registration')
      aircrafts.forEach(aircraft => {
        let newOptionItem=document.createElement('option');
        newOptionItem.text=aircraft.doc.data().REGISTRATION;
        newOptionItem.value=aircraft.doc.data().REGISTRATION;
        registration_selection.appendChild(newOptionItem)
      });
      
      
    })
    
  const logout_btn = this.document.querySelector("#logout_link");
  const type_selection_rb=this.document.querySelectorAll('[name="service_order_type"]');

  type_selection_rb.forEach(function (rb) {
    rb.addEventListener("input", function (e) {
      if (e.target.value == "pirep") {
        console.log(e.target.value);
        document.querySelector('#pirep_defect').classList.remove('d-none')
        document.querySelector('#maintenance_action').classList.add('d-none')
      } else if (e.target.value == "maint") {
        console.log(e.target.value);
        document.querySelector('#pirep_defect').classList.add('d-none')
        document.querySelector('#maintenance_action').classList.remove('d-none')
      }
    });
  });
  


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
