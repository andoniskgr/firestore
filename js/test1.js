const myBtn=document.querySelector('button');



document.addEventListener('eventsFetched', function(e) {
  const events = e.detail.events;
  console.log("Fetched Events:", events);
});
fetchEvents1()