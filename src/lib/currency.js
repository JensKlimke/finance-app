export const currency = {
  to: (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(amount),
  toShort: (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0}).format(amount),
}
