// const convertDate = (datetime) => {
//   const date = new Date(datetime);

//   // Extract the month, day, and year
//   const month = date.getUTCMonth() + 1; // Months are 0-indexed
//   const day = date.getUTCDate();
//   const year = date.getUTCFullYear() % 100; // Get last two digits of the year

//   // Format the date as mm/d/yy
//   return `${month}/${day}/${year}`;
// };

// // Input datetime string
// const inputDatetime = "2023-12-05T06:54:33.598Z";

// // Convert and log the result
// const formattedDate = convertDate(inputDatetime);
// console.log(formattedDate); // Output: "12/19/24"

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log(await page.title());
  await browser.close();
})();

