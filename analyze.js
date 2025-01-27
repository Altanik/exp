const { format, parse } = require('date-fns');
const { isWeekend, eachDayOfInterval, parseISO } = require('date-fns');

// Function to calculate remaining working days
function getRemainingWorkingDays(startDate, endDate, expenses, excludeDays = []) {
  const formatStr = "dd.MM.yy";
  const expenseFormatStr = "dd/MM/y";
  const parseDate = (date, formatStr) => parse(date, formatStr, new Date());

  // Parse start and end dates
  const start = parseDate(startDate, formatStr);
  const end = parseDate(endDate, formatStr);

  // Parse expenses and exclusion days
  const expenseDates = new Set(expenses.map((e) => format(parseDate(e.date, expenseFormatStr), formatStr)));
  const excludedDates = new Set(excludeDays.map((d) => format(parseDate(d, formatStr), formatStr)));

  // Get all working days in the range
  const workingDays = eachDayOfInterval({ start, end })
    .filter((date) => !isWeekend(date))
    .map((date) => format(date, formatStr));

  // Filter out dates with expenses or excluded dates
  const remainingDays = workingDays.filter(
    (day) => !expenseDates.has(day) && !excludedDates.has(day)
  );

  return remainingDays
}

// Export the function
module.exports = { getRemainingWorkingDays };
