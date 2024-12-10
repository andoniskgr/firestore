db.settings({timestampInSnapshots:true})

const resultTable=document.querySelector('tbody');

function renderResultText(doc){
  let data='';
  let id= doc.id;
  let time = doc.data().time;
  let position = doc.data().position;
  let registration = doc.data().registration;
  let defect = doc.data().defect;
  
  data='<tr data_id="'+id+'">'+
  '<td>'+'<input size="5" value="'+time+'"></td>'+
  '<td>'+'<input size="6" value="'+position+'"></td>'+
  '<td>'+'<input size="8" value="'+registration+'"></td>'+
  '<td>'+'<input class="w-100" value="'+defect+'"></td>'+
  '<td class="text-center">'+'<input type="checkbox">'+'</td>'+
  '<td class="text-center">'+'<input type="checkbox">'+'</td>'+
  '</tr>'

  resultTable.innerHTML+=data;
}

db.collection('events').get()
.then(function(snapshot){
  snapshot.docs.forEach(doc => {
    renderResultText(doc)  
  }  
    );
  });
  
