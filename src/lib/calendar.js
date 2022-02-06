export const monthName = (month) => Intl.DateTimeFormat('en-US', {month: 'short'}).format(Date.UTC(2021, month, 1, 0, 0, 0));
