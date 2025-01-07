let aircraft_types=[];
window.addEventListener('aircraftsUpdated', function(e){
    const select_type_element = document.createElement("select");
    aircrafts.forEach(aircraft => {
        if (!aircraft_types.includes(aircraft.doc.data().TYPE)) {
            aircraft_types.push(aircraft.doc.data().TYPE);
        }
    });
    aircraft_types.forEach((type) => {
      const opt = document.createElement("option");
      opt.text = type;
      select_type_element.appendChild(opt);
      document.querySelector("body").appendChild(select_type_element);
    });
});
fetchAircrafts();

