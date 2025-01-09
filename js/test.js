

    // Fetching events from Firestore
async function fetchEvents1() {
    try {
    //   const db = firebase.firestore(); // Assuming you initialized Firebase globally
    let events=[];
      const querySnapshot = await db.collection('events1').orderBy('time').onSnapshot(function(snapshot){
        events=snapshot.docChanges();
      })
      
    //   const events = [];
    //   querySnapshot.forEach((doc) => {
    //     events.push(doc.data()); // Collect events
    //   });
  
      // Create and dispatch the custom event with the events data
      const event = new CustomEvent('eventsFetched', {
        detail: { events: events }
      });
      
      // Dispatch the event globally (on the document)
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }
  
fetchEvents1();