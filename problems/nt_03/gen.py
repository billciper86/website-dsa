# -*- coding: utf-8 -*-
# Bộ sinh test bài Lũy thừa modulo. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1033
M = 10**9 + 7
E18 = 10**18


def make(ps):
    return build(str(len(ps)), *[line(a, b) for a, b in ps])


def tests(rng):
    yield 3, make([(2, 10), (3, 0), (M, 5)]), "ví dụ đề bài"
    yield 1, make([(2, 10), (3, 0), (10**9, 5)]), "giống ví dụ, a <= 1e9"
    yield 1, make([(0, 0), (0, 5), (1, 1000), (0, 1)]), "0^0 = 1, 0^b = 0"
    yield 1, make([(10**9, 1000), (2, 1000), (10**9 - 1, 999)]), "giá trị biên"
    for _ in range(22):
        yield 1, make([(rng.randint(0, 10**9), rng.randint(0, 1000)) for _ in range(rng.randint(1, 100))]), "ngẫu nhiên nhỏ"
    yield 2, make([(2, E18)] * 10**5), "b = 1e18 -> bắt lời giải nhân b lần"
    yield 2, make([(10**9, E18 - 1), (10**9 - 7, E18), (0, E18), (1, E18)]), "b lớn, a biên"
    for i in range(20):
        T = 10**5 if i < 2 else rng.randint(1, 10**4)
        yield 2, make([(rng.randint(0, 10**9), rng.randint(0, E18)) for _ in range(T)]), "ngẫu nhiên vừa"
    yield 3, make([(E18, E18), (E18, 2), (E18 - 1, 3)]), "a = 1e18 (a*a tràn nếu không mod trước)"
    yield 3, make([(M * 999999, 7), (M, 0), (M * 3 + 1, E18)]), "a là bội của M"
    yield 3, make([(4 * 10**17, 2)] * 1000), "a lớn, b nhỏ"
    for i in range(22):
        T = 10**5 if i < 2 else rng.randint(1, 10**4)
        yield 3, make([(rng.randint(0, E18), rng.randint(0, E18)) for _ in range(T)]), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    T = v[0]
    check(1 <= T <= (100 if sub == 1 else 10**5) and len(v) == 2 * T + 1, f"T={T}")
    amax = 10**9 if sub <= 2 else E18
    bmax = 1000 if sub == 1 else E18
    for i in range(T):
        a, b = v[1 + 2 * i], v[2 + 2 * i]
        check(0 <= a <= amax and 0 <= b <= bmax, f"a={a} b={b}")
