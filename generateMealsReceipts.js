const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { format, parse } = require('date-fns');

// Function to generate receipts for remaining working days
async function generateReceipts(remainingDays) {
  const formatStr = "dd.MM.yy";
  const mealsReceiptsPath = path.join(__dirname, 'mealsReceiptsRefs.json');
  const templatesDir = path.join(__dirname, 'receiptsTemplates');
  const outputDir = path.join(__dirname, 'expenses', 'generated');

  // Load the mealsReceiptsRefs.json file
  const mealsReceipts = JSON.parse(fs.readFileSync(mealsReceiptsPath, 'utf8'));

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Launch Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set request interception only once
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['stylesheet', 'font', 'image'].includes(request.resourceType())) {
      request.continue();
    } else {
      request.abort();
    }
  });

  // Generate a receipt for each remaining day
  for (const day of remainingDays) {
    const randomReceipt = mealsReceipts[Math.floor(Math.random() * mealsReceipts.length)];
    const templateDir = randomReceipt.adjusted
      ? path.join(templatesDir, 'adjusted', `${randomReceipt.modctx}.html`)
      : path.join(templatesDir, 'completed', `${randomReceipt.modctx}.html`);

    // Read the template
    if (!fs.existsSync(templateDir)) {
      console.error(`Template not found: ${templateDir}`);
      continue;
    }

    let htmlContent = fs.readFileSync(templateDir, 'utf8');

    // Replace date placeholders
    const parsedDate = parse(day, formatStr, new Date());
    const formattedShortDate = format(parsedDate, 'M/d/yy');
    const fullDate = format(parsedDate, 'MMMM d, yyyy');

    htmlContent = htmlContent.replace(/MM\/DD\/YY/g, `${formattedShortDate}`);
    htmlContent = htmlContent.replace(/Month DD, YYYY/g, fullDate);

    // Set HTML content and generate PDF
    await page.setContent(htmlContent, { waitUntil: 'load' });
    const fileName = `M ${format(parsedDate, 'd.M.yy')} ${randomReceipt.price}.pdf`;
    const outputPath = path.join(outputDir, fileName);

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: false, // Ensure background styles are included
    });

    console.log(`Generated: ${outputPath}`);
  }

  // Remove event listeners and close Puppeteer
  page.removeAllListeners('request');
  await browser.close();
}

function getRandomTime() {
    const randomMinutes = Math.floor(Math.random() * (870 - 720 + 1)) + 720; // Random minutes between 12:00 PM and 2:30 PM
    const hours24 = Math.floor(randomMinutes / 60);
    const minutes = randomMinutes % 60;
    const hours12 = hours24 > 12 ? hours24 - 12 : hours24;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

module.exports = { generateReceipts };