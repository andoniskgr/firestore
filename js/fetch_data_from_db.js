// **************************************************************************
function fetchAircrafts() {
  const myevent=new Event('aircraftsUpdated');
  db.collection(aircrafts_collection)
    .orderBy("REGISTRATION")
    .onSnapshot(function (snapshot) {
      aircrafts = snapshot.docChanges();     
      window.dispatchEvent(myevent);
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
  const myevent=new Event('eventsUpdated');
  db.collection(events_collection)
    .orderBy("time")
    .onSnapshot(function (snapshot) {
      events = snapshot.docChanges();
      window.dispatchEvent(myevent);
    });
}

function getEvents() {
  return events;
}

// Expose to the global window object
window.fetchEvents = fetchEvents;
window.getEvents = getEvents;
// ****************************************************************************