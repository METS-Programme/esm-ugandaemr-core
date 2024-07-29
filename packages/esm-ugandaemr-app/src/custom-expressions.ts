export function CalcMonthsOnART(artStartDate: Date, followupDate: Date) {
  let resultMonthsOnART: number;
  let artInDays = Math.round((followupDate.getTime() - artStartDate.getTime?.()) / 86400000);
  if (artStartDate && followupDate && artInDays < 30) {
    resultMonthsOnART = 0;
  } else if (artStartDate && followupDate && artInDays >= 30) {
    resultMonthsOnART = Math.floor(artInDays / 30);
  }

  return artStartDate && followupDate ? resultMonthsOnART : null;
}
