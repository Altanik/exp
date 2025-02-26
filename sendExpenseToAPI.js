const axios = require("axios");
const path = require("path");
const config = require("./config.json");
const getRandomGuests = require("./getRandomGuests");
const uploadFileAsBase64 = require("./uploadFileAsBase64");

const expenseCategoryMap = {
  "S": {namePrefix: "SOFTWARE", category: 5},
  "T": {namePrefix: "TRANSPORT", category: 15},
  "I": {namePrefix: "INTERNET PLAN", category: 3},
  "C": {namePrefix: "CELL PLAN", category: 2},
  "R": {namePrefix: "HARDWARE REPAIR", category: 20},
  "M": {namePrefix: "MEAL", category: 1},
  "G": {namePrefix: "GROUP MEAL", category: 4}
};
async function sendExpenseToAPI(expense, failedExpenses) {
  const attachments = await Promise.all(
    expense.files.map(async (fileName) => {
      const filePath = path.join(config.DIRECTORY_PATH, fileName);
      try {
        const attachmentId = await uploadFileAsBase64(filePath, expenseCategoryMap[expense.type].category);
        return attachmentId ? { id: attachmentId } : null;
      } catch (error) {
        console.error("Failed to get attachment ID for:", filePath);
        return null;
      }
    })
  ).then((results) => results.filter((result) => result !== null));

  if (attachments.length === 0) {
    console.error(
      "No attachments were uploaded successfully for expense on:",
      expense
    );
    failedExpenses.push(expense);
    return;
  }

  const [day, month, year] = expense.date.split("/");
  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}T00:00:00.000+01:00`;
  const data = {
    additional_information: expense.type === "G" ? await getRandomGuests(expense.nbPersons) : "{}",
    amount: parseInt(expense.amount * 100),
    amount_wo_vat: null,
    attachments,
    category: expenseCategoryMap[expense.type].category,
    // client: "e0f099e1-92ae-4a76-8308-8512f954f188",
    date: formattedDate,
    // mission: "9e768864-8c2c-4806-ad7e-51f71810286f",
    name: `${expenseCategoryMap[expense.type].namePrefix} ${expense.date}`,
    rebillable: false,
  };
  if(data.date.startsWith('2025-02')) {
    data.mission = "prospecting";
  } else {
    data.mission = "eaf176c2-c23d-4685-abe1-90dd6d5dd8b4";
    data.client = "e0f099e1-92ae-4a76-8308-8512f954f188";
  }

  console.log("Sending expense for:", JSON.stringify(data));
  
  try {
    const response = await axios.post(
      "https://app.join-jump.com/api/expenses-api/v3/expenses",
      data,
      {
        headers: {
          Authorization: `Bearer ${config.USER_TOKEN}`,
          "x-jump-offer-id": 'eaf176c2-c23d-4685-abe1-90dd6d5dd8b4',
        },
      }
    );

    if (response.status !== 204) {
      throw new Error(`Failed to send expense. Status: ${response.status}`);
    }

    console.log("Expense sent successfully for:", expense, response.data);
  } catch (error) {
    console.error(
      "Error sending expense for:",
      expense,
      "; Error:",
      error.response ? error.response.data : error
    );
    failedExpenses.push(expense);
  }
}

module.exports = sendExpenseToAPI;
