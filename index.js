const fs = require("fs");
const { generateReceipts } = require("./generateMealsReceipts");
const { getRemainingWorkingDays } = require("./analyze");
const categorizeFile = require("./categorizeFile");
const sendExpenseToAPI = require("./sendExpenseToAPI");
const config = require("./config.json");
const { get } = require("http");

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
  console.log("Expenses Size:", expenses.length);
  console.log("Expenses:", expenses);
  console.log("\n");
  console.log("TOTAL Amount:", expenses.reduce((acc, item) => acc + item.amount, 0));
  console.log("\n");

  // Analyzing current expenses and Get the working days of current month
  const remainingDays = getRemainingWorkingDays('06.12.24','26.01.25', expenses.filter(e => e.type === 'M')
    , ['25.12.24', '01.01.25']);
  console.log('remainingDays: ', remainingDays);

  // generateReceipts(remainingDays).catch((err) => console.error(err));

  await processAndSendExpenses(expenses);
});
