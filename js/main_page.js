const events = [
  { time: "11:20", registartion: "NEA", defect: "cabin", action: "OK" },
  { time: "12:30", registartion: "NEB", defect: "engine", action: "MEL" },
  { time: "13:50", registartion: "NEC", defect: "propeller", action: "AOG" }
]


auth.onAuthStateChanged((user) => {
  if (user == null) {
    window.location.replace('index.html');
  }
});

window.addEventListener("DOMContentLoaded", function () {
  const logout_btn = this.document.querySelector("#logout_link");
  logout_btn.addEventListener("click", logout);
  result(events);
});

function logout() {
  let response = window.confirm("Are you sure you want to log out?");
  if (response) {
    auth.signOut();
    window.location.replace('index.html');
  } else {
    return;
  }
}


function result(doc) {
  tableData = this.document.querySelector("tableBody");
  data = "";
  doc.forEach(event => {
    data = `${event}`
    console.log(event);
    tableData.innerHTML += data;
  });
  
  console.log(tableData);
  
}

