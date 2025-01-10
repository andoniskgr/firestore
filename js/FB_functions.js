const resultTable = document.querySelector("#table_data");
const new_event_form = document.querySelector("#new_event_form");
const event_reminder_form = document.querySelector("#event_reminder_form");
const my_modals = document.querySelectorAll('.modal');
const show_solved_events_btn=document.querySelector('#btn_table_sel_ok');
const show_in_progress_events_btn=document.querySelector('#btn_table_sel_inp');
const show_all_events_btn=document.querySelector('#btn_table_sel_all');
const delete_all_events_btn=document.querySelector('#btn_table_del_all');



// listeners
new_event_form.addEventListener("submit", save_event);
event_reminder_form.addEventListener("submit", function(e){
  console.log(e.target);  
});
delete_all_events_btn.addEventListener('click', delete_all_events);

function delete_all_events(){
console.log('delete events');
let response = window.confirm("Are you sure you want to delete this Event?");
  if (response) {
    let id = e.target.parentElement.parentElement.getAttribute("data-id");
    console.log(id);
    db.collection(events_collection).doc(id).delete();
    let del_event = resultTable.querySelector(
      `[data-id="${id}"]`
    );
  }
}


// adding listeners to modals
my_modals.forEach(function(modal){  
  modal.addEventListener('shown.bs.modal',function(e){
    if (modal.id=='loginModal' || modal.id=='registerModal') {
      modal.querySelector('[name="email"]').focus();
    } else if (modal.id=='new_event'){
      modal.querySelector('[name="time"]').value=current_time();
      modal.querySelector('[name="registration"]').focus();
    }    
  });  
  modal.addEventListener('hidden.bs.modal',function(e){
    modal.querySelector('form').reset();
  });  
});


// function that creates table row elements
function renderResultTable(doc=[]) {
  // console.log('renderResultTable start');
  if (doc.length==0) {
    resultTable.innerHTML = '';
  } else {
    document.querySelector('table').classList.remove('d-none');
  let event_row='';
  let tr_class='';

  // control table row color according checkboxes
switch (true) {
  case (doc.data().sl==false && doc.data().solved==false):
        tr_class = "table-light";
    break;
  case (doc.data().sl==true && doc.data().solved==false):
        tr_class = "table-warning";
    break;
  case (doc.data().sl==true && doc.data().solved==true):
        tr_class = "table-success";
    break;
  case (doc.data().sl==false && doc.data().solved==true):
        tr_class = "table-success";
    break;
  default:
    tr_class = "table-light";
    break;
}

    event_row = `<tr class="${tr_class}" data-id="${doc.id}">
  <td id="time"><input size="6" value="${doc.data().time}" oninput=edit_event(event)></td>
  <td id="registration"><input size="7" value="${doc.data().registration}" class="text-uppercase" oninput=edit_event(event)></td>
  <td id="position"><input size="6" value="${doc.data().position}" class="text-uppercase" oninput=edit_event(event)></td>
  <td id="eta"><input size="6" value="${doc.data().eta}" oninput=edit_event(event)></td>
  <td id="etd"><input size="6" value="${doc.data().etd}" oninput=edit_event(event)></td>
  <td id="occ_upd"><input size="6" value="${doc.data().occ_upd}" oninput=edit_event(event)></td>
  <td id="defect"><input value="${doc.data().defect}" class="w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="notes"><input value="${doc.data().notes}" class="w-100 text-uppercase" oninput=edit_event(event)></td>
  <td id="sl" class="text-center"><input type="checkbox" ${doc.data().sl ? 'checked' : ''} oninput=edit_event(event)></td>
  <td id="rst" class="text-center"><input type="checkbox" ${doc.data().rst ? 'checked' : ''} oninput=edit_event(event)></td>
  <td id="solved" class="text-center"><input type="checkbox" ${doc.data().solved ? 'checked' : ''} oninput=edit_event(event)></td>
  <td class="text-nowrap"><span class="text-danger fa fa-trash-o" id="delete_icon" style="font-size: 1.5em;" onclick=delete_event(event)></span>
  <span class="text-primary fa fa-clock-o ms-3 d-none" style="font-size: 1.3em;"></span>
  <span class="text-success fa fa-save ms-3 d-none" style="font-size: 1.4em;" onclick="save_edit_event(event)"></span></td>
  </tr>`;
  resultTable.innerHTML += event_row; 
}
  // console.log("renderResultTable end");
}


