const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Function to read the input JSON file
function readInputFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Function to make API call for each modctx
async function makeApiCall(modctx) {
  let data = JSON.stringify({
    "contentType": "WEB_HTML",
    "workflowUuid": modctx,
    "timestamp": null
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://www.ubereats.com/_p/api/getReceiptByWorkflowUuidV1?localeCode=fr-en',
    headers: { 
      'accept': '*/*', 
      'accept-language': 'en-US,en;q=0.9,fr;q=0.8,ar;q=0.7', 
      'content-type': 'application/json', 
      'cookie': 'dId=65783bcb-70a9-4742-a540-a82205ea7169; marketing_vistor_id=8eb9d74e-5550-4df5-a3db-4991683415a3; uev2.gdprAdsConsented=true; udi-id=IkvsJ76dsNjAo+OJyhgWzxxJZ9N1AVop6AXp84TK9mExzC1LgbbjCoPHOKzfeEZ3nZhMPSgvdCXgDfS7h8qHOc5rfjL+Do73UXLu1Z8rqN5mORD06Gg/dUJU1wJi6voyajtcTWjgb17o1ZD/VmplO0IqRvPPnQ0GOoI7XRTv2y9Ys6noHFjXHfIeaNgwA6wGKQUKwjP+6Un1INR2zS2kdw==523luY1sa0bNRHcWfbFK/A==BD3dYVj0B+3ErQVBf9t4zHt4jzL5fqdlawZ6J3JRwZ0=; uev2.gg=false; u-cookie-prefs=eyJ2ZXJzaW9uIjoxMDAsImRhdGUiOjE3Mzc4MTYxMTczNTYsImNvb2tpZUNhdGVnb3JpZXMiOlsiZXNzZW50aWFsIl0sImltcGxpY2l0IjpmYWxzZX0%3D; sid=QA.CAESEBr7WAuTyEYUvrZqM3QV4BwYuYryvQYiATEqJDk5YzMxODlmLWZkNTItNDliZC04NzM3LTdlMGY2ZGZiMDk3MzJAruSYiprBUeNuShVqCb6dIf3K4JeKhsX0clvaqKR8-E0fJ3fhnaUNKaYEVCEqgBetP6hlndichJ7qsbWn17xxXjoBMUINLnViZXJlYXRzLmNvbQ.idCSfunVnT49BPzyDbleXTvEhAukr80Hwpln3BNQPIQ; smeta={expiresAt:1740408121000}; uev2.loc=%7B%22address%22%3A%7B%22address1%22%3A%22169%20Bd%20Anatole%20France%22%2C%22address2%22%3A%22Saint-Denis%22%2C%22aptOrSuite%22%3A%22%22%2C%22eaterFormattedAddress%22%3A%22169%20Bd%20Anatole%20France%2C%2093200%20Saint-Denis%2C%20France%22%2C%22subtitle%22%3A%22Saint-Denis%22%2C%22title%22%3A%22169%20Bd%20Anatole%20France%22%2C%22uuid%22%3A%22%22%2C%22label%22%3A%22Home%22%7D%2C%22latitude%22%3A48.9192402%2C%22longitude%22%3A2.3430535%2C%22reference%22%3A%22ChIJk56T0sNu5kcRdaIks9nfMHM%22%2C%22referenceType%22%3A%22google_places%22%2C%22type%22%3A%22google_places%22%2C%22addressComponents%22%3A%7B%22city%22%3A%22Saint-Denis%22%2C%22countryCode%22%3A%22FR%22%2C%22firstLevelSubdivisionCode%22%3A%22%C3%8Ele-de-France%22%2C%22postalCode%22%3A%2293200%22%7D%2C%22categories%22%3A%5B%22address_point%22%5D%2C%22originType%22%3A%22user_autocomplete%22%7D; _cc=AUa%2FPhaotTvbZlLhRf9C6cVG; _cid_cc=AUa%2FPhaotTvbZlLhRf9C6cVG; udi-fingerprint=RANXdqQP352En65MKXlq8EPvv4TYrZsYpr84jo0sHA3Rytu65UxM2/3zHuCHz6q+9dnlVmegpjWVwRoK+c+IMQ==rd7I/+hA6hbl87zGcI4OXMlppPrx9WieGnm0g8HMBbo=; uev2.embed_theme_preference=dark; uev2.id.xp=315be595-8858-4f6b-a0e5-5d88484d4b89; _ua={"session_id":"db498126-a299-4296-a754-82f4c1d074d5","session_time_ms":1737820817391}; utag_main__sn=2; utm_medium=undefined; utm_source=undefined; _userUuid=undefined; uev2.id.session=0c98f183-855d-4e81-9ef6-3d7f0f57e2db; uev2.ts.session=1737827957398; jwt-session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNsYXRlLWV4cGlyZXMtYXQiOjE3Mzc4OTQ5MzI1NTV9LCJpYXQiOjE3Mzc4MTYxMDIsImV4cCI6MTczNzkwMjUwMn0.lkItjB2C76H5VEa_-0hEgCFB9n8LPJi5vJhb_be0Qmw', 
      'dnt': '1', 
      'origin': 'https://www.ubereats.com', 
      'priority': 'u=1, i', 
      'referer': 'https://www.ubereats.com/fr-en/orders?mod=orderReceipt&modctx=9ea9dbf7-1101-4def-81cc-5823b47487cc&ps=1', 
      'sec-ch-prefers-color-scheme': 'dark', 
      'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': '"Windows"', 
      'sec-fetch-dest': 'empty', 
      'sec-fetch-mode': 'cors', 
      'sec-fetch-site': 'same-origin', 
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36', 
      'x-csrf-token': 'x', 
      'x-uber-client-gitref': '60d60df191518c6c7d5c924e9403e776254b8fa6'
    },
    data : data
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error(`Error making API call for modctx ${modctx}:`, error.message);
    return null;
  }
}

// Function to modify dates in the HTML
function modifyDatesInHtml({receiptData, receiptsForJob}) {
    const regex = new RegExp('\\d{1,2}\/\\d{1,2}\/\\d{2} \\d{1,2}:\\d{2} (AM|PM)', 'g');
    console.log("regex", receiptData.match(regex));
    receiptData = receiptData.replace(regex, 'MM/DD/YY');
    const dateSentenceRegex = new RegExp(
        '(January|February|March|April|May|June|July|August|September|October|November|December) \\d{1,2}, 202(3|4|5)',
        'g'
        );
    console.log("dateSentenceRegex", receiptData.match(dateSentenceRegex));
    receiptData = receiptData.replace(dateSentenceRegex, 'Month DD, YYYY');
    const isAdjusted = receiptsForJob.some(receipt => receipt.type === 'ADJUSTED');
    return {receiptData, isAdjusted};
}

// Function to save modified HTML to a file
function saveHtmlToFile(modctx, html, isAdjusted) {
    const folderName = isAdjusted ? 'adjusted' : 'completed';
    const outputPath = path.join(__dirname, 'receiptsTemplates', folderName, `${modctx}.html`);
    
    // Ensure the target directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Write the file
    fs.writeFileSync(outputPath, html, 'utf8');
}  

async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to process the input file and make API calls
async function processModctxFile() {
  const inputFilePath = path.join(__dirname, 'output.json');
  const data = readInputFile(inputFilePath);

  for (const item of data) {
    const { modctx, price } = item;
    const apiResponse = await makeApiCall(modctx);
    // console.log(apiResponse);
    
    if ( apiResponse?.data?.receiptData && apiResponse.data.receiptsForJob) {
      const { receiptData, isAdjusted } = modifyDatesInHtml(apiResponse.data);
      saveHtmlToFile(modctx, receiptData, isAdjusted);
      console.log(`Modified HTML for modctx ${modctx} saved.`);
    }

    await sleep(1000);
  }
}

// Execute the main function
processModctxFile();