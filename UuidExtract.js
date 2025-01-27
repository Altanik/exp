const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

// Function to extract information
function extractInfoFromHtml(html) {
  const $ = cheerio.load(html);
  const results = [];

  // Find all relevant divs
  $('.jg').each((_, div) => {
    const element = $(div);

    // Extract modctx
    const modctxLink = element.find('a[href*="modctx"]');
    const modctx = modctxLink.attr('href')?.match(/modctx=([^&]+)/)?.[1];
    

    // Extract price
    const priceText = element.text();
    const priceMatch = priceText.match(/€[\d.,]+/);
    // const price = priceMatch ? priceMatch[0] : null;
    const price = priceMatch ? parseFloat(priceMatch[0].replace('€', '')) : null;

    if (modctx && price) {
      results.push({ modctx, price });
    }
  });

  return results;
}

// Sort data by price (descending order)
function sortByPriceDescending(data) {
    return data.sort((a, b) => b.price - a.price);
}
  
  // Calculate total price
function calculateTotalPrice(data) {
    return data.reduce((sum, item) => sum + item.price, 0).toFixed(2);
}
  

// Save results to JSON
function saveToJson(data, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Data saved to JSON file: ${filePath}`);
}

// Save results to CSV
function saveToCsv(data, filePath) {
  const csv = parse(data);
  fs.writeFileSync(filePath, csv, 'utf8');
  console.log(`Data saved to CSV file: ${filePath}`);
}

// Read the HTML file
const inputFile = 'uberEatsOldOrders.html'; // Replace with your file path
const outputJsonFile = 'output.json';
const outputCsvFile = 'output.csv';

fs.readFile(inputFile, 'utf8', (err, html) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Extract data
  const extractedData = extractInfoFromHtml(html);

  // Sort data by price descending
  const sortedData = sortByPriceDescending(extractedData);

  // Calculate total price
  const totalPrice = calculateTotalPrice(sortedData);

  // Display total price
  console.log(`Total Price: €${totalPrice}`);

  // Save to files
  saveToJson(sortedData, path.resolve(outputJsonFile));
  saveToCsv(sortedData, path.resolve(outputCsvFile));
});