function get_real_time_data(user=null){  
if (user!=null) {
window.addEventListener('eventsUpdated',function(){  
  
      if (events.length==0) {
        console.log('no events');
        document.querySelector('table').classList.add('d-none');
        flash_message('There is no Data!')
      } else {
        flash_message();
        events.forEach((event) => {
            if (event.type == "added") {
              renderResultTable(event.doc);
            }else if (event.type == "removed") {
              if (events.length==0) {
                flash_message('There is no Data!');
              }
            }
        });
      }  
  })
  window.fetchEvents();
}
  else {
    document.querySelector('table').classList.add('d-none');
    flash_message("You need to login for access!")
    renderResultTable();
  }  
}



// save data to firestore
function save_event(e) {
  user = auth.currentUser.email;
  e.preventDefault();
  console.log("save_event");
  now = new Date();
  const event = {
    created: now,
    created_by: user,
    time: new_event_form.time.value,
    position: new_event_form.position.value.toUpperCase(),
    eta: new_event_form.eta.value,
    etd: new_event_form.etd.value,
    occ_upd: new_event_form.occ_upd.value,
    registration: new_event_form.registration.value.toUpperCase(),
    defect: new_event_form.defect.value.toUpperCase(),
    notes: new_event_form.notes.value.toUpperCase(),
    sl: new_event_form.sl.checked,
    rst: new_event_form.rst.checked,
    solved: new_event_form.solved.checked,
  };
  // Hide modal and reset the fields
  $(".modal").modal("hide");
  new_event_form.reset();
  save_event_to_db(event);
}

