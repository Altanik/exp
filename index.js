const fs = require("fs");
const { getWorkingDays } = require("./analyze");
const categorizeFile = require("./categorizeFile");
const sendExpenseToAPI = require("./sendExpenseToAPI");
const config = require("./config.json");

const expenses = [];
const failedExpenses = [];

// Function to process and send all expenses
async function processAndSendExpenses(listToProcess) {
  for (const expense of listToProcess) {
    await sendExpenseToAPI(expense, failedExpenses);
    console.log("\n");
  }
}

// Main execution
fs.readdir(config.DIRECTORY_PATH, async (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach((file) => categorizeFile(file, expenses));

  console.log("Inputs:");
  console.log("Expenses:", expenses);
  console.log("\n");

  // await processAndSendExpenses(expenses);
});
