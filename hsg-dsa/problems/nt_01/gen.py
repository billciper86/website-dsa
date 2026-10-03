# -*- coding: utf-8 -*-
# Bộ sinh test bài ƯCLN và BCNN. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1011
E18 = 10**18


def make(ps):
    return build(str(len(ps)), *[line(a, b) for a, b in ps])


def pair(rng, mx):
    """Cặp (a, b) <= mx có BCNN <= 1e18, thường có ước chung lớn."""
    lim = min(mx, E18)
    g = rng.randint(1, max(1, int(lim ** rng.choice([0.2, 0.4, 0.6]))))
    rest = lim // g                              # cần x * y <= rest để g*x*y <= 1e18
    x = rng.randint(1, max(1, math.isqrt(rest)))
    y = rng.randint(1, max(1, rest // x))
    a, b = g * x, g * y
    if rng.random() < 0.5:
        a, b = b, a
    return a, b          # a, b <= g*x*y <= lim và BCNN <= g*x*y <= 1e18


def tests(rng):
    yield 1, make([(12, 18), (7, 5), (6, 6)]), "ví dụ đề bài"
    yield 1, make([(1, 1)]), "a=b=1"
    yield 1, make([(1, 10**4), (10**4, 1)]), "một số bằng 1"
    yield 1, make([(9973, 9967), (10**4, 10**4), (8192, 4096)]), "nguyên tố lớn, bằng nhau, lũy thừa 2"
    for _ in range(22):
        yield 1, make([pair(rng, 10**4) for _ in range(rng.randint(1, 100))]), "ngẫu nhiên nhỏ"
    yield 2, make([(10**9, 10**9 - 1)] * 1000), "BCNN ~1e18, nguyên tố cùng nhau"
    yield 2, make([(999999937, 999999929)] * 10**5), "T=1e5, hai số nguyên tố lớn -> bắt lời giải trâu"
    yield 2, make([(10**9, 10**9)]), "bằng nhau"
    for i in range(20):
        T = 10**5 if i < 2 else rng.randint(1, 10**4)
        yield 2, make([pair(rng, 10**9) for _ in range(T)]), "ngẫu nhiên vừa"
    yield 3, make([(E18, E18)]), "a=b=1e18 (a*b tràn)"
    yield 3, make([(E18, 1), (1, E18)]), "1 và 1e18"
    yield 3, make([(2 * 10**17, 5 * 10**17), (10**18, 5 * 10**17)]), "ước chung lớn, a*b tràn"
    yield 3, make([(999999999989 * 2, 999999999989 * 3)]), "ƯCLN là số nguyên tố lớn, a*b ~6e24 tràn"
    for i in range(22):
        T = 10**5 if i < 2 else rng.randint(1, 10**4)
        yield 3, make([pair(rng, E18) for _ in range(T)]), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    T = v[0]
    check(1 <= T <= (100 if sub == 1 else 10**5) and len(v) == 2 * T + 1, f"T={T}")
    mx = {1: 10**4, 2: 10**9, 3: E18}[sub]
    for i in range(T):
        a, b = v[1 + 2 * i], v[2 + 2 * i]
        check(1 <= a <= mx and 1 <= b <= mx, f"a={a} b={b}")
        check(a // math.gcd(a, b) * b <= E18, "BCNN > 1e18")
