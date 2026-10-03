# -*- coding: utf-8 -*-
# Bộ sinh test bài Đoạn con tổng lớn nhất. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 1211
NMAX = 2 * 10**5
V = 10**9


def make(a):
    return build(str(len(a)), arr_line(a))


def rand_a(rng, n):
    lo, hi = rng.choice([(-V, V), (-10, 10), (-V, V // 3), (-5, 3), (-V, -1)])
    return rand_arr(rng, n, lo, hi)


def tests(rng):
    yield 1, make([-2, 1, -3, 4, -1, 2, 1, -5]), "ví dụ đề bài"
    yield 1, make([-7]), "n=1, số âm"
    yield 1, make([5]), "n=1"
    yield 1, make(rand_arr(rng, 1000, -V, -1)), "toàn số âm (bẫy đoạn rỗng)"
    yield 1, make([V] * 1000), "toàn 1e9 -> 1e12"
    yield 1, make([0] * 1000), "toàn 0"
    yield 1, make([-1, -1, -1] * 333), "toàn -1"
    for _ in range(18):
        yield 1, make(rand_a(rng, rng.randint(1, 1000))), "ngẫu nhiên nhỏ"
    yield 2, make([V] * NMAX), "tổng 2e14"
    yield 2, make([-V] * NMAX), "toàn -1e9"
    yield 2, make([V, -V + 1] * (NMAX // 2)), "xen kẽ"
    for i in range(43):
        n = NMAX if i < 4 else rng.randint(1, 20000)
        yield 2, make(rand_a(rng, n)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n = v[0]
    check(1 <= n <= (1000 if sub == 1 else NMAX) and len(v) == n + 1, f"n={n}")
    check_range(v[1:], -V, V, "a_i")
