// **************************************************************************
function fetchAircrafts() {
  db.collection("aircrafts")
    .orderBy("REGISTRATION")
    .onSnapshot(function (snapshot) {
      aircrafts = snapshot.docChanges();
      // You can call a global function or notify other scripts
      window.dispatchEvent(new Event('aircraftsUpdated'));
    });
}

function getAircrafts() {
  return aircrafts;
}

// Expose to the global window object
window.fetchAircrafts = fetchAircrafts;
window.getAircrafts = getAircrafts;
// **************************************************************************

// **************************************************************************
function fetchEvents() {
  db.collection("events")
    .orderBy("time")
    .onSnapshot(function (snapshot) {
      events = snapshot.docChanges();
      // You can call a global function or notify other scripts
      window.dispatchEvent(new Event('eventsUpdated'));
    });
}

function getEvents() {
  return events;
}

// Expose to the global window object
window.fetchEvents = fetchEvents;
window.getEvents = getEvents;
// ****************************************************************************