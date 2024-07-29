export function CalcMonthsOnART(artStartDate: Date, followupDate: Date) {
  let resultMonthsOnART: string;
  let artInDays = Math.round((followupDate.getTime() - artStartDate.getTime?.()) / 86400000);
  if (artStartDate && followupDate && artInDays < 30) {
    resultMonthsOnART = '0 months';
  } else if (artStartDate && followupDate && artInDays >= 30) {
    resultMonthsOnART = `${Math.floor(artInDays / 30)} months`;
  }
  console.log('myCustom', resultMonthsOnART);
  return artStartDate && followupDate ? resultMonthsOnART : null;
}
