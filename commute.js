const axios = require('axios');
const config = require("./config.json");


// Function to parse a date string in 'dd.mm' format into a Date object
function parseDate(dateString) {
  const [day, month] = dateString.split('.').map(Number);
  const currentYear = new Date().getFullYear();
  return new Date(currentYear, month - 1, day);
}

// Function to format a Date object into 'MM-DD' format
function formatDateForAPI(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${month}-${day}`;
}

// Function to get all working days between two dates
function getWorkingDays(startDate, endDate) {
  const workingDays = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDays;
}

// Function to send the POST request for each working day
async function sendPostRequests(workingDays) {
  const url = 'https://app.join-jump.com/api/expenses-api/v3/expenses';
  const requestBodyTemplate = {
    "additional_information": "{\"ik\":{\"vehicle_id\":\"41973bf1-59ec-4529-a7c7-fd778d17103a\",\"origin\":{\"id\":\"here:af:streetsection:wGm4107D3xrrKQrzPyEpQB:CggIBCCKgNKPARABGgMxNjk\",\"title\":\"France, 93200, Saint-Denis, 169 Boulevard Anatole France\",\"lat\":48.91915,\"lng\":2.34284},\"destination\":{\"id\":\"here:af:streetsection:0Mca03Xwb9ZZS.mz0jNU2C:CggIBCC-8bqZARABGgMxNTk\",\"title\":\"France, 92300, Levallois-Perret, 159 Rue Anatole France\",\"lat\":48.82062,\"lng\":2.23368},\"length\":12120,\"round_trip\":true,\"outward_date\":\"2024-MM-DDT00:00:00.000+02:00\",\"return_date\":\"2024-MM-DDT00:00:00.000+02:00\"}}",
    "amount": 1441,
    "amount_wo_vat": null,
    "attachments": [],
    "category": 30,
    "client": "e0f099e1-92ae-4a76-8308-8512f954f188",
    "date": "2024-MM-DDT00:00:00.000+01:00",
    "mission": "9e768864-8c2c-4806-ad7e-51f71810286f",
    "name": "COMMUTE",
    "rebillable": false
  };

  for (const workingDay of workingDays) {
    const formattedDate = formatDateForAPI(workingDay);
    const requestBody = JSON.stringify(requestBodyTemplate).replace(/MM-DD/g, formattedDate);

    try {
      const response = await axios.post(url, JSON.parse(requestBody), {
        headers: {
          Authorization: `Bearer ${config.USER_TOKEN}`,
          "x-jump-offer-id": 'eaf176c2-c23d-4685-abe1-90dd6d5dd8b4',
          "Content-Type": "application/json",
        }
      });
      console.log(`Request for ${formattedDate} successful:`, response.status);
    } catch (error) {
      console.error(`Error on request for ${formattedDate}:`, error.response ? error.response.data : error.message);
    }
  }
}

// Get the input dates from the command line arguments
const [firstDateString, secondDateString] = process.argv.slice(2);

// Parse the input dates
const startDate = parseDate(firstDateString);
const endDate = parseDate(secondDateString);

// Get the working days
const workingDays = getWorkingDays(startDate, endDate);

// Send the POST requests
sendPostRequests(workingDays);
