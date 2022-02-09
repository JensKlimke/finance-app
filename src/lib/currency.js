export const currency = {
  to: (amount, n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: (n !== undefined ? n : 2)}).format(amount),
}
