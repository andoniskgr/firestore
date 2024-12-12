db.settings({ timestampInSnapshots: true });

const resultTable = document.querySelector("#table_data");
const new_event_form=document.querySelector('#new_event_form');


function renderResultTable(doc) {

  // create table elements
  let table_row = document.createElement("tr");
  let table_time_data = document.createElement("td");
  let table_position_data = document.createElement("td");
  let table_registration_data = document.createElement("td");
  let table_defect_data = document.createElement("td");
  let table_notes_data = document.createElement("td");
  let table_sl_data = document.createElement("td");
  let table_solved_data = document.createElement("td");
  let table_action_data = document.createElement("td");
  let sl_data = document.createElement("input");
  let solved_data = document.createElement("input");
  let delete_icon = document.createElement("span");
  let edit_icon = document.createElement("span");


  // assign table values and attributes
  table_row.setAttribute("data-id", doc.id);
  table_time_data.textContent = doc.data().time;
  table_position_data.textContent = doc.data().position;
  table_registration_data.textContent = doc.data().registration;
  table_defect_data.textContent = doc.data().defect;
  table_notes_data.textContent = doc.data().notes;
  table_sl_data.className = "text-center";
  table_solved_data.className = "text-center";

  if (doc.data().sl==true ) {
    table_row.className='table-warning';
  }

  if (doc.data().solved==true) {
    table_row.className='table-success';
  }
  
  Object.assign(sl_data, {  //assign multiple attributes
    type: "checkbox",
    checked: doc.data().sl,
  });
  Object.assign(solved_data, {  //assign multiple attributes
    type: "checkbox",
    checked: doc.data().solved,
  });

  delete_icon.className="fa fa-trash-o";
  delete_icon.style.fontSize="1.5em";
  edit_icon.className="fa fa-pencil ms-4";
  edit_icon.style.fontSize="1.4em";

  // add event listeners
  new_event_form.addEventListener('submit', save_event);
  delete_icon.addEventListener('click', delete_event);
  edit_icon.addEventListener('click', edit_event);
  
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
  table_action_data.appendChild(edit_icon);
  resultTable.appendChild(table_row);
}

// get data from firestore old
// db.collection("events")
//   .get()
//   .then(function (snapshot) {
//     snapshot.docs.forEach(function (doc) {
//       renderResultTable(doc);
//     });
//   });

// get data from firestore real-time 
db.collection('events').onSnapshot(function(snapshot){ 
  let changes=snapshot.docChanges();
  changes.forEach(change => {
    if (change.type=='added') {
      renderResultTable(change.doc);
    }else if (change.type=='removed') {
      let del_event=resultTable.querySelector('[data-id='+change.doc.id+']');
      resultTable.removeChild(del_event);
    }
    
  });
  
})


// save data to firestore
function save_event(e){
  now=new Date();
  e.preventDefault();
  const event={
    created:now,
    time:new_event_form.time.value,
    position:new_event_form.position.value,
    registration:new_event_form.registration.value,
    defect:new_event_form.defect.value,
    notes:new_event_form.notes.value,
    sl:new_event_form.sl.checked,
    solved:new_event_form.solved.checked,
  }
  $(".modal").modal("hide");
  new_event_form.reset();
  console.log(event);
  db.collection('events').add(event);
}
  

// delete Event
function delete_event(e){
  e.stopPropagation();
  let id=e.target.parentElement.parentElement.getAttribute("data-id");
  console.log(id);
  db.collection('events').doc(id).delete();
  
  
}

// edit Event
function edit_event(){
  console.log('edit event!');
  
}