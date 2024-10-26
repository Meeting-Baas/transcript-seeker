import { format, parseISO, isSameMonth, isSameYear } from 'date-fns'

// Utility function to format month
const getMonthFormat = (date, locale) => format(date, 'MMMM', { locale })

// Utility function to format year
const getYearFormat = (date, locale) => format(date, 'yyyy', { locale })

// Main function to get the month and year range
export const getMonthAndYearForDateRange = (date, rangeStart, rangeEnd, locale) => {
  const startDate = parseISO(rangeStart);
  const endDate = parseISO(rangeEnd);

  // Get formatted month and year for start and end dates
  const startMonth = getMonthFormat(startDate, locale);
  const startYear = getYearFormat(startDate, locale);
  const endMonth = getMonthFormat(endDate, locale);
  const endYear = getYearFormat(endDate, locale);

  // Determine output format based on month and year similarity
  if (isSameMonth(startDate, endDate)) {
    return `${startMonth} ${startYear}`;
  } else if (isSameYear(startDate, endDate)) {
    return `${startMonth} – ${endMonth} ${startYear}`;
  } else {
    return `${startMonth} ${startYear} – ${endMonth} ${endYear}`;
  }
}