db.settings({ timestampInSnapshots: true });

const resultTable = document.querySelector("#table_data");
const new_event_form = document.querySelector("#new_event_form");
const myModal = document.querySelector('.modal');

new_event_form.addEventListener("submit", save_event);

function renderResultTable(doc) {
  // create table elements
  let table_row = document.createElement("tr");
  let table_time_data = document.createElement("td");
  let time_data = document.createElement("input");
  let table_position_data = document.createElement("td");
  let position_data = document.createElement("input");
  let table_registration_data = document.createElement("td");
  let registration_data = document.createElement("input");
  let table_defect_data = document.createElement("td");
  let defect_data = document.createElement("input");
  let table_notes_data = document.createElement("td");
  let notes_data = document.createElement("input");
  let table_sl_data = document.createElement("td");
  let table_solved_data = document.createElement("td");
  let table_action_data = document.createElement("td");
  let sl_data = document.createElement("input");
  let solved_data = document.createElement("input");
  let delete_icon = document.createElement("span");
  let save_icon = document.createElement("span");

  // assign table values and attributes
  table_row.setAttribute("data-id", doc.id);
  time_data.setAttribute("size", 5);
  time_data.value = doc.data().time;
  time_data.setAttribute("oninput",'formatTime(event)');
  position_data.value = doc.data().position;
  position_data.setAttribute("size", 5);
  position_data.className = "text-uppercase";
  registration_data.value = doc.data().registration;
  registration_data.setAttribute("size", 5);
  registration_data.className = "text-uppercase";
  defect_data.value = doc.data().defect;
  defect_data.className = "w-100 text-uppercase";
  notes_data.value = doc.data().notes;
  notes_data.className = "w-100 text-uppercase";
  table_sl_data.className = "text-center";
  table_solved_data.className = "text-center";

  if (doc.data().sl == false && doc.data().solved == false) {
    table_row.className = "table-light";
  }
  if (doc.data().sl == true) {
    table_row.className = "table-warning";
  }

  if (doc.data().solved == true) {
    table_row.className = "table-success";
  }

  Object.assign(sl_data, {
    //assign multiple attributes
    type: "checkbox",
    checked: doc.data().sl,
  });
  Object.assign(solved_data, {
    //assign multiple attributes
    type: "checkbox",
    checked: doc.data().solved,
  });

  delete_icon.className = "fa fa-trash-o";
  delete_icon.style.fontSize = "1.5em";
  save_icon.className = "fa fa-save ms-4 d-none ";
  save_icon.style.fontSize = "1.4em";

  delete_icon.addEventListener("click", delete_event);
  save_icon.addEventListener("click", save_edit_event);
  time_data.addEventListener('input', edit_event);
  position_data.addEventListener('input', edit_event);
  registration_data.addEventListener('input', edit_event);
  defect_data.addEventListener('input', edit_event);
  notes_data.addEventListener('input', edit_event);
  sl_data.addEventListener('input', edit_event);
  solved_data.addEventListener('input', edit_event);

  table_time_data.appendChild(time_data);
  table_position_data.appendChild(position_data);
  table_registration_data.appendChild(registration_data);
  table_defect_data.appendChild(defect_data);
  table_notes_data.appendChild(notes_data);
  table_row.appendChild(table_time_data);
  table_row.appendChild(table_position_data);
  table_row.appendChild(table_registration_data);
  table_row.appendChild(table_defect_data);
  table_row.appendChild(table_notes_data);
  table_row.appendChild(table_sl_data);
  table_sl_data.appendChild(sl_data);
  table_row.appendChild(table_solved_data);
  table_solved_data.appendChild(solved_data);
  table_row.appendChild(table_action_data);
  table_action_data.appendChild(delete_icon);
  table_action_data.appendChild(save_icon);
  resultTable.appendChild(table_row);
}

// get real-time data from firestore
db.collection("events")
  .orderBy("time")
  .onSnapshot(function (snapshot) {
    let changes = snapshot.docChanges();

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
  });

// save data to firestore
function save_event(e) {
  e.preventDefault();
  console.log("save_event");
  now = new Date();
  const event = {
    created: now,
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
  e.stopPropagation();
  let updated_row = e.target.parentElement.parentElement;
  let id = updated_row.getAttribute("data-id");
  let now = new Date();
  const event = {
    updated: now,
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


myModal.addEventListener('shown.bs.modal', event => {
  myModal.querySelector('[name="time"]').focus();
});
myModal.addEventListener('hidden.bs.modal', event => {
  new_event_form.reset();
});

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