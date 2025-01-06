const resultTable = document.querySelector("#table_data");
const modal=document.querySelector('.modal');
const new_aircraft_form=document.querySelector('#new_aircraft_form');

auth.onAuthStateChanged((user) => {
  if (user == null) {
    window.close();
  }
  else {
    get_real_time_data(user)
  }
});

window.addEventListener("DOMContentLoaded", function () {
  const logout_btn = this.document.querySelector("#logout_link");

  logout_btn.addEventListener("click", logout);
});

modal.addEventListener('hidden.bs.modal',function(e){
  modal.querySelector('form').reset();
});  

new_aircraft_form.addEventListener("submit", save_event);


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

// get real-time data from firestore
function get_real_time_data(user=null){
  let changes=[];
  if (user!=null) {
    // document.querySelector('table').classList.remove('d-none');
    db.collection("aircrafts")
  .orderBy("REGISTRATION")
  .onSnapshot(function (snapshot) {
    changes = snapshot.docChanges();
    
    if (changes.length==0) {
      document.querySelector('table').classList.add('d-none');
      flash_message('There is no Data!')
    } else {
      flash_message();
      changes.forEach((change) => {
      if (change.type == "added") {
        renderResultTable(change.doc);
      } else if (change.type == "removed") {
        let del_aircraft = resultTable.querySelector(
          "[data-id=" + change.doc.id + "]"
        );
        resultTable.removeChild(del_aircraft);
      }
    });
    }    
  });
  } else {
    document.querySelector('table').classList.add('d-none');
    renderResultTable();
  }
  
}

// function that creates table row elements
function renderResultTable(doc=[]) {
  // console.log('renderResultTable start');
  if (doc.length==0) {
    console.log(doc.length);
    
    resultTable.innerHTML = '';
  } else {
    document.querySelector('table').classList.remove('d-none');
  let aircraft_row='';
  aircraft_row=`<tr data-id="${doc.id}">
  <td id="registration"><input size="5" class=" w-100" value="${doc.data().REGISTRATION}" oninput=edit_event(event)></td>
  <td id="type"><input value="${doc.data().TYPE}" class=" w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="type"><input size="5" value="${doc.data().MSN}" class="w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="effectivity"><input size="3" value="${doc.data().EFFECTIVITY}" class="w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="engine"><input size="9" value="${doc.data().ENGINE}" class="w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="date_received"><input size="9" value="${doc.data().DATE_RECEIVED}" class="w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="selcal"><input size="6" value="${doc.data().SELCAL}" class="w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="wv"><input size="5" value="${doc.data().WV}" class="w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="notes"><input value="${doc.data().NOTE}" class="w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="cls" class="text-center"><input type="checkbox" ${doc.data().CLS?'checked':''} oninput=edit_event(event)></td>
  <td id="wifi" class="text-center"><input type="checkbox" ${doc.data().WIFI?'checked':''} oninput=edit_event(event)></td>
  <td id="active" class="text-center"><input type="checkbox" ${doc.data().ACTIVE?'checked':''} oninput=edit_event(event)></td>
  <td class="text-nowrap"><span class="fa fa-trash-o" id="delete_icon" style="font-size: 1.5em;" onclick=delete_aircraft(event)></span>
  <span class="fa fa-save ms-3 d-none" style="font-size: 1.4em;" onclick="save_edit_event(event)"></span></td>
  </tr>`;
  resultTable.innerHTML += aircraft_row; 
}
  // console.log("renderResultTable end");
}

function flash_message(msg=null){
  if (document.querySelector('#flashMsg')!=null){
    document.querySelector('#flashMsg').remove();
  }
  if (msg!=null) {
    const flashMessageElement=document.createElement('div');
    flashMessageElement.className="text-center h2 m-4";
    flashMessageElement.setAttribute('id','flashMsg');
    flashMessageElement.innerHTML=msg;
    document.querySelector('body').appendChild(flashMessageElement);
  }
}

// save data to firestore
function save_event(e) {  
  user=auth.currentUser.email;
  e.preventDefault();
  console.log("save_event");
  now = new Date();
  const aircraft = {
    created: now,
    created_by:user,
    ACTIVE: new_aircraft_form.active.checked,
    CLS: new_aircraft_form.cls.checked,
    WIFI: new_aircraft_form.wifi.checked,
    DATE_RECEIVED: new_aircraft_form.date_received.value,
    EFFECTIVITY: new_aircraft_form.effectivity.value,
    ENGINE: new_aircraft_form.engine.value.toUpperCase(),
    MSN: new_aircraft_form.msn.value,
    NOTE: new_aircraft_form.notes.value.toUpperCase(),
    REGISTRATION: new_aircraft_form.registration.value.toUpperCase(),
    SELCAL: new_aircraft_form.selcal.value.toUpperCase(),
    TYPE: new_aircraft_form.type.value.toUpperCase(),
    WV: new_aircraft_form.weight_variant.value.toUpperCase(),
  };

  $(".modal").modal("hide");
  new_aircraft_form.reset();
  console.log(aircraft);
  db.collection("aircrafts").add(aircraft).then(function () {
    console.log('Event saved!');
    alert('New Aircraft created!');
  }
  );
}

// delete Event
function delete_aircraft(e) {  
  e.stopPropagation();
  let response = window.confirm("Are you sure you want to delete this Event?");
  if (response) {
    let id = e.target.parentElement.parentElement.getAttribute("data-id");
    console.log(`Aircraft with ID:${id} deleted`);
    db.collection("aircrafts").doc(id).delete();
  } else {
    return;
  }
}
