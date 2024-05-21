const axios = require("axios");
const path = require("path");
const config = require("./config.json");
const getRandomGuests = require("./getRandomGuests");
const uploadFileAsBase64 = require("./uploadFileAsBase64");

async function sendExpenseToAPI(expense, failedExpenses) {
  const attachments = await Promise.all(
    expense.files.map(async (fileName) => {
      const filePath = path.join(config.DIRECTORY_PATH, fileName);
      try {
        const attachmentId = await uploadFileAsBase64(filePath);
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
  )}T01:00:00Z`;
  const data = {
    amount: parseInt(expense.amount * 100),
    date: formattedDate,
    attachments,
    name: `MEAL ${expense.date}`,
    category: expense.type === "M" ? 1 : 4,
    client: "e0f099e1-92ae-4a76-8308-8512f954f188",
    rebillable: false,
    additional_information:
      expense.type === "M" ? "{}" : await getRandomGuests(expense.nbPersons),
    amount_wo_vat: null,
  };

  try {
    const response = await axios.post(
      "https://app.join-jump.com/api/expenses-api/v1/expenses",
      data,
      {
        headers: {
          Authorization: `Bearer ${config.USER_TOKEN}`,
          "Content-Type": "application/json",
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
