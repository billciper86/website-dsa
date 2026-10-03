# -*- coding: utf-8 -*-
# Bộ sinh test bài Máy in. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 833
NMAX = 2 * 10**5
V = 10**9


def make(m, t):
    return build(line(len(t), m), arr_line(t))


def tests(rng):
    yield 1, make(7, [3, 2, 5]), "ví dụ đề bài"
    yield 1, make(1, [1]), "n=1, m=1"
    yield 1, make(10**5, [1000]), "1 máy chậm, m lớn"
    yield 1, make(10**5, [1] * 1000), "toàn máy nhanh"
    yield 1, make(1, rand_arr(rng, 1000, 1, 1000)), "m=1 -> máy nhanh nhất"
    yield 1, make(10**5, [7] * 1000), "toàn bằng nhau"
    for _ in range(19):
        n = rng.randint(1, 1000)
        yield 1, make(rng.randint(1, 10**5), rand_arr(rng, n, 1, rng.choice([5, 1000]))), "ngẫu nhiên nhỏ"
    yield 2, make(V, [V]), "1 máy, đáp án 1e18"
    yield 2, make(V, [1] * NMAX), "nhiều máy nhanh: Σ T/t vượt long long (bẫy tràn)"
    yield 2, make(V, [1] * 1000 + [V] * 1000), "máy nhanh lẫn máy chậm"
    yield 2, make(V, [V] * NMAX), "toàn máy chậm"
    yield 2, make(1, rand_arr(rng, NMAX, 1, V)), "m=1"
    yield 2, make(V, [1, V]), "2 máy"
    for i in range(44):
        n = NMAX if i < 4 else rng.randint(1, 20000)
        lo = rng.choice([1, 1, 1000])
        yield 2, make(rng.randint(1, V), rand_arr(rng, n, lo, max(lo, rng.choice([10, 1000, V])))), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, m = v[0], v[1]
    check(1 <= n <= NMAX and len(v) == n + 2, f"n={n}")
    if sub == 1:
        check(n <= 1000 and 1 <= m <= 10**5, "n, m")
        check_range(v[2:], 1, 1000, "t_i")
    else:
        check(1 <= m <= V, "m")
        check_range(v[2:], 1, V, "t_i")
