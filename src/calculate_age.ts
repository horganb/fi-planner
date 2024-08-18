export type Account = {
  taxRate: number;
  startingBalance: number;
  yearlyContribution: number;
  yearlyReturn: number;
};

const INFLATION_RATE = 0.0328;
const SAFE_WITHDRAWAL_RATE = 0.04;

export const netWorthOverTimeInflationAdjusted = (
  years: number,
  accounts: Account[]
) => {
  const amountWithInflation = accounts.reduce((total, account) => {
    const coeff = (1 + account.yearlyReturn) ** years;
    return (
      total +
      (account.startingBalance * coeff +
        (account.yearlyContribution * (coeff - 1)) / account.yearlyReturn)
    );
  }, 0);
  return amountWithInflation / (1 + INFLATION_RATE) ** years;
};

export const getYearsToRetire = (
  accounts: Account[],
  yearlySpending: number
) => {
  let t0 = 1;
  while (t0 < 100000) {
    t0 += 5;
    try {
      return newtons_method(
        accounts,
        yearlySpending,
        INFLATION_RATE,
        SAFE_WITHDRAWAL_RATE,
        t0
      );
    } catch {}
  }
  throw new Error("Could not get result");
};

const newtons_method = (
  accounts: Account[],
  yearlySpending: number,
  inflationRate: number,
  safeWithdrawalRate: number,
  yearsEstimate: number,
  tolerance = 1e-6,
  max_iterations = 100
) => {
  let t = yearsEstimate;
  for (let i = 0; i < max_iterations; i++) {
    const ft = f(
      t,
      accounts,
      yearlySpending,
      inflationRate,
      safeWithdrawalRate
    );
    const f_prime_t = f_prime(
      t,
      accounts,
      yearlySpending,
      inflationRate,
      safeWithdrawalRate
    );
    if (Math.abs(f_prime_t) < 1e-10) {
      // avoid division by zero
      throw new Error("Derivative is too small");
    }
    const t_next = t - ft / f_prime_t;
    if (Math.abs(t_next - t) < tolerance) {
      return t_next;
    }
    t = t_next;
  }
  throw new Error("Newton's method did not converge");
};

const f = (
  years: number,
  accounts: Account[],
  yearlySpending: number,
  inflationRate: number,
  safeWithdrawalRate: number
) => {
  const lhs = accounts
    .map((a) => f_partial(years, a))
    .reduce((partialSum, a) => partialSum + a, 0);
  const rhs =
    (yearlySpending * (1 + inflationRate) ** years) / safeWithdrawalRate;
  return lhs - rhs;
};

const f_partial = (years: number, account: Account) => {
  const coeff = (1 + account.yearlyReturn) ** years;
  return (
    (1 - account.taxRate) *
    (account.startingBalance * coeff +
      (account.yearlyContribution * (coeff - 1)) / account.yearlyReturn)
  );
};

const f_prime = (
  years: number,
  accounts: Account[],
  yearlySpending: number,
  inflationRate: number,
  safeWithdrawalRate: number
) => {
  const lhs_prime = accounts
    .map((a) => f_prime_partial(years, a))
    .reduce((partialSum, a) => partialSum + a, 0);
  const rhs_prime =
    (yearlySpending *
      (1 + inflationRate) ** years *
      Math.log(1 + inflationRate)) /
    safeWithdrawalRate;
  return lhs_prime - rhs_prime;
};

const f_prime_partial = (years: number, account: Account) => {
  const coeff =
    Math.log(1 + account.yearlyReturn) * (1 + account.yearlyReturn) ** years;
  return (
    (1 - account.taxRate) *
    (account.startingBalance * coeff +
      (account.yearlyContribution * coeff) / account.yearlyReturn)
  );
};
