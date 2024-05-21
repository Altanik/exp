const fs = require("fs").promises; // Use the promise-based version of the fs module

const filename = "guests.json"; // Path to your JSON file

async function getRandomGuests(numGuestsRequested) {
  try {
    const data = await fs.readFile(filename, "utf8");
    const guests = JSON.parse(data);

    // Limit the number of guests requested to the size of the guests list
    const numGuests = Math.min(numGuestsRequested, guests.length);

    // Shuffle the array using Fisher-Yates shuffle
    for (let i = guests.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [guests[i], guests[j]] = [guests[j], guests[i]]; // Swap
    }

    // Get the first numGuests guests from the shuffled array
    const selectedGuests = guests.slice(0, numGuests);

    // Return the selected guests in the desired format
    return JSON.stringify({ guests: selectedGuests });
  } catch (err) {
    console.error("Error reading the file:", err);
  }
}

// Export the function
module.exports = getRandomGuests;
