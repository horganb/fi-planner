import math

def f(t, x1, x2, x3, P1, P2, P3, C1, C2, C3, r1, r2, r3, c, j, s):
    lhs = (1 - x1) * (P1 * (1 + r1) ** t + (C1 * ((1 + r1) ** t - 1) / r1)) + \
           (1 - x2) * (P2 * (1 + r2) ** t + (C2 * ((1 + r2) ** t - 1) / r2)) + \
           (1 - x3) * (P3 * (1 + r3) ** t + (C3 * ((1 + r3) ** t - 1) / r3))
    rhs = (c * (j ** t)) / s
    return lhs - rhs

def f_prime(t, x1, x2, x3, P1, P2, P3, C1, C2, C3, r1, r2, r3, c, j, s):
    lhs_prime = (1 - x1) * (P1 * math.log(1 + r1) * (1 + r1) ** t + \
                            C1 * math.log(1 + r1) * (1 + r1) ** t / r1) + \
                (1 - x2) * (P2 * math.log(1 + r2) * (1 + r2) ** t + \
                            C2 * math.log(1 + r2) * (1 + r2) ** t / r2) + \
                (1 - x3) * (P3 * math.log(1 + r3) * (1 + r3) ** t + \
                            C3 * math.log(1 + r3) * (1 + r3) ** t / r3) - \
                (c * (j ** t) * math.log(j)) / s
    return lhs_prime

def newtons_method(x1, x2, x3, P1, P2, P3, C1, C2, C3, r1, r2, r3, c, j, s, t0, tolerance=1e-6, max_iterations=100):
    t = t0
    for _ in range(max_iterations):
        ft = f(t, x1, x2, x3, P1, P2, P3, C1, C2, C3, r1, r2, r3, c, j, s)
        f_prime_t = f_prime(t, x1, x2, x3, P1, P2, P3, C1, C2, C3, r1, r2, r3, c, j, s)
        if abs(f_prime_t) < 1e-10:  # avoid division by zero
            print(ft, f_prime_t)
            raise ValueError("Derivative is too small")
        t_next = t - ft / f_prime_t
        if abs(t_next - t) < tolerance:
            return t_next
        t = t_next
    raise ValueError("Newton's method did not converge")

# Example usage:
x1, x2, x3 = 0.1, 0.2, 0.2
P1, P2, P3 = 20000, 20000, 20000
C1, C2, C3 = 20000, 5000, 5000
r1, r2, r3 = 0.1, 0.1, 0.1
c, j, s = 70000, 1.03, 0.04
t0 = 20

t_solution = newtons_method(x1, x2, x3, P1, P2, P3, C1, C2, C3, r1, r2, r3, c, j, s, t0)
print(f"Estimated t: {t_solution}")
