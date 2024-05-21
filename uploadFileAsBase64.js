const fs = require("fs");
const path = require("path");
const axios = require("axios");
const config = require("./config.json");
const FormData = require("form-data");

async function uploadFileAsBase64(filePath) {
  const form = new FormData();
  form.append("type", "receipt");
  form.append("file", fs.createReadStream(filePath), path.basename(filePath));

  try {
    const response = await axios.post(
      "https://app.join-jump.com/api/expenses-api/v1/attachments",
      form,
      {
        headers: {
          Authorization: `Bearer ${config.USER_TOKEN}`,
          ...form.getHeaders(),
        },
      }
    );

    if (response.status === 200) {
      console.log("File uploaded successfully:", filePath);
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
