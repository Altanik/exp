const fs = require("fs");
const path = require("path");
const axios = require("axios");
const config = require("./config.json");
const FormData = require("form-data");

async function uploadFileAsBase64(filePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), {
    filename: path.basename(filePath),
    contentType: "application/pdf", // Adjust based on your file type
  });
  form.append("type", "receipt");

  try {
    const response = await axios.post(
      "https://app.join-jump.com/api/expenses-api/v3/attachments",
      form,
      {
        headers: {
          Authorization: `Bearer ${config.USER_TOKEN}`,
          "x-jump-offer-id": 'eaf176c2-c23d-4685-abe1-90dd6d5dd8b4', 
          ...form.getHeaders(),
        },
      }
    );

    if (response.status === 200) {
      console.log("File uploaded successfully:", filePath);
      console.log("File Id:", response.data.id);
      return response.data.id;
    }
    throw new Error(
      `Failed to upload file. Status: ${response.status}, StatusText: ${response.statusText}`
    );
  } catch (error) {
    console.error(
      "Error during file upload:",
      filePath,
      "; Error:",
      error.message || error
    );
    return null; // Return null to indicate failure, maintaining the expectation of the calling function
  }
}

module.exports = uploadFileAsBase64;
