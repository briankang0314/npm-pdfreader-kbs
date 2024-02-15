const { PdfReader } = require("pdfreader");
const fs = require("fs");

const filename = "path/to/your/sample-table.pdf"; // Adjust path to your PDF
const outputCsvFilename = "output.csv"; // Output CSV file path

// Helper functions from parseTable.js, adapted for CSV output
const padColumns = (array, nb) => Array.apply(null, { length: nb }).map((val, i) => array[i] || []);
const mergeCells = (cells) => (cells || []).map((cell) => cell.text).join('');
const renderCsv = (matrix, nbCols) => (matrix || [])
  .map((row) => padColumns(row, nbCols).map(mergeCells).join(",")).join("\n");

let table = new (require("pdfreader").TableParser)();

new PdfReader().parseFileItems(filename, function (err, item) {
  if (err) console.error("PDF parsing error:", err);
  else if (!item) { // End of file
    const csvContent = renderCsv(table.getMatrix(), 5); // Adjust '5' to match the number of columns in your PDF table
    fs.writeFileSync(outputCsvFilename, csvContent);
    console.log(`CSV file has been written to ${outputCsvFilename}`);
  } else if (item && item.text) {
    const columnQuantitizer = (item) => true; // Define logic to identify columns, adjust as necessary
    table.processItem(item, columnQuantitizer(item));
  }
});