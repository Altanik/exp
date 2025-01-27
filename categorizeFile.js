// categorizeFile.js

// The categorizeFile function now also takes expenses as arguments
function categorizeFile(fileName, expenses) {
  // Détermine le type de dépense basé sur le préfixe du nom de fichier
  const expenseType = fileName[0];
  const regex =
    expenseType === "G"
      ? /^G\s(\d+)\.(\d+)\.(\d+)\s([\d.]+)\s(\d+)/
      : /\s(\d+)\.(\d+)\.(\d+)\s([\d.]+)/;
  const match = fileName.match(regex);

  if (match) {
    const day = match[1];
    const month = match[2];
    const year = match[3];
    const amount = parseFloat(match[4]);
    const date = `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    const nbPersons = expenseType === "G" ? parseInt(match[5], 10) : null;

    let expense = expenses.find(
      (e) => e.date === date && e.type === expenseType
    );
  
    if (!expense) {
      expense = { date, files: [], amount, type: expenseType };
      if (nbPersons) expense.nbPersons = nbPersons;
      expenses.push(expense);
    } else if (expenseType !== 'M') {
      expense.amount += amount;
      expense.amount = parseFloat(expense.amount.toFixed(2));
    }
    expense.files.push(fileName);
  } else {
    console.warn(`File name does not match expected format: ${fileName}`);
  }
}

module.exports = categorizeFile;
