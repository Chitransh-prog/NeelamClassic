/**
 * Converts a numeric amount to Indian currency words format (Rupees ... Only)
 * Example: 25400 -> "Twenty Five Thousand Four Hundred Rupees Only"
 */
export function numberToIndianWords(amount: number): string {
  if (amount === 0) return "Zero Rupees Only";

  const singleDigits = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertTwoDigits(n: number): string {
    if (n < 10) return singleDigits[n];
    if (n < 20) return teens[n - 10];
    const unit = n % 10;
    const ten = Math.floor(n / 10);
    return tens[ten] + (unit > 0 ? " " + singleDigits[unit] : "");
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    let res = "";
    if (hundred > 0) {
      res += singleDigits[hundred] + " Hundred";
      if (remainder > 0) res += " and ";
    }
    if (remainder > 0) {
      res += convertTwoDigits(remainder);
    }
    return res;
  }

  const rounded = Math.round(Math.abs(amount));
  let remaining = rounded;

  const crore = Math.floor(remaining / 10000000);
  remaining %= 10000000;

  const lakh = Math.floor(remaining / 100000);
  remaining %= 100000;

  const thousand = Math.floor(remaining / 1000);
  remaining %= 1000;

  const hundredPart = remaining;

  const parts: string[] = [];

  if (crore > 0) parts.push(convertTwoDigits(crore) + " Crore");
  if (lakh > 0) parts.push(convertTwoDigits(lakh) + " Lakh");
  if (thousand > 0) parts.push(convertTwoDigits(thousand) + " Thousand");
  if (hundredPart > 0) parts.push(convertThreeDigits(hundredPart));

  return parts.join(" ") + " Rupees Only";
}
