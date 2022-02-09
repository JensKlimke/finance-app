export const parseNumberLocale = (code, number) => {
  if(code === 'de')
    return Number(number.replace('.', '').replace(',', '.'));
  else
    return Number(number);
}
