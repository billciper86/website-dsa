# -*- coding: utf-8 -*-
# Bộ sinh test bài Cửa sổ k ngày. Mỗi phần tử: (subtask, input, ghi chú)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from genlib import *

SEED = 922
NMAX = 2 * 10**5
V = 10**9


def make(k, a):
    return build(line(len(a), k), arr_line(a))


def tests(rng):
    yield 1, make(3, [2, -1, 4, -2, 5, 1]), "ví dụ đề bài"
    yield 1, make(1, [-7]), "n=1, số âm"
    yield 1, make(1, [5]), "n=1"
    yield 1, make(3, rand_arr(rng, 5000, -V, -1)), "toàn số âm (bẫy khởi tạo 0)"
    yield 1, make(5000, [V] * 5000), "k = n, tổng 5e12"
    yield 1, make(2500, [-V] * 5000), "toàn -1e9"
    yield 1, make(1, rand_arr(rng, 5000, -V, V)), "k=1 -> phần tử lớn nhất"
    for _ in range(18):
        n = rng.randint(1, 5000)
        lo = rng.choice([-V, -10, 0, -V])
        hi = rng.choice([V, 10, -1]) if lo < 0 else V
        yield 1, make(rng.randint(1, n), rand_arr(rng, n, lo, max(lo, hi))), "ngẫu nhiên nhỏ"
    yield 2, make(NMAX // 2, rand_arr(rng, NMAX, -V, V)), "k = n/2 -> bắt O(n*k)"
    yield 2, make(NMAX, [V] * NMAX), "k = n, tổng 2e14"
    yield 2, make(1000, rand_arr(rng, NMAX, -V, -1)), "toàn số âm, n lớn"
    for i in range(43):
        n = NMAX if i < 4 else rng.randint(1, 20000)
        lo = rng.choice([-V, -100])
        hi = rng.choice([V, 100, -1])
        yield 2, make(rng.randint(1, n), rand_arr(rng, n, lo, hi)), "ngẫu nhiên lớn"


def validate(inp, sub):
    v = ints(inp)
    n, k = v[0], v[1]
    check(1 <= k <= n <= (5000 if sub == 1 else NMAX) and len(v) == n + 2, f"n={n} k={k}")
    check_range(v[2:], -V, V, "a_i")
