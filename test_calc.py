'''
PROMPT:

"In the equation 
(1-x_1)(P_1(1+r_1)^t+C_1((1+r_1)^t-1)/r_1) + (1-x_2)(P_2(1+r_2)^t+C_2((1+r_2)^t-1)/r_2) + (1-x_3)(P_3(1+r_3)^t+C_3((1+r_3)^t-1)/r_3) = cj^t/s
how would i solve for t using newton's method"

then I did some tidying
'''

import math

class Account:
    taxRate: float
    startingBalance: float
    yearlyContribution: float
    yearlyReturn: float


def f_partial(years, account: Account):
    return (1 - account.taxRate) * (account.startingBalance * (1 + account.yearlyReturn) ** years + (account.yearlyContribution * ((1 + account.yearlyReturn) ** years - 1) / account.yearlyReturn))

def f(years, accounts: list[Account], yearlySpending, inflationRate, safeWithdrawalRate):
    lhs = sum(f_partial(years, account) for account in accounts)
    rhs = (yearlySpending * ((1 + inflationRate) ** years)) / safeWithdrawalRate
    return lhs - rhs

def f_prime_partial(years, account: Account):
    return (1 - account.taxRate) * (account.startingBalance * math.log(1 + account.yearlyReturn) * (1 + account.yearlyReturn) ** years + account.yearlyContribution * math.log(1 + account.yearlyReturn) * (1 + account.yearlyReturn) ** years / account.yearlyReturn)

def f_prime(years, accounts: list[Account], yearlySpending, inflationRate, safeWithdrawalRate):
    lhs_prime = sum(f_prime_partial(years, account) for account in accounts)
    rhs_prime = (yearlySpending * ((1 +inflationRate) ** years) * math.log(1 + inflationRate)) / safeWithdrawalRate
    return lhs_prime - rhs_prime

def newtons_method(accounts: list[Account], yearlySpending, inflationRate, safeWithdrawalRate, yearsEstimate, tolerance=1e-6, max_iterations=100):
    t = yearsEstimate
    for _ in range(max_iterations):
        ft = f(t, accounts, yearlySpending, inflationRate, safeWithdrawalRate)
        f_prime_t = f_prime(t, accounts, yearlySpending, inflationRate, safeWithdrawalRate)
        if abs(f_prime_t) < 1e-10:  # avoid division by zero
            print(ft, f_prime_t)
            raise ValueError("Derivative is too small")
        t_next = t - ft / f_prime_t
        if abs(t_next - t) < tolerance:
            return t_next
        t = t_next
    raise ValueError("Newton's method did not converge")

def newtons_method_with_several_guesses(accounts: list[Account], yearlySpending, inflationRate, safeWithdrawalRate):
    t0 = 1
    while t0 < 100000:
        t0 += 5
        try:
            return newtons_method(accounts, yearlySpending, inflationRate, safeWithdrawalRate, t0)
        except (ValueError, ZeroDivisionError):
            pass
    raise ValueError("Could not get result")

# Example usage:
account1 = Account()
account1.taxRate = 0.25
account1.startingBalance = 50000
account1.yearlyContribution = 5000
account1.yearlyReturn = 0.1

t_solution = newtons_method_with_several_guesses([account1], 40000, 0.0328, 0.04)
print(f"Estimated t: {t_solution}")
