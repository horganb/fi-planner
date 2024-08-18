const TAX_BRACKETS = [
  { maxAmount: 11600, rate: 0.1 },
  { maxAmount: 47150, rate: 0.12 },
  { maxAmount: 100525, rate: 0.22 },
  { maxAmount: 191950, rate: 0.24 },
  { maxAmount: 243725, rate: 0.32 },
  { maxAmount: 609350, rate: 0.35 },
  { maxAmount: 0, rate: 0.37 },
];

export const getPreTaxAmount = (afterTaxAmount: number) => {
  return TAX_BRACKETS.reduce((totalCount, bracket, i) => {
    const minAmount = i === 0 ? 0 : TAX_BRACKETS[i - 1].maxAmount;
    const amountForBracket =
      Math.min(afterTaxAmount, bracket.maxAmount || afterTaxAmount) - minAmount;
    return totalCount + Math.max(0, amountForBracket / (1 - bracket.rate));
  }, 0);
};

export const getAfterTaxAmount = (preTaxAmount: number) => {
  return TAX_BRACKETS.reduce((totalCount, bracket, i) => {
    const minAmount = i === 0 ? 0 : TAX_BRACKETS[i - 1].maxAmount;
    const amountForBracket =
      Math.min(preTaxAmount, bracket.maxAmount || preTaxAmount) - minAmount;
    return totalCount + Math.max(0, amountForBracket * (1 - bracket.rate));
  }, 0);
};
