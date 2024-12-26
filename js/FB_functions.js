const resultTable = document.querySelector("#table_data");
const new_event_form = document.querySelector("#new_event_form");
const event_reminder_form = document.querySelector("#event_reminder_form");
const my_modals = document.querySelectorAll('.modal');


// listeners
new_event_form.addEventListener("submit", save_event);
event_reminder_form.addEventListener("submit", function(e){
  console.log(e.target);  
});
my_modals.forEach(function(modal){  
  modal.addEventListener('shown.bs.modal',function(e){
    if (modal.id=='loginModal' || modal.id=='registerModal') {
      modal.querySelector('[name="email"]').focus();
    } else if (modal.id=='new_event' || modal.id=='timer'){
      modal.querySelector('[name="time"]').focus();
    }    
  });  
  modal.addEventListener('hidden.bs.modal',function(e){
    modal.querySelector('form').reset();
  });  
});


// function that creates table row elements
function renderResultTable(doc) {
  console.log('renderResultTable start');
  let event_row='';
  let tr_class='';
  if (doc.data().sl == false && doc.data().solved == false) {
    tr_class = "table-light";
  }
  if (doc.data().sl == true) {
    tr_class = "table-warning";
  }
  if (doc.data().solved == true) {
    tr_class = "table-success";
  }


  event_row=`<tr class="${tr_class}" data-id="${doc.id}">
  <td id="time"><input size="6" value="${doc.data().time}" oninput=edit_event(event)></td>
  <td id="position"><input size="6" value="${doc.data().position}" class="text-uppercase" oninput=edit_event(event)></td>
  <td id="registration"><input size="7" value="${doc.data().registration}" class="text-uppercase" oninput=edit_event(event)></td>
  <td id="defect"><input value="${doc.data().defect}" class="w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="notes"><input value="${doc.data().notes}" class="w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="sl" class="text-center"><input type="checkbox" ${doc.data().sl?'checked':''} oninput=edit_event(event)></td>
  <td id="solved" class="text-center"><input type="checkbox" ${doc.data().solved?'checked':''} oninput=edit_event(event)></td>
  <td class="text-nowrap"><span class="fa fa-trash-o" id="delete_icon" style="font-size: 1.5em;" onclick=delete_event(event)></span>
  <span class="fa fa-clock-o ms-3" style="font-size: 1.3em;"></span>
  <span class="fa fa-save ms-3 d-none" style="font-size: 1.4em;" onclick="save_edit_event(event)"></span></td>
  </tr>`;
  
     
  resultTable.innerHTML += event_row;
  console.log("renderResultTable end");
}

// get real-time data from firestore
function get_real_time_data(){
  db.collection("events")
  .orderBy("time")
  .onSnapshot(function (snapshot) {
    let changes = snapshot.docChanges();
    if (changes.length==0) {
      flash_message('There is no Data!')
      console.log(changes);
    } else {
      flash_message();
      changes.forEach((change) => {
      if (change.type == "added") {
        renderResultTable(change.doc);
      } else if (change.type == "removed") {
        let del_event = resultTable.querySelector(
          "[data-id=" + change.doc.id + "]"
        );
        resultTable.removeChild(del_event);
      }
    });
    }    
  });
}


// save data to firestore
function save_event(e) {  
  user=auth.currentUser.email;
  e.preventDefault();
  console.log("save_event");
  now = new Date();
  const event = {
    created: now,
    created_by:user,
    time: new_event_form.time.value,
    position: new_event_form.position.value.toUpperCase(),
    registration: new_event_form.registration.value.toUpperCase(),
    defect: new_event_form.defect.value.toUpperCase(),
    notes: new_event_form.notes.value.toUpperCase(),
    sl: new_event_form.sl.checked,
    solved: new_event_form.solved.checked,
  };

  $(".modal").modal("hide");
  new_event_form.reset();
  // console.log(event);
  db.collection("events").add(event).then(function () {
    alert('Event saved!');
  }
  );
}

// delete Event
function delete_event(e) {  
  e.stopPropagation();
  let response = window.confirm("Are you sure you want to delete this Event?");
  if (response) {
    let id = e.target.parentElement.parentElement.getAttribute("data-id");
    console.log(id);
    db.collection("events").doc(id).delete();
  } else {
    return;
  }
}

// edit Event
function edit_event(e) {
  e.stopPropagation();
  if (e.target.parentElement.id=='time') {
    formatTime(e);
  }
  
  let updated_row = e.target.parentElement.parentElement;
  updated_row.querySelector('.fa-save').classList.remove('d-none');

  if (
    updated_row.cells[5].firstChild.checked == false &&
    updated_row.cells[6].firstChild.checked == false
  ) {
    updated_row.className = "table-light";
  }
  if (updated_row.cells[5].firstChild.checked == true) {
    updated_row.className = "table-warning";
  }
  if (updated_row.cells[6].firstChild.checked == true) {
    updated_row.className = "table-success";
  }
}

function save_edit_event(e) {
  user=auth.currentUser.email;
  e.stopPropagation();
  let updated_row = e.target.parentElement.parentElement;
  let id = updated_row.getAttribute("data-id");
  let now = new Date();
  const event = {
    updated: now,
    updated_by:user,
    time: updated_row.cells[0].firstChild.value,
    position: updated_row.cells[1].firstChild.value.toUpperCase(),
    registration: updated_row.cells[2].firstChild.value.toUpperCase(),
    defect: updated_row.cells[3].firstChild.value.toUpperCase(),
    notes: updated_row.cells[4].firstChild.value.toUpperCase(),
    sl: updated_row.cells[5].firstChild.checked,
    solved: updated_row.cells[6].firstChild.checked,
  };
  db.collection("events").doc(id).update(event).then(function () {
    updated_row.querySelector('.fa-save').classList.add('d-none');
    alert('Event saved!');
  });
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

function timer(e) {
  let id = e.target.parentElement.parentElement.getAttribute("data-id");
  $("#timer").modal("show");
  event_reminder_form.addEventListener('submit', function(e){
    e.preventDefault();
    const reminder_data={
      reminder_time:this.update_time.value,
      reminder_remarks:this.remarks.value
    }
    // db.collection("events")
    //   .doc(id)
    //   .update(reminder_data)
    //   .then(function () {
        console.log("event updated!");
        console.log(event_reminder_form.update_time.value);
        // $("#timer").modal("hide");
        event_reminder_form.reset();
      // });
    
    
  })
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