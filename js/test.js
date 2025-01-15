const pdf_btn=document.querySelector('#btn_export_pdf');
pdf_btn.addEventListener('click', exportTableToPDF);

function exportTableToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get the table element
    const table = document.getElementById("myTable");
    
    // Initialize an empty array to store the table data
    let tableData = [];
    console.log('table row length:',table.rows.length);
    
    // Loop through the rows and cells of the table and get the input values
    for (let i = 1; i < table.rows.length; i++) {        
        let rowData = [];
        for (let j = 0; j < table.rows[i].cells.length; j++) {
                console.log(j);
                
            let input_text = table.rows[i].cells[j].querySelector('input[type="text"');
            let input_cb = table.rows[i].cells[j].querySelector('input[type="checkbox"');
            rowData.push(input_text.value); // Get the value of the input field
            
        }
        tableData.push(rowData);
        console.log(rowData);
        
    }
    
    // Create the PDF table
    doc.autoTable({
        head: [Array.from(table.rows[0].cells).map(cell => cell.textContent)], // Using the header row for column titles (if needed)
        body: tableData,
    });

    // // Save the PDF
    doc.save('table-data.pdf');
}