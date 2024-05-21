function convertExpensesToDays(expenses, year, month) {
  return expenses
    .filter((expense) => {
      const [day, expMonth, expYear] = expense.date
        .split("/")
        .map((num) => parseInt(num, 10));
      return expYear === year && expMonth === month;
    })
    .map((expense) => parseInt(expense.date.split("/")[0], 10));
}

function getWorkingDays(year, month, expenses, daysToExclude = []) {
  const numberOfDays = new Date(year, month, 0).getDate();
  const expensesDaysToExclude = convertExpensesToDays(expenses, year, month);
  const workingDays = [];

  for (let day = 1; day <= numberOfDays; day++) {
    const currentDate = new Date(year, month - 1, day); // Les mois en JavaScript sont indexés à partir de 0
    const dayOfWeek = currentDate.getDay(); // Obtient le jour de la semaine, 0 pour Dimanche, 1 pour Lundi, etc.

    // Si ce n'est ni Samedi (6) ni Dimanche (0) et que le jour n'est pas dans la liste des jours à exclure
    if (
      dayOfWeek !== 0 &&
      dayOfWeek !== 6 &&
      !expensesDaysToExclude.includes(day) &&
      !daysToExclude.includes(day)
    ) {
      workingDays.push(currentDate.getDate());
    }
  }

  return workingDays;
}

// Export the function
module.exports = { getWorkingDays };