function save_event_to_db(event){
  let d=String(event.created.getDate());
  let m=String(event.created.getMonth()+1);
  d=d.length<2? +"0"+d : d;
  m=m.length<2? +"0"+m : m;
  const date=`${d}_${m}`;
   
  db.collection(events_collection).add(event).then(function () {
    console.log('Event saved!');
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
    db.collection(events_collection).doc(id).delete();
    let del_event = resultTable.querySelector(
      `[data-id="${id}"]`
    );
    resultTable.removeChild(del_event);
    // get_real_time_data();
  } else {
    return;
  }
}

// edit Event
function edit_event(e) {
  e.stopPropagation();
  if (
    e.target.parentElement.id == "time" ||
    e.target.parentElement.id == "eta" ||
    e.target.parentElement.id == "etd" ||
    e.target.parentElement.id == "occ_upd"
  ) {
    formatTime(e);
  }
  
  let updated_row = e.target.parentElement.parentElement;
  updated_row.querySelector('.fa-save').classList.remove('d-none');

  if (
    updated_row.cells[8].firstChild.checked == false &&
    updated_row.cells[10].firstChild.checked == false
  ) {
    updated_row.className = "table-light";
  }
  if (updated_row.cells[8].firstChild.checked == true) {
    updated_row.className = "table-warning";
  }
  if (updated_row.cells[10].firstChild.checked == true) {
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
    registration: updated_row.cells[1].firstChild.value.toUpperCase(),
    position: updated_row.cells[2].firstChild.value.toUpperCase(),
    eta: updated_row.cells[3].firstChild.value,
    etd: updated_row.cells[4].firstChild.value,
    occ_upd: updated_row.cells[5].firstChild.value,
    defect: updated_row.cells[6].firstChild.value.toUpperCase(),
    notes: updated_row.cells[7].firstChild.value.toUpperCase(),
    sl: updated_row.cells[8].firstChild.checked,
    rst: updated_row.cells[9].firstChild.checked,
    solved: updated_row.cells[10].firstChild.checked,
  };
  db.collection(events_collection).doc(id).update(event).then(function () {
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

function current_time(){
  let now=new Date();
  let hrs=now.getHours();
  let min=now.getMinutes();
  if (hrs<10) {
    hrs='0'+String(hrs);    
  }
  if (min<10) {
    min='0'+String(min);    
  }
  return `${hrs}:${min}`;
}

function get_aircrafts(){
  let aircrafts=[
      {
          "REGISTRATION": "SX-DGA",
          "TYPE": "A321-231",
          "EFFECTIVITY": "104",
          "MSN": "3878",
          "SELCAL": "AS-CJ",
          "WV": "000",
          "DATE_RECEIVED": "24/4/2009",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DGB",
          "TYPE": "A320-232",
          "EFFECTIVITY": "018",
          "MSN": "4165",
          "SELCAL": "DH-ES",
          "WV": "010",
          "DATE_RECEIVED": "19/1/2010",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DGC",
          "TYPE": "A320-232",
          "EFFECTIVITY": "401",
          "MSN": "4094",
          "SELCAL": "CE-DQ",
          "WV": "011",
          "DATE_RECEIVED": "6/5/2011",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DGD",
          "TYPE": "A320-232",
          "EFFECTIVITY": "302",
          "MSN": "4065",
          "SELCAL": "CF-PQ",
          "WV": "012",
          "DATE_RECEIVED": "6/5/2011",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DGE",
          "TYPE": "A320-232",
          "EFFECTIVITY": "301",
          "MSN": "3990",
          "SELCAL": "CG-PQ",
          "WV": "012",
          "DATE_RECEIVED": "6/5/2011",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DGI",
          "TYPE": "A320-232",
          "EFFECTIVITY": "151",
          "MSN": "3162",
          "SELCAL": "QS-MP",
          "WV": "016",
          "DATE_RECEIVED": "18/12/2023",
          "WIFI": "-",
          "CLS": "-",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DGT",
          "TYPE": "A321-231",
          "EFFECTIVITY": "109",
          "MSN": "1433",
          "SELCAL": "JP-CK",
          "WV": "000",
          "DATE_RECEIVED": "27/3/2015",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DGY",
          "TYPE": "A320-232",
          "EFFECTIVITY": "651",
          "MSN": "6611",
          "SELCAL": "DR-QS",
          "WV": "017",
          "DATE_RECEIVED": "16/6/2015",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DGZ",
          "TYPE": "A320-232",
          "EFFECTIVITY": "652",
          "MSN": "6643",
          "SELCAL": "GH-AP",
          "WV": "017",
          "DATE_RECEIVED": "26/6/2015",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DNA",
          "TYPE": "A320-232",
          "EFFECTIVITY": "653",
          "MSN": "6655",
          "SELCAL": "LQ-FJ",
          "WV": "017",
          "DATE_RECEIVED": "30/6/2015",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DNB",
          "TYPE": "A320-232",
          "EFFECTIVITY": "654",
          "MSN": "6832",
          "SELCAL": "LQ-CD",
          "WV": "017",
          "DATE_RECEIVED": "27/11/2015",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DNC",
          "TYPE": "A320-232",
          "EFFECTIVITY": "655",
          "MSN": "6961",
          "SELCAL": "CD-JR",
          "WV": "017",
          "DATE_RECEIVED": "12/2/2016",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DND",
          "TYPE": "A320-232",
          "EFFECTIVITY": "656",
          "MSN": "6989",
          "SELCAL": "CM-KS",
          "WV": "017",
          "DATE_RECEIVED": "7/3/2016",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DNE",
          "TYPE": "A320-232",
          "EFFECTIVITY": "657",
          "MSN": "7014",
          "SELCAL": "DS-EH",
          "WV": "017",
          "DATE_RECEIVED": "17/3/2016",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DNG",
          "TYPE": "A321-231",
          "EFFECTIVITY": "111",
          "MSN": "2610",
          "SELCAL": "AF-EH",
          "WV": "011",
          "DATE_RECEIVED": "15/6/2018",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DNH",
          "TYPE": "A321-231",
          "EFFECTIVITY": "112",
          "MSN": "3546",
          "SELCAL": "FQ-LP",
          "WV": "000",
          "DATE_RECEIVED": "25/5/2018",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVG",
          "TYPE": "A320-232",
          "EFFECTIVITY": "001",
          "MSN": "3033",
          "SELCAL": "GJ-DL",
          "WV": "008",
          "DATE_RECEIVED": "21/2/2007",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVH",
          "TYPE": "A320-232",
          "EFFECTIVITY": "002",
          "MSN": "3066",
          "SELCAL": "GK-BH",
          "WV": "008",
          "DATE_RECEIVED": "19/3/2007",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVI",
          "TYPE": "A320-232",
          "EFFECTIVITY": "003",
          "MSN": "3074",
          "SELCAL": "GK-HL",
          "WV": "008",
          "DATE_RECEIVED": "20/3/2007",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVJ",
          "TYPE": "A320-232",
          "EFFECTIVITY": "004",
          "MSN": "3365",
          "SELCAL": "HJ-EP",
          "WV": "008",
          "DATE_RECEIVED": "15/1/2008",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVK",
          "TYPE": "A320-232",
          "EFFECTIVITY": "005",
          "MSN": "3392",
          "SELCAL": "HJ-FP",
          "WV": "008",
          "DATE_RECEIVED": "12/2/2008",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVL",
          "TYPE": "A320-232",
          "EFFECTIVITY": "006",
          "MSN": "3423",
          "SELCAL": "HK-QS",
          "WV": "008",
          "DATE_RECEIVED": "12/3/2008",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVM",
          "TYPE": "A320-232",
          "EFFECTIVITY": "007",
          "MSN": "3439",
          "SELCAL": "HL-MS",
          "WV": "008",
          "DATE_RECEIVED": "19/3/2008",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVN",
          "TYPE": "A320-232",
          "EFFECTIVITY": "008",
          "MSN": "3478",
          "SELCAL": "MQ-GH",
          "WV": "008",
          "DATE_RECEIVED": "22/4/2008",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVQ",
          "TYPE": "A320-232",
          "EFFECTIVITY": "009",
          "MSN": "3526",
          "SELCAL": "FK-QR",
          "WV": "010",
          "DATE_RECEIVED": "24/6/2008",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVR",
          "TYPE": "A320-232",
          "EFFECTIVITY": "011",
          "MSN": "3714",
          "SELCAL": "AG-HR",
          "WV": "008",
          "DATE_RECEIVED": "21/11/2008",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVS",
          "TYPE": "A320-232",
          "EFFECTIVITY": "010",
          "MSN": "3709",
          "SELCAL": "AG-HS",
          "WV": "008",
          "DATE_RECEIVED": "4/12/2008",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVT",
          "TYPE": "A320-232",
          "EFFECTIVITY": "012",
          "MSN": "3745",
          "SELCAL": "AG-PQ",
          "WV": "010",
          "DATE_RECEIVED": "16/1/2009",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVV",
          "TYPE": "A320-232",
          "EFFECTIVITY": "014",
          "MSN": "3773",
          "SELCAL": "AQ-BG",
          "WV": "008",
          "DATE_RECEIVED": "4/2/2009",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVW",
          "TYPE": "A320-232",
          "EFFECTIVITY": "015",
          "MSN": "3785",
          "SELCAL": "AQ-BK",
          "WV": "008",
          "DATE_RECEIVED": "11/2/2009",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVX",
          "TYPE": "A320-232",
          "EFFECTIVITY": "016",
          "MSN": "3829",
          "SELCAL": "AQ-GK",
          "WV": "008",
          "DATE_RECEIVED": "18/3/2009",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVY",
          "TYPE": "A320-232",
          "EFFECTIVITY": "017",
          "MSN": "3850",
          "SELCAL": "AQ-JL",
          "WV": "008",
          "DATE_RECEIVED": "14/4/2009",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-DVZ",
          "TYPE": "A321-231",
          "EFFECTIVITY": "103",
          "MSN": "3820",
          "SELCAL": "ΑR-ΕΜ",
          "WV": "000",
          "DATE_RECEIVED": "3/3/2009",
          "WIFI": "-",
          "CLS": "OK",
          "ENGINE": "IAE V2500"
      },
      {
          "REGISTRATION": "SX-NAA",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "751",
          "MSN": "9553",
          "SELCAL": "LS-EP",
          "WV": "051",
          "DATE_RECEIVED": "30/9/2020",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAB",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "752",
          "MSN": "9575",
          "SELCAL": "GQ-DP",
          "WV": "051",
          "DATE_RECEIVED": "20/11/2020",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAC",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "753",
          "MSN": "10189",
          "SELCAL": "CS-GK",
          "WV": "051",
          "DATE_RECEIVED": "17/12/2020",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAD",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "754",
          "MSN": "10305",
          "SELCAL": "AB-DG",
          "WV": "051",
          "DATE_RECEIVED": "28/7/2021",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAE",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "755",
          "MSN": "10704",
          "SELCAL": "EH-AJ",
          "WV": "051",
          "DATE_RECEIVED": "8/3/2022",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAF",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "756",
          "MSN": "10920",
          "SELCAL": "GL-JR",
          "WV": "051",
          "DATE_RECEIVED": "31/5/2022",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAG",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "757",
          "MSN": "11011",
          "SELCAL": "GH-AC",
          "WV": "051",
          "DATE_RECEIVED": "19/9/2022",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAH",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "758",
          "MSN": "10844",
          "SELCAL": "FM-HP",
          "WV": "051",
          "DATE_RECEIVED": "22/6/2022",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAJ",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "759",
          "MSN": "10832",
          "SELCAL": "CG-JL",
          "WV": "051",
          "DATE_RECEIVED": "29/7/2022",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAK",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "760",
          "MSN": "10951",
          "SELCAL": "QS-CK",
          "WV": "051",
          "DATE_RECEIVED": "31/8/2022",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAL",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "761",
          "MSN": "10967",
          "SELCAL": "PR-CF",
          "WV": "051",
          "DATE_RECEIVED": "23/9/2022",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAM",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "762",
          "MSN": "11085",
          "SELCAL": "GS-AF",
          "WV": "051",
          "DATE_RECEIVED": "16/12/2022",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAO",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "763",
          "MSN": "11827",
          "SELCAL": "AB-GL",
          "WV": "051",
          "DATE_RECEIVED": "28/5/2024",
          "WIFI": "-",
          "CLS": "-",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NAP",
          "TYPE": "A321-271NX",
          "EFFECTIVITY": "764",
          "MSN": "12381",
          "SELCAL": "AE-QR",
          "WV": "051",
          "DATE_RECEIVED": "23/12/2024",
          "WIFI": "-",
          "CLS": "-",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEA",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "702",
          "MSN": "9497",
          "SELCAL": "BM-GQ",
          "WV": "069",
          "DATE_RECEIVED": "27/1/2020",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEB",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "703",
          "MSN": "9514",
          "SELCAL": "DM-JP",
          "WV": "069",
          "DATE_RECEIVED": "31/1/2020",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEC",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "704",
          "MSN": "9583",
          "SELCAL": "FK-AH",
          "WV": "069",
          "DATE_RECEIVED": "11/3/2020",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NED",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "705",
          "MSN": "10047",
          "SELCAL": "HM-JP",
          "WV": "069",
          "DATE_RECEIVED": "18/6/2020",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEE",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "706",
          "MSN": "10901",
          "SELCAL": "FQ-ER",
          "WV": "069",
          "DATE_RECEIVED": "30/6/2022",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEF",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "707",
          "MSN": "11013",
          "SELCAL": "MR-DJ",
          "WV": "069",
          "DATE_RECEIVED": "30/11/2022",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEG",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "708",
          "MSN": "11132",
          "SELCAL": "BJ-AM",
          "WV": "069",
          "DATE_RECEIVED": "15/3/2023",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEH",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "709",
          "MSN": "11308",
          "SELCAL": "BJ-ES",
          "WV": "069",
          "DATE_RECEIVED": "17/2/2023",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEI",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "710",
          "MSN": "11338",
          "SELCAL": "JQ-HL",
          "WV": "069",
          "DATE_RECEIVED": "31/8/2023",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEJ",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "712",
          "MSN": "11384",
          "SELCAL": "JS-GK",
          "WV": "069",
          "DATE_RECEIVED": "25/4/2023",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEK",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "711",
          "MSN": "11382",
          "SELCAL": "DP-AK",
          "WV": "069",
          "DATE_RECEIVED": "27/3/2023",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEL",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "713",
          "MSN": "11399",
          "SELCAL": "GJ-MS",
          "WV": "069",
          "DATE_RECEIVED": "12/4/2023",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEM",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "715",
          "MSN": "11474",
          "SELCAL": "KR-AM",
          "WV": "069",
          "DATE_RECEIVED": "17/5/2023",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEO",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "701",
          "MSN": "9400",
          "SELCAL": "AJ-PS",
          "WV": "069",
          "DATE_RECEIVED": "19/12/2019",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEP",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "716",
          "MSN": "11546",
          "SELCAL": "DK-RS",
          "WV": "069",
          "DATE_RECEIVED": "24/8/2023",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NEQ",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "714",
          "MSN": "11469",
          "SELCAL": "DL-HS",
          "WV": "069",
          "DATE_RECEIVED": "11/5/2023",
          "WIFI": "OK",
          "CLS": "OK",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NER",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "718",
          "MSN": "12079",
          "SELCAL": "AC-EP",
          "WV": "069",
          "DATE_RECEIVED": "16/5/2024",
          "WIFI": "-",
          "CLS": "-",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NES",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "717",
          "MSN": "12094",
          "SELCAL": "GM-AQ",
          "WV": "069",
          "DATE_RECEIVED": "6/6/2024",
          "WIFI": "-",
          "CLS": "-",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-NET",
          "TYPE": "A320-271N",
          "EFFECTIVITY": "719",
          "MSN": "12070",
          "SELCAL": "JS-CQ",
          "WV": "069",
          "DATE_RECEIVED": "9/10/2024",
          "WIFI": "-",
          "CLS": "-",
          "ENGINE": "PW 1100"
      },
      {
          "REGISTRATION": "SX-BIP",
          "TYPE": "DHC-8-102",
          "EFFECTIVITY": "",
          "MSN": "347",
          "SELCAL": "",
          "WV": "",
          "DATE_RECEIVED": "29/9/2009",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 120A"
      },
      {
          "REGISTRATION": "SX-BIR",
          "TYPE": "DHC-8-102",
          "EFFECTIVITY": "",
          "MSN": "364",
          "SELCAL": "",
          "WV": "",
          "DATE_RECEIVED": "29/9/2009",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 120A"
      },
      {
          "REGISTRATION": "SX-OAX",
          "TYPE": "ATR42-500 v. 600",
          "EFFECTIVITY": "",
          "MSN": "1016",
          "SELCAL": "EQ-GJ",
          "WV": "",
          "DATE_RECEIVED": "20/7/2016",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OAY",
          "TYPE": "ATR42-500 v. 600",
          "EFFECTIVITY": "",
          "MSN": "1002",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "6/8/2021",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OAZ",
          "TYPE": "ATR42-500 v. 600",
          "EFFECTIVITY": "",
          "MSN": "1005",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "21/9/2021",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBJ",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "1325",
          "SELCAL": "FG-CJ",
          "WV": "",
          "DATE_RECEIVED": "30/11/2021",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBM",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "1058",
          "SELCAL": "EP-DK",
          "WV": "",
          "DATE_RECEIVED": "18/1/2022",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBI",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "1295",
          "SELCAL": "EH-LR",
          "WV": "",
          "DATE_RECEIVED": "3/2/2022",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBN",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "1073",
          "SELCAL": "MR-DK",
          "WV": "",
          "DATE_RECEIVED": "11/5/2022",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBK",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "1020",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "23/5/2022",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBL",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "1027",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "3/6/2022",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBP",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "1033",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "10/6/2022",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBO",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "1053",
          "SELCAL": "JS-DE",
          "WV": "",
          "DATE_RECEIVED": "22/6/2022",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBQ",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "0996",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "8/7/2022",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBR",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "1129",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "21/3/2023",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBS",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "1693",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "29/3/2024",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-OBT",
          "TYPE": "ATR72-212A v. 600",
          "EFFECTIVITY": "",
          "MSN": "1699",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "1/8/2024",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PW 127"
      },
      {
          "REGISTRATION": "SX-BNR",
          "TYPE": "LEARJET 60",
          "EFFECTIVITY": "",
          "MSN": "231",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "6/5/2011",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "PWC 305"
      },
      {
          "REGISTRATION": "SX-VVN",
          "TYPE": "GULFSTREAM 650",
          "EFFECTIVITY": "",
          "MSN": "6018",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "-",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "RRD BR725"
      },
      {
          "REGISTRATION": "SX-VVO",
          "TYPE": "GULFSTREAM 550 GV-SP",
          "EFFECTIVITY": "",
          "MSN": "5364",
          "SELCAL": "-",
          "WV": "",
          "DATE_RECEIVED": "-",
          "WIFI": "",
          "CLS": "",
          "ENGINE": "RRD BR710"
      }
  ];
  
    // aircrafts.forEach(function(aircraft){
    //   db.collection("aircrafts").add(aircraft).then(function () {
    //     console.log('Event saved!');
    //   });      
    // })
    aircrafts.forEach(function(aircraft){
      aircraft.NOTE="";
      aircraft.ACTIVE=true;
      db.collection(aircrafts_collection).add(aircraft).then(function(){
        console.log('saved:',aircraft);
      })
    })
    
 
  
}

// *****************************************************************
// Wait for aircrafts to be updated
window.addEventListener('aircraftsUpdated', function() {
  // console.log(window.getAircrafts()); // This will give you the latest aircrafts
  const aircraft_datalist=document.createElement('datalist');
  aircraft_datalist.id='registrations'
  const registration_selection = new_event_form.registration
  aircrafts.forEach((aircraft) => {
      // check if the aircraft is active
      if (!aircraft.doc.data().ACTIVE) {
        return;
      }
      let newOptionItem = document.createElement("option");
      // newOptionItem.text = aircraft.doc.data().REGISTRATION;
      newOptionItem.value = aircraft.doc.data().REGISTRATION;
    //  console.log(registration_selection);
     
      aircraft_datalist.appendChild(newOptionItem);
    });
    registration_selection.appendChild(aircraft_datalist);
});

// Call fetchAircrafts when the page loads or based on some event
window.fetchAircrafts();
// *****************************************************************