import { PdfReader } from "./index.js";
import fs from "fs";
// Import TableParser correctly if it's exported directly
// For example, if TableParser is exported from the root, adjust the path accordingly
import { TableParser } from "./lib/TableParser.js";

const filename = "/workspaces/npm-pdfreader-kbs/test/sample-table.pdf"; // Adjust path to your PDF
const outputCsvFilename = "output.csv"; // Output CSV file path

// Helper functions adapted for CSV output
const padColumns = (array, nb) => Array.apply(null, { length: nb }).map((val, i) => array[i] || []);
const mergeCells = (cells) => (cells || []).map((cell) => cell.text).join('');
const renderCsv = (matrix, nbCols) => (matrix || [])
  .map((row) => padColumns(row, nbCols).map(mergeCells).join(",")).join("\n");

let table = new TableParser();

new PdfReader().parseFileItems(filename, function(err, item) {
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
